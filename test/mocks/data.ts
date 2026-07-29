import type { Recipe } from 'types/recipe';
import type { MealPlanDay, PlannedMeal } from 'types/meal-plan';
import type { DailyLog, MealEntry, FoodItem } from 'types/nutrition';
import type { UserProfile, UserSettings } from 'types/settings';
import type { AIGeneratedPlan, AIDayPlan, SwapAlternative, AISwapResponse } from 'types/ai-meal-plan';

export const mockRecipe: Recipe = {
  id: 1,
  title: 'Grilled Chicken Salad',
  description: 'A healthy grilled chicken salad with mixed greens.',
  imageUrl: '',
  prepTime: 15,
  cookTime: 12,
  servings: 2,
  caloriesPerServing: 420,
  proteinGrams: 38,
  carbsGrams: 12,
  fatsGrams: 22,
  fiberGrams: 4,
  tags: ['Quick', 'High Pro'],
  ingredients: [
    { id: 1, name: 'Chicken breast', quantity: '2 pieces' },
    { id: 2, name: 'Mixed greens', quantity: '4 cups' },
  ],
  instructions: [
    { step: 1, title: '', description: 'Season chicken. Grill for 5-6 minutes per side.' },
    { step: 2, title: '', description: 'Toss greens in a bowl.' },
  ],
};

export const mockRecipes: Recipe[] = [
  mockRecipe,
  { ...mockRecipe, id: 2, title: 'Vegan Buddha Bowl', tags: ['Vegan', 'Quick'] },
  { ...mockRecipe, id: 3, title: 'Protein Oatmeal', tags: ['Quick', 'High Pro'] },
];

export const mockCategories = [
  { id: 1, name: 'Quick', slug: 'quick', count: 5 },
  { id: 2, name: 'High Pro', slug: 'high-pro', count: 3 },
  { id: 3, name: 'Vegan', slug: 'vegan', count: 2 },
];

export const mockPlannedMeal: PlannedMeal = {
  id: 100,
  mealType: 'lunch',
  recipe: { id: 1, title: 'Grilled Chicken Salad', imageUrl: '', prepTime: 15, calories: 420, tags: ['Quick'] },
  calories: 420,
  proteinGrams: 38,
};

export const mockMealPlanDay: MealPlanDay = {
  date: '2026-07-27',
  dayName: 'Monday',
  meals: [mockPlannedMeal],
  totalCalories: 420,
  totalProtein: 38,
  totalCarbs: 12,
  totalFats: 22,
};

export const mockMealPlanDays: MealPlanDay[] = [
  mockMealPlanDay,
  { ...mockMealPlanDay, date: '2026-07-28', dayName: 'Tuesday', meals: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 },
];

export const mockFoodItem: FoodItem = {
  id: 10,
  name: 'Chicken Breast',
  servingSize: '100g',
  servingWeightGrams: 100,
  calories: 165,
  proteinGrams: 31,
  carbsGrams: 0,
  fatsGrams: 3.6,
  fiberGrams: 0,
  category: 'proteins',
};

export const mockMealEntry: MealEntry = {
  id: 200,
  mealType: 'lunch',
  foodItem: mockFoodItem,
  servings: 1,
  loggedAt: '2026-07-27T12:00:00',
};

export const mockDailyLog: DailyLog = {
  date: '2026-07-27',
  meals: [mockMealEntry],
  totalCalories: 165,
  totalProtein: 31,
  totalCarbs: 0,
  totalFats: 3.6,
  waterMl: 1500,
  steps: 5000,
};

export const mockUserProfile: UserProfile = {
  displayName: 'Test User',
  avatar: '',
  age: 30,
  gender: 'male',
  heightCm: 175,
  weightKg: 80,
  activityLevel: 'moderately-active',
  goal: 'maintain',
  targetWeightKg: 75,
};

export const mockUserSettings: UserSettings = {
  theme: 'light',
  notifications: true,
  units: 'metric',
};

export const mockAIDayPlan: AIDayPlan = {
  date: '2026-07-27',
  dayOfWeek: 'Monday',
  meals: [
    {
      mealType: 'breakfast',
      recipeId: 3,
      recipeName: 'Protein Oatmeal',
      calories: 380,
      proteinGrams: 32,
      carbsGrams: 44,
      fatsGrams: 8,
      servings: 1,
      ingredients: [],
      dietaryTags: [],
      reasoning: 'High protein breakfast to start the day.',
    },
    {
      mealType: 'lunch',
      recipeId: 1,
      recipeName: 'Grilled Chicken Salad',
      calories: 420,
      proteinGrams: 38,
      carbsGrams: 12,
      fatsGrams: 22,
      servings: 1,
      ingredients: [],
      dietaryTags: [],
      reasoning: 'Balanced protein lunch.',
    },
  ],
  dayTotals: { calories: 800, proteinGrams: 70, carbsGrams: 56, fatsGrams: 30 },
};

export const mockAIGeneratedPlan: AIGeneratedPlan = {
  days: [mockAIDayPlan],
  weeklyTotals: { calories: 5600, proteinGrams: 490, carbsGrams: 392, fatsGrams: 210 },
};

export const mockSwapAlternative: SwapAlternative = {
  recipeId: 2,
  recipeName: 'Vegan Buddha Bowl',
  imageUrl: '',
  calories: 510,
  proteinGrams: 18,
  carbsGrams: 68,
  fatsGrams: 16,
  confidence: 0.85,
  reasoning: 'Alternative high-fiber option.',
  servings: 1,
  prepTime: 15,
  dietaryTags: ['Vegan'],
  macroDifference: { calories: 90, proteinGrams: -20, carbsGrams: 56, fatsGrams: -6 },
};

export const mockSwapResponse: AISwapResponse = {
  success: true,
  data: {
    alternatives: [mockSwapAlternative],
    warnings: ['Higher in carbs than current meal.'],
  },
};

export const mockPlanResponse = {
  plan: mockAIGeneratedPlan,
  warnings: ['Some recipes may need adjustments.'],
  meta: { generatedAt: '2026-07-27T00:00:00Z', model: 'gpt-4o-mini', days: 7, mealsPerDay: 4 },
};
