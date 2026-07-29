import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { renderWithProviders } from './utils/test-utils';
import { AddMealModal } from '@features/meal-planner/components/AddMealModal';
import { DailyPlanner } from '@features/meal-planner/components/DailyPlanner';
import { ShoppingListModal } from '@features/meal-planner/components/ShoppingListModal';
import { useMealSwap } from '@features/meal-planner/hooks/useMealSwap';
import { useMealGeneration } from '@features/meal-planner/hooks/useMealGeneration';
import { useShoppingList } from '@features/meal-planner/hooks/useShoppingList';
import { useMealPlanner } from '@features/meal-planner/hooks/useMealPlanner';
import { mockRecipe, mockPlannedMeal, mockMealPlanDay, mockRecipes, mockSwapAlternative, mockSwapResponse, mockAIGeneratedPlan, mockPlanResponse } from './mocks/data';
import type { MealPlanDay, PlannedMeal } from 'types/meal-plan';

vi.mock('@services/recipes.service', () => ({
  recipesService: {
    getRecipes: vi.fn(),
    getRecipeDetail: vi.fn(),
    getCategories: vi.fn(),
    favoriteRecipe: vi.fn(),
    unfavoriteRecipe: vi.fn(),
    getFavoriteRecipes: vi.fn(),
  },
}));

vi.mock('@services/user.service', () => ({
  userService: {
    getProfile: vi.fn(),
  },
}));

vi.mock('@api/client', () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

vi.mock('@services/meal-plans.service', () => ({
  mealPlansService: {
    getMealPlan: vi.fn(),
    saveMealPlan: vi.fn(),
  },
}));

vi.mock('@services/nutrition.service', () => ({
  nutritionService: {
    deleteMealEntry: vi.fn(),
  },
}));

const mockUseProfile = vi.hoisted(() => vi.fn());

vi.mock('@hooks/useProfile', () => ({ useProfile: mockUseProfile }));

import { recipesService } from '@services/recipes.service';
import { userService } from '@services/user.service';
import { apiClient } from '@api/client';
import { mealPlansService } from '@services/meal-plans.service';
import { nutritionService } from '@services/nutrition.service';

const mockUserProfile = {
  displayName: 'Test User',
  avatar: '',
  age: 30,
  gender: 'male' as const,
  heightCm: 175,
  weightKg: 80,
  activityLevel: 'moderately-active' as const,
  goal: 'maintain' as const,
  targetWeightKg: 75,
};

const mockDays: MealPlanDay[] = [
  {
    date: '2026-07-27',
    dayName: 'Monday',
    meals: [
      {
        id: 100,
        mealType: 'lunch',
        recipe: { id: 1, title: 'Grilled Chicken Salad', imageUrl: '', prepTime: 15, calories: 420, tags: ['Quick'] },
        calories: 420,
        proteinGrams: 38,
      },
    ],
    totalCalories: 420,
    totalProtein: 38,
    totalCarbs: 12,
    totalFats: 22,
  },
  {
    date: '2026-07-28',
    dayName: 'Tuesday',
    meals: [],
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
  },
];

const mockMealPlan = { id: 1, weekStart: '2026-07-27', days: mockDays };

const mockFullRecipe = {
  ...mockRecipe,
  id: 1,
  title: 'Grilled Chicken Salad',
  ingredients: [
    { id: 1, name: 'Chicken breast', quantity: '2 pieces' },
    { id: 2, name: 'Mixed greens', quantity: '4 cups' },
  ],
};

const mockGenerateResponse = {
  success: true,
  data: mockPlanResponse,
};

function createSwapResponse() {
  return { data: mockSwapResponse };
}

function createGenerateResponse() {
  return { data: mockGenerateResponse };
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(recipesService.getRecipes).mockResolvedValue({ recipes: mockRecipes });
  vi.mocked(recipesService.getRecipeDetail).mockResolvedValue(mockFullRecipe);
  vi.mocked(userService.getProfile).mockResolvedValue(mockUserProfile);
  vi.mocked(apiClient.post).mockResolvedValue(createGenerateResponse());
  vi.mocked(mealPlansService.getMealPlan).mockResolvedValue(mockMealPlan);
  vi.mocked(mealPlansService.saveMealPlan).mockResolvedValue(undefined);
  vi.mocked(nutritionService.deleteMealEntry).mockResolvedValue(undefined);
});

