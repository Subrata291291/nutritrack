import { Link } from 'react-router-dom';
import { cn } from '@utils/cn';
import { FavoriteButton } from './FavoriteButton';
import type { Recipe } from 'types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorited: boolean;
  onFavoriteToggle?: (favorited: boolean) => void;
  showFavoriteButton?: boolean;
  className?: string;
}

export function RecipeCard({ recipe, isFavorited, onFavoriteToggle, showFavoriteButton = true, className }: RecipeCardProps) {
  return (
    <Link
      to={`/recipes/${recipe.id}`}
      className={cn(
        'group block bg-surface-container-lowest rounded-2xl border border-outline-variant overflow-hidden shadow-sm hover:shadow-md transition-shadow',
        className
      )}
    >
      <div className="relative aspect-[4/3] bg-surface-container-highest overflow-hidden">
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
        {showFavoriteButton && (
          <div className="absolute top-2 right-2">
            <FavoriteButton
              recipeId={recipe.id}
              isFavorited={isFavorited}
              onToggle={onFavoriteToggle}
            />
          </div>
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
  );
}