import { useState, useEffect, useCallback } from 'react';
import { DaySelector, DailyPlanner, PlannerToolbar, AddMealModal, RecipeLibrary, AIGeneratePanel, AIReviewModal, MealSwapModal } from '../components';
import { ShoppingListModal } from '../components/ShoppingListModal';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import { EmptyState } from '@components/shared/EmptyState';
import { Button } from '@components/ui/Button';
import { parseLocalDate } from '@utils/format';
import { useMealPlanner } from '../hooks/useMealPlanner';
import { useMealGeneration } from '../hooks/useMealGeneration';
import { mealPlansService } from '@services/meal-plans.service';
import type { MealPlanDay, PlannedMeal } from 'types/meal-plan';
import type { Recipe } from 'types/recipe';

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatWeekRange(weekStart: string): string {
  const start = parseLocalDate(weekStart);
  const end = parseLocalDate(weekStart);
  end.setDate(end.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', opts)} – ${end.toLocaleDateString('en-US', opts)}`;
}

export function MealPlannerPage() {
  const { mealPlan, loading, error, selectedDay, setSelectedDay, refresh, retry, deleteMeal } = useMealPlanner();
  const { days, weekStart } = mealPlan;

  const selectedDayData = days.find((d) => d.date === selectedDay);
  const hasMeals = days.some((d) => d.meals.length > 0);

  const [shoppingListOpen, setShoppingListOpen] = useState(false);
  const [addMealDate, setAddMealDate] = useState<string | null>(null);
  const [modalOpenCount, setModalOpenCount] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const gen = useMealGeneration();
  const genSaveSuccess = gen.saveSuccess;
  const genReset = gen.reset;

  const [swapOpen, setSwapOpen] = useState(false);
  const [swapMeal, setSwapMeal] = useState<PlannedMeal | null>(null);
  const [swapDayDate, setSwapDayDate] = useState('');
  const [swapModalKey, setSwapModalKey] = useState(0);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showToast = useCallback((type: 'success' | 'error', msg: string) => {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }, []);

  useEffect(() => {
    if (genSaveSuccess) {
      refresh();
      genReset();
    }
  }, [genSaveSuccess, refresh, genReset]);

  const handleGenerate = useCallback(() => {
    gen.generate();
  }, [gen]);

  const handleApprove = useCallback(() => {
    setShowConfirm(true);
  }, []);

  const handleConfirmSave = useCallback(async () => {
    const ok = await gen.savePlan(weekStart);
    if (ok) {
      setShowConfirm(false);
    }
  }, [gen, weekStart]);

  const handleCancelConfirm = useCallback(() => {
    setShowConfirm(false);
  }, []);

  const handleRetrySave = useCallback(async () => {
    const ok = await gen.savePlan(weekStart);
    if (ok) {
      setShowConfirm(false);
    }
  }, [gen, weekStart]);

  const handleCancelReview = useCallback(() => {
    setShowConfirm(false);
    gen.reset();
  }, [gen]);

  const handleSwapMeal = useCallback((mealId: number, date: string) => {
    const day = days.find((d) => d.date === date);
    if (!day) return;
    const meal = day.meals.find((m) => m.id === mealId);
    if (!meal) return;
    setSwapMeal(meal);
    setSwapDayDate(date);
    setSwapModalKey((c) => c + 1);
    setSwapOpen(true);
  }, [days]);

  const handleCloseSwap = useCallback(() => {
    setSwapOpen(false);
    setSwapMeal(null);
    setSwapDayDate('');
  }, []);

  const openAddMeal = useCallback((date: string) => {
    setAddMealDate(date);
    setModalOpenCount((c) => c + 1);
  }, []);

  const handleConfirmAddMeal = useCallback(async (date: string, mealType: string, recipe: Recipe) => {
    const dateObj = parseLocalDate(date);
    const dayName = dayLabels[dateObj.getDay()];

    const newMeal: PlannedMeal = {
      id: Date.now(),
      mealType: mealType as PlannedMeal['mealType'],
      recipe: {
        id: recipe.id,
        title: recipe.title,
        imageUrl: recipe.imageUrl,
        prepTime: recipe.prepTime,
        calories: recipe.caloriesPerServing,
        tags: recipe.tags,
      },
      calories: recipe.caloriesPerServing,
      proteinGrams: recipe.proteinGrams,
    };

    const existingDay = days.find((d) => d.date === date);
    let updatedDays: MealPlanDay[];

    if (existingDay) {
      updatedDays = days.map((d) => {
        if (d.date !== date) return d;
        return {
          ...d,
          meals: [...d.meals, newMeal],
          totalCalories: d.totalCalories + newMeal.calories,
          totalProtein: d.totalProtein + newMeal.proteinGrams,
        };
      });
    } else {
      updatedDays = [...days, {
        date,
        dayName,
        meals: [newMeal],
        totalCalories: newMeal.calories,
        totalProtein: newMeal.proteinGrams,
        totalCarbs: 0,
        totalFats: 0,
      }];
    }

    await mealPlansService.saveMealPlan(weekStart, updatedDays);
    refresh();
    setAddMealDate(null);
  }, [days, weekStart, refresh]);

  if (loading) {
    return (
      <div className="bg-background min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading meal plan..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <EmptyState
          icon="error"
          title="Something went wrong"
          description="Failed to load meal plan. Please try again."
          action={<Button onClick={retry}>Try Again</Button>}
        />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_month</span>
            </div>
            <div>
              <h2 className="text-headline-lg font-bold text-on-surface">Weekly Planner</h2>
              <p className="text-body-md text-on-surface-variant">{formatWeekRange(weekStart)}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative group">
          <button onClick={() => setShoppingListOpen(true)}
            disabled={!hasMeals}
            className="flex-1 sm:flex-none py-2.5 px-5 bg-surface-container-lowest text-on-surface text-label-sm font-semibold rounded-xl border border-outline-variant shadow-sm hover:bg-surface-container-low transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            <span className="material-symbols-outlined text-lg">shopping_cart</span>
            Shopping List
          </button>
          {!hasMeals && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-on-surface text-surface text-label-xs font-semibold whitespace-nowrap shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              Add meals before generating a grocery list.
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-on-surface rotate-45" />
            </div>
          )}
        </div>
          <div className="flex-1 sm:flex-none flex items-center gap-2">
            {!gen.loading && !gen.error && !gen.plan && (
              <button onClick={handleGenerate}
                className="py-2.5 px-5 bg-primary text-on-primary text-label-sm font-semibold rounded-xl shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <span className="material-symbols-outlined text-lg">auto_awesome</span>
                Auto-Generate
              </button>
            )}
            <AIGeneratePanel
              loading={gen.loading}
              error={gen.error}
              planGenerated={gen.plan !== null}
              warningCount={gen.warnings.length}
              overallConfidence={gen.plan?.overallConfidence ?? null}
              onGenerate={handleGenerate}
              onRetry={gen.retry}
              onReset={gen.reset}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <DaySelector weekStart={weekStart} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
          <PlannerToolbar selectedDay={selectedDay} />
          <DailyPlanner day={selectedDayData} onAddMeal={openAddMeal} onDeleteMeal={deleteMeal} onSwapMeal={handleSwapMeal} />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <RecipeLibrary />
        </div>
      </div>

      <AddMealModal key={modalOpenCount} isOpen={addMealDate !== null} onClose={() => setAddMealDate(null)} selectedDate={addMealDate || ''} onConfirm={handleConfirmAddMeal} />
      <ShoppingListModal isOpen={shoppingListOpen} onClose={() => setShoppingListOpen(false)} days={days} />
      <AIReviewModal
        open={gen.plan !== null || gen.saveError !== null}
        plan={gen.plan}
        warnings={gen.warnings}
        onApprove={handleApprove}
        onCancel={handleCancelReview}
        onRegenerate={gen.retry}
        regenerating={gen.loading}
        saving={gen.saving}
        saveError={gen.saveError}
        failedDates={gen.failedDates}
        showConfirm={showConfirm}
        onConfirmSave={handleConfirmSave}
        onCancelConfirm={handleCancelConfirm}
        onRetrySave={handleRetrySave}
      />

      <MealSwapModal key={swapModalKey}
        open={swapOpen}
        meal={swapMeal}
        dayDate={swapDayDate}
        dayTotals={{
          calories: days.find((d) => d.date === swapDayDate)?.totalCalories ?? 0,
          proteinGrams: days.find((d) => d.date === swapDayDate)?.totalProtein ?? 0,
          carbsGrams: days.find((d) => d.date === swapDayDate)?.totalCarbs ?? 0,
          fatsGrams: days.find((d) => d.date === swapDayDate)?.totalFats ?? 0,
        }}
        days={days}
        weekStart={weekStart}
        onClose={handleCloseSwap}
        onRefresh={refresh}
        onToast={showToast}
      />

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[60] animate-slide-up">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border ${
            toast.type === 'success'
              ? 'bg-secondary-container text-on-secondary-container border-secondary/30'
              : 'bg-error-container text-on-error-container border-error/30'
          }`}>
            <span className="material-symbols-outlined text-sm">
              {toast.type === 'success' ? 'check_circle' : 'error'}
            </span>
            <span className="text-label-sm font-semibold">{toast.msg}</span>
          </div>
        </div>
      )}
    </div>
  );
}
