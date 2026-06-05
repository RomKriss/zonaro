import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BusinessCard } from '@/components/business/BusinessCard';
import { Button } from '@/components/ui/Button';
import { MapPin, Grid3X3, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import type { Business } from '@/types';

const PER_PAGE = 20;

interface PageProps {
  params: { judet: string; categorie: string };
  searchParams: { page?: string };
}

async function getData(judet: string, categorie: string, page: number) {
  try {
  const supabase = await createClient();

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', categorie)
    .single();

  if (!category) return null;

  const offset = (page - 1) * PER_PAGE;
  const countyName = judet.replace(/-/g, ' ');

  const { data, count } = await supabase
    .from('businesses')
    .select(`*, category:categories(name,slug), photos(url,is_primary), services(id,name)`, { count: 'exact' })
    .eq('status', 'active')
    .eq('category_id', category.id)
    .ilike('county', `%${countyName}%`)
    .order('plan', { ascending: false })
    .order('verified', { ascending: false })
    .range(offset, offset + PER_PAGE - 1);

  return { category, businesses: (data ?? []) as Business[], total: count ?? 0 };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
  const supabase = await createClient();
  const { data: cat } = await supabase.from('categories').select('name').eq('slug', params.categorie).single();
  const county = params.judet.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const catName = cat?.name ?? params.categorie;

  return {
    title: `${catName} în ${county} — Firme și Meșteri`,
    description: `Găsește firme de ${catName} în ${county}. Recenzii verificate, contact direct, prețuri transparente.`,
    alternates: { canonical: `/${params.judet}/${params.categorie}` },
  };
  } catch {
    return { title: params.categorie };
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const page = parseInt(searchParams.page ?? '1', 10);
  const result = await getData(params.judet, params.categorie, page);

  if (!result) notFound();

  const { category, businesses, total } = result;
  const totalPages = Math.ceil(total / PER_PAGE);
  const countyDisplay = params.judet.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="container-page py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-700">Acasă</Link>
        <span>/</span>
        <Link href={`/cauta?county=${params.judet}`} className="hover:text-brand-700">{countyDisplay}</Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{category.name}</span>
      </nav>

      {/* Header pagină */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
          <MapPin className="h-4 w-4" />
          {countyDisplay}
          <span>·</span>
          <Grid3X3 className="h-4 w-4" />
          {category.name}
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          {category.name} în {countyDisplay}
        </h1>
        <p className="text-gray-500 mt-2">
          {total > 0
            ? `${total} firme și meșteri găsiți`
            : 'Nicio firmă înregistrată în această categorie'}
        </p>
      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: `${category.name} în ${countyDisplay}`,
            numberOfItems: total,
          }),
        }}
      />

      {businesses.length === 0 ? (
        <div className="card p-12 text-center">
          <p className="text-gray-500 mb-4">Nu există firme în această categorie și locație.</p>
          <Link href={`/cauta?category=${params.categorie}`}>
            <Button variant="outline">Caută în toată România</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {businesses.map((biz) => (
            <BusinessCard key={biz.id} business={biz} />
          ))}
        </div>
      )}

      {/* Paginare */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {page > 1 && (
            <Link href={`/${params.judet}/${params.categorie}?page=${page - 1}`}>
              <Button variant="outline" size="sm"><ChevronLeft className="h-4 w-4" />Anterior</Button>
            </Link>
          )}
          <span className="text-sm text-gray-500">Pagina {page} din {totalPages}</span>
          {page < totalPages && (
            <Link href={`/${params.judet}/${params.categorie}?page=${page + 1}`}>
              <Button variant="outline" size="sm">Următor<ChevronRight className="h-4 w-4" /></Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
