import { renderWithProviders } from '../test/utils/test-utils';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StepActivity } from '@features/onboarding/components/StepActivity';
import { StepGoals } from '@features/onboarding/components/StepGoals';
import { StepMetrics } from '@features/onboarding/components/StepMetrics';
import { StepResults } from '@features/onboarding/components/StepResults';
import { PreferenceForm } from '@features/onboarding/components/PreferenceForm';
import { OnboardingPage } from '@features/onboarding/pages/OnboardingPage';
import type { TDEEInfo } from 'types/onboarding';

vi.mock('@hooks/useOnboarding', () => ({
  useOnboarding: vi.fn(),
}));

import { useOnboarding } from '@hooks/useOnboarding';

const mockTDEEInfo: TDEEInfo = {
  tdee: 2200,
  bmr: 1800,
  targetCalories: 2200,
  proteinGrams: 165,
  carbsGrams: 220,
  fatsGrams: 73,
};

function createMockOnboarding(overrides: Record<string, unknown> = {}) {
  return {
    data: {},
    tdeeInfo: null,
    currentStep: 1,
    submitting: false,
    submitError: null,
    setMetrics: vi.fn(),
    setActivityLevel: vi.fn(),
    setGoal: vi.fn(),
    setPreferences: vi.fn(),
    nextStep: vi.fn(),
    prevStep: vi.fn(),
    goToStep: vi.fn(),
    calculateResults: vi.fn(),
    reset: vi.fn(),
    submitToApi: vi.fn(),
    ...overrides,
  };
}

