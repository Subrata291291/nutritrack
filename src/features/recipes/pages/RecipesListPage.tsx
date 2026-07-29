import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { cn } from '@utils/cn';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import { EmptyState } from '@components/shared/EmptyState';
import { Button } from '@components/ui/Button';
import { SearchBar, Pagination, RecipeCard } from '../components';
import { useRecipes } from '../hooks/useRecipes';
import { recipesService } from '@services/recipes.service';
import { useRecipeGeneration } from '@hooks/useRecipeGeneration';


export function RecipesListPage() {
  const { isGenerating, job, error: genError, triggerGeneration, regenerate, clearError } = useRecipeGeneration();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10) || 1);
  const [activeCategory, setActiveCategory] = useState<string | undefined>(undefined);
  const [favoriteIds, setFavoriteIds] = useState<Set<number>>(new Set());
  const pageSize = 20;

  const { recipes, total, loading, error, retry } = useRecipes({
    search: searchQuery,
    category: activeCategory,
    page: currentPage,
    perPage: pageSize,
  });

  const [categories, setCategories] = useState<{ id: number; name: string; slug: string; count: number }[]>([]);

  useEffect(() => {
    recipesService.getCategories().then(setCategories).catch(() => {});
    recipesService.getFavoriteRecipes().then((data) => {
      setFavoriteIds(new Set(data.map((r) => r.id)));
    }).catch(() => {});
  }, []);

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

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      <div className="p-margin-mobile md:p-margin-desktop space-y-xl max-w-7xl mx-auto w-full">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Recipes</h2>
          <p className="font-body-md text-body-md text-secondary">Browse our collection of healthy recipes.</p>
        </div>

        <SearchBar />

        {isGenerating && (
          <div className="bg-primary-container border border-primary rounded-xl px-4 py-3 flex items-center gap-3">
            <LoadingSpinner size="sm" />
            <div className="flex-1">
              <p className="font-body-sm text-body-sm text-on-primary-container">
                Generating your personalized recipes{job ? ` (${job.progress}%)` : '...'}
              </p>
              <p className="font-body-xs text-body-xs text-on-primary-container/70">
                This usually takes a few seconds. You can check back shortly.
              </p>
            </div>
          </div>
        )}

        {genError && (
          <div className="bg-error-container border border-error rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="material-icons text-error text-lg">error</span>
            <div className="flex-1">
              <p className="font-body-sm text-body-sm text-on-error-container">{genError}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => { clearError(); regenerate(); }}>
              Retry
            </Button>
          </div>
        )}

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
          <EmptyState icon="error" title="Something went wrong" description="Failed to load recipes. Please try again." action={<Button onClick={retry}>Try Again</Button>} />
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
            <EmptyState
              icon="restaurant"
              title="No recipes found"
              description="Your personalized recipe library hasn't been generated yet."
              action={<Button onClick={triggerGeneration} disabled={isGenerating}>Generate Recipes</Button>}
            />
          )
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorited={favoriteIds.has(recipe.id)}
                  onFavoriteToggle={(favorited) => {
                    setFavoriteIds((prev) => {
                      const next = new Set(prev);
                      if (favorited) next.add(recipe.id);
                      else next.delete(recipe.id);
                      return next;
                    });
                  }}
                />
              ))}
            </div>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </>
        )}
      </div>
    </div>
  );
}
