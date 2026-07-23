export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface FoodItem {
  id: number;
  name: string;
  servingSize: string;
  servingWeightGrams: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams?: number;
  icon?: string;
  imageUrl?: string;
  category?: string;
}

export interface MealEntry {
  id: number;
  mealType: MealType;
  foodItem: FoodItem;
  servings: number;
  loggedAt: string;
}

export interface DailyLog {
  date: string;
  meals: MealEntry[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
  waterMl: number;
  steps?: number;
}

export interface NutritionTargets {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  waterMl: number;
}
