'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle2, XCircle, Shield, AlertTriangle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminFirmaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const supabase = createClient();

  const [biz, setBiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    supabase
      .from('businesses')
      .select('*, category:categories(name), photos(url, is_primary)')
      .eq('id', id)
      .single()
      .then(({ data }) => { setBiz(data); setLoading(false); });
  }, [id]);

  const handleAction = async (action: 'approve' | 'reject' | 'verify' | 'suspend') => {
    setActionLoading(action);
    const updates: Record<string, any> = {
      approve:  { status: 'active' },
      reject:   { status: 'suspended' },
      verify:   { verified: true, status: 'active' },
      suspend:  { status: 'suspended' },
    };
    await supabase.from('businesses').update(updates[action]).eq('id', id);
    setBiz((prev: any) => ({ ...prev, ...updates[action] }));
    setActionLoading('');
  };

  if (loading) return <div className="text-gray-500 p-8">Se încarcă...</div>;
  if (!biz) return <div className="text-gray-500 p-8">Firma nu a fost găsită.</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <button onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1">
            ← Înapoi la lista firme
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{biz.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={biz.plan as any}>{biz.plan}</Badge>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
              biz.status === 'active' ? 'bg-green-100 text-green-700' :
              biz.status === 'pending' ? 'bg-amber-100 text-amber-700' :
              'bg-red-100 text-red-700'
            }`}>{biz.status}</span>
            {biz.verified && <Badge variant="verified">✓ Verificat</Badge>}
          </div>
        </div>

        {/* Acțiuni rapide */}
        <div className="flex flex-wrap gap-2">
          {biz.status === 'pending' && (
            <>
              <Button size="sm" onClick={() => handleAction('verify')} loading={actionLoading === 'verify'}>
                <Shield className="h-4 w-4" />
                Aprobă + Verifică
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleAction('approve')} loading={actionLoading === 'approve'}>
                <CheckCircle2 className="h-4 w-4" />
                Aprobă
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleAction('reject')} loading={actionLoading === 'reject'}>
                <XCircle className="h-4 w-4" />
                Respinge
              </Button>
            </>
          )}
          {biz.status === 'active' && !biz.verified && (
            <Button size="sm" onClick={() => handleAction('verify')} loading={actionLoading === 'verify'}>
              <Shield className="h-4 w-4" />
              Acordă badge Verificat
            </Button>
          )}
          {biz.status === 'active' && (
            <Button size="sm" variant="danger" onClick={() => handleAction('suspend')} loading={actionLoading === 'suspend'}>
              <AlertTriangle className="h-4 w-4" />
              Suspendă
            </Button>
          )}
        </div>
      </div>

      {/* Detalii */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Informații</h2>
          <dl className="space-y-2 text-sm">
            {[
              { label: 'CUI', value: biz.cui },
              { label: 'Telefon', value: biz.phone },
              { label: 'Email', value: biz.email },
              { label: 'Website', value: biz.website },
              { label: 'Adresa', value: biz.address },
              { label: 'Oraș', value: biz.city },
              { label: 'Județ', value: biz.county },
              { label: 'Categorie', value: biz.category?.name },
              { label: 'Creat la', value: biz.created_at ? formatDate(biz.created_at) : null },
            ].map(({ label, value }) => value ? (
              <div key={label} className="flex gap-2">
                <dt className="font-medium text-gray-500 w-28 shrink-0">{label}:</dt>
                <dd className="text-gray-900 break-all">{value}</dd>
              </div>
            ) : null)}
          </dl>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-3">Statistici</h2>
          <dl className="space-y-2 text-sm">
            {[
              { label: 'Vizite profil', value: biz.profile_views },
              { label: 'Click-uri tel.', value: biz.phone_clicks },
              { label: 'Mesaje contact', value: biz.contact_form_sends },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-2">
                <dt className="font-medium text-gray-500 w-28">{label}:</dt>
                <dd className="text-gray-900">{value ?? 0}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Descriere */}
      {biz.description_short && (
        <div className="card p-5">
          <h2 className="font-semibold text-gray-900 mb-2">Descriere scurtă</h2>
          <p className="text-sm text-gray-700">{biz.description_short}</p>
        </div>
      )}
    </div>
  );
}
