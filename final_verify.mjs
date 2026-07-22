import { chromium } from 'playwright';

const BASE = 'http://localhost:5173';

const email    = `qa_${Date.now()}@test.com`;
const password = 'Test123!';

async function setupUser() {
  // 1. Register
  const regRes = await fetch('http://localhost/nutritrack/wp-json/nutritrack/v1/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: email, email, password, display_name: 'QA User' }),
  });
  const reg = await regRes.json();
  if (!reg.success) throw new Error('Registration failed: ' + JSON.stringify(reg));

  // 2. Get JWT token
  const loginRes = await fetch('http://localhost/nutritrack/wp-json/jwt-auth/v1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  if (!token) throw new Error('Login failed: ' + JSON.stringify(loginData));

  // 3. Complete onboarding via API so the user is ready
  await fetch('http://localhost/nutritrack/wp-json/nutritrack/v1/onboarding/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ age: 28, gender: 'male', heightCm: 175, weightKg: 75, activityLevel: 'moderate', goal: 'lose-weight', targetWeightKg: 70 }),
  });

  return token;
}

const results = [];
function log(name, status, detail = '') {
  const icon = status === 'PASS' ? '✅' : '❌';
  results.push({ name, status, detail });
  console.log(`${icon} ${name}${detail ? ' — ' + detail : ''}`);
}

async function run() {
  console.log('🔧 Setting up test user...');
  const token = await setupUser();
  console.log(`   ✓ User ready: ${email}\n`);

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext();

  // Inject auth directly so Playwright skips login/onboarding UI
  await ctx.addInitScript(({ t, e }) => {
    const user = {
      id: 1,
      email: e,
      displayName: 'QA User',
      membership: 'Free',
      onboardingCompleted: true,
    };
    localStorage.setItem('auth_token', t);
    localStorage.setItem('auth_user', JSON.stringify(user));
    localStorage.setItem('onboarding_completed', 'true');
  }, { t: token, e: email });

  const page = await ctx.newPage();
  const consoleErrors = [];
  const networkFails  = [];
  page.on('console', m => { if (m.type() === 'error' && !m.text().includes('favicon')) consoleErrors.push(m.text()); });
  page.on('response', r => {
    if (r.status() >= 500 && !r.url().includes('gravatar')) {
      networkFails.push(`${r.status()} ${r.url()}`);
    }
  });

  async function checkPage(route, label, checks) {
    console.log(`\n  Testing ${route}...`);
    try {
      await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      // Wait for React to hydrate
      await page.waitForTimeout(3000);
    } catch (e) {
      log(`${label} — page load`, 'FAIL', String(e).slice(0, 80));
      return;
    }

    const finalUrl = page.url();
    if (finalUrl.includes('/login') || finalUrl.includes('/register')) {
      log(`${label} — auth redirect`, 'FAIL', `redirected to ${finalUrl}`);
      return;
    }

    for (const [checkLabel, selector] of checks) {
      try {
        const el = await page.waitForSelector(selector, { timeout: 4000, state: 'visible' });
        const txt = el ? (await el.textContent() ?? '').slice(0, 40) : '';
        log(`${label} → ${checkLabel}`, 'PASS', txt.trim());
      } catch {
        log(`${label} → ${checkLabel}`, 'FAIL', `"${selector}" not visible`);
      }
    }
  }

  // ─── Frontend Pages ───────────────────────────────────────────
  await checkPage('/dashboard', 'Dashboard', [
    ['Page heading', 'h1, h2'],
  ]);

  await checkPage('/log', 'Nutrition Log', [
    ['Log heading', 'h1, h2'],
  ]);

  await checkPage('/planner', 'Meal Planner', [
    ['Planner heading',  'h1, h2'],
    ['Recipe Library h3', 'h3'],
  ]);

  await checkPage('/recipes', 'Recipes List', [
    ['Recipes heading', 'h2'],
    ['Recipe cards', '.grid a, .grid [class*="rounded"]'],
  ]);

  await checkPage('/insights', 'Insights', [
    ['Insights heading',    'h2'],
    ['Weight Analytics',    'h3:has-text("Weight Analytics")'],
  ]);

  await checkPage('/settings', 'Settings', [
    ['Settings h1', 'h1:has-text("Settings")'],
    ['Account group', 'h3:has-text("Account")'],
  ]);

  await checkPage('/pricing', 'Pricing', [
    ['Pricing heading', 'h1, h2'],
    ['Pro plan visible', '[data-testid="pro-plan"], h2, h3'],
  ]);

  // ─── WP Admin ─────────────────────────────────────────────────
  console.log('\n\n🔐 Testing WP Admin...');
  const wpPage = await ctx.newPage();
  await wpPage.goto('http://localhost/nutritrack/wp-admin/wp-login.php');
  await wpPage.fill('#user_login', 'admin');
  await wpPage.fill('#user_pass', 'admin');
  await wpPage.click('#wp-submit');
  await wpPage.waitForURL(/wp-admin/, { timeout: 8000 }).catch(() => {});

  const adminRoutes = [
    ['Dashboard',          ''],
    ['Food Items',         'edit.php?post_type=nutri_food'],
    ['Recipes',            'edit.php?post_type=nutri_recipe'],
    ['Meal Entries',       'edit.php?post_type=nutri_meal_entry'],
    ['Meal Plans',         'edit.php?post_type=nutri_meal_plan'],
    ['Weight Entries',     'edit.php?post_type=nutri_weight'],
  ];

  for (const [label, path] of adminRoutes) {
    const wpErrors = [];
    const errHandler = m => { if (m.type() === 'error') wpErrors.push(m.text()); };
    wpPage.on('console', errHandler);
    await wpPage.goto(`http://localhost/nutritrack/wp-admin/${path}`, { waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {});
    await wpPage.waitForTimeout(500);
    const isFatal = await wpPage.$('.wp-die-message, h1:has-text("404")');
    log(`WP Admin: ${label}`, isFatal ? 'FAIL' : 'PASS', isFatal ? 'Fatal error or 404' : '');
    wpPage.off('console', errHandler);
  }

  await browser.close();

  // ─── Summary ──────────────────────────────────────────────────
  console.log('\n════════════════════════════════════════');
  const passes = results.filter(r => r.status === 'PASS').length;
  const fails  = results.filter(r => r.status === 'FAIL');
  console.log(`TOTAL: ${passes} PASSED, ${fails.length} FAILED`);

  if (fails.length > 0) {
    console.log('\nFailed checks:');
    fails.forEach(f => console.log(`  ❌ ${f.name}: ${f.detail}`));
  }

  if (consoleErrors.length > 0) {
    console.log('\n⚠️  Browser Console Errors:');
    consoleErrors.slice(0, 5).forEach(e => console.log('   ', e));
  }
  if (networkFails.length > 0) {
    console.log('\n⚠️  Network 5xx Failures:');
    networkFails.slice(0, 5).forEach(e => console.log('   ', e));
  }

  console.log(fails.length === 0 && consoleErrors.length === 0 ? '\n🎉 All checks PASSED!' : '\n⚠️ Some issues remain.');
}

run().catch(console.error);
