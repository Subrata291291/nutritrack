import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from './utils/test-utils';
import { SettingsPage } from '@features/settings/pages/SettingsPage';
import { userService } from '@services/user.service';
import { authService } from '@services/auth.service';

vi.mock('@services/user.service', () => ({
  userService: {
    getProfile: vi.fn(),
    getSettings: vi.fn(),
    updateSettings: vi.fn(),
    updateProfile: vi.fn(),
    changePassword: vi.fn(),
    uploadAvatar: vi.fn(),
  },
}));

vi.mock('@services/auth.service', () => ({
  authService: {
    getStoredAuth: vi.fn(),
    logout: vi.fn(),
  },
}));

const mockProfile = {
  displayName: 'Test User',
  avatar: '',
  age: 30,
  gender: 'male',
  heightCm: 175,
  weightKg: 80,
  activityLevel: 'moderately-active',
  goal: 'maintain',
  targetWeightKg: 75,
};

const mockNutritionTargets = { calories: 2200, proteinGrams: 165, carbsGrams: 220, fatsGrams: 73, waterMl: 2500 };

const mockUseAuth = vi.hoisted(() => vi.fn());
const mockUseProfile = vi.hoisted(() => vi.fn());
vi.mock('@hooks/useAuth', () => ({ useAuth: mockUseAuth }));
vi.mock('@hooks/useProfile', () => ({ useProfile: mockUseProfile }));

const mockSettings = { theme: 'light', notifications: true, units: 'metric' };

const defaultAuth = {
  user: { email: 'test@example.com', displayName: 'Test User', membership: 'free' as const },
  token: 'test-token',
  isAuthenticated: true,
  isLoading: false,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
  updateUser: vi.fn(),
  profile: mockProfile,
  nutritionTargets: mockNutritionTargets,
  updateProfile: vi.fn(),
  refreshProfile: vi.fn(),
};

const defaultProfile = {
  profile: mockProfile,
  nutritionTargets: mockNutritionTargets,
  ensureProfile: vi.fn().mockResolvedValue(undefined),
  refreshProfile: vi.fn().mockResolvedValue(undefined),
  updateProfile: vi.fn(),
};

