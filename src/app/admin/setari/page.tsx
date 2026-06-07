'use client';

import { useState, useEffect } from 'react';
import { Power, Save, AlertCircle, CheckCircle2, Database } from 'lucide-react';

interface Settings {
  maintenance_mode: boolean;
  maintenance_title: string;
  maintenance_description: string;
  waitlist_button_text: string;
}

const DEFAULT: Settings = {
  maintenance_mode: false,
  maintenance_title: 'Zonaro.ro este în pregătire',
  maintenance_description: 'În curând firmele vor putea crea profiluri și vor putea fi listate în platformă.',
  waitlist_button_text: 'Înscrie-te pe lista de așteptare',
};

export default function SetariPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [dbMissing, setDbMissing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [setupRunning, setSetupRunning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [setupMsg, setSetupMsg] = useState('');

  const loadSettings = () => {
    setLoading(true);
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data && typeof data.maintenance_mode !== 'undefined') {
          setSettings({ ...DEFAULT, ...data });
          setDbMissing(false);
        } else {
          setDbMissing(true);
        }
        setLoading(false);
      })
      .catch(() => { setDbMissing(true); setLoading(false); });
  };

  useEffect(() => { loadSettings(); }, []);

  const handleSetup = async () => {
    setSetupRunning(true);
    setSetupMsg('');
    try {
      const res = await fetch('/api/admin/setup', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSetupMsg('✅ Baza de date configurată! Se reîncarcă setările...');
        setTimeout(() => { loadSettings(); setSetupMsg(''); }, 1500);
      } else {
        setSetupMsg(`⚠️ ${data.message}`);
      }
    } catch {
      setSetupMsg('Eroare la configurarea automată.');
    } finally {
      setSetupRunning(false);
    }
  };

  const set = (key: keyof Settings) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setSettings((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(`Eroare (${res.status}): ${body?.error ?? 'necunoscută'}`);
        return;
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(`Eroare rețea: ${err?.message ?? 'necunoscută'}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-400 text-sm">Se încarcă setările...</div>;
  }

  if (dbMissing) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Setări Site</h1>
        </div>
        <div className="card p-6 border-amber-200 bg-amber-50">
          <div className="flex items-start gap-3 mb-4">
            <Database className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-semibold text-amber-900">Baza de date nu este configurată</h2>
              <p className="text-sm text-amber-700 mt-1">
                Tabelele necesare (site_settings, waitlist) nu există. Apasă butonul de mai jos
                pentru configurare automată, sau rulează manual SQL-ul din{' '}
                <code className="bg-amber-100 px-1 rounded text-xs">supabase/maintenance_waitlist.sql</code>.
              </p>
            </div>
          </div>
          <button
            onClick={handleSetup}
            disabled={setupRunning}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-600 text-white font-semibold rounded-xl hover:bg-amber-700 transition-colors disabled:opacity-60"
          >
            {setupRunning ? (
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Database className="h-4 w-4" />
            )}
            {setupRunning ? 'Se configurează...' : 'Configurează automat baza de date'}
          </button>
          {setupMsg && (
            <p className="text-sm mt-3 text-amber-800">{setupMsg}</p>
          )}
          <details className="mt-4">
            <summary className="text-xs text-amber-600 cursor-pointer hover:underline">
              Alternativ: rulează manual în Supabase SQL Editor
            </summary>
            <div className="mt-3 bg-white rounded-xl border border-amber-200 p-4">
              <p className="text-xs text-gray-500 mb-2">
                Deschide{' '}
                <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-brand-700 underline">
                  supabase.com/dashboard
                </a>{' '}
                → proiectul tău → SQL Editor → New query → lipești:
              </p>
              <pre className="text-xs bg-gray-50 p-3 rounded-lg overflow-x-auto text-gray-700 whitespace-pre-wrap">
{`CREATE TABLE IF NOT EXISTS site_settings (
  id text PRIMARY KEY DEFAULT 'main',
  maintenance_mode boolean NOT NULL DEFAULT false,
  maintenance_title text NOT NULL DEFAULT 'Zonaro.ro este în pregătire',
  maintenance_description text NOT NULL DEFAULT 'În curând firmele vor putea crea profiluri.',
  waitlist_button_text text NOT NULL DEFAULT 'Înscrie-te pe lista de așteptare',
  updated_at timestamptz DEFAULT now()
);
INSERT INTO site_settings (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "admin_update" ON site_settings FOR UPDATE
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, email text NOT NULL UNIQUE,
  phone text, company_name text, company_category text, city text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insert" ON waitlist FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_read" ON waitlist FOR SELECT
  USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));`}
              </pre>
            </div>
          </details>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Setări Site</h1>
        <p className="text-sm text-gray-500 mt-1">
          Controlează starea platformei și mesajele afișate vizitatorilor
        </p>
      </div>

      {/* Status toggle */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              settings.maintenance_mode
                ? 'bg-amber-50 text-amber-600'
                : 'bg-green-50 text-green-600'
            }`}
          >
            <Power className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Status platformă</h2>
            <p className="text-xs text-gray-500">
              {settings.maintenance_mode ? '⚠️ Maintenance Mode activ' : '✅ Site-ul este Live'}
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setSettings((p) => ({ ...p, maintenance_mode: false }))}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
              !settings.maintenance_mode
                ? 'bg-green-600 text-white border-green-600 shadow-sm'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            🟢 Live
          </button>
          <button
            onClick={() => setSettings((p) => ({ ...p, maintenance_mode: true }))}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
              settings.maintenance_mode
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            🔧 Maintenance Mode
          </button>
        </div>
      </div>

      {/* Message settings */}
      <div className="card p-6 space-y-4">
        <h2 className="font-semibold text-gray-900">Mesaj de mentenanță</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Titlu mesaj</label>
          <input
            type="text"
            value={settings.maintenance_title}
            onChange={set('maintenance_title')}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Descriere</label>
          <textarea
            value={settings.maintenance_description}
            onChange={set('maintenance_description')}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Text buton waitlist
          </label>
          <input
            type="text"
            value={settings.waitlist_button_text}
            onChange={set('waitlist_button_text')}
            placeholder="Înscrie-te pe lista de așteptare"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-brand-700 text-white font-semibold rounded-xl hover:bg-brand-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? (
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Salvează setările
        </button>

        {success && (
          <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4" />
            Salvat cu succes!
          </span>
        )}
        {error && (
          <span className="flex items-center gap-1.5 text-red-600 text-sm">
            <AlertCircle className="h-4 w-4" />
            {error}
          </span>
        )}
      </div>

      {settings.maintenance_mode && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Maintenance Mode este activ.</strong> Utilizatorii nu pot accesa
            dashboard-ul, checkout-ul sau crearea de profil. Adminii au acces complet.
          </div>
        </div>
      )}
    </div>
  );
}
