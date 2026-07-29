import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

afterEach(() => {
  cleanup();
});

vi.mock('@config/index', () => ({
  config: {
    api: {
      baseUrl: 'https://test-site.com/wp-json',
      jwtEndpoint: '/jwt-auth/v1/token',
      namespace: '/nutritrack/v1',
    },
    stripe: { publishableKey: '' },
    routes: {
      home: '/',
      login: '/login',
      register: '/register',
      onboarding: '/onboarding',
      dashboard: '/dashboard',
      nutritionLog: '/log',
      mealPlanner: '/planner',
      recipes: '/recipes',
      recipeDetail: '/recipes/:id',
      insights: '/insights',
      pricing: '/pricing',
      checkout: '/checkout',
      settings: '/settings',
      profile: '/profile',
    },
    pagination: { defaultPageSize: 20 },
  },
}));

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
}
