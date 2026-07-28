import { useState } from 'react';
import type { AIDayPlan } from 'types/ai-meal-plan';
import { MealPreviewCard } from './MealPreviewCard';

const mealOrder: Record<string, number> = { breakfast: 1, lunch: 2, snack: 3, dinner: 4 };

const dayAccent: Record<string, { dot: string }> = {
  Mon: { dot: 'bg-blue-400' },
  Tue: { dot: 'bg-emerald-400' },
  Wed: { dot: 'bg-violet-400' },
  Thu: { dot: 'bg-amber-400' },
  Fri: { dot: 'bg-rose-400' },
  Sat: { dot: 'bg-indigo-400' },
  Sun: { dot: 'bg-orange-400' },
};

interface DayReviewPanelProps {
  day: AIDayPlan;
  index: number;
}

export function DayReviewPanel({ day, index }: DayReviewPanelProps) {
  const [collapsed, setCollapsed] = useState(index > 0);
  const sortedMeals = [...day.meals].sort(
    (a, b) => (mealOrder[a.mealType] ?? 99) - (mealOrder[b.mealType] ?? 99),
  );
  const accent = dayAccent[day.dayOfWeek] || { dot: 'bg-outline-variant' };

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-container-low transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${accent.dot}`} />
          <span className="text-sm font-bold text-on-surface">{day.dayOfWeek}</span>
          <span className="text-xs text-on-surface-variant">{day.date}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-label-sm text-secondary font-semibold">
            {(day.confidence * 100).toFixed(0)}%
          </span>
          <span className="material-symbols-outlined text-base text-on-surface-variant transition-transform" style={{ transform: collapsed ? 'rotate(-90deg)' : '' }}>
            expand_more
          </span>
        </div>
      </button>

      {!collapsed && (
        <div className="px-3 pb-3 space-y-2">
          {sortedMeals.map((meal, i) => (
            <MealPreviewCard key={`${day.date}-${i}`} meal={meal} />
          ))}

          <div className="flex items-center justify-between px-1 pt-2 border-t border-outline-variant/40">
            <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Totals</span>
            <div className="flex items-center gap-3 text-label-sm text-on-surface-variant">
              <span className="flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[11px]">local_fire_department</span>
                {day.dayTotals.calories}
              </span>
              <span>P:{day.dayTotals.proteinGrams}g</span>
              <span>C:{day.dayTotals.carbsGrams}g</span>
              <span>F:{day.dayTotals.fatsGrams}g</span>
            </div>
          </div>

          {day.warnings.length > 0 && (
            <div className="px-1 pt-1">
              {day.warnings.map((w, i) => (
                <p key={i} className="text-[10px] text-amber-600 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[10px]">warning</span>
                  {w}
                </p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}