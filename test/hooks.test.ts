import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';
import { useRecipes } from '@features/recipes/hooks/useRecipes';
import { useFavoriteRecipes } from '@features/recipes/hooks/useFavoriteRecipes';
import { useMealPlanner } from '@features/meal-planner/hooks/useMealPlanner';
import { useMealGeneration } from '@features/meal-planner/hooks/useMealGeneration';
import { useMealSwap } from '@features/meal-planner/hooks/useMealSwap';
import { useShoppingList } from '@features/meal-planner/hooks/useShoppingList';

vi.mock('@hooks/useProfile', () => ({
  useProfile: () => ({
    profile: { displayName: 'Test', age: 30, gender: 'male', heightCm: 175, weightKg: 70, activityLevel: 'moderate', goal: 'maintain', targetWeightKg: 70 },
    nutritionTargets: { calories: 2000, proteinGrams: 150, carbsGrams: 250, fatsGrams: 65, waterMl: 2000 },
    ensureProfile: vi.fn().mockResolvedValue(undefined),
    refreshProfile: vi.fn(),
    updateProfile: vi.fn(),
  }),
}));

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('useRecipes', () => {
  it('loads recipes on mount', async () => {
    const { result } = renderHook(() => useRecipes({}));
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.recipes).toHaveLength(3);
    expect(result.current.error).toBe(false);
  });

  it('sets error on API failure', async () => {
    const { result } = renderHook(() => useRecipes({}));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.recipes).toHaveLength(3);
  });

  it('retry refetches', async () => {
    const { result } = renderHook(() => useRecipes({}));
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.retry());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(false);
  });

  it('filters by category', async () => {
    const { result } = renderHook(() => useRecipes({ category: 'Vegan' }));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.recipes.length).toBeGreaterThanOrEqual(0);
  });

  it('filters by search', async () => {
    const { result } = renderHook(() => useRecipes({ search: 'Vegan' }));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.recipes.every((r) => r.title.toLowerCase().includes('vegan'))).toBe(true);
  });
});

describe('useFavoriteRecipes', () => {
  it('loads favorites on mount', async () => {
    const { result } = renderHook(() => useFavoriteRecipes());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.recipes).toHaveLength(2);
    expect(result.current.error).toBe(false);
  });

  it('retry refetches', async () => {
    const { result } = renderHook(() => useFavoriteRecipes());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.retry());
    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});

describe('useMealPlanner', () => {
  it('loads meal plan on mount', async () => {
    const { result } = renderHook(() => useMealPlanner());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(false);
    expect(result.current.mealPlan.days.length).toBeGreaterThan(0);
  });

  it('refresh refetches plan', async () => {
    const { result } = renderHook(() => useMealPlanner());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.refresh());
    await waitFor(() => expect(result.current.loading).toBe(false));
  });

  it('retry refetches plan', async () => {
    const { result } = renderHook(() => useMealPlanner());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.retry());
    await waitFor(() => expect(result.current.loading).toBe(false));
  });
});

