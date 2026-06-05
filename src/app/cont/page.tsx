import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getPlanConfig, getBusinessUrl, formatDate } from '@/lib/utils';
import {
  Eye, Phone, Mail, Star, TrendingUp,
  AlertCircle, ArrowRight, CheckCircle2, Clock
} from 'lucide-react';

async function getDashboardData(userId: string) {
  const supabase = await createClient();

  const { data: biz } = await supabase
    .from('businesses')
    .select('*, category:categories(name, slug)')
    .eq('user_id', userId)
    .single();

  if (!biz) return null;

  const { count: pendingReviews } = await supabase
    .from('reviews')
    .select('id', { count: 'exact' })
    .eq('business_id', biz.id)
    .eq('status', 'approved');

  const { count: unreadMessages } = await supabase
    .from('contact_messages')
    .select('id', { count: 'exact' })
    .eq('business_id', biz.id)
    .eq('read', false);

  const { data: reviews } = await supabase
    .from('reviews')
    .select('rating')
    .eq('business_id', biz.id)
    .eq('status', 'approved');

  const avgRating = reviews && reviews.length > 0
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  return { biz, pendingReviews: pendingReviews ?? 0, unreadMessages: unreadMessages ?? 0, avgRating, reviewCount: reviews?.length ?? 0 };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/autentificare');

  const data = await getDashboardData(user.id);
  if (!data) {
    return (
      <div className="card p-8 text-center">
        <AlertCircle className="h-12 w-12 text-amber-400 mx-auto mb-3" />
        <h2 className="font-semibold text-gray-900 mb-2">Nu ai un profil de firmă</h2>
        <p className="text-gray-500 text-sm mb-4">Creează-ți profilul pentru a apărea în directorul ZonaRo.</p>
        <Link href="/inregistrare"><Button>Creează Profil</Button></Link>
      </div>
    );
  }

  const { biz, pendingReviews, unreadMessages, avgRating, reviewCount } = data;
  const plan = getPlanConfig(biz.plan);
  const profileUrl = getBusinessUrl(biz.county, biz.category?.slug ?? 'alte-servicii', biz.slug);

  const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    active:    { label: 'Activ', color: 'text-green-600 bg-green-50' },
    pending:   { label: 'În verificare', color: 'text-amber-600 bg-amber-50' },
    unclaimed: { label: 'Nerevendicat', color: 'text-gray-600 bg-gray-100' },
    suspended: { label: 'Suspendat', color: 'text-red-600 bg-red-50' },
  };
  const statusInfo = STATUS_LABELS[biz.status] ?? STATUS_LABELS.pending;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{biz.name}</h1>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
            <Badge variant={biz.plan as any}>{plan.name}</Badge>
            {biz.verified && <Badge variant="verified">✓ Verificat</Badge>}
          </div>
        </div>
        <Link href={profileUrl} target="_blank">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
            Vezi profilul public
          </Button>
        </Link>
      </div>

      {/* Alert profil incomplet */}
      {biz.status === 'pending' && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <Clock className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-900">Profilul tău este în verificare</p>
            <p className="text-sm text-amber-700 mt-0.5">
              Echipa ZonaRo verifică informațiile. Vei fi notificat prin email când profilul devine activ.
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Vizite profil', value: biz.profile_views, icon: Eye, color: 'text-blue-600 bg-blue-50' },
          { label: 'Click-uri telefon', value: biz.phone_clicks, icon: Phone, color: 'text-green-600 bg-green-50' },
          { label: 'Mesaje primite', value: unreadMessages, icon: Mail, color: 'text-purple-600 bg-purple-50', alert: unreadMessages > 0 },
          { label: 'Rating mediu', value: avgRating > 0 ? avgRating.toFixed(1) : '—', icon: Star, color: 'text-amber-600 bg-amber-50' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
            {stat.alert && (
              <span className="inline-block mt-1 text-xs text-purple-600 font-medium">Nou!</span>
            )}
          </div>
        ))}
      </div>

      {/* Acțiuni rapide */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { href: '/cont/profil', title: 'Editare profil', desc: 'Actualizează informațiile firmei', icon: CheckCircle2 },
          { href: '/cont/poze', title: 'Gestionare poze', desc: `${(biz as any).photos?.length ?? 0}/${plan.limits.photos} poze încărcate`, icon: TrendingUp },
          { href: '/cont/recenzii', title: 'Recenzii', desc: `${reviewCount} recenzii, ${pendingReviews} aprobate`, icon: Star },
          { href: '/cont/abonament', title: 'Abonament', desc: `Plan ${plan.name} — ${plan.price_monthly === 0 ? 'Gratuit' : `${plan.price_monthly} RON/lună`}`, icon: ArrowRight },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="card p-4 hover:shadow-card-hover transition-all flex items-center gap-4">
            <div className="p-2.5 rounded-xl bg-brand-50">
              <item.icon className="h-5 w-5 text-brand-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{item.title}</p>
              <p className="text-xs text-gray-500 truncate">{item.desc}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </Link>
        ))}
      </div>

      {/* Upgrade CTA dacă e pe free */}
      {biz.plan === 'free' && (
        <div className="card p-6 bg-gradient-to-r from-brand-700 to-brand-600 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-bold text-lg">Upgradează la Pro</h3>
              <p className="text-blue-200 text-sm mt-1">
                Obține mai multă vizibilitate, 15 poze, badge Verificat și statistici avansate.
              </p>
            </div>
            <Link href="/cont/abonament">
              <Button variant="secondary" size="sm" className="shrink-0">
                Vezi planurile →
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
