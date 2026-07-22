import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.addInitScript(() => {
    localStorage.setItem('auth_token', 'dummy');
    localStorage.setItem('auth_user', JSON.stringify({ id: 1, email: 'test@test.com', displayName: 'Test', membership: 'pro', onboardingCompleted: true }));
    localStorage.setItem('onboarding_completed', 'true');
  });

  await page.goto('http://localhost:5173/log');
  
  await page.waitForTimeout(5000);
  
  await browser.close();
})();
