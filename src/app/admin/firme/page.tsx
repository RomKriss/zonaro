import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Search, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface SearchParams {
  status?: string;
  q?: string;
  page?: string;
}

const PER_PAGE = 25;

async function getBusinesses(params: SearchParams) {
  const supabase = await createClient();
  const page = parseInt(params.page ?? '1', 10);
  const offset = (page - 1) * PER_PAGE;

  let q = supabase
    .from('businesses')
    .select('id, name, city, county, plan, status, verified, created_at, user_id', { count: 'exact' });

  if (params.status) q = q.eq('status', params.status);
  if (params.q) q = q.ilike('name', `%${params.q}%`);

  const { data, count } = await q
    .order('created_at', { ascending: false })
    .range(offset, offset + PER_PAGE - 1);

  return { businesses: data ?? [], total: count ?? 0, page };
}

export default async function AdminFirmePage({ searchParams }: { searchParams: SearchParams }) {
  const { businesses, total, page } = await getBusinesses(searchParams);
  const totalPages = Math.ceil(total / PER_PAGE);

  const STATUS_ICONS: Record<string, React.ReactNode> = {
    active:    <CheckCircle2 className="h-4 w-4 text-green-500" />,
    pending:   <Clock className="h-4 w-4 text-amber-500" />,
    suspended: <XCircle className="h-4 w-4 text-red-500" />,
    unclaimed: <Search className="h-4 w-4 text-gray-400" />,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          Firme ({total.toLocaleString('ro-RO')})
        </h1>
      </div>

      {/* Filtre */}
      <form className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            name="q"
            defaultValue={searchParams.q}
            placeholder="Caută firmă..."
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <select
          name="status"
          defaultValue={searchParams.status ?? ''}
          className="py-2.5 px-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">Toate statusurile</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="suspended">Suspendate</option>
          <option value="unclaimed">Nerevendicate</option>
        </select>
        <button type="submit" className="px-4 py-2.5 bg-brand-700 text-white rounded-xl text-sm font-medium">
          Filtrează
        </button>
      </form>

      {/* Tabel */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Firmă</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 hidden sm:table-cell">Locație</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left font-medium text-gray-500 hidden md:table-cell">Plan</th>
              <th className="px-4 py-3 text-right font-medium text-gray-500">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {businesses.map((biz: any) => (
              <tr key={biz.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{biz.name}</p>
                  {biz.verified && (
                    <span className="text-xs text-green-600">✓ Verificat</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">
                  {biz.city}, {biz.county}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    {STATUS_ICONS[biz.status]}
                    <span className="capitalize text-gray-700">{biz.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <Badge variant={biz.plan as any} size="sm">{biz.plan}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/firme/${biz.id}`}
                    className="text-brand-700 text-xs font-medium hover:underline"
                  >
                    Detalii →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {businesses.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm">Nicio firmă găsită.</div>
        )}
      </div>

      {/* Paginare */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => (
            <Link
              key={i + 1}
              href={`/admin/firme?${new URLSearchParams({ ...searchParams, page: String(i + 1) })}`}
              className={`h-9 w-9 rounded-lg text-sm font-medium flex items-center justify-center transition-colors ${
                page === i + 1 ? 'bg-brand-700 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
