import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Globe, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { RatingDisplay } from '@/components/ui/StarRating';
import { getBusinessUrl } from '@/lib/utils';
import type { Business } from '@/types';

interface BusinessCardProps {
  business: Business;
}

const PLAN_BADGE: Record<string, React.ReactNode> = {
  elite: <Badge variant="elite" size="sm">⭐ Elite</Badge>,
  pro:   <Badge variant="pro" size="sm">Pro</Badge>,
  plus:  <Badge variant="plus" size="sm">Plus</Badge>,
  free:  null,
};

export function BusinessCard({ business }: BusinessCardProps) {
  const primaryPhoto = business.photos?.find((p) => p.is_primary) ?? business.photos?.[0];
  const url = getBusinessUrl(
    business.county,
    business.category?.slug ?? 'alte-servicii',
    business.slug
  );

  return (
    <article className="card hover:shadow-card-hover transition-all duration-200 overflow-hidden flex flex-col sm:flex-row">
      {/* Imagine */}
      <Link href={url} className="relative w-full sm:w-36 h-36 sm:h-auto flex-shrink-0 overflow-hidden bg-gray-100">
        {primaryPhoto ? (
          <Image
            src={primaryPhoto.url}
            alt={`${business.name} - poza principala`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 144px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100">
            <span className="text-4xl font-bold text-brand-300">{business.name[0]}</span>
          </div>
        )}
      </Link>

      {/* Conținut */}
      <div className="flex-1 p-4 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={url} className="font-semibold text-gray-900 hover:text-brand-700 transition-colors">
              {business.name}
            </Link>
            {business.verified && (
              <span title="Firmă Verificată" className="inline-flex items-center flex-shrink-0">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </span>
            )}
          </div>
          <div className="flex-shrink-0">
            {PLAN_BADGE[business.plan]}
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2 flex-wrap">
          <MapPin className="h-3.5 w-3.5" />
          <span>{business.city}, {business.county}</span>
          {business.category && (
            <>
              <span className="mx-0.5">·</span>
              <span>{business.category.name}</span>
            </>
          )}
        </div>

        {(business.avg_rating ?? 0) > 0 && (
          <div className="mb-2">
            <RatingDisplay
              rating={business.avg_rating ?? 0}
              count={business.review_count}
              size="sm"
            />
          </div>
        )}

        {business.description_short && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-3 flex-1">
            {business.description_short}
          </p>
        )}

        {/* Servicii preview */}
        {business.services && business.services.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {business.services.slice(0, 3).map((s) => (
              <span key={s.id} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                {s.name}
              </span>
            ))}
            {business.services.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                +{business.services.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer card */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-50">
          <div className="flex items-center gap-3">
            {business.phone && (
              <a
                href={`tel:${business.phone}`}
                className="flex items-center gap-1 text-xs text-brand-700 font-medium hover:text-brand-800"
                onClick={(e) => e.stopPropagation()}
              >
                <Phone className="h-3.5 w-3.5" />
                {business.phone}
              </a>
            )}
            {business.website && (business.plan === 'pro' || business.plan === 'elite') && (
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <Globe className="h-3.5 w-3.5" />
                Website
              </a>
            )}
          </div>
          <Link
            href={url}
            className="text-xs font-medium text-brand-700 hover:text-brand-800 hover:underline"
          >
            Vezi profil →
          </Link>
        </div>
      </div>
    </article>
  );
}
