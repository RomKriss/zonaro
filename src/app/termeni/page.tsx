import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Termeni și Condiții — ZonaRo',
  description: 'Termenii și condițiile de utilizare a platformei ZonaRo.',
};

const SECTIONS = [
  {
    id: 'date-importate',
    title: '1. Date importate',
    content: `ZonaRo importă date despre firme din surse publice oficiale, inclusiv Registrul Comerțului (ONRC). ZonaRo nu garantează acuratețea, completitudinea sau actualitatea acestor date. Informațiile afișate au caracter informativ și pot diferi de datele oficiale actualizate.`,
  },
  {
    id: 'revendicarea-profilurilor',
    title: '2. Revendicarea profilurilor',
    content: `Utilizatorii care revendică un profil de firmă pe ZonaRo confirmă că sunt reprezentanți legali autorizați ai firmei respective. ZonaRo nu este responsabil pentru revendicări frauduloase efectuate de terți. Orice revendicare frauduloasă reprezintă responsabilitatea exclusivă a utilizatorului care a efectuat-o și poate face obiectul unei sesizări penale sau civile.`,
  },
  {
    id: 'raportarea-abuzurilor',
    title: '3. Raportarea abuzurilor',
    content: `Dacă profilul firmei tale a fost revendicat fără acordul tău, te rugăm să ne contactezi imediat la contact@zonaro.ro. ZonaRo își rezervă dreptul de a suspenda sau șterge orice profil revendicat fraudulos după verificarea sesizării. Firma afectată poate iniția un nou proces de revendicare oricând prin aceeași procedură de verificare.`,
  },
  {
    id: 'limitarea-raspunderii',
    title: '4. Limitarea răspunderii',
    content: `ZonaRo acționează exclusiv ca platformă intermediară între utilizatori și nu este parte în relațiile comerciale dintre aceștia. ZonaRo nu garantează calitatea serviciilor oferite de firmele listate și nu își asumă responsabilitatea pentru prejudiciile cauzate de informații incorecte sau revendicări neautorizate.`,
  },
  {
    id: 'modificarea-termenilor',
    title: '5. Modificarea termenilor',
    content: `ZonaRo își rezervă dreptul de a modifica acești termeni oricând. Utilizarea continuă a platformei după publicarea modificărilor constituie acceptarea acestora.`,
  },
];

export default function TermeniPage() {
  return (
    <div className="container-page py-12 max-w-3xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Termeni și Condiții ZonaRo</h1>
        <p className="text-gray-500 text-sm">Ultima actualizare: iunie 2026 · Versiunea 1.1</p>
      </div>

      {/* Cuprins */}
      <nav className="card p-5 mb-10">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Cuprins</p>
        <ul className="space-y-1.5">
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="text-sm text-brand-700 hover:text-brand-900 hover:underline"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Secțiuni */}
      <div className="space-y-10">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-24">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">{s.title}</h2>
            <p className="text-gray-600 leading-relaxed text-sm">{s.content}</p>
          </section>
        ))}
      </div>

      <div className="mt-12 pt-8 border-t border-gray-200 text-sm text-gray-500 space-y-1">
        <p>
          Pentru întrebări sau sesizări:{' '}
          <a href="mailto:contact@zonaro.ro" className="text-brand-700 hover:underline">
            contact@zonaro.ro
          </a>
        </p>
        <p>
          <Link href="/confidentialitate" className="text-brand-700 hover:underline">
            Politica de Confidențialitate
          </Link>
          {' · '}
          <Link href="/" className="text-brand-700 hover:underline">
            Înapoi la ZonaRo
          </Link>
        </p>
      </div>
    </div>
  );
}
