# Priority Analysis — NutriTrack Module Ranking

## Ranking Methodology

Each module is scored on 5 dimensions (1-10 scale):

- **Business Value (BV):** Direct impact on revenue, retention, and product viability
- **User Impact (UI):** How many users are affected and how significantly
- **Technical Dependency (TD):** Whether other modules depend on this one
- **Complexity (CX):** Implementation effort (10 = most complex)
- **Risk (RK):** Probability of bugs, regressions, or performance issues (10 = most risky)

**Priority Score = BV + UI + TD − CX − RK** (higher is better)

---

## Module Ranking Table

| Rank | Module | BV | UI | TD | CX | RK | Score | Priority |
|------|--------|----|----|----|----|----|-------|----------|
| 1 | **Onboarding** | 10 | 10 | 10 | 4 | 2 | **24** | **Critical** |
| 2 | **Dashboard** | 10 | 10 | 8 | 5 | 3 | **20** | **Critical** |
| 3 | **Nutrition Log** | 9 | 10 | 8 | 5 | 4 | **18** | **Critical** |
| 4 | **Authentication** | 10 | 10 | 10 | 6 | 6 | **18** | **Critical** |
| 5 | **Food Library** | 8 | 9 | 7 | 4 | 2 | **18** | **High** |
| 6 | **Recipes** | 8 | 9 | 7 | 4 | 2 | **18** | **High** |
| 7 | **Meal Planner** | 7 | 8 | 6 | 6 | 3 | **12** | **High** |
| 8 | **Settings** | 5 | 7 | 3 | 4 | 2 | **9** | **Medium** |
| 9 | **Weight Tracker** | 5 | 6 | 4 | 3 | 1 | **11** (moved up) | **Medium** |
| 10 | **Insights** | 6 | 6 | 5 | 5 | 3 | **9** | **Medium** |
| 11 | **Pricing / Checkout** | 7 | 3 | 1 | 3 | 2 | **6** | **Low** |
| 12 | **Profile Metrics** | 3 | 4 | 2 | 3 | 1 | **5** | **Low** |

**Note:** Weight Tracker scored 11 but is listed at rank 9 because of its tight integration with Dashboard and Nutrition Log; fixing weight tracking unlocks Dashboard weight display.

---

## Detailed Rankings

### 1. Onboarding (Score: 24) — Critical

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Business Value | 10 | Without onboarding, no personalization exists. No TDEE/calorie targets. Core value prop broken. |
| User Impact | 10 | Every user must complete onboarding before using the app. Blocking flow. |
| Technical Dependency | 10 | Dashboard, Nutrition Log, Meal Planner all depend on onboarding data for personalized targets. |
| Complexity | 4 | Multi-step form with validation; already 80% implemented. Small gaps remain. |
| Risk | 2 | Low risk — self-contained feature, no external dependencies beyond existing API. |

**Gaps to close:** Trigger TDEE calculation post-save, add Cooking Skill field, add Daily Budget field, ensure target_weight saved, implement GET/PUT for editing.

---

### 2. Dashboard (Score: 20) — Critical

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Business Value | 10 | The default landing page. Users evaluate the product here. First impression. |
| User Impact | 10 | Every authenticated user sees the dashboard daily. |
| Technical Dependency | 8 | Consumes data from Nutrition Log, Weight Tracker, Meal Planner, Onboarding. |
| Complexity | 5 | Multiple data sources, chart rendering, responsive layout. Already well-implemented. |
| Risk | 3 | Breaking existing charts or layout would be highly visible. |

**Gaps to close:** Remove hardcoded targets, add Meal Plan section, add Quick Actions, add Recent Activity feed, add skeleton loaders, add error state UI.

---

### 3. Nutrition Log (Score: 18) — Critical

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Business Value | 9 | Core daily tracking feature. Primary data source for all analytics. |
| User Impact | 10 | Users log meals daily. High engagement feature. |
| Technical Dependency | 8 | Feeds Dashboard, Insights, Meal Planner adherence. |
| Complexity | 5 | Multi-modal food search, serving size, CRUD, date navigation. Mostly built. |
| Risk | 4 | Data integrity risk — deletion without refresh, hardcoded servings. |

**Gaps to close:** Fix handleDeleteMeal refetch, add serving size selector to FoodPickerModal, add EditMealModal, add RecipeSearch, add delete confirmation component.

---

### 4. Authentication (Score: 18) — Critical

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Business Value | 10 | Gating mechanism for entire app. Must work flawlessly. |
| User Impact | 10 | Every user passes through auth. Broken auth = no users. |
| Technical Dependency | 10 | Every other module requires authenticated user. |
| Complexity | 6 | JWT flow, localStorage management, interceptor logic, route guards, error handling. |
| Risk | 6 | Security-sensitive. Breaking auth blocks all users. ForgotPassword bypasses API. |

**Gaps to close:** Build ResetPasswordPage, fix ForgotPassword to use API, add logout API call, consider httpOnly cookies.

---

### 5. Food Library (Score: 18) — High

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Business Value | 8 | Required for Nutrition Log and Recipes to function. Secondary to user-facing features. |
| User Impact | 9 | Users browse foods frequently when logging meals. |
| Technical Dependency | 7 | Nutrition Log, Recipes, Meal Planner all reference foods. |
| Complexity | 4 | List/detail pattern, client-side search, categories. Simple implementation. |
| Risk | 2 | Read-only data display. Low risk. |

**Gaps to close:** Add pagination, add nutrition filters, add diet filters, add favorites, add debounced server-side search, add image handling.

