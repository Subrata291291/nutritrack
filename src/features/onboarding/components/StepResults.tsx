import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '@hooks/useOnboarding';
import { Button } from '@components/ui/Button';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import type { TDEEInfo } from 'types/onboarding';

export function StepResults() {
  const navigate = useNavigate();
  const { calculateResults, tdeeInfo, submitting, submitError, submitToApi } = useOnboarding();
  const [info] = useState<TDEEInfo | null>(() => {
    if (tdeeInfo) return tdeeInfo;
    try {
      return calculateResults();
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!info) {
      navigate('/onboarding');
    }
  }, [info, navigate]);

  if (!info) return null;

  const macros = [
    { label: 'Proteins', value: `${info.proteinGrams}g`, percent: 30, color: 'stroke-primary-container', textColor: 'text-primary' },
    { label: 'Carbs', value: `${info.carbsGrams}g`, percent: 40, color: 'stroke-tertiary-container', textColor: 'text-tertiary' },
    { label: 'Fats', value: `${info.fatsGrams}g`, percent: 30, color: 'stroke-secondary-fixed-dim', textColor: 'text-secondary' },
  ];

  const circumference = 2 * Math.PI * 88;

  return (
    <div className="space-y-6">
      <header className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-container/20 text-primary mb-4">
          <span className="material-symbols-outlined text-[32px]">verified_user</span>
        </div>
        <h1 className="text-[48px] font-bold text-on-surface mb-2">Your personalized plan is ready!</h1>
        <p className="text-lg text-on-surface-variant">We've analyzed your data to create a science-backed blueprint for your health journey.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-surface-container-lowest/80 backdrop-blur rounded-xl p-6 border border-outline-variant flex flex-col items-center text-center shadow-lg">
          <span className="text-sm font-semibold tracking-widest text-primary uppercase mb-2">Daily Goal</span>
          <div className="relative w-48 h-48 mb-4 flex items-center justify-center">
            <svg className="w-full h-full">
              <circle className="stroke-surface-container" cx="96" cy="96" fill="transparent" r="88" strokeWidth="8" />
              <circle
                className="stroke-primary"
                cx="96" cy="96" fill="transparent" r="88"
                strokeLinecap="round" strokeWidth="12"
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: circumference * 0.25,
                  transform: 'rotate(-90deg)',
                  transformOrigin: '50% 50%',
                }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-[48px] font-bold text-on-surface">{info.targetCalories}</span>
              <span className="text-xs font-semibold text-on-surface-variant">KCAL / DAY</span>
            </div>
          </div>
          <h3 className="text-[24px] font-semibold text-on-surface mb-2">Total Daily Energy Expenditure</h3>
          <p className="text-sm text-on-surface-variant max-w-xs">This is the total number of calories your body burns in a day, adjusted for your activity level.</p>
        </div>

        <div className="lg:col-span-7 bg-surface-container-lowest/80 backdrop-blur rounded-xl p-6 border border-outline-variant shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[24px] font-semibold text-on-surface">Macro Ratios</h3>
            <span className="text-sm font-semibold tracking-wider text-on-surface-variant">Recommended Distribution</span>
          </div>
          <div className="flex-grow grid grid-cols-1 sm:grid-cols-3 gap-6">
            {macros.map((macro) => {
              const r = 44;
              const c = 2 * Math.PI * r;
              const offset = c - (macro.percent / 100) * c;
              return (
                <div key={macro.label} className="flex flex-col items-center p-4 rounded-lg bg-surface-container-low hover:scale-105 transition-transform">
                  <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
                    <svg className="w-full h-full">
                      <circle className="stroke-surface-container-highest" cx="48" cy="48" fill="transparent" r={r} strokeWidth="6" />
                      <circle
                        className={macro.color}
                        cx="48" cy="48" fill="transparent" r={r}
                        strokeLinecap="round" strokeWidth="8"
                        style={{
                          strokeDasharray: c,
                          strokeDashoffset: offset,
                          transform: 'rotate(-90deg)',
                          transformOrigin: '50% 50%',
                        }}
                      />
                    </svg>
                    <span className={`absolute text-[24px] font-semibold ${macro.textColor}`}>{macro.percent}%</span>
                  </div>
                  <span className="text-sm font-semibold tracking-wider text-on-surface">{macro.label}</span>
                  <span className="text-sm text-on-surface-variant">{macro.value} / day</span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-6 border-t border-outline-variant flex items-start gap-4">
            <span className="material-symbols-outlined text-tertiary-container">info</span>
            <p className="text-sm text-on-surface-variant">These ratios are optimized for your goal. You can adjust these anytime in your settings.</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 pt-4">
        {submitError && (
          <p className="text-sm text-red-500">{submitError}</p>
        )}
        <Button
          size="lg"
          className="group"
          disabled={submitting}
          onClick={async () => {
            localStorage.setItem('onboarding_completed', 'true');
            submitToApi();
            navigate('/dashboard');
          }}
        >
          {submitting ? (
            <LoadingSpinner size="sm" />
          ) : (
            <>
              Start Tracking
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform ml-1">arrow_forward</span>
            </>
          )}
        </Button>
        <Button variant="ghost" onClick={() => navigate('/onboarding')}>
          Refine calculations
        </Button>
      </div>
    </div>
  );
}
