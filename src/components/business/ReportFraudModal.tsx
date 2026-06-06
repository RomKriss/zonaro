'use client';

import { useState } from 'react';
import { Flag, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface Props {
  businessId: string;
  businessName: string;
}

export function ReportFraudButton({ businessId, businessName }: Props) {
  const [open, setOpen]         = useState(false);
  const [email, setEmail]       = useState('');
  const [message, setMessage]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ business_id: businessId, reporter_email: email, message }),
      });
      if (res.ok) {
        setSent(true);
      } else {
        const d = await res.json();
        setError(d.error ?? 'Eroare la trimiterea raportului.');
      }
    } catch {
      setError('Eroare de rețea. Încearcă din nou.');
    }
    setLoading(false);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => { setSent(false); setEmail(''); setMessage(''); setError(''); }, 300);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-red-500 transition-colors mt-2"
        title="Raportează revendicare frauduloasă"
      >
        <Flag className="h-3.5 w-3.5" />
        Raportează revendicare frauduloasă
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-red-50">
                  <Flag className="h-4 w-4 text-red-500" />
                </div>
                <h2 className="font-semibold text-gray-900 text-sm">Raportează revendicare frauduloasă</h2>
              </div>
              <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5">
              {sent ? (
                <div className="text-center py-4 space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                  <h3 className="font-semibold text-gray-900">Raport trimis</h3>
                  <p className="text-sm text-gray-500">
                    Echipa ZonaRo va analiza sesizarea și te va contacta la adresa furnizată.
                  </p>
                  <Button variant="outline" size="sm" onClick={handleClose}>Închide</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-xs text-gray-500">
                    Dacă profilul firmei <strong>{businessName}</strong> a fost revendicat fără acordul tău,
                    completează formularul de mai jos. Vom verifica și acționa prompt.
                  </p>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Emailul tău de contact <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@firma.ro"
                      required
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1.5">
                      Descrie pe scurt situația <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Explică de ce crezi că această revendicare este frauduloasă..."
                      maxLength={500}
                      required
                      rows={4}
                      className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                    />
                    <p className="text-xs text-gray-400 mt-1 text-right">{message.length}/500</p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-700 bg-red-50 px-3 py-2 rounded-xl text-xs">
                      <AlertCircle className="h-4 w-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 pt-1">
                    <Button type="button" variant="ghost" size="sm" onClick={handleClose} className="flex-1">
                      Anulează
                    </Button>
                    <button
                      type="submit"
                      disabled={loading || !email || !message}
                      className="flex-1 py-2 px-4 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                      {loading ? 'Se trimite...' : 'Trimite raportul'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
