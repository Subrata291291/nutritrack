# Gap Analysis — NutriTrack Frontend vs Documentation

---

## Authentication

### Current Implementation
- LoginPage with email/password form, zod validation, social buttons (Google/Apple UI only, no backend)
- RegisterPage with displayName/email/password/confirmPassword, zod validation + terms checkbox
- ForgotPasswordPage that calls `wp-login.php?action=lostpassword` directly via fetch
- JWT stored in localStorage, attached via Axios interceptor
- ProtectedRoute component checks `isAuthenticated` from context
- AuthProvider manages login/register/logout/updateUser with useState + useCallback

### Missing Functionality
- **ResetPasswordPage** — No page or component exists (spec defines New Password + Confirm Password fields)
- **Logout API call** — `authService.logout()` only clears localStorage; spec defines `POST /auth/logout`
- **Profile management** — No Update Password / Change Email forms in auth module (partial in Settings)
- **Email verification flow** — Spec defines post-registration email verification (marked Future)
- **First Name / Last Name fields** — Register uses single `displayName` instead of separate first/last name
- **Session validation** — No periodic token validation check; only reactive on 401

### Missing Validation
- Password strength validation (register validates min length only, spec says "Password Strength")
- Register page validates "Password must be at least 8 characters" vs spec "Minimum Password Length" (acceptable)
- No duplicate email check before form submission (spec defines "Duplicate Email Check")

### Missing Error Handling
- Login page catches all errors with generic message ("Invalid email or password") — ok
- Register page catches all errors with generic message
- ForgotPasswordPage shows error state but doesn't handle network timeout specifically
- No handling for token expiry during active session (401 handler redirects to login — acceptable)

### Missing Loading States
- Login button shows `loading` state via `isLoading` from AuthProvider — present
- Register button shows `loading` state — present
- Forgot password shows `loading` via local state — present
- Session validation loading — not implemented

### Missing API Support
- No `POST /auth/logout` endpoint call
- No `POST /auth/reset-password` endpoint call
- ForgotPassword bypasses NutriTrack API and calls WordPress core directly

---

## Dashboard

### Current Implementation
- DashboardPage fetches daily log, weight analytics, smart insights, and user profile in parallel via useEffect
- DailyOverview component with calorie ring, macro bars, macro donut, water ring, steps ring, meals count
- MacroBreakdown component with percentage bars
- WeightTrendChart with SVG line chart (no recharts), area fill, target line, grid lines
- NextMealWidget with last meal display and "Log Meal Now" button
- QuickStats with weight card and insight cards

### Missing Functionality
- **Meal Plan display** — Spec requires "Today's planned meals" section; no meal plan data is fetched or shown
- **Welcome Card** — Spec defines separate "Welcome Card" with user name + current goal + daily motivation; currently inline text
- **Water Tracker quick-add buttons** — Spec defines +250ml, +500ml, +1L buttons on dashboard (water is in DailyOverview mini card only)
- **Recent Activity feed** — Spec defines activity list with latest meal logs, water updates, weight entries
- **Quick Actions row** — Spec defines buttons for Log Food, Add Weight, Drink Water, Browse Recipes, Meal Planner, Food Library, Settings
- **Meal Plan card** — Spec defines View Plan / Edit Plan buttons for today's meals
- **Nutrition Summary** — Spec defines full summary with Calories, Protein, Carbs, Fat, Fiber, Water, Micronutrients

### Missing Validation
- No validation needed on dashboard (read-only view)

### Missing Error Handling
- Dashboard `catch` block logs to console only (`console.error`) — no error state UI rendered
- No retry option on failure (spec says "Display retry option")
- No handling for partial responses (spec says "Handle Partial responses")

### Missing Loading States
- Full-page LoadingSpinner used instead of per-component skeleton loaders (spec says "Show skeleton loaders for Cards, Charts, Meal List, Activity Feed")

### Missing API Support
- No `GET /dashboard` endpoint call (spec defines dedicated dashboard endpoint)
- No `GET /dashboard/summary` endpoint call
- No `GET /dashboard/activity` endpoint call
- No `GET /dashboard/refresh` endpoint call

---

## Food Library

### Current Implementation
- FoodListPage with search input and category filter, fetches all foods via `foodService.getFoods()`
- Client-side search filtering by name and category
- FoodDetailPage fetches single food by ID, displays nutrition info and add-to-log functionality
- Loading spinner, empty state for no results, error state

