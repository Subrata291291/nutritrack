import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { subscriptionsService } from '@services/subscriptions.service';
import { LoadingSpinner } from '@components/shared/LoadingSpinner';
import { EmptyState } from '@components/shared/EmptyState';
import { OrderSummary } from '../components/OrderSummary';
import { PaymentForm } from '../components/PaymentForm';
import type { PricingPlan } from 'types/pricing';

export function CheckoutPage() {
  const [searchParams] = useSearchParams();
  const planId = searchParams.get('planId');
  const billingPeriod = searchParams.get('billingPeriod') ?? 'monthly';
  const [plan, setPlan] = useState<PricingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchPlan() {
      if (!planId) {
        if (!cancelled) { setError('No plan selected.'); setLoading(false); }
        return;
      }
      try {
        if (!cancelled) setLoading(true);
        setError(null);
        const plans = await subscriptionsService.getPlans();
        const found = plans.find((p) => p.id === planId) ?? null;
        if (!cancelled) {
          if (!found) setError('Selected plan not found.');
          else setPlan(found);
        }
      } catch {
        if (!cancelled) setError('Failed to load plan details. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPlan();
    return () => { cancelled = true; };
  }, [planId]);

  const price = plan ? (billingPeriod === 'annual' ? plan.annualPrice : plan.monthlyPrice) : 0;
  const discount = plan && billingPeriod === 'annual' ? (plan.monthlyPrice * 12) - plan.annualPrice : 0;
  const total = price;

  const handlePayment = async () => {
    if (!plan) return;
    setSaving(true);
    try {
      const result = await subscriptionsService.createCheckout(plan.id, billingPeriod as 'monthly' | 'annual');
      window.location.href = result.url;
    } catch {
      setError('Payment failed. Please try again.');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12 flex items-center justify-center min-h-[60vh]">
          <LoadingSpinner size="lg" text="Loading checkout..." />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-background min-h-screen">
        <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
          <EmptyState
            icon="error"
            title="Checkout unavailable"
            description={error}
            action={
              <Link
                to="/pricing"
                className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
              >
                <span className="material-symbols-outlined text-base">arrow_back</span>
                Back to pricing
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <Link to="/pricing" className="text-sm text-on-surface-variant hover:text-on-surface flex items-center gap-1 mb-2">
            <span className="material-symbols-outlined text-base">arrow_back</span>
            Back to NutriTrack
          </Link>
          <h1 className="text-[32px] font-bold text-on-surface">Secure Checkout</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            {plan && (
              <OrderSummary
                planName={plan.name}
                price={price}
                discount={discount}
                total={total}
              />
            )}
          </div>
          <div className="md:col-span-7">
            <div className="bg-surface-container-lowest rounded-2xl border border-outline p-6 md:p-8">
              <h2 className="text-lg font-bold text-on-surface mb-6">Payment Details</h2>
              <PaymentForm total={total} onSubmit={handlePayment} saving={saving} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
