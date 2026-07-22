import type { WeightEntry } from 'types/insights';

interface WeightTrendChartProps {
  entries?: WeightEntry[];
  targetWeight?: number;
  startWeight?: number;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
}

export function WeightTrendChart({ entries = [], targetWeight }: WeightTrendChartProps) {
  if (entries.length === 0) {
    return (
      <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.05)] border border-outline-variant col-span-12 lg:col-span-7">
        <h3 className="text-[24px] font-semibold mb-2">Weight Trend</h3>
        <p className="text-sm text-on-surface-variant">No weight data yet. Start tracking to see your trend.</p>
      </section>
    );
  }

  const padding = { top: 20, bottom: 40, left: 20, right: 20 };
  const chartW = 800;
  const chartH = 200;
  const innerW = chartW - padding.left - padding.right;
  const innerH = chartH - padding.top - padding.bottom;

  const weights = entries.map(e => e.weightKg);
  const minW = Math.min(...weights) - 1;
  const maxW = Math.max(...weights) + 1;
  const range = maxW - minW || 1;

  const xScale = (i: number) => padding.left + (i / (entries.length - 1)) * innerW;
  const yScale = (w: number) => padding.top + innerH - ((w - minW) / range) * innerH;

  const points = entries.map((e, i) => `${xScale(i)},${yScale(e.weightKg)}`);
  const linePath = `M${points.join(' L')}`;
  const areaPath = `${linePath} L${xScale(entries.length - 1)},${chartH} L${xScale(0)},${chartH} Z`;

  const change = entries.length >= 2
    ? (weights[weights.length - 1] - weights[0]).toFixed(1)
    : '0.0';

  const targetY = targetWeight != null ? yScale(targetWeight) : null;

  const labelIndices = entries.length <= 5
    ? entries.map((_, i) => i)
    : [0, Math.floor(entries.length * 0.25), Math.floor(entries.length * 0.5), Math.floor(entries.length * 0.75), entries.length - 1];

  const gridLines = [0.25, 0.5, 0.75].map(f => padding.top + innerH * f);

  return (
    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.05)] border border-outline-variant overflow-hidden relative col-span-12 lg:col-span-7">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-[24px] font-semibold">Weight Trend</h3>
          <p className="text-sm text-on-surface-variant">
            {entries.length >= 2
              ? `Last ${entries.length} entries: ${Number(change) > 0 ? '+' : ''}${change}kg`
              : 'Tracking your progress'}
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold text-on-surface-variant">
          <span className="w-3 h-3 rounded-full bg-primary" />
          Current
          {targetY != null && (
            <span className="w-3 h-3 rounded-full border-2 border-dashed border-primary ml-3" />
          )}
          {targetY != null && <span className="ml-1">Goal</span>}
        </div>
      </div>
      <div className="h-64 w-full relative">
        <svg className="w-full h-full overflow-visible" viewBox={`0 0 ${chartW} ${chartH + 20}`}>
          {gridLines.map((y, i) => (
            <line key={i} stroke="#E2E8F0" strokeWidth="1" x1={padding.left} x2={chartW - padding.right} y1={y} y2={y} />
          ))}
          {targetY != null && (
            <line opacity="0.4" stroke="var(--color-primary)" strokeDasharray="8,4" strokeWidth="2" x1={padding.left} x2={chartW - padding.right} y1={targetY} y2={targetY} />
          )}
          <path d={areaPath} fill="url(#gradientWeight)" opacity="0.1" />
          <path d={linePath} fill="none" stroke="var(--color-primary)" strokeLinecap="round" strokeWidth="4" />
          <defs>
            <linearGradient id="gradientWeight" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--color-primary-container)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
          {entries.map((e, i) => (
            <circle key={e.date} cx={xScale(i)} cy={yScale(e.weightKg)} fill="var(--color-primary)" r={i === entries.length - 1 ? 8 : 6} stroke="white" strokeWidth="2" />
          ))}
        </svg>
        <div className="absolute bottom-0 left-0 right-0 flex justify-between pt-4 text-xs font-semibold text-on-surface-variant opacity-60">
          {labelIndices.map(i => (
            <span key={entries[i].date}>{formatDate(entries[i].date)}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
