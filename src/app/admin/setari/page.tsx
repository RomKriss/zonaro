'use client';

import { useState, useEffect } from 'react';
import { Power, Save, AlertCircle, CheckCircle2 } from 'lucide-react';

interface Settings {
  maintenance_mode: boolean;
  maintenance_title: string;
  maintenance_description: string;
  waitlist_button_text: string;
}

export default function SetariPage() {
  const [settings, setSettings] = useState<Settings>({
    maintenance_mode: false,
    maintenance_title: '',
    maintenance_description: '',
    waitlist_button_text: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.json())
      .then((data) => {
        if (data) setSettings({
          maintenance_mode: data.maintenance_mode ?? false,
          maintenance_title: data.maintenance_title ?? '',
          maintenance_description: data.maintenance_description ?? '',
          waitlist_button_text: data.waitlist_button_text ?? '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
      if (!res.ok) throw new Error();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Eroare la salvare. Încearcă din nou.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-400 text-sm">Se încarcă setările...</div>;
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
