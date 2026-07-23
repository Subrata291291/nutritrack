import { config } from '@config/index';

const WP = config.api.baseUrl;
const NS = config.api.namespace;

export const endpoints = {
  auth: {
    login: `${WP}/jwt-auth/v1/token`,
    validate: `${WP}/jwt-auth/v1/token/validate`,
    register: `${WP}${NS}/auth/register`,
    me: `${WP}/wp/v2/users/me`,
  },
  onboarding: {
    saveMetrics: `${WP}${NS}/onboarding/metrics`,
    getTDEE: `${WP}${NS}/onboarding/tdee`,
    complete: `${WP}${NS}/onboarding/complete`,
  },
  nutrition: {
    log: `${WP}${NS}/nutrition/log`,
    logDetail: (id: number) => `${WP}${NS}/nutrition/log/${id}`,
    dailyLog: (date: string) => `${WP}${NS}/nutrition/daily/${date}`,
    recentFoods: `${WP}${NS}/nutrition/recent-foods`,
    searchFoods: `${WP}${NS}/nutrition/search`,
    water: `${WP}${NS}/nutrition/water`,
  },
  mealPlans: {
    plan: (weekStart: string) => `${WP}${NS}/meal-plans/${weekStart}`,
    shoppingList: (planId: number) => `${WP}${NS}/meal-plans/${planId}/shopping-list`,
  },
  recipes: {
    list: `${WP}${NS}/recipes`,
    detail: (id: number) => `${WP}${NS}/recipes/${id}`,
    categories: `${WP}${NS}/recipes/categories`,
  },
  insights: {
    weight: `${WP}${NS}/insights/weight`,
    macros: `${WP}${NS}/insights/macros`,
    milestones: `${WP}${NS}/insights/milestones`,
    smartInsights: `${WP}${NS}/insights/smart`,
  },
  subscriptions: {
    plans: `${WP}${NS}/subscriptions/plans`,
    createCheckout: `${WP}${NS}/subscriptions/create-checkout`,
    manage: `${WP}${NS}/subscriptions/manage`,
  },
  user: {
    profile: `${WP}${NS}/user/profile`,
    settings: `${WP}${NS}/user/settings`,
    avatar: `${WP}${NS}/user/avatar`,
  },
  notifications: {
    list: `${WP}${NS}/notifications`,
    markRead: `${WP}${NS}/notifications/read`,
  },
  foods: {
    list: `${WP}${NS}/foods`,
    detail: (id: number) => `${WP}${NS}/foods/${id}`,
  },
} as const;
