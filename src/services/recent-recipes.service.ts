const STORAGE_KEY = 'recently_viewed_recipes';
const MAX_ITEMS = 10;

export interface RecentRecipeItem {
  id: number;
  title: string;
  caloriesPerServing: number;
  imageUrl?: string;
}

export function getRecentRecipes(): RecentRecipeItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addRecentRecipe(recipe: RecentRecipeItem): void {
  const list = getRecentRecipes().filter(r => r.id !== recipe.id);
  list.unshift(recipe);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, MAX_ITEMS)));
}
