'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Input, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { JUDETE, generateSlug } from '@/lib/utils';

const schema = z.object({
  business_name: z.string().min(2, 'Numele firmei trebuie să aibă cel puțin 2 caractere'),
  email:         z.string().email('Email invalid'),
  password:      z.string().min(8, 'Parola trebuie să aibă cel puțin 8 caractere'),
  phone:         z.string().min(10, 'Număr de telefon invalid'),
  city:          z.string().min(2, 'Introdu orașul'),
  county:        z.string().min(2, 'Selectează județul'),
  cui:           z.string().optional(),
  terms:         z.literal(true, { errorMap: () => ({ message: 'Trebuie să accepți termenii' }) }),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { terms: true },
  });

  const onSubmit = async (data: FormData) => {
    setError('');

    // Creează contul Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        data: { business_name: data.business_name },
      },
    });

    if (authError) {
      setError(authError.message === 'User already registered'
        ? 'Există deja un cont cu acest email. Încearcă să te autentifici.'
        : authError.message);
      return;
    }

    if (!authData.user) {
      setError('Eroare la crearea contului. Încearcă din nou.');
      return;
    }

    // Generează slug unic
    const baseSlug = generateSlug(`${data.county} ${data.business_name}`);
    const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`;

    // Creează profilul de firmă
    const { error: bizError } = await supabase.from('businesses').insert({
      user_id:    authData.user.id,
      name:       data.business_name,
      slug,
      phone:      data.phone,
      city:       data.city,
      county:     data.county,
      cui:        data.cui || null,
      status:     'active',
      plan:       'free',
    });

    if (bizError) {
      setError('Eroare la crearea profilului. Contactează suportul.');
      return;
    }

    setStep('verify');
  };

  if (step === 'verify') {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-gray-50">
        <div className="w-full max-w-md card p-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cont creat cu succes!</h2>
          <p className="text-gray-500 mb-4">
            Am trimis un email de confirmare la adresa ta. Verifică și inbox-ul spam.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Profilul tău va fi activat după ce confirmați email-ul și după verificarea de către echipa ZonaRo.
          </p>
          <Link href="/autentificare">
            <Button fullWidth>Mergi la Autentificare</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/logo.svg" alt="ZonaRo" width={160} height={40} priority />
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Înregistrează-ți firma</h1>
          <p className="mt-1 text-gray-500 text-sm">Gratuit — fără card de credit necesar</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Input
                  {...register('business_name')}
                  label="Numele firmei"
                  placeholder="ex: SC Construcții Ion SRL"
                  error={errors.business_name?.message}
                  required
                />
              </div>

              <Input
                {...register('email')}
                label="Email firmă"
                type="email"
                placeholder="firma@email.ro"
                error={errors.email?.message}
                required
              />

              <Input
                {...register('password')}
                label="Parolă"
                type="password"
                placeholder="Minim 8 caractere"
                error={errors.password?.message}
                required
              />

              <Input
                {...register('phone')}
                label="Telefon"
                type="tel"
                placeholder="07xx xxx xxx"
                error={errors.phone?.message}
                required
              />

              <Input
                {...register('cui')}
                label="CUI (opțional)"
                placeholder="ex: RO12345678"
                error={errors.cui?.message}
              />

              <Input
                {...register('city')}
                label="Oraș"
                placeholder="ex: Cluj-Napoca"
                error={errors.city?.message}
                required
              />

              <Select
                {...register('county')}
                label="Județ"
                placeholder="Selectează județul"
                options={JUDETE.map((j) => ({ value: j, label: j }))}
                error={errors.county?.message}
                required
              />
            </div>

            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="terms"
                {...register('terms')}
                className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 mt-0.5"
                defaultChecked
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Accept{' '}
                <Link href="/termeni" className="text-brand-700 hover:underline">Termenii și Condițiile</Link>
                {' '}și{' '}
                <Link href="/confidentialitate" className="text-brand-700 hover:underline">Politica GDPR</Link>
              </label>
            </div>
            {errors.terms && (
              <p className="text-xs text-red-600">{errors.terms.message}</p>
            )}

            {error && (
              <div className="flex items-start gap-2 bg-red-50 text-red-700 px-3 py-2.5 rounded-xl text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <Button type="submit" loading={isSubmitting} fullWidth size="lg">
              Creează contul gratuit
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Ai deja cont?{' '}
            <Link href="/autentificare" className="text-brand-700 font-medium hover:underline">
              Autentifică-te
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
