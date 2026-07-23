import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { recipesService } from '@services/recipes.service';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import type { Recipe } from 'types/recipe';

const categoryFilters = ['All', 'Quick', 'High Pro', 'Vegan'];

export function RecipeLibrary() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      try {
        const data = await recipesService.getRecipes();
        setRecipes(data);
      } catch {
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const filtered = activeFilter === 'All'
    ? recipes
    : recipes.filter((r) => Array.isArray(r.tags) && r.tags.some((t) => typeof t === 'string' && t.toLowerCase() === activeFilter.toLowerCase()));

  return (
    <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-xl pt-xl pb-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>menu_book</span>
            </div>
            <div>
              <h3 className="text-body-md font-bold text-on-surface">Recipe Library</h3>
              <p className="text-label-sm text-on-surface-variant">{filtered.length} recipes</p>
            </div>
          </div>
          <button onClick={() => navigate('/recipes')} className="text-label-sm text-primary font-semibold flex items-center gap-1 hover:underline">
            View all
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        {/* Filter pills */}
        <div className="flex gap-1.5">
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
      </div>

      {/* List */}
      <div className="px-xl pb-xl">
        {loading ? (
          <LoadingSpinner size="sm" />
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[36px] opacity-40">restaurant_menu</span>
            <p className="text-sm">No recipes found for "{activeFilter}"</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((recipe, idx) => (
              <button key={recipe.id} onClick={() => navigate(`/recipes/${recipe.id}`)}
                className="w-full flex gap-3 p-3 rounded-xl hover:bg-surface-container-low active:scale-[0.98] transition-all cursor-pointer group text-left border border-transparent hover:border-outline-variant/50"
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
                  <p className="text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{recipe.title}</p>
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
                  <span className="material-symbols-outlined text-on-surface-variant/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all text-[18px]">chevron_right</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