describe('StepActivity', () => {
  const onNext = vi.fn();
  const onBack = vi.fn();
  const setActivityLevel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({ setActivityLevel })
    );
  });

  it('renders all 4 activity options with titles', () => {
    renderWithProviders(<StepActivity onNext={onNext} onBack={onBack} />);
    expect(screen.getByText('Sedentary')).toBeInTheDocument();
    expect(screen.getByText('Lightly Active')).toBeInTheDocument();
    expect(screen.getByText('Moderately Active')).toBeInTheDocument();
    expect(screen.getByText('Very Active')).toBeInTheDocument();
  });

  it('renders descriptions for each activity option', () => {
    renderWithProviders(<StepActivity onNext={onNext} onBack={onBack} />);
    expect(screen.getByText('Typical office job, little to no exercise.')).toBeInTheDocument();
    expect(screen.getByText('Light exercise or sports 1-3 days a week.')).toBeInTheDocument();
    expect(screen.getByText('Moderate exercise or sports 3-5 days a week.')).toBeInTheDocument();
    expect(screen.getByText('Hard exercise or sports 6-7 days a week.')).toBeInTheDocument();
  });

  it('calls setActivityLevel on option click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<StepActivity onNext={onNext} onBack={onBack} />);
    await user.click(screen.getByText('Lightly Active'));
    expect(setActivityLevel).toHaveBeenCalledWith('lightly-active');
  });

  it('shows selected state on clicked option', async () => {
    const user = userEvent.setup();
    renderWithProviders(<StepActivity onNext={onNext} onBack={onBack} />);
    await user.click(screen.getByText('Moderately Active'));
    const buttons = screen.getAllByRole('button');
    const activeButton = buttons.find((b) => b.className.includes('border-primary'));
    expect(activeButton).toBeTruthy();
  });

  it('Continue button is disabled when no option selected', () => {
    renderWithProviders(<StepActivity onNext={onNext} onBack={onBack} />);
    const continueBtn = screen.getByText('Continue').closest('button');
    expect(continueBtn).toBeDisabled();
  });

  it('Continue button is enabled after selecting an option', async () => {
    const user = userEvent.setup();
    renderWithProviders(<StepActivity onNext={onNext} onBack={onBack} />);
    await user.click(screen.getByText('Sedentary'));
    const continueBtn = screen.getByText('Continue').closest('button');
    expect(continueBtn).not.toBeDisabled();
  });

  it('calls onNext when Continue is clicked after selection', async () => {
    const user = userEvent.setup();
    renderWithProviders(<StepActivity onNext={onNext} onBack={onBack} />);
    await user.click(screen.getByText('Very Active'));
    await user.click(screen.getByText('Continue'));
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('calls onBack when Back button is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<StepActivity onNext={onNext} onBack={onBack} />);
    await user.click(screen.getByText('Back'));
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it('renders Skip button', () => {
    renderWithProviders(<StepActivity onNext={onNext} onBack={onBack} />);
    expect(screen.getByText('Skip')).toBeInTheDocument();
  });
});

describe('StepGoals', () => {
  const onNext = vi.fn();
  const onBack = vi.fn();
  const setGoal = vi.fn();
  const calculateResults = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({ setGoal, calculateResults })
    );
  });

  it('renders all 3 goal options with titles', () => {
    renderWithProviders(<StepGoals onNext={onNext} onBack={onBack} />);
    expect(screen.getByText('Lose Weight')).toBeInTheDocument();
    expect(screen.getByText('Maintain Weight')).toBeInTheDocument();
    expect(screen.getByText('Gain Muscle')).toBeInTheDocument();
  });

  it('renders descriptions for each goal', () => {
    renderWithProviders(<StepGoals onNext={onNext} onBack={onBack} />);
    expect(screen.getByText('Shed body fat and improve cardiovascular health.')).toBeInTheDocument();
    expect(screen.getByText('Focus on nutrition and stability.')).toBeInTheDocument();
    expect(screen.getByText('Build strength and increase athletic performance.')).toBeInTheDocument();
  });

  it('calls setGoal when a goal option is selected', async () => {
    const user = userEvent.setup();
    renderWithProviders(<StepGoals onNext={onNext} onBack={onBack} />);
    await user.click(screen.getByText('Lose Weight'));
    expect(setGoal).toHaveBeenCalledWith('lose-weight', undefined);
  });

  it('renders target weight input field', () => {
    renderWithProviders(<StepGoals onNext={onNext} onBack={onBack} />);
    const input = screen.getByPlaceholderText('00.0');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'number');
  });

  it('calls setGoal with target weight when weight is entered', async () => {
    const user = userEvent.setup();
    renderWithProviders(<StepGoals onNext={onNext} onBack={onBack} />);
    await user.click(screen.getByText('Gain Muscle'));
    const input = screen.getByPlaceholderText('00.0');
    await user.clear(input);
    await user.type(input, '75');
    expect(setGoal).toHaveBeenCalledWith('gain-muscle', 75);
  });

  it('Complete Profile button is disabled when no goal is selected', () => {
    renderWithProviders(<StepGoals onNext={onNext} onBack={onBack} />);
    const completeBtn = screen.getByText('Complete Profile').closest('button');
    expect(completeBtn).toBeDisabled();
  });

  it('Complete Profile button is enabled after goal selection', async () => {
    const user = userEvent.setup();
    renderWithProviders(<StepGoals onNext={onNext} onBack={onBack} />);
    await user.click(screen.getByText('Maintain Weight'));
    const completeBtn = screen.getByText('Complete Profile').closest('button');
    expect(completeBtn).not.toBeDisabled();
  });

  it('calls calculateResults and onNext on Complete Profile click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<StepGoals onNext={onNext} onBack={onBack} />);
    await user.click(screen.getByText('Maintain Weight'));
    await user.click(screen.getByText('Complete Profile'));
    expect(calculateResults).toHaveBeenCalledTimes(1);
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('renders Back button', () => {
    renderWithProviders(<StepGoals onNext={onNext} onBack={onBack} />);
    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});

describe('StepMetrics', () => {
  const onNext = vi.fn();
  let setMetrics: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    setMetrics = vi.fn();
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({ setMetrics })
    );
  });

  it('renders all form fields', () => {
    renderWithProviders(<StepMetrics onNext={onNext} />);
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
    expect(screen.getByLabelText('Height (cm)')).toBeInTheDocument();
    expect(screen.getByLabelText('Weight (kg)')).toBeInTheDocument();
  });

  it('renders gender options', () => {
    renderWithProviders(<StepMetrics onNext={onNext} />);
    const genderSelect = screen.getByLabelText('Gender');
    expect(genderSelect).toBeInTheDocument();
    expect(screen.getByText('Male')).toBeInTheDocument();
    expect(screen.getByText('Female')).toBeInTheDocument();
    expect(screen.getByText('Non-binary')).toBeInTheDocument();
    expect(screen.getByText('Prefer not to say')).toBeInTheDocument();
  });

  it('shows validation error when age is below minimum', async () => {
    const user = userEvent.setup();
    renderWithProviders(<StepMetrics onNext={onNext} />);
    await user.type(screen.getByLabelText('Age'), '10');
    await user.click(screen.getByText('Continue'));
    expect(await screen.findByText('Must be at least 13')).toBeInTheDocument();
  });

  it('shows validation error when height is below minimum', async () => {
    const user = userEvent.setup();
    renderWithProviders(<StepMetrics onNext={onNext} />);
    await user.type(screen.getByLabelText('Age'), '25');
    await user.type(screen.getByLabelText('Height (cm)'), '50');
    await user.click(screen.getByText('Continue'));
    expect(await screen.findByText('Must be at least 100cm')).toBeInTheDocument();
  });

  it('shows validation error when weight is below minimum', async () => {
    const user = userEvent.setup();
    renderWithProviders(<StepMetrics onNext={onNext} />);
    await user.type(screen.getByLabelText('Age'), '25');
    await user.type(screen.getByLabelText('Height (cm)'), '170');
    await user.type(screen.getByLabelText('Weight (kg)'), '5');
    await user.click(screen.getByText('Continue'));
    expect(await screen.findByText('Must be at least 20kg')).toBeInTheDocument();
  });

  it('calls setMetrics and onNext on valid submission', async () => {
    const user = userEvent.setup();
    renderWithProviders(<StepMetrics onNext={onNext} />);
    await user.type(screen.getByLabelText('Age'), '28');
    await user.selectOptions(screen.getByLabelText('Gender'), 'male');
    await user.type(screen.getByLabelText('Height (cm)'), '180');
    await user.type(screen.getByLabelText('Weight (kg)'), '75');
    await user.click(screen.getByText('Continue'));
    await waitFor(() => {
      expect(setMetrics).toHaveBeenCalledWith({
        age: 28,
        gender: 'male',
        heightCm: 180,
        weightKg: 75,
      });
    });
    expect(onNext).toHaveBeenCalledTimes(1);
  });
});

