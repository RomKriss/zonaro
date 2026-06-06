import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PhotoGallery } from '@/components/business/PhotoGallery';
import { ContactForm } from '@/components/business/ContactForm';
import { ReviewSection } from '@/components/business/ReviewSection';
import { Badge } from '@/components/ui/Badge';
import { RatingDisplay } from '@/components/ui/StarRating';
import { Button } from '@/components/ui/Button';
import { MapPin, Phone, Mail, Globe, CheckCircle2, Share2, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { ReportFraudButton } from '@/components/business/ReportFraudModal';
import type { Business, Review } from '@/types';

interface PageProps {
  params: { judet: string; categorie: string; slug: string };
}

async function getBusiness(slug: string) {
  try {
    const supabase = await createClient();

    const { data: biz } = await supabase
      .from('businesses')
      .select(`
        *,
        category:categories(name, slug),
        photos(id, url, is_primary, order_index),
        services(id, name, description, price_range, order_index)
      `)
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (!biz) return null;

    const { data: reviews } = await supabase
      .from('reviews')
      .select('*')
      .eq('business_id', biz.id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    // Incrementează vizite (fire-and-forget)
    supabase
      .from('businesses')
      .update({ profile_views: (biz.profile_views ?? 0) + 1 })
      .eq('id', biz.id)
      .then(() => {});

    const avgRating = reviews && reviews.length > 0
      ? reviews.reduce((s: number, r: Review) => s + r.rating, 0) / reviews.length
      : 0;

    return { biz: biz as Business, reviews: (reviews ?? []) as Review[], avgRating };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = await getBusiness(params.slug);
  if (!result) return { title: 'Firmă negăsită' };

  const { biz } = result;
  const catName = biz.category?.name ?? '';

  return {
    title: `${biz.name} — ${catName} în ${biz.city}`,
    description: biz.description_short
      ?? `${biz.name} oferă servicii de ${catName} în ${biz.city}, ${biz.county}. Recenzii reale, contact direct.`,
    alternates: { canonical: `/${params.judet}/${params.categorie}/${params.slug}` },
    openGraph: {
      title: `${biz.name} — ${catName} în ${biz.city} | ZonaRo`,
      description: biz.description_short ?? '',
      images: biz.photos?.[0]?.url ? [{ url: biz.photos[0].url }] : [],
      type: 'website',
    },
  };
}

export default async function BusinessProfilePage({ params }: PageProps) {
  const result = await getBusiness(params.slug);
  if (!result) notFound();

  const { biz, reviews, avgRating } = result;
  const countySlug = params.judet;
  const countyDisplay = biz.county;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: biz.name,
    description: biz.description_short ?? undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: biz.address ?? undefined,
      addressLocality: biz.city,
      addressRegion: biz.county,
      addressCountry: 'RO',
    },
    telephone: biz.phone ?? undefined,
    email: biz.email ?? undefined,
    url: biz.website ?? undefined,
    image: biz.photos?.[0]?.url ?? undefined,
    aggregateRating: reviews.length > 0 ? {
      '@type': 'AggregateRating',
      ratingValue: avgRating.toFixed(1),
      reviewCount: reviews.length,
    } : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-page py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-brand-700">Acasă</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/cauta?county=${countySlug}`} className="hover:text-brand-700">{countyDisplay}</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href={`/${countySlug}/${biz.category?.slug}`} className="hover:text-brand-700">
            {biz.category?.name}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-900 font-medium truncate">{biz.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Conținut principal */}
          <div className="lg:col-span-2 space-y-8">
            <div className="card p-6">
              {biz.photos && biz.photos.length > 0 && (
                <div className="mb-6">
                  <PhotoGallery photos={biz.photos} businessName={biz.name} />
                </div>
              )}

              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{biz.name}</h1>
                    {biz.verified && (
                      <span title="Firmă Verificată">
                        <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {biz.plan === 'elite' && <Badge variant="elite">⭐ Partener Elite</Badge>}
                    {biz.plan === 'pro' && <Badge variant="pro">Pro</Badge>}
                    {biz.plan === 'plus' && <Badge variant="plus">Plus</Badge>}
                    {biz.verified && <Badge variant="verified">✓ Firmă Verificată</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500" title="Distribuie">
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {reviews.length > 0 && (
                <div className="mt-3">
                  <RatingDisplay rating={avgRating} count={reviews.length} size="md" />
                </div>
              )}

              <div className="flex items-center gap-2 mt-3 text-gray-500 text-sm">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{biz.address ? `${biz.address}, ` : ''}{biz.city}, {biz.county}</span>
              </div>

              {biz.category && (
                <div className="mt-2">
                  <Link
                    href={`/${countySlug}/${biz.category.slug}`}
                    className="inline-flex items-center gap-1 text-xs text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full hover:bg-brand-100"
                  >
                    {biz.category.name}
                  </Link>
                </div>
              )}

              {biz.youtube_url && (biz.plan === 'pro' || biz.plan === 'elite') && (
                <div className="mt-4">
                  <div className="aspect-video rounded-xl overflow-hidden bg-black">
                    <iframe
                      src={biz.youtube_url.replace('watch?v=', 'embed/')}
                      title={`Video ${biz.name}`}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>

            {(biz.description_long || biz.description_short) && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Despre firmă</h2>
                <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {biz.description_long ?? biz.description_short}
                </div>
              </div>
            )}

            {biz.services && biz.services.length > 0 && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Servicii oferite</h2>
                <div className="space-y-3">
                  {biz.services
                    .sort((a, b) => a.order_index - b.order_index)
                    .map((service) => (
                      <div key={service.id} className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
                        <div>
                          <p className="font-medium text-gray-900">{service.name}</p>
                          {service.description && (
                            <p className="text-sm text-gray-500 mt-0.5">{service.description}</p>
                          )}
                        </div>
                        {service.price_range && (
                          <span className="text-sm font-semibold text-brand-700 whitespace-nowrap flex-shrink-0">
                            {service.price_range}
                          </span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recenzii ({reviews.length})
              </h2>
              <ReviewSection businessId={biz.id} reviews={reviews} canReply={false} />
            </div>

            {biz.address && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Locație</h2>
                <div className="rounded-xl overflow-hidden h-64">
                  <iframe
                    title={`Harta ${biz.name}`}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(`${biz.address}, ${biz.city}, ${biz.county}`)}&output=embed`}
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar contact */}
          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact</h2>
              <div className="space-y-3">
                {biz.phone && (
                  <a
                    href={`tel:${biz.phone}`}
                    className="flex items-center gap-3 w-full bg-brand-700 hover:bg-brand-800 text-white rounded-xl px-4 py-3 font-semibold transition-colors"
                  >
                    <Phone className="h-5 w-5" />
                    {biz.phone}
                  </a>
                )}
                {biz.email && (
                  <a
                    href={`mailto:${biz.email}`}
                    className="flex items-center gap-3 w-full border border-brand-200 hover:bg-brand-50 text-brand-700 rounded-xl px-4 py-3 font-medium transition-colors text-sm"
                  >
                    <Mail className="h-4 w-4" />
                    {biz.email}
                  </a>
                )}
                {biz.website && (biz.plan === 'pro' || biz.plan === 'elite') && (
                  <a
                    href={biz.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 w-full border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl px-4 py-3 font-medium transition-colors text-sm"
                  >
                    <Globe className="h-4 w-4" />
                    Vizitează website-ul
                  </a>
                )}
              </div>

              {biz.address && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>{biz.address}, {biz.city}, {biz.county}</span>
                </div>
              )}
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Trimite un mesaj</h2>
              <ContactForm businessId={biz.id} businessName={biz.name} />
            </div>

            {!biz.user_id && (
              <div className="card p-5 bg-amber-50 border-amber-200">
                <p className="text-sm font-medium text-amber-900 mb-2">Ești proprietarul acestei firme?</p>
                <p className="text-xs text-amber-700 mb-3">
                  Revendică profilul și completează informațiile pentru a atrage mai mulți clienți.
                </p>
                <Link href={`/revendica/${biz.id}`}>
                  <Button size="sm" variant="secondary" fullWidth>
                    Revendică Profilul
                  </Button>
                </Link>
              </div>
            )}

            {/* Raportare fraudă — vizibil doar pentru firme active/revendicate */}
            {(biz.status === 'active') && (
              <div className="px-1">
                <ReportFraudButton businessId={biz.id} businessName={biz.name} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
