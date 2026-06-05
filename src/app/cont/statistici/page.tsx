import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Eye, Phone, Mail, Star, TrendingUp, Lock } from 'lucide-react';

async function getStats(userId: string) {
  const supabase = await createClient();
  const { data: biz } = await supabase.from('businesses').select('*').eq('user_id', userId).single();
  if (!biz) return null;

  const { data: messages } = await supabase
    .from('contact_messages')
    .select('created_at')
    .eq('business_id', biz.id)
    .order('created_at', { ascending: false })
    .limit(50);

  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating, created_at')
    .eq('business_id', biz.id)
    .eq('status', 'approved');

  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return { biz, messages: messages ?? [], reviews: reviews ?? [], avgRating };
}

export default async function StatisticiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/autentificare');

  const data = await getStats(user.id);
  if (!data) return <div className="card p-8 text-center text-gray-500">Nicio firmă găsită.</div>;

  const { biz, messages, reviews, avgRating } = data;
  const isPro = biz.plan === 'pro' || biz.plan === 'elite';

  const STATS = [
    { label: 'Vizite profil (total)', value: biz.profile_views, icon: Eye, color: 'bg-blue-50 text-blue-600' },
    { label: 'Click-uri telefon', value: biz.phone_clicks, icon: Phone, color: 'bg-green-50 text-green-600', pro: true },
    { label: 'Mesaje prin formular', value: biz.contact_form_sends, icon: Mail, color: 'bg-purple-50 text-purple-600', pro: true },
    { label: 'Recenzii aprobate', value: reviews.length, icon: Star, color: 'bg-amber-50 text-amber-600' },
    { label: 'Rating mediu', value: avgRating > 0 ? avgRating.toFixed(1) : '—', icon: TrendingUp, color: 'bg-rose-50 text-rose-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Statistici</h1>
        <p className="text-gray-500 text-sm mt-1">Performanța profilului tău pe ZonaRo</p>
      </div>

      {!isPro && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex items-start gap-3">
          <Lock className="h-5 w-5 text-brand-600 flex-shrink-0" />
          <div>
            <p className="text-sm text-brand-800 font-medium">Statistici complete disponibile în planul Pro</p>
            <p className="text-xs text-brand-600 mt-0.5">
              <a href="/cont/abonament" className="underline">Upgradează la Pro</a> pentru a vedea click-uri telefon, mesaje și rapoarte detaliate.
            </p>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className={`card p-5 ${stat.pro && !isPro ? 'opacity-50' : ''}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              {stat.pro && !isPro
                ? <Lock className="h-5 w-5" />
                : <stat.icon className="h-5 w-5" />}
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.pro && !isPro ? '—' : stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Ultimele mesaje */}
      {messages.length > 0 && (
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Ultimele mesaje primite</h2>
          <div className="space-y-2">
            {messages.slice(0, 10).map((m: any, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0 text-sm">
                <span className="text-gray-600">Contact nou</span>
                <span className="text-gray-400 text-xs">{new Date(m.created_at).toLocaleDateString('ro-RO')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
