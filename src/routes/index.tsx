import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { AuthShell } from '@layouts/AuthShell';
import { MainLayout, ProtectedRoute } from '@components/layout';
import { OnboardingProvider } from '@contexts/OnboardingProvider';
import { OnboardingPage } from '@features/onboarding';
import { LoginPage, RegisterPage, ForgotPasswordPage } from '@features/auth';
import { DashboardPage } from '@features/dashboard';
import { NutritionLogPage } from '@features/nutrition-log';
import { MealPlannerPage } from '@features/meal-planner';
import { RecipesListPage, RecipeDetailPage } from '@features/recipes';
import { PricingPage } from '@features/pricing';
import { CheckoutPage } from '@features/checkout';
import { InsightsPage } from '@features/insights';
import { SettingsPage } from '@features/settings';
import { ProfileMetricsPage } from '@features/profile-metrics';
export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} />

      <Route element={<AuthShell />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      <Route element={<ProtectedRoute requireOnboarding />}>
        <Route path="/onboarding" element={<OnboardingProvider><OnboardingPage /></OnboardingProvider>} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/log" element={<NutritionLogPage />} />
          <Route path="/planner" element={<MealPlannerPage />} />
          <Route path="/recipes" element={<RecipesListPage />} />
          <Route path="/recipes/:id" element={<RecipeDetailPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfileMetricsPage />} />
        </Route>
      </Route>

      <Route path="/pricing" element={<PricingPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
