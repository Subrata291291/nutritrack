import { cn } from '@utils/cn';

interface ProgressBarProps {
  progress: number;
  className?: string;
  barClassName?: string;
  showLabel?: boolean;
}

export function ProgressBar({ progress, className, barClassName, showLabel }: ProgressBarProps) {
  const clamped = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex-1 h-2 rounded-full bg-surface-container-highest overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out bg-primary', barClassName)}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-on-surface-variant">{Math.round(clamped)}%</span>
      )}
    </div>
  );
}
