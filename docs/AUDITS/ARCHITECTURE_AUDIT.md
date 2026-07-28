# Architecture Audit — NutriTrack Frontend

## Current Architecture

NutriTrack is a React SPA that communicates with a WordPress headless CMS backend via REST APIs. The frontend handles UI, routing, forms, and state management, while WordPress manages the database, authentication, and business logic through a custom "NutriTrack API" plugin.

```
Browser
  │
  ├── React SPA (Vite dev server / built assets)
  │     │
  │     ├── React Router 7 (client-side routing)
  │     ├── Auth Context (JWT stored in localStorage)
  │     ├── Axios client (interceptors for token, caching, 401 handling)
  │     ├── Feature modules (pages, components, services)
  │     └── Shared UI library (Button, Input, Card, Badge, etc.)
  │
  └── WordPress REST API (NutriTrack API plugin)
        │
        ├── JWT Authentication for WP REST API
        ├── Custom Post Types (Recipes, Food Items, Meal Entries, Meal Plans, Weight Entries)
        └── Advanced Custom Fields Pro
```

**Data flow:** React → Axios + JWT → WordPress REST API → WordPress Database → JSON response → React

---

## Folder Structure

```
src/
├── api/               # Axios client, cache layer, endpoint definitions
│   ├── cache.ts        In-memory GET cache with TTL (60s default)
│   ├── client.ts       Axios instance, request/response interceptors
│   └── endpoints.ts    Centralized URL map for all API routes
├── components/
│   ├── layout/         MainLayout, Navbar, Sidebar, MobileDrawer, ProtectedRoute
│   ├── shared/         EmptyState, ErrorBoundary, LoadingSpinner, Modal
│   └── ui/             Badge, Button, Card, Input, ProgressBar, ProgressRing, Select, Toggle
├── config/
│   ├── index.ts        Runtime config (API base URL, routes, pagination)
│   └── navigation.ts   Sidebar navigation items
├── contexts/
│   ├── AuthContext.ts       Interface definition
│   ├── AuthProvider.tsx     Auth state + login/register/logout/updateUser
│   ├── OnboardingContext.ts Interface definition
│   ├── OnboardingProvider.tsx Onboarding wizard state
│   ├── ThemeContext.tsx     Dark/light theme toggle
│   └── index.ts            Re-exports
├── features/           # 12 feature modules
│   ├── auth/           LoginPage, RegisterPage, ForgotPasswordPage
│   ├── checkout/       CheckoutPage (Stripe)
│   ├── dashboard/      DashboardPage + DailyOverview, MacroBreakdown, WeightTrendChart, NextMealWidget, QuickStats
│   ├── food/           FoodListPage, FoodDetailPage
│   ├── insights/       InsightsPage
│   ├── meal-planner/   MealPlannerPage + WeekView, DayView, MealSlot, AddMealModal, NutritionSummary
│   ├── nutrition-log/  NutritionLogPage + DateNavigator, DailyProgressCard, TimelineMealCard, FoodPickerModal, WaterTracker, ExerciseWidget, RecentFoods
│   ├── onboarding/     OnboardingPage + 8 step components, ProgressBar
│   ├── pricing/        PricingPage
│   ├── profile-metrics/ ProfileMetricsPage
│   ├── recipes/        RecipesListPage, RecipeDetailPage + RecipeCard, CategoryFilter
│   └── settings/       SettingsPage + ProfileSection, GoalsSection, PreferencesSection, NotificationsSection, PrivacySection
├── hooks/
│   ├── useAuth.ts          Consumes AuthContext
│   ├── useOnboarding.ts    Consumes OnboardingContext
│   └── useMediaQuery.ts    Responsive breakpoint detection
├── layouts/
│   ├── AuthShell.tsx       Centered card layout for auth pages
│   └── index.ts            Re-exports
├── routes/
│   └── index.tsx           All route definitions with ProtectedRoute wrappers
├── services/           # 11 service modules — API call wrappers
│   ├── auth.service.ts
│   ├── food.service.ts
│   ├── insights.service.ts
│   ├── meal-plans.service.ts
│   ├── notifications.service.ts
│   ├── nutrition.service.ts
│   ├── onboarding.service.ts
│   ├── recent-recipes.service.ts
│   ├── recipes.service.ts
│   ├── subscriptions.service.ts
│   └── user.service.ts
├── types/              # TypeScript type definitions
│   ├── index.ts            Re-exports
│   ├── nutrition.ts        FoodItem, MealEntry, DailyLog, NutritionTargets, MealType
│   ├── meal-plan.ts        MealPlan, PlannedMeal, WeekPlan
│   ├── onboarding.ts       OnboardingData, OnboardingState
│   ├── recipe.ts           Recipe, RecipeDetail, RecipeCategory
│   ├── insights.ts         WeightEntry, WeightAnalytics, Insight
│   ├── settings.ts         UserProfile, UserSettings, NotificationPreferences
│   └── pricing.ts          SubscriptionPlan
├── utils/
│   ├── cn.ts               clsx + tailwind-merge utility
│   ├── format.ts           Date/number formatting helpers
│   └── tdee.ts             BMR, TDEE, macro calculation formulas
├── App.tsx              Root component (BrowserRouter + AuthProvider + ThemeProvider)
├── main.tsx             Vite entry point
└── index.css            Tailwind imports + Material Symbols + custom scrollbar
```

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 19.1.0 |
| Build | Vite | 6.3.4 |
| Language | TypeScript | 5.8.3 |
| Styling | Tailwind CSS | 3.4.17 + tailwindcss-animate 1.0.7 + tailwindcss-forms 0.5.11 |
| Routing | React Router DOM | 7.5.0 |
| HTTP | Axios | 1.9.0 |
| Forms | react-hook-form | 7.55.0 |
| Validation | zod | 3.24.4 + @hookform/resolvers 5.0.1 |
| Charts | recharts | 2.15.3 |
| Icons | lucide-react | 0.510.0 |
| CSS Utils | clsx | 2.1.1 |
| CSS Merge | tailwind-merge | 3.3.0 |
| Dates | date-fns | 4.1.0 |
| Linting | ESLint | 10.7.0 |
| Formatting | Prettier | 3.9.6 |