/* ============================================================
 * AddMealModal
 * ============================================================ */
describe('AddMealModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    selectedDate: '2026-07-27',
    onConfirm: vi.fn().mockResolvedValue(undefined),
  };

  it('renders all meal type options', async () => {
    renderWithProviders(<AddMealModal {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Breakfast')).toBeInTheDocument();
    });
    expect(screen.getByText('Lunch')).toBeInTheDocument();
    expect(screen.getByText('Dinner')).toBeInTheDocument();
    expect(screen.getByText('Snack')).toBeInTheDocument();
  });

  it('renders formatted date', async () => {
    renderWithProviders(<AddMealModal {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText(/Monday|July|2026|27/)).toBeInTheDocument();
    });
  });

  it('renders category filter buttons', async () => {
    renderWithProviders(<AddMealModal {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getAllByText('All').length).toBeGreaterThanOrEqual(1);
    });
    const filterButtons = screen.getAllByRole('button').filter(
      (b) => b.textContent === 'Quick' || b.textContent === 'High Pro' || b.textContent === 'Vegan',
    );
    expect(filterButtons.length).toBeGreaterThanOrEqual(3);
  });

  it('renders recipe list after loading', async () => {
    renderWithProviders(<AddMealModal {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument();
    });
    expect(screen.getByText('Vegan Buddha Bowl')).toBeInTheDocument();
    expect(screen.getByText('Protein Oatmeal')).toBeInTheDocument();
  });

  it('calls onConfirm with correct args when Add to Plan clicked', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const { user } = renderWithProviders(
      <AddMealModal {...defaultProps} onConfirm={onConfirm} />,
    );
    await waitFor(() => {
      expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Grilled Chicken Salad'));
    await user.click(screen.getByText('Add to Plan'));
    await waitFor(() => {
      expect(onConfirm).toHaveBeenCalledWith(
        '2026-07-27',
        'breakfast',
        expect.objectContaining({ id: 1, title: 'Grilled Chicken Salad' }),
      );
    });
  });

  it('does not render when isOpen is false', () => {
    const { container } = renderWithProviders(
      <AddMealModal {...defaultProps} isOpen={false} />,
    );
    expect(container.innerHTML).toBe('');
  });

  it('calls onClose when close button clicked', async () => {
    const onClose = vi.fn();
    const { user } = renderWithProviders(
      <AddMealModal {...defaultProps} onClose={onClose} />,
    );
    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalled();
  });

  it('disables confirm button when no recipe selected', async () => {
    renderWithProviders(<AddMealModal {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Add to Plan').closest('button')).toBeDisabled();
    });
  });

  it('shows error message when onConfirm rejects', async () => {
    const onConfirm = vi.fn().mockRejectedValue(new Error('fail'));
    const { user } = renderWithProviders(
      <AddMealModal {...defaultProps} onConfirm={onConfirm} />,
    );
    await waitFor(() => {
      expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Grilled Chicken Salad'));
    await user.click(screen.getByText('Add to Plan'));
    await waitFor(() => {
      expect(screen.getByText('Failed to add meal. Please try again.')).toBeInTheDocument();
    });
  });
});

/* ============================================================
 * DailyPlanner
 * ============================================================ */
describe('DailyPlanner', () => {
  const defaultProps = {
    day: mockMealPlanDay,
    onAddMeal: vi.fn(),
    onDeleteMeal: vi.fn(),
  };

  it('renders day name', () => {
    renderWithProviders(<DailyPlanner {...defaultProps} />);
    expect(screen.getByText('Monday')).toBeInTheDocument();
  });

  it('renders meals for the selected day', () => {
    renderWithProviders(<DailyPlanner {...defaultProps} />);
    expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument();
  });

  it('renders Add button', () => {
    renderWithProviders(<DailyPlanner {...defaultProps} />);
    expect(screen.getByText('Add')).toBeInTheDocument();
  });

  it('calls onAddMeal with day date when Add clicked', async () => {
    const onAddMeal = vi.fn();
    const { user } = renderWithProviders(
      <DailyPlanner {...defaultProps} onAddMeal={onAddMeal} />,
    );
    await user.click(screen.getByText('Add'));
    expect(onAddMeal).toHaveBeenCalledWith('2026-07-27');
  });

  it('renders empty state when no day provided', () => {
    renderWithProviders(<DailyPlanner {...defaultProps} day={undefined} />);
    expect(screen.getByText('No meals planned for this day.')).toBeInTheDocument();
  });

  it('renders nutrition summary for the day', () => {
    renderWithProviders(<DailyPlanner {...defaultProps} />);
    expect(screen.getAllByText('420').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/38/).length).toBeGreaterThanOrEqual(1);
  });

  it('renders swap button when onSwapMeal provided', () => {
    renderWithProviders(
      <DailyPlanner {...defaultProps} onSwapMeal={vi.fn()} />,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });
});

/* ============================================================
 * ShoppingListModal
 * ============================================================ */
describe('ShoppingListModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    days: mockDays,
  };

  it('renders loading state initially', async () => {
    vi.mocked(recipesService.getRecipeDetail).mockImplementation(() => new Promise(() => {}));
    renderWithProviders(<ShoppingListModal {...defaultProps} />);
    expect(screen.getByText('Building grocery list...')).toBeInTheDocument();
  });

  it('renders items grouped by category after generation', async () => {
    renderWithProviders(<ShoppingListModal {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText(/Chicken breast|Chicken Breast/i)).toBeInTheDocument();
    });
    expect(screen.getByText(/Mixed greens/i)).toBeInTheDocument();
  });

  it('renders category labels', async () => {
    renderWithProviders(<ShoppingListModal {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Produce')).toBeInTheDocument();
    });
    expect(screen.getByText('Proteins')).toBeInTheDocument();
  });

  it('shows item count per category', async () => {
    renderWithProviders(<ShoppingListModal {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getAllByText(/0\/1/).length).toBeGreaterThanOrEqual(1);
    });
  });

  it('renders empty state when no items', async () => {
    vi.mocked(recipesService.getRecipeDetail).mockResolvedValue({
      ...mockFullRecipe,
      ingredients: [],
    });
    renderWithProviders(<ShoppingListModal {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('No items needed')).toBeInTheDocument();
    });
  });

  it('renders Print and Close buttons when items exist', async () => {
    renderWithProviders(<ShoppingListModal {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Print')).toBeInTheDocument();
    });
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('shows empty state message alongside footer', async () => {
    vi.mocked(recipesService.getRecipeDetail).mockResolvedValue({
      ...mockFullRecipe,
      ingredients: [],
    });
    renderWithProviders(<ShoppingListModal {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('No items needed')).toBeInTheDocument();
    });
    expect(screen.getByText('Print')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
  });

  it('calls onClose when Close button clicked', async () => {
    const onClose = vi.fn();
    const { user } = renderWithProviders(
      <ShoppingListModal {...defaultProps} onClose={onClose} />,
    );
    await waitFor(() => {
      expect(screen.getByText('Close')).toBeInTheDocument();
    });
    await user.click(screen.getByText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders error state when API fails', async () => {
    vi.mocked(recipesService.getRecipeDetail).mockRejectedValue(new Error('Network error'));
    renderWithProviders(<ShoppingListModal {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Failed to generate list')).toBeInTheDocument();
    });
  });

  it('shows Retry button in error state', async () => {
    vi.mocked(recipesService.getRecipeDetail).mockRejectedValue(new Error('Network error'));
    renderWithProviders(<ShoppingListModal {...defaultProps} />);
    await waitFor(() => {
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });
  });
});

/* ============================================================
 * useMealSwap hook
 * ============================================================ */
describe('useMealSwap', () => {
  beforeEach(() => {
    mockUseProfile.mockReturnValue({
      profile: {
        displayName: 'Test User',
        age: 30,
        gender: 'male',
        heightCm: 175,
        weightKg: 80,
        activityLevel: 'moderately-active',
        goal: 'maintain',
      },
      nutritionTargets: { calories: 2200, proteinGrams: 165, carbsGrams: 220, fatsGrams: 73, waterMl: 2500 },
      ensureProfile: vi.fn().mockResolvedValue(undefined),
      refreshProfile: vi.fn(),
      updateProfile: vi.fn(),
    });
    vi.mocked(apiClient.post).mockResolvedValue(
      createSwapResponse() as never,
    );
  });

  it('suggestSwap returns alternatives', async () => {
    const { result } = renderHook(() => useMealSwap());
    expect(result.current.loading).toBe(false);
    await act(async () => {
      await result.current.suggestSwap(100, 'lunch', {
        calories: 420, proteinGrams: 38, carbsGrams: 12, fatsGrams: 22,
      });
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.alternatives.length).toBeGreaterThan(0);
  });

  it('reset clears state', async () => {
    const { result } = renderHook(() => useMealSwap());
    await act(async () => {
      await result.current.suggestSwap(100, 'lunch', {
        calories: 420, proteinGrams: 38, carbsGrams: 12, fatsGrams: 22,
      });
    });
    expect(result.current.alternatives.length).toBeGreaterThan(0);
    act(() => result.current.reset());
    expect(result.current.alternatives).toHaveLength(0);
    expect(result.current.error).toBeNull();
  });

  it('sets error on API failure', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(new Error('API error'));
    const { result } = renderHook(() => useMealSwap());
    await act(async () => {
      await result.current.suggestSwap(100, 'lunch', {
        calories: 420, proteinGrams: 38, carbsGrams: 12, fatsGrams: 22,
      });
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeTruthy();
    expect(result.current.alternatives).toHaveLength(0);
  });

  it('sets error on unsuccessful response', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { success: false, data: null },
    } as never);
    const { result } = renderHook(() => useMealSwap());
    await act(async () => {
      await result.current.suggestSwap(100, 'lunch', {
        calories: 420, proteinGrams: 38, carbsGrams: 12, fatsGrams: 22,
      });
    });
    expect(result.current.error).toBeTruthy();
  });

  it('applySwap returns true on success', async () => {
    const { result } = renderHook(() => useMealSwap());
    await act(async () => {
      await result.current.suggestSwap(100, 'lunch', {
        calories: 420, proteinGrams: 38, carbsGrams: 12, fatsGrams: 22,
      });
    });
    expect(result.current.alternatives.length).toBeGreaterThan(0);
    let ok = false;
    await act(async () => {
      ok = await result.current.applySwap(
        result.current.alternatives[0], 100, '2026-07-27', mockDays, '2026-07-27',
      );
    });
    expect(ok).toBe(true);
    expect(vi.mocked(mealPlansService.saveMealPlan)).toHaveBeenCalled();
  });

  it('applySwap returns false on API failure', async () => {
    vi.mocked(mealPlansService.saveMealPlan).mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useMealSwap());
    await act(async () => {
      await result.current.suggestSwap(100, 'lunch', {
        calories: 420, proteinGrams: 38, carbsGrams: 12, fatsGrams: 22,
      });
    });
    let ok = true;
    await act(async () => {
      ok = await result.current.applySwap(
        result.current.alternatives[0], 100, '2026-07-27', mockDays, '2026-07-27',
      );
    });
    expect(ok).toBe(false);
  });
});