describe('StepResults', () => {
  const submitToApi = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({
        tdeeInfo: mockTDEEInfo,
        data: {
          preferences: {
            diet: 'vegetarian',
            allergies: ['peanuts', 'soy'],
            cuisine: 'indian',
            cookingSkill: 'intermediate',
            budget: 50,
          },
        },
        submitToApi,
      })
    );
  });

  it('renders the personalized plan heading', () => {
    renderWithProviders(<StepResults />);
    expect(screen.getByText('Your personalized plan is ready!')).toBeInTheDocument();
  });

  it('renders target calories', () => {
    renderWithProviders(<StepResults />);
    expect(screen.getByText('2200')).toBeInTheDocument();
    expect(screen.getByText('KCAL / DAY')).toBeInTheDocument();
  });

  it('renders TDEE label', () => {
    renderWithProviders(<StepResults />);
    expect(screen.getByText('Total Daily Energy Expenditure')).toBeInTheDocument();
  });

  it('renders macro breakdown', () => {
    renderWithProviders(<StepResults />);
    expect(screen.getByText('Proteins')).toBeInTheDocument();
    expect(screen.getByText('Carbs')).toBeInTheDocument();
    expect(screen.getByText('Fats')).toBeInTheDocument();
    expect(screen.getByText('165g / day')).toBeInTheDocument();
    expect(screen.getByText('220g / day')).toBeInTheDocument();
    expect(screen.getByText('73g / day')).toBeInTheDocument();
  });

  it('renders macro percentages', () => {
    renderWithProviders(<StepResults />);
    const percents = screen.getAllByText(/(30|40)%/);
    expect(percents.length).toBeGreaterThanOrEqual(2);
  });

  it('renders preferences section with diet, allergies, cuisine', () => {
    renderWithProviders(<StepResults />);
    expect(screen.getByText('Your Preferences')).toBeInTheDocument();
    expect(screen.getByText('vegetarian')).toBeInTheDocument();
    expect(screen.getByText('peanuts, soy')).toBeInTheDocument();
    expect(screen.getByText('indian')).toBeInTheDocument();
    expect(screen.getByText('intermediate')).toBeInTheDocument();
    expect(screen.getByText('$50')).toBeInTheDocument();
  });

  it('shows "Not specified" when no preferences are set', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({
        tdeeInfo: mockTDEEInfo,
        data: {},
      })
    );
    renderWithProviders(<StepResults />);
    const notSpecified = screen.getAllByText('Not specified');
    expect(notSpecified.length).toBeGreaterThanOrEqual(3);
    expect(screen.getByText('None')).toBeInTheDocument();
  });

  it('renders Start Tracking button', () => {
    renderWithProviders(<StepResults />);
    expect(screen.getByText('Start Tracking')).toBeInTheDocument();
  });

  it('calls submitToApi when Start Tracking is clicked', async () => {
    const user = userEvent.setup();
    submitToApi.mockResolvedValue(true);
    renderWithProviders(<StepResults />);
    await user.click(screen.getByText('Start Tracking'));
    expect(submitToApi).toHaveBeenCalledTimes(1);
  });

  it('renders error message when submitError is set', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({
        tdeeInfo: mockTDEEInfo,
        submitError: 'Network error',
      })
    );
    renderWithProviders(<StepResults />);
    expect(screen.getByText('Network error')).toBeInTheDocument();
  });

  it('disables Start Tracking button when submitting', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({
        tdeeInfo: mockTDEEInfo,
        submitting: true,
      })
    );
    renderWithProviders(<StepResults />);
    const buttons = screen.getAllByRole('button');
    const submitBtn = buttons.find((b) => !b.textContent?.includes('Refine'));
    expect(submitBtn).toBeDisabled();
  });

  it('shows loading spinner when submitting', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({
        tdeeInfo: mockTDEEInfo,
        submitting: true,
      })
    );
    renderWithProviders(<StepResults />);
    const svg = document.querySelector('svg.animate-spin');
    expect(svg).toBeInTheDocument();
  });

  it('renders Refine calculations button', () => {
    renderWithProviders(<StepResults />);
    expect(screen.getByText('Refine calculations')).toBeInTheDocument();
  });
});