describe('SettingsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue(defaultAuth);
    mockUseProfile.mockReturnValue(defaultProfile);
    vi.mocked(userService.getProfile).mockResolvedValue(mockProfile);
    vi.mocked(userService.getSettings).mockResolvedValue(mockSettings);
    vi.mocked(userService.updateSettings).mockResolvedValue(undefined);
  });

  it('renders loading state initially', () => {
    vi.mocked(userService.getSettings).mockImplementation(() => new Promise(() => {}));
    renderWithProviders(<SettingsPage />);
    expect(screen.getByText('Loading settings...')).toBeInTheDocument();
  });

  it('renders user display name after loading', async () => {
    renderWithProviders(<SettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });
  });

  it('renders user email', async () => {
    renderWithProviders(<SettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  it('renders Account section with Personal Info and Password rows', async () => {
    renderWithProviders(<SettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('Account')).toBeInTheDocument();
      expect(screen.getByText('Personal Info')).toBeInTheDocument();
      expect(screen.getByText('Password & Security')).toBeInTheDocument();
    });
  });

  it('renders Preferences section with Notifications, Units, and Theme', async () => {
    renderWithProviders(<SettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('Preferences')).toBeInTheDocument();
      expect(screen.getByText('Notifications')).toBeInTheDocument();
      expect(screen.getByText('Units')).toBeInTheDocument();
      expect(screen.getByText('Theme')).toBeInTheDocument();
    });
  });

  it('renders Health & Goals section', async () => {
    renderWithProviders(<SettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('Health & Goals')).toBeInTheDocument();
      expect(screen.getByText('TDEE Settings')).toBeInTheDocument();
      expect(screen.getByText('Goal Type')).toBeInTheDocument();
      expect(screen.getByText('Macro Targets')).toBeInTheDocument();
    });
  });

  it('renders Support & Legal section', async () => {
    renderWithProviders(<SettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('Support & Legal')).toBeInTheDocument();
      expect(screen.getByText('Help Center')).toBeInTheDocument();
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
      expect(screen.getByText('About')).toBeInTheDocument();
    });
  });

  it('renders notification toggle with aria-checked=true', async () => {
    renderWithProviders(<SettingsPage />);
    await waitFor(() => {
      const toggle = screen.getByRole('switch');
      expect(toggle).toBeInTheDocument();
      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });
  });

  it('renders units select defaulting to Metric', async () => {
    renderWithProviders(<SettingsPage />);
    await waitFor(() => {
      expect(screen.getByDisplayValue('Metric')).toBeInTheDocument();
    });
  });

  it('renders theme select defaulting to Light', async () => {
    renderWithProviders(<SettingsPage />);
    await waitFor(() => {
      expect(screen.getByDisplayValue('Light')).toBeInTheDocument();
    });
  });

  it('toggles notifications when switch clicked', async () => {
    const { user } = renderWithProviders(<SettingsPage />);
    await waitFor(() => expect(screen.getByRole('switch')).toBeInTheDocument());
    await user.click(screen.getByRole('switch'));
    await waitFor(() => {
      expect(userService.updateSettings).toHaveBeenCalledWith(
        expect.objectContaining({ notifications: false })
      );
    });
  });

  it('shows success feedback when settings saved', async () => {
    const { user } = renderWithProviders(<SettingsPage />);
    await waitFor(() => expect(screen.getByRole('switch')).toBeInTheDocument());
    await user.click(screen.getByRole('switch'));
    await waitFor(() => {
      expect(screen.getByText('Settings saved.')).toBeInTheDocument();
    });
  });

  it('shows error feedback when save fails', async () => {
    vi.mocked(userService.updateSettings).mockRejectedValue(new Error('fail'));
    const { user } = renderWithProviders(<SettingsPage />);
    await waitFor(() => expect(screen.getByRole('switch')).toBeInTheDocument());
    await user.click(screen.getByRole('switch'));
    await waitFor(() => {
      expect(screen.getByText('Failed to save settings.')).toBeInTheDocument();
    });
  });

  it('opens Personal Info modal', async () => {
    const { user } = renderWithProviders(<SettingsPage />);
    await waitFor(() => expect(screen.getByText('Personal Info')).toBeInTheDocument());
    await user.click(screen.getByText('Personal Info'));
    await waitFor(() => {
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
    });
  });

  it('saves personal info from modal', async () => {
    vi.mocked(userService.updateProfile).mockResolvedValue(mockProfile);
    const { user } = renderWithProviders(<SettingsPage />);
    await waitFor(() => expect(screen.getByText('Personal Info')).toBeInTheDocument());
    await user.click(screen.getByText('Personal Info'));
    await waitFor(() => expect(screen.getByText('Save Changes')).toBeInTheDocument());
    await user.click(screen.getByText('Save Changes'));
    await waitFor(() => {
      expect(userService.updateProfile).toHaveBeenCalledWith(
        expect.objectContaining({ displayName: 'Test User' })
      );
    });
  });

  it('opens Change Password modal', async () => {
    const { user } = renderWithProviders(<SettingsPage />);
    await waitFor(() => expect(screen.getByText('Password & Security')).toBeInTheDocument());
    await user.click(screen.getByText('Password & Security'));
    await waitFor(() => {
      expect(screen.getByText('Update Password')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Min. 6 characters')).toBeInTheDocument();
    });
  });

  it('shows password mismatch error', async () => {
    const { user } = renderWithProviders(<SettingsPage />);
    await waitFor(() => expect(screen.getByText('Password & Security')).toBeInTheDocument());
    await user.click(screen.getByText('Password & Security'));
    await waitFor(() => expect(screen.getByText('Update Password')).toBeInTheDocument());
    const inputs = screen.getAllByPlaceholderText(/min|re-enter/i);
    await user.type(inputs[0], 'abc123');
    await user.type(inputs[1], 'different');
    await user.click(screen.getByText('Update Password'));
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    });
  });

  it('opens TDEE modal', async () => {
    const { user } = renderWithProviders(<SettingsPage />);
    await waitFor(() => expect(screen.getByText('TDEE Settings')).toBeInTheDocument());
    await user.click(screen.getByText('TDEE Settings'));
    await waitFor(() => {
      expect(screen.getByText('Edit in Profile Metrics')).toBeInTheDocument();
    });
  });

  it('renders logout button', async () => {
    renderWithProviders(<SettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });
  });

  it('shows Upgrade to Pro for free users', async () => {
    renderWithProviders(<SettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('Upgrade to NutriTrack Pro')).toBeInTheDocument();
      expect(screen.getByText('Free')).toBeInTheDocument();
    });
  });

  it('shows Premium User badge for pro users', async () => {
    mockUseAuth.mockReturnValue({
      ...defaultAuth,
      user: { email: 'pro@test.com', displayName: 'Pro User', membership: 'pro' as const },
    });
    renderWithProviders(<SettingsPage />);
    await waitFor(() => {
      expect(screen.getByText('Premium User')).toBeInTheDocument();
    });
  });

  it('changes units via select', async () => {
    const { user } = renderWithProviders(<SettingsPage />);
    await waitFor(() => expect(screen.getByDisplayValue('Metric')).toBeInTheDocument());
    await user.selectOptions(screen.getByDisplayValue('Metric'), 'imperial');
    await waitFor(() => {
      expect(userService.updateSettings).toHaveBeenCalledWith(
        expect.objectContaining({ units: 'imperial' })
      );
    });
  });
});
