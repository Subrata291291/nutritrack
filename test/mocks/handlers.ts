import { http, HttpResponse } from 'msw';
import { mockRecipes, mockCategories, mockMealPlanDays, mockDailyLog, mockUserProfile, mockUserSettings, mockPlanResponse, mockSwapResponse, mockFoodItem } from './data';

const BASE = 'https://test-site.com/wp-json';
const NS = '/nutritrack/v1';

export const handlers = [
  http.get(`${BASE}${NS}/recipes`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const perPage = parseInt(url.searchParams.get('per_page') || '20');
    const search = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    let filtered = [...mockRecipes];
    if (search) filtered = filtered.filter((r) => r.title.toLowerCase().includes(search.toLowerCase()));
    if (category) filtered = filtered.filter((r) => r.tags.includes(category));
    const total = filtered.length;
    const start = (page - 1) * perPage;
    const paged = filtered.slice(start, start + perPage);
    return HttpResponse.json({ success: true, data: paged, total, pages: Math.ceil(total / perPage) });
  }),

  http.get(`${BASE}${NS}/recipes/categories`, () => {
    return HttpResponse.json({ success: true, data: mockCategories });
  }),

  http.get(`${BASE}${NS}/recipes/:id`, ({ params }) => {
    const recipe = mockRecipes.find((r) => r.id === Number(params.id));
    if (!recipe) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json({ success: true, data: recipe });
  }),

  http.post(`${BASE}${NS}/recipes/:id/favorite`, ({ params }) => {
    return HttpResponse.json({ favorited: true });
  }),

  http.delete(`${BASE}${NS}/recipes/:id/favorite`, ({ params }) => {
    return HttpResponse.json({ favorited: false });
  }),

  http.get(`${BASE}${NS}/user/favorites`, () => {
    return HttpResponse.json({ success: true, data: mockRecipes.slice(0, 2) });
  }),

  http.post(`${BASE}/jwt-auth/v1/token`, () => {
    return HttpResponse.json({
      token: 'mock-jwt-token',
      user_email: 'test@example.com',
      user_display_name: 'Test User',
      user_id: 1,
    });
  }),

  http.post(`${BASE}/jwt-auth/v1/token/validate`, () => {
    return HttpResponse.json({ data: { status: 200 } });
  }),

  http.post(`${BASE}${NS}/auth/register`, () => {
    return HttpResponse.json({ success: true, token: 'mock-jwt-token', user_id: 1, user_email: 'test@example.com', user_display_name: 'Test User' });
  }),

  http.get(`${BASE}${NS}/user/profile`, () => {
    return HttpResponse.json({ success: true, data: mockUserProfile });
  }),

  http.put(`${BASE}${NS}/user/profile`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, data: { ...mockUserProfile, ...(body as Partial<typeof mockUserProfile>) } });
  }),

  http.get(`${BASE}${NS}/user/settings`, () => {
    return HttpResponse.json({ success: true, data: mockUserSettings });
  }),

  http.put(`${BASE}${NS}/user/settings`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, data: { ...mockUserSettings, ...(body as Partial<typeof mockUserSettings>) } });
  }),

  http.post(`${BASE}${NS}/user/avatar`, () => {
    return HttpResponse.json({ success: true, data: { url: 'https://test-site.com/avatars/test.jpg' } });
  }),

  http.get(`${BASE}${NS}/meal-plans/:weekStart`, ({ params }) => {
    return HttpResponse.json({
      success: true,
      data: { id: 1, weekStart: params.weekStart, days: mockMealPlanDays, shoppingList: [] },
    });
  }),

  http.post(`${BASE}${NS}/meal-plans/:weekStart`, async ({ request, params }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, data: { id: 1 } }, { status: 201 });
  }),

  http.get(`${BASE}${NS}/nutrition/daily/:date`, ({ params }) => {
    return HttpResponse.json({ success: true, data: mockDailyLog });
  }),

  http.post(`${BASE}${NS}/nutrition/log`, async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, data: { id: 201, mealType: 'lunch', foodItem: mockFoodItem, servings: 1, loggedAt: new Date().toISOString() } }, { status: 201 });
  }),

  http.delete(`${BASE}${NS}/nutrition/log/:id`, () => {
    return HttpResponse.json({ success: true, message: 'Entry deleted.' });
  }),

  http.get(`${BASE}${NS}/nutrition/search`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get('q') || '';
    const filtered = q ? [mockFoodItem].filter((f) => f.name.toLowerCase().includes(q.toLowerCase())) : [mockFoodItem];
    return HttpResponse.json({ success: true, data: filtered });
  }),

  http.get(`${BASE}${NS}/nutrition/recent-foods`, () => {
    return HttpResponse.json({ success: true, data: [mockFoodItem] });
  }),

  http.post(`${BASE}${NS}/nutrition/water`, () => {
    return HttpResponse.json({ success: true, waterMl: 2000 });
  }),

  http.get(`${BASE}${NS}/foods`, () => {
    return HttpResponse.json({ success: true, data: [mockFoodItem] });
  }),

  http.get(`${BASE}${NS}/foods/:id`, () => {
    return HttpResponse.json({ success: true, data: mockFoodItem });
  }),

  http.get(`${BASE}${NS}/onboarding/metrics`, () => {
    return HttpResponse.json({ success: true, data: {} });
  }),

  http.post(`${BASE}${NS}/onboarding/metrics`, () => {
    return HttpResponse.json({ success: true, metrics: {} });
  }),

  http.post(`${BASE}${NS}/onboarding/tdee`, () => {
    return HttpResponse.json({ success: true, data: { targetCalories: 2200, proteinGrams: 165, carbsGrams: 220, fatsGrams: 73 } });
  }),

  http.post(`${BASE}${NS}/onboarding/complete`, () => {
    return HttpResponse.json({ success: true, message: 'Onboarding complete.' });
  }),

  http.get(`${BASE}${NS}/insights/weight`, () => {
    return HttpResponse.json({
      success: true,
      data: { currentWeight: 80, startWeight: 82, targetWeight: 75, weeklyChange: -0.5, projectedGoalDate: null, entries: [{ date: '2026-07-20', weightKg: 82 }, { date: '2026-07-27', weightKg: 80 }] },
    });
  }),

  http.post(`${BASE}${NS}/insights/weight`, () => {
    return HttpResponse.json({ success: true, data: { id: 1, date: '2026-07-27', weightKg: 80 } }, { status: 201 });
  }),

  http.get(`${BASE}${NS}/insights/macros`, () => {
    return HttpResponse.json({ success: true, data: [{ date: '2026-07-27', calorieAdherence: 85, proteinAdherence: 90, carbsAdherence: 70, fatsAdherence: 80 }] });
  }),

  http.get(`${BASE}${NS}/insights/milestones`, () => {
    return HttpResponse.json({ success: true, data: [{ id: 1, title: 'First Meal Logged', description: 'You tracked your first meal.', icon: 'restaurant', achieved: true, progress: 100 }] });
  }),

  http.get(`${BASE}${NS}/insights/smart`, () => {
    return HttpResponse.json({ success: true, data: [{ id: 1, type: 'nutrition', title: 'Protein Power', description: 'Great work!', icon: 'fitness_center', color: '#006c49' }] });
  }),

  http.get(`${BASE}${NS}/notifications`, () => {
    return HttpResponse.json({ success: true, data: [{ id: 1, icon: 'check_circle', text: 'Welcome!', time: 'Just now', color: 'text-primary', unread: true }], unread: 1 });
  }),

  http.post(`${BASE}${NS}/notifications/read`, () => {
    return HttpResponse.json({ success: true, message: 'All marked as read.' });
  }),

  http.get(`${BASE}${NS}/subscriptions/plans`, () => {
    return HttpResponse.json({ success: true, data: [{ id: 'free', name: 'Free', monthlyPrice: 0, annualPrice: 0, features: [], highlighted: false }] });
  }),

  http.post(`${BASE}${NS}/subscriptions/create-checkout`, () => {
    return HttpResponse.json({ success: true, data: { url: 'https://checkout.example.com', sessionId: 'mock_session' } });
  }),

  http.post(`${BASE}${NS}/subscriptions/manage`, () => {
    return HttpResponse.json({ success: true, data: { url: 'https://example.com/account', planId: 'free', billingPeriod: 'monthly', status: 'inactive' } });
  }),

  http.post(`${BASE}${NS}/ai/generate-plan`, () => {
    return HttpResponse.json({ success: true, data: mockPlanResponse });
  }),

  http.post(`${BASE}${NS}/ai/suggest-swap`, () => {
    return HttpResponse.json(mockSwapResponse);
  }),

  http.get(`${BASE}/wp/v2/users/me`, () => {
    return HttpResponse.json({ id: 1, name: 'Test User', email: 'test@example.com' });
  }),

  http.put(`${BASE}/wp/v2/users/me`, () => {
    return HttpResponse.json({ id: 1, name: 'Test User', email: 'test@example.com' });
  }),

  http.get(`${BASE}${NS}/meal-plans/:planId/shopping-list`, () => {
    return HttpResponse.json({ success: true, data: { id: 1, weekStart: '2026-07-27', items: [] } });
  }),
];