describe('PreferenceForm', () => {
  const onNext = vi.fn();
  const onBack = vi.fn();
  let setPreferences: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    setPreferences = vi.fn();
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({ setPreferences })
    );
  });

  it('renders diet select with options', () => {
    renderWithProviders(<PreferenceForm onNext={onNext} onBack={onBack} />);
    expect(screen.getByLabelText('Diet')).toBeInTheDocument();
    expect(screen.getByText('None')).toBeInTheDocument();
    expect(screen.getByText('Vegetarian')).toBeInTheDocument();
    expect(screen.getByText('Vegan')).toBeInTheDocument();
    expect(screen.getByText('Keto')).toBeInTheDocument();
    expect(screen.getByText('Paleo')).toBeInTheDocument();
  });

  it('renders preferred cuisine select with options', () => {
    renderWithProviders(<PreferenceForm onNext={onNext} onBack={onBack} />);
    expect(screen.getByLabelText('Preferred Cuisine')).toBeInTheDocument();
    expect(screen.getByText('Indian')).toBeInTheDocument();
    expect(screen.getByText('Chinese')).toBeInTheDocument();
    expect(screen.getByText('Italian')).toBeInTheDocument();
    expect(screen.getByText('Mediterranean')).toBeInTheDocument();
    expect(screen.getByText('Mexican')).toBeInTheDocument();
  });

  it('renders cooking skill select with options', () => {
    renderWithProviders(<PreferenceForm onNext={onNext} onBack={onBack} />);
    expect(screen.getByLabelText('Cooking Skill')).toBeInTheDocument();
    expect(screen.getByText('Beginner')).toBeInTheDocument();
    expect(screen.getByText('Intermediate')).toBeInTheDocument();
    expect(screen.getByText('Advanced')).toBeInTheDocument();
  });

  it('renders budget input', () => {
    renderWithProviders(<PreferenceForm onNext={onNext} onBack={onBack} />);
    const budgetInput = screen.getByLabelText('Daily Budget');
    expect(budgetInput).toBeInTheDocument();
    expect(budgetInput).toHaveAttribute('type', 'number');
  });

  it('renders all allergy checkboxes', () => {
    renderWithProviders(<PreferenceForm onNext={onNext} onBack={onBack} />);
    expect(screen.getByText('Milk')).toBeInTheDocument();
    expect(screen.getByText('Eggs')).toBeInTheDocument();
    expect(screen.getByText('Peanuts')).toBeInTheDocument();
    expect(screen.getByText('Seafood')).toBeInTheDocument();
    expect(screen.getByText('Soy')).toBeInTheDocument();
    expect(screen.getByText('Wheat')).toBeInTheDocument();
    expect(screen.getByText('Tree Nuts')).toBeInTheDocument();
  });

  it('toggles allergy when clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PreferenceForm onNext={onNext} onBack={onBack} />);
    const milkLabel = screen.getByText('Milk');
    await user.click(milkLabel);
    const checkboxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    const milkCheck = checkboxes.find((c) => c.value === 'milk' || c.checked);
    expect(checkboxes.some((c) => c.checked)).toBe(true);
  });

  it('calls setPreferences and onNext on valid submission', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PreferenceForm onNext={onNext} onBack={onBack} />);
    await user.selectOptions(screen.getByLabelText('Diet'), 'vegan');
    await user.selectOptions(screen.getByLabelText('Preferred Cuisine'), 'italian');
    await user.selectOptions(screen.getByLabelText('Cooking Skill'), 'intermediate');
    await user.click(screen.getByText('Continue'));
    await waitFor(() => {
      expect(setPreferences).toHaveBeenCalledWith(
        expect.objectContaining({
          diet: 'vegan',
          cuisine: 'italian',
          cookingSkill: 'intermediate',
          allergies: [],
        })
      );
    });
    expect(onNext).toHaveBeenCalledTimes(1);
  });

  it('includes selected allergies in submission', async () => {
    const user = userEvent.setup();
    renderWithProviders(<PreferenceForm onNext={onNext} onBack={onBack} />);
    await user.selectOptions(screen.getByLabelText('Diet'), 'vegetarian');
    await user.selectOptions(screen.getByLabelText('Preferred Cuisine'), 'mexican');
    await user.selectOptions(screen.getByLabelText('Cooking Skill'), 'beginner');
    await user.click(screen.getByText('Peanuts'));
    await user.click(screen.getByText('Soy'));
    await user.click(screen.getByText('Continue'));
    await waitFor(() => {
      expect(setPreferences).toHaveBeenCalledWith(
        expect.objectContaining({
          diet: 'vegetarian',
          cuisine: 'mexican',
          cookingSkill: 'beginner',
          allergies: ['peanuts', 'soy'],
        })
      );
    });
  });

  it('renders Back button', () => {
    renderWithProviders(<PreferenceForm onNext={onNext} onBack={onBack} />);
    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});

