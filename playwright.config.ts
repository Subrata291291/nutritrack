import { defineConfig, devices } from '@playwright/test';

const PORT = 4173;
const BASE_URL = process.env.CI ? 'http://localhost:4173' : `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './test/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    storageState: undefined,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: process.env.CI
    ? {
        command: 'npm run build && npm run preview',
        port: 4173,
        reuseExistingServer: false,
        timeout: 120000,
      }
    : undefined,
});
