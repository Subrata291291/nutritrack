import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from './utils/test-utils';
import { FoodPickerModal } from '@features/nutrition-log/components/FoodPickerModal';
import { WaterTracker } from '@features/nutrition-log/components/WaterTracker';
import { TimelineMealCard } from '@features/nutrition-log/components/TimelineMealCard';
import { RecentFoods } from '@features/nutrition-log/components/RecentFoods';
import { NutritionLogPage } from '@features/nutrition-log/pages/NutritionLogPage';
import { mockFoodItem, mockDailyLog, mockMealEntry } from './mocks/data';
import type { FoodItem, DailyLog } from 'types/nutrition';

vi.mock('@services/nutrition.service', () => ({
  nutritionService: {
    getDailyLog: vi.fn(),
    addMeal: vi.fn(),
    deleteMealEntry: vi.fn(),
    searchFoods: vi.fn(),
    getRecentFoods: vi.fn(),
    updateWater: vi.fn(),
  },
}));

vi.mock('@services/recent-recipes.service', () => ({
  getRecentRecipes: vi.fn().mockReturnValue([]),
}));

import { nutritionService } from '@services/nutrition.service';
import { getRecentRecipes } from '@services/recent-recipes.service';

const mockedNutritionService = vi.mocked(nutritionService);

