import { apiClient } from '@api/client';
import { endpoints } from '@api/endpoints';
import type { AuthState, LoginCredentials, RegisterCredentials, User } from 'types/index';

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthState> {
    const formData = new URLSearchParams();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    const response = await apiClient.post(endpoints.auth.login, formData.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const { token, user_email, user_display_name } = response.data;
    const user: User = {
      id: response.data.user_id || 0,
      email: user_email || credentials.email,
      displayName: user_display_name || credentials.email,
    };

    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));

    // Fetch full profile to get membership and other fields
    try {
      const profileResp = await apiClient.get(endpoints.user.profile);
      const profile = profileResp.data?.data ?? profileResp.data;
      user.membership = profile.membership ? profile.membership.charAt(0).toUpperCase() + profile.membership.slice(1) : 'Free';
      user.onboardingCompleted = profile.onboardingCompleted;
      localStorage.setItem('auth_user', JSON.stringify(user));
      if (profile.onboardingCompleted) {
        localStorage.setItem('onboarding_completed', 'true');
      } else {
        localStorage.removeItem('onboarding_completed');
      }
    } catch {
      // profile fetch is non-blocking
    }

    return { user, token, isAuthenticated: true, isLoading: false };
  }

  async register(credentials: RegisterCredentials): Promise<AuthState> {
    await apiClient.post(endpoints.auth.register, {
      username: credentials.email,
      email: credentials.email,
      password: credentials.password,
      display_name: credentials.displayName,
    });

    localStorage.removeItem('onboarding_completed');

    return this.login({ email: credentials.email, password: credentials.password });
  }

  async validateToken(): Promise<boolean> {
    try {
      const { data } = await apiClient.post(endpoints.auth.validate);
      return data?.data?.status === 200;
    } catch {
      return false;
    }
  }

  async getProfile(): Promise<User> {
    const response = await apiClient.get(endpoints.auth.me);
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
  }

  getStoredAuth(): AuthState | null {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('auth_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        return { user, token, isAuthenticated: true, isLoading: false };
      } catch {
        return null;
      }
    }
    return null;
  }
}

export const authService = new AuthService();
