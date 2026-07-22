interface DateNavigatorProps {
  date: Date;
  onPrev: () => void;
  onNext: () => void;
}

export function DateNavigator({ date, onPrev, onNext }: DateNavigatorProps) {
  const formatDate = (d: Date) => {
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return isToday ? `Today, ${dateStr}` : dateStr;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-md">
        <button onClick={onPrev} className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container transition-all">
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary">calendar_today</span>
          <h2 className="font-headline-md text-headline-md">{formatDate(date)}</h2>
        </div>
        <button onClick={onNext} className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container transition-all">
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
      </div>
      <button className="flex items-center gap-2 px-md py-2 border border-outline-variant rounded-lg hover:bg-surface-container transition-all font-label-md text-label-md">
        <span className="material-symbols-outlined text-[18px]">tune</span>
        Adjust Targets
      </button>
    </div>
  );
}
