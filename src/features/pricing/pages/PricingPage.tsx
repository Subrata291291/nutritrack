import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@utils/cn';
import { subscriptionsService } from '@services/subscriptions.service';
import { userService } from '@services/user.service';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import { EmptyState } from '@components/shared/EmptyState';
import type { PricingPlan } from 'types/pricing';

const features = [
  { icon: 'smart_toy', title: 'AI Smart Plan', description: 'Our intelligent engine learns your preferences, dietary restrictions, and weekly rhythms to generate personalized meal plans that get better every week.' },
  { icon: 'monitor_heart', title: 'Bio-Metrics Sync', description: 'Connect your wearable devices to sync real-time health data. Adjust recommendations based on sleep, activity, and recovery scores.' },
];

const trustBadges = [
  { icon: 'verified_user', label: 'SECURE', sub: '256-bit encryption' },
  { icon: 'checklist', label: 'COMPLIANT', sub: 'HIPAA-ready infrastructure' },
  { icon: 'sync', label: 'SYNCED', sub: 'Real-time cloud sync' },
];

export function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const plansData = await subscriptionsService.getPlans();
        setPlans(plansData);
        userService.getProfile()
          .then(profile => setUserPlan((profile as unknown as Record<string, unknown>).membership as string ?? null))
          .catch(() => { /* profile fetch is best-effort */ });
      } catch {
        setError('Failed to load pricing plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="Loading plans..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
          <EmptyState
            icon="error"
            title="Unable to load pricing"
            description={error}
          />
        </div>
      </div>
    );
  }

  const isCurrentPlan = (planName: string) => {
    if (!userPlan) return false;
    return userPlan.toLowerCase() === planName.toLowerCase();
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back
          </button>
        </div>
        <div className="text-center mb-12">
          <h1 className="text-headline-xl text-on-surface mb-3">Upgrade to Pro</h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">Unlock AI-powered meal planning, advanced nutrition tracking, and tools to transform your health journey.</p>
        </div>

        <div className="flex flex-col items-center justify-center mb-12">
          <div className="relative">
            {/* decorative glow */}
            <div className={cn(
              'absolute -inset-4 rounded-3xl opacity-40 blur-2xl transition-all duration-500',
              annual ? 'bg-primary/20 scale-110' : 'bg-surface-container-high scale-100'
            )} />

            <div className="relative flex items-center gap-2 sm:gap-3 bg-gradient-to-b from-surface-container-high to-surface-container rounded-2xl p-2 shadow-lg">
              {/* decorative accent line */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

              <button
                onClick={() => setAnnual(false)}
                className={cn(
                  'relative flex flex-col items-center px-6 py-3 rounded-xl transition-all duration-300',
                  !annual
                    ? 'bg-surface text-on-surface shadow-md scale-100'
                    : 'text-on-surface-variant/40 hover:text-on-surface-variant/70 scale-95'
                )}
              >
                <span className="material-symbols-outlined text-xl mb-0.5">calendar_month</span>
                <span className="text-sm font-semibold tracking-wide">Monthly</span>
                <span className="text-[11px] mt-0.5">$9.99/mo</span>
                {!annual && (
                  <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-primary shadow-sm shadow-primary/50" />
                )}
              </button>

              <div className="flex items-center">
                <div className="w-px h-10 bg-outline-variant/30" />
              </div>

              <button
                onClick={() => setAnnual(true)}
                className={cn(
                  'relative flex flex-col items-center px-6 py-3 rounded-xl transition-all duration-300',
                  annual
                    ? 'bg-surface text-on-surface shadow-md scale-100'
                    : 'text-on-surface-variant/40 hover:text-on-surface-variant/70 scale-95'
                )}
              >
                <span className="text-[10px] font-bold text-white bg-gradient-to-r from-primary to-primary/80 px-2 py-0.5 rounded-full absolute -top-2.5 right-2 shadow-sm">
                  −33%
                </span>
                <span className="material-symbols-outlined text-xl mb-0.5">stars</span>
                <span className="text-sm font-semibold tracking-wide">Annual</span>
                <span className="text-[11px] mt-0.5 text-primary font-medium">$6.67/mo</span>
              </button>
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-4 text-xs">
              <span className={cn(
                'transition-all duration-300',
                !annual ? 'text-on-surface-variant font-medium' : 'text-on-surface-variant/40'
              )}>
                <span className="material-symbols-outlined text-sm align-text-bottom mr-0.5">check_circle</span>
                Cancel anytime
              </span>
              <span className="w-1 h-1 rounded-full bg-outline-variant" />
              <span className={cn(
                'transition-all duration-300',
                annual ? 'text-primary font-semibold' : 'text-on-surface-variant/40'
              )}>
                <span className="material-symbols-outlined text-sm align-text-bottom mr-0.5">savings</span>
                Save $39.89/yr
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {plans.map((plan) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice;
            const isCurrent = isCurrentPlan(plan.name);
            return (
            <div
              key={plan.id}
              className={cn(
                'bg-surface-container-lowest rounded-2xl border border-outline p-6 flex flex-col relative transition-all',
                plan.highlighted && 'md:scale-105 border-2 border-primary shadow-lg'
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-on-primary text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">star</span>
                  {plan.badge}
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-on-surface mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-[40px] font-bold text-on-surface">
                    ${price.toFixed(2)}
                  </span>
                  <span className="text-on-surface-variant text-sm">/mo</span>
                </div>
                {annual && plan.annualPrice > 0 && (
                  <p className="text-xs text-primary mt-1">Billed annually (${(plan.annualPrice * 12).toFixed(2)}/yr)</p>
                )}
                {!annual && plan.annualPrice > 0 && (
                  <p className="text-xs text-on-surface-variant mt-1">${plan.annualPrice.toFixed(2)}/mo when billed annually</p>
                )}
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feat) => (
                  <li key={feat.text} className="flex items-start gap-2 text-sm text-on-surface-variant">
                    <span className={cn(
                      'material-symbols-outlined text-base mt-0.5',
                      feat.included ? 'text-primary' : 'text-on-surface-variant/40'
                    )}>check_circle</span>
                    <span className={feat.included ? '' : 'text-on-surface-variant/40'}>{feat.text}</span>
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <div
                  className="text-center rounded-xl py-2.5 text-sm font-medium border-2 border-primary text-primary cursor-default"
                >
                  Current Plan
                </div>
              ) : (
                <button
                  onClick={() => navigate(`/checkout?planId=${plan.id}&billingPeriod=${annual ? 'annual' : 'monthly'}`)}
                  className={cn(
                    'text-center rounded-xl py-2.5 text-sm font-medium transition-colors',
                    plan.ctaVariant === 'primary' || plan.highlighted
                      ? 'bg-primary text-on-primary hover:bg-primary/90'
                      : 'border-2 border-primary text-primary hover:bg-primary-container/20'
                  )}
                >
                  {plan.cta}
                </button>
              )}
            </div>
            );
          })}
        </div>

        <div className="mb-20">
          <div className="relative rounded-2xl overflow-hidden mb-12">
            <div className="bg-gradient-to-br from-on-surface to-inverse-surface p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 inline-block mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/30 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-lg">dashboard</span>
                      </div>
                      <div className="space-y-1">
                        <div className="w-24 h-2 bg-white/20 rounded" />
                        <div className="w-16 h-2 bg-white/10 rounded" />
                      </div>
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-20 h-3 bg-white/20 rounded" />
                      <div className="w-12 h-3 bg-primary/40 rounded" />
                    </div>
                    <div className="space-y-3">
                      <div className="h-8 bg-white/10 rounded-lg" />
                      <div className="h-8 bg-white/10 rounded-lg" />
                      <div className="h-8 bg-white/10 rounded-lg w-3/4" />
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className="text-headline-md text-white mb-4">Why NutriTrack Pro?</h2>
                  <div className="space-y-4">
                    {features.map((feat) => (
                      <div key={feat.title} className="flex gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <span className="material-symbols-outlined text-primary text-lg">{feat.icon}</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-white text-sm">{feat.title}</h4>
                          <p className="text-sm text-white/70">{feat.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs font-semibold tracking-widest text-on-surface-variant mb-4">TRUSTED BY 50,000+ HEALTH ENTHUSIASTS</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {trustBadges.map((badge) => (
              <div key={badge.label} className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">{badge.icon}</span>
                <div className="text-left">
                  <p className="text-xs font-bold text-on-surface">{badge.label}</p>
                  <p className="text-xs text-on-surface-variant">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
