export const config = {
  api: {
    baseUrl: import.meta.env.VITE_WP_API_URL || 'https://your-wordpress-site.com/wp-json',
    jwtEndpoint: import.meta.env.VITE_WP_JWT_ENDPOINT || '/jwt-auth/v1/token',
    namespace: '/nutritrack/v1',
  },
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '',
  },
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
  pagination: {
    defaultPageSize: 20,
  },
} as const;

export type AppConfig = typeof config;