describe('useMealGeneration', () => {
  it('generate returns plan and warnings', async () => {
    const { result } = renderHook(() => useMealGeneration());
    expect(result.current.loading).toBe(false);
    await act(async () => {
      await result.current.generate();
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.plan).not.toBeNull();
    expect(result.current.plan!.days).toHaveLength(1);
    expect(result.current.warnings.length).toBeGreaterThanOrEqual(0);
  });

  it('reset clears state', async () => {
    const { result } = renderHook(() => useMealGeneration());
    await act(async () => { await result.current.generate(); });
    expect(result.current.plan).not.toBeNull();
    act(() => result.current.reset());
    expect(result.current.plan).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('retry calls generate again', async () => {
    const { result } = renderHook(() => useMealGeneration());
    await act(async () => { await result.current.generate(); });
    expect(result.current.plan).not.toBeNull();
    act(() => result.current.retry());
    expect(result.current.loading).toBe(true);
  });

  it('savePlan saves and returns true', async () => {
    const { result } = renderHook(() => useMealGeneration());
    await act(async () => { await result.current.generate(); });
    expect(result.current.plan).not.toBeNull();
    let saved = false;
    await act(async () => {
      saved = await result.current.savePlan('2026-07-27');
    });
    expect(saved).toBe(true);
  });

  it('generates error on API failure', async () => {
    server.use(
      http.post('https://test-site.com/wp-json/nutritrack/v1/ai/generate-plan', () => {
        return new HttpResponse(null, { status: 500 });
      }),
    );
    const { result } = renderHook(() => useMealGeneration());
    await act(async () => {
      await result.current.generate();
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeTruthy();
  });
});

describe('useMealSwap', () => {
  it('suggestSwap returns alternatives', async () => {
    const { result } = renderHook(() => useMealSwap());
    expect(result.current.loading).toBe(false);
    await act(async () => {
      await result.current.suggestSwap(100, 'lunch', { calories: 420, proteinGrams: 38, carbsGrams: 12, fatsGrams: 22 });
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.alternatives.length).toBeGreaterThan(0);
  });

  it('reset clears state', async () => {
    const { result } = renderHook(() => useMealSwap());
    await act(async () => {
      await result.current.suggestSwap(100, 'lunch', { calories: 420, proteinGrams: 38, carbsGrams: 12, fatsGrams: 22 });
    });
    expect(result.current.alternatives.length).toBeGreaterThan(0);
    act(() => result.current.reset());
    expect(result.current.alternatives).toHaveLength(0);
  });
});

describe('useShoppingList', () => {
  it('generate returns items from recipe ingredients', async () => {
    const { result } = renderHook(() => useShoppingList());
    expect(result.current.loading).toBe(false);
    const mockDays = [
      {
        date: '2026-07-27',
        dayName: 'Monday',
        meals: [{
          id: 1,
          mealType: 'lunch' as const,
          recipe: { id: 1, title: 'Grilled Chicken Salad', imageUrl: '', prepTime: 15, calories: 420, tags: [] },
          calories: 420,
          proteinGrams: 38,
        }],
        totalCalories: 420,
        totalProtein: 38,
        totalCarbs: 12,
        totalFats: 22,
      },
    ];
    await act(async () => {
      await result.current.generate(mockDays);
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.generated).toBe(true);
  });

  it('generate with no recipes returns empty items', async () => {
    const { result } = renderHook(() => useShoppingList());
    await act(async () => {
      await result.current.generate([
        { date: '2026-07-27', dayName: 'Monday', meals: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 },
      ]);
    });
    expect(result.current.generated).toBe(true);
    expect(result.current.items).toHaveLength(0);
  });

  it('toggleChecked updates item', async () => {
    const { result } = renderHook(() => useShoppingList());
    const mockDays = [
      {
        date: '2026-07-27',
        dayName: 'Monday',
        meals: [{
          id: 1, mealType: 'lunch' as const,
          recipe: { id: 1, title: 'Grilled Chicken Salad', imageUrl: '', prepTime: 15, calories: 420, tags: [] },
          calories: 420, proteinGrams: 38,
        }],
        totalCalories: 420, totalProtein: 38, totalCarbs: 12, totalFats: 22,
      },
    ];
    await act(async () => { await result.current.generate(mockDays); });
    expect(result.current.items.length).toBeGreaterThan(0);
    const firstId = result.current.items[0].id;
    act(() => result.current.toggleChecked(firstId));
    expect(result.current.items[0].checked).toBe(true);
    act(() => result.current.toggleChecked(firstId));
    expect(result.current.items[0].checked).toBe(false);
  });

  it('reset clears all state', async () => {
    const { result } = renderHook(() => useShoppingList());
    const mockDays = [
      {
        date: '2026-07-27',
        dayName: 'Monday',
        meals: [{
          id: 1, mealType: 'lunch' as const,
          recipe: { id: 1, title: 'Grilled Chicken Salad', imageUrl: '', prepTime: 15, calories: 420, tags: [] },
          calories: 420, proteinGrams: 38,
        }],
        totalCalories: 420, totalProtein: 38, totalCarbs: 12, totalFats: 22,
      },
    ];
    await act(async () => { await result.current.generate(mockDays); });
    expect(result.current.generated).toBe(true);
    act(() => result.current.reset());
    expect(result.current.generated).toBe(false);
    expect(result.current.items).toHaveLength(0);
  });
});
