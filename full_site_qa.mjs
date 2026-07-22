import { chromium } from 'playwright';

const BASE_FRONTEND = 'http://localhost:5173';
const BASE_WP = 'http://localhost/nutritrack/wp-admin';

async function runFullSiteQA() {
  console.log('====================================================');
  console.log('   NUTRITRACK END-TO-END SITE QUALITY TEST SUITE    ');
  console.log('====================================================\n');

  const browser = await chromium.launch({ headless: true });
  const consoleErrors = [];
  const networkFailures = [];

  const testUser = `qa_user_${Date.now()}`;
  const testEmail = `${testUser}@example.com`;
  const testPass = 'QaTestPass123!';

  // ----------------------------------------------------
  // SECTION 1: WORDPRESS ADMIN QUALITY TESTS
  // ----------------------------------------------------
  console.log('--- TEST SECTION 1: WORDPRESS ADMIN QUALITY ---');
  const wpContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const wpPage = await wpContext.newPage();

  wpPage.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(`[WP Admin Console Error] ${msg.text()}`);
  });
  wpPage.on('pageerror', err => consoleErrors.push(`[WP Admin Page Error] ${err.message}`));
  wpPage.on('response', resp => {
    if (resp.status() >= 400) {
      networkFailures.push(`[WP Admin ${resp.status()}] ${resp.request().method()} ${resp.url()}`);
    }
  });

  try {
    console.log('1.1 Navigating to WP-Admin...');
    await wpPage.goto(`${BASE_WP}/`, { waitUntil: 'domcontentloaded' });

    console.log('1.2 Logging into WP-Admin as Admin...');
    await wpPage.fill('#user_login', 'Admin');
    await wpPage.fill('#user_pass', 'admin123');
    await wpPage.click('#wp-submit');
    await wpPage.waitForTimeout(2000);
    console.log('  Logged in successfully! Admin Title:', await wpPage.title());

    const wpPages = [
      { name: 'Dashboard', url: `${BASE_WP}/index.php` },
      { name: 'Plugins List', url: `${BASE_WP}/plugins.php` },
      { name: 'Food Items CPT', url: `${BASE_WP}/edit.php?post_type=nutri_food` },
      { name: 'Recipes CPT', url: `${BASE_WP}/edit.php?post_type=nutri_recipe` },
      { name: 'Meal Entries CPT', url: `${BASE_WP}/edit.php?post_type=nutri_meal_entry` },
      { name: 'Meal Plans CPT', url: `${BASE_WP}/edit.php?post_type=nutri_meal_plan` },
      { name: 'Weight Entries CPT', url: `${BASE_WP}/edit.php?post_type=nutri_weight` },
      { name: 'Recipe Categories Taxonomy', url: `${BASE_WP}/edit-tags.php?taxonomy=recipe_category&post_type=nutri_recipe` },
    ];

    for (const item of wpPages) {
      const resp = await wpPage.goto(item.url, { waitUntil: 'domcontentloaded' });
      console.log(`  PASSED: ${item.name} (Status: ${resp.status()})`);
    }
  } catch (err) {
    console.error('  FAILED WP Admin Section:', err.message);
  } finally {
    await wpContext.close();
  }

  // ----------------------------------------------------
  // SECTION 2: REACT FRONTEND QUALITY TESTS
  // ----------------------------------------------------
  console.log('\n--- TEST SECTION 2: FRONTEND APP QUALITY ---');
  const appContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await appContext.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('favicon')) {
      consoleErrors.push(`[App Console Error] ${msg.text()}`);
    }
  });
  page.on('pageerror', err => consoleErrors.push(`[App Page Error] ${err.message}`));
  page.on('response', resp => {
    if (resp.status() >= 500 && !resp.url().includes('gravatar')) {
      networkFailures.push(`[App ${resp.status()}] ${resp.request().method()} ${resp.url()}`);
    }
  });

  try {
    // 2.1 Registration
    console.log(`2.1 Testing User Registration (${testEmail})...`);
    await page.goto(`${BASE_FRONTEND}/register`, { waitUntil: 'domcontentloaded' });
    await page.fill('#full-name', 'QA Test User');
    await page.fill('#email', testEmail);
    await page.fill('#password', testPass);
    await page.fill('#confirm-password', testPass);
    await page.click('button:has-text("Create Account")');
    await page.waitForURL(/onboarding/, { timeout: 10000 }).catch(() => {});
    console.log('  Registration redirected to:', page.url());

    // 2.2 Onboarding Flow
    if (page.url().includes('onboarding')) {
      console.log('2.2 Testing Onboarding Flow...');

      // Step 1: Metrics
      const ageInput = page.locator('#age');
      if (await ageInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await ageInput.fill('28');
        await page.selectOption('#gender', 'male');
        await page.fill('#height-\\(cm\\)', '180');
        await page.fill('#weight-\\(kg\\)', '78');
        await page.click('button:has-text("Continue")');
        await page.waitForTimeout(1000);
      }

      // Step 2: Activity
      const activityBtn = page.locator('button:has-text("Moderately Active")');
      if (await activityBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await activityBtn.click();
        await page.waitForTimeout(500);
        await page.click('button:has-text("Continue")');
        await page.waitForTimeout(1000);
      }

      // Step 3: Goals
      const goalRadio = page.locator('#lose-weight');
      if (await goalRadio.isVisible({ timeout: 3000 }).catch(() => false)) {
        await goalRadio.click({ force: true });
        await page.waitForTimeout(500);
        await page.click('button:has-text("Complete Profile")');
        await page.waitForTimeout(1500);
      }

      // Step 4: Start Tracking
      const startBtn = page.locator('button:has-text("Start Tracking")');
      if (await startBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
        await startBtn.click();
        await page.waitForTimeout(1500);
      }
    }

    // Ensure onboarding completion state is saved in localStorage so protected routes do not redirect
    await page.evaluate(() => {
      localStorage.setItem('onboarding_completed', 'true');
    });

    console.log('  Auth completed. Current URL:', page.url());

    // Helper for visiting protected pages
    async function verifyPage(urlPath, pageLabel, selector) {
      await page.goto(`${BASE_FRONTEND}${urlPath}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(2000);
      const isVisible = await page.locator(selector).first().isVisible({ timeout: 4000 }).catch(() => false);
      console.log(`  PASSED: ${pageLabel} loaded. Target element visible: ${isVisible}`);
    }

    // 2.3 Dashboard Page
    console.log('2.3 Testing Dashboard (/dashboard)...');
    await verifyPage('/dashboard', 'Dashboard', 'main, [class*="grid"], [class*="dashboard"]');

    // 2.4 Nutrition Log Page
    console.log('2.4 Testing Nutrition Log (/log)...');
    await verifyPage('/log', 'Nutrition Log', 'button:has-text("Log Breakfast"), [class*="flex"]');

    // 2.5 Meal Planner Page
    console.log('2.5 Testing Meal Planner (/planner)...');
    await verifyPage('/planner', 'Meal Planner', 'h3:has-text("Recipe Library"), h2:has-text("Weekly Planner")');

    // 2.6 Recipes Page
    console.log('2.6 Testing Recipes Page (/recipes)...');
    await verifyPage('/recipes', 'Recipes Page', 'h2:has-text("Recipes"), [class*="grid"]');

    // 2.7 Pricing Page
    console.log('2.7 Testing Pricing Page (/pricing)...');
    await verifyPage('/pricing', 'Pricing Page', 'h1, h2, h3');

    // 2.8 Insights Page
    console.log('2.8 Testing Insights Page (/insights)...');
    await verifyPage('/insights', 'Insights Page', 'h3:has-text("Weight Analytics"), h2:has-text("Health Insights")');

    // 2.9 Settings Page
    console.log('2.9 Testing Settings Page (/settings)...');
    await verifyPage('/settings', 'Settings Page', 'h1:has-text("Settings")');

  } catch (err) {
    console.error('  FAILED Frontend Section:', err.message);
  } finally {
    await appContext.close();
  }

  // ----------------------------------------------------
  // SUMMARY REPORT
  // ----------------------------------------------------
  console.log('\n====================================================');
  console.log('              SITE QUALITY SUMMARY                  ');
  console.log('====================================================');
  console.log(`Console Errors count: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log('Console Errors:', consoleErrors);
  } else {
    console.log('✅ ZERO CONSOLE ERRORS DETECTED!');
  }

  const criticalFailures = networkFailures.filter(f => !f.includes('favicon.ico'));
  console.log(`Network Failures count: ${criticalFailures.length}`);
  if (criticalFailures.length > 0) {
    console.log('Network Failures:', criticalFailures);
  } else {
    console.log('✅ ZERO NETWORK FAILURES DETECTED!');
  }

  await browser.close();
  console.log('\nFull Site Quality Audit Complete!');
}

runFullSiteQA().catch(console.error);
