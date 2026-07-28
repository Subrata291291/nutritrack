export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly-active'
  | 'moderately-active'
  | 'very-active'
  | 'extra-active';

export type GoalType = 'lose-weight' | 'maintain' | 'gain-muscle';

export type DietType = 'none' | 'vegetarian' | 'vegan' | 'keto' | 'paleo';

export type AllergyType = 'milk' | 'eggs' | 'peanuts' | 'seafood' | 'soy' | 'wheat' | 'tree-nuts';

export type CuisineType = 'indian' | 'chinese' | 'italian' | 'mediterranean' | 'mexican';

export type CookingSkill = 'beginner' | 'intermediate' | 'advanced';

export interface OnboardingPreferences {
  diet: DietType;
  allergies: AllergyType[];
  cuisine: CuisineType;
  cookingSkill: CookingSkill;
  budget?: number;
}

export interface OnboardingMetrics {
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
}

export interface OnboardingData {
  metrics: OnboardingMetrics;
  activityLevel: ActivityLevel;
  goal: GoalType;
  targetWeightKg?: number;
  weeklyPace?: number;
  preferences?: OnboardingPreferences;
}

export interface TDEEInfo {
  tdee: number;
  bmr: number;
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  projectedGoalDate?: string;
}
