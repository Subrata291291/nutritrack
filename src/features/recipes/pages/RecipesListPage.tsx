import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '@utils/cn';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import { EmptyState } from '@components/shared/EmptyState';
import { recipesService } from '@services/recipes.service';
import type { Recipe } from 'types/recipe';

export function RecipesListPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string; count: number }[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    recipesService.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchRecipes() {
      try {
        if (!cancelled) setLoading(true);
        const params: { page: number; category?: string; search?: string } = { page: 1 };
        if (activeCategory) params.category = activeCategory;
        if (searchQuery) params.search = searchQuery;
        const data = await recipesService.getRecipes(params);
        if (!cancelled) setRecipes(data);
      } catch {
        if (!cancelled) setRecipes([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchRecipes();
    return () => { cancelled = true; };
  }, [activeCategory, searchQuery]);

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      <div className="p-margin-mobile md:p-margin-desktop space-y-xl max-w-7xl mx-auto w-full">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Recipes</h2>
          <p className="font-body-md text-body-md text-secondary">Browse our collection of healthy recipes.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(undefined)}
            className={cn(
              'px-4 py-2 text-sm font-semibold rounded-full border transition-colors',
              activeCategory === undefined
                ? 'bg-primary text-on-primary border-primary'
                : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container'
            )}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.slug)}
              className={cn(
                'px-4 py-2 text-sm font-semibold rounded-full border transition-colors',
                activeCategory === cat.slug
                  ? 'bg-primary text-on-primary border-primary'
                  : 'bg-surface-container-low text-on-surface-variant border-outline-variant hover:bg-surface-container'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner size="lg" text="Loading recipes..." />
        ) : recipes.length === 0 ? (
          <EmptyState icon="restaurant" title="No recipes found" description="Try a different category or check back later." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recipes.map((recipe) => (
              <Link
                key={recipe.id}
                to={`/recipes/${recipe.id}`}
                className="group block bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] bg-surface-container-highest overflow-hidden">
                  {recipe.imageUrl ? (
                    <img
                      src={recipe.imageUrl}
                      alt={recipe.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-container/40 to-primary-container/10" />
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {recipe.tags?.[0] && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary-container/20 text-primary uppercase tracking-tighter">
                        {recipe.tags[0]}
                      </span>
                    )}
                    <span className="text-xs text-on-surface-variant">{recipe.prepTime} min</span>
                  </div>
                  <h3 className="text-sm font-semibold text-on-surface truncate">{recipe.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-2">
                    <span>{recipe.caloriesPerServing} kcal</span>
                    <span className="w-1 h-1 rounded-full bg-outline-variant" />
                    <span>P: {recipe.proteinGrams}g</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
