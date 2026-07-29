import { describe, it, expect, vi, beforeAll, afterAll, afterEach } from 'vitest';
import { screen, waitFor, act } from '@testing-library/react';
import { renderHook } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { Route, Routes } from 'react-router-dom';
import { renderWithProviders, createWrapper } from './utils/test-utils';
import { LoginPage } from '@features/auth/pages/LoginPage';
import { RegisterPage } from '@features/auth/pages/RegisterPage';
import { ForgotPasswordPage } from '@features/auth/pages/ForgotPasswordPage';
import { ProtectedRoute } from '@components/layout/ProtectedRoute';
import { authService } from '@services/auth.service';
import { useAuth } from '@hooks/useAuth';
import { AuthProvider } from '@contexts/AuthProvider';
import { AuthContext } from '@contexts/AuthContext';
import type { AuthContextValue } from '@contexts/AuthContext';
import { handlers } from './mocks/handlers';
import { mockUserProfile } from './mocks/data';

const server = setupServer(...handlers);

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
  vi.stubEnv('VITE_WP_API_URL', 'https://test-site.com/wp-json');
});

afterAll(() => {
  server.close();
  vi.unstubAllEnvs();
});

afterEach(() => {
  server.resetHandlers();
  localStorage.clear();
});

describe('authService', () => {
  it('login calls API and stores auth in localStorage', async () => {
    const result = await authService.login({ email: 'test@example.com', password: 'password123' });

    expect(result.isAuthenticated).toBe(true);
    expect(result.token).toBe('mock-jwt-token');
    expect(result.user).toBeDefined();
    expect(result.user!.email).toBe('test@example.com');
    expect(result.user!.displayName).toBe('Test User');
    expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token');
    expect(localStorage.getItem('auth_user')).toBeTruthy();
  });

  it('register calls API then login and stores auth', async () => {
    const result = await authService.register({
      email: 'new@example.com',
      password: 'password123',
      displayName: 'New User',
    });

    expect(result.isAuthenticated).toBe(true);
    expect(result.token).toBe('mock-jwt-token');
    expect(localStorage.getItem('auth_token')).toBe('mock-jwt-token');
  });

  it('logout clears localStorage and redirects', () => {
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('auth_user', JSON.stringify({ id: 1, email: 'test@test.com', displayName: 'Test' }));

    const originalLocation = window.location;
    Object.defineProperty(window, 'location', {
      value: { href: '' },
      writable: true,
      configurable: true,
    });

    authService.logout();

    expect(localStorage.getItem('auth_token')).toBeNull();
    expect(localStorage.getItem('auth_user')).toBeNull();
    expect(window.location.href).toContain('/login');

    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
      configurable: true,
    });
  });

  it('getStoredAuth returns null when no auth stored', () => {
    expect(authService.getStoredAuth()).toBeNull();
  });

  it('getStoredAuth returns AuthState when auth is stored', () => {
    const user = { id: 1, email: 'test@test.com', displayName: 'Test' };
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('auth_user', JSON.stringify(user));

    const result = authService.getStoredAuth();

    expect(result).not.toBeNull();
    expect(result!.isAuthenticated).toBe(true);
    expect(result!.token).toBe('test-token');
    expect(result!.user).toEqual(user);
  });

  it('getStoredAuth returns null when auth_user is invalid JSON', () => {
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('auth_user', 'not-json');

    expect(authService.getStoredAuth()).toBeNull();
  });
});

describe('LoginPage', () => {
  it('renders the login form with all elements', () => {
    renderWithProviders(<LoginPage />, { initialEntries: ['/login'] });

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Enter your credentials to continue')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByText('Remember me')).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText('Create one')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const { user } = renderWithProviders(<LoginPage />, { initialEntries: ['/login'] });

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('successful login navigates to onboarding when not completed', async () => {
    const { user } = renderWithProviders(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<div>Onboarding Page</div>} />
      </Routes>,
      { initialEntries: ['/login'] },
    );

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Onboarding Page')).toBeInTheDocument();
    });
  });

  it('successful login navigates to dashboard when onboarding completed', async () => {
    server.use(
      http.get('https://test-site.com/wp-json/nutritrack/v1/user/profile', () => {
        return HttpResponse.json({
          success: true,
          data: { ...mockUserProfile, onboardingCompleted: true },
        });
      }),
    );

    const { user } = renderWithProviders(
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        <Route path="/onboarding" element={<div>Onboarding Page</div>} />
      </Routes>,
      { initialEntries: ['/login'] },
    );

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });
  });

  it('failed login shows error message', async () => {
    server.use(
      http.post('https://test-site.com/wp-json/jwt-auth/v1/token', () => {
        return new HttpResponse(null, { status: 401 });
      }),
    );

    const { user } = renderWithProviders(<LoginPage />, { initialEntries: ['/login'] });

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email or password. Please try again.')).toBeInTheDocument();
    });
  });

  it('shows loading spinner on button while logging in', async () => {
    server.use(
      http.post('https://test-site.com/wp-json/jwt-auth/v1/token', async () => {
        await new Promise((r) => setTimeout(r, 500));
        return HttpResponse.json({
          token: 'mock-jwt-token',
          user_email: 'test@example.com',
          user_display_name: 'Test User',
          user_id: 1,
        });
      }),
    );

    const { user } = renderWithProviders(<LoginPage />, { initialEntries: ['/login'] });

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    const button = screen.getByRole('button', { name: /sign in/i });
    const spinner = button.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});

