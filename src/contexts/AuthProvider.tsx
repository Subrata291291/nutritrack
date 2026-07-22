import { useState, useCallback, type ReactNode } from 'react';
import type { AuthState, LoginCredentials, RegisterCredentials, User } from 'types/index';
import { authService } from '@services/auth.service';
import { AuthContext } from './AuthContext';

function getInitialState(): AuthState {
  const stored = authService.getStoredAuth();
  if (stored) {
    return { ...stored, isLoading: false };
  }
  return { user: null, token: null, isAuthenticated: false, isLoading: false };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(getInitialState);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const authState = await authService.login(credentials);
      setState(authState);
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const authState = await authService.register(credentials);
      setState(authState);
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  }, []);

  const updateUser = useCallback((user: User) => {
    setState((prev) => ({ ...prev, user }));
    localStorage.setItem('auth_user', JSON.stringify(user));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