### Missing Functionality
- **Nutrition filters** — Spec defines filtering by Calories, Protein, Carbs, Fat, Fiber, Sugar, Sodium
- **Diet filters** — Spec defines Vegan, Vegetarian, Keto, Gluten Free filters
- **Favorites** — No favorite/unfavorite functionality; spec defines POST/DELETE `/foods/{id}/favorite`
- **Serving size selector** — No serving size selection on food detail page
- **Compare foods** — No comparison feature
- **Recently used section** — No recently used foods display
- **Pagination** — All foods fetched at once, no pagination
- **Food image display** — No image handling in FoodListPage or FoodDetailPage
- **Brand display** — No brand field in UI
- **Ingredients/Allergens/Tags** — Not displayed
- **Micronutrients** — No micronutrient display (Vitamin A, C, D, Calcium, Iron, Potassium)

### Missing Validation
- No search debounce (spec says "Debounced search" under Performance)
- No partial matching for search (spec says "Partial Matching")

### Missing Error Handling
- Error state falls back to empty array (`setFoods([])`) — no error message displayed to user
- No retry option on API failure
- No handling for invalid food ID on detail page

### Missing Loading States
- LoadingSpinner present for initial load — acceptable
- No skeleton loaders for food cards (spec says "skeleton loaders")
- No loading state for search results

### Missing API Support
- No `/foods/search` endpoint call with keyword/category/diet/calories/protein params
- No `/foods/{id}/favorite` POST/DELETE endpoints
- No pagination params in `/foods` request
- No sorting/filtering params

---

## Recipes

### Current Implementation
- RecipesListPage with fetch + client-side search by name and category
- RecipeDetailPage with image, name, category, prep/cook time, servings, ingredients, instructions, nutrition
- RecipeCard component with image, name, category, calories, time
- CategoryFilter component
- Loading, empty, and error states
- RecentRecipes service tracks recently viewed recipes

### Missing Functionality
- **Favorites** — No favorite/unfavorite for recipes (spec defines POST/DELETE `/recipes/{id}/favorite`)
- **Difficulty filter** — No difficulty display or filter
- **Cuisine display** — No cuisine field in UI
- **Rating** — No rating component or display
- **Serving selector** — No serving size adjustment on detail page
- **Related recipes** — No related/similar recipes section
- **Pagination** — All recipes fetched at once
- **Dietary goal filters** — No filtering by goal (weight loss, muscle gain)
- **Nutrition value search** — No search by calorie/protein ranges
- **Share/Print** — No share or print actions
- **Cooking steps with timers** — Instructions rendered as list, no timer support

### Missing Validation
- No debounced search
- No server-side search with query parameters

### Missing Error Handling
- Error state shows empty array with no user-facing message
- No retry on failure for recipe list or detail

### Missing Loading States
- LoadingSpinner present — acceptable
- No skeleton loaders for recipe cards (spec says "skeleton loaders")

### Missing API Support
- No `/recipes/search` endpoint call with keyword/category/goal/diet params
- No `/recipes/{id}/favorite` POST/DELETE endpoints
- No `/recipes/{id}/related` endpoint call
- No pagination/sorting/filter params in `/recipes` request

---

## Meal Planner

### Current Implementation
- MealPlannerPage with week/day navigation, meal slots for Breakfast/Lunch/Dinner/Snack
- WeekView and DayView components
- MealSlot component for each meal type
- AddMealModal for adding recipes/foods
- NutritionSummary component showing totals
- Fetches/stores meal plans via `meal-plans.service`
- Loading and empty states

### Missing Functionality
- **Grocery list generation** — No grocery list feature; spec defines `POST /meal-plans/grocery-list`
- **Copy/Duplicate** — No "Copy Previous Day" or "Duplicate Week" functionality
- **Clear Day/Clear Week** — No bulk clear actions
- **Replace meal** — No replace action on meal cards
- **Morning/Afternoon/Evening snack slots** — Spec defines 6 meal types; implemented 4 (Breakfast/Lunch/Dinner/Snack)
- **Calendar view** — Spec defines Calendar component
- **Week selector** — Current navigation is basic; spec defines dedicated WeekSelector component
- **Adherence tracking** — No planned vs actual tracking (spec marks Future)

### Missing Validation
- Prevent duplicate meal entries for same slot (spec says "Prevent duplicate meal entries for the same slot")

### Missing Error Handling
- Basic error handling present
- No handling for invalid recipe/food item IDs during add
- No network timeout handling

### Missing Loading States
- LoadingSpinner on page load — acceptable
- No per-action loading states (saving, updating)
- No loading for grocery list generation (not implemented)

