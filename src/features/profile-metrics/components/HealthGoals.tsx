import type { GoalType } from 'types/onboarding';

const goals: { value: GoalType; label: string }[] = [
  { value: 'lose-weight', label: 'Weight Loss' },
  { value: 'maintain', label: 'Maintain Weight' },
  { value: 'gain-muscle', label: 'Gain Muscle' },
];

interface HealthGoalsProps {
  goal: GoalType;
  targetWeightKg: number;
  onChange: (field: 'goal' | 'targetWeightKg', value: GoalType | number) => void;
}

export function HealthGoals({ goal, targetWeightKg, onChange }: HealthGoalsProps) {
  return (
    <section>
      <h2 className="text-xs font-bold tracking-widest text-on-surface-variant uppercase mb-3">Health Goals</h2>
      <div className="space-y-4">
        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 hover:border-primary transition-colors">
          <label className="text-xs text-on-surface-variant font-medium mb-1 block">Primary Goal</label>
          <select
            value={goal}
            onChange={(e) => onChange('goal', e.target.value as GoalType)}
            className="w-full text-lg font-semibold text-on-surface bg-transparent border-none p-0 focus:outline-none focus:ring-0 cursor-pointer"
          >
            {goals.map((g) => (
              <option key={g.value} value={g.value}>{g.label}</option>
            ))}
          </select>
        </div>

        <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4 hover:border-primary transition-colors">
          <label className="text-xs text-on-surface-variant font-medium mb-1 block">Target Weight</label>
          <div className="flex items-baseline gap-1">
            <input
              type="number"
              value={targetWeightKg}
              step={0.1}
              onChange={(e) => onChange('targetWeightKg', Number(e.target.value))}
              className="w-full text-lg font-semibold text-on-surface bg-transparent border-none p-0 focus:outline-none focus:ring-0"
            />
            <span className="text-xs text-secondary">kg</span>
          </div>
        </div>
      </div>
    </section>
  );
}
