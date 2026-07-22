import { cn } from '@utils/cn';
import type { ActivityLevel } from 'types/onboarding';

const levels: { value: ActivityLevel; icon: string; title: string; description: string }[] = [
  {
    value: 'sedentary',
    icon: 'air',
    title: 'Sedentary',
    description: 'Little or no exercise, desk job.',
  },
  {
    value: 'lightly-active',
    icon: 'directions_walk',
    title: 'Lightly Active',
    description: 'Light exercise or sports 1-3 days a week.',
  },
  {
    value: 'moderately-active',
    icon: 'fitness_center',
    title: 'Moderately Active',
    description: 'Moderate exercise or sports 3-5 days a week.',
  },
  {
    value: 'very-active',
    icon: 'running_with_errors',
    title: 'Very Active',
    description: 'Hard exercise or sports 6-7 days a week.',
  },
  {
    value: 'extra-active',
    icon: 'bolt',
    title: 'Extra Active',
    description: 'Very hard exercise, physical job, or training twice a day.',
  },
];

interface ActivityLevelSelectorProps {
  value: ActivityLevel;
  onChange: (value: ActivityLevel) => void;
}

export function ActivityLevelSelector({ value, onChange }: ActivityLevelSelectorProps) {
  return (
    <section>
      <h2 className="text-xs font-bold tracking-widest text-on-surface-variant uppercase mb-3">Activity Level</h2>
      <div className="space-y-3">
        {levels.map((level) => {
          const selected = level.value === value;
          return (
            <button
              key={level.value}
              type="button"
              onClick={() => onChange(level.value)}
              className={cn(
                'w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all',
                selected
                  ? 'border-2 border-primary-container bg-primary-container/5'
                  : 'border-2 border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low'
              )}
            >
              <div className={cn(
                'w-11 h-11 rounded-lg flex items-center justify-center shrink-0',
                selected ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-primary'
              )}>
                <span className="material-symbols-outlined text-2xl">{level.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-on-surface">{level.title}</h3>
                  {selected && (
                    <span className="material-symbols-outlined text-primary-container text-lg">check_circle</span>
                  )}
                </div>
                <p className="text-xs text-on-surface-variant mt-0.5">{level.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
