'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function ParolaNouaPage() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Supabase trimite token-ul în hash (#access_token=...) sau query params
    // onAuthStateChange îl preia automat și creează sesiunea
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setSessionReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Parola trebuie să aibă cel puțin 8 caractere.');
      return;
    }
    if (password !== confirm) {
      setError('Parolele nu coincid.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError('Eroare la setarea parolei. Link-ul poate fi expirat — solicită un nou email de resetare.');
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push('/cont'), 3000);
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-gray-50">
        <div className="w-full max-w-md card p-8 text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Parolă actualizată!</h2>
          <p className="text-gray-500 mb-6">Vei fi redirecționat automat la dashboard în câteva secunde.</p>
          <Link href="/cont">
            <Button fullWidth>Mergi la Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/logo.svg" alt="ZonaRo" width={160} height={40} priority />
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-gray-900">Setează parola nouă</h1>
          <p className="mt-1 text-gray-500 text-sm">Alege o parolă sigură pentru contul tău</p>
        </div>

        <div className="card p-8">
          {!sessionReady && (
            <div className="mb-4 flex items-start gap-2 bg-amber-50 text-amber-800 px-3 py-2.5 rounded-xl text-sm">
              <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              Se verifică link-ul de resetare... Dacă formularul nu funcționează, solicită un nou email.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Parola nouă"
              type="password"
              placeholder="Minim 8 caractere"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Input
              label="Confirmă parola"
              type="password"
              placeholder="Repetă parola"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            {error && (
              <div className="flex items-start gap-2 bg-red-50 text-red-700 px-3 py-2.5 rounded-xl text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} fullWidth size="lg">
              Setează parola nouă
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            <Link href="/autentificare" className="text-brand-700 hover:underline">
              Înapoi la autentificare
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
