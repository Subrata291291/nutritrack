import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('1. Logging in via UI...');
  await page.goto('http://localhost:5173/login');
  await page.fill('#email', 'subrata291291@gmail.com');
  await page.fill('#password', 'admin123');
  await page.click('button[type="submit"]');

  await page.waitForTimeout(2500);
  console.log('2. Logged in URL:', page.url());

  const routes = ['/dashboard', '/log', '/planner', '/recipes', '/insights', '/settings'];
  for (const r of routes) {
    await page.goto(`http://localhost:5173${r}`);
    await page.waitForTimeout(1500);
    const heading = await page.locator('h1, h2, h3').first().textContent().catch(() => 'None');
    console.log(`   Page ${r} -> URL: ${page.url()} | Heading: "${heading.trim()}"`);
  }

  await browser.close();
  console.log('DONE!');
})();
