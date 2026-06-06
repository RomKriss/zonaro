'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, Mail, Shield, AlertCircle } from 'lucide-react';
import Link from 'next/link';

type Step = 'email' | 'code' | 'done';

export default function ClaimPage() {
  const params = useParams();
  const router = useRouter();
  const businessId = params.businessId as string;
  const supabase = createClient();

  const [biz, setBiz]           = useState<any>(null);
  const [step, setStep]         = useState<Step>('email');
  const [email, setEmail]       = useState('');
  const [code, setCode]         = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [agreed, setAgreed]     = useState(false);

  useEffect(() => {
    supabase.from('businesses').select('name, city, county').eq('id', businessId).single()
      .then(({ data }) => setBiz(data));
  }, [businessId]);

  const handleSendCode = async () => {
    setError('');
    setLoading(true);
    const res = await fetch('/api/claim/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_id: businessId, email }),
    });
    const data = await res.json();
    if (res.ok) {
      setStep('code');
    } else {
      setError(data.error ?? 'Eroare la trimiterea codului.');
    }
    setLoading(false);
  };

  const handleVerifyCode = async () => {
    setError('');
    setLoading(true);
    const res = await fetch('/api/claim/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ business_id: businessId, email, code }),
    });
    const data = await res.json();
    if (res.ok) {
      setStep('done');
      setTimeout(() => router.push('/cont'), 3000);
    } else {
      setError(data.error ?? 'Cod incorect sau expirat.');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center py-12 px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-brand-100 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-brand-700" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Revendică profilul firmei</h1>
          {biz && (
            <p className="text-gray-500 mt-1">
              <strong>{biz.name}</strong> · {biz.city}, {biz.county}
            </p>
          )}
        </div>

        <div className="card p-8">
          {/* Step indicators */}
          <div className="flex items-center justify-center gap-3 mb-8">
            {[
              { key: 'email', label: '1. Email' },
              { key: 'code', label: '2. Cod' },
              { key: 'done', label: '3. Gata' },
            ].map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                {i > 0 && <div className="w-8 h-px bg-gray-200" />}
                <div className={`flex items-center gap-1.5 text-xs font-medium ${
                  step === s.key ? 'text-brand-700' :
                  ['email', 'code', 'done'].indexOf(step) > i ? 'text-green-600' : 'text-gray-400'
                }`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                    step === s.key ? 'bg-brand-700 text-white' :
                    ['email', 'code', 'done'].indexOf(step) > i ? 'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {['email', 'code', 'done'].indexOf(step) > i ? '✓' : i + 1}
                  </div>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Step email */}
          {step === 'email' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Introdu adresa de email a firmei pentru a primi codul de verificare.
              </p>
              <Input
                label="Email firmă"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="firma@email.ro"
              />

              {/* Checkbox termeni */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500 flex-shrink-0"
                />
                <span className="text-xs text-gray-600 leading-relaxed">
                  Confirm că sunt reprezentant legal al acestei firme și am citit{' '}
                  <Link href="/termeni" target="_blank" className="text-brand-700 underline hover:text-brand-900">
                    Termenii și Condițiile ZonaRo
                  </Link>
                  .
                </span>
              </label>

              {error && (
                <div className="flex items-center gap-2 text-red-700 bg-red-50 px-3 py-2 rounded-xl text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <Button fullWidth loading={loading} onClick={handleSendCode} disabled={!email || !agreed}>
                <Mail className="h-4 w-4" />
                Trimite codul de verificare
              </Button>
            </div>
          )}

          {/* Step cod */}
          {step === 'code' && (
            <div className="space-y-4">
              <div className="text-center">
                <Mail className="h-10 w-10 text-brand-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Am trimis un cod de 6 cifre la <strong>{email}</strong>.<br />
                  Verifică și folderul Spam.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Codul de verificare</label>
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="------"
                  className="w-full text-center text-3xl font-bold tracking-widest py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-700 bg-red-50 px-3 py-2 rounded-xl text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}
              <Button fullWidth loading={loading} onClick={handleVerifyCode} disabled={code.length !== 6}>
                Verifică codul
              </Button>
              <button
                onClick={() => { setStep('email'); setCode(''); setError(''); }}
                className="w-full text-center text-xs text-gray-500 hover:text-gray-700"
              >
                Schimbă emailul
              </button>
            </div>
          )}

          {/* Done */}
          {step === 'done' && (
            <div className="text-center space-y-4">
              <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto" />
              <h3 className="text-xl font-bold text-gray-900">Profil revendicat!</h3>
              <p className="text-gray-500 text-sm">
                Contul tău a fost creat și profilul firmei a fost asociat. Vei fi redirecționat la dashboard în câteva secunde.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
