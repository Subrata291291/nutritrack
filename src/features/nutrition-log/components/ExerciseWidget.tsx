interface ExerciseWidgetProps {
  steps: number;
}

export function ExerciseWidget({ steps }: ExerciseWidgetProps) {
  const target = 10000;
  const pct = Math.min((steps / target) * 100, 100);

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
      <div className="px-xl pt-xl pb-lg">
        <div className="flex items-center justify-between mb-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary">directions_run</span>
            </div>
            <div>
              <h3 className="text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">Activity</h3>
              <p className="text-body-sm text-on-surface-variant">Steps today</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-headline-sm font-bold text-on-surface">{steps.toLocaleString()}</span>
            <p className="text-label-sm text-on-surface-variant">/ {target.toLocaleString()}</p>
          </div>
        </div>
        <div className="w-full h-2.5 bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-tertiary to-tertiary-container transition-all duration-500" style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
        <div className="flex justify-between text-label-sm text-on-surface-variant mt-1.5">
          <span>{steps > 0 ? `${Math.round(pct)}% complete` : 'No activity yet'}</span>
          {steps >= target && <span className="text-tertiary font-semibold">Goal reached!</span>}
        </div>
      </div>
      <button className="w-full py-2.5 border-t border-outline-variant/50 text-label-sm font-semibold text-on-surface-variant hover:bg-tertiary/[0.03] hover:text-tertiary transition-colors flex items-center justify-center gap-2">
        <span className="material-symbols-outlined text-[16px]">edit</span>
        Log Activity
      </button>
    </section>
  );
}
