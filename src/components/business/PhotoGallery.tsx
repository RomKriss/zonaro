'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import type { Photo } from '@/types';

interface PhotoGalleryProps {
  photos: Photo[];
  businessName: string;
}

export function PhotoGallery({ photos, businessName }: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (photos.length === 0) return null;

  const sorted = [...photos].sort((a, b) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return a.order_index - b.order_index;
  });

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prev = () => setLightboxIndex((i) => (i! > 0 ? i! - 1 : sorted.length - 1));
  const next = () => setLightboxIndex((i) => (i! < sorted.length - 1 ? i! + 1 : 0));

  return (
    <>
      <div className={`grid gap-2 ${sorted.length === 1 ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'}`}>
        {sorted.slice(0, 6).map((photo, i) => (
          <button
            key={photo.id}
            onClick={() => openLightbox(i)}
            className={`relative overflow-hidden rounded-xl bg-gray-100 group ${
              i === 0 && sorted.length > 1 ? 'col-span-2 md:col-span-2 row-span-2' : ''
            }`}
            style={{ height: i === 0 && sorted.length > 1 ? '300px' : '140px' }}
          >
            <Image
              src={photo.url}
              alt={`${businessName} - foto ${i + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            {i === 5 && sorted.length > 6 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-semibold text-lg">+{sorted.length - 6}</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
            onClick={closeLightbox}
          >
            <X className="h-6 w-6" />
          </button>

          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 bg-black/30 rounded-full"
            onClick={(e) => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div
            className="relative max-w-4xl max-h-[85vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={sorted[lightboxIndex].url}
              alt={`${businessName} - foto ${lightboxIndex + 1}`}
              width={1200}
              height={800}
              className="object-contain max-h-[85vh] mx-auto rounded-lg"
            />
            <p className="text-center text-gray-400 text-sm mt-2">
              {lightboxIndex + 1} / {sorted.length}
            </p>
          </div>

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 p-2 bg-black/30 rounded-full"
            onClick={(e) => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
