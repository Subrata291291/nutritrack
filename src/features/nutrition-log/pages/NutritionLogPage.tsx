import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { nutritionService } from '@services/nutrition.service';
import { getRecentRecipes } from '@services/recent-recipes.service';
import type { RecentRecipeItem } from '@services/recent-recipes.service';
import { DateNavigator } from '../components/DateNavigator';
import { DailyProgressCard } from '../components/DailyProgressCard';
import { TimelineMealCard } from '../components/TimelineMealCard';
import { RecentFoods } from '../components/RecentFoods';
import { WaterTracker } from '../components/WaterTracker';
import { ExerciseWidget } from '../components/ExerciseWidget';
import { FoodPickerModal } from '../components/FoodPickerModal';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import { parseLocalDate, toLocalDateString } from '@utils/format';
import type { DailyLog, MealEntry, FoodItem } from 'types/nutrition';

const mealTypeConfig = [
  { type: 'breakfast' as const, icon: 'wb_sunny', title: 'Breakfast', emptyIcon: 'wb_sunny', emptyMessage: 'Nothing logged for breakfast yet.', ctaLabel: 'Log Breakfast' },
  { type: 'lunch' as const, icon: 'lunch_dining', title: 'Lunch', emptyIcon: 'lunch_dining', emptyMessage: 'Nothing logged for lunch yet.', ctaLabel: 'Log Lunch' },
  { type: 'dinner' as const, icon: 'dinner_dining', title: 'Dinner', emptyIcon: 'dinner_dining', emptyMessage: 'Nothing logged for dinner yet.', ctaLabel: 'Log Dinner' },
  { type: 'snack' as const, icon: 'cookie', title: 'Snacks', emptyIcon: 'cookie', emptyMessage: 'Nothing logged for snacks yet.', ctaLabel: 'Log Snack' },
];

const defaultTargets = { calories: 2400, protein: 160, carbs: 280, fats: 75 };

export function NutritionLogPage() {
  const [searchParams] = useSearchParams();
  const today = toLocalDateString(new Date());
  const initialDate = searchParams.get('date') || today;
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [dailyLog, setDailyLog] = useState<DailyLog | null>(null);
  const [recentFoods, setRecentFoods] = useState<FoodItem[]>([]);
  const [recentRecipes, setRecentRecipes] = useState<RecentRecipeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pickerMealType, setPickerMealType] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchDailyLog() {
      try {
        if (!cancelled) setLoading(true);
        const log = await nutritionService.getDailyLog(currentDate);
        if (!cancelled) setDailyLog(log);
      } catch {
        if (!cancelled) setDailyLog(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchDailyLog();
    return () => { cancelled = true; };
  }, [currentDate]);

  const fetchRecentFoods = async () => {
    try {
      const foods = await nutritionService.getRecentFoods();
      setRecentFoods(foods);
    } catch { setRecentFoods([]); }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRecentFoods();
    setRecentRecipes(getRecentRecipes());
  }, []);

  const goToPrevDay = () => {
    const prev = parseLocalDate(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(toLocalDateString(prev));
  };

  const goToNextDay = () => {
    const next = parseLocalDate(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(toLocalDateString(next));
  };

  const handleOpenPicker = (mealType: string) => setPickerMealType(mealType);

  const handleAddMeal = async (mealType: string, foodItemId: number, servings: number) => {
    try {
      await nutritionService.addMeal(mealType as MealEntry['mealType'], foodItemId, servings, currentDate);
      const log = await nutritionService.getDailyLog(currentDate);
      setDailyLog(log);
      fetchRecentFoods();
    } catch { /* ignore */ }
  };

  const handleDeleteMeal = async (entryId: number) => {
    try {
      await nutritionService.deleteMealEntry(entryId);
    } catch { /* ignore */ }
  };

  const getMealsByType = (type: string) => (dailyLog?.meals || []).filter((m) => m.mealType === type && m.foodItem);
  const getCaloriesByType = (type: string) => getMealsByType(type).reduce((sum, m) => sum + (m.foodItem?.calories || 0) * m.servings, 0);

  if (loading && !dailyLog) {
    return (
      <div className="bg-background min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading nutrition log..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-xl">
      <DateNavigator date={new Date(currentDate)} onPrev={goToPrevDay} onNext={goToNextDay} />
      <DailyProgressCard
        totals={{
          calories: dailyLog?.totalCalories || 0,
          protein: dailyLog?.totalProtein || 0,
          carbs: dailyLog?.totalCarbs || 0,
          fats: dailyLog?.totalFats || 0,
        }}
        targets={defaultTargets}
      />
      <div className="grid grid-cols-12 gap-xl items-start">
        <div className="col-span-12 lg:col-span-8">
          {mealTypeConfig.map((config) => {
            const meals = getMealsByType(config.type);
            const calories = getCaloriesByType(config.type);
            return (
              <TimelineMealCard
                key={config.type}
                type={config.type}
                icon={config.icon}
                title={config.title}
                calories={calories}
                targetCalories={defaultTargets.calories}
                items={meals}
                empty={meals.length === 0}
                emptyIcon={config.emptyIcon}
                emptyMessage={config.emptyMessage}
                ctaLabel={config.ctaLabel}
                onAddFood={() => handleOpenPicker(config.type)}
                onDeleteFood={handleDeleteMeal}
              />
            );
          })}
        </div>
        <div className="col-span-12 lg:col-span-4 space-y-lg">
          <RecentFoods items={recentFoods} recentRecipes={recentRecipes} onAddFood={(foodItemId) => handleAddMeal('snack', foodItemId, 1)} />
          <FoodPickerModal
            open={pickerMealType !== null}
            mealType={pickerMealType || ''}
            recentFoods={recentFoods}
            onSelect={(foodItemId) => handleAddMeal(pickerMealType || 'snack', foodItemId, 1)}
            onClose={() => setPickerMealType(null)}
          />
          <WaterTracker 
            initialWaterMl={dailyLog?.waterMl || 0} 
            onUpdate={async (ml) => {
              try {
                await nutritionService.updateWater(currentDate, ml);
                setDailyLog(prev => prev ? { ...prev, waterMl: ml } : null);
              } catch { /* ignore */ }
            }}
          />
          <ExerciseWidget steps={dailyLog?.steps || 0} />
        </div>
      </div>
    </div>
  );
}
