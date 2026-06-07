'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import {
  CheckCircle2, Zap, Crown, Star, Rocket,
  ArrowRight, AlertTriangle, ExternalLink,
  CreditCard, Clock, TrendingUp, X, Check, Download, FileText, Send
} from 'lucide-react';
import { PLANS, getPlanConfig, formatDate, cn } from '@/lib/utils';
import type { Business } from '@/types';

const PLAN_ICONS: Record<string, React.ElementType> = {
  free: Rocket, plus: Zap, pro: Star, elite: Crown,
};

const PLAN_COLORS: Record<string, string> = {
  free: 'bg-gray-100 text-gray-600',
  plus: 'bg-blue-100 text-blue-700',
  pro:  'bg-brand-100 text-brand-700',
  elite:'bg-amber-100 text-amber-700',
};

// O-uri extra față de planul inferior
const PLAN_UPGRADES: Record<string, string[]> = {
  plus: [
    '5 fotografii (față de 1)',
    'Link website activ',
    'Răspuns la recenzii',
    'Statistici detaliate',
    'Prioritate medie în căutări',
  ],
  pro: [
    '15 fotografii + video YouTube',
    'Badge „Firmă Verificată"',
    'Servicii nelimitate',
    'Statistici complete + surse trafic',
    'Prioritate înaltă în căutări',
    'Raport lunar de performanță',
  ],
  elite: [
    'Top 3 garantat în categorie și oraș',
    'Badge „Partener Elite"',
    'Featured pe pagina principală',
    'Banner pe categorii',
    'Manager de cont dedicat',
    'Raport săptămânal',
  ],
};

