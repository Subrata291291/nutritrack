import { test, expect } from '@playwright/test';

test.describe('Meal Planner E2E', () => {
  test('planner page loads', async ({ page }) => {
    await page.goto('/planner');
    await expect(page.getByRole('heading', { name: /meal plan/i })).toBeVisible();
  });

  test('day selector is visible', async ({ page }) => {
    await page.goto('/planner');
    await expect(page.getByText(/mon/i).or(page.getByText(/tue/i))).toBeVisible();
  });

  test('add meal button is present', async ({ page }) => {
    await page.goto('/planner');
    await expect(page.getByRole('button', { name: /add meal/i })).toBeVisible();
  });

  test('auto generate button is present', async ({ page }) => {
    await page.goto('/planner');
    await expect(page.getByRole('button', { name: /auto-generate/i })).toBeVisible();
  });

  test('shopping list button is present', async ({ page }) => {
    await page.goto('/planner');
    await expect(page.getByRole('button', { name: /shopping/i }).or(page.getByRole('button', { name: /grocery/i }))).toBeVisible();
  });
});
