'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Cookie, Settings, Check } from 'lucide-react';

interface CookiePrefs {
  essential: boolean;   // always true
  performance: boolean;
  functional: boolean;
  marketing: boolean;
}

const DEFAULT_PREFS: CookiePrefs = {
  essential: true,
  performance: false,
  functional: false,
  marketing: false,
};

const STORAGE_KEY = 'zonaro-cookie-consent';

export function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showCustomize, setShowCustomize] = useState(false);
  const [prefs, setPrefs] = useState<CookiePrefs>(DEFAULT_PREFS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }

    const handleOpenSettings = () => {
      setVisible(true);
      setShowCustomize(true);
    };

    window.addEventListener('open-cookie-settings', handleOpenSettings);
    return () => {
      window.removeEventListener('open-cookie-settings', handleOpenSettings);
    };
  }, []);

  const savePrefs = (p: CookiePrefs) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...p, savedAt: new Date().toISOString() }));
    } catch {}
    setVisible(false);
    setShowCustomize(false);
  };

  const acceptAll = () => {
    savePrefs({ essential: true, performance: true, functional: true, marketing: true });
  };

  const acceptSelected = () => {
    savePrefs(prefs);
  };

  const rejectAll = () => {
    savePrefs(DEFAULT_PREFS);
  };

  if (!visible) return null;

  return (
    <>
      {/* Overlay when customizing */}
      {showCustomize && (
        <div className="fixed inset-0 bg-black/50 z-[998] backdrop-blur-sm" onClick={() => setShowCustomize(false)} />
      )}

      {/* Customize Modal */}
      {showCustomize && (
        <div className="fixed inset-x-4 bottom-24 sm:inset-x-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[520px] bg-white rounded-2xl shadow-2xl z-[999] border border-gray-200">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-brand-700" />
                <h3 className="font-bold text-gray-900">Personalizează Preferințele</h3>
              </div>
              <button onClick={() => setShowCustomize(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mb-5">
              Alege ce tipuri de cookie-uri accepți. Cookie-urile esențiale sunt întotdeauna active deoarece sunt necesare pentru funcționarea platformei.
            </p>

            <div className="space-y-4">
              {[
                {
                  key: 'essential',
                  label: 'Cookie-uri Esențiale',
                  desc: 'Necesare pentru autentificare și funcționarea corectă a platformei. Nu pot fi dezactivate.',
                  locked: true,
                  color: 'green',
                },
                {
                  key: 'performance',
                  label: 'Cookie-uri de Performanță',
                  desc: 'Ne ajută să înțelegem cum utilizați platforma, prin statistici anonime agregate.',
                  locked: false,
                  color: 'blue',
                },
                {
                  key: 'functional',
                  label: 'Cookie-uri Funcționale',
                  desc: 'Rețin preferințele dumneavoastră de utilizare pentru o experiență personalizată.',
                  locked: false,
                  color: 'purple',
                },
                {
                  key: 'marketing',
                  label: 'Cookie-uri de Marketing',
                  desc: 'Permit afișarea de conținut relevant și publicitate personalizată.',
                  locked: false,
                  color: 'orange',
                },
              ].map(({ key, label, desc, locked, color }) => (
                <div key={key} className={`flex items-start gap-4 p-4 rounded-xl border ${locked ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                  </div>
                  {locked ? (
                    <div className="flex items-center gap-1 text-xs text-green-700 font-medium flex-shrink-0 mt-0.5">
                      <Check className="h-4 w-4" />
                      Mereu activ
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPrefs(p => ({ ...p, [key]: !p[key as keyof CookiePrefs] }))}
                      className={`relative flex-shrink-0 mt-0.5 inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${
                        prefs[key as keyof CookiePrefs] ? 'bg-brand-600' : 'bg-gray-300'
                      }`}
                      aria-pressed={prefs[key as keyof CookiePrefs]}
                      aria-label={`Toggle ${label}`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                          prefs[key as keyof CookiePrefs] ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={acceptSelected}
                className="flex-1 bg-brand-700 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-brand-800 transition-colors"
              >
                Salvează preferințele
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Acceptă toate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Cookie Banner */}
      {!showCustomize && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200 z-[997]">
          <div className="p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
                <Cookie className="h-5 w-5 text-brand-700" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-sm">ZonaRo folosește cookie-uri</h3>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Utilizăm cookie-uri pentru a asigura funcționarea corectă a platformei și pentru a îmbunătăți experiența ta.{' '}
                  <Link href="/confidentialitate#cookies" className="text-brand-700 hover:underline">
                    Află mai mult
                  </Link>
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={acceptAll}
                className="flex-1 bg-brand-700 text-white py-2.5 px-4 rounded-xl text-sm font-semibold hover:bg-brand-800 transition-colors"
              >
                Accept toate
              </button>
              <button
                onClick={() => setShowCustomize(true)}
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Personalizează
              </button>
              <button
                onClick={rejectAll}
                className="sm:flex-none text-xs text-gray-400 hover:text-gray-600 py-2.5 px-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Refuz
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
