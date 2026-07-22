import { useState, useCallback, type ReactNode } from 'react';
import type { OnboardingData, OnboardingMetrics, ActivityLevel, GoalType, TDEEInfo } from 'types/onboarding';
import { calculateTDEE } from '@utils/tdee';
import { onboardingService } from '@services/onboarding.service';
import { OnboardingContext } from './OnboardingContext';

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<Partial<OnboardingData>>({});
  const [tdeeInfo, setTdeeInfo] = useState<TDEEInfo | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const setMetrics = useCallback((metrics: OnboardingMetrics) => {
    setData((prev) => ({ ...prev, metrics }));
  }, []);

  const setActivityLevel = useCallback((activityLevel: ActivityLevel) => {
    setData((prev) => ({ ...prev, activityLevel }));
  }, []);

  const setGoal = useCallback((goal: GoalType, targetWeightKg?: number) => {
    setData((prev) => ({ ...prev, goal, targetWeightKg }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 4));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(1, Math.min(step, 4)));
  }, []);

  const calculateResults = useCallback((): TDEEInfo => {
    if (!data.metrics || !data.activityLevel || !data.goal) {
      throw new Error('Incomplete onboarding data');
    }
    const info = calculateTDEE(data.metrics, data.activityLevel, data.goal, data.targetWeightKg);
    setTdeeInfo(info);
    return info;
  }, [data]);

  const submitToApi = useCallback(async (): Promise<boolean> => {
    if (!data.metrics || !data.activityLevel || !data.goal || !tdeeInfo) {
      setSubmitError('Incomplete onboarding data');
      return false;
    }
    setSubmitting(true);
    setSubmitError(null);
    try {
      await onboardingService.saveMetrics(data.metrics);
      await onboardingService.calculateTDEE({
        metrics: data.metrics,
        activityLevel: data.activityLevel,
        goal: data.goal,
        targetWeightKg: data.targetWeightKg,
      } as OnboardingData);
      await onboardingService.complete({
        onboardingData: data,
        tdeeInfo,
      });
      localStorage.setItem('onboarding_completed', 'true');
      return true;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [data, tdeeInfo]);

  const reset = useCallback(() => {
    setData({});
    setTdeeInfo(null);
    setCurrentStep(1);
    setSubmitError(null);
  }, []);

  return (
    <OnboardingContext.Provider
      value={{
        data,
        tdeeInfo,
        currentStep,
        submitting,
        submitError,
        setMetrics,
        setActivityLevel,
        setGoal,
        nextStep,
        prevStep,
        goToStep,
        calculateResults,
        reset,
        submitToApi,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}
