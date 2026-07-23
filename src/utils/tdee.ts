import { toLocalDateString } from '@utils/format';
import type { OnboardingMetrics, ActivityLevel, GoalType, TDEEInfo } from 'types/onboarding';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  'lightly-active': 1.375,
  'moderately-active': 1.55,
  'very-active': 1.725,
  'extra-active': 1.9,
};

const GOAL_CALORIE_ADJUSTMENTS: Record<GoalType, number> = {
  'lose-weight': -500,
  maintain: 0,
  'gain-muscle': 300,
};

export function calculateBMR(metrics: OnboardingMetrics): number {
  const { age, gender, heightCm, weightKg } = metrics;
  if (gender === 'female') {
    return 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;
  }
  return 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age;
}

export function calculateTDEE(
  metrics: OnboardingMetrics,
  activityLevel: ActivityLevel,
  goal: GoalType,
  targetWeightKg?: number
): TDEEInfo {
  const bmr = calculateBMR(metrics);
  const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
  const targetCalories = Math.round(tdee + GOAL_CALORIE_ADJUSTMENTS[goal]);

  const proteinGrams = Math.round((targetCalories * 0.3) / 4);
  const carbsGrams = Math.round((targetCalories * 0.4) / 4);
  const fatsGrams = Math.round((targetCalories * 0.3) / 9);

  let projectedGoalDate: string | undefined;
  if (goal === 'lose-weight' && targetWeightKg && metrics.weightKg > targetWeightKg) {
    const kgToLose = metrics.weightKg - targetWeightKg;
    const weeksToGoal = Math.round(kgToLose / 0.5);
    const goalDate = new Date();
    goalDate.setDate(goalDate.getDate() + weeksToGoal * 7);
    projectedGoalDate = toLocalDateString(goalDate);
  }

  return {
    tdee,
    bmr: Math.round(bmr),
    targetCalories,
    proteinGrams,
    carbsGrams,
    fatsGrams,
    projectedGoalDate,
  };
}
