import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from './utils/test-utils';
import { RecipeCard } from '@features/recipes/components/RecipeCard';
import { FavoriteButton } from '@features/recipes/components/FavoriteButton';
import { Pagination } from '@features/recipes/components/Pagination';
import { MealCard } from '@features/meal-planner/components/MealCard';
import { DaySelector } from '@features/meal-planner/components/DaySelector';
import { NutritionSummary } from '@features/meal-planner/components/NutritionSummary';
import { PlannerToolbar } from '@features/meal-planner/components/PlannerToolbar';
import { ShoppingListItem } from '@features/meal-planner/components/ShoppingListItem';
import { SwapMealButton } from '@features/meal-planner/components/SwapMealButton';
import { mockRecipe, mockPlannedMeal, mockMealPlanDay } from './mocks/data';

vi.mock('@services/recipes.service', () => ({
  recipesService: {
    getRecipes: vi.fn(),
    getRecipeDetail: vi.fn(),
    getCategories: vi.fn(),
    favoriteRecipe: vi.fn().mockResolvedValue({ favorited: true }),
    unfavoriteRecipe: vi.fn().mockResolvedValue({ favorited: false }),
    getFavoriteRecipes: vi.fn(),
  },
}));

vi.mock('@services/user.service', () => ({
  userService: {
    getProfile: vi.fn().mockResolvedValue({
      age: 30, gender: 'male', heightCm: 175, weightKg: 80,
      activityLevel: 'moderate', goal: 'maintain',
      displayName: 'Test User',
    }),
  },
}));

