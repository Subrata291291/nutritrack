import { useState } from 'react';
import { useOnboarding } from '@hooks/useOnboarding';
import { Input } from '@components/ui/Input';
import { Button } from '@components/ui/Button';
import { cn } from '@utils/cn';
import type { GoalType } from 'types/onboarding';

type GoalOption = {
  value: GoalType;
  icon: string;
  title: string;
  description: string;
};

const goals: GoalOption[] = [
  {
    value: 'lose-weight',
    icon: 'monitor_weight',
    title: 'Lose Weight',
    description: 'Shed body fat and improve cardiovascular health.',
  },
  {
    value: 'maintain',
    icon: 'balance',
    title: 'Maintain Weight',
    description: 'Focus on nutrition and stability.',
  },
  {
    value: 'gain-muscle',
    icon: 'fitness_center',
    title: 'Gain Muscle',
    description: 'Build strength and increase athletic performance.',
  },
];

interface StepGoalsProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepGoals({ onNext, onBack }: StepGoalsProps) {
  const { setGoal, calculateResults } = useOnboarding();
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
  const [targetWeight, setTargetWeight] = useState<string>('');

  const handleGoalSelect = (value: GoalType) => {
    setSelectedGoal(value);
    setGoal(value, targetWeight ? parseFloat(targetWeight) : undefined);
  };

  const handleWeightChange = (value: string) => {
    setTargetWeight(value);
    if (selectedGoal) {
      setGoal(selectedGoal, value ? parseFloat(value) : undefined);
    }
  };

  const handleComplete = () => {
    calculateResults();
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.value} className="relative">
            <input
              type="radio"
              name="goal"
              id={goal.value}
              value={goal.value}
              checked={selectedGoal === goal.value}
              onChange={() => handleGoalSelect(goal.value)}
              className="peer absolute opacity-0 w-full h-full cursor-pointer"
            />
            <label
              htmlFor={goal.value}
              className={cn(
                'flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200',
                selectedGoal === goal.value
                  ? 'border-primary-container bg-primary-container/5 shadow-[0_0_0_2px_var(--color-primary-container)]'
                  : 'border-outline-variant hover:bg-surface-container-low'
              )}
            >
              <div className={cn(
                'w-12 h-12 rounded-full flex items-center justify-center mr-4 transition-colors',
                selectedGoal === goal.value ? 'bg-primary-container text-white' : 'bg-surface-container text-primary'
              )}>
                <span className="material-symbols-outlined">{goal.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold tracking-wider text-on-surface">{goal.title}</p>
                <p className="text-sm text-on-surface-variant">{goal.description}</p>
              </div>
            </label>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-outline-variant">
        <label className="block text-[24px] font-semibold text-primary mb-2">Set your target weight</label>
        <p className="text-base text-on-surface-variant mb-4">We'll use this to calculate your daily macro and calorie needs.</p>
        <Input
          type="number"
          placeholder="00.0"
          suffix="KG"
          value={targetWeight}
          onChange={(e) => handleWeightChange(e.target.value)}
          step="0.1"
        />
      </div>

      <div className="flex items-center justify-between pt-4">
        <Button variant="ghost" onClick={onBack}>
          <span className="material-symbols-outlined text-lg mr-1">arrow_back</span>
          Back
        </Button>
        <Button disabled={!selectedGoal} onClick={handleComplete}>
          Complete Profile
          <span className="material-symbols-outlined text-lg ml-1">arrow_forward</span>
        </Button>
      </div>
    </div>
  );
}
