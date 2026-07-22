import { Card } from '@components/ui/Card';
import type { RecipeInstruction } from 'types/recipe';

interface PreparationStepsProps {
  steps: RecipeInstruction[];
}

export function PreparationSteps({ steps }: PreparationStepsProps) {
  return (
    <Card padding="lg">
      <h3 className="text-lg font-semibold text-on-surface mb-5">Preparation Steps</h3>
      <ol className="space-y-5">
        {steps.map((s) => (
          <li key={s.step} className="flex gap-4">
            <span
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                s.step === 1
                  ? 'bg-primary text-white'
                  : 'border-2 border-primary text-primary'
              }`}
            >
              {s.step}
            </span>
            <div>
              <h4 className="text-sm font-semibold text-on-surface">{s.title}</h4>
              <p className="text-sm text-on-surface-variant mt-0.5">{s.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
