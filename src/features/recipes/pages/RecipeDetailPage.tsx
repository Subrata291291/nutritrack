import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Badge } from '@components/ui/Badge';
import { Card } from '@components/ui/Card';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import { EmptyState } from '@components/shared/EmptyState';
import { NutritionCard } from '../components/NutritionCard';
import { QuickActions } from '../components/QuickActions';
import { IngredientsList } from '../components/IngredientsList';
import { PreparationSteps } from '../components/PreparationSteps';
import { recipesService } from '@services/recipes.service';
import type { Recipe } from 'types/recipe';

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchRecipe() {
      if (!id) { if (!cancelled) { setError(true); setLoading(false); } return; }
      try {
        if (!cancelled) { setLoading(true); setError(false); }
        const data = await recipesService.getRecipeDetail(Number(id));
        if (!cancelled) setRecipe(data);
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchRecipe();
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="bg-background min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading recipe..." />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="bg-background min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <EmptyState icon="error" title="Recipe not found" description="The recipe you're looking for doesn't exist or has been removed." />
      </div>
    );
  }

  return (
    <div className="bg-background min-h-[calc(100vh-4rem)]">
      <div className="relative h-[400px] overflow-hidden">
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-container/40 to-primary-container/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-center gap-3 mb-3">
            {recipe.tags?.map((tag) => (
              <Badge key={tag} variant={tag === 'High Protein' ? 'success' : 'info'} size="md">{tag}</Badge>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">{recipe.title}</h1>
          <p className="text-white/80 text-sm mb-3 max-w-2xl">{recipe.description}</p>
          <div className="flex items-center gap-6 text-white/90 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">schedule</span>
              {recipe.prepTime} min prep
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">timer</span>
              {recipe.cookTime} min cook
            </span>
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-base">restaurant</span>
              {recipe.servings} Servings
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <NutritionCard nutrition={{ calories: recipe.caloriesPerServing, protein: recipe.proteinGrams, carbs: recipe.carbsGrams, fats: recipe.fatsGrams, fiber: recipe.fiberGrams }} />
            {recipe.tips && (
              <Card padding="lg" className="border-l-4 border-l-primary">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary">lightbulb</span>
                  <div>
                    <h4 className="text-sm font-semibold text-on-surface mb-1">Smart Insight</h4>
                    <p className="text-sm text-on-surface-variant">{recipe.tips}</p>
                  </div>
                </div>
              </Card>
            )}
            <PreparationSteps steps={recipe.instructions} />
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <QuickActions recipe={recipe} />
            <IngredientsList ingredients={recipe.ingredients} />
          </div>
        </div>
      </div>
    </div>
  );
}
