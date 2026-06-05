'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';

const schema = z.object({
  email:    z.string().email('Email invalid'),
  password: z.string().min(6, 'Parola trebuie să aibă cel puțin 6 caractere'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (authError) {
      setError('Email sau parolă incorectă. Verifică datele și încearcă din nou.');
      return;
    }
    router.push('/cont');
    router.refresh();
  };

  const handleForgotPassword = async () => {
    const email = (document.getElementById('email') as HTMLInputElement)?.value;
    if (!email) {
      setError('Introdu adresa de email mai întâi.');
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/cont/parola-noua`,
    });
    if (!resetError) {
      setError('');
      alert('Email de resetare trimis! Verifică căsuța de email.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/logo.svg" alt="ZonaRo" width={160} height={40} priority />
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Bine ai revenit!</h1>
          <p className="mt-1 text-gray-500 text-sm">Autentifică-te în contul tău ZonaRo</p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              id="email"
              {...register('email')}
              label="Adresa de email"
              type="email"
              placeholder="firma@email.ro"
              error={errors.email?.message}
              required
              autoComplete="email"
            />

            <div className="relative">
              <Input
                {...register('password')}
                label="Parola"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-brand-700 hover:underline"
              >
                Ai uitat parola?
              </button>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 text-red-700 px-3 py-2.5 rounded-xl text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <Button type="submit" loading={isSubmitting} fullWidth size="lg">
              Autentificare
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Nu ai cont?{' '}
            <Link href="/inregistrare" className="text-brand-700 font-medium hover:underline">
              Înregistrează-te gratuit
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
