import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Users } from 'lucide-react';

async function getWaitlist() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('waitlist')
      .select('*')
      .order('created_at', { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

async function checkAdminAuth() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/autentificare');
    const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
    if (data?.role !== 'admin') redirect('/');
  } catch (e: any) {
    if (e?.digest) throw e;
    redirect('/');
  }
}

export default async function WaitlistAdminPage() {
  await checkAdminAuth();
  const entries = await getWaitlist();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lista de așteptare</h1>
          <p className="text-sm text-gray-500 mt-1">
            {entries.length} {entries.length === 1 ? 'înregistrare' : 'înregistrări'}
          </p>
        </div>
        <a
          href="/api/admin/waitlist?format=csv"
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ↓ Exportă CSV
        </a>
      </div>

      {entries.length === 0 ? (
        <div className="card p-16 text-center">
          <Users className="h-12 w-12 mx-auto mb-3 text-gray-200" />
          <p className="text-gray-400">Nicio înregistrare încă.</p>
          <p className="text-xs text-gray-300 mt-1">
            Înregistrările apar când vizitatorii se înscriu din site.
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Nume', 'Email', 'Telefon', 'Firmă', 'Categorie', 'Oraș', 'Data'].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry: any, i: number) => (
                  <tr
                    key={entry.id}
                    className={`border-b border-gray-50 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}
                  >
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {entry.name}
                    </td>
                    <td className="px-4 py-3 text-brand-700">{entry.email}</td>
                    <td className="px-4 py-3 text-gray-500">{entry.phone ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{entry.company_name ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{entry.company_category ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-500">{entry.city ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">
                      {new Date(entry.created_at).toLocaleDateString('ro-RO', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
