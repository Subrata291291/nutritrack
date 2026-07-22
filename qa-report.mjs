import { chromium } from 'playwright';
import { writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const reportDir = resolve(__dirname, 'qa-report');
const screenshotsDir = resolve(reportDir, 'screenshots');
if (!existsSync(screenshotsDir)) mkdirSync(screenshotsDir, { recursive: true });

const BASE = 'http://localhost:5173';
const issues = [];
const TEST_USER = `qa_${Date.now()}`;
const TEST_EMAIL = `${TEST_USER}@qa.test`;
const TEST_PASS = 'TestPass123!';

function log(msg, type = 'INFO') {
  console.log(`[${type}] ${msg}`);
}

function reportIssue(severity, page, description) {
  issues.push({ severity, page, description });
  log(`${severity.toUpperCase()}: ${page} — ${description}`, 'ISSUE');
}

async function shot(page, name) {
  const path = resolve(screenshotsDir, `${name}.png`);
  await page.screenshot({ path, fullPage: true });
  log(`Screenshot: ${name}`);
  return path;
}

async function clickAndWait(page, locator, desc, opts = {}) {
  const el = page.locator(locator);
  if (await el.isVisible({ timeout: 3000 }).catch(() => false)) {
    await el.click();
    await page.waitForTimeout(opts.wait || 1000);
    log(`Clicked ${desc}`);
    return true;
  }
  reportIssue('medium', desc, `Element not found: ${locator}`);
  return false;
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => consoleErrors.push(`PAGE ERROR: ${err.message}`));

  try {
    // ═══════════ 1. REGISTER ═══════════
    log('=== 1. REGISTER ===');
    await page.goto(`${BASE}/register`, { waitUntil: 'networkidle' });
    await shot(page, '01-register');
    await page.fill('#full-name', TEST_USER);
    await page.fill('#email', TEST_EMAIL);
    await page.fill('#password', TEST_PASS);
    await page.fill('#confirm-password', TEST_PASS);
    await shot(page, '01b-register-filled');
    await clickAndWait(page, 'button:has-text("Create Account")', 'Create Account');
    await page.waitForURL(/onboarding/, { timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1000);
    log(`URL: ${page.url()}`);

    // ═══════════ 2. ONBOARDING ═══════════
    log('\n=== 2. ONBOARDING ===');
    // Step 1: Metrics
    if (page.url().includes('onboarding')) {
      await shot(page, '02a-onboarding-step1');

      // Fill StepMetrics form fields
      const ageInput = page.locator('#age');
      const genderSelect = page.locator('#gender');
      const heightInput = page.locator('#height-\\(cm\\)');
      const weightInput = page.locator('#weight-\\(kg\\)');

      if (await ageInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await ageInput.fill('30');
        await genderSelect.selectOption('male');
        await heightInput.fill('175');
        await weightInput.fill('75');
        log('Filled Step 1 form');
        await shot(page, '02b-step1-filled');
        // Click Continue (submit button inside form)
        await clickAndWait(page, 'button:has-text("Continue")', 'Step 1 Continue');
        await page.waitForTimeout(1500);
        await shot(page, '02c-after-step1');
      } else {
        reportIssue('medium', 'Onboarding Step 1', 'Age input not found');
      }

      // Step 2: Activity level (select a card)
      if (page.url().includes('onboarding')) {
        const activityBtn = page.locator('button:has-text("Moderately Active")');
        if (await activityBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await activityBtn.click();
          await page.waitForTimeout(500);
          log('Selected "Moderately Active"');
          await shot(page, '02d-step2-selected');
          await clickAndWait(page, 'button:has-text("Continue")', 'Step 2 Continue');
          await page.waitForTimeout(1500);
          await shot(page, '02e-after-step2');
        } else {
          reportIssue('medium', 'Onboarding Step 2', 'Activity level buttons not found — trying Skip');
          await clickAndWait(page, 'button:has-text("Skip")', 'Step 2 Skip').catch(() => {});
          await page.waitForTimeout(1500);
        }
      }

      // Step 3: Goals
      if (page.url().includes('onboarding')) {
        // Click on the radio input directly (label is overlapped by the hidden radio)
        const loseWeight = page.locator('#lose-weight');
        if (await loseWeight.isVisible({ timeout: 2000 }).catch(() => false)) {
          await loseWeight.click({ force: true });
          await page.waitForTimeout(500);
          log('Selected "Lose Weight" goal');
          await shot(page, '02f-step3-selected');
          await clickAndWait(page, 'button:has-text("Complete Profile")', 'Step 3 Complete Profile');
          await page.waitForTimeout(2000);
          await shot(page, '02g-after-step3');
        } else {
          reportIssue('medium', 'Onboarding Step 3', 'Goal radio labels not found');
        }
      }

      // Step 4: Results
      if (page.url().includes('onboarding')) {
        const startBtn = page.locator('button:has-text("Start Tracking")');
        if (await startBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
          await startBtn.click();
          await page.waitForTimeout(2000);
          await shot(page, '02h-start-tracking');
          log(`URL after Start Tracking: ${page.url()}`);
        } else {
          reportIssue('medium', 'Onboarding Step 4', 'Start Tracking button not found (may be at dashboard already)');
        }
      }
    }

    const isAuthed = !page.url().includes('login') && !page.url().includes('register');
    log(`\nAuthenticated: ${isAuthed}, URL: ${page.url()}`);

    if (!isAuthed) {
      reportIssue('high', 'Auth', 'Could not complete onboarding');
    }

    // ═══════════ 3. DASHBOARD ═══════════
    log('\n=== 3. DASHBOARD ===');
    await page.goto(`${BASE}/dashboard`, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await shot(page, '03-dashboard');
    const dashVisible = await page.locator('main, [class*="grid"], [class*="dashboard"]').first().isVisible({ timeout: 3000 }).catch(() => false);
    if (!dashVisible) reportIssue('medium', 'Dashboard', 'Dashboard content not visible');
    else log('Dashboard content visible');

    // Check navbar
    const navPlanLabel = page.locator('text=/Member/i');
    if (await navPlanLabel.first().isVisible({ timeout: 2000 }).catch(() => false)) log('Navbar shows user plan');
    else reportIssue('low', 'Dashboard', 'User plan not visible in navbar');

    const notifBell = page.locator('[aria-label*="notification" i], [class*="notifications"], button:has-text("notifications")');
    if (await notifBell.first().isVisible({ timeout: 2000 }).catch(() => false)) {
      await notifBell.click();
      await page.waitForTimeout(1000);
      await shot(page, '03b-notifications');
      const markRead = page.locator('button:has-text("Mark all as read")');
      if (await markRead.isVisible({ timeout: 2000 }).catch(() => false)) {
        await markRead.click();
        await page.waitForTimeout(1000);
        log('Mark all as read clicked');
      }
      // Click elsewhere to close dropdown
      await page.locator('body').click({ position: { x: 10, y: 10 } });
    } else reportIssue('low', 'Dashboard', 'Notification bell not visible');

    // ═══════════ 4. NUTRITION LOG ═══════════
    log('\n=== 4. NUTRITION LOG ===');
    await page.goto(`${BASE}/log`, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await shot(page, '04-log');

    const logBtns = ['Log Breakfast', 'Log Lunch', 'Log Dinner', 'Log Snack', 'Add Food'];
    let foundLogBtn = false;
    for (const btnText of logBtns) {
      const btn = page.locator(`button:has-text("${btnText}")`).first();
      if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
        foundLogBtn = true;
        log(`Found button: ${btnText}`);
        if (btnText === 'Log Breakfast') {
          await btn.click();
          await page.waitForTimeout(1500);
          await shot(page, '04b-food-picker');

          const searchInput = page.locator('input[id*="search"]').first();
          if (await searchInput.isVisible({ timeout: 2000 }).catch(() => false)) {
            await searchInput.fill('egg');
            // Wait for debounce + API response
            await page.waitForTimeout(1000);
            // Try waiting for a result button to appear
            const eggResult = page.locator('button:has-text("Egg (large)")');
            try {
              await eggResult.waitFor({ state: 'visible', timeout: 5000 });
              log('Found Egg (large)');
              await eggResult.click();
              await page.waitForTimeout(2000);
              await shot(page, '04d-after-add-meal');
            } catch {
              await shot(page, '04c-search-egg');
              // Try clicking any visible food result
              const anyFood = page.locator('[class*="results"] button, [class*="food-list"] button, [class*="food"] button:not([class*="absolute"])').first();
              if (await anyFood.isVisible({ timeout: 2000 }).catch(() => false)) {
                await anyFood.click();
                log('Clicked first food result');
                await page.waitForTimeout(2000);
              } else reportIssue('medium', 'Nutrition Log', 'No food results visible for "egg"');
            }
          } else reportIssue('medium', 'Nutrition Log', 'Search input not visible in food picker');
        }
        break;
      }
    }
    if (!foundLogBtn) reportIssue('medium', 'Nutrition Log', 'No Log Breakfast/Lunch/Dinner/Snack/Add Food buttons visible');

    // ═══════════ 5. PLANNER + RECIPES ═══════════
    log('\n=== 5. PLANNER ===');
    await page.goto(`${BASE}/planner`, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await shot(page, '05-planner');

    const recipeSection = page.locator('h3:has-text("Recipe Library")');
    if (await recipeSection.isVisible({ timeout: 3000 }).catch(() => false)) {
      log('Recipe Library section visible');
      const expectedRecipes = ['Grilled Chicken Salad', 'Vegan Buddha Bowl', 'Protein Oatmeal', 'Salmon with Asparagus', 'Veggie Stir-Fry'];
      let foundRecipes = 0;
      for (const r of expectedRecipes) {
        if (await page.locator(`text=${r}`).isVisible({ timeout: 1000 }).catch(() => false)) {
          foundRecipes++;
          log(`  Recipe found: ${r}`);
        }
      }
      log(`Recipes found: ${foundRecipes}/${expectedRecipes.length}`);
      if (foundRecipes < 3) reportIssue('low', 'Planner/Recipes', `Only ${foundRecipes}/5 recipes visible`);
    } else {
      reportIssue('medium', 'Planner', 'Recipe Library section heading not visible');
    }

    // Check if logged meals appear in planner day columns
    const loggedMeal = page.locator('text=Egg (large)');
    if (await loggedMeal.isVisible({ timeout: 2000 }).catch(() => false)) log('Logged meal "Egg (large)" visible in planner');
    else reportIssue('low', 'Planner', 'Logged meal not visible in planner day columns');

    // Test Add Meal navigation
    const addMealBtn = page.locator('button:has-text("Add Meal")').first();
    if (await addMealBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await addMealBtn.click();
      await page.waitForTimeout(2000);
      await shot(page, '05b-add-meal-nav');
      if (page.url().includes('log')) log('Add Meal navigated to /log');
      else reportIssue('low', 'Planner', 'Add Meal click did not navigate to /log');
    } else reportIssue('low', 'Planner', 'Add Meal button not visible');

    // ═══════════ 6. RECIPES PAGE ═══════════
    log('\n=== 6. RECIPES ===');
    await page.goto(`${BASE}/recipes`, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await shot(page, '06-recipes');
    const recHeading = page.locator('h1, h2').filter({ hasText: /Recipe/i });
    if (await recHeading.first().isVisible({ timeout: 2000 }).catch(() => false)) log('Recipes page loaded');
    else reportIssue('low', 'Recipes', 'Recipe page heading not visible');

    // ═══════════ 7. PRICING ═══════════
    log('\n=== 7. PRICING ===');
    await page.goto(`${BASE}/pricing`, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await shot(page, '07-pricing');

    // Check billing toggle
    const monthlyBtn = page.locator('button:has-text("Monthly")');
    const annualBtn = page.locator('button:has-text("Annual")');
    if (await monthlyBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      log('Monthly/Annual toggle visible');
      const isAnnualSel = await annualBtn.getAttribute('class').then(c => c?.includes('active') || c?.includes('selected')).catch(() => false);
      if (!isAnnualSel) {
        await annualBtn.click();
        await page.waitForTimeout(500);
        await shot(page, '07b-annual');
      }
    } else {
      // Could be a switch or card-based toggle
      const toggle = page.locator('[role="switch"], [class*="toggle"], [class*="switch"]').first();
      if (await toggle.isVisible({ timeout: 2000 }).catch(() => false)) {
        log('Alternate toggle visible');
        await toggle.click();
        await shot(page, '07b-toggle-clicked');
      } else reportIssue('low', 'Pricing', 'Billing toggle not visible');
    }

    // Check plan cards
    for (const plan of ['Free', 'Pro', 'Premium']) {
      const card = page.locator(`h3:has-text("${plan}")`);
      if (await card.isVisible({ timeout: 2000 }).catch(() => false)) log(`  ${plan} plan card visible`);
      else reportIssue('medium', 'Pricing', `${plan} plan card not visible`);
    }

    // ═══════════ 8. INSIGHTS ═══════════
    log('\n=== 8. INSIGHTS ===');
    await page.goto(`${BASE}/insights`, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await shot(page, '08-insights');
    const insightChart = page.locator('[class*="chart"], [class*="insight"], canvas, .recharts-wrapper').first();
    if (await insightChart.isVisible({ timeout: 3000 }).catch(() => false)) log('Insights page has chart');
    else reportIssue('low', 'Insights', 'No chart visible on insights page');

    // ═══════════ 9. SETTINGS ═══════════
    log('\n=== 9. SETTINGS ===');
    await page.goto(`${BASE}/settings`, { waitUntil: 'domcontentloaded', timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(3000);
    await shot(page, '09-settings');
    const setHeading = page.locator('h1:has-text("Settings"), h2:has-text("Settings")');
    if (await setHeading.first().isVisible({ timeout: 2000 }).catch(() => false)) log('Settings page loaded');
    else reportIssue('low', 'Settings', 'Settings heading not visible');

  } catch (err) {
    log(`Unhandled error: ${err.message}`, 'ERROR');
    reportIssue('high', 'General', `Script error: ${err.message}`);
    await shot(page, 'error-unhandled');
  } finally {
    const summary = {
      testUser: TEST_USER,
      testEmail: TEST_EMAIL,
      timestamp: new Date().toISOString(),
      totalIssues: issues.length,
      issues,
      consoleErrors: consoleErrors.slice(0, 30),
      screenshots: existsSync(screenshotsDir) ? readdirSync(screenshotsDir) : [],
    };
    const reportPath = resolve(reportDir, 'report.json');
    writeFileSync(reportPath, JSON.stringify(summary, null, 2));
    log(`\n=== QA COMPLETE ===`);
    log(`Issues: ${issues.length} | Console errors: ${consoleErrors.length}`);
    issues.forEach(i => log(`  [${i.severity}] ${i.page}: ${i.description}`));
    if (consoleErrors.length) {
      log(`Console errors (first 5):`);
      consoleErrors.slice(0, 5).forEach(e => log(`  ${e.slice(0, 200)}`));
    }
    await browser.close();
  }
}

run().catch(err => { console.error('Fatal:', err); process.exit(1); });
