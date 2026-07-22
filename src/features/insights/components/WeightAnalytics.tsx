import { cn } from '@utils/cn';
import type { WeightEntry } from 'types/insights';

interface WeightAnalyticsProps {
  currentWeight: number;
  startWeight: number;
  targetWeight: number;
  weeklyChange: number;
  projectedGoalDate: string;
  entries: WeightEntry[];
}

export function WeightAnalytics({
  currentWeight,
  startWeight,
  targetWeight,
  weeklyChange,
  projectedGoalDate,
  entries,
}: WeightAnalyticsProps) {
  const weights = entries.map(e => e.weightKg);
  const minWeight = weights.length > 0 ? Math.min(...weights) : 0;
  const maxWeight = weights.length > 0 ? Math.max(...weights) : 0;
  const range = maxWeight - minWeight || 1;

  return (
    <section className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">monitor_weight</span>
          <h3 className="font-headline-md text-headline-md text-on-surface">Weight Analytics</h3>
        </div>
        <div className="flex items-center gap-lg">
          <div className="flex items-center gap-xs">
            <span className="w-3 h-3 rounded-full bg-primary-container" />
            <span className="font-label-sm text-label-sm text-secondary">Actual</span>
          </div>
          <div className="flex items-center gap-xs">
            <span className="w-3 h-3 rounded-full bg-secondary border border-secondary" />
            <span className="font-label-sm text-label-sm text-secondary">Trend (Smoothed)</span>
          </div>
        </div>
      </div>
      <div className="relative h-64 w-full bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
        {entries.length > 0 ? (
          <div className="absolute inset-0 flex items-end gap-[2px] p-4">
            {entries.map((entry, i) => {
              const heightPercent = ((entry.weightKg - minWeight) / range) * 70 + 15;
              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                  <div
                    className="w-full bg-primary-container rounded-t transition-all"
                    style={{ height: `${heightPercent}%` }}
                    title={`${entry.date}: ${entry.weightKg}kg`}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-secondary font-body-sm text-body-sm">
            No weight data available
          </div>
        )}
        <div className="absolute inset-0 flex flex-col justify-between py-xs pointer-events-none">
          <div className="border-b border-slate-200/50 w-full h-px" />
          <div className="border-b border-slate-200/50 w-full h-px" />
          <div className="border-b border-slate-200/50 w-full h-px" />
          <div className="border-b border-slate-200/50 w-full h-px" />
          <div className="border-b border-slate-200/50 w-full h-px" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md mt-sm">
        <div className="p-md bg-surface-container-low rounded-xl border border-outline-variant/30 flex flex-col items-center text-center">
          <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Current Weight</p>
          <p className="font-headline-lg text-headline-lg text-on-surface">{currentWeight} <span className="text-body-md font-normal text-secondary">kg</span></p>
          <div className={cn('flex items-center gap-xs font-bold', weeklyChange < 0 ? 'text-primary' : 'text-error')}>
            <span className="material-symbols-outlined text-sm">{weeklyChange < 0 ? 'trending_down' : 'trending_up'}</span>
            <span className="font-label-md text-label-md">{weeklyChange > 0 ? '+' : ''}{weeklyChange.toFixed(1)}kg this week</span>
          </div>
        </div>
        <div className="p-md bg-primary-container/10 rounded-xl border border-primary-container/20 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-xs">
            <span className="material-symbols-outlined text-primary opacity-20" style={{ fontSize: 48 }}>event_available</span>
          </div>
          <p className="font-label-sm text-label-sm text-primary uppercase tracking-wider">Projected Goal Date</p>
          <p className="font-headline-lg text-headline-lg text-on-primary-container">
            {projectedGoalDate
              ? new Date(projectedGoalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : '—'}
          </p>
          <p className="font-body-sm text-body-sm text-on-secondary-container">Based on {entries.length}-day trend</p>
        </div>
        <div className="p-md bg-surface-container-low rounded-xl border border-outline-variant/30 flex flex-col items-center text-center">
          <p className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">Progress</p>
          <p className="font-headline-lg text-headline-lg text-on-surface">{startWeight} <span className="text-body-md font-normal text-secondary">→ {targetWeight} kg</span></p>
          <p className="font-body-sm text-body-sm text-secondary">{Math.abs(currentWeight - startWeight).toFixed(1)}kg of {Math.abs(targetWeight - startWeight).toFixed(1)}kg</p>
        </div>
      </div>
    </section>
  );
}