describe('RegisterPage', () => {
  it('renders the registration form with all elements', () => {
    renderWithProviders(<RegisterPage />, { initialEntries: ['/register'] });

    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByText('Fill in your details to get started')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByText(/I agree to the/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('shows validation errors when submitting empty form', async () => {
    const { user } = renderWithProviders(<RegisterPage />, { initialEntries: ['/register'] });

    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText('Name must be at least 2 characters')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });
  });

  it('shows terms error when terms not agreed', async () => {
    const { user } = renderWithProviders(<RegisterPage />, { initialEntries: ['/register'] });

    await user.type(screen.getByLabelText('Full Name'), 'Test User');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password123');
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText(/Please agree to the Terms of Service/)).toBeInTheDocument();
    });
  });

  it('successful registration navigates to onboarding', async () => {
    const { user } = renderWithProviders(
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<div>Onboarding Page</div>} />
      </Routes>,
      { initialEntries: ['/register'] },
    );

    await user.type(screen.getByLabelText('Full Name'), 'Test User');
    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password123');

    await user.click(screen.getByText(/I agree to the/));
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText('Onboarding Page')).toBeInTheDocument();
    });
  });

  it('failed registration shows error message', async () => {
    server.use(
      http.post('https://test-site.com/wp-json/nutritrack/v1/auth/register', () => {
        return new HttpResponse(null, { status: 409 });
      }),
    );

    const { user } = renderWithProviders(<RegisterPage />, { initialEntries: ['/register'] });

    await user.type(screen.getByLabelText('Full Name'), 'Test User');
    await user.type(screen.getByLabelText('Email'), 'existing@example.com');
    await user.type(screen.getByLabelText('Password'), 'password123');
    await user.type(screen.getByLabelText('Confirm Password'), 'password123');
    await user.click(screen.getByText(/I agree to the/));
    await user.click(screen.getByRole('button', { name: /create account/i }));

    await waitFor(() => {
      expect(screen.getByText('Registration failed. This email may already be in use.')).toBeInTheDocument();
    });
  });
});

describe('ForgotPasswordPage', () => {
  it('renders the forgot password form', () => {
    renderWithProviders(<ForgotPasswordPage />, { initialEntries: ['/forgot-password'] });

    expect(screen.getByText('Reset your password')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
    expect(screen.getByText('Remember your password?')).toBeInTheDocument();
    expect(screen.getByText('Sign in')).toBeInTheDocument();
  });

  it('shows success state after submitting email', async () => {
    server.use(
      http.post('https://test-site.com/wp-login.php', () => {
        return new HttpResponse(null, { status: 200 });
      }),
    );

    const { user } = renderWithProviders(<ForgotPasswordPage />, { initialEntries: ['/forgot-password'] });

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText('Check your email')).toBeInTheDocument();
      expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
      expect(screen.getByText('Back to sign in')).toBeInTheDocument();
    });
  });

  it('shows error when email not found', async () => {
    server.use(
      http.post('https://test-site.com/wp-login.php', () => {
        return new HttpResponse(null, { status: 404 });
      }),
    );

    const { user } = renderWithProviders(<ForgotPasswordPage />, { initialEntries: ['/forgot-password'] });

    await user.type(screen.getByLabelText('Email'), 'unknown@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText('Could not find an account with that email address.')).toBeInTheDocument();
    });
  });

  it('shows error on network failure', async () => {
    server.use(
      http.post('https://test-site.com/wp-login.php', () => {
        return HttpResponse.error();
      }),
    );

    const { user } = renderWithProviders(<ForgotPasswordPage />, { initialEntries: ['/forgot-password'] });

    await user.type(screen.getByLabelText('Email'), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText('Something went wrong. Please try again.')).toBeInTheDocument();
    });
  });
});

