import type { MealEntry } from 'types/nutrition';

interface TimelineMealCardProps {
  type: string;
  icon: string;
  title: string;
  calories: number;
  targetCalories?: number;
  items: MealEntry[];
  empty?: boolean;
  emptyIcon?: string;
  emptyMessage?: string;
  ctaLabel?: string;
  onAddFood: () => void;
  onDeleteFood: (entryId: number) => void;
}

const mealAccent: Record<string, { dot: string; line: string; iconBg: string }> = {
  breakfast: { dot: 'bg-amber-400', line: 'bg-amber-400/20', iconBg: 'bg-amber-400/10' },
  lunch:     { dot: 'bg-emerald-400', line: 'bg-emerald-400/20', iconBg: 'bg-emerald-400/10' },
  dinner:    { dot: 'bg-violet-400', line: 'bg-violet-400/20', iconBg: 'bg-violet-400/10' },
  snack:     { dot: 'bg-rose-400', line: 'bg-rose-400/20', iconBg: 'bg-rose-400/10' },
};

export function TimelineMealCard({ type, icon, title, calories, targetCalories = 2400, items, empty, emptyIcon, emptyMessage, ctaLabel, onAddFood, onDeleteFood }: TimelineMealCardProps) {
  const accent = mealAccent[type] || mealAccent.snack;
  const mealPct = targetCalories > 0 ? Math.round((calories / targetCalories) * 100) : 0;

  if (empty) {
    return (
      <div className="flex gap-4 group">
        <div className="flex flex-col items-center pt-1">
          <div className={`w-3.5 h-3.5 rounded-full ${accent.dot} ring-2 ring-surface-container-lowest`} />
          <div className={`w-0.5 flex-1 ${accent.line}`} />
        </div>
        <div className="flex-1 pb-8">
          <div className="bg-surface-container-lowest border border-dashed border-outline-variant rounded-xl p-xl flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity">
            <span className={`material-symbols-outlined text-[44px] ${accent.iconBg} p-3 rounded-full mb-3`} style={{ color: accent.dot.replace('bg-', '') }}>{emptyIcon || 'nights_stay'}</span>
            <h3 className="font-headline-md text-body-lg font-bold mb-1">{title}</h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">{emptyMessage || 'Nothing logged yet.'}</p>
            <button onClick={onAddFood} className="w-full py-4 bg-primary-container text-on-primary text-sm font-semibold tracking-wider rounded-xl hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1">
              <span className="material-symbols-outlined text-[20px]">add</span>
              {ctaLabel || `Log ${title}`}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center pt-1">
        <div className={`w-3.5 h-3.5 rounded-full ${accent.dot} ring-2 ring-surface-container-lowest`} />
        <div className={`w-0.5 flex-1 ${accent.line}`} />
      </div>
      <div className="flex-1 pb-8">
        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          {/* Header */}
          <div className="flex items-center justify-between px-xl py-4 border-b border-outline-variant">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${accent.iconBg} flex items-center justify-center`}>
                <span className="material-symbols-outlined" style={{ color: accent.dot.replace('bg-', '') }}>{icon}</span>
              </div>
              <div>
                <h3 className="text-body-md font-bold text-on-surface">{title}</h3>
                <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                  <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
                  <span className="w-1 h-1 rounded-full bg-outline-variant" />
                  <span>{mealPct}% of daily goal</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-body-lg font-bold text-on-surface">{Math.round(calories)}</span>
              <span className="text-label-sm text-on-surface-variant ml-1">kcal</span>
            </div>
          </div>

          {/* Food items */}
          <div className="divide-y divide-outline-variant/50">
            {items.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between px-xl py-3 hover:bg-surface-container-low/30 transition-colors group/item">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-body-md text-secondary">{entry.foodItem.icon || 'restaurant'}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-body-md font-medium text-on-surface truncate">{entry.foodItem.name}</p>
                    <p className="text-label-sm text-on-surface-variant">{entry.servings} serving(s)</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-label-md font-semibold text-on-surface">{Math.round(entry.foodItem.calories * entry.servings)}</span>
                  <button onClick={() => onDeleteFood(entry.id)} className="opacity-0 group-hover/item:opacity-100 p-1.5 text-on-surface-variant hover:text-error rounded-lg hover:bg-error-container/20 transition-all" title="Remove">
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add button */}
          <button onClick={onAddFood} className="w-full py-4 bg-primary-container text-on-primary text-sm font-semibold tracking-wider rounded-none hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Add Food
          </button>
        </div>
      </div>
    </div>
  );
}
