import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { authService } from '@services/auth.service';

interface ProtectedRouteProps {
  redirectTo?: string;
  requireOnboarding?: boolean;
}

export function ProtectedRoute({ redirectTo = '/login', requireOnboarding = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  const storedAuth = authService.getStoredAuth();
  const hasCompletedOnboarding = localStorage.getItem('onboarding_completed') === 'true' || Boolean(storedAuth?.user?.onboardingCompleted);

  if (requireOnboarding && hasCompletedOnboarding) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!requireOnboarding && !hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}