### Missing API Support
- No `/meal-plans/copy` POST endpoint
- No `/meal-plans/grocery-list` POST endpoint
- No `/meal-plans/search` endpoint

---

## Nutrition Log

### Current Implementation
- NutritionLogPage with DateNavigator, DailyProgressCard, TimelineMealCard, FoodPickerModal, WaterTracker, ExerciseWidget, RecentFoods
- Date navigation (today, yesterday, custom date via DateNavigator)
- DailyProgressCard with calorie ring, macro progress bars, water progress
- TimelineMealCard for each logged meal with edit/delete
- FoodPickerModal for searching and adding foods
- WaterTracker with quick-add buttons (+250ml, +500ml, +1L) and custom amount
- RecentFoods section showing frequently logged items
- ExerciseWidget for logging exercise entries
- CRUD via `nutrition.service`

### Missing Functionality
- **Recipe search** — FoodPickerModal searches foods only; spec defines separate RecipeSearch component
- **Serving size selector** — FoodPickerModal hardcodes `servings={1}` with no serving size control
- **Edit meal modal** — Spec defines EditMealModal; currently no inline edit capability
- **Delete confirmation** — Spec defines DeleteConfirmation component; currently uses `window.confirm`
- **Daily history beyond 7 days** — DateNavigator limited; spec defines Last 7 Days, Last 30 Days, Custom Date
- **Quick Calories entry** — Spec marks as Future; not implemented
- **Custom meal entry** — No custom meal creation without food library item

### Missing Validation
- No serving size validation (no serving selector exists)
- No meal type validation
- No duplicate meal check

### Missing Error Handling
- `handleDeleteMeal` catches error with `console.error` but doesn't show user-facing error
- Add food error shows generic message
- No retry option on add/delete/water failures

### Missing Loading States
- Loading state on page mount — present
- No loading indicator during meal deletion
- No loading indicator during water addition
- No optimistic UI updates

### Missing API Support
- No `/nutrition-log/summary` endpoint call (spec defines GET `/nutrition-log/summary`)
- No `/nutrition-log/water` endpoint call (addWater calls nutrition log endpoint; spec defines separate water endpoint)

---

## Onboarding

### Current Implementation
- OnboardingPage with 8-step wizard: Welcome, PersonalInfo, BodyMeasurements, Lifestyle, Goal, Preferences, Review, Complete
- ProgressBar showing step progress
- Form validation per step
- Saves via `onboarding.service.saveMetrics()` and marks complete via `onboarding.service.complete()`
- OnboardingProvider manages step state, navigation, and data collection

### Missing Functionality
- **Cooking skill field** — Spec defines Cooking Skill (Beginner/Intermediate/Advanced); not in current implementation
- **Daily budget field** — Spec defines Daily Budget (optional); not in current implementation
- **First Name / Last Name** — Spec defines separate fields; current uses displayName
- **Date of Birth field** — Spec defines Date of Birth + Age must be > 13; current implementation may differ
- **Workout days per week** — Spec defines 0-7 validation; check current implementation
- **TDEE calculation post-onboarding** — Spec defines trigger for BMI/BMR/TDEE calculation after save; unclear if implemented on frontend (tdee.ts exists but not called in onboarding flow)

### Missing Validation
- Age > 13 validation (spec requirement)
- Positive values only for height/weight (should exist but verify)
- Target weight validation

### Missing Error Handling
- Error display on save failure — present
- No handling for partial save (multi-step data loss risk)

### Missing Loading States
- Loading on save/complete — present
- Disabled buttons during save — present

### Missing API Support
- No `GET /onboarding` endpoint call for editing existing data
- No `PUT /onboarding` endpoint call for updating

---

## Settings

### Current Implementation
- SettingsPage with tabs: Profile, Goals, Preferences, Notifications, Privacy
- ProfileSection with display name, email, avatar upload
- GoalsSection with calorie, protein, carbs, fat, water targets
- PreferencesSection with diet type, allergies, cuisine, units, theme toggle
- NotificationsSection with toggle switches for meal reminders, weekly reports, etc.
- PrivacySection with data export and account deletion
- Fetches/updates via `user.service`

### Missing Functionality
- **Password change** — No change password form in Settings (spec defines "Update account credentials" in auth spec)
- **Connected services** — Spec defines "Connect external services" and integrations section
- **Device management** — No device/session management
- **Security settings** — Spec defines security settings section

### Missing Validation
- Current implementation likely has form validation via react-hook-form + zod (verify)
- No password change validation (not implemented)