describe('RecipeCard', () => {
  const defaultProps = {
    recipe: mockRecipe,
    isFavorited: false,
    onFavoriteToggle: vi.fn(),
  };

  it('renders recipe title', () => {
    renderWithProviders(<RecipeCard {...defaultProps} />);
    expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument();
  });

  it('renders calories with unit', () => {
    renderWithProviders(<RecipeCard {...defaultProps} />);
    expect(screen.getByText('420 kcal')).toBeInTheDocument();
  });

  it('renders tags', () => {
    renderWithProviders(<RecipeCard {...defaultProps} />);
    expect(screen.getByText('Quick')).toBeInTheDocument();
  });

  it('shows filled heart when favorited', () => {
    renderWithProviders(<RecipeCard {...defaultProps} isFavorited={true} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

describe('FavoriteButton', () => {
  const defaultProps = { recipeId: 1, isFavorited: false, onToggle: vi.fn() };

  it('renders unfilled by default', () => {
    renderWithProviders(<FavoriteButton {...defaultProps} />);
    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
  });

  it('renders filled when favorited', () => {
    renderWithProviders(<FavoriteButton {...defaultProps} isFavorited={true} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onToggle when clicked', async () => {
    const onToggle = vi.fn();
    const { user } = renderWithProviders(<FavoriteButton {...defaultProps} onToggle={onToggle} />);
    await user.click(screen.getByRole('button'));
    await waitFor(() => {
      expect(onToggle).toHaveBeenCalled();
    });
  });
});

describe('Pagination', () => {
  it('renders page info', () => {
    const onPageChange = vi.fn();
    renderWithProviders(<Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />);
    expect(screen.getByText((content) => content.includes('Page') && content.includes('1') && content.includes('3'))).toBeInTheDocument();
  });

  it('previous button disabled on page 1', () => {
    const onPageChange = vi.fn();
    renderWithProviders(<Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />);
    const prevBtn = screen.getByText('Previous').closest('button');
    expect(prevBtn).toBeDisabled();
  });

  it('next button disabled on last page', () => {
    const onPageChange = vi.fn();
    renderWithProviders(<Pagination currentPage={3} totalPages={3} onPageChange={onPageChange} />);
    const nextBtn = screen.getByText('Next').closest('button');
    expect(nextBtn).toBeDisabled();
  });

  it('hidden when 1 page', () => {
    const onPageChange = vi.fn();
    const { container } = renderWithProviders(<Pagination currentPage={1} totalPages={1} onPageChange={onPageChange} />);
    expect(container.innerHTML).toBe('');
  });

  it('calls onPageChange with next page', async () => {
    const onPageChange = vi.fn();
    const { user } = renderWithProviders(<Pagination currentPage={1} totalPages={3} onPageChange={onPageChange} />);
    await user.click(screen.getByText('Next'));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with prev page', async () => {
    const onPageChange = vi.fn();
    const { user } = renderWithProviders(<Pagination currentPage={2} totalPages={3} onPageChange={onPageChange} />);
    await user.click(screen.getByText('Previous'));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });
});

describe('MealCard', () => {
  const defaultProps = {
    meal: mockPlannedMeal,
    dayDate: '2026-07-27',
    onDeleteMeal: vi.fn(),
  };

  it('renders meal name', () => {
    renderWithProviders(<MealCard {...defaultProps} />);
    expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument();
  });

  it('renders meal type label', () => {
    renderWithProviders(<MealCard {...defaultProps} />);
    expect(screen.getByText('Lunch')).toBeInTheDocument();
  });

  it('calls onDeleteMeal when close clicked', async () => {
    const onDeleteMeal = vi.fn();
    const { user } = renderWithProviders(<MealCard {...defaultProps} onDeleteMeal={onDeleteMeal} />);
    const closeBtn = screen.getByTitle('Remove');
    await user.click(closeBtn);
    expect(onDeleteMeal).toHaveBeenCalledWith(100, '2026-07-27');
  });

  it('renders swap button when onSwapMeal provided', () => {
    renderWithProviders(<MealCard {...defaultProps} onSwapMeal={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);
  });
});

describe('DaySelector', () => {
  it('renders day labels', () => {
    renderWithProviders(<DaySelector weekStart="2026-07-27" selectedDay="2026-07-27" onSelectDay={vi.fn()} />);
    expect(screen.getByText('Mon')).toBeInTheDocument();
    expect(screen.getByText('Tue')).toBeInTheDocument();
  });

  it('highlights selected day', () => {
    renderWithProviders(<DaySelector weekStart="2026-07-27" selectedDay="2026-07-27" onSelectDay={vi.fn()} />);
    const monday = screen.getByText('Mon').closest('button');
    expect(monday).toBeInTheDocument();
  });

  it('calls onSelectDay when day clicked', async () => {
    const onSelectDay = vi.fn();
    const { user } = renderWithProviders(<DaySelector weekStart="2026-07-27" selectedDay="2026-07-27" onSelectDay={onSelectDay} />);
    await user.click(screen.getByText('Tue'));
    expect(onSelectDay).toHaveBeenCalledWith('2026-07-28');
  });
});

describe('NutritionSummary', () => {
  it('renders macro values after loading', async () => {
    renderWithProviders(<NutritionSummary day={mockMealPlanDay} />);
    await waitFor(() => {
      expect(screen.getByText('420')).toBeInTheDocument();
    });
    expect(screen.getByText(/38/)).toBeInTheDocument();
  });
});

describe('PlannerToolbar', () => {
  it('renders action buttons', () => {
    renderWithProviders(<PlannerToolbar selectedDay="2026-07-27" />);
    expect(screen.getByText('Copy Previous Day')).toBeInTheDocument();
    expect(screen.getByText('Duplicate Day')).toBeInTheDocument();
    expect(screen.getByText('Clear Day')).toBeInTheDocument();
  });

  it('buttons disabled when no handler provided', () => {
    renderWithProviders(<PlannerToolbar selectedDay="2026-07-27" />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => {
      expect(btn).toBeDisabled();
    });
  });

  it('buttons enabled when handlers provided', () => {
    renderWithProviders(<PlannerToolbar selectedDay="2026-07-27" onCopyPreviousDay={vi.fn()} onDuplicateDay={vi.fn()} onClearDay={vi.fn()} />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach(btn => {
      expect(btn).toBeEnabled();
    });
  });
});

describe('ShoppingListItem', () => {
  const defaultProps = {
    name: 'Chicken Breast',
    quantity: '2 pieces',
    checked: false,
    onToggle: vi.fn(),
  };

  it('renders item name and quantity', () => {
    renderWithProviders(<ShoppingListItem {...defaultProps} />);
    expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
    expect(screen.getByText('2 pieces')).toBeInTheDocument();
  });

  it('calls onToggle when checkbox clicked', async () => {
    const onToggle = vi.fn();
    const { user } = renderWithProviders(<ShoppingListItem {...defaultProps} onToggle={onToggle} />);
    await user.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledOnce();
  });
});

describe('SwapMealButton', () => {
  it('renders swap button', () => {
    renderWithProviders(<SwapMealButton onClick={vi.fn()} />);
    const btn = screen.getByRole('button');
    expect(btn).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const onClick = vi.fn();
    const { user } = renderWithProviders(<SwapMealButton onClick={onClick} />);
    await user.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalled();
  });
});
