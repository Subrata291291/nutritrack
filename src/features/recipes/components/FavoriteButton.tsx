import { useState } from 'react';
import { cn } from '@utils/cn';
import { recipesService } from '@services/recipes.service';

interface FavoriteButtonProps {
  recipeId: number;
  isFavorited: boolean;
  onToggle?: (favorited: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function FavoriteButton({ recipeId, isFavorited, onToggle, disabled, className }: FavoriteButtonProps) {
  const [loading, setLoading] = useState(false);
  const [optimisticFavorited, setOptimisticFavorited] = useState<boolean | null>(null);

  const displayFavorited = optimisticFavorited !== null ? optimisticFavorited : isFavorited;

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (loading || disabled) return;

    const newState = !displayFavorited;
    setOptimisticFavorited(newState);
    setLoading(true);

    try {
      if (newState) {
        await recipesService.favoriteRecipe(recipeId);
      } else {
        await recipesService.unfavoriteRecipe(recipeId);
      }
      setOptimisticFavorited(null);
      setLoading(false);
      onToggle?.(newState);
    } catch {
      setOptimisticFavorited(null);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={displayFavorited ? 'Remove from favorites' : 'Add to favorites'}
      className={cn(
        'flex items-center justify-center w-9 h-9 rounded-full transition-colors',
        displayFavorited
          ? 'text-error hover:bg-error/10'
          : 'text-on-surface-variant hover:bg-surface-container hover:text-error',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-current" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        <span
          className="material-symbols-outlined text-[20px]"
          style={displayFavorited ? { fontVariationSettings: "'FILL' 1" } : undefined}
        >
          favorite
        </span>
      )}
    </button>
  );
}