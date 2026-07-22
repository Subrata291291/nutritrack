import { cn } from '@utils/cn';
import type { MacroConsistency } from 'types/insights';

interface NutritionalBalanceProps {
  data: MacroConsistency[];
}

const adherenceColors: Record<string, string> = {
  Calories: 'bg-primary',
  Protein: 'bg-primary-container',
  Carbs: 'bg-tertiary',
  Fats: 'bg-secondary-container',
};

export function NutritionalBalance({ data }: NutritionalBalanceProps) {
  return (
    <section className="col-span-12 md:col-span-7 bg-surface-container-lowest rounded-xl p-lg border border-outline-variant shadow-sm">
      <div className="flex items-center justify-between mb-lg">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">restaurant</span>
          <h3 className="font-headline-md text-headline-md text-on-surface">Nutritional Balance</h3>
        </div>
        <span className="material-symbols-outlined text-secondary cursor-pointer">info</span>
      </div>
      {data.length === 0 ? (
        <p className="text-center text-secondary py-8 font-body-sm text-body-sm">No nutrition data for this period</p>
      ) : (
        <div className="space-y-lg max-h-[420px] overflow-y-auto">
          {data.map((day) => (
            <div key={day.date} className="space-y-xs">
              <p className="font-label-sm text-label-sm text-secondary">
                {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
              </p>
              <div className="space-y-1.5">
                {[
                  { label: 'Calories', value: day.calorieAdherence },
                  { label: 'Protein', value: day.proteinAdherence },
                  { label: 'Carbs', value: day.carbsAdherence },
                  { label: 'Fats', value: day.fatsAdherence },
                ].map((macro) => (
                  <div key={macro.label} className="flex items-center gap-sm">
                    <span className="font-label-sm text-label-sm text-secondary w-16 shrink-0">{macro.label}</span>
                    <div className="flex-1 h-2.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full transition-all', adherenceColors[macro.label])}
                        style={{ width: `${Math.min(macro.value, 100)}%` }}
                      />
                    </div>
                    <span className="font-label-sm text-label-sm text-secondary w-10 text-right tabular-nums">{Math.round(macro.value)}%</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
