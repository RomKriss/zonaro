'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Check, X, ChevronDown, Zap, Star, Crown, Rocket,
  Users, TrendingUp, Shield, Phone, BarChart2,
  MessageSquare, Award, ArrowRight, Info, Timer, Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { WaitlistButton } from '@/components/ui/WaitlistModal';

const PROMO_END = new Date('2026-09-05T23:59:59');
const PROMO_PRICE_PLUS = 17.49;

function usePromoCountdown() {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, active: false });
  useEffect(() => {
    const calc = () => {
      const diff = PROMO_END.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, active: false };
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff / 3600000) % 24),
        minutes: Math.floor((diff / 60000) % 60),
        seconds: Math.floor((diff / 1000) % 60),
        active: true,
      };
    };
    setT(calc());
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const PLANS_DATA = [
  {
    id: 'free',
    name: 'Start',
    subtitle: 'Pune-ți firma pe hartă',
    icon: Rocket,
    color: 'gray',
    price_monthly: 0,
    price_yearly: 0,
    yearly_monthly_equiv: 0,
    yearly_saving: 0,
    cta: 'Creează profil gratuit',
    cta_note: 'Fără card bancar. Fără termen limită.',
    cta_href: '/inregistrare',
    popular: false,
    anchor: 'start',
    includes: [
      'Profil public pe ZonaRo',
      '1 fotografie',
      'Descriere până la 150 de cuvinte',
      '1 serviciu listat',
      'Formular de contact activ',
      'Număr de telefon vizibil',
      'Adresă și hartă',
      'Statistici de bază (vizite totale)',
    ],
    excludes: [
      'Website-ul tău nu apare pe profil',
      'Nu poți răspunde la recenzii',
      'Profilul apare după firmele plătite',
      'Fără badge de verificare',
      'Fără statistici detaliate',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    subtitle: 'Mai multă vizibilitate, mai mulți clienți',
    icon: Zap,
    color: 'blue',
    price_monthly: 34.99,
    price_yearly: 314.99,
    yearly_monthly_equiv: 26.24,
    yearly_saving: 104.89,
    cta: 'Începe cu Plus',
    cta_note: 'Anulezi oricând. Fără penalizări.',
    cta_href: null,
    popular: false,
    anchor: 'plus',
    includes: [
      'Tot din Start, plus:',
      '5 fotografii',
      'Descriere până la 500 de cuvinte',
      '3 servicii listate cu descrieri',
      'Link website activ și clickabil',
      'Răspuns la recenzii',
      'Statistici detaliate (vizite, click-uri tel.)',
      'Prioritate medie în rezultatele de căutare',
      'Suport prin email în 48 ore',
    ],
    excludes: [
      'Fără badge „Firmă Verificată"',
      'Fără galerie foto completă',
      'Fără poziție garantată în top căutări',
      'Fără statistici contacte primite',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    subtitle: 'Profilul complet care convinge clienții',
    icon: Star,
    color: 'brand',
    price_monthly: 69.99,
    price_yearly: 629.99,
    yearly_monthly_equiv: 52.49,
    yearly_saving: 209.89,
    cta: 'Activează Pro acum',
    cta_note: '30 zile garanție. Rambursare completă.',
    cta_href: null,
    popular: true,
    anchor: 'pro',
    stat: 'Firmele Pro primesc în medie de 8x mai multe contacte față de profilele gratuite',
    includes: [
      'Tot din Plus, plus:',
      '15 fotografii + galerie vizuală completă',
      'Video YouTube embed pe profil',
      'Descriere până la 2.000 de cuvinte',
      'Servicii și produse nelimitate',
      'Badge „Firmă Verificată" (după verificare)',
      'Prioritate înaltă în rezultatele de căutare',
      'Statistici complete + surse trafic',
      'Raport lunar de performanță pe email',
      'Suport prioritar în 24 ore',
      'Profil optimizat SEO pentru Google',
    ],
    excludes: [],
  },
  {
    id: 'elite',
    name: 'Elite',
    subtitle: 'Domină categoria ta în orașul tău',
    icon: Crown,
    color: 'amber',
    price_monthly: 139.99,
    price_yearly: 1259.99,
    yearly_monthly_equiv: 104.99,
    yearly_saving: 419.89,
    cta: 'Devino partener Elite',
    cta_note: 'Locuri limitate per categorie și oraș.',
    cta_href: null,
    popular: false,
    anchor: 'elite',
    includes: [
      'Tot din Pro, plus:',
      'Poziție garantată în primele 3 rezultate',
      'Badge „Partener Elite ZonaRo"',
      'Profil featured pe pagina principală',
      'Banner promoțional pe paginile categorie',
      'Raport săptămânal de performanță',
      'Manager de cont dedicat',
      'Consultanță gratuită optimizare profil',
      'Primii care primesc funcționalități noi',
    ],
    excludes: [],
  },
];

const COMPARISON_ROWS = [
  {
    category: 'Profil și conținut',
    rows: [
      { feature: 'Fotografii', values: ['1', '5', '15', '15+'] },
      { feature: 'Cuvinte descriere', values: ['150', '500', '2.000', '2.000'] },
      { feature: 'Servicii listate', values: ['1', '3', 'Nelimitat', 'Nelimitat'] },
      { feature: 'Video YouTube', values: [false, false, true, true] },
      { feature: 'Link website activ', values: [false, true, true, true] },
    ],
  },
  {
    category: 'Vizibilitate și căutare',
    rows: [
      { feature: 'Poziție în căutări', values: ['Standard', 'Medie', 'Înaltă', 'Top 3 garantat'] },
      { feature: 'Featured pagina principală', values: [false, false, false, true] },
      { feature: 'Banner pe categorii', values: [false, false, false, true] },
      { feature: 'SEO optimizat Google', values: [false, false, true, true] },
    ],
  },
  {
    category: 'Credibilitate',
    rows: [
      { feature: 'Badge Firmă Verificată', values: [false, false, true, true] },
      { feature: 'Badge Partener Elite', values: [false, false, false, true] },
    ],
  },
  {
    category: 'Recenzii',
    rows: [
      { feature: 'Primire recenzii', values: [true, true, true, true] },
      { feature: 'Răspuns la recenzii', values: [false, true, true, true] },
      { feature: 'Invitații recenzii clienți', values: [false, false, true, true] },
    ],
  },
  {
    category: 'Statistici',
    rows: [
      { feature: 'Vizite profil', values: ['Total', 'Detaliat', 'Complet', 'Complet'] },
      { feature: 'Click-uri telefon', values: [false, true, true, true] },
      { feature: 'Mesaje contact primite', values: [false, false, true, true] },
      { feature: 'Surse de trafic', values: [false, false, true, true] },
      { feature: 'Raport email', values: [false, false, 'Lunar', 'Săptămânal'] },
    ],
  },
  {
    category: 'Suport',
    rows: [
      { feature: 'Timp răspuns suport', values: ['72h', '48h', '24h', 'Manager dedicat'] },
      { feature: 'Consultanță optimizare', values: [false, false, false, true] },
    ],
  },
];

const FAQ_ITEMS = [
  { q: 'Pot schimba planul oricând?', a: 'Da. Poți upgrada sau downgradata oricând din contul tău. La upgrade, diferența se calculează proporțional cu zilele rămase. La downgrade, noul plan intră în vigoare la finalul perioadei plătite.' },
  { q: 'Ce se întâmplă dacă anulez abonamentul?', a: 'Contul rămâne activ până la finalul perioadei plătite. După expirare, profilul trece automat pe planul Start gratuit. Nu pierzi niciun fel de date din profil.' },
  { q: 'Există contract pe termen lung?', a: 'Nu. Plata lunară nu are angajament minim. Planul anual se plătește în avans și nu este rambursabil după primele 30 de zile.' },
  { q: 'Cum se face plata?', a: 'Prin card bancar (Visa, Mastercard) procesate securizat prin Stripe. Nu stocăm datele cardului tău pe serverele noastre.' },
  { q: 'Primiți factură fiscală?', a: 'Da. Factura se trimite automat pe email după fiecare plată. Poți descărca toate facturile și din panoul de control al abonamentului.' },
  { q: 'Ce înseamnă „Firmă Verificată"?', a: 'Echipa ZonaRo verifică că firma există, este activă în Registrul Comerțului și că informațiile din profil sunt corecte și complete. Procesul durează 1-3 zile lucrătoare.' },
  { q: 'Planul gratuit expiră vreodată?', a: 'Nu. Planul Start este gratuit pentru totdeauna, fără termen limită și fără a fi nevoie de card bancar.' },
  { q: 'Există reducere la plata anuală?', a: 'Da. La plata anuală beneficiezi de 20% reducere față de prețul lunar — economisești până la 478 RON/an față de abonamentul lunar.' },
];

function CompareValue({ value }: { value: boolean | string }) {
  if (typeof value === 'boolean') {
    return value
      ? <Check className="h-4 w-4 text-green-500 mx-auto" />
      : <X className="h-4 w-4 text-gray-300 mx-auto" />;
  }
  return <span className="text-xs font-medium text-gray-700">{value}</span>;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 text-sm pr-4">{q}</span>
        <ChevronDown className={cn('h-4 w-4 text-gray-400 flex-shrink-0 transition-transform duration-200', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

const COLOR_MAP: Record<string, { badge: string; button: string; border: string; icon: string }> = {
  gray:  { badge: 'bg-gray-100 text-gray-600', button: 'border-gray-300 text-gray-700 hover:bg-gray-50', border: 'border-gray-200', icon: 'bg-gray-100 text-gray-500' },
  blue:  { badge: 'bg-blue-100 text-blue-700', button: 'border-blue-300 text-blue-700 hover:bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-100 text-blue-600' },
  brand: { badge: 'bg-brand-600 text-white', button: 'bg-brand-700 text-white hover:bg-brand-800', border: 'border-brand-500', icon: 'bg-brand-100 text-brand-700' },
  amber: { badge: 'bg-amber-100 text-amber-700', button: 'border-amber-400 text-amber-700 hover:bg-amber-50', border: 'border-amber-300', icon: 'bg-amber-100 text-amber-600' },
};

interface Props {
  maintenanceMode: boolean;
  waitlistButtonText: string;
}

export function PreturiClient({ maintenanceMode, waitlistButtonText }: Props) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const promo = usePromoCountdown();

  const handleCheckout = async (planId: string) => {
    if (planId === 'free') {
      window.location.href = '/inregistrare';
      return;
    }
    setCheckoutLoading(planId);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId, billing_period: billing }),
      });
      if (res.status === 401) {
        window.location.href = '/autentificare?next=/preturi';
        return;
      }
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-50 to-white pt-16 pb-8 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className={cn(
            'inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-5',
            maintenanceMode
              ? 'bg-amber-50 text-amber-700'
              : 'bg-brand-50 text-brand-700',
          )}>
            {maintenanceMode ? <Clock className="h-3.5 w-3.5" /> : <TrendingUp className="h-3.5 w-3.5" />}
            {maintenanceMode
              ? 'Planuri viitoare — disponibile la lansarea platformei'
              : 'Prețuri de lansare — se pot modifica în viitor'}
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            Planul potrivit pentru<br className="hidden sm:block" /> afacerea ta
          </h1>
          {maintenanceMode ? (
            <p className="text-lg text-gray-500 mb-8">
              Platforma este în pregătire. Înscrie-te pe lista de așteptare pentru{' '}
              <strong className="text-gray-800">acces prioritar</strong> la lansare.
            </p>
          ) : (
            <p className="text-lg text-gray-500 mb-8">
              Alătură-te celor peste <strong className="text-gray-800">50.000 de firme</strong> din România care și-au crescut vizibilitatea pe ZonaRo
            </p>
          )}

          {/* Toggle lunar/anual */}
          <div className="inline-flex items-center bg-gray-100 rounded-2xl p-1 gap-1">
            <button
              onClick={() => setBilling('monthly')}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                billing === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700',
              )}
            >
              Lunar
            </button>
            <button
              onClick={() => setBilling('yearly')}
              className={cn(
                'px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2',
                billing === 'yearly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700',
              )}
            >
              Anual
              <span className="bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">−20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Maintenance notice */}
      {maintenanceMode && (
        <div className="px-4 pb-4">
          <div className="max-w-7xl mx-auto bg-amber-50 border border-amber-200 rounded-2xl px-6 py-4 flex items-center gap-3">
            <Clock className="h-5 w-5 text-amber-600 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>Platforma este în pregătire.</strong> Prețurile sunt afișate informativ. Înscrie-te pe lista de așteptare și vei fi printre primii care pot crea profil la lansare.
            </p>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 items-start">
            {PLANS_DATA.map((plan) => {
              const colors = COLOR_MAP[plan.color];
              const price = billing === 'monthly' ? plan.price_monthly : plan.yearly_monthly_equiv;
              const Icon = plan.icon;
              const isPopular = plan.popular;

              return (
                <div
                  id={plan.anchor}
                  key={plan.id}
                  className={cn(
                    'relative rounded-2xl border-2 bg-white transition-all duration-200 hover:-translate-y-1 flex flex-col',
                    isPopular
                      ? `${colors.border} shadow-xl ring-2 ring-brand-500/20`
                      : `${colors.border} shadow-card`,
                  )}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-brand-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg whitespace-nowrap flex items-center gap-1.5">
                        <Star className="h-3 w-3 fill-white" />
                        CEL MAI ALES DE FIRME
                      </span>
                    </div>
                  )}

                  {plan.id === 'plus' && promo.active && !maintenanceMode && (
                    <div className="absolute -top-3.5 right-4 z-10">
                      <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                        🔥 OFERTĂ LANSARE
                      </span>
                    </div>
                  )}

                  {plan.id === 'free' && (
                    <div className="absolute -top-3.5 right-4 z-10">
                      <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                        ✓ MEREU GRATUIT
                      </span>
                    </div>
                  )}

                  <div className={cn('p-6 flex flex-col flex-1', (isPopular || plan.id === 'plus') && 'pt-8')}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={cn('p-2 rounded-xl', colors.icon)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{plan.name}</h3>
                        <p className="text-xs text-gray-500 leading-tight">{plan.subtitle}</p>
                      </div>
                    </div>

                    {/* Preț */}
                    <div className="mb-4">
                      {plan.id === 'free' ? (
                        <div>
                          <span className="text-4xl font-extrabold text-gray-900">Gratuit</span>
                          <p className="text-xs text-green-600 font-semibold mt-1">
                            Fără card bancar · Fără termen limită
                          </p>
                        </div>
                      ) : plan.id === 'plus' && billing === 'monthly' && promo.active && !maintenanceMode ? (
                        <div>
                          <p className="text-sm text-gray-400 line-through mb-0.5">{plan.price_monthly} RON/lună</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-red-500">{PROMO_PRICE_PLUS}</span>
                            <span className="text-gray-500 text-sm font-medium">RON/lună</span>
                          </div>
                          <p className="text-xs text-red-600 font-semibold mt-1">
                            primele 3 luni, apoi {plan.price_monthly} RON/lună
                          </p>
                          {promo.active && (
                            <div className="flex items-center gap-1.5 mt-2 bg-red-50 rounded-lg px-2.5 py-1.5">
                              <Timer className="h-3 w-3 text-red-500 flex-shrink-0" />
                              <span className="text-xs text-red-600 font-mono font-semibold">
                                {promo.days}z {String(promo.hours).padStart(2, '0')}:{String(promo.minutes).padStart(2, '0')}:{String(promo.seconds).padStart(2, '0')}
                              </span>
                              <span className="text-xs text-red-400">rămase</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-extrabold text-gray-900">{price}</span>
                            <span className="text-gray-500 text-sm font-medium">RON/lună</span>
                          </div>
                          {billing === 'yearly' ? (
                            <div className="mt-1 space-y-0.5">
                              <p className="text-xs text-green-600 font-semibold">Facturat anual: {plan.price_yearly} RON</p>
                              <p className="text-xs text-green-600">Economisești {plan.yearly_saving} RON/an</p>
                            </div>
                          ) : (
                            <p className="text-xs text-gray-400 mt-1">
                              sau <strong>{plan.yearly_monthly_equiv} RON/lună</strong> plătit anual
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {(plan as any).stat && (
                      <div className="bg-brand-50 border border-brand-100 rounded-xl p-3 mb-4 flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-brand-600 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-brand-800 font-medium leading-snug">{(plan as any).stat}</p>
                      </div>
                    )}

                    <ul className="space-y-2 mb-4 flex-1">
                      {plan.includes.map((f, i) => (
                        <li key={i} className={cn('flex items-start gap-2 text-xs', i === 0 && plan.id !== 'free' ? 'font-semibold text-gray-700' : 'text-gray-600')}>
                          {i === 0 && plan.id !== 'free'
                            ? <ArrowRight className="h-3.5 w-3.5 text-brand-500 flex-shrink-0 mt-0.5" />
                            : <Check className="h-3.5 w-3.5 text-green-500 flex-shrink-0 mt-0.5" />}
                          {f}
                        </li>
                      ))}
                      {plan.excludes.map((f, i) => (
                        <li key={`ex-${i}`} className="flex items-start gap-2 text-xs text-gray-400">
                          <X className="h-3.5 w-3.5 text-gray-300 flex-shrink-0 mt-0.5" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <div className="mt-auto pt-4 border-t border-gray-100">
                      {maintenanceMode ? (
                        <WaitlistButton
                          buttonText={plan.id === 'free' ? 'Înscrie-te gratuit la lansare' : waitlistButtonText}
                          buttonClassName={cn(
                            'w-full py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200 flex items-center justify-center gap-2',
                            isPopular
                              ? 'bg-brand-700 text-white border-brand-700 hover:bg-brand-800'
                              : 'border-gray-300 text-gray-700 hover:bg-gray-50',
                          )}
                        />
                      ) : plan.id === 'free' ? (
                        <Link href={plan.cta_href!}>
                          <button className={cn(
                            'w-full py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200',
                            colors.button,
                          )}>
                            {plan.cta}
                          </button>
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleCheckout(plan.id)}
                          disabled={checkoutLoading === plan.id}
                          className={cn(
                            'w-full py-3 rounded-xl text-sm font-semibold border-2 transition-all duration-200',
                            'disabled:opacity-60 disabled:cursor-not-allowed',
                            colors.button,
                          )}
                        >
                          {checkoutLoading === plan.id ? (
                            <span className="flex items-center justify-center gap-2">
                              <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                              Se procesează...
                            </span>
                          ) : plan.cta}
                        </button>
                      )}
                      {!maintenanceMode && (
                        <p className="text-center text-xs text-gray-400 mt-2">{plan.cta_note}</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-gray-400 mt-6 flex items-center justify-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            Prețurile afișate sunt prețuri de lansare și pot fi actualizate în viitor. Abonamentele active rămân la prețul contractat.
          </p>
        </div>
      </section>

      {/* Tabel comparativ */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Comparație detaliată</h2>
            <p className="text-gray-500 mt-2">Tot ce include fiecare plan, transparent și complet</p>
          </div>

          <div className="hidden md:block overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 w-1/3">Funcționalitate</th>
                  {PLANS_DATA.map((p) => (
                    <th key={p.id} className={cn('px-4 py-4 text-center font-bold w-1/6', p.popular ? 'text-brand-700 bg-brand-50' : 'text-gray-700')}>
                      <span className="block">{p.name}</span>
                      {p.popular && <span className="text-xs font-normal text-brand-500 block">Recomandat</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((section) => (
                  <>
                    <tr key={`cat-${section.category}`} className="bg-gray-50 border-y border-gray-100">
                      <td colSpan={5} className="px-6 py-2.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        {section.category}
                      </td>
                    </tr>
                    {section.rows.map((row) => (
                      <tr key={row.feature} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="px-6 py-3 text-gray-700">{row.feature}</td>
                        {row.values.map((val, i) => (
                          <td key={i} className={cn('px-4 py-3 text-center', PLANS_DATA[i].popular && 'bg-brand-50/30')}>
                            <CompareValue value={val} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-3">
            {COMPARISON_ROWS.map((section) => (
              <MobileCompareSection key={section.category} section={section} />
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Ce spun firmele care folosesc ZonaRo</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'Instalații Popescu SRL', city: 'Cluj-Napoca', plan: 'Pro', text: '[TESTIMONIAL] De când am trecut pe planul Pro, primesc de aproape 10 ori mai multe cereri de ofertă. Badge-ul de Firmă Verificată face toată diferența în ochii clienților.' },
              { name: 'Cabinet Avocat Dr. Ionescu', city: 'București', plan: 'Elite', text: '[TESTIMONIAL] Poziția garantată în top 3 din categoria Avocatură în București a transformat ZonaRo în principala sursă de clienți noi pentru cabinetul meu.' },
              { name: 'Auto Service Brașov', city: 'Brașov', plan: 'Pro', text: '[TESTIMONIAL] Am ezitat între Plus și Pro. Diferența de preț e mică, dar diferența de vizibilitate e uriașă. Îmi pare rău că n-am luat Pro de la început.' },
            ].map((t) => (
              <div key={t.name} className="card p-5">
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4 italic">{t.text}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.city}</p>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-brand-100 text-brand-700">Plan {t.plan}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {[
              { icon: Users, value: '50.000+', label: 'Firme listate' },
              { icon: Shield, value: '2.800+', label: 'Firme verificate' },
              { icon: MessageSquare, value: '120.000+', label: 'Recenzii reale' },
              { icon: Award, value: '4.8/5', label: 'Rating mediu platform' },
            ].map((stat) => (
              <div key={stat.label} className="text-center card p-4">
                <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <stat.icon className="h-5 w-5 text-brand-600" />
                </div>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Întrebări frecvente</h2>
            <p className="text-gray-500 mt-2">Tot ce trebuie să știi despre planuri și plăți</p>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 px-4 bg-gradient-to-r from-brand-800 to-brand-700">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            {maintenanceMode
              ? 'Fii primul la lansare'
              : 'Nu ești sigur ce plan ți se potrivește?'}
          </h2>
          <p className="text-blue-200 mb-8 text-lg">
            {maintenanceMode
              ? 'Înscrie-te acum pe lista de așteptare și îți rezervi accesul prioritar la platformă.'
              : 'Începe gratuit și upgradează oricând. Sau contactează-ne și îți recomandăm noi.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {maintenanceMode ? (
              <WaitlistButton
                buttonText={waitlistButtonText}
                buttonClassName="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-brand-800 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-base"
                size="lg"
              />
            ) : (
              <>
                <Link href="/inregistrare">
                  <Button size="lg" variant="secondary" className="px-8">
                    Începe gratuit — fără card
                  </Button>
                </Link>
                <a href="mailto:contact@zonaro.ro">
                  <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white/10">
                    Contactează-ne pentru recomandare
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function MobileCompareSection({ section }: { section: typeof COMPARISON_ROWS[0] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{section.category}</span>
        <ChevronDown className={cn('h-4 w-4 text-gray-400 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="overflow-x-auto">
          <table className="w-full text-xs min-w-[400px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-2 text-gray-500">Funcționalitate</th>
                {PLANS_DATA.map((p) => (
                  <th key={p.id} className={cn('px-2 py-2 text-center font-bold', p.popular ? 'text-brand-700' : 'text-gray-600')}>
                    {p.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.rows.map((row) => (
                <tr key={row.feature} className="border-b border-gray-50">
                  <td className="px-4 py-2.5 text-gray-700">{row.feature}</td>
                  {row.values.map((val, i) => (
                    <td key={i} className="px-2 py-2.5 text-center">
                      <CompareValue value={val} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
