import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
  typescript: true,
});

// Price ID-uri din variabile de mediu
export const STRIPE_PRICES = {
  plus: {
    monthly: process.env.STRIPE_PRICE_PLUS_MONTHLY!,
    yearly: process.env.STRIPE_PRICE_PLUS_YEARLY!,
  },
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
    yearly: process.env.STRIPE_PRICE_PRO_YEARLY!,
  },
  elite: {
    monthly: process.env.STRIPE_PRICE_ELITE_MONTHLY!,
    yearly: process.env.STRIPE_PRICE_ELITE_YEARLY!,
  },
};

export type StripePlan = keyof typeof STRIPE_PRICES;
export type StripeBillingPeriod = 'monthly' | 'yearly';
