import type { MacroConsistency } from 'types/insights';

interface NutritionalBalanceProps {
  data: MacroConsistency[];
}

const macroDefs = [
  { key: 'Calories' as const, label: 'Calories', hue: 'emerald', get: (d: MacroConsistency) => d.calorieAdherence },
  { key: 'Protein' as const, label: 'Protein', hue: 'violet', get: (d: MacroConsistency) => d.proteinAdherence },
  { key: 'Carbs' as const, label: 'Carbs', hue: 'amber', get: (d: MacroConsistency) => d.carbsAdherence },
  { key: 'Fats' as const, label: 'Fats', hue: 'rose', get: (d: MacroConsistency) => d.fatsAdherence },
];

function MacroRing({ pct, hue, label, size = 88 }: { pct: number; hue: string; label: string; size?: number }) {
  const stroke = 7;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - Math.min(pct / 100, 1));
  const colorMap: Record<string, string> = { emerald: 'stroke-emerald-500', violet: 'stroke-violet-500', amber: 'stroke-amber-500', rose: 'stroke-rose-500' };
  const bgMap: Record<string, string> = { emerald: 'bg-emerald-500/10', violet: 'bg-violet-500/10', amber: 'bg-amber-500/10', rose: 'bg-rose-500/10' };
  return (
    <div className={`relative ${bgMap[hue] || 'bg-surface-container-low'} rounded-2xl p-5 flex flex-col items-center`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-surface-container-highest" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className={colorMap[hue] || 'stroke-primary'} strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset} style={{ transition: 'stroke-dashoffset 0.8s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[26px] font-bold text-on-surface leading-none">{Math.round(pct)}</span>
        <span className="text-[11px] font-semibold text-on-surface-variant">%</span>
      </div>
      <p className="mt-3 text-label-sm font-bold text-on-surface">{label}</p>
    </div>
  );
}

function AdherencePill({ pct }: { pct: number }) {
  const grade = pct >= 90 ? 'A' : pct >= 75 ? 'B' : pct >= 60 ? 'C' : pct >= 40 ? 'D' : 'F';
  const colors: Record<string, string> = {
    A: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
    B: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    C: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    D: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
    F: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${colors[grade]}`}>{grade}</span>
  );
}

export function NutritionalBalance({ data }: NutritionalBalanceProps) {
  const avgData = macroDefs.map(m => {
    const vals = data.map(d => m.get(d));
    const avg = vals.length > 0 ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    return { ...m, avg: Math.round(avg) };
  });

  const overall = Math.round(avgData.reduce((s, m) => s + m.avg, 0) / avgData.length);

  return (
    <section className="col-span-12 md:col-span-7 bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
      <div className="p-xl">
        {/* Header with big overall score */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-xl gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400/20 to-emerald-400/5 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-500" style={{ fontVariationSettings: "'FILL' 1" }}>monitoring</span>
            </div>
            <div>
              <h3 className="text-headline-sm sm:text-headline-md font-bold text-on-surface">Nutritional Balance</h3>
              <p className="text-body-sm text-on-surface-variant">
                {data.length > 0 ? `${data.length} days tracked` : 'No data for this period'}
              </p>
            </div>
          </div>
          {data.length > 0 && (
            <div className="flex items-center gap-3 self-start sm:self-auto">
              <div className="text-right">
                <p className="text-label-sm text-on-surface-variant uppercase tracking-wider">Overall</p>
                <p className="text-[28px] sm:text-[32px] font-bold text-on-surface leading-none">{overall}<span className="text-body-md font-normal text-on-surface-variant">%</span></p>
              </div>
              <AdherencePill pct={overall} />
            </div>
          )}
        </div>

        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant">
            <span className="material-symbols-outlined text-[48px] opacity-30 mb-2">monitoring</span>
            <p className="text-body-md">No nutrition data for this period</p>
          </div>
        ) : (
          <>
            {/* Macro rings */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-xl">
              {avgData.map(m => (
                <MacroRing key={m.key} pct={m.avg} hue={m.hue} label={m.label} />
              ))}
            </div>

            {/* Daily heatmap */}
            <div className="overflow-x-auto -mx-xl px-xl">
              <div className="min-w-[480px]">
                {/* Day headers */}
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="w-16 flex-shrink-0" />
                  {data.map((day) => (
                    <div key={day.date} className="flex-1 text-center">
                      <p className="text-label-sm text-on-surface-variant font-bold">
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                      <p className="text-[10px] text-on-surface-variant/50">
                        {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Macro rows with grade pills */}
                {macroDefs.map((m) => (
                  <div key={m.key} className="flex items-center gap-1.5 mb-1.5">
                    <div className="w-16 flex-shrink-0">
                      <p className="text-label-sm font-semibold text-on-surface">{m.label}</p>
                    </div>
                    {data.map((day) => {
                      const pct = m.get(day);
                      const intensity = pct >= 90 ? 'bg-emerald-500' : pct >= 70 ? 'bg-emerald-500/60' : pct >= 50 ? 'bg-amber-500/50' : pct >= 30 ? 'bg-orange-500/30' : 'bg-surface-container-highest';
                      return (
                        <div key={day.date} className="flex-1 flex items-center justify-center">
                          <div className={`w-full h-7 rounded-md ${intensity} transition-colors flex items-center justify-center`}>
                            <span className="text-[10px] font-bold text-white/80 drop-shadow-sm"><AdherencePill pct={pct} /></span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Grade legend */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-lg pt-lg border-t border-outline-variant/50">
              {[
                { grade: 'A', pct: '90-100%', color: 'bg-emerald-500/15 text-emerald-600' },
                { grade: 'B', pct: '75-89%', color: 'bg-emerald-500/10 text-emerald-600' },
                { grade: 'C', pct: '60-74%', color: 'bg-amber-500/10 text-amber-600' },
                { grade: 'D', pct: '40-59%', color: 'bg-orange-500/10 text-orange-600' },
                { grade: 'F', pct: '<40%', color: 'bg-rose-500/10 text-rose-600' },
              ].map(l => (
                <div key={l.grade} className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${l.color} border-current/20`}>{l.grade}</span>
                  <span>{l.pct}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
