import { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { BusinessCard } from '@/components/business/BusinessCard';
import { Button } from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/LoadingSpinner';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { JUDETE } from '@/lib/utils';
import type { Business } from '@/types';

const PER_PAGE = 20;

interface SearchParams {
  q?: string;
  category?: string;
  county?: string;
  city?: string;
  verified?: string;
  min_rating?: string;
  sort?: string;
  page?: string;
}

async function searchBusinesses(params: SearchParams) {
  try {
  const supabase = await createClient();
  const page = parseInt(params.page ?? '1', 10);
  const offset = (page - 1) * PER_PAGE;

  let query = supabase
    .from('businesses')
    .select(`
      *,
      category:categories(name, slug),
      photos(url, is_primary),
      services(id, name)
    `, { count: 'exact' })
    .eq('status', 'active');

  if (params.q) {
    query = query.or(`name.ilike.%${params.q}%,description_short.ilike.%${params.q}%`);
  }
  if (params.category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', params.category).single();
    if (cat) query = query.eq('category_id', cat.id);
  }
  if (params.county) {
    query = query.ilike('county', `%${params.county.replace(/-/g, ' ')}%`);
  }
  if (params.city) {
    query = query.ilike('city', `%${params.city.replace(/-/g, ' ')}%`);
  }
  if (params.verified === 'true') {
    query = query.eq('verified', true);
  }

  // Sortare — Elite și Pro primii
  const sort = params.sort ?? 'relevance';
  if (sort === 'alphabetic') {
    query = query.order('name');
  } else {
    // Plan descrescător (elite > pro > plus > free)
    query = query.order('plan', { ascending: false }).order('verified', { ascending: false });
  }

  query = query.range(offset, offset + PER_PAGE - 1);

  const { data, count, error } = await query;
  return { businesses: (data ?? []) as Business[], total: count ?? 0, page };
  } catch {
    return { businesses: [], total: 0, page: 1 };
  }
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const parts = [];
  if (searchParams.q) parts.push(searchParams.q);
  if (searchParams.county) parts.push(searchParams.county.replace(/-/g, ' '));

  return {
    title: parts.length > 0
      ? `Rezultate pentru "${parts.join(', ')}" — Firme și Meșteri`
      : 'Caută Firme și Meșteri în România',
  };
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const { businesses, total, page } = await searchBusinesses(searchParams);
  const totalPages = Math.ceil(total / PER_PAGE);

  const buildPageUrl = (p: number) => {
    const params = new URLSearchParams(searchParams as any);
    params.set('page', String(p));
    return `/cauta?${params.toString()}`;
  };

  return (
    <div className="container-page py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filtre */}
        <aside className="w-full lg:w-64 flex-shrink-0">
          <form className="card p-5 space-y-5 sticky top-20">
            <div className="flex items-center gap-2 font-semibold text-gray-900">
              <SlidersHorizontal className="h-4 w-4" />
              Filtre
            </div>

            {/* Căutare text */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Cuvânt cheie
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  name="q"
                  defaultValue={searchParams.q}
                  placeholder="Firmă sau serviciu..."
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Județ */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Județ
              </label>
              <select
                name="county"
                defaultValue={searchParams.county ?? ''}
                className="w-full py-2.5 px-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="">Toate județele</option>
                {JUDETE.map((j) => (
                  <option key={j} value={j.toLowerCase().replace(/\s/g, '-')}>
                    {j}
                  </option>
                ))}
              </select>
            </div>

            {/* Verificate */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="verified"
                name="verified"
                value="true"
                defaultChecked={searchParams.verified === 'true'}
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
              />
              <label htmlFor="verified" className="text-sm text-gray-700">
                Doar firme verificate
              </label>
            </div>

            {/* Sortare */}
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                Sortare
              </label>
              <select
                name="sort"
                defaultValue={searchParams.sort ?? 'relevance'}
                className="w-full py-2.5 px-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="relevance">Relevanță</option>
                <option value="alphabetic">Alfabetic</option>
              </select>
            </div>

            <Button type="submit" fullWidth size="sm">
              Aplică Filtrele
            </Button>

            <Link
              href="/cauta"
              className="block text-center text-xs text-gray-500 hover:text-gray-700"
            >
              Resetează filtrele
            </Link>
          </form>
        </aside>

        {/* Rezultate */}
        <div className="flex-1 min-w-0">
          {/* Header rezultate */}
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm text-gray-600">
              {total > 0 ? (
                <>
                  <span className="font-semibold text-gray-900">{total.toLocaleString('ro-RO')}</span>
                  {' '}firme găsite
                  {searchParams.q && <> pentru „<strong>{searchParams.q}</strong>"</>}
                </>
              ) : (
                'Nicio firmă găsită'
              )}
            </p>
          </div>

          {businesses.length === 0 ? (
            <div className="card p-12 text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Nicio firmă găsită</h3>
              <p className="text-gray-500 text-sm mb-4">
                Încearcă să modifici filtrele sau caută un termen mai general.
              </p>
              <Link href="/cauta">
                <Button variant="outline" size="sm">Resetează căutarea</Button>
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
                <Link href={buildPageUrl(page - 1)}>
                  <Button variant="outline" size="sm">
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                </Link>
              )}

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <Link key={p} href={buildPageUrl(p)}>
                      <button
                        className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                          p === page
                            ? 'bg-brand-700 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        {p}
                      </button>
                    </Link>
                  );
                })}
              </div>

              {page < totalPages && (
                <Link href={buildPageUrl(page + 1)}>
                  <Button variant="outline" size="sm">
                    Următor
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
