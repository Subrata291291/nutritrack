import { useState, useEffect } from 'react';
import { recipesService } from '@services/recipes.service';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import { parseLocalDate } from '@utils/format';
import type { Recipe } from 'types/recipe';

const categoryFilters = ['All', 'Quick', 'High Pro', 'Vegan'];
const mealTypeOptions = [
  { value: 'breakfast', label: 'Breakfast', icon: 'wb_sunny' },
  { value: 'lunch', label: 'Lunch', icon: 'lunch_dining' },
  { value: 'dinner', label: 'Dinner', icon: 'dinner_dining' },
  { value: 'snack', label: 'Snack', icon: 'cookie' },
];

interface AddMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  onConfirm: (date: string, mealType: string, recipe: Recipe) => Promise<void>;
}

export function AddMealModal({ isOpen, onClose, selectedDate, onConfirm }: AddMealModalProps) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMealType, setSelectedMealType] = useState('breakfast');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const { recipes: data } = await recipesService.getRecipes();
        setRecipes(data);
      } catch {
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, [isOpen]);

  const filtered = activeFilter === 'All'
    ? recipes
    : recipes.filter((r) => Array.isArray(r.tags) && r.tags.some((t) => typeof t === 'string' && t.toLowerCase() === activeFilter.toLowerCase()));

  const handleConfirm = async () => {
    if (!selectedRecipe || submitting) return;
    setSubmitting(true);
    setError(false);
    try {
      await onConfirm(selectedDate, selectedMealType, selectedRecipe);
    } catch {
      setError(true);
      setSubmitting(false);
    }
  };

  const formattedDate = (() => {
    const d = parseLocalDate(selectedDate);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  })();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-outline-variant/40">
          <div>
            <h2 className="text-headline-md font-semibold text-on-surface">Add Meal</h2>
            <p className="text-sm text-on-surface-variant">{formattedDate}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Meal type selector */}
          <div>
            <p className="text-label-sm font-semibold text-on-surface mb-2">Meal Type</p>
            <div className="flex gap-2">
              {mealTypeOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedMealType(opt.value)}
                  className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl text-label-sm font-semibold border transition-all ${
                    selectedMealType === opt.value
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">{opt.icon}</span>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recipe selector */}
          <div>
            <p className="text-label-sm font-semibold text-on-surface mb-2">Select Recipe</p>
            <div className="flex gap-1.5 mb-3">
              {categoryFilters.map((f) => (
                <button key={f} onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 text-label-sm font-semibold rounded-lg border transition-all ${
                    activeFilter === f
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {loading ? (
              <LoadingSpinner size="sm" />
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 gap-2 text-on-surface-variant">
                <span className="material-symbols-outlined text-[32px] opacity-40">restaurant_menu</span>
                <p className="text-sm">No recipes found</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[240px] overflow-y-auto">
                {filtered.map((recipe) => {
                  const isSelected = selectedRecipe?.id === recipe.id;
                  return (
                    <button key={recipe.id} onClick={() => setSelectedRecipe(isSelected ? null : recipe)}
                      className={`w-full flex gap-3 p-3 rounded-xl transition-all cursor-pointer text-left border ${
                        isSelected
                          ? 'bg-primary/[0.04] border-primary/40'
                          : 'hover:bg-surface-container-low border-transparent hover:border-outline-variant/50'
                      }`}
                    >
                      <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container-highest flex items-center justify-center shadow-sm">
                        {recipe.imageUrl ? (
                          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" loading="lazy" />
                        ) : (
                          <span className="material-symbols-outlined text-outline text-[24px]">restaurant</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {recipe.tags[0] && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-primary/10 text-primary uppercase tracking-tighter">{recipe.tags[0]}</span>
                          )}
                          <span className="text-[10px] text-on-surface-variant flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]">schedule</span>
                            {recipe.prepTime}m
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-on-surface truncate">{recipe.title}</p>
                        <div className="flex items-center gap-2 text-label-sm text-on-surface-variant mt-0.5">
                          <span className="flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[11px]">local_fire_department</span>
                            {recipe.caloriesPerServing}
                          </span>
                          <span className="w-1 h-1 rounded-full bg-outline-variant" />
                          <span>P:{recipe.proteinGrams}g</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isSelected ? 'bg-primary border-primary' : 'border-outline-variant'
                        }`}>
                          {isSelected && <span className="material-symbols-outlined text-[12px] text-on-primary">check</span>}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-error-container/10 border border-error/20 text-sm text-error font-medium text-center">
              Failed to add meal. Please try again.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 pt-4 border-t border-outline-variant/40">
          <button onClick={onClose} disabled={submitting}
            className="flex-1 py-3 bg-surface-container-low text-on-surface-variant text-sm font-semibold rounded-xl border border-outline-variant hover:bg-surface-container transition-colors"
          >
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={!selectedRecipe || submitting}
            className={`flex-1 py-3 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${
              selectedRecipe && !submitting
                ? 'bg-primary text-on-primary hover:opacity-90'
                : 'bg-surface-container-highest text-on-surface-variant/50 cursor-not-allowed'
            }`}
          >
            {submitting ? (
              <>
                <LoadingSpinner size="sm" />
                Adding...
              </>
            ) : (
              'Add to Plan'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}