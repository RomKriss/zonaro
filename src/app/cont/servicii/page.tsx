'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { Plus, Trash2, GripVertical, Lock } from 'lucide-react';
import { getPlanConfig } from '@/lib/utils';
import type { Business, Service } from '@/types';

const schema = z.object({
  name:        z.string().min(2, 'Minim 2 caractere'),
  description: z.string().optional(),
  price_range: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function ServiciiPage() {
  const [biz, setBiz] = useState<Business | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: bizData } = await supabase.from('businesses').select('*').eq('user_id', user.id).single();
      if (bizData) {
        setBiz(bizData);
        const { data } = await supabase.from('services').select('*').eq('business_id', bizData.id).order('order_index');
        setServices(data ?? []);
      }
      setLoading(false);
    })();
  }, []);

  const plan = biz ? getPlanConfig(biz.plan) : null;
  const maxServices = plan?.limits.services;
  const canAdd = maxServices === 'unlimited' || (typeof maxServices === 'number' && services.length < maxServices);

  const onSubmit = async (data: FormData) => {
    if (!biz || !canAdd) return;
    setSaving(true);
    const { data: newService, error } = await supabase
      .from('services')
      .insert({ ...data, business_id: biz.id, order_index: services.length })
      .select()
      .single();
    if (!error && newService) {
      setServices((prev) => [...prev, newService]);
      reset();
      setShowForm(false);
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ștergi acest serviciu?')) return;
    await supabase.from('services').delete().eq('id', id);
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  if (loading) return <PageLoader text="Se încarcă serviciile..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Servicii și Produse</h1>
          <p className="text-gray-500 text-sm mt-1">
            {typeof maxServices === 'number'
              ? `${services.length}/${maxServices} servicii — Plan ${plan?.name}`
              : `${services.length} servicii — Nelimitat`}
          </p>
        </div>
        {canAdd && !showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" />
            Adaugă serviciu
          </Button>
        )}
      </div>

      {/* Formular adăugare */}
      {showForm && (
        <form onSubmit={handleSubmit(onSubmit)} className="card p-5 space-y-4">
          <h3 className="font-semibold text-gray-900">Serviciu nou</h3>
          <Input {...register('name')} label="Denumire serviciu" placeholder="ex: Montaj instalații sanitare" error={errors.name?.message} required />
          <Textarea {...register('description')} label="Descriere (opțional)" placeholder="Detalii despre serviciu..." rows={3} />
          <Input {...register('price_range')} label="Interval de preț (opțional)" placeholder="ex: 200-500 RON" />
          <div className="flex gap-3">
            <Button type="submit" loading={saving} size="sm">Salvează</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => { setShowForm(false); reset(); }}>Anulează</Button>
          </div>
        </form>
      )}

      {/* Lista servicii */}
      {services.length > 0 ? (
        <div className="space-y-3">
          {services.map((service) => (
            <div key={service.id} className="card p-4 flex items-start gap-3">
              <GripVertical className="h-5 w-5 text-gray-300 mt-0.5 flex-shrink-0 cursor-grab" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900">{service.name}</p>
                {service.description && (
                  <p className="text-sm text-gray-500 mt-0.5">{service.description}</p>
                )}
                {service.price_range && (
                  <p className="text-sm text-brand-700 font-medium mt-1">{service.price_range}</p>
                )}
              </div>
              <button
                onClick={() => handleDelete(service.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-8 text-center">
          <p className="text-gray-500 text-sm">Niciun serviciu adăugat. Adaugă primul serviciu!</p>
        </div>
      )}

      {/* Blocat dacă a atins limita și nu e Pro */}
      {!canAdd && biz?.plan !== 'pro' && biz?.plan !== 'elite' && (
        <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 flex items-start gap-3">
          <Lock className="h-5 w-5 text-brand-600 flex-shrink-0" />
          <div>
            <p className="text-sm text-brand-800 font-medium">Limită atinsă</p>
            <p className="text-xs text-brand-600 mt-0.5">
              <a href="/cont/abonament" className="underline">Upgradează la Pro</a> pentru servicii nelimitate.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
