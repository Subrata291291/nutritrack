import { useNavigate } from 'react-router-dom';
import type { MealEntry } from 'types/nutrition';

interface NextMealWidgetProps {
  meals?: MealEntry[];
}

export function NextMealWidget({ meals = [] }: NextMealWidgetProps) {
  const navigate = useNavigate();
  const nextMeal = meals.length > 0 ? meals[meals.length - 1] : null;

  if (!nextMeal) {
    return (
      <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.05)] border border-outline-variant flex flex-col justify-between col-span-12 lg:col-span-5">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[24px] font-semibold">Next Meal</h3>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-on-surface-variant">
          <span className="material-symbols-outlined text-4xl mb-2">restaurant</span>
          <p className="text-sm">No meals logged yet today</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate('/log')} className="flex-grow py-4 bg-primary text-on-primary text-sm font-semibold tracking-wider rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary-container/20">
            Log Meal Now
          </button>
          <button className="w-14 h-14 flex items-center justify-center border-2 border-outline-variant text-on-surface-variant rounded-xl hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined">swap_horiz</span>
          </button>
        </div>
      </section>
    );
  }

  const time = new Date(nextMeal.loggedAt).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const mealCounts: Record<string, number> = {};
  for (const m of meals) {
    mealCounts[m.mealType] = (mealCounts[m.mealType] || 0) + 1;
  }

  return (
    <section className="bg-surface-container-lowest rounded-xl p-6 shadow-[0px_4px_6px_rgba(0,0,0,0.05)] border border-outline-variant flex flex-col justify-between col-span-12 lg:col-span-5">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[24px] font-semibold">Next Meal</h3>
          <span className="flex items-center gap-1 text-sm font-semibold tracking-wider text-primary">
            <span className="material-symbols-outlined text-sm">schedule</span>
            {time}
          </span>
        </div>
        <div className="flex gap-6 items-center bg-surface-container-low p-4 rounded-xl border border-outline-variant mb-6 group hover:bg-surface-container-lowest transition-all duration-300">
          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 shadow-md bg-surface-container-highest flex items-center justify-center">
            <span className="material-symbols-outlined text-4xl text-primary">restaurant</span>
          </div>
          <div className="flex-grow">
            <div className="flex items-center gap-1 mb-1">
              <span className="bg-primary/20 text-[#00422b] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">
                {nextMeal.mealType}
              </span>
            </div>
            <h4 className="text-[24px] font-semibold text-lg leading-tight mb-1">{nextMeal.foodItem?.name || 'Unknown Food'}</h4>
            <div className="flex gap-4 text-xs text-on-surface-variant">
              <span><strong className="text-on-surface">{Math.round((nextMeal.foodItem?.calories || 0) * nextMeal.servings)}</strong> kcal</span>
              <span><strong className="text-on-surface">{Math.round((nextMeal.foodItem?.proteinGrams || 0) * nextMeal.servings)}g</strong> protein</span>
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-4">
        {meals.map((m) => (
          <div key={m.id} className="flex items-center justify-between p-2 border-b border-outline-variant/30 last:border-0">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#6c7a71]">history</span>
              <span className="text-sm">{m.mealType}: {m.foodItem?.name || 'Unknown Food'}</span>
            </div>
            <span className="material-symbols-outlined text-primary-container">check_circle</span>
          </div>
        ))}
        <div className="flex gap-2">
          <button onClick={() => navigate('/log')} className="flex-grow py-4 bg-primary text-on-primary text-sm font-semibold tracking-wider rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary-container/20">
            Log Meal Now
          </button>
          <button className="w-14 h-14 flex items-center justify-center border-2 border-outline-variant text-on-surface-variant rounded-xl hover:bg-surface-container-highest transition-colors">
            <span className="material-symbols-outlined">swap_horiz</span>
          </button>
        </div>
      </div>
    </section>
  );
}
