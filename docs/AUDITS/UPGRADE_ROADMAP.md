# Upgrade Roadmap — NutriTrack Frontend

Divided into 8 milestones based on priority analysis (docs/AUDITS/PRIORITY_ANALYSIS.md). Each milestone builds on the previous one.

---

## Milestone 1 — Onboarding Completion + Nutrition Log Bug Fixes

**Goal:** Make personalization functional by completing the onboarding pipeline (TDEE calculation trigger, remaining fields) and fixing two concrete bugs in Nutrition Log that affect every user daily.

### Features
- Trigger TDEE/nutrition target calculation after onboarding save
- Add missing onboarding fields: Cooking Skill, Daily Budget
- Fix `handleDeleteMeal` to refetch daily log after deletion
- Add serving size selector to `FoodPickerModal`
- Add delete confirmation component (replacing `window.confirm`)

### Files Likely to Change
| File | Change |
|------|--------|
| `src/features/onboarding/context/OnboardingProvider.tsx` | Add Cooking Skill, Daily Budget to state |
| `src/features/onboarding/pages/OnboardingPage.tsx` | Add steps/fields |
| `src/features/onboarding/services/onboarding.service.ts` | Add fields to API payload |
| `src/features/nutrition-log/pages/NutritionLogPage.tsx` | Fix handleDeleteMeal refetch |
| `src/features/nutrition-log/components/FoodPickerModal.tsx` | Add serving size selector |
| `src/components/shared/Modal.tsx` | Minor enhancement if needed |
| `src/utils/tdee.ts` | Ensure exported and callable from onboarding flow |

### Dependencies
- NutriTrack API plugin must accept `cooking_skill` and `daily_budget` fields
- Nutrition API must support date-specific refetch after deletion

### Estimated Effort
- 2-3 days developer time

### Risks
- Onboarding TDEE trigger requires backend plugin changes if formula not in WordPress
- Adding serving size selector changes FoodPickerModal UX — must preserve existing UI patterns

### Acceptance Criteria
- [ ] After completing onboarding, user receives calculated nutrition targets (calories, protein, carbs, fat)
- [ ] Cooking Skill and Daily Budget fields appear in Preferences step
- [ ] Deleting a meal from Nutrition Log immediately updates the daily summary
- [ ] FoodPickerModal allows selecting serving size before adding
- [ ] Delete action shows a styled confirmation dialog instead of `window.confirm`
- [ ] All existing tests pass (once test suite exists)
- [ ] No UI regressions in Nutrition Log or Onboarding

---

## Milestone 2 — Dashboard Dynamic Data

**Goal:** Remove all hardcoded values from Dashboard and make it fully dynamic using onboarding data. Add missing sections (Meal Plan, Quick Actions, Recent Activity) and proper loading/error states.

### Features
- Replace hardcoded `calGoal=2200`, `proteinGoal=160`, etc. with values from onboarding/user profile
- Add Meal Plan section showing today's planned meals
- Add Quick Actions row (Log Food, Add Weight, Drink Water, Browse Recipes, Meal Planner)
- Add Recent Activity feed
- Add skeleton loaders per widget
- Add error state UI with retry option

### Files Likely to Change
- `src/features/dashboard/pages/DashboardPage.tsx`
- `src/features/dashboard/components/DailyOverview.tsx`
- `src/features/dashboard/components/MacroBreakdown.tsx`
- `src/components/shared/LoadingSpinner.tsx` (add skeleton variants)
- New: `DashboardMealPlan.tsx`, `QuickActions.tsx`, `RecentActivity.tsx`

### Dependencies
- Milestone 1 (onboarding must provide targets)
- Dashboard API endpoints (`GET /dashboard`, `GET /dashboard/summary`)

### Estimated Effort
- 3-4 days

### Risks
- Backend may not have dedicated Dashboard API endpoints yet
- Meal Plan section depends on Meal Planner module state

---

## Milestone 3 — Authentication Gap Fixes

**Goal:** Complete the auth flow by building ResetPasswordPage and fixing ForgotPassword to use the NutriTrack API.

### Features
- Build ResetPasswordPage with New Password / Confirm Password form
- Fix ForgotPasswordPage to use NutriTrack API instead of direct `wp-login.php`
- Add `POST /auth/logout` API call to auth service
- Add ResetPassword route to router

### Files Likely to Change
- `src/features/auth/pages/ForgotPasswordPage.tsx`
- `src/features/auth/services/auth.service.ts`
- `src/features/auth/components/ResetPasswordForm.tsx` (new)
- `src/features/auth/pages/ResetPasswordPage.tsx` (new)
- `src/routes/index.tsx`

### Dependencies
- NutriTrack API plugin must expose reset password endpoint

### Estimated Effort
- 1-2 days

### Risks
- WordPress password reset flow is complex; API endpoint may not exist yet

---

## Milestone 4 — Food Library + Recipes Enhancement

**Goal:** Add pagination, filters, favorites, and debounced search to Food Library and Recipes. Improve performance and usability.

