import type { PlannedMeal } from 'types/meal-plan';
import { SwapMealButton } from './SwapMealButton';

const mealMeta: Record<string, { icon: string; label: string }> = {
  breakfast: { icon: 'wb_sunny', label: 'Breakfast' },
  lunch: { icon: 'lunch_dining', label: 'Lunch' },
  dinner: { icon: 'dinner_dining', label: 'Dinner' },
  snack: { icon: 'cookie', label: 'Snack' },
};

interface MealCardProps {
  meal: PlannedMeal;
  dayDate: string;
  onDeleteMeal: (id: number, date: string) => void;
  onUpdateMeal?: (id: number, date: string) => void;
  onSwapMeal?: (id: number, date: string) => void;
  swapLoading?: boolean;
}

export function MealCard({ meal, dayDate, onDeleteMeal, onUpdateMeal, onSwapMeal, swapLoading }: MealCardProps) {
  const meta = mealMeta[meal.mealType] || { icon: 'restaurant', label: meal.mealType };
  return (
    <div className="relative bg-surface-container-low rounded-xl p-3 border-l-[3px] transition-all hover:shadow-sm group"
      style={{
        borderLeftColor: meal.mealType === 'breakfast' ? '#fbbf24' :
          meal.mealType === 'lunch' ? '#34d399' :
          meal.mealType === 'dinner' ? '#a78bfa' : '#fb7185'
      }}
    >
      {onUpdateMeal && (
        <button onClick={() => onUpdateMeal(meal.id, dayDate)}
          className="absolute -top-1.5 -right-7 w-5 h-5 rounded-full bg-surface-container-lowest border border-outline-variant flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-tertiary-container transition-all shadow-sm z-10"
          title="Change meal type">
          <span className="material-symbols-outlined text-[11px] text-on-surface-variant hover:text-tertiary">sync_alt</span>
        </button>
      )}
      <button onClick={() => onDeleteMeal(meal.id, dayDate)}
        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-surface-container-lowest border border-outline-variant flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-error-container transition-all shadow-sm z-10"
        title="Remove">
        <span className="material-symbols-outlined text-[11px] text-on-surface-variant hover:text-error">close</span>
      </button>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="material-symbols-outlined text-[14px]" style={{
          color: meal.mealType === 'breakfast' ? '#fbbf24' :
            meal.mealType === 'lunch' ? '#34d399' :
            meal.mealType === 'dinner' ? '#a78bfa' : '#fb7185'
        }}>{meta.icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">{meta.label}</span>
      </div>
      <p className="text-sm font-semibold text-on-surface truncate">{meal.recipe?.title || 'Meal'}</p>
      <div className="flex items-center gap-2 mt-1.5 text-label-sm text-on-surface-variant">
        <span className="flex items-center gap-0.5">
          <span className="material-symbols-outlined text-[11px]">local_fire_department</span>
          {meal.calories}
        </span>
        <span className="w-1 h-1 rounded-full bg-outline-variant/60" />
        <span>P:{meal.proteinGrams}g</span>
        {onSwapMeal && (
          <span className="ml-auto">
            <SwapMealButton
              onClick={() => onSwapMeal(meal.id, dayDate)}
              loading={swapLoading}
            />
          </span>
        )}
      </div>
    </div>
  );
}