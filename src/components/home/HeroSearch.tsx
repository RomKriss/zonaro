'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { JUDETE } from '@/lib/utils';

export function HeroSearch() {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (location) params.set('county', location);
    router.push(`/cauta?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-900 via-brand-800 to-brand-700 py-20 md:py-28">
      {/* Pattern decorativ */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px),
                              radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm text-blue-200 mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          Peste 50.000 de firme listate
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
          Găsește firme și meșteri de încredere
          <span className="block text-accent-400">în Moldova și estul României</span>
        </h1>
        <p className="text-lg md:text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
          Directorul online cu firme verificate din Iași, Galați, Bacău, Vaslui și toată zona de est.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row gap-2"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ce serviciu cauți? (ex: instalator, avocat...)"
              className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 text-sm"
            />
          </div>

          <div className="w-full sm:w-52 relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-8 py-3 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none border border-gray-100"
            >
              <option value="">Toate județele</option>
              {JUDETE.map((j) => (
                <option key={j} value={j.toLowerCase().replace(/\s/g, '-')}>
                  {j}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          </div>

          <Button type="submit" size="lg" className="sm:w-auto w-full px-8 shrink-0">
            <Search className="h-4 w-4" />
            Caută
          </Button>
        </form>

        {/* Quick links */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {['Instalator', 'Electrician', 'Constructor', 'Avocat', 'Dentist', 'IT'].map((term) => (
            <button
              key={term}
              onClick={() => {
                setQuery(term);
                router.push(`/cauta?q=${encodeURIComponent(term)}`);
              }}
              className="px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
