'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, X, Star, Crown, Rocket, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const PROMO_END = new Date('2026-09-05T23:59:59');
const PROMO_PRICE_PLUS = 17.49;

const HOME_PLANS = [
  {
    id: 'free',
    name: 'Start',
    icon: Rocket,
    price_monthly: 0,
    price_yearly: 0,
    yearly_equiv: 0,
    subtitle: 'Gratuit pentru totdeauna',
    features: ['Profil public', '1 fotografie', 'Formular contact', 'Statistici de bază'],
    missing: ['Website pe profil', 'Badge verificat', 'Prioritate în căutări'],
    cta: 'Creează profil gratuit',
    href: '/inregistrare',
    popular: false,
    color: 'gray',
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Star,
    price_monthly: 69.99,
    price_yearly: 629.99,
    yearly_equiv: 52.49,
    subtitle: 'Cel mai ales de firme',
    features: [
      '15 fotografii + video',
      'Servicii nelimitate',
      'Badge „Firmă Verificată"',
      'Prioritate înaltă în căutări',
      'Statistici complete',
      'Suport prioritar 24h',
    ],
    missing: [],
    cta: 'Activează Pro',
    href: null,
    popular: true,
    color: 'brand',
  },
  {
    id: 'elite',
    name: 'Elite',
    icon: Crown,
    price_monthly: 139.99,
    price_yearly: 1259.99,
    yearly_equiv: 104.99,
    subtitle: 'Domină categoria ta',
    features: [
      'Tot din Pro',
      'Top 3 garantat în categorie',
      'Badge „Partener Elite"',
      'Featured pe pagina principală',
      'Manager de cont dedicat',
    ],
    missing: [],
    cta: 'Devino Elite',
    href: null,
    popular: false,
    color: 'amber',
  },
];

const COLOR_STYLES: Record<string, { border: string; cta: string; icon: string; badge?: string }> = {
  gray:  { border: 'border-gray-200', cta: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50', icon: 'bg-gray-100 text-gray-500' },
  brand: { border: 'border-brand-400', cta: 'bg-brand-700 text-white hover:bg-brand-800', icon: 'bg-brand-100 text-brand-700', badge: 'bg-brand-600 text-white' },
  amber: { border: 'border-amber-300', cta: 'border-2 border-amber-400 text-amber-700 hover:bg-amber-50', icon: 'bg-amber-100 text-amber-600' },
};

export function HomePricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [promoActive, setPromoActive] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setPromoActive(PROMO_END > new Date());
  }, []);

  const handleCta = async (planId: string) => {
    if (planId === 'free') {
      router.push('/inregistrare');
      return;
    }
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planId, billing_period: billing }),
    });
    if (res.status === 401) {
      router.push('/autentificare?next=/preturi');
      return;
    }
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <section className="py-16 container-page">
      <div className="text-center mb-10">
        <h2 className="section-title">Listează-ți firma. Gratuit sau Pro.</h2>
        <p className="section-subtitle">Alege cum vrei să fii găsit de clienți</p>

        {/* Toggle */}
        <div className="inline-flex items-center bg-gray-100 rounded-xl p-1 mt-5 gap-1">
          <button
            onClick={() => setBilling('monthly')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all',
              billing === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Lunar
          </button>
          <button
            onClick={() => setBilling('yearly')}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5',
              billing === 'yearly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Anual
            <span className="bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">-20%</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
        {HOME_PLANS.map((plan) => {
          const styles = COLOR_STYLES[plan.color];
          const Icon = plan.icon;
          const price = billing === 'monthly' ? plan.price_monthly : plan.yearly_equiv;

          return (
            <div
              key={plan.id}
              className={cn(
                'relative rounded-2xl border-2 bg-white p-6 flex flex-col transition-all duration-200 hover:-translate-y-1',
                plan.popular ? `${styles.border} shadow-xl` : `${styles.border} shadow-card`
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3 fill-white" />
                    CEL MAI POPULAR
                  </span>
                </div>
              )}

              <div className={cn('p-2 rounded-xl w-fit mb-3', styles.icon)}>
                <Icon className="h-5 w-5" />
              </div>

              <div className="mb-1 font-bold text-gray-900 text-lg">{plan.name}</div>

              <div className="mb-4">
                {plan.id === 'free' ? (
                  <div>
                    <span className="text-3xl font-extrabold text-gray-900">Gratuit</span>
                    <p className="text-xs text-green-600 font-semibold mt-0.5">Fără card · Fără limită</p>
                  </div>
                ) : plan.id === 'plus' && billing === 'monthly' && promoActive ? (
                  <div>
                    <p className="text-xs text-gray-400 line-through">{plan.price_monthly} RON/lună</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-red-500">{PROMO_PRICE_PLUS}</span>
                      <span className="text-sm text-red-400">RON/lună</span>
                    </div>
                    <p className="text-xs text-red-600 font-semibold mt-0.5">3 luni, apoi {plan.price_monthly} RON</p>
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-gray-900">{price}</span>
                      <span className="text-sm text-gray-500">RON/lună</span>
                    </div>
                    {billing === 'yearly' && (
                      <p className="text-xs text-green-600 font-semibold mt-0.5">
                        Facturat anual: {plan.price_yearly} RON
                      </p>
                    )}
                    {billing === 'monthly' && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        sau {plan.yearly_equiv} RON/lună plătit anual
                      </p>
                    )}
                  </>
                )}
              </div>

              <ul className="space-y-1.5 mb-5 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-600">
                    <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
                {plan.missing.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-gray-400">
                    <X className="h-3.5 w-3.5 text-gray-300 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              {plan.href ? (
                <Link href={plan.href}>
                  <button className={cn('w-full py-2.5 rounded-xl text-sm font-semibold transition-all', styles.cta)}>
                    {plan.cta}
                  </button>
                </Link>
              ) : (
                <button
                  onClick={() => handleCta(plan.id)}
                  className={cn('w-full py-2.5 rounded-xl text-sm font-semibold transition-all', styles.cta)}
                >
                  {plan.cta}
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-6">
        <Link
          href="/preturi"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-800 hover:underline"
        >
          Vezi toate planurile și comparația completă
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
