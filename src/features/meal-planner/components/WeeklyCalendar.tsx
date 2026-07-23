import type { MealPlanDay } from 'types/meal-plan';

interface WeeklyCalendarProps {
  days: MealPlanDay[];
  weekStart: string;
  onAddMeal: (date: string) => void;
  onDeleteMeal: (mealId: number, date: string) => void;
}

const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const mealOrder: Record<string, number> = { breakfast: 1, lunch: 2, snack: 3, dinner: 4 };

const mealMeta: Record<string, { icon: string; label: string }> = {
  breakfast: { icon: 'wb_sunny', label: 'Breakfast' },
  lunch: { icon: 'lunch_dining', label: 'Lunch' },
  dinner: { icon: 'dinner_dining', label: 'Dinner' },
  snack: { icon: 'cookie', label: 'Snack' },
};

const dayAccent: Record<string, { border: string; dot: string; bg: string }> = {
  Mon: { border: 'border-t-blue-400', dot: 'bg-blue-400', bg: 'bg-blue-400/5' },
  Tue: { border: 'border-t-emerald-400', dot: 'bg-emerald-400', bg: 'bg-emerald-400/5' },
  Wed: { border: 'border-t-violet-400', dot: 'bg-violet-400', bg: 'bg-violet-400/5' },
  Thu: { border: 'border-t-amber-400', dot: 'bg-amber-400', bg: 'bg-amber-400/5' },
  Fri: { border: 'border-t-rose-400', dot: 'bg-rose-400', bg: 'bg-rose-400/5' },
  Sat: { border: 'border-t-indigo-400', dot: 'bg-indigo-400', bg: 'bg-indigo-400/5' },
  Sun: { border: 'border-t-orange-400', dot: 'bg-orange-400', bg: 'bg-orange-400/5' },
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getTodayDateStr(): string {
  return new Date().toISOString().split('T')[0];
}

function MealCard({ meal, dayDate, onDeleteMeal }: { meal: MealPlanDay['meals'][0]; dayDate: string; onDeleteMeal: (id: number, date: string) => void }) {
  const meta = mealMeta[meal.mealType] || { icon: 'restaurant', label: meal.mealType };
  return (
    <div className="relative bg-surface-container-low rounded-xl p-3 border-l-[3px] transition-all hover:shadow-sm group"
      style={{
        borderLeftColor: meal.mealType === 'breakfast' ? '#fbbf24' :
          meal.mealType === 'lunch' ? '#34d399' :
          meal.mealType === 'dinner' ? '#a78bfa' : '#fb7185'
      }}
    >
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
      </div>
    </div>
  );
}

function DayColumn({ data, onAddMeal, onDeleteMeal }: { data: MealPlanDay; onAddMeal: (date: string) => void; onDeleteMeal: (mealId: number, date: string) => void }) {
  const progress = data.totalCalories > 0 ? Math.min(data.totalCalories / 2200, 1) : 0;
  const percent = Math.round(progress * 100);
  const sortedMeals = [...data.meals].sort((a, b) => (mealOrder[a.mealType] ?? 99) - (mealOrder[b.mealType] ?? 99));
  const isToday = data.date === getTodayDateStr();
  const accent = dayAccent[data.dayName] || { border: 'border-t-outline-variant', dot: 'bg-outline-variant', bg: '' };

  return (
    <div className={`flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden ${isToday ? 'ring-2 ring-primary/20' : ''}`}>
      {/* Day header */}
      <div className={`text-center pt-4 pb-3 border-b border-outline-variant/40 ${isToday ? accent.bg : ''}`}>
        <div className="flex items-center justify-center gap-1.5 mb-0.5">
          <span className={`w-2 h-2 rounded-full ${accent.dot} ${isToday ? 'animate-pulse' : ''}`} />
          <p className="text-sm font-bold text-on-surface tracking-wider">{data.dayName}</p>
          {isToday && <span className="px-1.5 py-0.5 rounded-full bg-primary/10 text-primary text-[9px] font-bold uppercase tracking-wider">Today</span>}
        </div>
        <p className="text-xs text-on-surface-variant font-semibold">{formatDate(data.date)}</p>
      </div>

      {/* Meals */}
      <div className="flex-1 p-3 space-y-2.5">
        {sortedMeals.map((meal) => (
          <MealCard key={meal.id} meal={meal} dayDate={data.date} onDeleteMeal={onDeleteMeal} />
        ))}
        <button onClick={() => onAddMeal(data.date)}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-outline-variant/60 text-on-surface-variant/60 text-sm font-semibold hover:border-primary/40 hover:text-primary hover:bg-primary/[0.02] transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined text-base">add</span>
          Add
        </button>
      </div>

      {/* Calorie bar */}
      <div className="p-3 pt-2.5 border-t border-outline-variant/40">
        <div className="flex justify-between text-label-sm font-semibold mb-1.5">
          <span className="text-on-surface">{data.totalCalories.toLocaleString()}</span>
          <span className="text-on-surface-variant">/ 2,200</span>
        </div>
        <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
        </div>
      </div>
    </div>
  );
}

export function WeeklyCalendar({ days, weekStart, onAddMeal, onDeleteMeal }: WeeklyCalendarProps) {
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

  const totalCals = weekDays.reduce((s, d) => s + d.totalCalories, 0);
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
      <div className="flex lg:grid lg:grid-cols-7 gap-2 lg:gap-3 overflow-x-auto pb-2 lg:pb-0 snap-x snap-mandatory">
        {weekDays.map((day, i) => (
          <div key={day.dayName} className="snap-start min-w-[220px] lg:min-w-0 lg:w-auto flex-1">
            <DayColumn data={day} onAddMeal={onAddMeal} onDeleteMeal={onDeleteMeal} />
          </div>
        ))}
      </div>

      {/* Weekly summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Macro distribution */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm">
          <div className="flex items-center justify-center gap-8">
            <div className="relative w-28 h-28 flex-shrink-0">
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
            <div className="space-y-3">
              <div>
                <h4 className="text-body-sm font-bold text-on-surface">Weekly Macros</h4>
                <p className="text-label-sm text-on-surface-variant">{totalCals.toLocaleString()} total kcal</p>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Carbs', pct: carbPct, dot: 'bg-primary', value: Math.round(totalCarbs) },
                  { label: 'Protein', pct: proteinPct, dot: 'bg-secondary', value: Math.round(totalProtein) },
                  { label: 'Fats', pct: fatPct, dot: 'bg-tertiary-container', value: Math.round(totalFats) },
                ].map((m) => (
                  <div key={m.label} className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${m.dot}`} />
                    <span className="text-label-sm text-on-surface-variant min-w-[48px]">{m.label}</span>
                    <span className="text-label-sm font-semibold text-on-surface">{m.pct}%</span>
                    <span className="text-label-sm text-on-surface-variant">({m.value}g)</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Consistency score */}
        <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
              <h4 className="text-body-sm font-bold text-on-surface">Weekly Consistency</h4>
            </div>
            <div>
              <p className="text-[40px] font-bold text-on-surface leading-none">{consistencyScore}%</p>
              <p className="text-label-sm text-on-surface-variant mt-1">
                {daysWithMeals === 0 ? 'No meals logged this week' :
                  `${daysWithMeals}/7 days with meals`}
              </p>
            </div>
          </div>
          <div className="relative w-20 h-20">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="33" fill="none" strokeWidth="7" className="stroke-surface-container-highest" />
              <circle cx="40" cy="40" r="33" fill="none" strokeWidth="7" className="stroke-primary" strokeLinecap="round"
                strokeDasharray={`${(consistencyScore / 100) * 207.3} 207.3`}
                style={{ transition: 'stroke-dasharray 0.8s ease', filter: 'drop-shadow(0 0 4px rgba(98,177,111,0.3))' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
