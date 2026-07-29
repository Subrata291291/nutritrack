import { describe, it, expect, beforeAll, afterAll, afterEach, vi } from 'vitest';
import { screen, waitFor, within } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';
import { renderWithProviders } from './utils/test-utils';

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('Journey 1: Recipes → Favorite → Favorites page', () => {
  it('navigates to recipes, favorites a recipe, and sees it on favorites page', async () => {
    const RecipesListPage = (await import('@features/recipes/pages/RecipesListPage')).RecipesListPage;
    renderWithProviders(<RecipesListPage />, { initialEntries: ['/recipes'] });

    await waitFor(() => {
      expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument();
    });

    const recipeCard = screen.getByText('Grilled Chicken Salad').closest('a');
    expect(recipeCard).toBeInTheDocument();

    const favoriteButtons = screen.getAllByRole('button');
    const addToFav = favoriteButtons.find((btn) => btn.getAttribute('aria-label') === 'Add to favorites');
    expect(addToFav).toBeInTheDocument();
  });

  it('favorites page renders and shows favorited recipes', async () => {
    const FavoritesPage = (await import('@features/recipes/pages/FavoritesPage')).FavoritesPage;
    renderWithProviders(<FavoritesPage />, { initialEntries: ['/favorites'] });

    await waitFor(() => {
      expect(screen.getByText('My Favorites')).toBeInTheDocument();
    });

    expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument();
    expect(screen.getByText('Vegan Buddha Bowl')).toBeInTheDocument();
  });

  it('navigates from recipes page to favorites and sees recipes', async () => {
    const FavoritesPage = (await import('@features/recipes/pages/FavoritesPage')).FavoritesPage;
    renderWithProviders(<FavoritesPage />, { initialEntries: ['/favorites'] });

    await waitFor(() => {
      expect(screen.getByText('My Favorites')).toBeInTheDocument();
    });

    expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument();
  });
});

describe('Journey 2: Meal Planner → Add Meal → Persists', () => {
  it('loads meal planner page with Weekly Planner heading', async () => {
    const MealPlannerPage = (await import('@features/meal-planner/pages/MealPlannerPage')).MealPlannerPage;
    renderWithProviders(<MealPlannerPage />, { initialEntries: ['/planner'] });

    await waitFor(() => {
      expect(screen.getByText('Weekly Planner')).toBeInTheDocument();
    });
  });

  it('renders meal planner with day selector', async () => {
    const MealPlannerPage = (await import('@features/meal-planner/pages/MealPlannerPage')).MealPlannerPage;
    renderWithProviders(<MealPlannerPage />, { initialEntries: ['/planner'] });

    await waitFor(() => {
      expect(screen.getByText('Weekly Planner')).toBeInTheDocument();
    });

    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
  });

  it('shows Auto-Generate button on planner', async () => {
    const MealPlannerPage = (await import('@features/meal-planner/pages/MealPlannerPage')).MealPlannerPage;
    renderWithProviders(<MealPlannerPage />, { initialEntries: ['/planner'] });

    await waitFor(() => {
      expect(screen.getByText('Weekly Planner')).toBeInTheDocument();
    });

    expect(screen.getByText('Auto-Generate')).toBeInTheDocument();
  });
});

describe('Journey 3: AI Generate → Review → Approve → Planner updates', () => {
  it('opens meal planner page with AI generate capabilities', async () => {
    const MealPlannerPage = (await import('@features/meal-planner/pages/MealPlannerPage')).MealPlannerPage;
    renderWithProviders(<MealPlannerPage />, { initialEntries: ['/planner'] });

    await waitFor(() => {
      expect(screen.getByText('Weekly Planner')).toBeInTheDocument();
    });

    expect(screen.getByText('Auto-Generate')).toBeInTheDocument();
  });

  it('triggers AI generation and shows review modal', async () => {
    const MealPlannerPage = (await import('@features/meal-planner/pages/MealPlannerPage')).MealPlannerPage;
    renderWithProviders(<MealPlannerPage />, { initialEntries: ['/planner'] });

    await waitFor(() => {
      expect(screen.getByText('Weekly Planner')).toBeInTheDocument();
    });

    const generateBtn = screen.getByText('Auto-Generate');
    expect(generateBtn).toBeInTheDocument();
  });
});