Material Symbols (Google Font icon set) is loaded via CDN in `index.html` — not as an npm dependency.

---

## Routing

Defined in `src/routes/index.tsx` using React Router v7 `<Routes>` and `<Route>`:

| Route | Component | Auth | Layout |
|-------|-----------|------|--------|
| `/` | Redirect to `/dashboard` or `/login` | — | — |
| `/login` | LoginPage | Public | AuthShell |
| `/register` | RegisterPage | Public | AuthShell |
| `/forgot-password` | ForgotPasswordPage | Public | AuthShell |
| `/onboarding` | OnboardingPage | Protected + requireOnboarding | MainLayout |
| `/dashboard` | DashboardPage | Protected | MainLayout |
| `/log` | NutritionLogPage | Protected | MainLayout |
| `/planner` | MealPlannerPage | Protected | MainLayout |
| `/recipes` | RecipesListPage | Protected | MainLayout |
| `/recipes/:id` | RecipeDetailPage | Protected | MainLayout |
| `/food` | FoodListPage | Protected | MainLayout |
| `/food/:id` | FoodDetailPage | Protected | MainLayout |
| `/insights` | InsightsPage | Protected | MainLayout |
| `/settings` | SettingsPage | Protected | MainLayout |
| `/profile` | ProfileMetricsPage | Protected | MainLayout |
| `/pricing` | PricingPage | Public | None |
| `/checkout` | CheckoutPage | Protected | None |
| `*` | Redirect to `/` | — | — |

`ProtectedRoute` checks `isAuthenticated` from `useAuth()` and optionally `onboarding_completed` in localStorage. `MainLayout` provides the sidebar + navbar shell.

---

## API Layer

- **Client:** `src/api/client.ts` — Axios instance with base URL from `config.api.baseUrl`
- **Request interceptor:** Attaches `Bearer` token from `localStorage('auth_token')`, checks in-memory cache for GET requests
- **Response interceptor:** Caches GET responses, clears cache on mutation, redirects to `/login` on 401
- **Cache:** `src/api/cache.ts` — Simple `Map<string, { data, timestamp }>` with 60s TTL, supports key generation from URL + params
- **Endpoints:** `src/api/endpoints.ts` — All endpoints centralized with dynamic segments (e.g., `logDetail: (id) => ...`)
- **Services:** 11 service modules in `src/services/`, each wrapping `apiClient` calls with typed responses
- **Contract misalignment:** The API contract uses `/nutritrack/v1/` namespace, but `endpoints.ts` reads `config.api.namespace` which defaults to `/nutritrack/v1`. Auth uses `jwt-auth/v1/token` from the WordPress plugin directly.

---

## Authentication Flow

1. User submits credentials via `LoginPage` → `useAuth().login(credentials)` → `AuthProvider`
2. `AuthProvider` calls `authService.login()` which POSTs to `${WP}/jwt-auth/v1/token`
3. On success, `authService` stores `token` and `user` in `localStorage`, returns `AuthState`
4. `AuthProvider` sets state → context consumers re-render
5. All subsequent API calls include `Authorization: Bearer <token>` via the Axios interceptor
6. On 401 response, the interceptor clears localStorage and redirects to `/login`
7. On app load, `AuthProvider.getInitialState()` reads stored auth from localStorage

