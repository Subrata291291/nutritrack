import { test, expect } from '@playwright/test';

test.describe('Recipes E2E', () => {
  test('recipes page loads and shows list', async ({ page }) => {
    await page.goto('/recipes');
    await expect(page.getByRole('heading', { name: /recipes/i })).toBeVisible();
  });

  test('search bar is present', async ({ page }) => {
    await page.goto('/recipes');
    await expect(page.getByPlaceholder(/search/i).or(page.getByRole('textbox'))).toBeVisible();
  });

  test('category filter buttons are present', async ({ page }) => {
    await page.goto('/recipes');
    await expect(page.getByRole('button', { name: /all/i })).toBeVisible();
  });

  test('pagination renders when multiple pages', async ({ page }) => {
    await page.goto('/recipes');
    await expect(page.getByText(/page/i).or(page.getByText(/next/i))).toBeVisible();
  });
});
