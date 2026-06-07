import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { sanityClient } from '@/sanity/client';
import { postBySlugQuery, postSlugsQuery } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';
import { Calendar, Tag, ChevronLeft } from 'lucide-react';

interface PageProps {
  params: { slug: string };
}

const CATEGORY_LABELS: Record<string, string> = {
  ghiduri: 'Ghiduri',
  sfaturi: 'Sfaturi',
  noutati: 'Noutăți',
  'afaceri-locale': 'Afaceri Locale',
  marketing: 'Marketing',
};

export const revalidate = 60;
export const dynamicParams = true;

export async function generateStaticParams() {
  try {
    const slugs = await sanityClient.fetch(postSlugsQuery);
    return (slugs ?? []).map((s: { slug: string }) => ({ slug: s.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await sanityClient.fetch(postBySlugQuery, { slug: params.slug }).catch(() => null);
  if (!post) return { title: 'Articol negăsit' };

  return {
    title: post.seoTitle ?? `${post.title} — Blog ZonaRo`,
    description: post.seoDescription ?? post.excerpt ?? '',
    alternates: { canonical: `/blog/${params.slug}` },
    openGraph: {
      title: post.seoTitle ?? post.title,
      description: post.seoDescription ?? post.excerpt ?? '',
      type: 'article',
      publishedTime: post.publishedAt,
      images: post.mainImage
        ? [{ url: urlFor(post.mainImage).width(1200).height(630).url() }]
        : [],
    },
  };
}

const ptComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-8">
          <div className="relative w-full rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
            <Image
              src={urlFor(value).width(900).url()}
              alt={value.alt ?? ''}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-gray-400 mt-2">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
  },
};

export default async function BlogPostPage({ params }: PageProps) {
  const post = await sanityClient.fetch(postBySlugQuery, { slug: params.slug }).catch(() => null);
  if (!post) notFound();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt ?? '',
    datePublished: post.publishedAt,
    publisher: { '@type': 'Organization', name: 'ZonaRo', url: 'https://zonaro.ro' },
    image: post.mainImage ? urlFor(post.mainImage).width(1200).height(630).url() : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="container-page py-10">
        <div className="max-w-2xl mx-auto">
          {/* Back */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-700 mb-8 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Înapoi la blog
          </Link>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            {post.category && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
                <Tag className="h-3 w-3" />
                {CATEGORY_LABELS[post.category] ?? post.category}
              </span>
            )}
            {post.publishedAt && (
              <span className="flex items-center gap-1.5 text-sm text-gray-400">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.publishedAt).toLocaleDateString('ro-RO', {
                  day: 'numeric', month: 'long', year: 'numeric',
                })}
              </span>
            )}
          </div>

          <h1 className="font-bold text-gray-900 mb-4" style={{ fontSize: 'var(--ty-blog-h1)', lineHeight: 'var(--ty-lh-heading)' }}>
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="text-gray-500 mb-8" style={{ fontSize: 'var(--ty-body)', lineHeight: 'var(--ty-lh-body)' }}>
              {post.excerpt}
            </p>
          )}

          {post.mainImage && (
            <div className="relative w-full rounded-2xl overflow-hidden mb-10" style={{ aspectRatio: '16/9' }}>
              <Image
                src={urlFor(post.mainImage).width(900).height(506).url()}
                alt={post.mainImage.alt ?? post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 720px"
              />
            </div>
          )}

          {/* Body */}
          {post.body && (
            <div className="blog-content text-gray-800">
              <PortableText value={post.body} components={ptComponents} />
            </div>
          )}

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-brand-700 hover:underline"
            >
              <ChevronLeft className="h-4 w-4" />
              Vezi toate articolele
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
