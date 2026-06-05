'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin } from 'lucide-react';

const CATEGORY_LINKS = [
  { label: 'Construcții', href: '/cauta?category=constructii-renovari' },
  { label: 'Instalații', href: '/cauta?category=instalatii' },
  { label: 'Electricitate', href: '/cauta?category=electricitate' },
  { label: 'Servicii Auto', href: '/cauta?category=servicii-auto' },
  { label: 'Sănătate', href: '/cauta?category=sanatate-medicina' },
  { label: 'IT și Tech', href: '/cauta?category=it-tehnologie' },
  { label: 'Imobiliare', href: '/cauta?category=imobiliare' },
  { label: 'Beauty', href: '/cauta?category=saloane-beauty' },
];

const COUNTY_LINKS = [
  { label: 'București', href: '/cauta?county=bucuresti' },
  { label: 'Cluj', href: '/cauta?county=cluj' },
  { label: 'Iași', href: '/cauta?county=iasi' },
  { label: 'Timiș', href: '/cauta?county=timis' },
  { label: 'Constanța', href: '/cauta?county=constanta' },
  { label: 'Brașov', href: '/cauta?county=brasov' },
  { label: 'Galați', href: '/cauta?county=galati' },
  { label: 'Bacău', href: '/cauta?county=bacau' },
];

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Image src="/logo-white.svg" alt="ZonaRo" width={130} height={32} />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Directorul național de firme și meșteri din România. Găsește specialiști de încredere în orașul tău.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <a href="mailto:contact@zonaro.ro" className="hover:text-white transition-colors">
                  contact@zonaro.ro
                </a>
              </div>
            </div>
          </div>

          {/* Categorii */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Categorii</h3>
            <ul className="space-y-2">
              {CATEGORY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Județe */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Județe</h3>
            <ul className="space-y-2">
              {COUNTY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Planuri */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Planuri</h3>
            <ul className="space-y-2">
              <li><Link href="/preturi#start" className="text-sm hover:text-white transition-colors">Start — Gratuit</Link></li>
              <li><Link href="/preturi#plus" className="text-sm hover:text-white transition-colors">Plus — 49 RON/lună</Link></li>
              <li><Link href="/preturi#pro" className="text-sm hover:text-white transition-colors text-amber-400 font-medium">Pro — 99 RON/lună ⭐</Link></li>
              <li><Link href="/preturi#elite" className="text-sm hover:text-white transition-colors">Elite — 199 RON/lună</Link></li>
              <li className="pt-1">
                <Link href="/preturi" className="text-sm text-brand-400 hover:text-brand-300 font-medium transition-colors">
                  Compară toate planurile →
                </Link>
              </li>
            </ul>
          </div>

          {/* Companie */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">ZonaRo</h3>
            <ul className="space-y-2">
              <li><Link href="/inregistrare" className="text-sm hover:text-white transition-colors">Înregistrează-ți firma</Link></li>
              <li><Link href="/autentificare" className="text-sm hover:text-white transition-colors">Autentificare</Link></li>
              <li><Link href="/about" className="text-sm hover:text-white transition-colors">Despre noi</Link></li>
              <li><Link href="/contact" className="text-sm hover:text-white transition-colors">Contact</Link></li>
              <li className="pt-1 border-t border-gray-800 mt-1">
                <Link href="/termeni" className="text-sm hover:text-white transition-colors font-medium text-gray-400">Termeni și Condiții</Link>
              </li>
              <li>
                <Link href="/confidentialitate" className="text-sm hover:text-white transition-colors font-medium text-gray-400">Politica de Confidențialitate</Link>
              </li>
              <li>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-settings'))}
                  className="text-sm hover:text-white transition-colors font-medium text-gray-400 text-left"
                >
                  Setări Cookie-uri
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} ZonaRo SRL. Toate drepturile rezervate.
          </p>
          <p className="text-xs text-gray-600">
            Construit cu ❤️ în România
          </p>
        </div>
      </div>
    </footer>
  );
}
