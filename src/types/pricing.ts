export type BillingPeriod = 'monthly' | 'annual';

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  features: PricingFeature[];
  highlighted?: boolean;
  badge?: string;
  cta: string;
  ctaVariant: 'primary' | 'secondary';
}

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface CheckoutInfo {
  planId: string;
  billingPeriod: BillingPeriod;
  price: number;
  discount?: number;
  total: number;
}
