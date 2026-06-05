import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Shield, Clock, CheckCircle2 } from 'lucide-react';

async function getClaimRequests() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('claim_requests')
    .select('*, business:businesses(id, name, city, county)')
    .order('sent_at', { ascending: false })
    .limit(50);
  return data ?? [];
}

export default async function AdminClaimPage() {
  const claims = await getClaimRequests();

  const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
    pending: { label: 'Pending', icon: <Clock className="h-4 w-4" />, color: 'text-amber-600 bg-amber-50' },
    claimed: { label: 'Revendicat', icon: <CheckCircle2 className="h-4 w-4" />, color: 'text-green-600 bg-green-50' },
    expired: { label: 'Expirat', icon: <Clock className="h-4 w-4" />, color: 'text-gray-500 bg-gray-100' },
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cereri Revendicare Profile</h1>
        <p className="text-gray-500 text-sm mt-1">{claims.length} cereri total</p>
      </div>

      {claims.length === 0 ? (
        <div className="card p-8 text-center">
          <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Nicio cerere de revendicare.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Firmă</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 hidden sm:table-cell">Email solicitant</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                <th className="px-4 py-3 text-left font-medium text-gray-500 hidden md:table-cell">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {claims.map((claim: any) => {
                const cfg = STATUS_CONFIG[claim.status] ?? STATUS_CONFIG.pending;
                return (
                  <tr key={claim.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{claim.business?.name ?? '—'}</p>
                      <p className="text-xs text-gray-400">{claim.business?.city}, {claim.business?.county}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 hidden sm:table-cell">{claim.email}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>
                        {cfg.icon}
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">
                      {formatDate(claim.sent_at)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
