import { createClient } from '@/lib/supabase/server';
import { Building2, Users, Star, DollarSign, TrendingUp } from 'lucide-react';

async function getPlatformStats() {
  const supabase = await createClient();

  const [
    { count: totalBiz },
    { count: activeBiz },
    { count: totalReviews },
    { count: approvedReviews },
    { data: subs },
    { count: totalMessages },
  ] = await Promise.all([
    supabase.from('businesses').select('id', { count: 'exact' }).then((r) => ({ count: r.count ?? 0 })),
    supabase.from('businesses').select('id', { count: 'exact' }).eq('status', 'active').then((r) => ({ count: r.count ?? 0 })),
    supabase.from('reviews').select('id', { count: 'exact' }).then((r) => ({ count: r.count ?? 0 })),
    supabase.from('reviews').select('id', { count: 'exact' }).eq('status', 'approved').then((r) => ({ count: r.count ?? 0 })),
    supabase.from('subscriptions').select('amount, plan').eq('status', 'active').then((r) => ({ data: r.data ?? [] })),
    supabase.from('contact_messages').select('id', { count: 'exact' }).then((r) => ({ count: r.count ?? 0 })),
  ]);

  const monthlyRevenue = subs.reduce((s: number, sub: any) => s + (sub.amount ?? 0), 0);

  const planBreakdown = subs.reduce((acc: Record<string, number>, sub: any) => {
    acc[sub.plan] = (acc[sub.plan] ?? 0) + 1;
    return acc;
  }, {});

  return { totalBiz, activeBiz, totalReviews, approvedReviews, monthlyRevenue, totalMessages, planBreakdown };
}

export default async function AdminStatisticiPage() {
  const stats = await getPlatformStats();

  const CARDS = [
    { label: 'Total firme', value: stats.totalBiz, icon: Building2, color: 'bg-blue-50 text-blue-600' },
    { label: 'Firme active', value: stats.activeBiz, icon: Users, color: 'bg-green-50 text-green-600' },
    { label: 'Recenzii aprobate', value: stats.approvedReviews, icon: Star, color: 'bg-amber-50 text-amber-600' },
    { label: 'Mesaje contact', value: stats.totalMessages, icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
    { label: 'Venit lunar (RON)', value: stats.monthlyRevenue.toLocaleString('ro-RO'), icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistici Platformă</h1>
        <p className="text-gray-500 text-sm mt-1">Overview general ZonaRo</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {CARDS.map((card) => (
          <div key={card.label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Distribuție planuri */}
      <div className="card p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Distribuție abonamente active</h2>
        <div className="space-y-3">
          {['elite', 'pro', 'plus'].map((plan) => {
            const count = stats.planBreakdown[plan] ?? 0;
            const total = Object.values(stats.planBreakdown).reduce((a: number, b: number) => a + b, 0);
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            const COLORS: Record<string, string> = {
              elite: 'bg-amber-400', pro: 'bg-indigo-500', plus: 'bg-blue-400',
            };
            return (
              <div key={plan} className="flex items-center gap-3">
                <span className="w-12 text-xs font-medium text-gray-600 capitalize">{plan}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className={`${COLORS[plan]} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">{count} ({pct}%)</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
