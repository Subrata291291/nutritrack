import { useAuth } from '@hooks/useAuth';
import type { MealPlanDay } from 'types/meal-plan';
import type { NutritionTargets } from 'types/nutrition';

interface NutritionSummaryProps {
  day: MealPlanDay;
}

const metrics: { key: keyof NutritionTargets; label: string; icon: string; dayKey: keyof MealPlanDay; unit: string }[] = [
  { key: 'calories', label: 'Calories', icon: 'local_fire_department', dayKey: 'totalCalories', unit: '' },
  { key: 'proteinGrams', label: 'Protein', icon: 'fitness_center', dayKey: 'totalProtein', unit: 'g' },
  { key: 'carbsGrams', label: 'Carbs', icon: 'bolt', dayKey: 'totalCarbs', unit: 'g' },
  { key: 'fatsGrams', label: 'Fat', icon: 'water_drop', dayKey: 'totalFats', unit: 'g' },
];

export function NutritionSummary({ day }: NutritionSummaryProps) {
  const { nutritionTargets } = useAuth();
  const targets = nutritionTargets;

  return (
    <div className="p-3 pt-2.5 border-t border-outline-variant/40 space-y-3">
      {metrics.map(({ key, label, icon, dayKey, unit }) => {
        const target = targets ? targets[key] : 0;
        const consumed = day[dayKey] as number;
        const remaining = target > 0 ? Math.max(0, target - consumed) : 0;
        const progress = target > 0 ? Math.min(consumed / target, 1) : 0;
        const percent = Math.round(progress * 100);

        return (
          <div key={key}>
            <div className="flex items-center justify-between text-label-sm font-semibold mb-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px] text-primary">{icon}</span>
                <span className="text-on-surface">{label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-on-surface">{consumed.toLocaleString()}{unit}</span>
                {target > 0 && (
                  <>
                    <span className="text-on-surface-variant">/ {target.toLocaleString()}{unit}</span>
                    <span className={`text-label-xs font-semibold ${remaining > 0 ? 'text-secondary' : 'text-tertiary'}`}>
                      {remaining > 0 ? `${remaining}${unit} left` : 'Done'}
                    </span>
                  </>
                )}
              </div>
            </div>
            {target > 0 && (
              <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}