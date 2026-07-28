export interface AIMealEntry {
  mealId: number | null;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipeId: number;
  recipeName: string;
  servings: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  confidence: number;
  reasoning: string;
  warnings: string[];
}

export interface AIDayTotals {
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
}

export interface AIDayPlan {
  date: string;
  dayOfWeek: string;
  meals: AIMealEntry[];
  dayTotals: AIDayTotals;
  confidence: number;
  warnings: string[];
}

export interface AIGeneratedPlan {
  days: AIDayPlan[];
  overallConfidence: number;
  warnings: string[];
}

export interface AIPlanMeta {
  generatedAt: string;
  model: string;
  days: number;
  mealsPerDay: number;
}

export interface AIGenerateResponse {
  success: boolean;
  data: {
    plan: AIGeneratedPlan;
    warnings: string[];
    meta: AIPlanMeta;
  };
}

export interface SwapAlternative {
  recipeId: number;
  recipeName: string;
  imageUrl?: string;
  servings: number;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  confidence: number;
  reasoning: string;
}

export interface AISwapResponse {
  success: boolean;
  data: {
    alternatives: SwapAlternative[];
    warnings: string[];
  };
}