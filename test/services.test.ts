import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';
import { recipesService } from '@services/recipes.service';
import { mealPlansService } from '@services/meal-plans.service';
import { userService } from '@services/user.service';

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe('recipes.service', () => {
  it('getRecipes returns recipes and total', async () => {
    const result = await recipesService.getRecipes({ page: 1, per_page: 20 });
    expect(result.recipes).toHaveLength(3);
    expect(result.total).toBe(3);
  });

  it('getRecipes with search filters results', async () => {
    const result = await recipesService.getRecipes({ search: 'Vegan', per_page: 20 });
    expect(result.recipes.length).toBeGreaterThanOrEqual(1);
    expect(result.recipes.every((r) => r.title.toLowerCase().includes('vegan'))).toBe(true);
  });

  it('getRecipeDetail returns a recipe', async () => {
    const recipe = await recipesService.getRecipeDetail(1);
    expect(recipe.id).toBe(1);
    expect(recipe.title).toBe('Grilled Chicken Salad');
  });

  it('getRecipeDetail throws on 404', async () => {
    server.use(
      http.get('https://test-site.com/wp-json/nutritrack/v1/recipes/:id', () => {
        return new HttpResponse(null, { status: 404 });
      }),
    );
    await expect(recipesService.getRecipeDetail(999)).rejects.toThrow();
  });

  it('getCategories returns categories', async () => {
    const cats = await recipesService.getCategories();
    expect(cats).toHaveLength(3);
    expect(cats[0]).toHaveProperty('slug');
  });

  it('favoriteRecipe returns favorited true', async () => {
    const result = await recipesService.favoriteRecipe(1);
    expect(result.favorited).toBe(true);
  });

  it('unfavoriteRecipe returns favorited false', async () => {
    const result = await recipesService.unfavoriteRecipe(1);
    expect(result.favorited).toBe(false);
  });

  it('getFavoriteRecipes returns array', async () => {
    const result = await recipesService.getFavoriteRecipes();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe('mealPlans.service', () => {
  it('getMealPlan returns plan with days', async () => {
    const plan = await mealPlansService.getMealPlan('2026-07-27');
    expect(plan).not.toBeNull();
    expect(plan!.days).toHaveLength(2);
    expect(plan!.weekStart).toBe('2026-07-27');
  });

  it('saveMealPlan returns id', async () => {
    const result = await mealPlansService.saveMealPlan('2026-07-27', []);
    expect(result).toHaveProperty('id');
  });

  it('getShoppingList returns list', async () => {
    const list = await mealPlansService.getShoppingList(1);
    expect(list).toHaveProperty('items');
  });
});

describe('user.service', () => {
  it('getProfile returns profile', async () => {
    const profile = await userService.getProfile();
    expect(profile.displayName).toBe('Test User');
    expect(profile.age).toBe(30);
  });

  it('updateProfile returns updated profile', async () => {
    const updated = await userService.updateProfile({ displayName: 'Updated Name' });
    expect(updated.displayName).toBe('Updated Name');
  });

  it('getSettings returns settings', async () => {
    const settings = await userService.getSettings();
    expect(settings.theme).toBe('light');
    expect(settings.units).toBe('metric');
  });

  it('updateSettings returns updated settings', async () => {
    const updated = await userService.updateSettings({ theme: 'dark' });
    expect(updated.theme).toBe('dark');
  });

  it('uploadAvatar returns url', async () => {
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const url = await userService.uploadAvatar(file);
    expect(url).toBeTruthy();
    expect(url).toContain('.jpg');
  });
});
