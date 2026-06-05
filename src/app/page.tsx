import { Metadata } from 'next';
import { HeroSearch } from '@/components/home/HeroSearch';
import { CategoriesGrid } from '@/components/home/CategoriesGrid';
import { FeaturedBusinesses } from '@/components/home/FeaturedBusinesses';
import { CitiesSection } from '@/components/home/CitiesSection';
import { HomePricingSection } from '@/components/home/HomePricingSection';
import { EastRomaniaMap } from '@/components/home/EastRomaniaMap';
import { CheckCircle2, Star, Building2, Users } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'ZonaRo — Firme și Meșteri din Moldova și Estul României',
  description:
    'ZonaRo — directorul de firme și meșteri din Moldova și estul României. Găsește rapid servicii verificate în Iași, Galați, Bacău, Vaslui, Suceava și județele învecinate.',
};

const STATS = [
  { icon: Building2, value: '50.000+', label: 'Firme listate' },
  { icon: Star, value: '120.000+', label: 'Recenzii verificate' },
  { icon: Users, value: '500.000+', label: 'Vizitatori lunar' },
  { icon: CheckCircle2, value: '2.800+', label: 'Firme verificate' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <HeroSearch />

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="container-page py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand-50">
                  <stat.icon className="h-5 w-5 text-brand-600" />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categorii */}
      <CategoriesGrid />

      {/* Featured businesses (async server component) */}
      <FeaturedBusinesses />

      {/* Harta zona de est */}
      <EastRomaniaMap />

      {/* Orașe principale */}
      <CitiesSection />

      {/* Secțiune prețuri compactă */}
      <HomePricingSection />

      {/* CTA banner */}
      <section className="py-16 bg-gradient-to-r from-brand-800 to-brand-700">
        <div className="container-page text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            Ai o firmă sau ești meșter?
          </h2>
          <p className="text-blue-200 mb-8 text-lg max-w-xl mx-auto">
            Listează-te gratuit pe ZonaRo și ajunge la mii de clienți noi în fiecare lună.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/inregistrare">
              <Button size="lg" variant="secondary" className="px-8">
                Înregistrează-te Gratuit
              </Button>
            </Link>
            <Link href="/cauta">
              <Button size="lg" variant="outline" className="px-8 border-white text-white hover:bg-white/10">
                Descoperă Platforma
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-blue-300">
            Fără card de credit. Plan gratuit pentru totdeauna.
          </p>
        </div>
      </section>

      {/* Cum funcționează */}
      <section className="py-16 container-page">
        <div className="text-center mb-12">
          <h2 className="section-title">Cum funcționează ZonaRo?</h2>
          <p className="section-subtitle">Simplu, rapid și transparent</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              step: '1',
              title: 'Caută serviciul dorit',
              desc: 'Folosește bara de căutare pentru a găsi firme sau meșteri după categorie și locație.',
            },
            {
              step: '2',
              title: 'Compară profiluri',
              desc: 'Citește recenzii reale, vezi galeria foto și compară serviciile și prețurile.',
            },
            {
              step: '3',
              title: 'Contactează direct',
              desc: 'Sună direct sau trimite un mesaj prin formularul de contact. Fără intermediari.',
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="w-12 h-12 rounded-full bg-brand-700 text-white text-lg font-bold flex items-center justify-center mx-auto mb-4">
                {item.step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