describe('ProtectedRoute', () => {
  it('redirects to login when unauthenticated', () => {
    renderWithProviders(
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Protected Dashboard</div>} />
        </Route>
      </Routes>,
      { initialEntries: ['/dashboard'] },
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders children when authenticated and onboarding completed', () => {
    localStorage.setItem('auth_token', 'mock-test-token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ id: 1, email: 'test@example.com', displayName: 'Test User', onboardingCompleted: true }),
    );
    localStorage.setItem('onboarding_completed', 'true');

    renderWithProviders(
      <Routes>
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Protected Dashboard</div>} />
        </Route>
      </Routes>,
      { initialEntries: ['/dashboard'] },
    );

    expect(screen.getByText('Protected Dashboard')).toBeInTheDocument();
  });

  it('redirects to onboarding when authenticated but onboarding not completed', () => {
    localStorage.setItem('auth_token', 'mock-test-token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ id: 1, email: 'test@example.com', displayName: 'Test User' }),
    );

    renderWithProviders(
      <Routes>
        <Route path="/onboarding" element={<div>Onboarding Page</div>} />
        <Route path="/login" element={<div>Login Page</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<div>Protected Dashboard</div>} />
        </Route>
      </Routes>,
      { initialEntries: ['/dashboard'] },
    );

    expect(screen.getByText('Onboarding Page')).toBeInTheDocument();
  });

  it('shows loading spinner when isLoading', () => {
    const mockContext: AuthContextValue = {
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,
      login: vi.fn(),
      register: vi.fn(),
      logout: vi.fn(),
      updateUser: vi.fn(),
    };

    renderWithProviders(
      <AuthContext.Provider value={mockContext}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<div>Home</div>} />
          </Route>
        </Routes>
      </AuthContext.Provider>,
      { withAuth: false, initialEntries: ['/'] },
    );

    const spinner = document.querySelector('svg.animate-spin');
    expect(spinner).toBeInTheDocument();
  });
});

describe('useAuth', () => {
  it('returns auth state from context', () => {
    const wrapper = createWrapper();

    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.logout).toBe('function');
    expect(typeof result.current.updateUser).toBe('function');
  });

  it('throws error when used outside AuthProvider', () => {
    expect(() => {
      renderHook(() => useAuth(), { wrapper: createWrapper({ withAuth: false }) });
    }).toThrow('useAuth must be used within an AuthProvider');
  });

  it('login updates state to authenticated', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password123' });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.token).toBe('mock-jwt-token');
    expect(result.current.user).toBeDefined();
    expect(result.current.user!.email).toBe('test@example.com');
  });

  it('isLoading is true during login', async () => {
    server.use(
      http.post('https://test-site.com/wp-json/jwt-auth/v1/token', async () => {
        await new Promise((r) => setTimeout(r, 200));
        return HttpResponse.json({
          token: 'mock-jwt-token',
          user_email: 'test@example.com',
          user_display_name: 'Test User',
          user_id: 1,
        });
      }),
    );

    const wrapper = createWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper });

    let loginPromise: Promise<void>;
    act(() => {
      loginPromise = result.current.login({ email: 'test@example.com', password: 'password123' });
    });
    expect(result.current.isLoading).toBe(true);
    await act(async () => {
      await loginPromise;
    });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('register updates state to authenticated', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.register({
        email: 'new@example.com',
        password: 'password123',
        displayName: 'New User',
      });
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.isLoading).toBe(false);
  });

  it('logout clears auth state', async () => {
    localStorage.setItem('auth_token', 'mock-jwt-token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ id: 1, email: 'test@example.com', displayName: 'Test User' }),
    );

    const wrapper = createWrapper();
    const { result } = renderHook(() => useAuth(), { wrapper });

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
    expect(result.current.token).toBeNull();
  });
});

describe('AuthProvider', () => {
  it('provides auth context to children', () => {
    function TestComponent() {
      const auth = useAuth();
      return <div data-testid="auth-state">{auth.isAuthenticated ? 'authenticated' : 'unauthenticated'}</div>;
    }

    renderWithProviders(<TestComponent />);

    expect(screen.getByTestId('auth-state')).toHaveTextContent('unauthenticated');
  });

  it('initializes from localStorage when auth data exists', () => {
    localStorage.setItem('auth_token', 'stored-token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ id: 1, email: 'stored@example.com', displayName: 'Stored User' }),
    );

    function TestComponent() {
      const auth = useAuth();
      return (
        <div>
          <span data-testid="auth-status">{auth.isAuthenticated ? 'authenticated' : 'unauthenticated'}</span>
          <span data-testid="auth-email">{auth.user?.email}</span>
          <span data-testid="auth-token">{auth.token}</span>
        </div>
      );
    }

    renderWithProviders(<TestComponent />);

    expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated');
    expect(screen.getByTestId('auth-email')).toHaveTextContent('stored@example.com');
    expect(screen.getByTestId('auth-token')).toHaveTextContent('stored-token');
  });

  it('updateUser updates user in context and localStorage', async () => {
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem(
      'auth_user',
      JSON.stringify({ id: 1, email: 'test@example.com', displayName: 'Test User' }),
    );

    function TestComponent() {
      const auth = useAuth();
      return (
        <div>
          <span data-testid="display-name">{auth.user?.displayName}</span>
          <button
            onClick={() =>
              auth.updateUser({ id: 1, email: 'test@example.com', displayName: 'Updated User' })
            }
          >
            Update
          </button>
        </div>
      );
    }

    const { user } = renderWithProviders(<TestComponent />);

    expect(screen.getByTestId('display-name')).toHaveTextContent('Test User');

    await user.click(screen.getByText('Update'));

    expect(screen.getByTestId('display-name')).toHaveTextContent('Updated User');
    expect(JSON.parse(localStorage.getItem('auth_user')!).displayName).toBe('Updated User');
  });
});
