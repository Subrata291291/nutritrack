interface DailyProgressCardProps {
  totals: { calories: number; protein: number; carbs: number; fats: number };
  targets: { calories: number; protein: number; carbs: number; fats: number };
}

const macroConfig = [
  { key: 'protein' as const, label: 'Protein', unit: 'g', color: 'stroke-tertiary-container', bg: 'bg-tertiary-container/20', text: 'text-tertiary-container', bar: 'bg-tertiary-container' },
  { key: 'carbs' as const, label: 'Carbs', unit: 'g', color: 'stroke-primary', bg: 'bg-primary/10', text: 'text-primary', bar: 'bg-primary' },
  { key: 'fats' as const, label: 'Fats', unit: 'g', color: 'stroke-secondary', bg: 'bg-secondary/10', text: 'text-secondary', bar: 'bg-secondary' },
];

export function DailyProgressCard({ totals, targets }: DailyProgressCardProps) {
  const pct = targets.calories > 0 ? Math.min(totals.calories / targets.calories, 1) : 0;
  const remaining = Math.max(targets.calories - totals.calories, 0);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference * (1 - pct);

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-xl shadow-sm">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-xl">
        {/* Donut chart */}
        <div className="flex-shrink-0 relative">
          <svg width="140" height="140" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" strokeWidth="10" className="stroke-surface-container-highest" />
            <circle
              cx="60" cy="60" r="54" fill="none" strokeWidth="10"
              className="stroke-primary drop-shadow-[0_0_6px_rgba(98,177,111,0.3)]"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              transform="rotate(-90, 60, 60)"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-headline-lg font-bold text-on-surface">{Math.round(totals.calories).toLocaleString()}</span>
            <span className="text-label-sm text-on-surface-variant">kcal</span>
          </div>
        </div>

        {/* Remaining + macros */}
        <div className="flex-1 w-full sm:w-auto space-y-4">
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-label-sm uppercase tracking-widest text-on-surface-variant">Remaining</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-headline-lg font-bold text-on-surface">{remaining.toLocaleString()}</span>
                <span className="text-body-md text-on-surface-variant">kcal</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-label-sm uppercase tracking-widest text-on-surface-variant">Goal</span>
              <p className="text-headline-sm font-bold text-on-surface">{targets.calories.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {macroConfig.map((m) => {
              const val = totals[m.key];
              const goal = targets[m.key];
              const p = goal > 0 ? Math.min(val / goal, 1) : 0;
              return (
                <div key={m.key}>
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${m.bar}`} />
                      <span className="text-label-sm text-on-surface-variant">{m.label}</span>
                    </div>
                    <span className="text-label-sm font-semibold">
                      <span className="text-on-surface">{Math.round(val)}</span>
                      <span className="text-on-surface-variant"> / {goal}{m.unit}</span>
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${m.bar}`} style={{ width: `${p * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
