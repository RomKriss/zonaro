'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Zap } from 'lucide-react';

// Data expirare promoție — 90 zile de la lansare (05 Septembrie 2026)
const PROMO_END_DATE = new Date('2026-09-05T23:59:59');

function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = targetDate.getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      return {
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    setTimeLeft(calc());
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return timeLeft;
}

export function PromoBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { days, hours, minutes, seconds } = useCountdown(PROMO_END_DATE);

  useEffect(() => {
    setDismissed(localStorage.getItem('zonaro-promo-dismissed') === '1');
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('zonaro-promo-dismissed', '1');
    setDismissed(true);
  };

  if (dismissed || PROMO_END_DATE < new Date()) return null;

  return (
    <div
      className="w-full z-40 text-white text-sm py-2.5 px-4"
      style={{ backgroundColor: '#E85D04' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-center sm:text-left">
          <Zap className="h-4 w-4 flex-shrink-0 hidden sm:block" />
          <span className="font-semibold">
            🎉 Ofertă de lansare — Plan Plus:
          </span>
          <span className="font-bold text-white">
            17,49 RON/lună primele 3 luni
          </span>
          <span className="text-orange-200 text-xs hidden md:inline">
            (în loc de 34,99 RON/lună)
          </span>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Countdown */}
          <div className="flex items-center gap-1 text-xs font-mono">
            <span className="bg-white/20 px-1.5 py-0.5 rounded font-bold">{String(days).padStart(2,'0')}z</span>
            <span>:</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded font-bold">{String(hours).padStart(2,'0')}h</span>
            <span>:</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded font-bold">{String(minutes).padStart(2,'0')}m</span>
            <span>:</span>
            <span className="bg-white/20 px-1.5 py-0.5 rounded font-bold">{String(seconds).padStart(2,'0')}s</span>
          </div>

          <Link
            href="/preturi#plus"
            className="bg-white text-orange-600 font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors whitespace-nowrap"
          >
            Profită acum
          </Link>

          <button
            onClick={handleDismiss}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Închide banner promoție"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
