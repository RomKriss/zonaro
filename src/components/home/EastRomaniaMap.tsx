import Link from 'next/link';

// Județele active (zona de est)
const ACTIVE_COUNTIES = ['Iași', 'Vaslui', 'Galați', 'Bacău', 'Neamț', 'Vrancea', 'Brăila', 'Buzău', 'Suceava', 'Botoșani'];

// Județele din est cu linkuri
const COUNTY_LINKS = [
  { name: 'Iași', href: '/cauta?county=iasi' },
  { name: 'Galați', href: '/cauta?county=galati' },
  { name: 'Bacău', href: '/cauta?county=bacau' },
  { name: 'Vaslui', href: '/cauta?county=vaslui' },
  { name: 'Suceava', href: '/cauta?county=suceava' },
  { name: 'Botoșani', href: '/cauta?county=botosani' },
  { name: 'Neamț', href: '/cauta?county=neamt' },
  { name: 'Vrancea', href: '/cauta?county=vrancea' },
  { name: 'Brăila', href: '/cauta?county=braila' },
  { name: 'Buzău', href: '/cauta?county=buzau' },
];

export function EastRomaniaMap() {
  return (
    <section className="py-16 container-page">
      <div className="text-center mb-10">
        <h2 className="section-title">Acoperim zona de est</h2>
        <p className="section-subtitle">
          Extindem constant. Urmează întreaga Românie.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10 items-center justify-center">
        {/* Hartă simplificată SVG */}
        <div className="w-full max-w-sm lg:max-w-md">
          <svg
            viewBox="0 0 380 340"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-auto drop-shadow-md"
            aria-label="Harta României cu zona de est evidențiată"
          >
            {/* Contur aproximativ România — vest/centru/sud (gri) */}
            <path
              d="M60 80 L50 100 L40 120 L45 145 L35 165 L40 185 L55 200 L50 220 L60 240 L80 255 L100 260 L115 270 L130 265 L145 275 L160 268 L170 278 L185 272 L195 280 L210 272"
              stroke="#D1D5DB" strokeWidth="2" fill="#F3F4F6" strokeLinejoin="round"
            />
            <path
              d="M60 80 L80 65 L100 55 L125 48 L150 45 L175 50 L195 45 L215 52 L230 60 L245 72 L255 85 L260 100"
              stroke="#D1D5DB" strokeWidth="2" fill="#F3F4F6" strokeLinejoin="round"
            />
            <path
              d="M60 80 L60 240 L80 255 L100 260 L115 270 L130 265 L145 275 L160 268 L170 278 L185 272 L195 280 L210 272 L225 278 L240 270 L250 255 L255 240 L260 220 L265 200 L260 180 L265 160 L260 140 L260 100 L245 72 L215 52 L195 45 L175 50 L150 45 L125 48 L100 55 L80 65 L60 80Z"
              fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1.5"
            />

            {/* Zona de est — evidențiată în albastru brand */}
            {/* Suceava + Botoșani (nord-est) */}
            <path
              d="M260 60 L285 55 L310 62 L330 75 L340 95 L335 115 L320 125 L305 120 L290 130 L275 125 L265 110 L260 100 L260 80Z"
              fill="#1B3A6B" fillOpacity="0.85" stroke="#1B3A6B" strokeWidth="1.5"
            />
            {/* Iași + Vaslui + Neamț (est central) */}
            <path
              d="M260 100 L265 110 L275 125 L290 130 L300 145 L310 160 L305 175 L295 185 L285 195 L275 190 L265 200 L260 180 L265 160 L260 140 L260 100Z"
              fill="#1B3A6B" fillOpacity="0.85" stroke="#1B3A6B" strokeWidth="1.5"
            />
            {/* Bacău (est central-sud) */}
            <path
              d="M265 160 L305 175 L310 195 L305 215 L295 225 L280 230 L270 220 L265 200 L265 160Z"
              fill="#1B3A6B" fillOpacity="0.85" stroke="#1B3A6B" strokeWidth="1.5"
            />
            {/* Galați + Vrancea + Brăila + Buzău (sud-est) */}
            <path
              d="M265 200 L280 230 L295 225 L310 235 L325 250 L320 265 L305 270 L285 265 L265 255 L255 240 L260 220 L265 200Z"
              fill="#1B3A6B" fillOpacity="0.75" stroke="#1B3A6B" strokeWidth="1.5"
            />

            {/* Puncte pentru județe active */}
            {[
              { cx: 300, cy: 85, label: 'Botoșani' },
              { cx: 300, cy: 115, label: 'Suceava' },
              { cx: 290, cy: 155, label: 'Neamț' },
              { cx: 295, cy: 135, label: 'Iași' },
              { cx: 285, cy: 175, label: 'Vaslui' },
              { cx: 290, cy: 200, label: 'Bacău' },
              { cx: 295, cy: 225, label: 'Vrancea' },
              { cx: 305, cy: 250, label: 'Galați' },
              { cx: 280, cy: 248, label: 'Brăila' },
              { cx: 265, cy: 238, label: 'Buzău' },
            ].map((dot) => (
              <g key={dot.label}>
                <circle cx={dot.cx} cy={dot.cy} r="5" fill="#E85D04" />
                <circle cx={dot.cx} cy={dot.cy} r="9" fill="#E85D04" fillOpacity="0.25" />
              </g>
            ))}

            {/* Label România */}
            <text x="140" y="160" fontSize="11" fill="#9CA3AF" fontFamily="Inter, sans-serif" fontWeight="600">
              ROMÂNIA
            </text>
            {/* Label Zona ZonaRo */}
            <text x="282" y="175" fontSize="9" fill="white" fontFamily="Inter, sans-serif" fontWeight="700" textAnchor="middle">
              ZonaRo
            </text>
          </svg>
        </div>

        {/* Lista județe active */}
        <div className="flex-1 max-w-md">
          <div className="bg-brand-50 rounded-2xl p-6 border border-brand-100">
            <h3 className="font-bold text-brand-900 mb-1">Județe active la lansare</h3>
            <p className="text-sm text-brand-700 mb-5">
              Platformă focusată pe est. Firmele pot fi listate și vizualizate în aceste județe.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {COUNTY_LINKS.map((county) => (
                <Link
                  key={county.name}
                  href={county.href}
                  className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-brand-200 hover:border-brand-400 hover:bg-brand-50 transition-all text-sm font-medium text-brand-800 group"
                >
                  <span className="h-2 w-2 rounded-full bg-accent-500 flex-shrink-0" />
                  {county.name}
                  <span className="ml-auto text-brand-400 group-hover:text-brand-600 text-xs">→</span>
                </Link>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-brand-100">
              <p className="text-xs text-brand-600 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                Extindem constant — urmează Cluj, București, Timișoara
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
