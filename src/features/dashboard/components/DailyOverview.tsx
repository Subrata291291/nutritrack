import type { DailyLog } from 'types/nutrition';

interface DailyOverviewProps {
  dailyLog?: DailyLog | null;
}

const calGoal = 2200;
const proteinGoal = 160;
const carbsGoal = 280;
const fatsGoal = 75;
const waterGoal = 2500;

function RingSVG({ pct, size = 160, strokeWidth = 10, color = 'stroke-primary', glow = false }: { pct: number; size?: number; strokeWidth?: number; color?: string; glow?: boolean }) {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(pct, 1));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={strokeWidth} className="stroke-surface-container-highest" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={strokeWidth} className={color} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.8s ease', filter: glow ? 'drop-shadow(0 0 6px rgba(98,177,111,0.35))' : undefined }}
      />
    </svg>
  );
}

export function DailyOverview({ dailyLog }: DailyOverviewProps) {
  const cal = dailyLog?.totalCalories ?? 0;
  const protein = dailyLog?.totalProtein ?? 0;
  const carbs = dailyLog?.totalCarbs ?? 0;
  const fats = dailyLog?.totalFats ?? 0;
  const water = dailyLog?.waterMl ?? 0;
  const steps = dailyLog?.steps ?? 0;
  const mealsCount = dailyLog?.meals?.length ?? 0;

  const calPct = calGoal > 0 ? Math.min(cal / calGoal, 1) : 0;
  const remaining = Math.max(calGoal - cal, 0);

  const totalMacro = protein + carbs + fats || 1;
  const pctProtein = Math.round((protein / totalMacro) * 100);
  const pctCarbs = Math.round((carbs / totalMacro) * 100);
  const pctFats = Math.round((fats / totalMacro) * 100);

  const waterPct = Math.min(water / waterGoal, 1);
  const stepPct = Math.min(steps / 10000, 1);

  const statusKey = cal === 0 ? 'empty' : calPct >= 0.9 ? 'great' : calPct >= 0.5 ? 'good' : 'progress';
  const statusMsg: Record<string, { msg: string; emoji: string }> = {
    empty: { msg: 'Start tracking your meals', emoji: '🍽️' },
    progress: { msg: `${Math.round(calPct * 100)}% of daily goal — keep going!`, emoji: '🔥' },
    good: { msg: 'More than halfway there!', emoji: '💪' },
    great: { msg: 'Almost at your goal!', emoji: '⭐' },
  };
  const status = statusMsg[statusKey];

  return (
    <section className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-[0px_4px_12px_rgba(0,0,0,0.04)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-xl pt-4 sm:pt-xl pb-4 sm:pb-lg">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>today</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-headline-sm sm:text-headline-md font-bold text-on-surface truncate">Daily Overview</h2>
            <p className="text-body-sm text-on-surface-variant truncate">{status.emoji} {status.msg}</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-label-sm font-semibold flex-shrink-0">Today</span>
      </div>

      {/* Main content */}
      <div className="px-4 sm:px-xl pb-4 sm:pb-xl">
        <div className="flex flex-col lg:flex-row items-stretch gap-4 sm:gap-xl">
          {/* Left: calorie ring + remaining */}
          <div className="flex flex-col items-center justify-center sm:min-w-[200px]">
            <div className="relative">
              <RingSVG pct={calPct} size={168} strokeWidth={12} color="stroke-primary" glow />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[36px] font-bold text-on-surface leading-none">{cal.toLocaleString()}</span>
                <span className="text-label-sm text-on-surface-variant mt-0.5">kcal</span>
              </div>
            </div>
            <div className="flex items-baseline gap-1.5 mt-3">
              <span className="text-headline-md font-bold text-primary">{remaining.toLocaleString()}</span>
              <span className="text-label-sm text-on-surface-variant">remaining</span>
            </div>
            <p className="text-label-sm text-on-surface-variant mt-0.5">of {calGoal.toLocaleString()} goal</p>
          </div>

          {/* Center: macro bars */}
          <div className="flex-1 space-y-4 py-2">
            <h3 className="text-label-sm uppercase tracking-widest text-on-surface-variant font-bold">Macronutrients</h3>
            {[
              { label: 'Protein', value: protein, goal: proteinGoal, pct: Math.min(protein / proteinGoal, 1), color: 'bg-tertiary-container', dot: 'bg-tertiary-container' },
              { label: 'Carbs', value: carbs, goal: carbsGoal, pct: Math.min(carbs / carbsGoal, 1), color: 'bg-primary', dot: 'bg-primary' },
              { label: 'Fats', value: fats, goal: fatsGoal, pct: Math.min(fats / fatsGoal, 1), color: 'bg-secondary', dot: 'bg-secondary' },
            ].map((m) => (
              <div key={m.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${m.dot}`} />
                    <span className="text-body-sm font-semibold text-on-surface">{m.label}</span>
                  </div>
                  <span className="text-label-sm">
                    <span className="font-semibold text-on-surface">{Math.round(m.value)}</span>
                    <span className="text-on-surface-variant"> / {m.goal}g</span>
                  </span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-500 ${m.color}`} style={{ width: `${Math.min(m.pct * 100, 100)}%` }} />
                </div>
              </div>
            ))}

            {/* Macro distribution donut */}
            <div className="flex items-center gap-4 pt-3">
              <div className="relative w-14 h-14 flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="23" fill="none" strokeWidth="5" className="stroke-surface-container-highest" />
                  <circle cx="28" cy="28" r="23" fill="none" strokeWidth="5" className="stroke-tertiary-container" strokeLinecap="round"
                    strokeDasharray={`${(pctProtein / 100) * 144.5} 144.5`} />
                  <circle cx="28" cy="28" r="23" fill="none" strokeWidth="5" className="stroke-primary" strokeLinecap="round"
                    strokeDasharray={`${(pctCarbs / 100) * 144.5} 144.5`} strokeDashoffset={`-${(pctProtein / 100) * 144.5}`} />
                  <circle cx="28" cy="28" r="23" fill="none" strokeWidth="5" className="stroke-secondary" strokeLinecap="round"
                    strokeDasharray={`${(pctFats / 100) * 144.5} 144.5`} strokeDashoffset={`-${((pctProtein + pctCarbs) / 100) * 144.5}`} />
                </svg>
              </div>
              <div className="flex gap-4 text-label-sm">
                {[
                  { label: 'Protein', pct: pctProtein, dot: 'bg-tertiary-container' },
                  { label: 'Carbs', pct: pctCarbs, dot: 'bg-primary' },
                  { label: 'Fats', pct: pctFats, dot: 'bg-secondary' },
                ].map((m) => (
                  <div key={m.label} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${m.dot}`} />
                    <span className="text-on-surface-variant">{m.pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: mini stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            {[
              { icon: 'restaurant', label: 'Meals', value: `${mealsCount}`, sub: 'logged today', ring: false },
              { icon: 'water_drop', label: 'Water', value: `${(water / 1000).toFixed(1)}L`, sub: `${Math.round(waterPct * 100)}% of goal`, ring: true, pct: waterPct, ringColor: 'stroke-info' },
              { icon: 'directions_run', label: 'Steps', value: steps.toLocaleString(), sub: `${Math.round(stepPct * 100)}% of 10k`, ring: true, pct: stepPct, ringColor: 'stroke-tertiary' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 bg-surface-container-low rounded-xl px-4 py-3 border border-outline-variant/50">
                {stat.ring ? (
                  <div className="relative w-10 h-10 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="16" fill="none" strokeWidth="4" className="stroke-surface-container-highest" />
                      <circle cx="20" cy="20" r="16" fill="none" strokeWidth="4" className={stat.ringColor} strokeLinecap="round"
                        strokeDasharray={`${(stat.pct || 0) * 100.5} 100.5`} style={{ transition: 'stroke-dasharray 0.6s ease' }} />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px] text-on-surface-variant">{stat.icon}</span>
                    </div>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-primary text-[20px]">{stat.icon}</span>
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-body-sm font-bold text-on-surface leading-tight">{stat.value}</p>
                  <p className="text-label-sm text-on-surface-variant truncate">{stat.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
