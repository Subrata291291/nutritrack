import { useNavigate } from 'react-router-dom';
import type { FoodItem } from 'types/nutrition';
import type { RecentRecipeItem } from '@services/recent-recipes.service';

interface RecentFoodsProps {
  items: FoodItem[];
  onAddFood: (foodItemId: number) => void;
  recentRecipes?: RecentRecipeItem[];
}

export function RecentFoods({ items, onAddFood, recentRecipes = [] }: RecentFoodsProps) {
  const navigate = useNavigate();
  const hasItems = items.length > 0;
  const hasRecipes = recentRecipes.length > 0;

  return (
    <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
      <div className="px-xl pt-xl pb-lg">
        <h3 className="flex items-center gap-2 text-label-sm font-bold uppercase tracking-wider text-on-surface-variant mb-lg">
          <span className="material-symbols-outlined text-[18px]">history</span>
          Recent
        </h3>

        {!hasItems && !hasRecipes && (
          <p className="text-body-sm text-on-surface-variant text-center py-6">No recent foods or recipes yet</p>
        )}

        {hasItems && (
          <div className="space-y-1">
            {items.slice(0, 5).map((food) => (
              <button key={food.id} onClick={() => onAddFood(food.id)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-surface-container transition-all group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-body-sm text-secondary">{food.icon || 'restaurant'}</span>
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-body-sm font-medium text-on-surface truncate">{food.name}</p>
                    <p className="text-label-sm text-on-surface-variant">{food.servingSize} &bull; {food.calories} kcal</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-[18px] text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">add_circle</span>
              </button>
            ))}
          </div>
        )}

        {hasRecipes && (
          <div className={hasItems ? 'mt-4 pt-4 border-t border-outline-variant/50' : ''}>
            <p className="text-label-sm text-on-surface-variant mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">menu_book</span>
              Recently Viewed Recipes
            </p>
            <div className="space-y-1">
              {recentRecipes.map((recipe) => (
                <button key={`recipe-${recipe.id}`} onClick={() => navigate(`/recipes/${recipe.id}`)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-container transition-all group">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {recipe.imageUrl ? (
                      <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-body-sm text-secondary">menu_book</span>
                    )}
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-body-sm font-medium text-on-surface truncate">{recipe.title}</p>
                    <p className="text-label-sm text-on-surface-variant">{recipe.caloriesPerServing} kcal/serving</p>
                  </div>
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">arrow_forward</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
