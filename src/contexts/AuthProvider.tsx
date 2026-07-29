import { useState, useCallback, type ReactNode } from 'react';
import type { AuthState, LoginCredentials, RegisterCredentials, User } from 'types/index';
import type { UserProfile } from 'types/settings';
import type { NutritionTargets } from 'types/nutrition';
import { authService } from '@services/auth.service';
import { userService } from '@services/user.service';
import { getNutritionTargets } from '@utils/tdee';
import { AuthContext } from './AuthContext';

export const PROFILE_CACHE_KEY = 'cached_profile';

function getInitialState(): AuthState {
  const stored = authService.getStoredAuth();
  if (stored) {
    return { ...stored, isLoading: false };
  }
  return { user: null, token: null, isAuthenticated: false, isLoading: false };
}

function loadCachedProfile(): UserProfile | null {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (raw) return JSON.parse(raw) as UserProfile;
  } catch { /* ignore */ }
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(getInitialState);
  const [profile, setProfile] = useState<UserProfile | null>(loadCachedProfile);
  const [nutritionTargets, setNutritionTargets] = useState<NutritionTargets | null>(() => {
    const cached = loadCachedProfile();
    if (cached) return getNutritionTargets(cached);
    return null;
  });

  const fetchAndCacheProfile = useCallback(async () => {
    try {
      const userProfile = await userService.getProfile();
      setProfile(userProfile);
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(userProfile));
      const targets = getNutritionTargets(userProfile);
      setNutritionTargets(targets);
    } catch {
      /* profile fetch is non-blocking */
    }
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const authState = await authService.login(credentials);
      setState(authState);
      await fetchAndCacheProfile();
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [fetchAndCacheProfile]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const authState = await authService.register(credentials);
      setState(authState);
      await fetchAndCacheProfile();
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [fetchAndCacheProfile]);

  const logout = useCallback(() => {
    authService.logout();
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
    setProfile(null);
    setNutritionTargets(null);
    localStorage.removeItem(PROFILE_CACHE_KEY);
  }, []);

  const updateUser = useCallback((user: User) => {
    setState((prev) => ({ ...prev, user }));
    localStorage.setItem('auth_user', JSON.stringify(user));
  }, []);

  const updateProfile = useCallback((userProfile: UserProfile) => {
    setProfile(userProfile);
    localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(userProfile));
    const targets = getNutritionTargets(userProfile);
    setNutritionTargets(targets);
  }, []);

  const refreshProfile = useCallback(async () => {
    await fetchAndCacheProfile();
  }, [fetchAndCacheProfile]);

  return (
    <AuthContext.Provider value={{
      ...state, login, register, logout, updateUser,
      profile, nutritionTargets, updateProfile, refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
