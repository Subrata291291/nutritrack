import { test, expect } from '@playwright/test';

test.describe('Dashboard E2E', () => {
  test('dashboard page loads', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('nutrition summary is visible', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText(/calories/i).or(page.getByText(/protein/i))).toBeVisible();
  });
});
