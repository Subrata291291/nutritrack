import { parseLocalDate, toLocalDateString } from '@utils/format';
import { MealCard } from './MealCard';
import { NutritionSummary } from './NutritionSummary';
import type { MealPlanDay } from 'types/meal-plan';

const mealOrder: Record<string, number> = { breakfast: 1, lunch: 2, snack: 3, dinner: 4 };

const dayAccent: Record<string, { border: string; dot: string; bg: string }> = {
  Mon: { border: 'border-t-blue-400', dot: 'bg-blue-400', bg: 'bg-blue-400/5' },
  Tue: { border: 'border-t-emerald-400', dot: 'bg-emerald-400', bg: 'bg-emerald-400/5' },
  Wed: { border: 'border-t-violet-400', dot: 'bg-violet-400', bg: 'bg-violet-400/5' },
  Thu: { border: 'border-t-amber-400', dot: 'bg-amber-400', bg: 'bg-amber-400/5' },
  Fri: { border: 'border-t-rose-400', dot: 'bg-rose-400', bg: 'bg-rose-400/5' },
  Sat: { border: 'border-t-indigo-400', dot: 'bg-indigo-400', bg: 'bg-indigo-400/5' },
  Sun: { border: 'border-t-orange-400', dot: 'bg-orange-400', bg: 'bg-orange-400/5' },
};

function fmtDate(dateStr: string): string {
  return parseLocalDate(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface DailyPlannerProps {
  day: MealPlanDay | undefined;
  onAddMeal: (date: string) => void;
  onDeleteMeal: (mealId: number, date: string) => void;
  onSwapMeal?: (mealId: number, date: string) => void;
}

export function DailyPlanner({ day, onAddMeal, onDeleteMeal, onSwapMeal }: DailyPlannerProps) {
  if (!day) {
    return (
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-8 flex flex-col items-center justify-center text-center gap-2">
        <span className="material-symbols-outlined text-[40px] text-on-surface-variant/40">calendar_today</span>
        <p className="text-body-md text-on-surface-variant font-semibold">No meals planned for this day.</p>
        <p className="text-label-sm text-on-surface-variant">Select another day or add a meal to get started.</p>
      </div>
    );
  }

  const sortedMeals = [...day.meals].sort((a, b) => (mealOrder[a.mealType] ?? 99) - (mealOrder[b.mealType] ?? 99));
  const isToday = day.date === toLocalDateString(new Date());
  const accent = dayAccent[day.dayName] || { border: 'border-t-outline-variant', dot: 'bg-outline-variant', bg: '' };

  return (
    <div className={`bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden ${isToday ? 'ring-2 ring-primary/20' : ''}`}>
      {/* Day header */}
      <div className={`text-center pt-4 pb-3 border-b border-outline-variant/40 ${isToday ? accent.bg : ''}`}>
        <div className="flex items-center justify-center gap-1.5 mb-0.5">
          <span className={`w-2 h-2 rounded-full ${accent.dot} ${isToday ? 'animate-pulse' : ''}`} />
          <p className="text-sm font-bold text-on-surface tracking-wider">{day.dayName}</p>
          {isToday && <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider">Today</span>}
        </div>
        <p className="text-xs text-on-surface-variant font-semibold">{fmtDate(day.date)}</p>
      </div>

      {/* Meals */}
      <div className="p-3 space-y-2.5">
        {sortedMeals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 gap-1">
            <span className="material-symbols-outlined text-[32px] text-on-surface-variant/30">restaurant</span>
            <p className="text-sm text-on-surface-variant font-medium">No meals yet</p>
          </div>
        ) : (
          sortedMeals.map((meal) => (
            <MealCard key={meal.id} meal={meal} dayDate={day.date} onDeleteMeal={onDeleteMeal} onSwapMeal={onSwapMeal} />
          ))
        )}
        <button onClick={() => onAddMeal(day.date)}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-outline-variant/60 text-on-surface-variant/60 text-sm font-semibold hover:border-primary/40 hover:text-primary hover:bg-primary/[0.02] transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Add
        </button>
      </div>

      {/* Nutrition summary */}
      <NutritionSummary day={day} />
    </div>
  );
}