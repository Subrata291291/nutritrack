import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { cn } from '@utils/cn';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import { EmptyState } from '@components/shared/EmptyState';
import { Button } from '@components/ui/Button';
import { SearchBar, Pagination } from '../components';
import { recipesService } from '@services/recipes.service';
import type { Recipe } from 'types/recipe';

export function RecipesListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string; count: number }[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCounter, setRetryCounter] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    recipesService.getCategories().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function fetchRecipes() {
      try {
        if (!cancelled) setLoading(true);
        const params: { page: number; per_page?: number; category?: string; search?: string } = { page: currentPage, per_page: pageSize };
        if (activeCategory) params.category = activeCategory;
        if (searchQuery) params.search = searchQuery;
        const { recipes: data, total } = await recipesService.getRecipes(params);
        if (!cancelled) {
          setRecipes(data);
          setTotalCount(total);
          setError(false);
        }
      } catch {
        if (!cancelled) { setRecipes([]); setTotalCount(0); setError(true); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchRecipes();
    return () => { cancelled = true; };
  }, [activeCategory, searchQuery, currentPage, retryCounter]);

  const handleCategoryClick = useCallback((slug: string | undefined) => {
    setActiveCategory(slug);
    const params = new URLSearchParams(searchParams);
    if (slug) params.set('page', '1');
    else params.delete('page');
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const handlePageChange = useCallback((page: number) => {
    const params = new URLSearchParams(searchParams);
    if (page > 1) params.set('page', String(page));
    else params.delete('page');
    setSearchParams(params, { replace: true });
  }, [searchParams, setSearchParams]);

  const handleRetry = useCallback(() => {
    setError(false);
    setLoading(true);
    setRetryCounter((c) => c + 1);
  }, []);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      <div className="p-margin-mobile md:p-margin-desktop space-y-xl max-w-7xl mx-auto w-full">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Recipes</h2>
          <p className="font-body-md text-body-md text-secondary">Browse our collection of healthy recipes.</p>
        </div>

        <SearchBar />

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryClick(undefined)}
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
              onClick={() => handleCategoryClick(cat.slug)}
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

        {error ? (
          <EmptyState icon="error" title="Something went wrong" description="Failed to load recipes. Please try again." action={<Button onClick={handleRetry}>Try Again</Button>} />
        ) : loading ? (
          <div className="bg-background min-h-[calc(100vh-12rem)] flex items-center justify-center">
            <LoadingSpinner size="lg" text="Loading recipes..." />
          </div>
        ) : recipes.length === 0 ? (
          searchQuery ? (
            <EmptyState icon="search" title={`No results for "${searchQuery}"`} description="Try a different search term." />
          ) : activeCategory ? (
            <EmptyState icon="restaurant" title="No recipes in this category" description="Try a different category." />
          ) : (
            <EmptyState icon="restaurant" title="No recipes found" description="Try a different category or check back later." />
          )
        ) : (
          <>
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
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
}