**Token storage:** Plain `localStorage` (not httpOnly cookies). No refresh token mechanism exists.

---

## State Management

No external state library (Redux, Zustand, etc.). State is managed via:

| Mechanism | Where Used |
|-----------|-----------|
| React Context | AuthProvider (user, token, auth state), OnboardingProvider (wizard steps), ThemeContext (dark/light) |
| `useState` | Feature-level component state (loading, data, errors) |
| `useEffect` | Data fetching on mount/update |
| `localStorage` | auth_token, auth_user, onboarding_completed, theme preference |
| In-memory Map | API response cache (`api/cache.ts`) |

No global cache invalidation strategy. No React Query / SWR / TanStack Query for server state management.

---

## Reusable Components

### UI Components (`src/components/ui/`)
- **Button** — Variants (primary, secondary, outline, ghost), sizes, loading state, fullWidth
- **Input** — Label, error message, rightElement slot, all HTML input types
- **Select** — Label, options, error state
- **Card** — Container with consistent styling
- **Badge** — Small label/tag component
- **Toggle** — Switch/toggle input
- **ProgressBar** — Horizontal progress bar
- **ProgressRing** — Circular progress indicator (SVG-based)

### Shared Components (`src/components/shared/`)
- **LoadingSpinner** — Configurable size + text
- **EmptyState** — Icon + title + description
- **ErrorBoundary** — React error boundary with fallback UI
- **Modal** — Overlay modal with backdrop, close handler

### Layout Components (`src/components/layout/`)
- **MainLayout** — Sidebar + Navbar + content area + MobileDrawer
- **Navbar** — Top navigation bar with mobile menu trigger
- **Sidebar** — Left sidebar with navigation items (responsive: hidden on mobile)
- **MobileDrawer** — Slide-out drawer for mobile navigation
- **ProtectedRoute** — Auth guard + optional onboarding check

---

## Services

11 service modules in `src/services/`:

| Service | Key Methods | Consumed By |
|---------|-------------|-------------|
| `auth.service` | login, register, logout, getStoredAuth | AuthProvider |
| `onboarding.service` | saveMetrics, complete, getOnboarding | OnboardingPage |
| `nutrition.service` | getDailyLog, logMeal, deleteMeal, addWater, searchFoods, getRecentFoods | NutritionLog, Dashboard |
| `food.service` | getFoods, getFood | FoodList, FoodDetail |
| `recipes.service` | getRecipes, getRecipe, searchRecipes | RecipesList, RecipeDetail |
| `meal-plans.service` | getWeekPlan, savePlan, deletePlan | MealPlanner |
| `insights.service` | getWeightAnalytics, getMacroAnalytics, getSmartInsights, getMilestones | Dashboard, Insights |
| `user.service` | getProfile, updateProfile, getSettings, updateSettings | Settings, Dashboard |
| `subscriptions.service` | getPlans, createCheckoutSession, manageSubscription | Pricing, Checkout |
| `notifications.service` | getNotifications, markAsRead | (available for use) |
| `recent-recipes.service` | getRecentRecipes, saveRecent | RecipeDetail |

---

## Utilities

| Utility | Purpose |
|---------|---------|
| `cn.ts` | Merges Tailwind classes using `clsx` + `tailwind-merge` |
| `format.ts` | `toLocalDateString()`, `formatCalories()`, `formatMacro()`, etc. |
| `tdee.ts` | Mifflin-St Jeor BMR formula, activity multipliers, macro split calculation |

---

## Strengths

1. **Clean feature-based folder organization** — Each feature is self-contained with its own pages, components, and index barrel export
2. **Strong TypeScript coverage** — Types are well-defined per domain in `src/types/` with proper interfaces and unions
3. **Centralized API configuration** — All endpoints in one file, all Axios config in one place, all services follow a consistent pattern
4. **Form validation with zod** — Consistent schema-based validation using react-hook-form + zodResolver
5. **Reusable UI library** — Button, Input, Select, Card, Modal, etc. are consistent across the app
6. **Proper auth guards** — ProtectedRoute pattern with optional onboarding check prevents unauthorized access
7. **Error boundary** — Global ErrorBoundary catches rendering crashes
8. **Cache layer** — In-memory GET caching reduces redundant API calls
9. **TDEE utility** — Deterministic nutrition calculations exist in `tdee.ts`
10. **Accessible Tailwind design tokens** — Uses surface/primary/secondary/tertiary semantic color tokens

---

## Weaknesses

