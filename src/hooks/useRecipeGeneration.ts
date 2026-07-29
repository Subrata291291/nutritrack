import { useState, useCallback, useRef, useEffect } from 'react';
import { aiRecipesService, type GenerationJob } from '@services/ai-recipes.service';
import { config } from '@config/index';

interface UseRecipeGenerationReturn {
  job: GenerationJob | null;
  isGenerating: boolean;
  triggerGeneration: () => Promise<void>;
  regenerate: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const STORAGE_KEY = 'recipe_generation_job_id';

function loadJobId(): number | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? parseInt(raw, 10) || null : null;
  } catch {
    return null;
  }
}

function saveJobId(id: number | null) {
  try {
    if (id) localStorage.setItem(STORAGE_KEY, String(id));
    else localStorage.removeItem(STORAGE_KEY);
  } catch { /* noop */ }
}

export function useRecipeGeneration(): UseRecipeGenerationReturn {
  const [job, setJob] = useState<GenerationJob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopPolling = useCallback(() => {
    if (pollingRef.current !== null) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const startPolling = useCallback((jobId: number) => {
    stopPolling();
    pollingRef.current = setInterval(async () => {
      try {
        const updated = await aiRecipesService.getGenerationStatus(jobId);
        setJob(updated);
        if (updated.status === 'completed' || updated.status === 'failed') {
          stopPolling();
          if (updated.status === 'completed') {
            saveJobId(null);
          }
        }
      } catch {
        stopPolling();
        setError('Failed to check generation status.');
      }
    }, config.ai.pollInterval);
  }, [stopPolling]);

  useEffect(() => {
    return () => stopPolling();
  }, [stopPolling]);

  useEffect(() => {
    const savedJobId = loadJobId();
    if (savedJobId) {
      aiRecipesService.getGenerationStatus(savedJobId)
        .then((existing) => {
          setJob(existing);
          if (existing.status === 'pending' || existing.status === 'processing') {
            startPolling(savedJobId);
          } else {
            saveJobId(null);
          }
        })
        .catch(() => saveJobId(null));
    }
  }, [startPolling]);

  const triggerGeneration = useCallback(async () => {
    setError(null);
    try {
      const { jobId } = await aiRecipesService.triggerGeneration();
      saveJobId(jobId);
      const started = await aiRecipesService.getGenerationStatus(jobId);
      setJob(started);
      startPolling(jobId);
    } catch {
      setError('Failed to start recipe generation.');
    }
  }, [startPolling]);

  const regenerate = useCallback(async () => {
    setError(null);
    try {
      const { jobId } = await aiRecipesService.regenerate();
      saveJobId(jobId);
      const started = await aiRecipesService.getGenerationStatus(jobId);
      setJob(started);
      startPolling(jobId);
    } catch {
      setError('Failed to regenerate recipes.');
    }
  }, [startPolling]);

  const clearError = useCallback(() => setError(null), []);

  const isGenerating = job !== null && (job.status === 'pending' || job.status === 'processing');

  return { job, isGenerating, triggerGeneration, regenerate, error, clearError };
}
