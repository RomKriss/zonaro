'use client';

import { useState } from 'react';
import { X, Mail, User, Phone, Building2, Tag, MapPin, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  'Construcții', 'Instalații', 'Electricieni', 'IT & Tehnologie',
  'Auto & Moto', 'Sănătate & Frumusețe', 'Educație', 'Juridic & Contabilitate',
  'Alimentație & HoReCa', 'Turism', 'Comerț', 'Agricultură', 'Altele',
];

interface ButtonProps {
  buttonText?: string;
  buttonClassName?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function WaitlistButton({
  buttonText = 'Înscrie-te pe lista de așteptare',
  buttonClassName,
  size = 'md',
}: ButtonProps) {
  const [open, setOpen] = useState(false);

  const defaultClass =
    size === 'lg'
      ? 'inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-brand-700 text-white font-semibold rounded-xl hover:bg-brand-800 transition-colors text-base'
      : size === 'sm'
      ? 'inline-flex items-center justify-center gap-2 px-4 py-2 bg-brand-700 text-white font-semibold rounded-xl hover:bg-brand-800 transition-colors text-sm'
      : 'inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-700 text-white font-semibold rounded-xl hover:bg-brand-800 transition-colors text-sm';

  return (
    <>
      <button onClick={() => setOpen(true)} className={buttonClassName ?? defaultClass}>
        <Mail className={size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'} />
        {buttonText}
      </button>
      {open && <WaitlistModalDialog onClose={() => setOpen(false)} />}
    </>
  );
}

function WaitlistModalDialog({ onClose }: { onClose: () => void }) {
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', company_name: '', company_category: '', city: '',
  });

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError('Completează numele și emailul.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Eroare la înregistrare. Încearcă din nou.');
        return;
      }
      setSuccess(true);
    } catch {
      setError('Eroare de rețea. Încearcă din nou.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {success ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Ești pe lista de așteptare!</h3>
            <p className="text-gray-500 text-sm mb-6">
              Te vom contacta pe <strong>{form.email}</strong> imediat ce platforma este gata de lansare.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-brand-700 text-white font-semibold rounded-xl hover:bg-brand-800 transition-colors"
            >
              Închide
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Lista de așteptare ZonaRo</h3>
                <p className="text-sm text-gray-500">Fii primul care știe când lansăm</p>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Nume" required icon={User}>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Numele tău complet"
                  className={inputCls}
                  required
                />
              </Field>

              <Field label="Email" required icon={Mail}>
                <input
                  type="email"
                  value={form.email}
                  onChange={set('email')}
                  placeholder="email@exemplu.ro"
                  className={inputCls}
                  required
                />
              </Field>

              <Field label="Telefon" icon={Phone} optional>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="07XX XXX XXX"
                  className={inputCls}
                />
              </Field>

              <Field label="Nume firmă" icon={Building2} optional>
                <input
                  type="text"
                  value={form.company_name}
                  onChange={set('company_name')}
                  placeholder="Numele firmei tale"
                  className={inputCls}
                />
              </Field>

              <Field label="Categorie firmă" icon={Tag} optional>
                <select
                  value={form.company_category}
                  onChange={set('company_category')}
                  className={inputCls + ' appearance-none bg-white'}
                >
                  <option value="">Selectează categoria</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>

              <Field label="Oraș" icon={MapPin} optional>
                <input
                  type="text"
                  value={form.city}
                  onChange={set('city')}
                  placeholder="Orașul tău"
                  className={inputCls}
                />
              </Field>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-brand-700 text-white font-semibold rounded-xl hover:bg-brand-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Se procesează...
                  </>
                ) : (
                  'Înscrie-mă pe lista de așteptare'
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Nu trimitem spam. Te contactăm doar la lansare.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls =
  'w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent';

function Field({
  label,
  icon: Icon,
  required,
  optional,
  children,
}: {
  label: string;
  icon: React.ElementType;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{' '}
        {required && <span className="text-red-500">*</span>}
        {optional && <span className="text-gray-400 text-xs">(opțional)</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
        {children}
      </div>
    </div>
  );
}
