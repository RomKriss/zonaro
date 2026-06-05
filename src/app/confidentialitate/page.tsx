import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Politica de Confidențialitate — GDPR',
  description: 'Politica de confidențialitate și protecția datelor personale conform GDPR pentru platforma ZonaRo.',
  robots: { index: true, follow: true },
};

const TOC = [
  { id: 'operator', label: '1. Identitatea Operatorului' },
  { id: 'date-colectate', label: '2. Ce Date Colectăm' },
  { id: 'utilizare', label: '3. Cum Folosim Datele' },
  { id: 'impartasire', label: '4. Cu Cine Împărtășim Datele' },
  { id: 'transferuri', label: '5. Transferuri Internaționale' },
  { id: 'retentie', label: '6. Cât Timp Păstrăm Datele' },
  { id: 'drepturi', label: '7. Drepturile Tale (GDPR)' },
  { id: 'cookies', label: '8. Cookies' },
  { id: 'securitate', label: '9. Securitatea Datelor' },
  { id: 'minori', label: '10. Minori' },
  { id: 'modificari', label: '11. Modificări ale Politicii' },
  { id: 'contact', label: '12. Contact și Plângeri' },
];

export default function ConfidentialitatePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-brand-700 mb-2 uppercase tracking-wider">Document Legal — GDPR</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Politica de Confidențialitate</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>Versiunea: <strong className="text-gray-700">1.0</strong></span>
              <span>Data: <strong className="text-gray-700">04 Iunie 2026</strong></span>
              <span>Conform: <strong className="text-gray-700">GDPR (UE 2016/679)</strong></span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="lg:grid lg:grid-cols-4 lg:gap-10">
          {/* Sidebar TOC */}
          <aside className="hidden lg:block col-span-1">
            <div className="sticky top-6 bg-white rounded-2xl border border-gray-200 p-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Cuprins</p>
              <nav className="space-y-1">
                {TOC.map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="block text-sm text-gray-600 hover:text-brand-700 hover:bg-brand-50 rounded-lg px-3 py-1.5 transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <Link
                  href="/termeni"
                  className="block text-sm text-brand-700 hover:underline font-medium"
                >
                  → Termeni și Condiții
                </Link>
                <a
                  href="mailto:gdpr@zonaro.ro"
                  className="block text-sm text-brand-700 hover:underline font-medium mt-2"
                >
                  → gdpr@zonaro.ro
                </a>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 lg:p-12 prose prose-gray max-w-none text-base leading-relaxed">

              {/* Intro */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 not-prose">
                <p className="text-sm text-blue-900 leading-relaxed">
                  <strong>Transparență totală.</strong> Această Politică de Confidențialitate descrie în detaliu cum colectăm, utilizăm și protejăm datele dumneavoastră personale, în conformitate cu Regulamentul General privind Protecția Datelor (GDPR — Regulamentul UE 2016/679) și legislația română aplicabilă. Vă rugăm să o citiți cu atenție.
                </p>
              </div>

              {/* 1 */}
              <section id="operator">
                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-100">1. Identitatea și Datele de Contact ale Operatorului</h2>
                <div className="bg-gray-50 rounded-xl p-5 not-prose text-sm space-y-2">
                  <p><strong>Operator:</strong> [NUMELE SRL-ULUI] — societate comercială înregistrată în România</p>
                  <p><strong>CUI:</strong> [CUI-UL TĂU]</p>
                  <p><strong>Sediu social:</strong> [ADRESA COMPLETĂ], România</p>
                  <p><strong>Email general:</strong> <a href="mailto:contact@zonaro.ro" className="text-brand-700 hover:underline">contact@zonaro.ro</a></p>
                  <p><strong>Email GDPR:</strong> <a href="mailto:gdpr@zonaro.ro" className="text-brand-700 hover:underline">gdpr@zonaro.ro</a></p>
                  <p><strong>Website:</strong> <a href="https://zonaro.ro" className="text-brand-700 hover:underline">zonaro.ro</a></p>
                </div>
                <p className="mt-4"><strong>Responsabil cu Protecția Datelor (DPO).</strong> Compania noastră nu are obligația legală de a desemna un Responsabil cu Protecția Datelor (DPO) conform art. 37 GDPR, deoarece: (a) nu suntem o autoritate publică; (b) nu efectuăm monitorizarea sistematică și la scară largă a persoanelor fizice ca activitate principală; (c) nu prelucrăm date speciale sau date penale la scară largă. Cu toate acestea, am desemnat intern o persoană responsabilă cu problematica GDPR, contactabilă la <a href="mailto:gdpr@zonaro.ro" className="text-brand-700 hover:underline">gdpr@zonaro.ro</a>.</p>
                <p className="mt-3"><strong>Autoritatea de supraveghere competentă:</strong> Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal (ANSPDCP), Bd. G-ral. Gheorghe Magheru 28-30, Sector 1, București. Website: <a href="https://www.anspdcp.eu" className="text-brand-700 hover:underline" target="_blank" rel="noopener noreferrer">anspdcp.eu</a>.</p>
              </section>

              {/* 2 */}
              <section id="date-colectate">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">2. Ce Date Colectăm și De Ce</h2>

                <h3 className="font-semibold text-gray-900 mt-6 mb-3">2.1. Date colectate de la Vizitatori (utilizatori neautentificați)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-gray-200 rounded-xl overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 border-b border-gray-200">Categorie de date</th>
                        <th className="text-left p-3 border-b border-gray-200">Exemple</th>
                        <th className="text-left p-3 border-b border-gray-200">Scop</th>
                        <th className="text-left p-3 border-b border-gray-200">Temei juridic</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="p-3 font-medium">Date tehnice</td>
                        <td className="p-3">Adresă IP (anonimizată), browser, sistem de operare, rezoluție ecran</td>
                        <td className="p-3">Securitate, prevenirea abuzurilor, statistici agregate</td>
                        <td className="p-3 text-blue-700">Interes legitim (art. 6(1)(f))</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Date de navigare</td>
                        <td className="p-3">Paginile vizitate, durata sesiunii, sursa accesului</td>
                        <td className="p-3">Îmbunătățirea experienței de utilizare, analytics anonim</td>
                        <td className="p-3 text-blue-700">Interes legitim (art. 6(1)(f))</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Cookies tehnice</td>
                        <td className="p-3">Token sesiune, preferințe UI</td>
                        <td className="p-3">Funcționarea corectă a platformei</td>
                        <td className="p-3 text-green-700">Necesar tehnic (nu necesită consimțământ)</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="font-semibold text-gray-900 mt-8 mb-3">2.2. Date colectate de la Firmele Înregistrate</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse border border-gray-200 rounded-xl overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 border-b border-gray-200">Categorie de date</th>
                        <th className="text-left p-3 border-b border-gray-200">Date specifice</th>
                        <th className="text-left p-3 border-b border-gray-200">Temei juridic</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="p-3 font-medium">Identificare</td>
                        <td className="p-3">Nume și prenume reprezentant, email, parolă (hash bcrypt), număr de telefon</td>
                        <td className="p-3 text-orange-700">Executarea contractului (art. 6(1)(b))</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Date firmă</td>
                        <td className="p-3">Denumire firmă, CUI/CIF, adresă sediu, categorie de activitate, județ</td>
                        <td className="p-3 text-orange-700">Executarea contractului (art. 6(1)(b))</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Conținut profil</td>
                        <td className="p-3">Descriere servicii, fotografii, orarul de funcționare, website, social media</td>
                        <td className="p-3 text-purple-700">Consimțământ (art. 6(1)(a))</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Date financiare</td>
                        <td className="p-3">Istoricul plăților, planul de abonament activ. <em>Datele cardului sunt gestionate exclusiv de Stripe — nu le stocăm noi.</em></td>
                        <td className="p-3 text-orange-700">Executarea contractului + Obligație legală (art. 6(1)(c))</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Date de utilizare</td>
                        <td className="p-3">Statistici vizualizări profil, loguri de acces, clickuri pe contact</td>
                        <td className="p-3 text-blue-700">Interes legitim (art. 6(1)(f))</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="font-semibold text-gray-900 mt-8 mb-3">2.3. Date colectate de la Autorii de Recenzii</h3>
                <ul className="list-disc pl-6 space-y-2 mt-2 text-sm">
                  <li><strong>Nume sau pseudonim</strong> (afișat public alături de recenzie)</li>
                  <li><strong>Adresă email</strong> (nu se afișează public; utilizată pentru notificări și verificare autenticitate)</li>
                  <li><strong>Număr factură sau document justificativ</strong> (pentru recenzii verificate — nu se afișează public)</li>
                  <li><strong>Conținutul recenziei</strong> și evaluarea numerică</li>
                </ul>
                <p className="mt-3 text-sm text-gray-600">Temei juridic: <strong>Interes legitim</strong> (art. 6(1)(f) GDPR) — asigurarea integrității sistemului de recenzii și protejarea intereselor legitime ale Firmelor și ale altor Utilizatori.</p>

                <h3 className="font-semibold text-gray-900 mt-8 mb-3">2.4. Date din Surse Publice (ONRC/ANAF)</h3>
                <p className="text-sm text-gray-700">ZonaRo importă și prelucrează date despre firme din registrele publice oficiale ale României (Oficiul Național al Registrului Comerțului — ONRC și Agenția Națională de Administrare Fiscală — ANAF). Aceste date includ: denumirea firmei, CUI-ul, adresa sediului social, codul CAEN și datele de contact disponibile public.</p>
                <p className="mt-3 text-sm text-gray-700">Temeiul juridic pentru această prelucrare este <strong>interesul legitim</strong> (art. 6(1)(f) GDPR) al Operatorului de a furniza un director complet al firmelor din România, în beneficiul public. Firmele pot solicita în orice moment corectarea sau eliminarea datelor lor din Platformă, prin email la <a href="mailto:gdpr@zonaro.ro" className="text-brand-700 hover:underline">gdpr@zonaro.ro</a>.</p>
              </section>

              {/* 3 */}
              <section id="utilizare">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">3. Cum Folosim Datele</h2>
                <p>Prelucrăm datele dumneavoastră personale exclusiv în următoarele scopuri:</p>
                <ul className="mt-3 space-y-2 list-disc pl-6">
                  <li><strong>Furnizarea serviciilor Platformei:</strong> crearea și administrarea Contului, publicarea Profilului, afișarea rezultatelor de căutare.</li>
                  <li><strong>Procesarea plăților:</strong> gestionarea abonamentelor plătite și emiterea facturilor.</li>
                  <li><strong>Comunicări despre Cont:</strong> confirmarea înregistrării, notificări despre abonament, alerte de securitate.</li>
                  <li><strong>Notificări despre Recenzii:</strong> informarea Firmelor despre Recenzii noi primite.</li>
                  <li><strong>Suport tehnic:</strong> răspunsul la solicitările dumneavoastră de asistență.</li>
                  <li><strong>Îmbunătățirea Platformei:</strong> analiza comportamentului agregat de utilizare pentru optimizarea experienței.</li>
                  <li><strong>Marketing direct:</strong> trimiterea de newslettere sau oferte promoționale <em>exclusiv cu consimțământul explicit</em> al Utilizatorului. Vă puteți dezabona oricând.</li>
                  <li><strong>Prevenirea fraudei și abuzurilor:</strong> detectarea activităților suspecte și protejarea integrității Platformei.</li>
                  <li><strong>Conformitate legală:</strong> respectarea obligațiilor impuse de legislația fiscală, comercială sau de altă natură.</li>
                </ul>
                <p className="mt-4 text-sm text-gray-600 bg-gray-50 rounded-xl p-4 not-prose"><strong>Nu folosim datele dumneavoastră pentru:</strong> luarea de decizii individuale automatizate cu efecte juridice semnificative (profilare automată), vânzarea datelor către terți în scopuri publicitare sau orice alt scop incompatibil cu cele declarate mai sus.</p>
              </section>

              {/* 4 */}
              <section id="impartasire">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">4. Cu Cine Împărtășim Datele</h2>
                <p className="mb-4 font-semibold text-gray-900">🔒 Nu vindem datele dumneavoastră personale nimănui, niciodată.</p>
                <p>Datele dumneavoastră sunt partajate exclusiv cu furnizorii de servicii (procesatori de date) care ne ajută să furnizăm Platforma, în conformitate cu acorduri de prelucrare a datelor (DPA) conforme GDPR:</p>

                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-sm border-collapse border border-gray-200 rounded-xl overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 border-b border-gray-200">Furnizor</th>
                        <th className="text-left p-3 border-b border-gray-200">Țara</th>
                        <th className="text-left p-3 border-b border-gray-200">Rol</th>
                        <th className="text-left p-3 border-b border-gray-200">Date transferate</th>
                        <th className="text-left p-3 border-b border-gray-200">Garanție GDPR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        ['Supabase Inc.', 'SUA (servere UE disponibile)', 'Bază de date, autentificare, stocare fișiere', 'Date cont, date firmă, conținut profil, loguri', 'Clauze Contractuale Standard (SCC)'],
                        ['Stripe Inc.', 'SUA', 'Procesare plăți și abonamente', 'Detalii plată, email, adresă facturare', 'SCC + certificare PCI DSS'],
                        ['Resend Inc.', 'SUA', 'Trimitere emailuri tranzacționale', 'Email destinatar, conținut email', 'Clauze Contractuale Standard (SCC)'],
                        ['Vercel Inc.', 'SUA (CDN global)', 'Hosting și infrastructură cloud', 'Date de trafic, IP-uri (anonimizate)', 'Clauze Contractuale Standard (SCC)'],
                      ].map(([provider, country, role, data, guarantee]) => (
                        <tr key={provider}>
                          <td className="p-3 font-medium">{provider}</td>
                          <td className="p-3">{country}</td>
                          <td className="p-3">{role}</td>
                          <td className="p-3 text-xs">{data}</td>
                          <td className="p-3 text-xs text-green-700">{guarantee}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="mt-4 text-sm">De asemenea, putem divulga date personale atunci când suntem obligați legal (de exemplu, la solicitarea autorităților competente române), sau pentru protejarea drepturilor și siguranței ZonaRo, a Utilizatorilor sau a publicului.</p>
              </section>

              {/* 5 */}
              <section id="transferuri">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">5. Transferuri Internaționale de Date</h2>
                <p>Unii dintre furnizorii noștri de servicii (Supabase, Stripe, Resend, Vercel) sunt localizați în Statele Unite ale Americii, o țară terță care nu beneficiază de o decizie de adecvare din partea Comisiei Europene.</p>
                <p className="mt-3">Pentru a asigura un nivel adecvat de protecție a datelor dumneavoastră în cazul acestor transferuri, ne bazăm pe <strong>Clauzele Contractuale Standard (SCC)</strong> adoptate de Comisia Europeană conform art. 46(2)(c) GDPR. Aceste clauze impun furnizorilor noștri obligații contractuale privind protecția datelor echivalente cu standardele europene.</p>
                <p className="mt-3">Puteți solicita o copie a garanțiilor aplicabile transferurilor internaționale prin email la <a href="mailto:gdpr@zonaro.ro" className="text-brand-700 hover:underline">gdpr@zonaro.ro</a>.</p>
              </section>

              {/* 6 */}
              <section id="retentie">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">6. Cât Timp Păstrăm Datele (Politica de Retenție)</h2>
                <div className="overflow-x-auto mt-4">
                  <table className="w-full text-sm border-collapse border border-gray-200 rounded-xl overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 border-b border-gray-200">Categorie de date</th>
                        <th className="text-left p-3 border-b border-gray-200">Perioadă de retenție</th>
                        <th className="text-left p-3 border-b border-gray-200">Motivul</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {[
                        ['Date cont activ', 'Pe durata existenței Contului', 'Furnizarea serviciilor'],
                        ['Date după ștergerea contului', '30 zile (perioadă de grație), apoi ștergere/anonimizare completă', 'Posibilitate de recuperare accidentală'],
                        ['Date financiare și facturi', '10 ani de la data emiterii', 'Obligație legală — Legea contabilității nr. 82/1991'],
                        ['Loguri tehnice de acces', '90 de zile', 'Securitate și depanare tehnică'],
                        ['Recenzii', 'Pe durata existenței profilului firmei evaluate', 'Interes legitim'],
                        ['Emailuri de marketing', 'Până la retragerea consimțământului', 'Consimțământ'],
                        ['Date cookies analytics', 'Conform duratei specifice fiecărui cookie (max. 13 luni)', 'Consimțământ'],
                        ['Date cookie tehnice', 'Sesiune sau max. 12 luni', 'Necesar tehnic'],
                      ].map(([cat, period, reason]) => (
                        <tr key={cat}>
                          <td className="p-3 font-medium">{cat}</td>
                          <td className="p-3">{period}</td>
                          <td className="p-3 text-xs text-gray-600">{reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              {/* 7 */}
              <section id="drepturi">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">7. Drepturile Tale conform GDPR (Art. 15–22)</h2>
                <p>Conform GDPR, beneficiați de următoarele drepturi în legătură cu datele dumneavoastră personale. Puteți exercita orice drept prin email la <a href="mailto:gdpr@zonaro.ro" className="text-brand-700 hover:underline">gdpr@zonaro.ro</a>. Vom răspunde în termen de <strong>30 de zile calendaristice</strong>.</p>

                <div className="mt-6 space-y-5">
                  {[
                    {
                      art: 'Art. 15',
                      title: 'Dreptul de Acces',
                      desc: 'Aveți dreptul de a obține o confirmare cu privire la faptul că prelucrăm sau nu date personale despre dumneavoastră și, dacă da, de a accesa acele date împreună cu informații despre scopul prelucrării, categoriile de date, destinatarii și perioada de stocare.',
                    },
                    {
                      art: 'Art. 16',
                      title: 'Dreptul la Rectificare',
                      desc: 'Aveți dreptul de a solicita corectarea datelor personale inexacte sau completarea datelor personale incomplete. Puteți actualiza singur majoritatea datelor din panoul de control al Contului.',
                    },
                    {
                      art: 'Art. 17',
                      title: 'Dreptul la Ștergere ("Dreptul de a fi Uitat")',
                      desc: 'Aveți dreptul de a solicita ștergerea datelor dumneavoastră personale atunci când: datele nu mai sunt necesare scopului pentru care au fost colectate; vă retrageți consimțământul (dacă prelucrarea se baza pe acesta); vă opuneți prelucrării și nu există motive legitime prioritare. Excepție: nu putem șterge date pe care avem obligația legală de a le păstra (ex: facturi — 10 ani).',
                    },
                    {
                      art: 'Art. 18',
                      title: 'Dreptul la Restricționarea Prelucrării',
                      desc: 'În anumite circumstanțe (ex: contestați exactitatea datelor, prelucrarea este ilegală dar preferați restricția în loc de ștergere), puteți solicita restricționarea prelucrării datelor dumneavoastră.',
                    },
                    {
                      art: 'Art. 20',
                      title: 'Dreptul la Portabilitatea Datelor',
                      desc: 'Aveți dreptul de a primi datele personale pe care ni le-ați furnizat într-un format structurat, utilizat frecvent și care poate fi citit automat (JSON sau CSV), și de a transmite aceste date altui operator. Solicitați exportul la gdpr@zonaro.ro.',
                    },
                    {
                      art: 'Art. 21',
                      title: 'Dreptul de Opoziție',
                      desc: 'Vă puteți opune prelucrării datelor dumneavoastră atunci când prelucrarea se bazează pe interesul legitim al Operatorului, inclusiv în ceea ce privește marketingul direct. Vă puteți dezabona din emailurile de marketing oricând, folosind linkul de dezabonare din fiecare email.',
                    },
                    {
                      art: 'Art. 22',
                      title: 'Drepturi Legate de Decizii Automate',
                      desc: 'Aveți dreptul de a nu face obiectul unei decizii bazate exclusiv pe prelucrarea automată, inclusiv crearea de profiluri, care produce efecte juridice sau vă afectează semnificativ. ZonaRo nu utilizează sisteme de decizie automată sau profilare cu efecte juridice.',
                    },
                  ].map(({ art, title, desc }) => (
                    <div key={art} className="border border-gray-200 rounded-xl p-5">
                      <div className="flex items-start gap-3">
                        <span className="text-xs font-semibold bg-brand-100 text-brand-800 rounded-full px-2 py-1 flex-shrink-0 mt-0.5">{art}</span>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{title}</h4>
                          <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 mt-6 not-prose">
                  <h4 className="font-semibold text-orange-900 mb-2">Dreptul de a depune plângere la ANSPDCP</h4>
                  <p className="text-sm text-orange-800 leading-relaxed">Dacă considerați că prelucrarea datelor dumneavoastră personale încalcă GDPR, aveți dreptul de a depune o plângere la autoritatea de supraveghere competentă:</p>
                  <div className="mt-3 text-sm text-orange-800 space-y-1">
                    <p><strong>ANSPDCP</strong> — Autoritatea Națională de Supraveghere a Prelucrării Datelor cu Caracter Personal</p>
                    <p>📍 Bd. G-ral. Gheorghe Magheru 28-30, Sector 1, București, 010336</p>
                    <p>📞 +40.318.059.211</p>
                    <p>🌐 <a href="https://www.anspdcp.eu" className="underline" target="_blank" rel="noopener noreferrer">anspdcp.eu</a></p>
                  </div>
                </div>
              </section>

              {/* 8 */}
              <section id="cookies">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">8. Politica privind Cookie-urile</h2>
                <p>Cookie-urile sunt fișiere text de mici dimensiuni stocate pe dispozitivul dumneavoastră atunci când vizitați Platforma. Utilizăm cookie-uri pentru a asigura funcționarea corectă a Platformei și pentru a îmbunătăți experiența de utilizare.</p>

                <h3 className="font-semibold text-gray-900 mt-6 mb-3">8.1. Categorii de Cookie-uri</h3>

                <div className="space-y-4 mt-4">
                  <div className="border border-green-200 bg-green-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold bg-green-600 text-white rounded px-2 py-0.5">Esențiale</span>
                      <span className="text-xs text-green-700">Nu necesită consimțământ</span>
                    </div>
                    <p className="text-sm text-green-900 mb-3">Necesare pentru funcționarea de bază a Platformei. Nu pot fi dezactivate.</p>
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-green-200">
                          <th className="text-left p-2">Nume cookie</th>
                          <th className="text-left p-2">Furnizor</th>
                          <th className="text-left p-2">Scop</th>
                          <th className="text-left p-2">Durată</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-green-100">
                          <td className="p-2 font-mono">sb-access-token</td>
                          <td className="p-2">Supabase / ZonaRo</td>
                          <td className="p-2">Autentificare utilizator</td>
                          <td className="p-2">Sesiune (1 oră)</td>
                        </tr>
                        <tr className="border-b border-green-100">
                          <td className="p-2 font-mono">sb-refresh-token</td>
                          <td className="p-2">Supabase / ZonaRo</td>
                          <td className="p-2">Reîmprospătare sesiune autentificată</td>
                          <td className="p-2">60 zile</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-mono">zonaro-cookie-consent</td>
                          <td className="p-2">ZonaRo</td>
                          <td className="p-2">Stocarea preferințelor cookies</td>
                          <td className="p-2">12 luni</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="border border-blue-200 bg-blue-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold bg-blue-600 text-white rounded px-2 py-0.5">Performanță</span>
                      <span className="text-xs text-blue-700">Necesită consimțământ</span>
                    </div>
                    <p className="text-sm text-blue-900 mb-3">Colectează informații anonime despre cum utilizați Platforma, pentru a ne ajuta să o îmbunătățim.</p>
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-blue-200">
                          <th className="text-left p-2">Nume cookie</th>
                          <th className="text-left p-2">Furnizor</th>
                          <th className="text-left p-2">Scop</th>
                          <th className="text-left p-2">Durată</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 font-mono">_analytics</td>
                          <td className="p-2">ZonaRo (intern)</td>
                          <td className="p-2">Statistici agregate de utilizare (anonim)</td>
                          <td className="p-2">13 luni</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="border border-purple-200 bg-purple-50 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold bg-purple-600 text-white rounded px-2 py-0.5">Funcționale</span>
                      <span className="text-xs text-purple-700">Necesită consimțământ</span>
                    </div>
                    <p className="text-sm text-purple-900 mb-3">Permite Platformei să rețină preferințele dumneavoastră pentru o experiență personalizată.</p>
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-purple-200">
                          <th className="text-left p-2">Nume cookie</th>
                          <th className="text-left p-2">Furnizor</th>
                          <th className="text-left p-2">Scop</th>
                          <th className="text-left p-2">Durată</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="p-2 font-mono">zonaro-ui-prefs</td>
                          <td className="p-2">ZonaRo</td>
                          <td className="p-2">Preferințe interfață (filtru sortare, vizualizare)</td>
                          <td className="p-2">6 luni</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 mt-6 mb-3">8.2. Cum Gestionezi Cookie-urile</h3>
                <ul className="list-disc pl-6 space-y-2 text-sm">
                  <li><strong>Banner de consimțământ:</strong> La prima vizită pe Platformă, vă prezentăm un banner cu opțiunile „Accept toate" și „Personalizează" pentru fiecare categorie.</li>
                  <li><strong>Setările browserului:</strong> Puteți configura browserul să blocheze sau să șteargă cookie-urile. Instrucțiuni pentru <a href="https://support.google.com/chrome/answer/95647" className="text-brand-700 hover:underline" target="_blank" rel="noopener noreferrer">Chrome</a>, <a href="https://support.mozilla.org/kb/enable-and-disable-cookies-website-preferences" className="text-brand-700 hover:underline" target="_blank" rel="noopener noreferrer">Firefox</a>, <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" className="text-brand-700 hover:underline" target="_blank" rel="noopener noreferrer">Safari</a>.</li>
                  <li><strong>Retragerea consimțământului:</strong> Puteți modifica preferințele oricând prin butonul de setări cookies disponibil în footer-ul Platformei.</li>
                </ul>
              </section>

              {/* 9 */}
              <section id="securitate">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">9. Securitatea Datelor</h2>
                <p>Implementăm măsuri tehnice și organizatorice adecvate pentru a proteja datele dumneavoastră personale împotriva accesului neautorizat, modificării, divulgării sau distrugerii:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 not-prose">
                  {[
                    { icon: '🔐', title: 'Criptare TLS/SSL', desc: 'Toate comunicațiile între browser și serverele noastre sunt criptate prin protocolul TLS 1.3.' },
                    { icon: '🗄️', title: 'Criptare date în repaus', desc: 'Datele stocate în baza de date (Supabase) sunt criptate la nivel de stocare.' },
                    { icon: '🛡️', title: 'Row Level Security', desc: 'Baza de date utilizează RLS (Row Level Security) — fiecare utilizator poate accesa exclusiv propriile date.' },
                    { icon: '🔑', title: 'Parole hashed', desc: 'Parolele sunt stocate exclusiv în formă hash bcrypt — nu cunoaștem parola dumneavoastră în clar.' },
                    { icon: '👁️', title: 'Acces limitat', desc: 'Accesul la date personale este restricționat strict la membrii echipei cu nevoie legitimă.' },
                    { icon: '🔍', title: 'Auditare periodică', desc: 'Efectuăm audituri periodice de securitate și revizuiri ale accesului la date.' },
                  ].map(({ icon, title, desc }) => (
                    <div key={title} className="border border-gray-200 rounded-xl p-4">
                      <div className="text-2xl mb-2">{icon}</div>
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{title}</h4>
                      <p className="text-xs text-gray-600">{desc}</p>
                    </div>
                  ))}
                </div>

                <h3 className="font-semibold text-gray-900 mt-6 mb-2">9.1. Procedura în caz de Incident de Securitate (Data Breach)</h3>
                <p>În cazul unui incident de securitate care afectează datele dumneavoastră personale:</p>
                <ol className="list-decimal pl-6 mt-2 space-y-1 text-sm">
                  <li>Vom notifica <strong>ANSPDCP</strong> în termen de <strong>72 de ore</strong> de la constatarea incidentului (art. 33 GDPR).</li>
                  <li>Vom informa <strong>direct persoanele afectate</strong> fără întârziere nejustificată, dacă incidentul este de natură să le creeze riscuri ridicate (art. 34 GDPR).</li>
                  <li>Notificarea va descrie natura incidentului, categoriile și numărul aproximativ de persoane afectate, consecințele probabile și măsurile luate.</li>
                </ol>
              </section>

              {/* 10 */}
              <section id="minori">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">10. Minori</h2>
                <p>Platforma ZonaRo nu se adresează persoanelor cu vârsta sub <strong>18 ani</strong> și nu colectăm intenționat date personale de la minori.</p>
                <p className="mt-3">Dacă descoperim că am colectat involuntar date personale de la un minor, vom lua măsuri imediate pentru a șterge acele date. Dacă sunteți părinte sau tutore legal și credeți că un minor a furnizat date personale pe Platforma noastră, vă rugăm să ne contactați la <a href="mailto:gdpr@zonaro.ro" className="text-brand-700 hover:underline">gdpr@zonaro.ro</a>.</p>
              </section>

              {/* 11 */}
              <section id="modificari">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">11. Modificări ale Politicii de Confidențialitate</h2>
                <p>Putem actualiza periodic această Politică de Confidențialitate pentru a reflecta modificări în practicile noastre de prelucrare a datelor, cerințele legale sau modificările aduse Platformei.</p>
                <p className="mt-3">În cazul modificărilor semnificative (schimbarea scopurilor de prelucrare, adăugarea de noi categorii de date sau destinatari), vă vom notifica prin:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-sm">
                  <li>Email trimis la adresa înregistrată în Cont, cu cel puțin <strong>30 de zile</strong> înainte de intrarea în vigoare;</li>
                  <li>Notificare vizibilă pe Platformă.</li>
                </ul>
                <p className="mt-3">Continuarea utilizării Platformei după data intrării în vigoare a noii Politici constituie acceptarea modificărilor. Dacă nu sunteți de acord cu modificările, puteți solicita ștergerea Contului înainte de intrarea în vigoare.</p>
              </section>

              {/* 12 */}
              <section id="contact">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">12. Contact și Plângeri</h2>
                <p>Pentru orice întrebări, solicitări sau plângeri legate de prelucrarea datelor dumneavoastră personale, ne puteți contacta:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 not-prose">
                  <div className="border border-gray-200 rounded-xl p-5">
                    <h4 className="font-semibold text-gray-900 mb-3">ZonaRo — GDPR</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>📧 <a href="mailto:gdpr@zonaro.ro" className="text-brand-700 hover:underline">gdpr@zonaro.ro</a></p>
                      <p>📧 <a href="mailto:contact@zonaro.ro" className="text-brand-700 hover:underline">contact@zonaro.ro</a></p>
                      <p>📍 [ADRESA COMPLETĂ], România</p>
                      <p className="text-xs text-gray-500 pt-2">Termen de răspuns: 30 de zile calendaristice</p>
                    </div>
                  </div>
                  <div className="border border-orange-200 bg-orange-50 rounded-xl p-5">
                    <h4 className="font-semibold text-orange-900 mb-3">ANSPDCP</h4>
                    <div className="space-y-2 text-sm text-orange-800">
                      <p>📍 Bd. G-ral. Gheorghe Magheru 28-30, Sector 1, București, 010336</p>
                      <p>📞 +40.318.059.211</p>
                      <p>🌐 <a href="https://www.anspdcp.eu" className="underline" target="_blank" rel="noopener noreferrer">anspdcp.eu</a></p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Disclaimer */}
              <div className="mt-12 pt-6 border-t border-gray-200 bg-gray-50 rounded-xl p-5 not-prose">
                <p className="text-xs text-gray-500 italic leading-relaxed">
                  Document generat pentru zonaro.ro — Versiunea 1.0, 04 Iunie 2026. Conform GDPR (Regulamentul UE 2016/679) și Legii nr. 190/2018.
                  Se recomandă verificarea de către un avocat specializat în drept digital și protecția datelor înainte de publicare.
                  ZonaRo nu oferă consultanță juridică prin intermediul acestui document.
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/termeni"
                className="flex-1 bg-brand-700 text-white text-center py-3 px-6 rounded-xl font-medium hover:bg-brand-800 transition-colors"
              >
                Citește Termenii și Condițiile →
              </Link>
              <Link
                href="/"
                className="flex-1 bg-white border border-gray-200 text-gray-700 text-center py-3 px-6 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                ← Înapoi la ZonaRo
              </Link>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
