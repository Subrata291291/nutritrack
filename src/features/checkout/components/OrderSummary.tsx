import { cn } from '@utils/cn';

interface OrderSummaryProps {
  className?: string;
  planName?: string;
  price?: number;
  discount?: number;
  total?: number;
}

const benefits = [
  { icon: 'smart_toy', text: 'AI meal plans tailored to your preferences' },
  { icon: 'monitor_heart', text: 'Real-time bio-metric integration' },
  { icon: 'support_agent', text: 'Priority 24/7 customer support' },
];

export function OrderSummary({ className, planName = 'Plan', price = 0, discount = 0, total = 0 }: OrderSummaryProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="bg-surface-container-lowest rounded-2xl border border-outline p-6">
        <h3 className="text-lg font-bold text-on-surface mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">{planName}</span>
            <span className="text-on-surface font-medium">${price.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-primary flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">discount</span>
                Discount
              </span>
              <span className="text-primary font-medium">-${discount.toFixed(2)}</span>
            </div>
          )}
          <div className="border-t border-outline pt-3 flex items-center justify-between">
            <span className="text-on-surface font-bold">Total</span>
            <span className="text-on-surface font-bold text-lg">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline p-6">
        <h4 className="font-semibold text-on-surface text-sm mb-3 flex items-center gap-1">
          <span className="material-symbols-outlined text-primary text-base">check_circle</span>
          What's included
        </h4>
        <ul className="space-y-2">
          {benefits.map((b) => (
            <li key={b.text} className="flex items-start gap-2 text-sm text-on-surface-variant">
              <span className="material-symbols-outlined text-primary text-base mt-0.5">{b.icon}</span>
              {b.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-surface-container-low rounded-2xl border border-outline-variant p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary">format_quote</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface">Sarah M.</p>
            <p className="text-xs text-on-surface-variant">Pro Member since 2024</p>
          </div>
        </div>
        <p className="text-sm text-on-surface-variant italic">"NutriTrack Pro completely changed how I plan meals. The AI recommendations are scarily accurate — it knows my preferences better than I do!"</p>
        <div className="flex items-center gap-0.5 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="material-symbols-outlined text-tertiary-container text-base">star</span>
          ))}
        </div>
      </div>
    </div>
  );
}
