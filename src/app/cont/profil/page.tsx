'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/LoadingSpinner';
import { JUDETE, countWords } from '@/lib/utils';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import type { Business } from '@/types';

const schema = z.object({
  name:              z.string().min(2, 'Minim 2 caractere'),
  phone:             z.string().optional().or(z.literal('')),
  email:             z.string().email('Email invalid').optional().or(z.literal('')),
  website:           z.string().url('URL invalid').optional().or(z.literal('')),
  address:           z.string().optional(),
  city:              z.string().min(2, 'Introdu orașul'),
  county:            z.string().min(2, 'Selectează județul'),
  description_short: z.string().max(5000, 'Prea lung').optional().or(z.literal('')),
  description_long:  z.string().max(50000, 'Prea lung').optional().or(z.literal('')),
  youtube_url:       z.string().url('URL YouTube invalid').optional().or(z.literal('')),
});

type FormData = z.infer<typeof schema>;

export default function ProfilPage() {
  const [biz, setBiz]             = useState<Business | null>(null);
  const [loading, setLoading]     = useState(true);
  const [saved, setSaved]         = useState(false);
  const [saveError, setSaveError] = useState('');
  const supabase = createClient();

  const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const shortDesc = watch('description_short') ?? '';
  const longDesc  = watch('description_long') ?? '';

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Upsert user în public.users — fix pentru conturi create înainte de migrare
      await supabase.from('users').upsert(
        { id: user.id, email: user.email ?? '', role: 'business' },
        { onConflict: 'id', ignoreDuplicates: true }
      );

      const { data } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setBiz(data);
        reset({
          name:              data.name ?? '',
          phone:             data.phone ?? '',
          email:             data.email ?? '',
          website:           data.website ?? '',
          address:           data.address ?? '',
          city:              data.city ?? '',
          county:            data.county ?? '',
          description_short: data.description_short ?? '',
          description_long:  data.description_long ?? '',
          youtube_url:       data.youtube_url ?? '',
        });
      }
      setLoading(false);
    })();
  }, []);

  const onSubmit = async (data: FormData) => {
    setSaveError('');
    setSaved(false);

    if (!biz?.id) {
      setSaveError('Nu există o firmă asociată contului tău.');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setSaveError('Nu ești autentificat. Reîncarcă pagina.');
      return;
    }

    const { error } = await supabase
      .from('businesses')
      .update({
        name:              data.name,
        phone:             data.phone || null,
        email:             data.email || null,
        website:           data.website || null,
        address:           data.address || null,
        city:              data.city,
        county:            data.county,
        description_short: data.description_short || null,
        description_long:  data.description_long || null,
        youtube_url:       data.youtube_url || null,
        updated_at:        new Date().toISOString(),
      })
      .eq('id', biz.id)
      .eq('user_id', user.id);

    if (error) {
      setSaveError(`Eroare: ${error.message}`);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  if (loading) return <PageLoader text="Se încarcă profilul..." />;

  if (!biz) {
    return (
      <div className="card p-8 text-center">
        <AlertCircle className="h-10 w-10 text-amber-400 mx-auto mb-3" />
        <h2 className="font-semibold text-gray-900 mb-2">Nu ai o firmă asociată</h2>
        <p className="text-gray-500 text-sm">
          Contul tău nu are o firmă asociată. Contactează suportul.
        </p>
      </div>
    );
  }

  const shortWords = countWords(shortDesc);
  const longWords  = countWords(longDesc);
  const planLimit  = biz?.plan === 'free' ? 150 : biz?.plan === 'plus' ? 500 : 2000;
  const canUseLong = biz?.plan !== 'free';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Editare Profil</h1>
        <p className="text-gray-500 text-sm mt-1">Informațiile afișate pe pagina ta publică</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Informații de bază</h2>

          <Input {...register('name')} label="Numele firmei" error={errors.name?.message} required />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input {...register('phone')} label="Telefon" type="tel" placeholder="07xx xxx xxx" error={errors.phone?.message} />
            <Input {...register('email')} label="Email firmă" type="email" error={errors.email?.message} />
          </div>

          <Input
            {...register('website')}
            label="Website"
            placeholder="https://www.firma.ro"
            error={errors.website?.message}
            hint={biz?.plan === 'free' || biz?.plan === 'plus' ? 'Website activ disponibil din planul Pro' : undefined}
            disabled={biz?.plan === 'free' || biz?.plan === 'plus'}
          />
        </div>

        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Locație</h2>
          <Input {...register('address')} label="Adresa completă" placeholder="Str. Exemplu nr. 1" error={errors.address?.message} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input {...register('city')} label="Oraș" error={errors.city?.message} required />
            <Select
              {...register('county')}
              label="Județ"
              options={JUDETE.map((j) => ({ value: j, label: j }))}
              error={errors.county?.message}
              required
            />
          </div>
        </div>

        <div className="card p-6 space-y-5">
          <h2 className="font-semibold text-gray-900">Descriere</h2>

          <div>
            <Textarea
              {...register('description_short')}
              label="Descriere scurtă (afișată în carduri)"
              placeholder="Prezintă pe scurt ce face firma ta..."
              rows={3}
              error={errors.description_short?.message}
            />
            <p className={`text-xs mt-1 ${shortWords > 150 ? 'text-red-500' : 'text-gray-400'}`}>
              {shortWords}/150 cuvinte
            </p>
          </div>

          {canUseLong ? (
            <div>
              <Textarea
                {...register('description_long')}
                label="Descriere completă (afișată pe profilul tău)"
                placeholder="Descrie în detaliu serviciile, experiența, zona de acoperire..."
                rows={8}
                error={errors.description_long?.message}
              />
              <p className={`text-xs mt-1 ${longWords > planLimit ? 'text-red-500' : 'text-gray-400'}`}>
                {longWords}/{planLimit} cuvinte
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-4 border border-dashed border-gray-300 text-center">
              <p className="text-sm text-gray-500">
                Descrierea completă este disponibilă din planul <strong>Plus</strong>.
              </p>
            </div>
          )}
        </div>

        {(biz?.plan === 'pro' || biz?.plan === 'elite') && (
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Video YouTube</h2>
            <Input
              {...register('youtube_url')}
              label="URL video YouTube"
              placeholder="https://www.youtube.com/watch?v=..."
              error={errors.youtube_url?.message}
              hint="Adaugă un video de prezentare a firmei tale"
            />
          </div>
        )}

        {saved && (
          <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-3 rounded-xl text-sm">
            <CheckCircle2 className="h-4 w-4" />
            Modificările au fost salvate cu succes!
          </div>
        )}
        {saveError && (
          <div className="flex items-center gap-2 text-red-700 bg-red-50 px-4 py-3 rounded-xl text-sm">
            <AlertCircle className="h-4 w-4" />
            {saveError}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" loading={isSubmitting}>
            Salvează modificările
          </Button>
          <Button type="button" variant="ghost" onClick={() => reset()}>
            Anulează
          </Button>
        </div>
      </form>
    </div>
  );
}