---

### 6. Recipes (Score: 18) — High

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Business Value | 8 | Content marketing value, meal planning foundation, user engagement. |
| User Impact | 9 | Users browse and cook recipes regularly. |
| Technical Dependency | 7 | Feeds Meal Planner and Nutrition Log. |
| Complexity | 4 | List/detail pattern, ingredients, instructions. Simple. |
| Risk | 2 | Read-only. Low risk. |

**Gaps to close:** Add pagination, add favorites, add difficulty/cuisine filters, add serving selector, add related recipes.

---

### 7. Meal Planner (Score: 12) — High

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Business Value | 7 | Differentiator feature. Upsell potential. Post-MVP value. |
| User Impact | 8 | Weekly planning saves users time. High engagement potential. |
| Technical Dependency | 6 | Depends on Recipes and Foods. Feeds Nutrition Log and Dashboard. |
| Complexity | 6 | Weekly calendar, CRUD for each meal slot, nutrition aggregation. Moderate complexity. |
| Risk | 3 | Mostly CRUD. Low data integrity risk. |

**Gaps to close:** Add grocery list generation, add copy/duplicate week, add replace meal, add 6 meal types, add clear day/week actions.

---

### 8. Settings (Score: 9) — Medium

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Business Value | 5 | Important for account management but not core tracking flow. |
| User Impact | 7 | Users visit settings occasionally for profile and preference updates. |
| Technical Dependency | 3 | Standalone feature. Minimal coupling. |
| Complexity | 4 | Tabbed form sections. Straightforward CRUD. |
| Risk | 2 | Well-isolated. Low risk. |

**Gaps to close:** Add password change form, add connected services section.

---

### 9. Weight Tracker (Score: 11) — Medium

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Business Value | 5 | Important progress metric but not daily active feature. |
| User Impact | 6 | Weight-trackers log weekly. Not all users track weight. |
| Technical Dependency | 4 | Feeds Dashboard chart and Insights. |
| Complexity | 3 | Simple CRUD + chart. |
| Risk | 1 | Low risk. |

**Note:** Already partially implemented via Dashboard's WeightTrendChart and `insights.service`. A dedicated `/profile` page exists. Main gap is the empty spec file — unclear requirements.

---

### 10. Insights (Score: 9) — Medium

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Business Value | 6 | Analytics drive retention. Users who see progress stay longer. |
| User Impact | 6 | Users view insights weekly/monthly. Not daily. |
| Technical Dependency | 5 | Depends on Nutrition Log, Weight Tracker, Onboarding data. |
| Complexity | 5 | Charts, date ranges, aggregations. Moderate complexity. |
| Risk | 3 | Read-only analytics. Low data integrity risk. Empty spec = unclear requirements. |

**Gaps to close:** Build out the page with real data from `insights.service`, add charts and summaries.

---

### 11. Pricing / Checkout (Score: 6) — Low

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Business Value | 7 | Direct revenue generation. Important but not core UX. |
| User Impact | 3 | Only non-authenticated/free users see pricing. Small audience currently. |
| Technical Dependency | 1 | Standalone. No feature depends on it. |
| Complexity | 3 | Static pricing display + Stripe redirect. Simple. |
| Risk | 2 | Stripe integration has payment security risk but limited scope. |

---

### 12. Profile Metrics (Score: 5) — Low

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Business Value | 3 | Niche feature. Overlaps with Dashboard and Settings. |
| User Impact | 4 | Users track body metrics periodically. Low frequency. |
| Technical Dependency | 2 | Standalone. |
| Complexity | 3 | Simple form + history list. |
| Risk | 1 | Low risk. |

---

## Recommended Implementation Order

| Phase | Module | Rationale |
|-------|--------|-----------|
| **Phase 1** | Onboarding + Nutrition Log (P0 bugs) | Personalization is prerequisite for everything. Fix blocking bugs in Nutrition Log. |
| **Phase 2** | Dashboard dynamic data | Remove hardcoded values, add missing widgets, add skeleton loaders, add error states. |
| **Phase 3** | Authentication gap fixes | Build ResetPasswordPage, fix ForgotPassword API usage. |
| **Phase 4** | Food Library + Recipes | Add pagination, filters, favorites, debounced search. |
| **Phase 5** | Meal Planner | Add grocery list, copy/duplicate, replace meal, 6 meal types. |
| **Phase 6** | Insights + Weight Tracker | Build out Insights page with real data; add weight entry UI. |
| **Phase 7** | Settings + Profile Metrics | Add password change, polish existing sections. |
| **Phase 8** | Cross-cutting improvements | Code splitting, accessibility audit, JWT storage security, tests. |

### Why Onboarding + Nutrition Log first

1. **Onboarding** is the gateway. Without it, users never see personalized targets. The feature is ~80% complete — closing the remaining gaps (TDEE trigger, target weight, field additions) is low effort and unlocks the entire personalization pipeline.

2. **Nutrition Log** is the most actively used feature with two concrete bugs: `handleDeleteMeal` doesn't refresh the log, and `FoodPickerModal` hardcodes servings=1. Fixing these directly impacts every user's daily experience.

3. **Dashboard hardcoded targets** need onboarding data to be dynamic — making Dashboard dependent on Onboarding completion.

### Why not Authentication first

Authentication works. Login, register, and protected routes function correctly. The gaps (ResetPasswordPage, ForgotPassword API fix) are important but don't block other features. Users can register, log in, and use the app today. Fixing these is phase 3 priority.