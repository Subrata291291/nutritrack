import { cn } from '@utils/cn';

interface TimeRangeSelectorProps {
  selected: number;
  onChange: (days: number) => void;
}

const ranges = [
  { label: '7 Days', value: 7 },
  { label: '30 Days', value: 30 },
  { label: '90 Days', value: 90 },
];

export function TimeRangeSelector({ selected, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="flex gap-xs bg-surface-container-high p-1 rounded-xl w-fit">
      {ranges.map((range) => (
        <button
          key={range.value}
          onClick={() => onChange(range.value)}
          className={cn(
            'px-md py-sm rounded-lg font-label-sm text-label-sm transition-all',
            selected === range.value
              ? 'text-on-primary-container bg-primary-container'
              : 'text-secondary hover:bg-surface-container'
          )}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
