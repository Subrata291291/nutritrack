import { useState, useEffect, useCallback } from 'react';
import { recipesService } from '@services/recipes.service';
import type { Recipe } from 'types/recipe';

interface UseRecipesParams {
  search?: string;
  category?: string;
  page?: number;
  perPage?: number;
}

export function useRecipes({ search, category, page = 1, perPage = 20 }: UseRecipesParams) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCounter, setRetryCounter] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function fetchRecipes() {
      try {
        if (!cancelled) setLoading(true);
        const params: Record<string, string | number> = { page, per_page: perPage };
        if (category) params.category = category;
        if (search) params.search = search;
        const result = await recipesService.getRecipes(params);
        if (!cancelled) {
          setRecipes(result.recipes);
          setTotal(result.total);
          setError(false);
        }
      } catch {
        if (!cancelled) { setRecipes([]); setTotal(0); setError(true); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchRecipes();
    return () => { cancelled = true; };
  }, [search, category, page, perPage, retryCounter]);

  const retry = useCallback(() => {
    setError(false);
    setLoading(true);
    setRetryCounter((c) => c + 1);
  }, []);

  return { recipes, total, loading, error, retry };
}