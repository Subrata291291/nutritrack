# NutriTrack Testing Guide

## Overview

NutriTrack uses a multi-layered testing strategy:

- **Unit Tests** — Pure functions (utils, tdee calculations, formatting)
- **Service Tests** — API service classes with MSW-mocked HTTP
- **Hook Tests** — React hooks with MSW-mocked API responses
- **Component Tests** — UI components with React Testing Library
- **Integration Tests** — Page-level flows with MSW
- **E2E Tests** — Playwright browser tests against the real build

---

## Running Tests

```bash
# Run all unit/integration/component tests
npm test

# Run with UI
npx vitest --ui

# Run in watch mode
npx vitest

# Run specific test file
npx vitest test/hooks.test.ts

# Run with coverage
npx vitest run --coverage

# Run Playwright E2E tests
npm run test:e2e

# Run Playwright with UI mode
npx playwright test --ui

# Run all checks locally (lint + typecheck + test + build)
npm run build
```

---

## NPM Scripts

The following test scripts are available:

| Script | Command | Description |
|--------|---------|-------------|
| `test` | `vitest run` | Run all unit/component/integration tests |
| `test:watch` | `vitest` | Run tests in watch mode |
| `test:coverage` | `vitest run --coverage` | Run tests with coverage report |
| `test:e2e` | `playwright test` | Run Playwright E2E tests |
| `test:ui` | `vitest --ui` | Vitest UI mode |

---

## Test Directory Structure

```
test/
├── setup.ts                    # Vitest global setup (MSW server, mocks)
├── utils.test.ts               # Unit tests for utility functions
├── services.test.ts            # Service class tests
├── hooks.test.ts               # React hook tests
├── components.test.tsx         # Component tests
├── integration.test.tsx        # Integration/flow tests
├── mocks/
│   ├── handlers.ts             # MSW request handlers (all endpoints)
│   └── data.ts                 # Mock fixtures (recipes, meals, users, etc.)
├── utils/
│   └── test-utils.tsx          # Custom render with providers
└── e2e/
    ├── auth.spec.ts            # Login/register E2E scenarios
    ├── recipes.spec.ts         # Recipes page E2E scenarios
    ├── meal-planner.spec.ts    # Meal planner E2E scenarios
    └── dashboard.spec.ts       # Dashboard E2E scenarios
```

---

## Mocking the API

All HTTP calls use MSW (Mock Service Worker). Handlers cover every endpoint.

### How it works

1. MSW intercepts all `fetch`/`axios` calls at the network level
2. No real HTTP requests are made during tests
3. Handlers return realistic mock data from `test/mocks/data.ts`

### Using MSW in a test

```ts
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
```

### Overriding a handler for a specific test

```ts
it('handles error', async () => {
  server.use(
    http.get('https://test-site.com/wp-json/nutritrack/v1/recipes', () => {
      return new HttpResponse(null, { status: 500 });
    }),
  );
  // test error state...
});
```

---

## Mock Data

Mock fixtures are in `test/mocks/data.ts`:

| Fixture | Type | Description |
|---------|------|-------------|
| `mockRecipe` | `Recipe` | Single recipe |
| `mockRecipes` | `Recipe[]` | Array of 3 recipes |
| `mockCategories` | `Category[]` | Recipe categories |
| `mockMealPlanDay` | `MealPlanDay` | Single day with meals |
| `mockMealPlanDays` | `MealPlanDay[]` | Week of days |
| `mockFoodItem` | `FoodItem` | Food library item |
| `mockMealEntry` | `MealEntry` | Nutrition log entry |
| `mockDailyLog` | `DailyLog` | Full daily nutrition log |
| `mockUserProfile` | `UserProfile` | User profile data |
| `mockUserSettings` | `UserSettings` | User settings |
| `mockAIGeneratedPlan` | `AIGeneratedPlan` | AI-generated meal plan |
| `mockSwapAlternative` | `SwapAlternative` | Single swap suggestion |
| `mockSwapResponse` | `AISwapResponse` | Full swap API response |
| `mockPlanResponse` | `object` | Generate plan API response |

---

## Writing New Tests

### Unit test for a utility

```ts
import { describe, it, expect } from 'vitest';
import { myFunction } from '@utils/my-util';

describe('myFunction', () => {
  it('returns expected value', () => {
    expect(myFunction('input')).toBe('output');
  });
});
```

### Component test

```ts
import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../test/utils/test-utils';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### Hook test with MSW

```ts
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { handlers } from '../../test/mocks/handlers';
import { useMyHook } from './useMyHook';

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'bypass' }));
afterAll(() => server.close());

describe('useMyHook', () => {
  it('returns data', async () => {
    const { result } = renderHook(() => useMyHook());
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBeDefined();
  });
});
```

---

## Coverage

Coverage reports are generated with `@vitest/coverage-v8`.

**Minimum thresholds (enforced in vitest.config.ts):**

| Metric | Minimum |
|--------|---------|
| Statements | 90% |
| Branches | 85% |
| Functions | 90% |
| Lines | 90% |

View the latest coverage report:

```bash
npx vitest run --coverage
# Open coverage/index.html in a browser
```

---

## CI/CD

Tests run automatically on every push/PR via GitHub Actions (`.github/workflows/ci.yml`):

1. **Lint & TypeCheck** — ESLint + TypeScript
2. **Test** — Vitest with coverage
3. **E2E** — Playwright browser tests
4. **Build** — Production build (depends on lint + test passing)

---

## Best Practices

1. **Mock at the network level** — Use MSW handlers, never mock axios/fetch directly
2. **Test behavior, not implementation** — Assert on rendered UI and user-observable behavior
3. **Use `renderWithProviders`** — Always use the custom render to wrap with Router
4. **Avoid `data-testid`** unless absolutely necessary — prefer accessible queries
5. **One assertion per test** — Keep tests focused and descriptive
6. **Cover error states** — Every component that fetches data should test loading, success, and error states
7. **Reset handlers** — Always call `server.resetHandlers()` in `afterEach` to prevent test pollution
