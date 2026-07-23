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
        {/* Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-md">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shadow-sm flex-shrink-0">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
            </div>
            <div>
              <h2 className="text-headline-sm sm:text-headline-lg font-bold text-on-surface">Health Insights</h2>
              <p className="text-body-sm sm:text-body-md text-on-surface-variant">A comprehensive view of your physiological and nutritional progress.</p>
            </div>
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
