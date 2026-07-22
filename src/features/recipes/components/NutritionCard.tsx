import { Card } from '@components/ui/Card';
import { ProgressBar } from '@components/ui/ProgressBar';

interface NutritionCardProps {
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    fiber: number;
  };
}

export function NutritionCard({ nutrition }: NutritionCardProps) {
  const macros = [
    { label: 'Carbs', grams: nutrition.carbs, pct: Math.min(Math.round((nutrition.carbs / 300) * 100), 100), color: 'bg-[#003258]' },
    { label: 'Protein', grams: nutrition.protein, pct: Math.min(Math.round((nutrition.protein / 50) * 100), 100), color: 'bg-primary' },
    { label: 'Fats', grams: nutrition.fats, pct: Math.min(Math.round((nutrition.fats / 65) * 100), 100), color: 'bg-[#6b5300]' },
  ];

  return (
    <Card padding="lg">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-on-surface">Nutrition Dashboard</h3>
        <span className="text-2xl font-bold text-on-surface">
          {nutrition.calories} <span className="text-sm font-normal text-on-surface-variant">kcal per serving</span>
        </span>
      </div>
      <div className="space-y-4">
        {macros.map((m) => (
          <div key={m.label}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-on-surface-variant">{m.label}</span>
              <span className="font-medium text-on-surface">{m.grams}g</span>
            </div>
            <ProgressBar progress={m.pct} barClassName={m.color} />
          </div>
        ))}
      </div>
    </Card>
  );
}
