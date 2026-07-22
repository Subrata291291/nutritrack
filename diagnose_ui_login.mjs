import { chromium } from 'playwright';

(async () => {
  console.log('--- VERIFYING UI LOGIN & ALL PAGES ---');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // 1. Login via UI form
  await page.goto('http://localhost:5173/login', { waitUntil: 'domcontentloaded' });
  await page.fill('input[type="email"]', 'subrata291291@gmail.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');

  await page.waitForTimeout(3000);
  console.log('LoggedIn URL:', page.url());

  const routes = ['/dashboard', '/log', '/planner', '/recipes', '/insights', '/settings'];
  for (const route of routes) {
    await page.goto(`http://localhost:5173${route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    const title = await page.locator('h1, h2, h3').first().textContent().catch(() => 'No heading');
    console.log(`✅ Page ${route} -> Heading: "${title.trim()}" | URL: ${page.url()}`);
  }

  await browser.close();
})();
