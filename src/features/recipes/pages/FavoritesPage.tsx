import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import { EmptyState } from '@components/shared/EmptyState';
import { Button } from '@components/ui/Button';
import { RecipeCard } from '../components/RecipeCard';
import { useFavoriteRecipes } from '../hooks/useFavoriteRecipes';

export function FavoritesPage() {
  const { recipes, loading, error, retry } = useFavoriteRecipes();
  const [removedIds, setRemovedIds] = useState<Set<number>>(new Set());
  const visibleRecipes = recipes.filter((r) => !removedIds.has(r.id));

  const handleUnfavorite = useCallback((recipeId: number) => {
    setRemovedIds((prev) => new Set(prev).add(recipeId));
  }, []);

  if (loading) {
    return (
      <div className="bg-background min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading favorites..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <EmptyState icon="error" title="Something went wrong" description="Failed to load favorites. Please try again." action={<Button onClick={retry}>Try Again</Button>} />
      </div>
    );
  }

  if (visibleRecipes.length === 0) {
    return (
      <div className="bg-background min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <EmptyState
          icon="favorite"
          title="No favorite recipes yet"
          description="Tap the heart on any recipe to save it here."
          action={<Link to="/recipes"><Button>Browse Recipes</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      <div className="p-margin-mobile md:p-margin-desktop space-y-xl max-w-7xl mx-auto w-full">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">My Favorites</h2>
          <p className="font-body-md text-body-md text-secondary">Recipes you've saved for quick access.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorited
              onFavoriteToggle={(favorited) => {
                if (!favorited) handleUnfavorite(recipe.id);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}