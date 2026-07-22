import { useState, useEffect, useRef } from 'react';
import type { FoodItem } from 'types/nutrition';
import { nutritionService } from '@services/nutrition.service';

interface FoodPickerModalProps {
  open: boolean;
  mealType: string;
  recentFoods: FoodItem[];
  onSelect: (foodItemId: number) => void;
  onClose: () => void;
}

export function FoodPickerModal({ open, mealType, recentFoods, onSelect, onClose }: FoodPickerModalProps) {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<FoodItem[]>([]);
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearch('');
      setResults([]);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = null;

    if (!search.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      return;
    }

    const q = search.toLowerCase();
    const local = recentFoods.filter(f =>
      f.name.toLowerCase().includes(q) || (f.category && f.category.toLowerCase().includes(q))
    );

    if (local.length > 0) {
      setResults(local);
    } else {
      setSearching(true);
      timerRef.current = setTimeout(async () => {
        try {
          const apiResults = await nutritionService.searchFoods(q);
          setResults(apiResults);
        } catch {
          setResults([]);
        } finally {
          setSearching(false);
        }
      }, 300);
    }
  }, [search, recentFoods]);

  if (!open) return null;

  const displayItems = results.length > 0 ? results : (search.trim() ? [] : recentFoods);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div
        className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant">
          <h3 className="text-sm font-semibold capitalize">Add to {mealType}</h3>
          <button onClick={onClose} className="p-1 text-on-surface-variant hover:text-on-surface rounded-full">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="px-4 py-3">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">search</span>
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search foods..."
              id="food-search"
              className="w-full pl-9 pr-4 py-2 bg-surface-container-low rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary placeholder:text-on-surface-variant"
            />
          </div>
        </div>

        <div className="max-h-72 overflow-y-auto px-4 pb-4 space-y-1">
          {searching ? (
            <div className="flex items-center justify-center gap-2 py-8 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined animate-spin text-base">refresh</span>
              Searching...
            </div>
          ) : displayItems.length === 0 ? (
            <p className="text-center text-sm text-on-surface-variant py-8">
              {search ? 'No foods found. Try a different search term.' : 'No recent foods. Start typing to search.'}
            </p>
          ) : (
            displayItems.map(food => (
              <button
                key={food.id}
                onClick={() => { onSelect(food.id); onClose(); }}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-surface-container transition-colors text-left"
              >
                <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-base text-secondary">{food.icon || 'restaurant'}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{food.name}</p>
                  <p className="text-xs text-on-surface-variant">{food.servingSize} &bull; {food.calories} kcal</p>
                </div>
                <span className="material-symbols-outlined text-primary text-base">add_circle</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
