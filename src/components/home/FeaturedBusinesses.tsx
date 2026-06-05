import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/Badge';
import { RatingDisplay } from '@/components/ui/StarRating';
import { MapPin, Phone } from 'lucide-react';
import { getBusinessUrl } from '@/lib/utils';
import type { Business } from '@/types';

async function getFeaturedBusinesses(): Promise<Business[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('businesses')
      .select(`
        *,
        category:categories(name, slug),
        photos(url, is_primary)
      `)
      .eq('status', 'active')
      .in('plan', ['elite', 'pro'])
      .order('plan', { ascending: false })
      .limit(6);
    return data ?? [];
  } catch {
    return [];
  }
}

export async function FeaturedBusinesses() {
  const businesses = await getFeaturedBusinesses();

  if (businesses.length === 0) return null;

  return (
    <section className="py-16 container-page">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="section-title">Firme Verificate și Recomandate</h2>
          <p className="section-subtitle">Parteneri de încredere cu badge verificat</p>
        </div>
        <Link
          href="/cauta?verified=true"
          className="hidden sm:flex text-sm font-medium text-brand-700 hover:text-brand-800 items-center gap-1"
        >
          Vezi toate →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {businesses.map((biz) => {
          const primaryPhoto = biz.photos?.find((p: any) => p.is_primary) ?? biz.photos?.[0];
          const url = getBusinessUrl(biz.county, biz.category?.slug ?? 'alte-servicii', biz.slug);

          return (
            <Link key={biz.id} href={url} className="group card hover:shadow-card-hover transition-all duration-200 overflow-hidden">
              {/* Imagine */}
              <div className="relative h-44 bg-gray-100 overflow-hidden">
                {primaryPhoto ? (
                  <Image
                    src={primaryPhoto.url}
                    alt={biz.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100">
                    <span className="text-4xl font-bold text-brand-200">{biz.name[0]}</span>
                  </div>
                )}
                {/* Badge plan */}
                <div className="absolute top-3 left-3">
                  {biz.plan === 'elite' && (
                    <Badge variant="elite">⭐ Partener Elite</Badge>
                  )}
                  {biz.plan === 'pro' && biz.verified && (
                    <Badge variant="verified">✓ Verificat</Badge>
                  )}
                </div>
              </div>

              {/* Conținut */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">
                  {biz.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-1 mb-2 text-xs text-gray-500">
                  <MapPin className="h-3.5 w-3.5" />
                  {biz.city}, {biz.county}
                  {biz.category && (
                    <>
                      <span className="mx-1">·</span>
                      {biz.category.name}
                    </>
                  )}
                </div>
                {(biz.avg_rating ?? 0) > 0 && (
                  <RatingDisplay
                    rating={biz.avg_rating ?? 0}
                    count={biz.review_count}
                    size="sm"
                  />
                )}
                {biz.description_short && (
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                    {biz.description_short}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
