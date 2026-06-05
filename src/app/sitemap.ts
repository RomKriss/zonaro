import { MetadataRoute } from 'next';
import { createServiceClient } from '@/lib/supabase/server';
import { generateSlug } from '@/lib/utils';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://zonaro.ro';

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/cauta`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${siteUrl}/inregistrare`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ];

  try {
    const supabase = createServiceClient();

    const { data: businesses } = await supabase
      .from('businesses')
      .select('slug, county, updated_at, category:categories(slug)')
      .eq('status', 'active')
      .limit(5000);

    const businessPages: MetadataRoute.Sitemap = (businesses ?? []).map((biz: any) => ({
      url: `${siteUrl}/${generateSlug(biz.county)}/${biz.category?.slug ?? 'alte-servicii'}/${biz.slug}`,
      lastModified: new Date(biz.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const { data: categories } = await supabase
      .from('categories')
      .select('slug')
      .is('parent_id', null);

    const categoryPages: MetadataRoute.Sitemap = (categories ?? []).map((cat: any) => ({
      url: `${siteUrl}/cauta?category=${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticPages, ...businessPages, ...categoryPages];
  } catch {
    return staticPages;
  }
}
