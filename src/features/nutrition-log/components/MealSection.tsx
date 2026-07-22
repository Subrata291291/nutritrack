import type { MealEntry } from 'types/nutrition';

interface MealSectionProps {
  icon: string;
  title: string;
  calories: number;
  items: MealEntry[];
  empty?: boolean;
  emptyIcon?: string;
  emptyMessage?: string;
  ctaLabel?: string;
  onAddFood: () => void;
  onDeleteFood: (entryId: number) => void;
}

export function MealSection({ icon, title, calories, items, empty, emptyIcon, emptyMessage, ctaLabel, onAddFood, onDeleteFood }: MealSectionProps) {
  if (empty) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant border-dashed rounded-xl p-xl flex flex-col items-center justify-center text-center opacity-60">
        <span className="material-symbols-outlined text-[48px] text-outline mb-md">{emptyIcon || 'nights_stay'}</span>
        <h3 className="font-headline-md text-body-lg font-bold mb-1">{title}</h3>
        <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">{emptyMessage || 'Nothing logged yet.'}</p>
        <button onClick={onAddFood} className="bg-primary text-on-primary px-lg py-2 rounded-lg font-label-md text-label-md flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px]">add</span>
          {ctaLabel || `Log ${title}`}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
      <div className="p-md bg-surface-container-low flex justify-between items-center border-b border-outline-variant">
        <div className="flex items-center gap-md">
          <span className="material-symbols-outlined text-primary">{icon}</span>
          <h3 className="font-headline-md text-body-lg font-bold">{title}</h3>
        </div>
        <span className="font-label-md text-label-md bg-primary-container text-on-primary-container px-3 py-1 rounded-full">{Math.round(calories)} kcal</span>
      </div>
      <div className="p-md space-y-3">
        {items.map((entry) => (
          <div key={entry.id} className="flex justify-between items-center group">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">{entry.foodItem.icon || 'restaurant'}</span>
              </div>
              <div>
                <p className="font-body-md text-body-md font-medium">{entry.foodItem.name}</p>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{entry.servings} serving(s) &bull; {Math.round(entry.foodItem.calories * entry.servings)} kcal</p>
              </div>
            </div>
            <button onClick={() => onDeleteFood(entry.id)} className="opacity-0 group-hover:opacity-100 p-2 text-on-surface-variant hover:text-error transition-all">
              <span className="material-symbols-outlined">delete</span>
            </button>
          </div>
        ))}
      </div>
      <button onClick={onAddFood} className="w-full p-3 border-t border-dashed border-outline-variant text-primary font-label-md text-label-md flex items-center justify-center gap-2 hover:bg-primary-container/5 transition-colors">
        <span className="material-symbols-outlined text-[20px]">add</span>
        Add Food
      </button>
    </div>
  );
}
