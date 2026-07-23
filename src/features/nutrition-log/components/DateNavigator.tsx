interface DateNavigatorProps {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
}

export function DateNavigator({ date, onPrev, onNext }: DateNavigatorProps) {
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  const year = date.toLocaleDateString('en-US', { year: 'numeric' });

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <div className="flex items-center gap-4">
        <div className="flex gap-1">
          <button onClick={onPrev} className="w-10 h-10 rounded-xl border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-all active:scale-95">
            <span className="material-symbols-outlined text-body-md text-on-surface-variant">chevron_left</span>
          </button>
          <button onClick={onNext} className="w-10 h-10 rounded-xl border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-all active:scale-95">
            <span className="material-symbols-outlined text-body-md text-on-surface-variant">chevron_right</span>
          </button>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-headline-md font-bold text-on-surface">{dayName}</h2>
            {isToday && (
              <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-label-sm font-semibold">Today</span>
            )}
          </div>
          <p className="text-body-sm sm:text-body-md text-on-surface-variant">{monthDay}, {year}</p>
        </div>
      </div>
      <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-outline-variant rounded-xl hover:bg-surface-container transition-all text-label-md font-semibold text-on-surface-variant hover:text-on-surface w-full sm:w-auto">
        <span className="material-symbols-outlined text-[18px]">tune</span>
        Adjust Targets
      </button>
    </div>
  );
}