describe('FoodPickerModal', () => {
  const defaultProps = {
    open: true,
    mealType: 'lunch',
    recentFoods: [mockFoodItem],
    onSelect: vi.fn(),
    onClose: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders nothing when not open', () => {
    const { container } = renderWithProviders(<FoodPickerModal {...defaultProps} open={false} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders search input', () => {
    renderWithProviders(<FoodPickerModal {...defaultProps} />);
    expect(screen.getByPlaceholderText('Search foods...')).toBeInTheDocument();
  });

  it('shows heading with meal type', () => {
    renderWithProviders(<FoodPickerModal {...defaultProps} mealType="breakfast" />);
    expect(screen.getByText('Add to breakfast')).toBeInTheDocument();
  });

  it('displays recent foods when no search query', () => {
    renderWithProviders(<FoodPickerModal {...defaultProps} />);
    expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
    expect(screen.getByText(/100g/)).toBeInTheDocument();
    expect(screen.getByText(/165 kcal/)).toBeInTheDocument();
  });

  it('calls onSelect and onClose when food item clicked', async () => {
    const onSelect = vi.fn();
    const onClose = vi.fn();
    const { user } = renderWithProviders(
      <FoodPickerModal {...defaultProps} onSelect={onSelect} onClose={onClose} />,
    );
    await user.click(screen.getByText('Chicken Breast'));
    expect(onSelect).toHaveBeenCalledWith(mockFoodItem.id, 1);
    expect(onClose).toHaveBeenCalled();
  });

  it('filters recent foods locally when typing', async () => {
    const chicken = { ...mockFoodItem, id: 10, name: 'Chicken Breast' };
    const beef = { ...mockFoodItem, id: 11, name: 'Beef Steak' };
    const { user } = renderWithProviders(
      <FoodPickerModal {...defaultProps} recentFoods={[chicken, beef]} />,
    );
    const input = screen.getByPlaceholderText('Search foods...');
    await user.type(input, 'Beef');
    await waitFor(() => {
      expect(screen.getByText('Beef Steak')).toBeInTheDocument();
    });
    expect(screen.queryByText('Chicken Breast')).not.toBeInTheDocument();
  });

  it('calls API to search when no local match found', async () => {
    const apiFood = { ...mockFoodItem, id: 99, name: 'Apple' };
    mockedNutritionService.searchFoods.mockResolvedValue([apiFood]);
    const { user } = renderWithProviders(
      <FoodPickerModal {...defaultProps} recentFoods={[]} />,
    );
    const input = screen.getByPlaceholderText('Search foods...');
    await user.type(input, 'Apple');
    await waitFor(() => {
      expect(mockedNutritionService.searchFoods).toHaveBeenCalledWith('apple');
    });
    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });
  });

  it('shows empty message when search yields no results', async () => {
    mockedNutritionService.searchFoods.mockResolvedValue([]);
    const { user } = renderWithProviders(
      <FoodPickerModal {...defaultProps} recentFoods={[]} />,
    );
    const input = screen.getByPlaceholderText('Search foods...');
    await user.type(input, 'xyz');
    await waitFor(() => {
      expect(screen.getByText(/No foods found/)).toBeInTheDocument();
    });
  });

  it('close button calls onClose', async () => {
    const onClose = vi.fn();
    const { user } = renderWithProviders(
      <FoodPickerModal {...defaultProps} onClose={onClose} />,
    );
    const closeBtn = screen.getByRole('button', { name: /close/i });
    await user.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  it('adjusts servings with add and remove buttons', async () => {
    const { user } = renderWithProviders(<FoodPickerModal {...defaultProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    const addBtn = screen.getByRole('button', { name: 'add' });
    const removeBtn = screen.getByRole('button', { name: 'remove' });
    await user.click(addBtn);
    expect(screen.getByText('1.5')).toBeInTheDocument();
    await user.click(removeBtn);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('shows searching indicator while API call is in flight', async () => {
    mockedNutritionService.searchFoods.mockReturnValue(new Promise(() => {}));
    const { user } = renderWithProviders(
      <FoodPickerModal {...defaultProps} recentFoods={[]} />,
    );
    const input = screen.getByPlaceholderText('Search foods...');
    await user.type(input, 'Pizza');
    await waitFor(() => {
      expect(screen.getByText('Searching...')).toBeInTheDocument();
    });
  });

  it('shows empty recent foods message when no recent foods and no search', () => {
    renderWithProviders(
      <FoodPickerModal {...defaultProps} recentFoods={[]} />,
    );
    expect(screen.getByText(/No recent foods/)).toBeInTheDocument();
  });
});

describe('WaterTracker', () => {
  const defaultProps = {
    initialWaterMl: 750,
    onUpdate: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders current water intake in liters', () => {
    renderWithProviders(<WaterTracker {...defaultProps} />);
    expect(screen.getByText(/0.8L/)).toBeInTheDocument();
    expect(screen.getByText(/3.0L/)).toBeInTheDocument();
  });

  it('renders percentage progress', () => {
    renderWithProviders(<WaterTracker {...defaultProps} />);
    expect(screen.getByText('25%')).toBeInTheDocument();
  });

  it('renders 8 glass buttons', () => {
    renderWithProviders(<WaterTracker {...defaultProps} />);
    const glassButtons = screen.getAllByTitle(/glass/i);
    expect(glassButtons).toHaveLength(8);
  });

  it('calls onUpdate with correct ml when glass clicked to increment', async () => {
    const onUpdate = vi.fn();
    const { user } = renderWithProviders(
      <WaterTracker initialWaterMl={0} onUpdate={onUpdate} />,
    );
    const glassButtons = screen.getAllByTitle(/glass/i);
    await user.click(glassButtons[0]);
    expect(onUpdate).toHaveBeenCalledWith(375);
  });

  it('calls onUpdate with correct ml when glass clicked to decrement', async () => {
    const onUpdate = vi.fn();
    const { user } = renderWithProviders(
      <WaterTracker initialWaterMl={1500} onUpdate={onUpdate} />,
    );
    const glassButtons = screen.getAllByTitle(/glass/i);
    await user.click(glassButtons[2]);
    expect(onUpdate).toHaveBeenCalledWith(750);
  });

  it('+250ml button adds one glass', async () => {
    const onUpdate = vi.fn();
    const { user } = renderWithProviders(
      <WaterTracker initialWaterMl={0} onUpdate={onUpdate} />,
    );
    await user.click(screen.getByText('+ 250ml'));
    expect(onUpdate).toHaveBeenCalledWith(375);
  });

  it('+500ml button adds one glass', async () => {
    const onUpdate = vi.fn();
    const { user } = renderWithProviders(
      <WaterTracker initialWaterMl={0} onUpdate={onUpdate} />,
    );
    await user.click(screen.getByText('+ 500ml'));
    expect(onUpdate).toHaveBeenCalledWith(375);
  });

  it('caps at 8 glasses when using quick add', async () => {
    const onUpdate = vi.fn();
    const { user } = renderWithProviders(
      <WaterTracker initialWaterMl={3000} onUpdate={onUpdate} />,
    );
    await user.click(screen.getByText('+ 500ml'));
    expect(onUpdate).toHaveBeenCalledWith(3000);
  });

  it('does not throw when onUpdate is not provided', async () => {
    const { user } = renderWithProviders(<WaterTracker initialWaterMl={0} />);
    const glassButtons = screen.getAllByTitle(/glass/i);
    await expect(user.click(glassButtons[0])).resolves.toBeUndefined();
  });
});

describe('TimelineMealCard', () => {
  const defaultProps = {
    type: 'lunch',
    icon: 'lunch_dining',
    title: 'Lunch',
    calories: 330,
    targetCalories: 2400,
    items: [mockMealEntry],
    empty: false,
    emptyIcon: 'lunch_dining',
    emptyMessage: 'Nothing logged for lunch yet.',
    ctaLabel: 'Log Lunch',
    onAddFood: vi.fn(),
    onDeleteFood: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders meal title', () => {
    renderWithProviders(<TimelineMealCard {...defaultProps} />);
    expect(screen.getByText('Lunch')).toBeInTheDocument();
  });

  it('shows calories with kcal unit', () => {
    renderWithProviders(<TimelineMealCard {...defaultProps} />);
    expect(screen.getByText('kcal')).toBeInTheDocument();
  });

  it('shows percentage of daily goal', () => {
    renderWithProviders(
      <TimelineMealCard {...defaultProps} calories={600} targetCalories={2400} />,
    );
    expect(screen.getByText('25% of daily goal')).toBeInTheDocument();
  });

  it('shows item count', () => {
    renderWithProviders(<TimelineMealCard {...defaultProps} />);
    expect(screen.getByText('1 item')).toBeInTheDocument();
  });

  it('shows food item name from entries', () => {
    renderWithProviders(<TimelineMealCard {...defaultProps} />);
    expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
  });

  it('shows serving count per entry', () => {
    renderWithProviders(<TimelineMealCard {...defaultProps} />);
    expect(screen.getByText('1 serving(s)')).toBeInTheDocument();
  });

  it('shows calculated calories per entry', () => {
    renderWithProviders(<TimelineMealCard {...defaultProps} />);
    expect(screen.getByText('165')).toBeInTheDocument();
  });

  it('renders empty state with message and CTA when no items', () => {
    renderWithProviders(
      <TimelineMealCard {...defaultProps} empty={true} items={[]} />,
    );
    expect(screen.getByText('Nothing logged for lunch yet.')).toBeInTheDocument();
    expect(screen.getByText('Log Lunch')).toBeInTheDocument();
  });

  it('calls onAddFood when Add Food button clicked', async () => {
    const onAddFood = vi.fn();
    const { user } = renderWithProviders(
      <TimelineMealCard {...defaultProps} onAddFood={onAddFood} />,
    );
    await user.click(screen.getByText('Add Food'));
    expect(onAddFood).toHaveBeenCalled();
  });

  it('calls onAddFood from empty state CTA', async () => {
    const onAddFood = vi.fn();
    const { user } = renderWithProviders(
      <TimelineMealCard {...defaultProps} empty={true} items={[]} onAddFood={onAddFood} />,
    );
    await user.click(screen.getByText('Log Lunch'));
    expect(onAddFood).toHaveBeenCalled();
  });

  it('opens confirm modal when delete button clicked', async () => {
    const { user } = renderWithProviders(<TimelineMealCard {...defaultProps} />);
    await user.click(screen.getByTitle('Remove'));
    expect(screen.getByText('Remove Food')).toBeInTheDocument();
    expect(
      screen.getByText('Are you sure you want to remove this food from your log?'),
    ).toBeInTheDocument();
  });

  it('calls onDeleteFood after confirmation', async () => {
    const onDeleteFood = vi.fn();
    const { user } = renderWithProviders(
      <TimelineMealCard {...defaultProps} onDeleteFood={onDeleteFood} />,
    );
    await user.click(screen.getByTitle('Remove'));
    await user.click(screen.getByText('Remove'));
    expect(onDeleteFood).toHaveBeenCalledWith(mockMealEntry.id);
  });

  it('does not call onDeleteFood when cancelled', async () => {
    const onDeleteFood = vi.fn();
    const { user } = renderWithProviders(
      <TimelineMealCard {...defaultProps} onDeleteFood={onDeleteFood} />,
    );
    await user.click(screen.getByTitle('Remove'));
    await user.click(screen.getByText('Cancel'));
    expect(onDeleteFood).not.toHaveBeenCalled();
  });
});

describe('RecentFoods', () => {
  const defaultProps = {
    items: [mockFoodItem],
    onAddFood: vi.fn(),
    recentRecipes: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders section heading', () => {
    renderWithProviders(<RecentFoods {...defaultProps} />);
    expect(screen.getByText('Recent')).toBeInTheDocument();
  });

  it('renders food item name', () => {
    renderWithProviders(<RecentFoods {...defaultProps} />);
    expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
  });

  it('renders serving size and calories per serving', () => {
    renderWithProviders(<RecentFoods {...defaultProps} />);
    expect(screen.getByText(/100g/)).toBeInTheDocument();
    expect(screen.getByText(/165 kcal/)).toBeInTheDocument();
  });

  it('calls onAddFood with food id when item clicked', async () => {
    const onAddFood = vi.fn();
    const { user } = renderWithProviders(
      <RecentFoods {...defaultProps} onAddFood={onAddFood} />,
    );
    await user.click(screen.getByText('Chicken Breast'));
    expect(onAddFood).toHaveBeenCalledWith(mockFoodItem.id);
  });

  it('shows empty state when no items or recipes', () => {
    renderWithProviders(<RecentFoods items={[]} onAddFood={vi.fn()} />);
    expect(screen.getByText('No recent foods or recipes yet')).toBeInTheDocument();
  });

  it('limits food items to 5', () => {
    const manyFoods: FoodItem[] = Array.from({ length: 7 }, (_, i) => ({
      ...mockFoodItem,
      id: i + 1,
      name: `Food ${i + 1}`,
    }));
    renderWithProviders(<RecentFoods items={manyFoods} onAddFood={vi.fn()} />);
    expect(screen.getByText('Food 1')).toBeInTheDocument();
    expect(screen.getByText('Food 5')).toBeInTheDocument();
    expect(screen.queryByText('Food 6')).not.toBeInTheDocument();
  });

  it('renders recent recipes section when recipes provided', () => {
    const recipes = [
      { id: 1, title: 'Grilled Chicken Salad', caloriesPerServing: 420, imageUrl: '' },
    ];
    renderWithProviders(
      <RecentFoods {...defaultProps} recentRecipes={recipes} />,
    );
    expect(screen.getByText('Recently Viewed Recipes')).toBeInTheDocument();
    expect(screen.getByText('Grilled Chicken Salad')).toBeInTheDocument();
    expect(screen.getByText('420 kcal/serving')).toBeInTheDocument();
  });

  it('renders both foods and recipes together', () => {
    const recipes = [
      { id: 2, title: 'Pasta', caloriesPerServing: 500, imageUrl: '' },
    ];
    renderWithProviders(
      <RecentFoods items={[mockFoodItem]} onAddFood={vi.fn()} recentRecipes={recipes} />,
    );
    expect(screen.getByText('Chicken Breast')).toBeInTheDocument();
    expect(screen.getByText('Pasta')).toBeInTheDocument();
  });
});

describe('NutritionLogPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedNutritionService.getDailyLog.mockResolvedValue(mockDailyLog);
    mockedNutritionService.getRecentFoods.mockResolvedValue([mockFoodItem]);
    vi.mocked(getRecentRecipes).mockReturnValue([]);
  });

  it('shows loading spinner while initial data is being fetched', () => {
    mockedNutritionService.getDailyLog.mockReturnValue(new Promise<DailyLog>(() => {}));
    renderWithProviders(<NutritionLogPage />);
    expect(screen.getByText('Loading nutrition log...')).toBeInTheDocument();
  });

  it('renders date navigator with Today badge after loading', async () => {
    renderWithProviders(<NutritionLogPage />);
    await waitFor(() => {
      expect(screen.getByText('Today')).toBeInTheDocument();
    });
  });

  it('renders water tracker section', async () => {
    renderWithProviders(<NutritionLogPage />);
    await waitFor(() => {
      expect(screen.getByText('Water')).toBeInTheDocument();
    });
  });

  it('renders all four meal timeline sections', async () => {
    renderWithProviders(<NutritionLogPage />);
    await waitFor(() => {
      expect(screen.getByText('Breakfast')).toBeInTheDocument();
      expect(screen.getByText('Lunch')).toBeInTheDocument();
      expect(screen.getByText('Dinner')).toBeInTheDocument();
      expect(screen.getByText('Snacks')).toBeInTheDocument();
    });
  });

  it('renders daily progress card with totals', async () => {
    renderWithProviders(<NutritionLogPage />);
    await waitFor(() => {
      expect(screen.getByText('Remaining')).toBeInTheDocument();
      expect(screen.getByText('Goal')).toBeInTheDocument();
    });
  });

  it('renders recent foods section', async () => {
    renderWithProviders(<NutritionLogPage />);
    await waitFor(() => {
      expect(screen.getByText('Recent')).toBeInTheDocument();
    });
  });

  it('calls getDailyLog and getRecentFoods on mount', async () => {
    renderWithProviders(<NutritionLogPage />);
    await waitFor(() => {
      expect(mockedNutritionService.getDailyLog).toHaveBeenCalledTimes(1);
      expect(mockedNutritionService.getRecentFoods).toHaveBeenCalledTimes(1);
    });
  });

  it('calls getRecentRecipes on mount', async () => {
    renderWithProviders(<NutritionLogPage />);
    await waitFor(() => {
      expect(getRecentRecipes).toHaveBeenCalledTimes(1);
    });
  });

  it('renders food items from daily log', async () => {
    renderWithProviders(<NutritionLogPage />);
    await waitFor(() => {
      expect(screen.getByText('1 serving(s)')).toBeInTheDocument();
    });
  });

  it('handles API error gracefully and shows empty meal sections', async () => {
    mockedNutritionService.getDailyLog.mockRejectedValue(new Error('Network error'));
    renderWithProviders(<NutritionLogPage />);
    await waitFor(() => {
      expect(screen.getByText('Nothing logged for breakfast yet.')).toBeInTheDocument();
    });
  });

  it('shows correct water intake from daily log', async () => {
    const logWithWater: DailyLog = {
      ...mockDailyLog,
      waterMl: 2000,
    };
    mockedNutritionService.getDailyLog.mockResolvedValue(logWithWater);
    renderWithProviders(<NutritionLogPage />);
    await waitFor(() => {
      expect(screen.getByText('Water')).toBeInTheDocument();
    });
  });
});
