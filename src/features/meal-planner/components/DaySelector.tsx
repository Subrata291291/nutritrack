import { parseLocalDate, toLocalDateString } from '@utils/format';

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

interface DaySelectorProps {
  weekStart: string;
  selectedDay: string;
  onSelectDay: (date: string) => void;
}

export function DaySelector({ weekStart, selectedDay, onSelectDay }: DaySelectorProps) {
  const todayStr = toLocalDateString(new Date());

  return (
    <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 snap-x snap-mandatory">
      {dayLabels.map((label, i) => {
        const date = parseLocalDate(weekStart);
        date.setDate(date.getDate() + i);
        const dateStr = toLocalDateString(date);
        const dayNum = date.getDate();
        const isSelected = dateStr === selectedDay;
        const isToday = dateStr === todayStr;

        return (
          <button
            key={label}
            onClick={() => onSelectDay(dateStr)}
            className={`snap-start flex-1 min-w-[52px] flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl text-label-sm font-semibold transition-all active:scale-95 ${
              isSelected
                ? 'bg-primary text-on-primary shadow-sm'
                : 'bg-surface-container-lowest text-on-surface-variant border border-outline-variant hover:bg-surface-container-low hover:text-on-surface'
            } ${isToday && !isSelected ? 'ring-1 ring-primary/30' : ''}`}
          >
            <span className="text-[10px] uppercase tracking-wider">{label}</span>
            <span className={`text-sm ${isSelected ? 'font-bold' : ''}`}>{dayNum}</span>
          </button>
        );
      })}
    </div>
  );
}