import { createContext } from 'react';
import type { AuthState, LoginCredentials, RegisterCredentials, User } from 'types/index';
import type { UserProfile } from 'types/settings';
import type { NutritionTargets } from 'types/nutrition';

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
  profile: UserProfile | null;
  nutritionTargets: NutritionTargets | null;
  updateProfile: (profile: UserProfile) => void;
  refreshProfile: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
