'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  HardHat, Wrench, Zap, Car, Heart, SmilePlus, Scale, Building2,
  Monitor, Scissors, UtensilsCrossed, GraduationCap, Truck,
  Calculator, Sparkles, Sprout, Factory, ShoppingBag, Camera, MoreHorizontal
} from 'lucide-react';

const CATEGORIES = [
  { name: 'Construcții', slug: 'constructii-renovari', icon: HardHat, color: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100' },
  { name: 'Instalații', slug: 'instalatii', icon: Wrench, color: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100' },
  { name: 'Electricitate', slug: 'electricitate', icon: Zap, color: 'bg-yellow-50 text-yellow-600 group-hover:bg-yellow-100' },
  { name: 'Servicii Auto', slug: 'servicii-auto', icon: Car, color: 'bg-red-50 text-red-600 group-hover:bg-red-100' },
  { name: 'Sănătate', slug: 'sanatate-medicina', icon: Heart, color: 'bg-pink-50 text-pink-600 group-hover:bg-pink-100' },
  { name: 'Stomatologie', slug: 'stomatologie', icon: SmilePlus, color: 'bg-cyan-50 text-cyan-600 group-hover:bg-cyan-100' },
  { name: 'Avocatură', slug: 'avocatura-notariat', icon: Scale, color: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100' },
  { name: 'Imobiliare', slug: 'imobiliare', icon: Building2, color: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100' },
  { name: 'IT & Tech', slug: 'it-tehnologie', icon: Monitor, color: 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100' },
  { name: 'Beauty', slug: 'saloane-beauty', icon: Scissors, color: 'bg-rose-50 text-rose-600 group-hover:bg-rose-100' },
  { name: 'Restaurante', slug: 'restaurante-catering', icon: UtensilsCrossed, color: 'bg-amber-50 text-amber-600 group-hover:bg-amber-100' },
  { name: 'Educație', slug: 'educatie-meditatii', icon: GraduationCap, color: 'bg-teal-50 text-teal-600 group-hover:bg-teal-100' },
  { name: 'Transport', slug: 'transport-curierat', icon: Truck, color: 'bg-slate-50 text-slate-600 group-hover:bg-slate-100' },
  { name: 'Contabilitate', slug: 'contabilitate-consultanta', icon: Calculator, color: 'bg-green-50 text-green-600 group-hover:bg-green-100' },
  { name: 'Curățenie', slug: 'curatenie-menaj', icon: Sparkles, color: 'bg-sky-50 text-sky-600 group-hover:bg-sky-100' },
  { name: 'Evenimente', slug: 'evenimente-foto-video', icon: Camera, color: 'bg-violet-50 text-violet-600 group-hover:bg-violet-100' },
  { name: 'Agricultură', slug: 'agricultura', icon: Sprout, color: 'bg-lime-50 text-lime-600 group-hover:bg-lime-100' },
  { name: 'Industrie', slug: 'productie-industrie', icon: Factory, color: 'bg-zinc-50 text-zinc-600 group-hover:bg-zinc-100' },
  { name: 'Comerț', slug: 'comert-magazine', icon: ShoppingBag, color: 'bg-fuchsia-50 text-fuchsia-600 group-hover:bg-fuchsia-100' },
  { name: 'Altele', slug: 'alte-servicii', icon: MoreHorizontal, color: 'bg-gray-50 text-gray-600 group-hover:bg-gray-100' },
];

const VISIBLE_DEFAULT = 8;

export function CategoriesGrid() {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? CATEGORIES : CATEGORIES.slice(0, VISIBLE_DEFAULT);

  return (
    <section className="py-16 container-page">
      <div className="text-center mb-10">
        <h2 className="section-title">Caută după categorie</h2>
        <p className="section-subtitle">Peste 20 de categorii cu mii de firme verificate</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {visible.map((cat) => (
          <Link
            key={cat.slug}
            href={`/cauta?category=${cat.slug}`}
            className="group flex flex-col items-center gap-3 p-4 rounded-2xl border border-gray-100 bg-white hover:shadow-card-hover hover:border-gray-200 transition-all duration-200"
          >
            <div className={`p-3 rounded-xl transition-colors ${cat.color}`}>
              <cat.icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-gray-700 text-center leading-tight">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>

      {!expanded && (
        <div className="text-center mt-6">
          <button
            onClick={() => setExpanded(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50 transition-all"
          >
            <ChevronDown className="h-4 w-4" />
            Vezi toate categoriile ({CATEGORIES.length - VISIBLE_DEFAULT} mai multe)
          </button>
        </div>
      )}
      {expanded && (
        <div className="text-center mt-6">
          <button
            onClick={() => setExpanded(false)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50 transition-all"
          >
            <ChevronUp className="h-4 w-4" />
            Arată mai puține
          </button>
        </div>
      )}
    </section>
  );
}
