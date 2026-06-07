import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { sanityClient } from '@/sanity/client';
import { postsQuery } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';
import { Calendar, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog ZonaRo — Ghiduri și sfaturi pentru afaceri locale',
  description: 'Articole despre cum să îți promovezi afacerea, ghiduri pentru antreprenori locali și noutăți din comunitatea de business din estul României.',
  alternates: { canonical: '/blog' },
};

const CATEGORY_LABELS: Record<string, string> = {
  ghiduri: 'Ghiduri',
  sfaturi: 'Sfaturi',
  noutati: 'Noutăți',
  'afaceri-locale': 'Afaceri Locale',
  marketing: 'Marketing',
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await sanityClient.fetch(postsQuery).catch(() => []);

  return (
    <div className="container-page py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Blog ZonaRo</h1>
          <p className="text-gray-500 text-lg">
            Ghiduri, sfaturi și noutăți pentru antreprenorii din estul României.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-lg">Nu există articole publicate încă.</p>
            <p className="text-sm mt-2">Revino în curând!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post: any) => (
              <Link
                key={post._id}
                href={`/blog/${post.slug.current}`}
                className="group card overflow-hidden hover:shadow-md transition-shadow"
              >
                {post.mainImage && (
                  <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                    <Image
                      src={urlFor(post.mainImage).width(640).height(360).url()}
                      alt={post.mainImage.alt ?? post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    {post.category && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                        <Tag className="h-3 w-3" />
                        {CATEGORY_LABELS[post.category] ?? post.category}
                      </span>
                    )}
                    {post.publishedAt && (
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <Calendar className="h-3 w-3" />
                        {new Date(post.publishedAt).toLocaleDateString('ro-RO', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-brand-700 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-sm text-gray-500 line-clamp-3">{post.excerpt}</p>
                  )}
                  <span className="inline-block mt-4 text-sm font-medium text-brand-700 group-hover:underline">
                    Citește articolul →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
