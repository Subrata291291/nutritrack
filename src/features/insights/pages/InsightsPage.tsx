import { useState, useEffect } from 'react';
import { WeightAnalytics } from '../components/WeightAnalytics';
import { SmartInsights } from '../components/SmartInsights';
import { NutritionalBalance } from '../components/NutritionalBalance';
import { Milestones } from '../components/Milestones';
import { TimeRangeSelector } from '../components/TimeRangeSelector';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import { insightsService } from '@services/insights.service';
import type { WeightAnalytics as WeightAnalyticsData, MacroConsistency, Milestone as MilestoneData, Insight } from 'types/insights';

const DEFAULT_WEIGHT_ANALYTICS: WeightAnalyticsData = {
  currentWeight: 0,
  startWeight: 0,
  targetWeight: 0,
  weeklyChange: 0,
  projectedGoalDate: '',
  entries: [],
};

export function InsightsPage() {
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);
  const [weightAnalytics, setWeightAnalytics] = useState<WeightAnalyticsData>(DEFAULT_WEIGHT_ANALYTICS);
  const [macroConsistency, setMacroConsistency] = useState<MacroConsistency[]>([]);
  const [milestones, setMilestones] = useState<MilestoneData[]>([]);
  const [smartInsights, setSmartInsights] = useState<Insight[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      try {
        if (!cancelled) setLoading(true);
        const [weight, macros, milestoneData, insights] = await Promise.all([
          insightsService.getWeightAnalytics(),
          insightsService.getMacroConsistency(timeRange),
          insightsService.getMilestones(),
          insightsService.getSmartInsights(),
        ]);
        if (!cancelled) {
          setWeightAnalytics(weight ?? DEFAULT_WEIGHT_ANALYTICS);
          setMacroConsistency(Array.isArray(macros) ? macros : []);
          setMilestones(Array.isArray(milestoneData) ? milestoneData : []);
          setSmartInsights(Array.isArray(insights) ? insights : []);
        }
      } catch {
        // On error keep defaults so the page still renders
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchAll();
    return () => { cancelled = true; };
  }, [timeRange]);

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      <div className="p-margin-mobile md:p-margin-desktop space-y-xl max-w-7xl mx-auto w-full">
        {/* Heading always visible — not inside loading gate */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Health Insights</h2>
            <p className="font-body-md text-body-md text-secondary">A comprehensive view of your physiological and nutritional progress.</p>
          </div>
          <TimeRangeSelector selected={timeRange} onChange={setTimeRange} />
        </div>
        {loading ? (
          <div className="flex items-center justify-center min-h-[calc(100vh-16rem)]">
            <LoadingSpinner size="lg" text="Loading insights..." />
          </div>
        ) : (
          <div className="grid grid-cols-12 gap-gutter">
            <WeightAnalytics {...weightAnalytics} />
            <SmartInsights insights={smartInsights} />
            <NutritionalBalance data={macroConsistency} />
            <Milestones milestones={milestones} />
          </div>
        )}
      </div>
    </div>
  );
}