### Features
- Server-side pagination for food and recipe lists
- Nutrition filters (calories, protein, carbs, fat ranges)
- Diet filters (Vegan, Vegetarian, Keto, Gluten Free)
- Favorite/unfavorite toggle for foods and recipes
- Debounced server-side search
- Serving size selector on food detail

### Files Likely to Change
- `src/features/food/pages/FoodListPage.tsx`
- `src/features/food/pages/FoodDetailPage.tsx`
- `src/features/food/components/` (new filter components)
- `src/features/recipes/pages/RecipesListPage.tsx`
- `src/features/recipes/pages/RecipeDetailPage.tsx`
- `src/features/recipes/components/` (new filter components)
- `src/services/food.service.ts`
- `src/services/recipes.service.ts`

### Dependencies
- Backend must support pagination params, search query params, favorite endpoints

### Estimated Effort
- 4-5 days

### Risks
- Backend may not support all filter/sort parameters
- Favorite endpoints may need WordPress plugin changes

---

## Milestone 5 — Meal Planner Enhancements

**Goal:** Add grocery list generation, copy/duplicate functionality, replace meal, and 6 meal type support.

### Features
- Grocery list generation from weekly meal plan
- Copy previous day / duplicate week
- Replace meal action on meal cards
- 6 meal types: Breakfast, Morning Snack, Lunch, Afternoon Snack, Dinner, Evening Snack
- Clear day / clear week actions

### Files Likely to Change
- `src/features/meal-planner/pages/MealPlannerPage.tsx`
- `src/features/meal-planner/components/WeekView.tsx`
- `src/features/meal-planner/components/DayView.tsx`
- `src/features/meal-planner/components/MealSlot.tsx`
- `src/features/meal-planner/components/AddMealModal.tsx`
- New: `GroceryList.tsx`, `ReplaceMealModal.tsx`
- `src/services/meal-plans.service.ts`
- `src/types/meal-plan.ts`

### Dependencies
- Milestone 4 (recipes must support serving size)
- Backend grocery list endpoint

### Estimated Effort
- 3-4 days

### Risks
- Grocery list generation logic is complex; may need backend support

---

## Milestone 6 — Insights + Weight Tracker

**Goal:** Build out the Insights page with real analytics data and improve weight tracking with a dedicated entry form.

### Features
- InsightsPage with macros trends chart, weight trend, calorie history, milestone tracking
- Weight entry form (date, weight, notes)
- Weekly/monthly summary views
- Connect to existing `insights.service` endpoints

### Files Likely to Change
- `src/features/insights/pages/InsightsPage.tsx`
- `src/features/insights/components/` (new chart components)
- `src/features/profile-metrics/pages/ProfileMetricsPage.tsx`
- `src/services/insights.service.ts`

### Dependencies
- Milestones 1-2 (data must be flowing for insights to show meaningful content)
- Backend insights endpoints must return real data

### Estimated Effort
- 3-4 days

### Risks
- Insights spec is empty — requirements may change
- Backend insights endpoints may return placeholder data

---

## Milestone 7 — Settings + Profile Polish

**Goal:** Add password change form and polish remaining Settings sections.

### Features
- Change password form in Security section of Settings
- Connected services / integrations section (placeholder for future)
- Profile Metrics page enhancements

### Files Likely to Change
- `src/features/settings/pages/SettingsPage.tsx`
- `src/features/settings/components/` (new PasswordSection)
- `src/features/profile-metrics/pages/ProfileMetricsPage.tsx`
- `src/services/user.service.ts`

### Dependencies
- Milestone 3 (auth reset password endpoint)

### Estimated Effort
- 1-2 days

### Risks
- Low risk

---

## Milestone 8 — Cross-Cutting Improvements

**Goal:** Address architectural debt and quality concerns across the entire application.

### Features
- Code splitting with `React.lazy()` for route-level chunks
- Accessibility audit: aria labels, focus trapping, skip-to-content link
- JWT storage security evaluation (httpOnly cookies vs localStorage)
- Image lazy loading for recipe/food images
- Environment variable validation with startup check
- Replace CDN Material Symbols with tree-shaken lucide-react icons
- Unit test foundation (Vitest + React Testing Library)

### Files Likely to Change
- `src/routes/index.tsx` (code splitting)
- `src/components/shared/Modal.tsx` (focus trapping)
- `src/components/layout/MainLayout.tsx` (skip-to-content)
- `src/config/index.ts` (env validation)
- `src/index.html` (remove CDN icon link)
- Various components (aria labels, lucide-react migration)
- New: `src/test/` directory setup

### Dependencies
- All feature milestones complete (no feature changes, only quality improvements)

### Estimated Effort
- 5-7 days

### Risks
- Lucide-react icon migration may cause visual differences
- Code splitting may introduce loading flash without proper Suspense boundaries
- Test setup requires tooling decisions (Vitest vs Jest, coverage thresholds)