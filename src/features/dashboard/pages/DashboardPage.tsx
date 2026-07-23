import { useState, useEffect } from 'react';
import { useAuth } from '@hooks/useAuth';
import { nutritionService } from '@services/nutrition.service';
import { insightsService } from '@services/insights.service';
import { userService } from '@services/user.service';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import { toLocalDateString } from '@utils/format';
import { DailyOverview } from '../components/DailyOverview';
import { MacroBreakdown } from '../components/MacroBreakdown';
import { WeightTrendChart } from '../components/WeightTrendChart';
import { NextMealWidget } from '../components/NextMealWidget';
import { QuickStats } from '../components/QuickStats';
import type { DailyLog } from 'types/nutrition';
import type { WeightAnalytics, Insight } from 'types/insights';
import type { UserProfile } from 'types/settings';

export function DashboardPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [weightAnalytics, setWeightAnalytics] = useState<WeightAnalytics | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const today = toLocalDateString(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [log, analytics, smartInsights, userProfile] = await Promise.all([
          nutritionService.getDailyLog(today),
          insightsService.getWeightAnalytics(),
          insightsService.getSmartInsights(),
          userService.getProfile(),
        ]);
        setDailyLog(log);
        setWeightAnalytics(analytics);
        setInsights(smartInsights);
        setProfile(userProfile);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [today]);

  const displayName = user?.displayName || profile?.displayName || 'there';
  const remainingCalories = dailyLog
    ? Math.max(0, 2200 - dailyLog.totalCalories)
    : 0;

  if (loading) {
    return (
      <div className="bg-background min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your dashboard..." />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      <section className="mb-8">
        <h2 className="text-2xl md:text-[32px] font-bold text-on-surface mb-1">Welcome back, {displayName}!</h2>
        {dailyLog && (
          <p className="text-base text-on-surface-variant">
            {remainingCalories > 0
              ? `You're ${remainingCalories} calories away from your daily metabolic goal. Keep it up!`
              : 'You\'ve met your daily calorie goal! Great job!'}
          </p>
        )}
      </section>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <DailyOverview dailyLog={dailyLog} />
        </div>

        <div className="col-span-12 lg:col-span-4">
          <MacroBreakdown dailyLog={dailyLog} />
        </div>

        <WeightTrendChart
          entries={weightAnalytics?.entries}
          targetWeight={weightAnalytics?.targetWeight}
          startWeight={weightAnalytics?.startWeight}
        />

        <NextMealWidget meals={dailyLog?.meals} />

        <QuickStats insights={insights} weightAnalytics={weightAnalytics} />
      </div>
    </div>
  );
}
