import { useState } from 'react';
import { cn } from '@utils/cn';

interface PaymentFormProps {
  className?: string;
  total?: number;
  onSubmit?: () => Promise<void>;
  saving?: boolean;
}

export function PaymentForm({ className, total = 0, onSubmit, saving = false }: PaymentFormProps) {
  const [saveCard, setSaveCard] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit?.();
  };

  return (
    <div className={cn('space-y-6', className)}>
      <div className="space-y-3">
        <button type="button" className="w-full bg-black text-white rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 hover:bg-black/90 transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
          Apple Pay
        </button>
        <button type="button" className="w-full bg-surface-container-lowest border-2 border-outline rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 hover:bg-background transition-colors">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          Google Pay
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-outline" />
        <span className="text-xs text-on-surface-variant font-medium">Or pay with card</span>
        <div className="flex-1 h-px bg-outline" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-on-surface">Cardholder Name</label>
          <input
            required
            placeholder="Full name on card"
            className="w-full px-4 py-2.5 text-sm text-on-surface bg-background border-2 border-outline rounded-xl placeholder:text-on-surface-variant/60 focus-visible:outline-none focus-visible:border-primary hover:border-outline transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-on-surface">Card Number</label>
          <input
            required
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            className="w-full px-4 py-2.5 text-sm text-on-surface bg-background border-2 border-outline rounded-xl placeholder:text-on-surface-variant/60 focus-visible:outline-none focus-visible:border-primary hover:border-outline transition-colors"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-on-surface">Expiration MM/YY</label>
            <input
              required
              placeholder="MM/YY"
              maxLength={5}
              className="w-full px-4 py-2.5 text-sm text-on-surface bg-background border-2 border-outline rounded-xl placeholder:text-on-surface-variant/60 focus-visible:outline-none focus-visible:border-primary hover:border-outline transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-on-surface">CVC</label>
            <input
              required
              placeholder="CVC"
              maxLength={4}
              className="w-full px-4 py-2.5 text-sm text-on-surface bg-background border-2 border-outline rounded-xl placeholder:text-on-surface-variant/60 focus-visible:outline-none focus-visible:border-primary hover:border-outline transition-colors"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={saveCard}
            onChange={(e) => setSaveCard(e.target.checked)}
            className="w-4 h-4 rounded border-outline text-primary focus:ring-primary"
          />
          <span className="text-sm text-on-surface-variant">Save card for future payments</span>
        </label>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary text-on-primary rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-base">lock</span>
              Complete Payment (${total.toFixed(2)})
            </>
          )}
        </button>
      </form>

      <p className="text-xs text-center text-on-surface-variant">
        By completing this payment, you agree to our{' '}
        <button type="button" className="underline hover:text-on-surface">Terms of Service</button>
        {' '}and{' '}
        <button type="button" className="underline hover:text-on-surface">Privacy Policy</button>
      </p>

      <div className="flex items-center justify-center gap-4 text-xs text-on-surface-variant">
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">lock</span>
          SSL Secure
        </span>
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-sm">verified_user</span>
          PCI Compliant
        </span>
      </div>
    </div>
  );
}
