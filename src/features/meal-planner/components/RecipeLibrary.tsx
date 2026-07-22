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
    <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant shadow-[0px_4px_6px_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-headline-md font-semibold text-on-surface">Recipe Library</h3>
        <button
          onClick={() => navigate('/recipes')}
          className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline"
        >
          View all
          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {categoryFilters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
              activeFilter === f
                ? 'bg-primary text-on-primary border-primary'
                : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container'
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      {loading ? (
        <LoadingSpinner size="sm" />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2 text-on-surface-variant">
          <span className="material-symbols-outlined text-[36px] opacity-40">restaurant_menu</span>
          <p className="text-sm">No recipes found for "{activeFilter}"</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((recipe) => (
            <button
              key={recipe.id}
              onClick={() => navigate(`/recipes/${recipe.id}`)}
              className="w-full flex gap-3 p-2 rounded-xl hover:bg-surface-container-low active:scale-[0.98] transition-all cursor-pointer group text-left border border-transparent hover:border-outline-variant/50"
            >
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-surface-container-highest flex items-center justify-center">
                {recipe.imageUrl ? (
                  <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <span className="material-symbols-outlined text-outline">restaurant</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                  {recipe.tags[0] && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary-container/20 text-primary uppercase tracking-tighter">{recipe.tags[0]}</span>
                  )}
                  <span className="text-[10px] text-on-surface-variant">{recipe.prepTime} min</span>
                </div>
                <p className="text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{recipe.title}</p>
                <div className="flex gap-2 text-xs text-on-surface-variant mt-0.5">
                  <span>{recipe.caloriesPerServing}kcal</span>
                  <span>P:{recipe.proteinGrams}g</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/40 group-hover:text-primary transition-colors self-center text-[18px]">
                chevron_right
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
