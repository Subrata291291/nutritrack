import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import { EmptyState } from '@components/shared/EmptyState';
import { foodService } from '@services/food.service';
import type { FoodItem } from 'types/nutrition';

export function FoodListPage() {
  const navigate = useNavigate();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        if (!cancelled) setLoading(true);
        const data = await foodService.getFoods();
        if (!cancelled) setFoods(data);
      } catch {
        if (!cancelled) setFoods([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, []);

  const filtered = search
    ? foods.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()) || (f.category || '').toLowerCase().includes(search.toLowerCase()))
    : foods;

  const categories = [...new Set(foods.map((f) => f.category || 'Other').filter(Boolean))];

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      <div className="p-margin-mobile md:p-margin-desktop max-w-7xl mx-auto w-full space-y-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-headline-lg font-bold text-on-surface">Food Library</h2>
            <p className="text-body-md text-on-surface-variant">{foods.length} food items</p>
          </div>
          <div className="relative w-full sm:w-72">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search foods..."
              className="w-full pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-full text-sm focus:ring-2 focus:ring-primary outline-none placeholder:text-on-surface-variant"
            />
          </div>
        </div>

        {loading ? (
          <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading foods..." />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon="restaurant_menu" title="No foods found" description={search ? 'Try a different search term.' : 'No food items available yet.'} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((food) => (
              <button
                key={food.id}
                onClick={() => navigate(`/food/${food.id}`)}
                className="group block w-full text-left bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all active:scale-[0.98]"
              >
                <div className="aspect-[4/3] bg-surface-container-high flex items-center justify-center overflow-hidden">
                  {food.imageUrl ? (
                    <img src={food.imageUrl} alt={food.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <span className="material-symbols-outlined text-5xl text-on-surface-variant/30" style={{ fontVariationSettings: "'FILL' 1" }}>{food.icon || 'restaurant'}</span>
                  )}
                </div>
                <div className="p-4">
                  {food.category && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary uppercase tracking-tighter mb-2 inline-block">{food.category}</span>
                  )}
                  <h3 className="text-sm font-semibold text-on-surface truncate mb-1">{food.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                    <span>{food.calories} kcal</span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant" />
                    <span>P: {food.proteinGrams}g</span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant" />
                    <span>C: {food.carbsGrams}g</span>
                  </div>
                  {food.servingSize && (
                    <p className="text-[10px] text-on-surface-variant/50 mt-1.5">Per {food.servingSize}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