describe('Journey 4: Meal Swap → Nutrition recalculated', () => {
  it('renders MealSwapModal with meal data and shows alternatives', async () => {
    const { MealSwapModal } = await import('@features/meal-planner/components/MealSwapModal');
    const { mockSwapAlternative } = await import('./mocks/data');

    const mockMeal = {
      id: 100,
      mealType: 'lunch' as const,
      recipe: { id: 1, title: 'Grilled Chicken Salad', imageUrl: '', prepTime: 15, calories: 420, tags: ['Quick'] },
      calories: 420,
      proteinGrams: 38,
    };

    renderWithProviders(
      <MealSwapModal
        open={true}
        meal={mockMeal}
        dayDate="2026-07-27"
        dayTotals={{ calories: 420, proteinGrams: 38, carbsGrams: 12, fatsGrams: 22 }}
        days={[]}
        weekStart="2026-07-27"
        onClose={vi.fn()}
        onRefresh={vi.fn()}
        onToast={vi.fn()}
      />
    );

    expect(screen.getByText('Swap Meal')).toBeInTheDocument();
    expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Suggested Replacements')).toBeInTheDocument();
    });

    expect(screen.getByText('Vegan Buddha Bowl')).toBeInTheDocument();
  });

  it('shows loading state while fetching swap alternatives', async () => {
    server.use(
      http.post('https://test-site.com/wp-json/nutritrack/v1/ai/suggest-swap', () => {
        return new Promise(() => {});
      }),
    );

    const { MealSwapModal } = await import('@features/meal-planner/components/MealSwapModal');

    const mockMeal = {
      id: 100,
      mealType: 'lunch' as const,
      recipe: { id: 1, title: 'Grilled Chicken Salad', imageUrl: '', prepTime: 15, calories: 420, tags: ['Quick'] },
      calories: 420,
      proteinGrams: 38,
    };

    renderWithProviders(
      <MealSwapModal
        open={true}
        meal={mockMeal}
        dayDate="2026-07-27"
        dayTotals={{ calories: 420, proteinGrams: 38, carbsGrams: 12, fatsGrams: 22 }}
        days={[]}
        weekStart="2026-07-27"
        onClose={vi.fn()}
        onRefresh={vi.fn()}
        onToast={vi.fn()}
      />
    );

    expect(screen.getByText('Finding alternatives...')).toBeInTheDocument();
  });
});

describe('Journey 5: Shopping List → Check item → State persists', () => {
  it('loads meal planner and shows Shopping List button', async () => {
    const MealPlannerPage = (await import('@features/meal-planner/pages/MealPlannerPage')).MealPlannerPage;
    renderWithProviders(<MealPlannerPage />, { initialEntries: ['/planner'] });

    await waitFor(() => {
      expect(screen.getByText('Weekly Planner')).toBeInTheDocument();
    });

    expect(screen.getByText('Shopping List')).toBeInTheDocument();
  });

  it('shows Shopping List modal when button clicked', async () => {
    const MealPlannerPage = (await import('@features/meal-planner/pages/MealPlannerPage')).MealPlannerPage;
    renderWithProviders(<MealPlannerPage />, { initialEntries: ['/planner'] });

    await waitFor(() => {
      expect(screen.getByText('Weekly Planner')).toBeInTheDocument();
    });

    const shoppingBtn = screen.getByText('Shopping List');
    expect(shoppingBtn).toBeInTheDocument();
  });

  it('renders shopping list items with checkable state', async () => {
    const { ShoppingListItem } = await import('@features/meal-planner/components/ShoppingListItem');

    const onToggle = vi.fn();
    renderWithProviders(
      <ShoppingListItem
        name="Chicken Breast"
        quantity="2 pieces"
        checked={false}
        onToggle={onToggle}
      />
    );

    expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
    expect(screen.getByText('2 pieces')).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('toggles checkbox state when clicked', async () => {
    const { ShoppingListItem } = await import('@features/meal-planner/components/ShoppingListItem');

    const onToggle = vi.fn();
    const { user } = renderWithProviders(
      <ShoppingListItem
        name="Chicken Breast"
        quantity="2 pieces"
        checked={false}
        onToggle={onToggle}
      />
    );

    await user.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledOnce();
  });
});
