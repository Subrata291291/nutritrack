import { useState } from 'react';
import { useOnboarding } from '@hooks/useOnboarding';
import { Button } from '@components/ui/Button';
import { cn } from '@utils/cn';
import type { ActivityLevel } from 'types/onboarding';

const activities: { value: ActivityLevel; icon: string; title: string; description: string }[] = [
  {
    value: 'sedentary',
    icon: 'desktop_windows',
    title: 'Sedentary',
    description: 'Typical office job, little to no exercise.',
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
];

interface StepActivityProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepActivity({ onNext, onBack }: StepActivityProps) {
  const { setActivityLevel } = useOnboarding();
  const [selected, setSelected] = useState<ActivityLevel | null>(null);

  const handleSelect = (value: ActivityLevel) => {
    setSelected(value);
    setActivityLevel(value);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activities.map((act) => (
          <button
            key={act.value}
            type="button"
            onClick={() => handleSelect(act.value)}
            className={cn(
              'flex items-start gap-4 p-4 border rounded-xl text-left transition-all hover:bg-surface-container-low group',
              selected === act.value
                ? 'border-primary bg-primary/5 shadow-[0_0_0_2px_var(--color-primary-container)]'
                : 'border-outline-variant'
            )}
          >
            <div className={cn(
              'p-2 rounded-lg transition-colors',
              selected === act.value
                ? 'bg-primary-container text-white'
                : 'bg-surface-container text-primary group-hover:bg-primary-container group-hover:text-white'
            )}>
              <span className="material-symbols-outlined text-2xl">{act.icon}</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-on-surface mb-1">{act.title}</h3>
              <p className="text-sm text-secondary">{act.description}</p>
            </div>
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between pt-6 border-t border-outline-variant">
        <Button variant="ghost" onClick={onBack}>
          <span className="material-symbols-outlined text-lg mr-1">arrow_back</span>
          Back
        </Button>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={onNext}>Skip</Button>
          <Button disabled={!selected} onClick={onNext}>Continue</Button>
        </div>
      </div>
    </div>
  );
}
