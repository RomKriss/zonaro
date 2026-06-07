import { Metadata } from 'next';
import { HeroSearch } from '@/components/home/HeroSearch';
import { CategoriesGrid } from '@/components/home/CategoriesGrid';
import { FeaturedBusinesses } from '@/components/home/FeaturedBusinesses';
import { CitiesSection } from '@/components/home/CitiesSection';
import { HomePricingSection } from '@/components/home/HomePricingSection';
import { CheckCircle2, Star, Building2, Users, MapPin, Search, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { getSiteSettings } from '@/lib/siteSettings';
import { WaitlistButton } from '@/components/ui/WaitlistModal';

export const metadata: Metadata = {
  title: 'ZonaRo — Directorul de Firme și Meșteri din Estul României',
  description:
    'ZonaRo — directorul de firme și meșteri verificați din estul României. Găsește rapid servicii verificate în Iași, Galați, Bacău, Vaslui, Suceava și județele învecinate.',
};

const STATS = [
  { icon: Building2, value: '50.000+', label: 'Firme listate' },
  { icon: Star, value: '120.000+', label: 'Recenzii verificate' },
  { icon: Users, value: '500.000+', label: 'Vizitatori lunar' },
  { icon: CheckCircle2, value: '2.800+', label: 'Firme verificate' },
];

const JUDETE_ACTIVE = [
  'Iași', 'Galați', 'Bacău', 'Vaslui', 'Suceava',
  'Neamț', 'Vrancea', 'Buzău', 'Brăila', 'Botoșani', 'București',
];

const AVANTAJE = [
  {
    icon: Search,
    title: 'Vizibilitate locală structurată',
    text: 'Un profil complet pe ZonaRo îți asigură prezența în rezultatele relevante pentru publicul din zona ta geografică. Într-un context în care căutările locale pe Google sunt în creștere accelerată, a fi listat corect și complet reprezintă un avantaj competitiv real față de furnizorii care nu au făcut acest pas.',
  },
  {
    icon: Star,
    title: 'Reputație construită pe recenzii verificate',
    text: 'Recenziile clienților reali constituie cel mai credibil instrument de construire a încrederii. Pe ZonaRo, fiecare recenzie este asociată unui utilizator verificat, oferind potențialilor clienți informații relevante și credibile în procesul de decizie.',
  },
  {
    icon: MessageSquare,
    title: 'Suport pentru creșterea prezenței digitale',
    text: 'ZonaRo oferă firmelor listate nu doar un profil, ci și acces la resurse educaționale și instrumente practice pentru îmbunătățirea vizibilității online — inclusiv elemente de optimizare pentru motoarele de căutare, fără a fi necesare cunoștințe tehnice prealabile.',
  },
];

export default async function HomePage() {
  const settings = await getSiteSettings();
  const mm = settings.maintenance_mode;

  return (
    <>
      {/* Hero */}
      <HeroSearch />

      {/* Maintenance notice — shown only when maintenance mode is active */}
      {mm && (
        <section className="bg-amber-50 border-b border-amber-100 py-10 px-4">
          <div className="container-page max-w-2xl mx-auto text-center">
            <p className="text-amber-700 text-xs font-bold uppercase tracking-widest mb-3">
              🚧 Platformă în pregătire
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
              {settings.maintenance_title}
            </h2>
            <p className="text-gray-500 mb-7 leading-relaxed">
              {settings.maintenance_description}
            </p>
            <WaitlistButton buttonText={settings.waitlist_button_text} size="lg" />
          </div>
        </section>
      )}

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

      {/* De ce ZonaRo? */}
      <section className="py-16 bg-gray-50">
        <div className="container-page max-w-3xl mx-auto">
          <h2 className="section-title text-center mb-6">O piață locală de servicii care lipsea</h2>
          <div className="prose prose-gray max-w-none text-gray-600 leading-relaxed space-y-4 text-base">
            <p>
              Accesul la furnizori de servicii verificați reprezintă una dintre provocările reale ale consumatorilor
              din orașele mici și mijlocii din România. Informațiile sunt dispersate, recenziile lipsesc sau sunt
              neverificabile, iar timpul necesar pentru a identifica un furnizor de încredere este nejustificat de mare.
            </p>
            <p>
              În același timp, mii de firme și meșteri serioși din zona de est a României nu dispun de o prezență
              digitală structurată — nu din lipsă de profesionalism, ci din lipsa unui instrument potrivit pentru
              realitatea lor locală.
            </p>
            <p>
              ZonaRo răspunde acestei duble nevoi: oferă clienților acces rapid la furnizori locali verificați și
              oferă firmelor o platformă prin care să fie găsite de publicul relevant, din orașul lor.
            </p>
          </div>
        </div>
      </section>

      {/* Viziunea noastră */}
      <section className="py-16 bg-white">
        <div className="container-page max-w-3xl mx-auto">
          <h2 className="section-title text-center mb-6">Digitalizarea serviciilor locale nu mai poate fi amânată</h2>
          <div className="text-gray-600 leading-relaxed space-y-4 text-base">
            <p>
              Comportamentul consumatorilor din România se schimbă accelerat. În 2026, căutările pe Google pentru
              servicii locale sunt în creștere semnificativă, urmând un traseu deja parcurs de piețele vest-europene.
              În orașe precum Londra sau Berlin, alegerea unui furnizor de servicii se face aproape exclusiv pe baza
              recenziilor online, a timpului de răspuns și a calității profilului digital.
            </p>
            <p>
              România parcurge aceeași tranziție. Orizontul de timp nu mai este de un deceniu — ci de unul până la
              doi ani.
            </p>
            <p>
              Multe firme și meșteri din estul României nu au integrat încă prezența digitală în strategia lor de
              dezvoltare. Nu este o problemă de competență profesională — ci de acces la informație și la instrumente
              potrivite.
            </p>
            <p>
              ZonaRo a fost construit cu misiunea explicită de a sprijini această tranziție. Oferim firmelor locale
              nu doar vizibilitate, ci și contextul necesar pentru a înțelege de ce prezența online este un avantaj
              competitiv real, acum.
            </p>
          </div>
        </div>
      </section>

      {/* Categorii */}
      <CategoriesGrid />

      {/* Featured businesses */}
      <FeaturedBusinesses />

      {/* Zone active */}
      <section className="py-14 bg-gray-50">
        <div className="container-page text-center">
          <h2 className="section-title mb-2">Zone active la lansare</h2>
          <p className="section-subtitle mb-8">Prezent în județele cu cea mai mare cerere din estul României</p>
          <div className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto mb-4">
            {JUDETE_ACTIVE.map((j) => (
              <Link
                key={j}
                href={`/cauta?county=${j.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/\s/g, '-')}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-brand-200 text-brand-700 text-sm font-medium hover:bg-brand-50 hover:border-brand-400 transition-all"
              >
                <MapPin className="h-3.5 w-3.5" />
                {j}
              </Link>
            ))}
          </div>
          <p className="text-xs text-gray-400 italic">Extindem constant — urmează întreaga Românie.</p>
        </div>
      </section>

      {/* Orașe principale */}
      <CitiesSection />

      {/* Planuri prețuri */}
      <HomePricingSection />

      {/* Despre ZonaRo */}
      <section className="py-16 bg-gray-50">
        <div className="container-page max-w-3xl mx-auto">
          <h2 className="section-title text-center mb-6">Despre ZonaRo</h2>
          <div className="text-gray-600 leading-relaxed space-y-4 text-base">
            <p>
              ZonaRo este un director local de firme și meșteri, construit pentru estul României, cu intenția de a
              se extinde la nivel național.
            </p>
            <p>
              Platforma a fost creată ca răspuns la un gol de piață clar: absența unui instrument digital modern,
              credibil și orientat local, care să conecteze consumatorii cu furnizorii de servicii din zona lor
              geografică.
            </p>
            <p>
              Ne adresăm deopotrivă clienților care caută servicii de calitate în orașul lor și firmelor care
              doresc să își construiască o prezență digitală relevantă. Abordarea noastră combină simplitatea unui
              director de servicii cu instrumentele necesare creșterii vizibilității online — recenzii verificate,
              profiluri structurate și suport pentru optimizarea prezenței pe motoarele de căutare.
            </p>
            <p>
              ZonaRo este o platformă în construcție activă, dezvoltată pas cu pas, în dialog cu nevoile reale ale
              comunităților locale pe care le deservește.
            </p>
          </div>
        </div>
      </section>

      {/* De ce să alegi ZonaRo */}
      <section className="py-16 bg-white">
        <div className="container-page">
          <div className="text-center mb-12">
            <h2 className="section-title">Avantajele unui profil ZonaRo pentru afacerea ta</h2>
            <p className="section-subtitle">Trei motive pentru care prezența pe ZonaRo contează</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {AVANTAJE.map((item) => (
              <div key={item.title} className="card p-6 flex flex-col gap-4">
                <div className="p-3 rounded-xl bg-brand-50 w-fit">
                  <item.icon className="h-6 w-6 text-brand-700" />
                </div>
                <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="py-16 bg-gradient-to-r from-brand-800 to-brand-700">
        <div className="container-page text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            {mm ? 'Fii primul la lansare' : 'Ai o firmă sau ești meșter?'}
          </h2>
          <p className="text-blue-200 mb-8 text-lg max-w-xl mx-auto">
            {mm
              ? 'Înscrie-te acum și îți rezervi accesul prioritar când platforma se lansează.'
              : 'Listează-te gratuit pe ZonaRo și ajunge la mii de clienți noi în fiecare lună.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {mm ? (
              <WaitlistButton
                buttonText={settings.waitlist_button_text}
                buttonClassName="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-brand-800 font-semibold rounded-xl hover:bg-gray-100 transition-colors text-base"
                size="lg"
              />
            ) : (
              <>
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
              </>
            )}
          </div>
          {!mm && (
            <p className="mt-4 text-xs text-blue-300">
              Fără card de credit. Plan gratuit pentru totdeauna.
            </p>
          )}
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