/* ============================================================
 * useMealGeneration hook
 * ============================================================ */
describe('useMealGeneration', () => {
  it('generate returns plan and warnings', async () => {
    const { result } = renderHook(() => useMealGeneration());
    await act(async () => {
      await result.current.generate();
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.plan).not.toBeNull();
  });

  it('reset clears state', async () => {
    const { result } = renderHook(() => useMealGeneration());
    await act(async () => { await result.current.generate(); });
    expect(result.current.plan).not.toBeNull();
    act(() => result.current.reset());
    expect(result.current.plan).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('sets error on API failure', async () => {
    vi.mocked(apiClient.post).mockRejectedValue(new Error('API error'));
    const { result } = renderHook(() => useMealGeneration());
    await act(async () => {
      await result.current.generate();
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeTruthy();
  });

  it('sets error on unsuccessful response', async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { success: false, data: null },
    } as never);
    const { result } = renderHook(() => useMealGeneration());
    await act(async () => {
      await result.current.generate();
    });
    expect(result.current.error).toBeTruthy();
  });

  it('savePlan saves successfully and returns true', async () => {
    const { result } = renderHook(() => useMealGeneration());
    await act(async () => { await result.current.generate(); });
    expect(result.current.plan).not.toBeNull();
    let saved = false;
    await act(async () => {
      saved = await result.current.savePlan('2026-07-27');
    });
    expect(saved).toBe(true);
    expect(result.current.saveError).toBeNull();
  });

  it('savePlan sets saveError on API failure', async () => {
    vi.mocked(mealPlansService.saveMealPlan).mockRejectedValue(new Error('Save failed'));
    const { result } = renderHook(() => useMealGeneration());
    await act(async () => { await result.current.generate(); });
    expect(result.current.plan).not.toBeNull();
    let saved = true;
    await act(async () => {
      saved = await result.current.savePlan('2026-07-27');
    });
    expect(saved).toBe(false);
    expect(result.current.saveError).toBeTruthy();
  });

  it('savePlan returns false and sets failedDates on failure', async () => {
    vi.mocked(mealPlansService.saveMealPlan).mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useMealGeneration());
    await act(async () => { await result.current.generate(); });
    let saved = true;
    await act(async () => {
      saved = await result.current.savePlan('2026-07-27');
    });
    expect(saved).toBe(false);
    expect(result.current.failedDates.length).toBeGreaterThan(0);
  });

  it('retry triggers loading state', async () => {
    const { result } = renderHook(() => useMealGeneration());
    await act(async () => { await result.current.generate(); });
    act(() => result.current.retry());
    expect(result.current.loading).toBe(true);
  });
});

/* ============================================================
 * useShoppingList hook
 * ============================================================ */
describe('useShoppingList', () => {
  it('generate returns items from recipe ingredients', async () => {
    const { result } = renderHook(() => useShoppingList());
    expect(result.current.loading).toBe(false);
    await act(async () => {
      await result.current.generate(mockDays);
    });
    expect(result.current.loading).toBe(false);
    expect(result.current.generated).toBe(true);
    expect(result.current.items.length).toBeGreaterThan(0);
  });

  it('generate with no recipes returns empty items', async () => {
    const { result } = renderHook(() => useShoppingList());
    await act(async () => {
      await result.current.generate([]);
    });
    expect(result.current.generated).toBe(true);
    expect(result.current.items).toHaveLength(0);
  });

  it('toggleChecked updates item checked state', async () => {
    const { result } = renderHook(() => useShoppingList());
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
    await act(async () => { await result.current.generate(mockDays); });
    expect(result.current.generated).toBe(true);
    act(() => result.current.reset());
    expect(result.current.generated).toBe(false);
    expect(result.current.items).toHaveLength(0);
  });

  it('categorizes ingredients correctly', async () => {
    vi.mocked(recipesService.getRecipeDetail).mockResolvedValue({
      ...mockFullRecipe,
      ingredients: [
        { id: 1, name: 'Chicken breast', quantity: '500g' },
        { id: 2, name: 'Mixed greens', quantity: '2 cups' },
        { id: 3, name: 'Olive oil', quantity: '2 tbsp' },
        { id: 4, name: 'Rice', quantity: '1 cup' },
        { id: 5, name: 'Milk', quantity: '1 cup' },
        { id: 6, name: 'Salt', quantity: '1 tsp' },
      ],
    });
    const { result } = renderHook(() => useShoppingList());
    await act(async () => { await result.current.generate(mockDays); });
    const categories = result.current.items.map((i) => i.category);
    expect(categories).toContain('proteins');
    expect(categories).toContain('produce');
    expect(categories).toContain('spices');
    expect(categories).toContain('grains');
    expect(categories).toContain('dairy');
  });

  it('handles API error gracefully', async () => {
    vi.mocked(recipesService.getRecipeDetail).mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useShoppingList());
    await act(async () => { await result.current.generate(mockDays); });
    expect(result.current.error).toBeTruthy();
    expect(result.current.generated).toBe(false);
  });

  it('generating with days containing no recipe IDs returns empty', async () => {
    const emptyDays: MealPlanDay[] = [{
      ...mockDays[0],
      meals: [{ ...mockDays[0].meals[0], recipe: undefined }],
    }];
    const { result } = renderHook(() => useShoppingList());
    await act(async () => { await result.current.generate(emptyDays); });
    expect(result.current.generated).toBe(true);
    expect(result.current.items).toHaveLength(0);
  });
});

