export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';

export type ActivityLevel =
  | 'sedentary'
  | 'lightly-active'
  | 'moderately-active'
  | 'very-active'
  | 'extra-active';

export type GoalType = 'lose-weight' | 'maintain' | 'gain-muscle';

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
