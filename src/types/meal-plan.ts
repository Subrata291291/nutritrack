export interface MealPlanDay {
  date: string;
  dayName: string;
  meals: PlannedMeal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

import type { MealType } from './nutrition';

export interface PlannedMeal {
  id: number;
  mealType: MealType;
  recipe?: RecipeRef;
  time?: string;
  calories: number;
  proteinGrams: number;
}

export interface RecipeRef {
  id: number;
  title: string;
  imageUrl: string;
  prepTime: number;
  calories: number;
  tags: string[];
}

export interface ShoppingList {
  id: number;
  weekStart: string;
  items: ShoppingListItem[];
}

export interface ShoppingListItem {
  id: number;
  name: string;
  quantity: string;
  category: 'produce' | 'proteins' | 'dairy' | 'grains' | 'spices' | 'other';
  checked: boolean;
  days: string[];
}
