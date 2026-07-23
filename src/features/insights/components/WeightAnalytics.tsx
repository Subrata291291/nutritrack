import type { WeightEntry } from 'types/insights';

interface WeightAnalyticsProps {
  currentWeight: number;
  startWeight: number;
  targetWeight: number;
  weeklyChange: number;
  projectedGoalDate: string;
  entries: WeightEntry[];
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
}

function GaugeRing({ pct, size = 60, stroke = 5, color = 'stroke-primary' }: { pct: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(pct, 1));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90 flex-shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-surface-container-highest" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className={color} strokeLinecap="round"
        strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
    </svg>
  );
}

export function WeightAnalytics({ currentWeight, startWeight, targetWeight, weeklyChange, projectedGoalDate, entries }: WeightAnalyticsProps) {
  const weights = entries.map(e => e.weightKg);
  const minW = weights.length > 0 ? Math.min(...weights) - 0.5 : 0;
  const maxW = weights.length > 0 ? Math.max(...weights) + 0.5 : 1;
  const range = maxW - minW || 1;

  const chartW = 800;
  const chartH = 200;
  const pad = { top: 20, bottom: 36, left: 10, right: 10 };
  const innerW = chartW - pad.left - pad.right;
  const innerH = chartH - pad.top - pad.bottom;

  const xScale = (i: number) => pad.left + (entries.length > 1 ? (i / (entries.length - 1)) * innerW : innerW / 2);
  const yScale = (w: number) => pad.top + innerH - ((w - minW) / range) * innerH;

  const points = entries.map((e, i) => `${xScale(i)},${yScale(e.weightKg)}`);
  const linePath = points.length > 0 ? `M${points.join(' L')}` : '';
  const areaPath = points.length > 0 ? `${linePath} L${xScale(entries.length - 1)},${chartH} L${xScale(0)},${chartH} Z` : '';

  const targetY = targetWeight > 0 ? yScale(targetWeight) : null;
  const startY = startWeight > 0 ? yScale(startWeight) : null;

  const labelIndices = entries.length <= 5
    ? entries.map((_, i) => i)
    : [0, Math.floor(entries.length / 2), entries.length - 1];

  const totalLoss = startWeight - currentWeight;
  const progressPct = (startWeight - targetWeight) > 0
    ? Math.min(Math.max(totalLoss / (startWeight - targetWeight), 0), 1)
    : 0;

  const lossPct = Math.abs(weeklyChange) > 0
    ? Math.min(Math.abs(weeklyChange) / 1.5, 1)
    : 0;

  const calPct = targetWeight > 0 && startWeight > 0
    ? Math.min(Math.abs(currentWeight - startWeight) / Math.abs(targetWeight - startWeight), 1)
    : 0;

  return (
    <section className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
      {/* Chart area */}
      <div className="p-4 sm:p-xl pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-lg gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400/20 to-emerald-400/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-500">monitor_weight</span>
            </div>
            <div>
              <h3 className="text-headline-sm sm:text-headline-md font-bold text-on-surface">Weight Analytics</h3>
              <p className="text-body-sm text-on-surface-variant">
                {entries.length >= 2
                  ? `Last ${entries.length} entries`
                  : 'Tracking your progress'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-label-sm">
            {[
              { label: 'Weight', dot: 'bg-emerald-500' },
              ...(targetY != null ? [{ label: 'Goal', dot: 'border-2 border-dashed border-emerald-500 bg-transparent' }] : []),
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className={`w-2.5 h-2.5 rounded-full ${l.dot}`} />
                <span className="text-on-surface-variant">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart with "grid paper" background */}
        <div className="h-52 w-full relative rounded-xl overflow-hidden bg-gradient-to-b from-surface-container-low/50 to-transparent">
          {/* Grid dots pattern */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'radial-gradient(circle, var(--color-on-surface) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          {entries.length > 0 ? (
            <svg className="w-full h-full overflow-visible relative z-10" viewBox={`0 0 ${chartW} ${chartH}`}>
              <defs>
                <linearGradient id="waGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-emerald-500)" stopOpacity="0.12" />
                  <stop offset="100%" stopColor="var(--color-emerald-500)" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[0.25, 0.5, 0.75].map((f, i) => (
                <line key={i} x1={pad.left} x2={chartW - pad.right} y1={pad.top + innerH * f} y2={pad.top + innerH * f}
                  stroke="var(--color-outline-variant)" strokeWidth="1" strokeDasharray="4,4" opacity="0.3" />
              ))}
              {/* Target line */}
              {targetY != null && (
                <line x1={pad.left} x2={chartW - pad.right} y1={targetY} y2={targetY}
                  stroke="var(--color-emerald-500)" strokeWidth="2" strokeDasharray="8,4" opacity="0.4" />
              )}
              {/* Area */}
              <path d={areaPath} fill="url(#waGrad)" />
              {/* Line */}
              <path d={linePath} fill="none" stroke="var(--color-emerald-500)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 2px 4px rgba(16,185,129,0.2))' }} />
              {/* Dots */}
              {entries.map((e, i) => (
                <circle key={e.date} cx={xScale(i)} cy={yScale(e.weightKg)} r={i === entries.length - 1 ? 6 : 4}
                  fill="var(--color-emerald-500)" stroke="var(--color-surface-container-lowest)" strokeWidth="2.5"
                  className={i === entries.length - 1 ? 'drop-shadow-md' : ''} />
              ))}
            </svg>
          ) : (
            <div className="h-full flex items-center justify-center text-body-md text-on-surface-variant relative z-10">
              <div className="flex flex-col items-center gap-2">
                <span className="material-symbols-outlined text-[40px] opacity-30">monitor_weight</span>
                <p>No weight data available</p>
              </div>
            </div>
          )}
          {entries.length > 0 && (
            <div className="absolute -bottom-1 left-0 right-0 flex justify-between px-2 relative z-10">
              {labelIndices.map(i => (
                <span key={entries[i].date} className="text-label-sm text-on-surface-variant/60">{formatDate(entries[i].date)}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dashboard gauges row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-outline-variant/30 mt-4 sm:mt-xl">
        {/* Current */}
        <div className="bg-surface-container-lowest px-4 py-4 sm:px-xl sm:py-lg flex flex-col items-center text-center">
          <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Current</p>
          <div className="relative mb-3">
            <GaugeRing pct={calPct} size={72} stroke={6} color="stroke-emerald-500" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-body-lg font-bold text-on-surface">{currentWeight.toFixed(1)}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 text-label-sm font-semibold"
            style={{ color: weeklyChange < 0 ? 'var(--color-emerald-500)' : 'var(--color-error)' }}>
            <span className="material-symbols-outlined text-[14px]">{weeklyChange < 0 ? 'trending_down' : 'trending_up'}</span>
            <span>{weeklyChange > 0 ? '+' : ''}{weeklyChange.toFixed(1)}kg this week</span>
          </div>
        </div>

        {/* Goal date */}
        <div className="bg-surface-container-lowest px-4 py-4 sm:px-xl sm:py-lg flex flex-col items-center text-center">
          <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Goal ETA</p>
          <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-br from-emerald-400/10 to-emerald-400/5 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[32px] text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
          </div>
          <p className="text-body-lg font-bold text-on-surface">
            {projectedGoalDate
              ? new Date(projectedGoalDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : '—'}
          </p>
          <p className="text-label-sm text-on-surface-variant">{entries.length}-day trend</p>
        </div>

        {/* Progress */}
        <div className="bg-surface-container-lowest px-4 py-4 sm:px-xl sm:py-lg flex flex-col items-center text-center">
          <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-2">Progress</p>
          <div className="relative mb-3">
            <GaugeRing pct={progressPct} size={72} stroke={6} color="stroke-violet-400" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-body-lg font-bold text-on-surface">{Math.round(progressPct * 100)}%</span>
            </div>
          </div>
          <p className="text-body-sm font-semibold text-on-surface">
            {Math.abs(totalLoss).toFixed(1)} <span className="text-label-sm font-normal text-on-surface-variant">of {Math.abs(targetWeight - startWeight).toFixed(1)} kg</span>
          </p>
          <p className="text-label-sm text-on-surface-variant">{startWeight.toFixed(1)} → {targetWeight.toFixed(1)} kg</p>
        </div>
      </div>
    </section>
  );
}
