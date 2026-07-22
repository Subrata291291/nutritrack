import { useOnboarding } from '@hooks/useOnboarding';
import { StepMetrics } from '../components/StepMetrics';
import { StepActivity } from '../components/StepActivity';
import { StepGoals } from '../components/StepGoals';
import { StepResults } from '../components/StepResults';

const totalSteps = 3;

export function OnboardingPage() {
  const { currentStep, nextStep, prevStep } = useOnboarding();
  const stepPercent = Math.round((currentStep / totalSteps) * 100);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepMetrics onNext={nextStep} />;
      case 2:
        return <StepActivity onNext={nextStep} onBack={prevStep} />;
      case 3:
        return <StepGoals onNext={() => { nextStep(); }} onBack={prevStep} />;
      case 4:
        return <StepResults />;
      default:
        return null;
    }
  };

  if (currentStep === 4) {
    return (
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-12 py-8">
        <div className="w-full max-w-4xl">
          <StepResults />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-12 py-8">
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-lg overflow-hidden border border-outline-variant/30">
        <div className="bg-surface-container-low px-6 py-4 border-b border-outline-variant/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold tracking-wider text-primary">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-semibold tracking-wider text-on-surface-variant">
              {stepPercent}%
            </span>
          </div>
          <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-container transition-all duration-500 ease-out rounded-full"
              style={{ width: `${Math.min(stepPercent, 100)}%` }}
            />
          </div>
        </div>
        <div className="p-6 md:p-8">
          <header className="mb-6 text-center md:text-left">
            <h1 className="text-[32px] font-bold text-on-surface mb-1">
              {currentStep === 1 && "Let's build your profile"}
              {currentStep === 2 && 'What is your daily activity level?'}
              {currentStep === 3 && 'What is your primary goal?'}
            </h1>
            <p className="text-base text-on-surface-variant">
              {currentStep === 1 && 'This helps us calculate your daily calorie and macro targets.'}
              {currentStep === 2 && 'This helps us calculate your Total Daily Energy Expenditure (TDEE) more accurately.'}
              {currentStep === 3 && 'Choose the focus that best matches your fitness journey.'}
            </p>
          </header>
          {renderStep()}
        </div>
      </div>
    </main>
  );
}
