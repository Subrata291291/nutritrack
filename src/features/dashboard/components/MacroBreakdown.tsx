import type { DailyLog } from 'types/nutrition';

interface MacroBarProps {
  label: string;
  percent: number;
  barColor: string;
}

function MacroBar({ label, percent, barColor }: MacroBarProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-semibold tracking-wider">{label}</span>
        <span className="text-sm font-bold">{percent}%</span>
      </div>
      <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
        <div className={`h-full ${barColor} rounded-full`} style={{ width: `${Math.min(percent, 100)}%` }} />
      </div>
    </div>
  );
}

interface MacroBreakdownProps {
  dailyLog?: DailyLog | null;
}

export function MacroBreakdown({ dailyLog }: MacroBreakdownProps) {
  const total = dailyLog
    ? dailyLog.totalProtein + dailyLog.totalCarbs + dailyLog.totalFats
    : 0;

  const proteinPct = total > 0 ? Math.round((dailyLog!.totalProtein / total) * 100) : 40;
  const carbsPct = total > 0 ? Math.round((dailyLog!.totalCarbs / total) * 100) : 35;
  const fatsPct = total > 0 ? Math.round((dailyLog!.totalFats / total) * 100) : 25;

  const macrosData = [
    { label: 'Proteins', percent: proteinPct, barColor: 'bg-secondary' },
    { label: 'Carbs', percent: carbsPct, barColor: 'bg-primary-container' },
    { label: 'Fats', percent: fatsPct, barColor: 'bg-tertiary-container' },
  ];

  return (
    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.05)] border border-outline-variant flex flex-col">
      <h3 className="text-[24px] font-semibold mb-6">Macro Breakdown</h3>
      <div className="space-y-6 flex-grow flex flex-col justify-center">
        {macrosData.map((macro) => (
          <MacroBar key={macro.label} label={macro.label} percent={macro.percent} barColor={macro.barColor} />
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-outline-variant grid grid-cols-3 gap-2 text-center">
        <div>
          <p className="text-[10px] text-on-surface-variant uppercase font-bold">Current</p>
          <p className="text-sm font-semibold tracking-wider">{dailyLog ? `${Math.round(dailyLog.totalCalories)} kcal` : '--'}</p>
        </div>
        <div>
          <p className="text-[10px] text-on-surface-variant uppercase font-bold">Total</p>
          <p className="text-sm font-semibold tracking-wider">{dailyLog ? `${Math.round(total)}g` : '--'}</p>
        </div>
        <div>
          <p className="text-[10px] text-on-surface-variant uppercase font-bold">Meals</p>
          <p className="text-sm font-semibold tracking-wider text-primary">{dailyLog ? dailyLog.meals.length : 0} logged</p>
        </div>
      </div>
    </section>
  );
}