export default function AbonamentPage() {
  const searchParams = useSearchParams();
  const successParam = searchParams.get('success');
  const cancelledParam = searchParams.get('cancelled');

  const [biz, setBiz] = useState<Business | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [resendingInvoice, setResendingInvoice] = useState<string | null>(null);
  const [resendSuccess, setResendSuccess] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: bizData } = await supabase.from('businesses').select('*').eq('user_id', user.id).single();
      setBiz(bizData);
      if (bizData) {
        const { data: sub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('business_id', bizData.id)
          .eq('status', 'active')
          .single();
        setSubscription(sub);
      }
      setLoading(false);
      // Încarcă facturile în background
      setInvoicesLoading(true);
      fetch('/api/stripe/invoices')
        .then((r) => r.json())
        .then((d) => setInvoices(d.invoices ?? []))
        .catch(() => {})
        .finally(() => setInvoicesLoading(false));
    })();
  }, []);

  const handleCheckout = async (planId: string) => {
    if (!biz) return;
    setCheckoutLoading(planId);
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planId, billing_period: billing, business_id: biz.id }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setCheckoutLoading(null);
  };

  const handlePortal = async () => {
    if (!biz) return;
    setPortalLoading(true);
    const res = await fetch('/api/stripe/portal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_id: biz.id }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setPortalLoading(false);
  };

  const handleResendInvoice = async (invoiceId: string) => {
    setResendingInvoice(invoiceId);
    setResendSuccess(null);
    try {
      await fetch('/api/stripe/resend-invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invoice_id: invoiceId }),
      });
      setResendSuccess(invoiceId);
      setTimeout(() => setResendSuccess(null), 4000);
    } finally {
      setResendingInvoice(null);
    }
  };

  const handleCancel = async () => {
    if (!biz) return;
    setCancelLoading(true);
    await fetch('/api/stripe/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_id: biz.id }),
    });
    setShowCancelConfirm(false);
    window.location.reload();
  };

  if (loading) return <PageLoader text="Se încarcă abonamentul..." />;

  const currentPlan = getPlanConfig(biz?.plan ?? 'free');
  const PlanIcon = PLAN_ICONS[biz?.plan ?? 'free'];

  // Planuri pentru upgrade (doar cele superioare planului curent)
  const planOrder = ['free', 'plus', 'pro', 'elite'];
  const currentIndex = planOrder.indexOf(biz?.plan ?? 'free');
  const upgradePlans = PLANS.filter((p) => planOrder.indexOf(p.id) > currentIndex);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Abonament</h1>
        <p className="text-gray-500 text-sm mt-1">Gestionează planul și plățile</p>
      </div>

      {/* Notificări */}
      {successParam && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4 text-green-800">
          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
          <div>
            <p className="font-semibold">Abonament activat cu succes!</p>
            <p className="text-sm text-green-600 mt-0.5">Planul tău a fost actualizat. Verifică emailul pentru confirmare.</p>
          </div>
        </div>
      )}
      {cancelledParam && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800">
          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
          <p className="text-sm">Plata a fost anulată. Nicio sumă nu a fost reținută.</p>
        </div>
      )}

      {/* Planul curent */}
      <div className="card p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className={cn('p-3 rounded-2xl', PLAN_COLORS[biz?.plan ?? 'free'])}>
              <PlanIcon className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-gray-900">Plan {currentPlan.name}</h2>
                <Badge variant={biz?.plan as any}>{biz?.plan === 'free' ? 'Gratuit' : 'Activ'}</Badge>
              </div>
              <div className="text-sm text-gray-600">
                {biz?.plan === 'free' ? (
                  'Plan gratuit — fără dată de expirare'
                ) : biz?.plan_expires_at ? (
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    Se reînnoiește la {formatDate(biz.plan_expires_at)}
                    {subscription?.billing_period === 'yearly' && (
                      <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">Anual</span>
                    )}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Butoane gestionare */}
          <div className="flex flex-wrap gap-2">
            {subscription?.stripe_customer_id && (
              <Button
                variant="outline"
                size="sm"
                onClick={handlePortal}
                loading={portalLoading}
              >
                <CreditCard className="h-4 w-4" />
                Gestionează plata
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            )}
            {biz?.plan !== 'free' && !showCancelConfirm && (
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="text-xs text-red-500 hover:text-red-700 hover:underline px-2"
              >
                Anulează abonamentul
              </button>
            )}
          </div>
        </div>

        {/* Confirmare anulare */}
        {showCancelConfirm && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="font-semibold text-red-900 mb-1">Ești sigur că vrei să anulezi?</p>
            <p className="text-sm text-red-700 mb-3">
              Profilul tău va trece pe planul gratuit la finalul perioadei plătite.
              Vei pierde: badge-ul de verificat, pozițiile prioritare în căutări și statisticile avansate.
            </p>
            <div className="flex gap-2">
              <Button size="sm" variant="danger" loading={cancelLoading} onClick={handleCancel}>
                Da, anulează
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setShowCancelConfirm(false)}>
                Păstrează abonamentul
              </Button>
            </div>
          </div>
        )}

        {/* Beneficii planului curent */}
        <div className="mt-5 pt-5 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Beneficiile planului tău curent
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentPlan.features.slice(0, 6).map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-gray-700">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Facturi */}
      <div className="card p-6">
        <div className="flex items-center gap-2 mb-5">
          <FileText className="h-5 w-5 text-gray-400" />
          <h2 className="font-semibold text-gray-900">Istoricul facturilor</h2>
        </div>

        {invoicesLoading ? (
          <div className="text-sm text-gray-400 text-center py-6">Se încarcă facturile...</div>
        ) : invoices.length === 0 ? (
          <div className="text-sm text-gray-500 text-center py-6 bg-gray-50 rounded-xl">
            Nu există facturi de afișat.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-4">Factură</th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-4">Data</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-4">Sumă</th>
                  <th className="text-center text-xs font-semibold text-gray-500 uppercase tracking-wider pb-3 pr-4">Status</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 pr-4 font-mono text-xs text-gray-600">{inv.number}</td>
                    <td className="py-3 pr-4 text-gray-700">
                      {new Date(inv.date * 1000).toLocaleDateString('ro-RO', {
                        day: 'numeric', month: 'long', year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 pr-4 text-right font-semibold text-gray-900">
                      {inv.amount.toFixed(2)} {inv.currency}
                    </td>
                    <td className="py-3 pr-4 text-center">
                      <span className={cn(
                        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                        inv.status === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-600'
                      )}>
                        {inv.status === 'paid' ? 'Plătit' : 'Neplătit'}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {inv.pdf_url && (
                          <a
                            href={inv.pdf_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-brand-700 hover:text-brand-900 font-medium hover:underline"
                          >
                            <Download className="h-3.5 w-3.5" />
                            PDF
                          </a>
                        )}
                        {inv.status === 'paid' && (
                          <button
                            onClick={() => handleResendInvoice(inv.id)}
                            disabled={resendingInvoice === inv.id}
                            title="Retrimite factura pe email"
                            className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-brand-700 transition-colors disabled:opacity-50"
                          >
                            {resendSuccess === inv.id ? (
                              <span className="text-green-600 flex items-center gap-1">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Trimis
                              </span>
                            ) : (
                              <>
                                <Send className="h-3.5 w-3.5" />
                                {resendingInvoice === inv.id ? '...' : 'Email'}
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upgrade — doar dacă nu e Elite */}
      {upgradePlans.length > 0 && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-semibold text-gray-900">Upgradează pentru mai multă vizibilitate</h2>
              <p className="text-sm text-gray-500 mt-0.5">Alege ce beneficii adiționale vrei</p>
            </div>
            {/* Toggle billing */}
            <div className="flex items-center bg-gray-100 rounded-xl p-0.5 gap-0.5">
              {(['monthly', 'yearly'] as const).map((period) => (
                <button
                  key={period}
                  onClick={() => setBilling(period)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    billing === period
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  {period === 'monthly' ? 'Lunar' : (
                    <span className="flex items-center gap-1">Anual <span className="text-green-600">-20%</span></span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upgradePlans.map((plan) => {
              const UpIcon = PLAN_ICONS[plan.id];
              const isProTarget = plan.id === 'pro';
              const price = billing === 'monthly'
                ? plan.price_monthly
                : Math.round(plan.price_yearly / 12);

              return (
                <div
                  key={plan.id}
                  className={cn(
                    'rounded-xl border-2 p-4 flex flex-col',
                    isProTarget ? 'border-brand-400 bg-brand-50/30' : 'border-gray-200'
                  )}
                >
                  {isProTarget && (
                    <span className="self-start bg-brand-600 text-white text-xs font-bold px-2 py-0.5 rounded-full mb-3">
                      RECOMANDAT
                    </span>
                  )}

                  <div className="flex items-center gap-2 mb-3">
                    <div className={cn('p-1.5 rounded-lg', PLAN_COLORS[plan.id])}>
                      <UpIcon className="h-4 w-4" />
                    </div>
                    <span className="font-bold text-gray-900">{plan.name}</span>
                  </div>

                  <div className="mb-3">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-gray-900">{price}</span>
                      <span className="text-xs text-gray-500">RON/lună</span>
                    </div>
                    {billing === 'yearly' && (
                      <p className="text-xs text-green-600 font-medium">{plan.price_yearly} RON/an</p>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-gray-500 mb-2">Față de planul tău, adaugi:</p>
                  <ul className="space-y-1 mb-4 flex-1">
                    {(PLAN_UPGRADES[plan.id] ?? []).slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-1.5 text-xs text-gray-600">
                        <TrendingUp className="h-3 w-3 text-brand-500 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Button
                    size="sm"
                    variant={isProTarget ? 'primary' : 'outline'}
                    fullWidth
                    loading={checkoutLoading === plan.id}
                    onClick={() => handleCheckout(plan.id)}
                  >
                    Treci la {plan.name}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>

          <p className="text-center text-xs text-gray-400 mt-4">
            Plăți securizate prin Stripe · Anulezi oricând · 30 zile garanție rambursare
          </p>
        </div>
      )}

      {/* Link spre pagina completa de prețuri */}
      <div className="text-center">
        <Link
          href="/preturi"
          className="inline-flex items-center gap-1.5 text-sm text-brand-700 hover:underline font-medium"
        >
          Vezi comparația completă a planurilor
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
