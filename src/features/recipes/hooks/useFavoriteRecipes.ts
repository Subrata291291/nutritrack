import { useState, useEffect, useCallback } from 'react';
import { recipesService } from '@services/recipes.service';
import type { Recipe } from 'types/recipe';

export function useFavoriteRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCounter, setRetryCounter] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function fetchFavorites() {
      try {
        if (!cancelled) setLoading(true);
        const data = await recipesService.getFavoriteRecipes();
        if (!cancelled) {
          setRecipes(data);
          setError(false);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchFavorites();
    return () => { cancelled = true; };
  }, [retryCounter]);

  const retry = useCallback(() => {
    setError(false);
    setLoading(true);
    setRetryCounter((c) => c + 1);
  }, []);

  return { recipes, loading, error, retry };
}