import type { MealPlanDay } from 'types/meal-plan';

interface WeeklyCalendarProps {
  days: MealPlanDay[];
  weekStart: string;
  onAddMeal: (date: string) => void;
}

const mealTypeStyles: Record<string, string> = {
  breakfast: 'bg-primary-container/20 border-primary/20 text-primary',
  lunch: 'bg-secondary-container/20 border-secondary/20 text-secondary',
  dinner: 'bg-tertiary-container/10 border-tertiary/30 text-tertiary',
};

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const mealOrder: Record<string, number> = { breakfast: 1, lunch: 2, snack: 3, dinner: 4 };

function DayColumn({ data, onAddMeal }: { data: MealPlanDay; onAddMeal: (date: string) => void }) {
  const progress = data.totalCalories > 0 ? Math.min(data.totalCalories / 2200, 1) : 0;
  const percent = Math.round(progress * 100);
  const sortedMeals = [...data.meals].sort((a, b) => (mealOrder[a.mealType] ?? 99) - (mealOrder[b.mealType] ?? 99));

  return (
    <div className="flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant shadow-[0px_4px_6px_rgba(0,0,0,0.05)] min-h-[480px]">
      <div className="text-center pt-4 pb-3 border-b border-outline-variant/40">
        <p className="text-sm font-bold text-on-surface tracking-wider">{data.dayName}</p>
        <p className="text-xs text-on-surface-variant font-semibold">{formatDate(data.date)}</p>
      </div>
      <div className="flex-1 p-3 space-y-3">
        {sortedMeals.map((meal) => (
          <div key={meal.id} className={`rounded-lg border p-3 ${mealTypeStyles[meal.mealType] || ''}`}>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{meal.mealType}</span>
            <p className="text-sm font-semibold text-on-surface mt-1">{meal.recipe?.title || 'Meal'}</p>
            <div className="flex gap-2 text-xs text-on-surface-variant mt-1">
              <span>{meal.calories}kcal</span>
              <span>P:{meal.proteinGrams}g</span>
            </div>
          </div>
        ))}
        <button
          onClick={() => onAddMeal(data.date)}
          className="w-full py-3 rounded-lg border-2 border-dashed border-outline-variant text-on-surface-variant text-sm font-semibold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-1"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Add Meal
        </button>
      </div>
      <div className="p-3 border-t border-outline-variant/40">
        <div className="flex justify-between text-xs font-semibold mb-1">
          <span className="text-on-surface">{data.totalCalories.toLocaleString()}</span>
          <span className="text-on-surface-variant">/ 2,200</span>
        </div>
        <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}

export function WeeklyCalendar({ days, weekStart, onAddMeal }: WeeklyCalendarProps) {
  const weekDays: MealPlanDay[] = dayLabels.map((label, i) => {
    const date = new Date(weekStart);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayData = days.find((d) => {
      const dDate = new Date(d.date);
      return dDate.toDateString() === date.toDateString();
    });
    return dayData || {
      date: dateStr,
      dayName: label,
      meals: [],
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
    };
  });

  const totalCarbs = weekDays.reduce((s, d) => s + d.totalCarbs, 0);
  const totalProtein = weekDays.reduce((s, d) => s + d.totalProtein, 0);
  const totalFats = weekDays.reduce((s, d) => s + d.totalFats, 0);
  const totalMacro = totalCarbs + totalProtein + totalFats || 1;
  const carbPct = Math.round((totalCarbs / totalMacro) * 100);
  const proteinPct = Math.round((totalProtein / totalMacro) * 100);
  const fatPct = Math.round((totalFats / totalMacro) * 100);

  const daysWithMeals = weekDays.filter((d) => d.meals.length > 0).length;
  const consistencyScore = Math.round((daysWithMeals / 7) * 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => (
          <DayColumn key={day.dayName} data={day} onAddMeal={onAddMeal} />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-[0px_4px_6px_rgba(0,0,0,0.05)] flex items-center justify-center gap-8">
          <div className="relative w-28 h-28">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="48" fill="none" strokeWidth="10" className="stroke-surface-container-highest" />
              <circle cx="60" cy="60" r="48" fill="none" strokeWidth="10" className="stroke-primary"
                strokeDasharray={`${(carbPct / 100) * 301.6} 301.6`} strokeLinecap="round" />
              <circle cx="60" cy="60" r="48" fill="none" strokeWidth="10" className="stroke-secondary"
                strokeDasharray={`${(proteinPct / 100) * 301.6} 301.6`} strokeDashoffset={`-${(carbPct / 100) * 301.6}`} strokeLinecap="round" />
              <circle cx="60" cy="60" r="48" fill="none" strokeWidth="10" className="stroke-tertiary-container"
                strokeDasharray={`${(fatPct / 100) * 301.6} 301.6`} strokeDashoffset={`-${((carbPct + proteinPct) / 100) * 301.6}`} strokeLinecap="round" />
            </svg>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-on-surface">Macro Distribution</h4>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-on-surface-variant">Carbs</span>
                <span className="font-semibold text-on-surface">{carbPct}%</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-secondary" />
                <span className="text-on-surface-variant">Protein</span>
                <span className="font-semibold text-on-surface">{proteinPct}%</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 rounded-full bg-tertiary-container" />
                <span className="text-on-surface-variant">Fats</span>
                <span className="font-semibold text-on-surface">{fatPct}%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-[0px_4px_6px_rgba(0,0,0,0.05)] flex items-center justify-between">
          <div>
            <p className="text-sm text-on-surface-variant font-semibold tracking-wider">Weekly Goal</p>
            <p className="text-headline-lg text-on-surface font-bold mt-1">{consistencyScore}%</p>
            <p className="text-xs text-on-surface-variant">Consistency Score</p>
          </div>
          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="26" fill="none" strokeWidth="6" className="stroke-surface-container-highest" />
              <circle cx="32" cy="32" r="26" fill="none" strokeWidth="6" className="stroke-primary"
                strokeDasharray={`${(consistencyScore / 100) * 163.4} 163.4`} strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
