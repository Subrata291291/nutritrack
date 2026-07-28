import { useState, useEffect, useCallback } from 'react';
import { Modal } from '@components/shared/Modal';
import { Button } from '@components/ui/Button';
import { SwapPreviewCard } from './SwapPreviewCard';
import { useMealSwap } from '../hooks/useMealSwap';
import type { PlannedMeal, MealPlanDay } from 'types/meal-plan';
import type { SwapAlternative } from 'types/ai-meal-plan';

const MACRO_THRESHOLD = 0.2;

interface MealSwapModalProps {
  open: boolean;
  meal: PlannedMeal | null;
  dayDate: string;
  dayTotals: { calories: number; proteinGrams: number; carbsGrams: number; fatsGrams: number };
  days: MealPlanDay[];
  weekStart: string;
  onClose: () => void;
  onRefresh: () => void;
  onToast: (type: 'success' | 'error', msg: string) => void;
}

export function MealSwapModal({
  open,
  meal,
  dayDate,
  dayTotals,
  days,
  weekStart,
  onClose,
  onRefresh,
  onToast,
}: MealSwapModalProps) {
  const { loading, error, alternatives, warnings, suggestSwap, applySwap, reset } = useMealSwap();
  const [selectedAlt, setSelectedAlt] = useState<SwapAlternative | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [applying, setApplying] = useState(false);

  const alreadyUsedRecipeIds = useCallback((recipeId: number): boolean => {
    if (!meal) return false;
    const day = days.find((d) => d.date === dayDate);
    if (!day) return false;
    return day.meals.some((m) => m.id !== meal.id && m.recipe?.id === recipeId);
  }, [days, dayDate, meal]);

  useEffect(() => {
    if (open && meal) {
      suggestSwap(meal.id, meal.mealType, dayTotals);
    }
  }, [open, meal, dayTotals, suggestSwap]);

  const handleSelectAlt = (alt: SwapAlternative) => {
    if (alreadyUsedRecipeIds(alt.recipeId)) return;
    setSelectedAlt(alt);
  };

  const handleApply = async () => {
    if (!selectedAlt || !meal) return;
    setApplying(true);
    const ok = await applySwap(selectedAlt, meal.id, dayDate, days, weekStart);
    setApplying(false);
    if (ok) {
      onToast('success', `Replaced with ${selectedAlt.recipeName}`);
      onClose();
      onRefresh();
    } else {
      onToast('error', 'Failed to replace meal. Please try again.');
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleRetry = () => {
    if (!meal) return;
    setSelectedAlt(null);
    setShowConfirm(false);
    suggestSwap(meal.id, meal.mealType, dayTotals);
  };

  const calcMacroDiff = (alt: SwapAlternative) => {
    if (!meal) return 0;
    const calDiff = Math.abs(alt.calories - meal.calories);
    const protDiff = Math.abs(alt.proteinGrams - meal.proteinGrams);
    return Math.max(
      meal.calories > 0 ? calDiff / meal.calories : 0,
      meal.proteinGrams > 0 ? protDiff / meal.proteinGrams : 0,
    );
  };

  return (
    <Modal open={open} onClose={applying ? () => {} : handleClose} title="Swap Meal" className="max-w-xl">
      {/* Current meal info */}
      {meal && (
        <div className="mb-4 p-3 rounded-xl bg-surface-container-low border border-outline-variant/40">
          <p className="text-label-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-1">Current Meal</p>
          <p className="text-sm font-semibold text-on-surface">{meal.recipe?.title || 'Meal'}</p>
          <div className="flex items-center gap-2 mt-1 text-label-sm text-on-surface-variant">
            <span className="flex items-center gap-0.5">
              <span className="material-symbols-outlined text-[11px]">local_fire_department</span>
              {meal.calories}
            </span>
            <span className="w-1 h-1 rounded-full bg-outline-variant/60" />
            <span>P:{meal.proteinGrams}g</span>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <span className="material-symbols-outlined text-[36px] text-secondary animate-spin">sync</span>
            <p className="text-label-sm text-on-surface-variant">Finding alternatives...</p>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="mb-4 p-3 rounded-xl bg-error-container/20 border border-error/20">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-error text-sm">error</span>
            <span className="text-label-sm font-semibold text-error">Error</span>
          </div>
          <p className="text-label-sm text-error ml-6">{error}</p>
          <div className="flex gap-2 mt-3 ml-6">
            <Button variant="ghost" size="sm" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleRetry}>
              <span className="material-symbols-outlined text-sm">refresh</span>
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && !loading && !error && (
        <div className="mb-3 p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40">
          {warnings.map((w, i) => (
            <p key={i} className="text-label-sm text-amber-600 dark:amber-400">{w}</p>
          ))}
        </div>
      )}

      {/* Alternatives */}
      {!loading && !error && alternatives.length > 0 && !showConfirm && (
        <>
          <p className="text-label-xs font-semibold text-on-surface-variant uppercase tracking-wider mb-2">
            Suggested Replacements
          </p>
          <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-1">
            {alternatives.map((alt, i) => {
              const isDup = alreadyUsedRecipeIds(alt.recipeId);
              const macroDiff = calcMacroDiff(alt);
              return (
                <div key={i} className="relative">
                  <SwapPreviewCard
                    alternative={alt}
                    mealType={meal!.mealType}
                    isSelected={selectedAlt?.recipeId === alt.recipeId}
                    isDuplicate={isDup}
                    onClick={() => handleSelectAlt(alt)}
                  />
                  {macroDiff > MACRO_THRESHOLD && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5 ml-1">
                      Macro difference: {Math.round(macroDiff * 100)}% — may affect daily targets
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-end mt-4 pt-4 border-t border-outline-variant/40">
            <Button
              variant="primary"
              onClick={() => setShowConfirm(true)}
              disabled={!selectedAlt || applying}
            >
              Replace with Selected
            </Button>
          </div>
        </>
      )}

      {/* Confirmation */}
      {!loading && !error && showConfirm && selectedAlt && (
        <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant">
          <p className="text-body-md font-semibold text-on-surface mb-1">Replace this meal?</p>
          <p className="text-label-sm text-on-surface-variant mb-3">
            <span className="font-semibold">{selectedAlt.recipeName}</span> will replace{' '}
            <span className="font-semibold">{meal?.recipe?.title || 'current meal'}</span>.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowConfirm(false)} disabled={applying}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleApply} loading={applying}>
              <span className="material-symbols-outlined text-sm">check_circle</span>
              Replace
            </Button>
          </div>
        </div>
      )}

      {/* No alternatives */}
      {!loading && !error && alternatives.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <span className="material-symbols-outlined text-[40px] text-on-surface-variant/40">search_off</span>
          <p className="text-body-md text-on-surface-variant font-semibold">No alternatives found</p>
          <p className="text-label-sm text-on-surface-variant text-center">AI could not suggest suitable replacements.</p>
          <div className="flex gap-2 mt-3">
            <Button variant="ghost" size="sm" onClick={handleClose}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleRetry}>
              <span className="material-symbols-outlined text-sm">refresh</span>
              Try Again
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}