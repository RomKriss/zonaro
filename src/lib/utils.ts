import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { BusinessPlan, PlanConfig } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Generează slug curat din text românesc
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/ă/g, 'a').replace(/â/g, 'a').replace(/î/g, 'i')
    .replace(/ș/g, 's').replace(/ț/g, 't')
    .replace(/Ă/g, 'a').replace(/Â/g, 'a').replace(/Î/g, 'i')
    .replace(/Ș/g, 's').replace(/Ț/g, 't')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Formatare număr ca RON
export function formatRON(amount: number): string {
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
    minimumFractionDigits: 0,
  }).format(amount);
}

// Formatare dată în română
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

// Truncare text cu număr de cuvinte
export function truncateWords(text: string, maxWords: number): string {
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
}

// Număr de cuvinte dintr-un text
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// URL profil firmă
export function getBusinessUrl(county: string, categorySlug: string, businessSlug: string): string {
  return `/${generateSlug(county)}/${categorySlug}/${businessSlug}`;
}

// Configurații planuri — prețuri ZonaRo lansare 2024
export const PLANS: PlanConfig[] = [
  {
    id: 'free',
    name: 'Start',
    price_monthly: 0,
    price_yearly: 0,
    features: [
      '1 poză profil',
      'Descriere până la 150 cuvinte',
      '1 serviciu listat',
      'Pagină publică de profil',
      'Formular de contact activ',
      'Badge „Profil ZonaRo"',
      'Statistici de bază (număr vizite)',
    ],
    limits: { photos: 1, description_words: 150, services: 1 },
  },
  {
    id: 'plus',
    name: 'Plus',
    price_monthly: 34.99,
    price_yearly: 314.99,
    features: [
      '5 poze',
      'Descriere până la 500 cuvinte',
      '3 servicii listate',
      'Răspuns la recenzii',
      'Statistici detaliate',
      'Prioritate medie în căutare',
      'Suport email',
    ],
    limits: { photos: 5, description_words: 500, services: 3 },
  },
  {
    id: 'pro',
    name: 'Pro',
    price_monthly: 69.99,
    price_yearly: 629.99,
    popular: true,
    features: [
      '15 poze + galerie video YouTube',
      'Descriere până la 2000 cuvinte',
      'Servicii și produse nelimitate',
      'Badge „Firmă Verificată"',
      'Prioritate înaltă în căutare',
      'Website activ și clickabil',
      'Recenzii complete cu răspunsuri',
      'Statistici avansate',
      'Suport prioritar',
    ],
    limits: { photos: 15, description_words: 2000, services: 'unlimited' },
  },
  {
    id: 'elite',
    name: 'Elite',
    price_monthly: 139.99,
    price_yearly: 1259.99,
    features: [
      'Tot ce include Pro, plus:',
      'Top 3 fix în categorie și oraș',
      'Badge „Partener Elite" vizibil',
      'Profil featured pe pagina principală',
      'Raport lunar de performanță',
      'Manager de cont dedicat',
      'Banner promoțional pe categorii',
    ],
    limits: { photos: 15, description_words: 2000, services: 'unlimited' },
  },
];

export function getPlanConfig(plan: BusinessPlan): PlanConfig {
  return PLANS.find((p) => p.id === plan) ?? PLANS[0];
}

// Județele României
export const JUDETE = [
  'Alba', 'Arad', 'Argeș', 'Bacău', 'Bihor', 'Bistrița-Năsăud',
  'Botoșani', 'Brăila', 'Brașov', 'București', 'Buzău', 'Călărași',
  'Caraș-Severin', 'Cluj', 'Constanța', 'Covasna', 'Dâmbovița',
  'Dolj', 'Galați', 'Giurgiu', 'Gorj', 'Harghita', 'Hunedoara',
  'Ialomița', 'Iași', 'Ilfov', 'Maramureș', 'Mehedinți', 'Mureș',
  'Neamț', 'Olt', 'Prahova', 'Sălaj', 'Satu Mare', 'Sibiu',
  'Suceava', 'Teleorman', 'Timiș', 'Tulcea', 'Vâlcea', 'Vaslui',
  'Vrancea',
];

export const ORASE_PRINCIPALE = [
  { name: 'București', slug: 'bucuresti', county: 'București' },
  { name: 'Cluj-Napoca', slug: 'cluj-napoca', county: 'Cluj' },
  { name: 'Timișoara', slug: 'timisoara', county: 'Timiș' },
  { name: 'Iași', slug: 'iasi', county: 'Iași' },
  { name: 'Constanța', slug: 'constanta', county: 'Constanța' },
  { name: 'Brașov', slug: 'brasov', county: 'Brașov' },
  { name: 'Galați', slug: 'galati', county: 'Galați' },
  { name: 'Bacău', slug: 'bacau', county: 'Bacău' },
];