describe('OnboardingPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders step indicator with correct step number at step 1', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({ currentStep: 1 })
    );
    renderWithProviders(<OnboardingPage />);
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
  });

  it('renders correct percentage at each step', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({ currentStep: 1 })
    );
    renderWithProviders(<OnboardingPage />);
    expect(screen.getByText('25%')).toBeInTheDocument();
  });

  it('renders correct percentage at step 2', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({ currentStep: 2 })
    );
    renderWithProviders(<OnboardingPage />);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });

  it('renders correct percentage at step 3', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({ currentStep: 3 })
    );
    renderWithProviders(<OnboardingPage />);
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  it('renders correct percentage at step 4', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({ currentStep: 4 })
    );
    renderWithProviders(<OnboardingPage />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('renders title and description for step 1', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({ currentStep: 1 })
    );
    renderWithProviders(<OnboardingPage />);
    expect(screen.getByText("Let's build your profile")).toBeInTheDocument();
    expect(screen.getByText('This helps us calculate your daily calorie and macro targets.')).toBeInTheDocument();
  });

  it('renders title and description for step 2', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({ currentStep: 2 })
    );
    renderWithProviders(<OnboardingPage />);
    expect(screen.getByText('What is your daily activity level?')).toBeInTheDocument();
  });

  it('renders title and description for step 3', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({ currentStep: 3 })
    );
    renderWithProviders(<OnboardingPage />);
    expect(screen.getByText('What is your primary goal?')).toBeInTheDocument();
  });

  it('renders title and description for step 4', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({ currentStep: 4 })
    );
    renderWithProviders(<OnboardingPage />);
    expect(screen.getByText('What are your food preferences?')).toBeInTheDocument();
  });

  it('renders StepMetrics at step 1', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({ currentStep: 1 })
    );
    renderWithProviders(<OnboardingPage />);
    expect(screen.getByLabelText('Age')).toBeInTheDocument();
    expect(screen.getByLabelText('Gender')).toBeInTheDocument();
  });

  it('renders StepActivity at step 2', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({ currentStep: 2 })
    );
    renderWithProviders(<OnboardingPage />);
    expect(screen.getByText('Sedentary')).toBeInTheDocument();
    expect(screen.getByText('Lightly Active')).toBeInTheDocument();
  });

  it('renders StepGoals at step 3', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({ currentStep: 3 })
    );
    renderWithProviders(<OnboardingPage />);
    expect(screen.getByText('Lose Weight')).toBeInTheDocument();
    expect(screen.getByText('Gain Muscle')).toBeInTheDocument();
  });

  it('renders PreferenceForm at step 4', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({ currentStep: 4 })
    );
    renderWithProviders(<OnboardingPage />);
    expect(screen.getByLabelText('Diet')).toBeInTheDocument();
    expect(screen.getByLabelText('Preferred Cuisine')).toBeInTheDocument();
  });

  it('renders StepResults at step 5 with personalized plan', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({
        currentStep: 5,
        tdeeInfo: mockTDEEInfo,
      })
    );
    renderWithProviders(<OnboardingPage />);
    expect(screen.getByText('Your personalized plan is ready!')).toBeInTheDocument();
    expect(screen.getByText('Start Tracking')).toBeInTheDocument();
  });

  it('renders progress bar at steps 1-4', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({ currentStep: 2 })
    );
    renderWithProviders(<OnboardingPage />);
    const progressBars = document.querySelectorAll('.rounded-full');
    const filledBar = Array.from(progressBars).find(
      (el) => el instanceof HTMLElement && el.style.width === '50%'
    );
    expect(filledBar).toBeTruthy();
  });

  it('does not render step indicator at step 5', () => {
    vi.mocked(useOnboarding).mockReturnValue(
      createMockOnboarding({
        currentStep: 5,
        tdeeInfo: mockTDEEInfo,
      })
    );
    renderWithProviders(<OnboardingPage />);
    expect(screen.queryByText('Step 5 of 4')).not.toBeInTheDocument();
  });
});
