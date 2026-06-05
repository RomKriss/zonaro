import Link from 'next/link';
import { MapPin } from 'lucide-react';

const ORASE_EST = [
  { name: 'Iași', slug: 'iasi', county: 'Iași' },
  { name: 'Galați', slug: 'galati', county: 'Galați' },
  { name: 'Bacău', slug: 'bacau', county: 'Bacău' },
  { name: 'Suceava', slug: 'suceava', county: 'Suceava' },
  { name: 'Bârlad', slug: 'barlad', county: 'Vaslui' },
  { name: 'Vaslui', slug: 'vaslui', county: 'Vaslui' },
  { name: 'Piatra Neamț', slug: 'piatra-neamt', county: 'Neamț' },
  { name: 'Focșani', slug: 'focsani', county: 'Vrancea' },
  { name: 'Buzău', slug: 'buzau', county: 'Buzău' },
  { name: 'Brăila', slug: 'braila', county: 'Brăila' },
  { name: 'Botoșani', slug: 'botosani', county: 'Botoșani' },
  { name: 'Roman', slug: 'roman', county: 'Neamț' },
];

export function CitiesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-page">
        <div className="text-center mb-10">
          <h2 className="section-title">Caută în orașul tău</h2>
          <p className="section-subtitle">Firme și meșteri în principalele orașe din zona de est</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {ORASE_EST.map((city) => (
            <Link
              key={city.slug}
              href={`/cauta?county=${city.county.toLowerCase().replace(/\s/g, '-')}&city=${city.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-white border border-gray-100 p-4 hover:shadow-card-hover hover:border-brand-200 transition-all duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-lg bg-brand-50 group-hover:bg-brand-100 transition-colors flex-shrink-0">
                  <MapPin className="h-4 w-4 text-brand-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{city.name}</p>
                  <p className="text-xs text-gray-500">{city.county}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
