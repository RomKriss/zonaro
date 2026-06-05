import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Building2, Users, Star, DollarSign, Clock } from 'lucide-react';

async function safeCount(query: PromiseLike<{ count: number | null; data: any; error: any }>): Promise<number> {
  try {
    const { count } = await query;
    return count ?? 0;
  } catch {
    return 0;
  }
}

async function getAdminStats() {
  try {
    const supabase = await createClient();

    const [totalBiz, activeBiz, pendingBiz, pendingReviews, subsResult] = await Promise.all([
      safeCount(supabase.from('businesses').select('id', { count: 'exact', head: true })),
      safeCount(supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'active')),
      safeCount(supabase.from('businesses').select('id', { count: 'exact', head: true }).eq('status', 'pending')),
      safeCount(supabase.from('reviews').select('id', { count: 'exact', head: true }).eq('status', 'pending')),
      supabase.from('subscriptions').select('amount').eq('status', 'active'),
    ]);

    const subs = subsResult.data ?? [];
    const monthlyRevenue = subs.reduce((s: number, sub: any) => s + (sub.amount ?? 0), 0);

    return { totalBiz, activeBiz, pendingBiz, pendingReviews, monthlyRevenue };
  } catch {
    return { totalBiz: 0, activeBiz: 0, pendingBiz: 0, pendingReviews: 0, monthlyRevenue: 0 };
  }
}

async function getRecentBusinesses() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('businesses')
      .select('id, name, city, county, plan, status, created_at')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(10);
    return data ?? [];
  } catch {
    return [];
  }
}

async function checkAdminAuth() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect('/autentificare');
    }

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (userData?.role !== 'admin') {
      redirect('/');
    }
  } catch (e: any) {
    if (e?.digest) throw e; // re-throw redirect
    redirect('/');
  }
}

export default async function AdminDashboard() {
  await checkAdminAuth();
  const [stats, pending] = await Promise.all([getAdminStats(), getRecentBusinesses()]);

  const STAT_CARDS = [
    { label: 'Total firme', value: stats.totalBiz, icon: Building2, color: 'bg-blue-50 text-blue-600' },
    { label: 'Firme active', value: stats.activeBiz, icon: Users, color: 'bg-green-50 text-green-600' },
    { label: 'Firme pending', value: stats.pendingBiz, icon: Clock, color: 'bg-amber-50 text-amber-600' },
    { label: 'Recenzii pending', value: stats.pendingReviews, icon: Star, color: 'bg-purple-50 text-purple-600' },
    { label: 'Venit lunar estimat', value: `${stats.monthlyRevenue} RON`, icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Statistici generale ZonaRo</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {STAT_CARDS.map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {pending.length > 0 && (
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Firme în așteptare ({stats.pendingBiz})</h2>
            <a href="/admin/firme?status=pending" className="text-xs text-brand-700 hover:underline">
              Vezi toate →
            </a>
          </div>
          <div className="space-y-2">
            {pending.map((biz: any) => (
              <div key={biz.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{biz.name}</p>
                  <p className="text-xs text-gray-500">{biz.city}, {biz.county}</p>
                </div>
                <a href={`/admin/firme/${biz.id}`} className="text-xs text-brand-700 font-medium hover:underline">
                  Verifică
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
