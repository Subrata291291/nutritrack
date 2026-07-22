export interface User {
  id: number;
  email: string;
  displayName: string;
  avatar?: string;
  membership?: 'free' | 'pro' | 'team';
  onboardingCompleted?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
}
