import { ProgressBar } from '@components/ui';

interface DailySummaryBarProps {
  totals: { calories: number; protein: number; carbs: number; fats: number };
  targets: { calories: number; protein: number; carbs: number; fats: number };
}

export function DailySummaryBar({ totals, targets }: DailySummaryBarProps) {
  const remaining = targets.calories - totals.calories;

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-sm">
      <div className="grid grid-cols-12 gap-xl">
        <div className="col-span-3 border-r border-outline-variant/50">
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest mb-1">Calories Remaining</p>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-xl text-headline-xl text-primary">{Math.max(0, remaining).toLocaleString()}</span>
            <span className="font-body-md text-body-md text-on-surface-variant">kcal</span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{targets.calories.toLocaleString()} Goal - {totals.calories.toLocaleString()} Food</p>
        </div>
        <div className="col-span-9 flex items-center justify-between gap-xl">
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="font-label-md text-label-md">Carbs</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">{Math.round(totals.carbs)}g / {targets.carbs}g</span>
            </div>
            <ProgressBar progress={targets.carbs > 0 ? Math.round((totals.carbs / targets.carbs) * 100) : 0} barClassName="bg-primary" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="font-label-md text-label-md">Protein</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">{Math.round(totals.protein)}g / {targets.protein}g</span>
            </div>
            <ProgressBar progress={targets.protein > 0 ? Math.round((totals.protein / targets.protein) * 100) : 0} barClassName="bg-tertiary-container" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between mb-2">
              <span className="font-label-md text-label-md">Fats</span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">{Math.round(totals.fats)}g / {targets.fats}g</span>
            </div>
            <ProgressBar progress={targets.fats > 0 ? Math.round((totals.fats / targets.fats) * 100) : 0} barClassName="bg-secondary" />
          </div>
        </div>
      </div>
    </section>
  );
}
