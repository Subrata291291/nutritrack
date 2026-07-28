import type { AIMealEntry } from 'types/ai-meal-plan';

const mealMeta: Record<string, { icon: string; label: string }> = {
  breakfast: { icon: 'wb_sunny', label: 'Breakfast' },
  lunch: { icon: 'lunch_dining', label: 'Lunch' },
  dinner: { icon: 'dinner_dining', label: 'Dinner' },
  snack: { icon: 'cookie', label: 'Snack' },
};

interface MealPreviewCardProps {
  meal: AIMealEntry;
}

export function MealPreviewCard({ meal }: MealPreviewCardProps) {
  const meta = mealMeta[meal.mealType] || { icon: 'restaurant', label: meal.mealType };
  return (
    <div
      className="relative bg-surface-container-low rounded-xl p-3 border-l-[3px] transition-all hover:shadow-sm"
      style={{
        borderLeftColor:
          meal.mealType === 'breakfast'
            ? '#fbbf24'
            : meal.mealType === 'lunch'
              ? '#34d399'
              : meal.mealType === 'dinner'
                ? '#a78bfa'
                : '#fb7185',
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span
          className="material-symbols-outlined text-[14px]"
          style={{
            color:
              meal.mealType === 'breakfast'
                ? '#fbbf24'
                : meal.mealType === 'lunch'
                  ? '#34d399'
                  : meal.mealType === 'dinner'
                    ? '#a78bfa'
                    : '#fb7185',
          }}
        >
          {meta.icon}
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
          {meta.label}
        </span>
        <span className="text-[10px] ml-auto text-secondary font-semibold">
          {(meal.confidence * 100).toFixed(0)}%
        </span>
      </div>
      <p className="text-sm font-semibold text-on-surface truncate">
        {meal.recipeName || `Recipe #${meal.recipeId}`}
      </p>
      <div className="flex items-center gap-2 mt-1.5 text-label-sm text-on-surface-variant">
        <span className="flex items-center gap-0.5">
          <span className="material-symbols-outlined text-[11px]">local_fire_department</span>
          {meal.calories}
        </span>
        <span className="w-1 h-1 rounded-full bg-outline-variant/60" />
        <span>P:{meal.proteinGrams}g</span>
        <span className="w-1 h-1 rounded-full bg-outline-variant/60" />
        <span>C:{meal.carbsGrams}g</span>
        <span className="w-1 h-1 rounded-full bg-outline-variant/60" />
        <span>F:{meal.fatsGrams}g</span>
      </div>
      {meal.reasoning && (
        <p className="text-[10px] text-on-surface-variant/60 mt-1 italic leading-tight">
          {meal.reasoning}
        </p>
      )}
    </div>
  );
}