1. **Hardcoded nutrition targets** — `DailyOverview.tsx` hardcodes `calGoal=2200`, `proteinGoal=160`, `carbsGoal=280`, `fatsGoal=75`, `waterGoal=2500` instead of fetching from API or calculating from onboarding data
2. **No post-deletion refresh** — `NutritionLogPage.tsx`'s `handleDeleteMeal` doesn't refetch the daily log after deletion, leaving stale UI
3. **Hardcoded serving size** — `FoodPickerModal.tsx` passes `servings={1}` with no serving size selector
4. **ForgotPassword bypasses API** — `ForgotPasswordPage.tsx` calls `wp-login.php?action=lostpassword` directly via `fetch` instead of using the NutriTrack API plugin
5. **No error state UI on Dashboard** — Dashboard's `catch` block logs to console but doesn't render error state; only shows loading spinner
6. **No skeleton loaders** — All pages use a single `<LoadingSpinner>` at page level instead of per-component skeleton loaders
7. **Material Symbols via CDN** — Icon set loaded from Google Fonts CDN in `index.html`, creating external dependency and potential FOUC
8. **No pagination in food/recipe lists** — `FoodListPage` and `RecipesListPage` fetch all items at once, no server-side pagination
9. **Client-side search only** — Food and recipe search filters are client-side after full fetch; no debounced API search
10. **Insights page is minimal** — `InsightsPage.tsx` contains placeholder UI with no real data integration

---

## Technical Debt

1. **No server state management** — Missing React Query/SWR/TanStack Query; manual `useState` + `useEffect` for every data fetch leads to boilerplate duplication and no built-in caching, refetching, or stale-while-revalidate
2. **No component tests** — No test files found anywhere in the project
3. **localStorage for auth tokens** — Not httpOnly or Secure; susceptible to XSS token theft
4. **No refresh token flow** — Token expiry forces full re-login
5. **Duplicate API response types** — Some services define inline response types rather than reusing `src/types/` definitions
6. **No API error type standardization** — Error handling is inconsistent: some services return `null`, some throw, some return empty arrays
7. **Onboarding redirect uses localStorage** — `onboarding_completed` flag read from localStorage instead of API/user meta
8. **Inline SVG icons** — Many components use inline SVG strings (Google/Apple auth buttons) instead of lucide-react equivalents
9. **`eslint-disable` usage** — Some files disable lint rules rather than fixing underlying issues
10. **No environment validation** — Config has fallback defaults (`https://your-wordpress-site.com`) that would silently fail in production

---

## Security Observations

1. **JWT in localStorage** — Accessible to any JavaScript, vulnerable to XSS. Consider httpOnly cookies.
2. **No CSRF protection** — Axios sends credentials via header but no CSRF token
3. **Password validation** — Login validates min 6 chars, register validates min 8 chars; no password strength meter
4. **No rate limiting on client** — No throttling of login/register attempts
5. **No input sanitization displayed** — User display names rendered directly with no escaping (React's JSX escapes by default, but no explicit sanitization)
6. **ForgotPassword page calls wp-login.php directly** — Bypasses NutriTrack API plugin, exposes underlying WordPress infrastructure
7. **Token validation** — No periodic token validation; only checked on 401 response
8. **Logout does not invalidate server-side token** — Only clears localStorage

---

## Accessibility Observations

1. **Material Symbols lack aria labels** — Icon-only buttons and indicators don't have `aria-label` attributes
2. **No skip-to-content link** — Keyboard users must tab through entire sidebar/navbar
3. **Focus indicators are minimal** — Relies on Tailwind's default `focus:ring`, not consistently applied to custom elements
4. **No form error announcements** — Error messages are rendered but not announced to screen readers via `aria-live` or `role="alert"`
5. **Modal lacks focus trapping** — `Modal.tsx` doesn't trap focus; keyboard users can tab behind the modal
6. **Color contrast** — Uses Tailwind semantic tokens; should be verified against WCAG 2.1 AA standards
7. **Chart accessibility** — SVG charts (WeightTrendChart, ProgressRing) lack `role="img"` and text alternatives

---

## Performance Observations

1. **No code splitting** — All route components are eagerly imported in `routes/index.tsx`; no `React.lazy()` or dynamic imports
2. **No image optimization** — Recipe/food images loaded at full resolution, no lazy loading or responsive srcsets
3. **Full page loading spinner** — No skeleton loading; entire page shows spinner until all data arrives
4. **Client-side search on full dataset** — Food/recipe lists fetch all records then filter in memory
5. **Aggressive cache clearing** — Any non-GET request clears the entire cache, not just invalidated entries
6. **No memoization for expensive computations** — SVG path calculations in WeightTrendChart and ProgressRing components re-calculate on every render
7. **Bundle size** — All of recharts is bundled; no tree-shaking optimization for chart components
8. **Material Symbols full set loaded** — Loading the entire icon font instead of subsetting only used icons