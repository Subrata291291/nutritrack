import type { Gender, ActivityLevel, GoalType } from './onboarding';

export interface UserSettings {
  notifications: boolean;
  theme: 'light' | 'dark' | 'system';
  units: 'metric' | 'imperial';
}

export interface UserProfile {
  displayName: string;
  avatar?: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  activityLevel: ActivityLevel;
  goal: GoalType;
  targetWeightKg: number;
}
