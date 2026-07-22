interface MacroSummaryProps {
  days: { totalCarbs: number; totalProtein: number; totalFats: number }[];
}

export function MacroSummary({ days }: MacroSummaryProps) {
  const totalCarbs = days.reduce((s, d) => s + d.totalCarbs, 0);
  const totalProtein = days.reduce((s, d) => s + d.totalProtein, 0);
  const totalFats = days.reduce((s, d) => s + d.totalFats, 0);
  const totalMacro = totalCarbs + totalProtein + totalFats || 1;
  const carbPct = Math.round((totalCarbs / totalMacro) * 100);
  const proteinPct = Math.round((totalProtein / totalMacro) * 100);
  const fatPct = Math.round((totalFats / totalMacro) * 100);

  const daysWithData = days.filter((d) => d.totalCarbs + d.totalProtein + d.totalFats > 0).length;
  const consistencyScore = Math.round((daysWithData / 7) * 100);

  return (
    <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-[0px_4px_6px_rgba(0,0,0,0.05)]">
      <h3 className="text-headline-md font-semibold text-on-surface mb-4">Macro Summary</h3>
      <div className="flex items-center gap-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
            <circle cx="64" cy="64" r="50" fill="none" strokeWidth="12" className="stroke-surface-container-highest" />
            <circle cx="64" cy="64" r="50" fill="none" strokeWidth="12" className="stroke-primary"
              strokeDasharray={`${(carbPct / 100) * 314.16} 314.16`} strokeLinecap="round" />
            <circle cx="64" cy="64" r="50" fill="none" strokeWidth="12" className="stroke-secondary"
              strokeDasharray={`${(proteinPct / 100) * 314.16} 314.16`} strokeDashoffset={`-${(carbPct / 100) * 314.16}`} strokeLinecap="round" />
            <circle cx="64" cy="64" r="50" fill="none" strokeWidth="12" className="stroke-tertiary-container"
              strokeDasharray={`${(fatPct / 100) * 314.16} 314.16`} strokeDashoffset={`-${((carbPct + proteinPct) / 100) * 314.16}`} strokeLinecap="round" />
          </svg>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full bg-primary" />
            <div>
              <p className="text-sm font-semibold text-on-surface">Carbs</p>
              <p className="text-xs text-on-surface-variant">{carbPct}% &middot; {Math.round(totalCarbs)}g</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full bg-secondary" />
            <div>
              <p className="text-sm font-semibold text-on-surface">Protein</p>
              <p className="text-xs text-on-surface-variant">{proteinPct}% &middot; {Math.round(totalProtein)}g</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full bg-tertiary-container" />
            <div>
              <p className="text-sm font-semibold text-on-surface">Fats</p>
              <p className="text-xs text-on-surface-variant">{fatPct}% &middot; {Math.round(totalFats)}g</p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-outline-variant/40">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-xs text-on-surface-variant font-semibold tracking-wider">Weekly Goal</p>
            <p className="text-headline-lg font-bold text-on-surface">{consistencyScore}%</p>
          </div>
          <div className="relative w-14 h-14">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="22" fill="none" strokeWidth="5" className="stroke-surface-container-highest" />
              <circle cx="28" cy="28" r="22" fill="none" strokeWidth="5" className="stroke-primary"
                strokeDasharray={`${(consistencyScore / 100) * 138.23} 138.23`} strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
