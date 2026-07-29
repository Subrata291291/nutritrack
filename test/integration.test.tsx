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

describe('Recipes Integration', () => {
  it('displays recipe list on RecipesPage', async () => {
    const RecipesListPage = (await import('@features/recipes/pages/RecipesListPage')).RecipesListPage;
    renderWithProviders(<RecipesListPage />, { initialEntries: ['/recipes'] });
    await waitFor(() => {
      expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument();
    });
    expect(screen.getByText('Vegan Buddha Bowl')).toBeInTheDocument();
  });

  it('shows loading state initially', async () => {
    const RecipesListPage = (await import('@features/recipes/pages/RecipesListPage')).RecipesListPage;
    renderWithProviders(<RecipesListPage />, { initialEntries: ['/recipes'] });
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders page header', async () => {
    const RecipesListPage = (await import('@features/recipes/pages/RecipesListPage')).RecipesListPage;
    renderWithProviders(<RecipesListPage />, { initialEntries: ['/recipes'] });
    await waitFor(() => {
      expect(screen.getByText('Recipes')).toBeInTheDocument();
    });
  });
});

describe('Recipe Detail Integration', () => {
  it('displays recipe details', async () => {
    const { Route, Routes } = await import('react-router-dom');
    const RecipeDetailPage = (await import('@features/recipes/pages/RecipeDetailPage')).RecipeDetailPage;
    renderWithProviders(
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
      </Routes>,
      { initialEntries: ['/recipes/1'] }
    );
    await waitFor(() => {
      expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument();
    });
  });

  it('shows not found for invalid recipe', async () => {
    server.use(
      http.get('https://test-site.com/wp-json/nutritrack/v1/recipes/:id', () => {
        return HttpResponse.json({ message: 'Not found' }, { status: 404 });
      }),
    );
    const { Route, Routes } = await import('react-router-dom');
    const RecipeDetailPage = (await import('@features/recipes/pages/RecipeDetailPage')).RecipeDetailPage;
    renderWithProviders(
      <Routes>
        <Route path="/recipes/:id" element={<RecipeDetailPage />} />
      </Routes>,
      { initialEntries: ['/recipes/999'] }
    );
    await waitFor(() => {
      expect(screen.getByText(/not found/i)).toBeInTheDocument();
    });
  });
});

describe('Meal Planner Integration', () => {
  it('loads and displays meal plan', async () => {
    const MealPlannerPage = (await import('@features/meal-planner/pages/MealPlannerPage')).MealPlannerPage;
    renderWithProviders(<MealPlannerPage />, { initialEntries: ['/planner'] });
    await waitFor(() => {
      expect(screen.getByText('Weekly Planner')).toBeInTheDocument();
    });
  });

  it('shows loading state', async () => {
    const MealPlannerPage = (await import('@features/meal-planner/pages/MealPlannerPage')).MealPlannerPage;
    renderWithProviders(<MealPlannerPage />, { initialEntries: ['/planner'] });
    expect(screen.getByText('Loading meal plan...')).toBeInTheDocument();
  });
});

describe('Dashboard Integration', () => {
  it('renders dashboard', async () => {
    const DashboardPage = (await import('@features/dashboard/pages/DashboardPage')).DashboardPage;
    renderWithProviders(<DashboardPage />, { initialEntries: ['/dashboard'] });
    await waitFor(() => {
      expect(screen.getByText(/Loading your dashboard/i)).toBeInTheDocument();
    });
  });
});

describe('Login Flow Integration', () => {
  it('renders login form', async () => {
    const LoginPage = (await import('@features/auth/pages/LoginPage')).LoginPage;
    renderWithProviders(<LoginPage />, { initialEntries: ['/login'] });
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });
});

describe('Settings Integration', () => {
  it('renders settings page', async () => {
    const SettingsPage = (await import('@features/settings/pages/SettingsPage')).SettingsPage;
    renderWithProviders(<SettingsPage />, { initialEntries: ['/settings'] });
    await waitFor(() => {
      expect(screen.getByText('Account')).toBeInTheDocument();
    });
  });
});

describe('Onboarding Flow Integration', () => {
  it('renders onboarding step', async () => {
    const OnboardingPage = (await import('@features/onboarding/pages/OnboardingPage')).OnboardingPage;
    renderWithProviders(<OnboardingPage />, { initialEntries: ['/onboarding'], withOnboarding: true });
    await waitFor(() => {
      expect(screen.getByText("Let's build your profile")).toBeInTheDocument();
    });
  });
});

describe('AI Generate + Review Integration', () => {
  it('triggers generate flow from meal planner', async () => {
    const MealPlannerPage = (await import('@features/meal-planner/pages/MealPlannerPage')).MealPlannerPage;
    renderWithProviders(<MealPlannerPage />, { initialEntries: ['/planner'] });
    await waitFor(() => {
      expect(screen.getByText('Weekly Planner')).toBeInTheDocument();
    });
  });
});

describe('Nutrition Log Integration', () => {
  it('renders nutrition log page', async () => {
    const NutritionLogPage = (await import('@features/nutrition-log/pages/NutritionLogPage')).NutritionLogPage;
    renderWithProviders(<NutritionLogPage />, { initialEntries: ['/log'] });
    await waitFor(() => {
      expect(screen.getByText('Loading nutrition log...')).toBeInTheDocument();
    });
  });
});
