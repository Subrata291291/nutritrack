import { createContext } from 'react';
import type { OnboardingData, OnboardingMetrics, ActivityLevel, GoalType, TDEEInfo } from 'types/onboarding';

export interface OnboardingContextValue {
  data: Partial<OnboardingData>;
  tdeeInfo: TDEEInfo | null;
  currentStep: number;
  submitting: boolean;
  submitError: string | null;
  setMetrics: (metrics: OnboardingMetrics) => void;
  setActivityLevel: (level: ActivityLevel) => void;
  setGoal: (goal: GoalType, targetWeightKg?: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  calculateResults: () => TDEEInfo;
  reset: () => void;
  submitToApi: () => Promise<boolean>;
}

export const OnboardingContext = createContext<OnboardingContextValue | null>(null);