/* ============================================================
 * useMealPlanner hook
 * ============================================================ */
describe('useMealPlanner', () => {
  it('loads meal plan on mount', async () => {
    const { result } = renderHook(() => useMealPlanner());
    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(false);
    expect(result.current.mealPlan.days.length).toBeGreaterThan(0);
  });

  it('sets error state on API failure', async () => {
    vi.mocked(mealPlansService.getMealPlan).mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useMealPlanner());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(true);
    expect(result.current.mealPlan.days).toHaveLength(0);
  });

  it('refresh refetches plan', async () => {
    const { result } = renderHook(() => useMealPlanner());
    await waitFor(() => expect(result.current.loading).toBe(false));
    act(() => result.current.refresh());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(false);
  });

  it('retry refetches after error', async () => {
    vi.mocked(mealPlansService.getMealPlan)
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce(mockMealPlan);
    const { result } = renderHook(() => useMealPlanner());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(true);
    act(() => result.current.retry());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe(false);
  });

  it('deleteMeal removes meal and updates totals', async () => {
    const { result } = renderHook(() => useMealPlanner());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.mealPlan.days.length).toBeGreaterThan(0);
    });
    const day = result.current.mealPlan.days.find((d) => d.date === '2026-07-27');
    expect(day?.meals.length).toBe(1);
    await act(async () => {
      await result.current.deleteMeal(100, '2026-07-27');
    });
    const updatedDay = result.current.mealPlan.days.find((d) => d.date === '2026-07-27');
    expect(updatedDay?.meals).toHaveLength(0);
    expect(updatedDay?.totalCalories).toBe(0);
    expect(updatedDay?.totalProtein).toBe(0);
  });

  it('deleteMeal calls saveMealPlan with updated days', async () => {
    const { result } = renderHook(() => useMealPlanner());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.deleteMeal(100, '2026-07-27');
    });
    expect(vi.mocked(mealPlansService.saveMealPlan)).toHaveBeenCalled();
    const calledWith = vi.mocked(mealPlansService.saveMealPlan).mock.calls[0];
    expect(calledWith[0]).toBeTruthy();
    const savedDays = calledWith[1] as MealPlanDay[];
    const savedDay = savedDays.find((d: MealPlanDay) => d.date === '2026-07-27');
    expect(savedDay?.meals).toHaveLength(0);
  });

  it('deleteMeal refreshes on save failure', async () => {
    vi.mocked(mealPlansService.saveMealPlan).mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useMealPlanner());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.deleteMeal(100, '2026-07-27');
    });
    await waitFor(() => {
      expect(vi.mocked(mealPlansService.getMealPlan)).toHaveBeenCalledTimes(2);
    });
  });

  it('deleteMeal no-ops for nonexistent meal', async () => {
    const { result } = renderHook(() => useMealPlanner());
    await waitFor(() => expect(result.current.loading).toBe(false));
    await act(async () => {
      await result.current.deleteMeal(999, '2026-07-27');
    });
    const day = result.current.mealPlan.days.find((d) => d.date === '2026-07-27');
    expect(day?.meals).toHaveLength(1);
  });

  it('selectedDay defaults to today', () => {
    const { result } = renderHook(() => useMealPlanner());
    expect(result.current.selectedDay).toBeTruthy();
  });

  it('setSelectedDay updates selected day', () => {
    const { result } = renderHook(() => useMealPlanner());
    act(() => result.current.setSelectedDay('2026-07-28'));
    expect(result.current.selectedDay).toBe('2026-07-28');
  });
});
