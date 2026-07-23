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
    <div className="flex gap-1 bg-surface-container-high p-1 rounded-xl">
      {ranges.map((range) => (
        <button key={range.value} onClick={() => onChange(range.value)}
          className={`px-4 py-2 rounded-lg text-label-sm font-semibold transition-all ${
            selected === range.value
              ? 'bg-surface-container-lowest text-primary shadow-sm border border-outline-variant/50'
              : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
          }`}
        >
          {range.label}
        </button>
      ))}
    </div>
  );
}