### Missing Error Handling
- Save error handling — present via form error states
- No network timeout handling for save operations

### Missing Loading States
- Loading on initial data fetch — present
- Loading on save — present

### Missing API Support
- No `/settings` endpoint calls (uses `/user/profile` and `/user/settings` which may or may not match spec)

---

## Insights

### Current Implementation
- InsightsPage exists with placeholder/stub UI

### Missing Functionality
- **Spec file is empty (INSIGHTS.md has 0 lines)** — No spec to compare against
- The page appears to be a stub with no real data integration
- No charts, summaries, or analytics displayed

### Missing Validation / Error Handling / Loading States
- All states are missing since the page is a stub

### Missing API Support
- `insights.service.ts` exists with `getWeightAnalytics`, `getMacroAnalytics`, `getSmartInsights`, `getMilestones` — services ready but InsightsPage doesn't use them

---

## Weight Tracker

### Missing Functionality
- **Spec file is empty (WEIGHT_TRACKER.md has 0 lines)** — No spec to compare against
- No dedicated weight tracker page exists
- Weight functionality exists within Dashboard (WeightTrendChart) and `insights.service` but no standalone page
- `ProfileMetricsPage` exists with `/profile` route — may serve as weight tracker

---

## Pricing & Checkout

### Current Implementation
- PricingPage displays subscription plans (fetched via `subscriptions.service`)
- CheckoutPage for Stripe checkout session creation

### Missing Functionality
- No post-checkout success/cancellation handling (verify)
- No subscription management UI (spec defines `/subscriptions/manage` endpoint)

### Missing Validation / Error Handling / Loading States
- Loading and error states present on PricingPage
- CheckoutPage error handling — verify

### Missing API Support
- `/subscriptions/manage` endpoint not called

---

## Prioritized List of Missing Work

| Priority | Gap | Module | Impact | Effort |
|----------|-----|--------|--------|--------|
| P0 | Hardcoded nutrition targets (calGoal, proteinGoal, etc.) | Dashboard, NutritionLog | Users see wrong targets | Small |
| P0 | Onboarding TDEE calculation not triggered post-save | Onboarding | No personalized targets | Small |
| P0 | handleDeleteMeal doesn't refetch after deletion | Nutrition Log | Stale UI after delete | Small |
| P0 | Serving size hardcoded to 1 | Nutrition Log | Cannot log correct amounts | Small |
| P1 | No server-side pagination for food/recipe lists | Food, Recipes | Performance degrades with data | Medium |
| P1 | No skeleton loaders (full-page spinner only) | All | Poor perceived performance | Medium |
| P1 | No Dashboard error state UI | Dashboard | Silent failures | Small |
| P1 | Dashboard missing Meal Plan section | Dashboard | Incomplete overview | Medium |
| P1 | Dashboard missing Quick Actions row | Dashboard | Missing navigation shortcuts | Small |
| P1 | Dashboard missing Recent Activity feed | Dashboard | Missing context | Medium |
| P1 | ForgotPassword bypasses API plugin | Auth | Security concern | Small |
| P1 | No ResetPasswordPage | Auth | Broken user flow | Medium |
| P2 | No favorites for foods or recipes | Food, Recipes | Missing feature | Small |
| P2 | No nutrition/diet filters on food list | Food | Limited browsing | Small |
| P2 | No recipe difficulty filter | Recipes | Limited browsing | Small |
| P2 | No grocery list generation | Meal Planner | Missing feature | Medium |
| P2 | No copy/duplicate week in Meal Planner | Meal Planner | Missing convenience | Small |
| P2 | Meal Planner has 4 meal types vs spec's 6 | Meal Planner | Incomplete | Small |
| P2 | Insights page is a stub | Insights | Empty page | Medium |
| P2 | No email/change password in Settings | Settings | Missing profile mgmt | Small |
| P3 | No component tests | All | Quality risk | Large |
| P3 | No code splitting | All | Bundle size | Medium |
| P3 | localStorage for JWT | Auth | Security risk | Medium |
| P3 | No image lazy loading | Food, Recipes | Performance | Small |
| P3 | CDN-loaded icons | All | External dependency | Small |
| P3 | Modal lacks focus trapping | Shared | Accessibility | Small |
| P3 | Material Symbols lack aria labels | All | Accessibility | Medium |
| P4 | No React Query / SWR | All | State management debt | Large |
| P4 | Inline SVGs for social buttons | Auth | Code quality | Small |
| P4 | No environment validation | Config | Silent production failure | Small |