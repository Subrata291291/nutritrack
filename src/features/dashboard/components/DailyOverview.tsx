import { useIsMobile } from '@hooks/useMediaQuery';
import type { DailyLog } from 'types/nutrition';

interface RingProps {
  value: number;
  max: number;
  unit: string;
  label: string;
  color: string;
  size: number;
}

function ProgressRingCard({ value, max, unit, label, color, size }: RingProps) {
  const radius = size * 0.75;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(max > 0 ? value / max : 0, 1);
  const offset = circumference - progress * circumference;
  const center = size / 2;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
          <circle
            className="stroke-surface-container"
            cx={center} cy={center} fill="transparent"
            r={radius} strokeWidth="12"
          />
          <circle
            className={color}
            cx={center} cy={center} fill="transparent"
            r={radius} strokeLinecap="round" strokeWidth="12"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 0.8s ease-in-out',
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[24px] font-semibold">{value.toLocaleString()}</span>
          <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">{unit}</span>
        </div>
      </div>
      <p className="text-sm font-semibold tracking-wider">{label}</p>
    </div>
  );
}

const defaultCalTarget = 2200;
const defaultProteinTarget = 180;
const defaultWaterTarget = 2500;

interface DailyOverviewProps {
  dailyLog?: DailyLog | null;
}

export function DailyOverview({ dailyLog }: DailyOverviewProps) {
  const isMobile = useIsMobile();
  const ringSize = isMobile ? 96 : 160;

  const calories = dailyLog?.totalCalories ?? 0;
  const protein = dailyLog?.totalProtein ?? 0;
  const waterL = dailyLog ? (dailyLog.waterMl / 1000) : 0;
  const waterTargetL = defaultWaterTarget / 1000;

  return (
    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.05)] border border-outline-variant">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[24px] font-semibold">Daily Overview</h3>
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-semibold tracking-wider rounded-lg">Today</span>
          <span className="material-symbols-outlined text-[#6c7a71] cursor-pointer hover:text-primary">more_horiz</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-around items-center gap-6">
        <ProgressRingCard value={calories} max={defaultCalTarget} unit="kcal" label="Calories" color="stroke-primary" size={ringSize} />
        <ProgressRingCard value={protein} max={defaultProteinTarget} unit="g" label="Protein Goal" color="stroke-secondary" size={ringSize} />
        <ProgressRingCard value={waterL} max={waterTargetL} unit="L" label="Hydration" color="stroke-primary" size={ringSize} />
      </div>
    </section>
  );
}
