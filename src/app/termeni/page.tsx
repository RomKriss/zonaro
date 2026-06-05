import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Termeni și Condiții',
  description: 'Termenii și Condițiile de utilizare ale platformei ZonaRo — directorul firmelor și meșterilor din România.',
  robots: { index: true, follow: true },
};

const TOC = [
  { id: 'definitii', label: '1. Definiții' },
  { id: 'acceptare', label: '2. Acceptarea Termenilor' },
  { id: 'servicii', label: '3. Descrierea Serviciilor' },
  { id: 'cont', label: '4. Înregistrarea și Contul' },
  { id: 'profiluri', label: '5. Profilurile de Firme' },
  { id: 'abonamente', label: '6. Planuri de Abonament și Plăți' },
  { id: 'recenzii', label: '7. Sistemul de Recenzii' },
  { id: 'continut-interzis', label: '8. Conținut Interzis' },
  { id: 'proprietate', label: '9. Proprietate Intelectuală' },
  { id: 'raspundere', label: '10. Răspundere și Limitări' },
  { id: 'suspendare', label: '11. Suspendare și Încetare' },
  { id: 'dispute', label: '12. Soluționarea Disputelor' },
  { id: 'finale', label: '13. Dispoziții Finale' },
];

export default function TermeniPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-brand-700 mb-2 uppercase tracking-wider">Document Legal</p>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Termeni și Condiții</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span>Versiunea: <strong className="text-gray-700">1.0</strong></span>
              <span>Data: <strong className="text-gray-700">04 Iunie 2026</strong></span>
              <span>Aplicabil: <strong className="text-gray-700">zonaro.ro</strong></span>
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
                  href="/confidentialitate"
                  className="block text-sm text-brand-700 hover:underline font-medium"
                >
                  → Politica de Confidențialitate
                </Link>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 lg:p-12 prose prose-gray max-w-none text-base leading-relaxed">

              {/* Intro */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 not-prose">
                <p className="text-sm text-amber-800 leading-relaxed">
                  <strong>Vă rugăm să citiți cu atenție</strong> acești Termeni și Condiții înainte de a utiliza platforma ZonaRo.
                  Prin accesarea sau utilizarea serviciilor noastre, confirmați că ați citit, înțeles și acceptat în totalitate
                  termenii de mai jos.
                </p>
              </div>

              {/* 1 */}
              <section id="definitii">
                <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-100">1. Definiții</h2>
                <p>În cuprinsul acestor Termeni și Condiții, termenii de mai jos au următoarele înțelesuri:</p>
                <dl className="space-y-3 mt-4">
                  {[
                    ['Platforma / ZonaRo', 'Website-ul zonaro.ro, aplicațiile asociate, API-urile și toate serviciile oferite de operatorul platformei.'],
                    ['Operatorul', '[NUMELE SRL-ULUI], societate comercială înregistrată în România, CUI: [CUI], cu sediul social la [ADRESA], denumit în continuare „noi", „nouă" sau „ZonaRo".'],
                    ['Utilizator', 'Orice persoană fizică sau juridică care accesează Platforma, indiferent dacă are sau nu un Cont înregistrat.'],
                    ['Firmă / Meșter', 'Persoana juridică sau persoana fizică autorizată care și-a creat un Profil pe Platformă pentru a-și promova serviciile.'],
                    ['Vizitator', 'Utilizatorul care navighează pe Platformă fără a fi autentificat.'],
                    ['Cont', 'Ansamblul de date și setări asociate unui Utilizator înregistrat, accesibil printr-o adresă de email și o parolă.'],
                    ['Profil', 'Pagina publică a unei Firme sau Meșter pe Platformă, conținând informații despre activitate, servicii și recenzii.'],
                    ['Conținut', 'Orice text, imagine, video, date sau alte materiale publicate pe Platformă de către Utilizatori, Firme sau de Operator.'],
                    ['Plan de Abonament', 'Pachetul de servicii premium plătite, disponibil în variantele Start (gratuit), Plus, Pro și Elite, cu funcționalități diferite.'],
                    ['Recenzie', 'Evaluarea și comentariul lăsat de un Utilizator cu privire la serviciile unei Firme înregistrate pe Platformă.'],
                    ['Servicii', 'Totalitatea funcționalităților oferite de ZonaRo, incluzând listarea Profilurilor, sistemul de recenzii, funcțiile de căutare și dashboard-ul Firmei.'],
                    ['Claim / Revendicare', 'Procesul prin care reprezentantul legal al unei Firme preia controlul unui Profil creat automat din date publice.'],
                  ].map(([term, def]) => (
                    <div key={term} className="flex gap-3">
                      <dt className="font-semibold text-gray-900 min-w-[180px] flex-shrink-0">{term}:</dt>
                      <dd className="text-gray-600">{def}</dd>
                    </div>
                  ))}
                </dl>
              </section>

              {/* 2 */}
              <section id="acceptare">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">2. Acceptarea Termenilor</h2>
                <p><strong>2.1.</strong> Accesarea sau utilizarea oricărei funcționalități a Platformei ZonaRo constituie acceptarea integrală și necondiționată a prezentilor Termeni și Condiții, a Politicii de Confidențialitate și a oricăror altor politici publicate pe Platformă.</p>
                <p className="mt-3"><strong>2.2.</strong> Utilizarea Platformei este permisă exclusiv persoanelor care au împlinit vârsta de <strong>18 ani</strong> și care au capacitate juridică deplină de a încheia acte juridice în conformitate cu legislația română. Prin utilizarea Platformei, confirmați că îndepliniți aceste condiții.</p>
                <p className="mt-3"><strong>2.3.</strong> Dacă utilizați Platforma în numele unei persoane juridice (companii, asociații etc.), confirmați că aveți autoritatea necesară de a angaja acea entitate juridică în respectarea acestor Termeni.</p>
                <p className="mt-3"><strong>2.4.</strong> ZonaRo își rezervă dreptul de a modifica în orice moment acești Termeni și Condiții. Modificările semnificative vor fi comunicate Utilizatorilor înregistrați prin email cu cel puțin <strong>30 de zile</strong> înainte de intrarea în vigoare. Continuarea utilizării Platformei după data comunicată constituie acceptarea noilor termeni.</p>
                <p className="mt-3"><strong>2.5.</strong> Versiunile anterioare ale Termenilor și Condițiilor sunt arhivate și pot fi solicitate prin email la <a href="mailto:contact@zonaro.ro" className="text-brand-700 hover:underline">contact@zonaro.ro</a>.</p>
              </section>

              {/* 3 */}
              <section id="servicii">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">3. Descrierea Serviciilor</h2>
                <p><strong>3.1. Servicii gratuite.</strong> Platforma ZonaRo oferă gratuit: căutarea și vizualizarea Profilurilor de Firme, accesul la informații publice despre firme și meșteri, posibilitatea de a lăsa Recenzii și crearea unui Profil de bază (planul Start).</p>
                <p className="mt-3"><strong>3.2. Servicii prin abonament plătit.</strong> Firmele pot accesa funcționalități avansate prin abonamentele Plus, Pro și Elite, care includ: vizibilitate sporită în rezultatele de căutare, posibilitatea de a adăuga mai multe fotografii și servicii detaliate, statistici avansate, insigna de verificare, priority support și alte beneficii descrise în secțiunea 6.</p>
                <p className="mt-3"><strong>3.3. Limitele serviciului.</strong> ZonaRo este o platformă de listare și prezentare a firmelor. <strong>Nu intermediem tranzacții comerciale</strong> între Firme și clienții acestora, nu percepem comisioane pe vânzări, nu garantăm calitatea serviciilor prestate de Firme și nu suntem parte în contractele încheiate între Firme și clienții lor.</p>
                <p className="mt-3"><strong>3.4. Disponibilitate.</strong> Ne străduim să menținem Platforma disponibilă 24/7, însă nu putem garanta funcționarea neîntreruptă. Ne rezervăm dreptul de a efectua operații de mentenanță planificată, pe care le vom comunica în avans atunci când este posibil, și de a suspenda temporar accesul pentru remedieri tehnice urgente.</p>
                <p className="mt-3"><strong>3.5. Modificarea serviciilor.</strong> ZonaRo poate modifica, adăuga sau elimina funcționalități ale Platformei în orice moment, cu sau fără notificare prealabilă, cu excepția cazului în care modificările afectează semnificativ serviciile incluse în abonamentele plătite active.</p>
              </section>

              {/* 4 */}
              <section id="cont">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">4. Înregistrarea și Contul</h2>
                <p><strong>4.1.</strong> Pentru a crea un Cont pe ZonaRo, este necesar să furnizați informații corecte, complete și actualizate, incluzând o adresă de email validă și, pentru Firme, datele de identificare ale societății (denumire, CUI, adresă, număr de telefon).</p>
                <p className="mt-3"><strong>4.2. Obligația de acuratețe.</strong> Vă obligați să mențineți informațiile din Cont actualizate. Furnizarea de date false, incomplete sau înșelătoare constituie o încălcare a acestor Termeni și poate conduce la suspendarea sau ștergerea Contului.</p>
                <p className="mt-3"><strong>4.3. Securitatea contului.</strong> Sunteți exclusiv responsabil pentru confidențialitatea credențialelor de autentificare (email și parolă). ZonaRo nu va fi răspunzătoare pentru nicio pierdere sau daună rezultată din accesul neautorizat la Contul dumneavoastră ca urmare a nerespectării acestei obligații. Vă rugăm să ne informați imediat la <a href="mailto:contact@zonaro.ro" className="text-brand-700 hover:underline">contact@zonaro.ro</a> dacă suspectați un acces neautorizat.</p>
                <p className="mt-3"><strong>4.4. Un cont per firmă.</strong> Fiecare persoană juridică poate deține un singur Cont activ pe Platformă. Crearea de conturi multiple pentru aceeași firmă cu scopul de a eluda limitele planurilor sau de a manipula sistemul de recenzii este strict interzisă.</p>
                <p className="mt-3"><strong>4.5. Drepturi ale Platformei.</strong> ZonaRo își rezervă dreptul de a suspenda sau șterge orice Cont care: (a) furnizează informații false; (b) încalcă acești Termeni; (c) este implicat în activități frauduloase; (d) rămâne inactiv pentru o perioadă de peste 24 de luni, cu notificare prealabilă de 30 de zile.</p>
              </section>

              {/* 5 */}
              <section id="profiluri">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">5. Profilurile de Firme</h2>
                <p><strong>5.1. Crearea Profilului.</strong> Firmele și meșterii pot crea un Profil public pe ZonaRo după înregistrarea unui Cont. Profilul include informații de prezentare, date de contact, categorii de servicii, fotografii și recenziile primite.</p>
                <p className="mt-3"><strong>5.2. Responsabilitatea pentru conținut.</strong> Firma este exclusiv responsabilă pentru acuratețea, legalitatea și completitudinea conținutului publicat în Profilul său. Prin publicarea unui conținut, Firma garantează că deține toate drepturile necesare pentru a-l utiliza și că acesta nu încalcă drepturile terților.</p>
                <p className="mt-3"><strong>5.3. Conținut interzis în Profil.</strong> Este strict interzisă publicarea în Profil a: (a) informațiilor false sau înșelătoare despre servicii, prețuri sau calificări; (b) conținutului care încalcă drepturi de proprietate intelectuală ale terților; (c) fotografiilor sau materialelor obscene, ofensatoare sau discriminatorii; (d) informațiilor de contact ale terților fără consimțământul acestora.</p>
                <p className="mt-3"><strong>5.4. Revendicarea Profilului (Claim).</strong> ZonaRo poate crea Profiluri pe baza datelor publice disponibile în registrele oficiale (ONRC, ANAF). Reprezentanții legali ai firmelor respective pot revendica aceste Profiluri prin procesul de Claim, care implică verificarea identității și a calității de reprezentant autorizat. Odată revendicat, Profilul devine proprietatea juridică a Firmei respective.</p>
                <p className="mt-3"><strong>5.5. Moderarea conținutului.</strong> ZonaRo are dreptul, dar nu și obligația, de a modera conținutul Profilurilor. Ne rezervăm dreptul de a elimina sau modifica orice conținut care încalcă acești Termeni, legislația aplicabilă sau standardele noastre editoriale, fără obligația de a notifica în prealabil Firma în cauză în cazuri urgente.</p>
                <p className="mt-3"><strong>5.6. Date publice ONRC.</strong> Datele importate din registrele publice (ONRC/ANAF) sunt prelucrate în baza interesului legitim al Platformei de a oferi un director complet al firmelor din România. Firmele pot solicita oricând corectarea sau ștergerea acestor date prin email la <a href="mailto:contact@zonaro.ro" className="text-brand-700 hover:underline">contact@zonaro.ro</a>.</p>
              </section>

              {/* 6 */}
              <section id="abonamente">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">6. Planuri de Abonament și Plăți</h2>
                <p><strong>6.1. Planuri disponibile.</strong> ZonaRo oferă următoarele planuri de abonament:</p>
                <div className="overflow-x-auto mt-4 mb-4">
                  <table className="w-full text-sm border-collapse border border-gray-200 rounded-xl overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-3 border-b border-gray-200 font-semibold">Plan</th>
                        <th className="text-left p-3 border-b border-gray-200 font-semibold">Preț/lună (cu TVA)</th>
                        <th className="text-left p-3 border-b border-gray-200 font-semibold">Preț anual (cu TVA)</th>
                        <th className="text-left p-3 border-b border-gray-200 font-semibold">Economie</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['Start (Gratuit)', '0 RON', '—', '—'],
                        ['Plus', '49 RON', '470 RON', '~20%'],
                        ['Pro ⭐', '99 RON', '950 RON', '~20%'],
                        ['Elite', '199 RON', '1.910 RON', '~20%'],
                      ].map(([plan, monthly, yearly, save]) => (
                        <tr key={plan} className="border-b border-gray-100 last:border-0">
                          <td className="p-3 font-medium">{plan}</td>
                          <td className="p-3">{monthly}</td>
                          <td className="p-3">{yearly}</td>
                          <td className="p-3 text-green-600">{save}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-3"><strong>6.2. Modalitate de plată.</strong> Plățile se efectuează exclusiv prin card bancar (Visa, Mastercard), procesate de Stripe Inc., un procesator de plăți autorizat. Nu stocăm datele cardului dumneavoastră pe serverele noastre.</p>
                <p className="mt-3"><strong>6.3. Facturare și reînnoire automată.</strong> Abonamentele se reînnoiesc automat la finalul perioadei plătite (lunar sau anual), la prețul aplicabil la momentul reînnoirii. Veți primi o notificare prin email cu cel puțin <strong>7 zile</strong> înainte de reînnoire.</p>
                <p className="mt-3"><strong>6.4. Anularea abonamentului.</strong> Puteți anula oricând reînnoirea automată din panoul de control al Contului (secțiunea „Abonament"). Anularea nu produce efect imediat — accesul la funcționalitățile premium rămâne activ până la expirarea perioadei deja plătite.</p>
                <p className="mt-3"><strong>6.5. Dreptul de retragere (OUG nr. 34/2014).</strong> Beneficiați de un drept de retragere de <strong>14 zile calendaristice</strong> de la data achiziției abonamentului, fără a fi necesară invocarea unui motiv. Pentru a vă exercita acest drept, trimiteți un email la <a href="mailto:contact@zonaro.ro" className="text-brand-700 hover:underline">contact@zonaro.ro</a>. Rambursarea se va efectua în termen de 14 zile de la primirea solicitării, prin același mijloc de plată utilizat. Dreptul de retragere nu se aplică dacă ați utilizat activ funcționalitățile premium în perioada de 14 zile.</p>
                <p className="mt-3"><strong>6.6. Politica de rambursare.</strong> Cu excepția dreptului de retragere menționat la art. 6.5, plățile efectuate nu sunt rambursabile. În caz de erori de facturare sau probleme tehnice din vina ZonaRo, vom analiza solicitările de rambursare de la caz la caz.</p>
                <p className="mt-3"><strong>6.7. Expirarea abonamentului.</strong> La expirarea unui abonament plătit fără reînnoire, Contul revine automat la planul Start (gratuit), iar funcționalitățile premium devin inaccesibile. Conținutul Profilului (texte, fotografii) este păstrat.</p>
                <p className="mt-3"><strong>6.8. Modificarea prețurilor.</strong> ZonaRo poate modifica prețurile abonamentelor cu notificare prealabilă de minimum <strong>30 de zile</strong>. Modificarea nu afectează abonamentele active până la expirarea perioadei plătite.</p>
              </section>

              {/* 7 */}
              <section id="recenzii">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">7. Sistemul de Recenzii</h2>
                <p><strong>7.1.</strong> Orice Utilizator înregistrat care a beneficiat de serviciile unei Firme înregistrate pe ZonaRo poate lăsa o Recenzie pentru acea Firmă.</p>
                <p className="mt-3"><strong>7.2. Recenzii independente.</strong> ZonaRo utilizează un sistem de verificare a autenticității recenziilor. Utilizatorii pot fi solicitați să furnizeze un număr de factură sau alt document care atestă relația comercială cu Firma evaluată. Recenziile verificate sunt marcate corespunzător.</p>
                <p className="mt-3"><strong>7.3. Interdicții.</strong> Este strict interzis: (a) publicarea de Recenzii false, fabricate sau plătite; (b) lăsarea de Recenzii pentru propria Firmă sau pentru firme ale rudelor sau asociaților; (c) manipularea sistemului de evaluare prin orice mijloace; (d) publicarea de Recenzii defăimătoare, calomnioase sau care conțin informații false.</p>
                <p className="mt-3"><strong>7.4. Moderare.</strong> ZonaRo poate modera sau elimina Recenzii care: (a) încalcă acești Termeni; (b) conțin limbaj ofensator sau discriminatoriu; (c) sunt evident false sau manipulative; (d) fac obiectul unei contestații întemeiate din partea Firmei. Decizia de eliminare aparține exclusiv echipei ZonaRo.</p>
                <p className="mt-3"><strong>7.5. Dreptul de răspuns.</strong> Firmele au dreptul de a răspunde public Recenziilor primite, o singură dată per Recenzie. Răspunsurile trebuie să respecte standardele de conduită ale Platformei.</p>
                <p className="mt-3"><strong>7.6. Răspundere.</strong> ZonaRo nu este responsabilă pentru conținutul Recenziilor publicate de Utilizatori. Autorii Recenziilor sunt exclusiv responsabili pentru exactitatea și legalitatea conținutului publicat.</p>
              </section>

              {/* 8 */}
              <section id="continut-interzis">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">8. Conținut Interzis</h2>
                <p>Este strict interzisă publicarea sau transmiterea prin intermediul Platformei a oricărui conținut care:</p>
                <ul className="list-disc pl-6 mt-3 space-y-2">
                  <li>conține informații false, înșelătoare sau frauduloase despre o firmă, servicii, prețuri sau calificări;</li>
                  <li>este defăimător, calumnios, ofensator, amenințător, hărțuitor sau discriminatoriu pe baza rasei, etniei, religiei, sexului, vârstei, orientării sexuale sau dizabilității;</li>
                  <li>promovează sau instigă la activități ilegale;</li>
                  <li>încalcă drepturile de proprietate intelectuală (copyright, mărci înregistrate, brevete, secrete comerciale) ale terților;</li>
                  <li>constituie spam, mesaje nesolicitate sau comunicări comerciale neautorizate;</li>
                  <li>conține malware, viruși sau orice cod menit să dăuneze sistemelor informatice;</li>
                  <li>implică colectarea sau prelucrarea neautorizată a datelor personale ale terților;</li>
                  <li>constituie tentativă de fraudă, phishing, înșelăciune sau furt de identitate;</li>
                  <li>prezintă conținut pornografic, violent sau inadecvat pentru minori;</li>
                  <li>este publicat de minori sub 18 ani;</li>
                  <li>interferează cu funcționarea normală a Platformei.</li>
                </ul>
                <p className="mt-3">Încălcarea acestor prevederi poate conduce la eliminarea conținutului, suspendarea sau ștergerea Contului și, în cazuri grave, la sesizarea autorităților competente.</p>
              </section>

              {/* 9 */}
              <section id="proprietate">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">9. Proprietate Intelectuală</h2>
                <p><strong>9.1.</strong> Platforma ZonaRo, inclusiv designul, codul sursă, logo-ul, marca comercială, bazele de date, selecția și aranjarea conținutului, reprezintă proprietatea intelectuală exclusivă a Operatorului și este protejată de legislația română și internațională privind drepturile de autor și proprietatea intelectuală.</p>
                <p className="mt-3"><strong>9.2. Licență limitată.</strong> ZonaRo vă acordă o licență limitată, neexclusivă, netransferabilă și revocabilă de a accesa și utiliza Platforma exclusiv în scopuri personale sau comerciale legitime, în conformitate cu acești Termeni. Această licență nu include dreptul de a reproduce, distribui, modifica, crea lucrări derivate sau de a exploata comercial orice parte a Platformei fără consimțământul scris prealabil al ZonaRo.</p>
                <p className="mt-3"><strong>9.3. Conținut publicat de Firme.</strong> Prin publicarea de conținut pe Platformă (texte, fotografii, logo-uri etc.), Firma acordă ZonaRo o licență neexclusivă, mondială, gratuită, de a utiliza, reproduce și afișa acel conținut exclusiv în scopul furnizării serviciilor Platformei. Firma garantează că deține drepturile necesare pentru a acorda această licență.</p>
                <p className="mt-3"><strong>9.4. Interdicții.</strong> Este interzisă: reproducerea sau copierea parțială sau integrală a Platformei; utilizarea de tehnologii de web scraping sau extragere automatizată a datelor fără acordul scris al ZonaRo; utilizarea brandului ZonaRo sau a elementelor de identitate vizuală fără autorizare.</p>
              </section>

              {/* 10 */}
              <section id="raspundere">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">10. Răspundere și Limitări</h2>
                <p><strong>10.1. Platformă intermediară.</strong> ZonaRo acționează exclusiv ca o platformă de listare și prezentare a Firmelor. Nu suntem parte în niciun contract, tranzacție sau relație comercială dintre Firme și clienții acestora.</p>
                <p className="mt-3"><strong>10.2. Fără garanții privind Firmele.</strong> ZonaRo nu verifică, nu certifică și nu garantează calitatea, legalitatea, profesionalismul sau bonitatea niciunei Firme sau Meșter listat pe Platformă. Utilizatorii sunt responsabili pentru propriile decizii comerciale.</p>
                <p className="mt-3"><strong>10.3. Limitarea răspunderii.</strong> În măsura maximă permisă de legea aplicabilă, răspunderea totală a ZonaRo față de orice Utilizator, în legătură cu utilizarea Platformei, nu va depăși valoarea totală a abonamentului plătit de acel Utilizator în ultimele 12 luni. ZonaRo nu răspunde pentru: daune indirecte, incidentale, speciale sau punitive; pierderi de profit, date sau oportunități de afaceri; daune rezultate din utilizarea neautorizată a Contului dumneavoastră de către terți.</p>
                <p className="mt-3"><strong>10.4. Forța majoră.</strong> ZonaRo nu răspunde pentru neexecutarea sau executarea necorespunzătoare a obligațiilor cauzate de evenimente de forță majoră (cutremure, inundații, pandemii, atacuri cibernetice de mare anvergură, decizii ale autorităților publice etc.).</p>
                <p className="mt-3"><strong>10.5. Linkuri externe.</strong> Platforma poate conține linkuri spre website-uri terțe. ZonaRo nu controlează și nu răspunde pentru conținutul, politicile de confidențialitate sau practicile acestor website-uri. Accesarea lor se face pe propriul risc al Utilizatorului.</p>
              </section>

              {/* 11 */}
              <section id="suspendare">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">11. Suspendare și Încetare</h2>
                <p><strong>11.1. Motive de suspendare.</strong> ZonaRo poate suspenda sau restricționa accesul la un Cont în cazul în care există motive întemeiate să creadă că Utilizatorul: a încălcat acești Termeni; a furnizat informații false; a participat la activități frauduloase; sau a acționat în detrimentul Platformei sau al altor Utilizatori.</p>
                <p className="mt-3"><strong>11.2. Procedura.</strong> Dacă situația o permite, vom notifica Utilizatorul înainte de suspendare și îi vom oferi posibilitatea de a corecta situația. În cazuri grave (fraudă, activitate ilegală), suspendarea poate fi imediată fără notificare prealabilă.</p>
                <p className="mt-3"><strong>11.3. Contestație.</strong> Utilizatorul are dreptul de a contesta decizia de suspendare prin email la <a href="mailto:contact@zonaro.ro" className="text-brand-700 hover:underline">contact@zonaro.ro</a>, în termen de 30 de zile de la comunicarea deciziei. ZonaRo va analiza contestația și va comunica decizia finală în termen de 15 zile lucrătoare.</p>
                <p className="mt-3"><strong>11.4. Ștergerea contului.</strong> Puteți solicita ștergerea Contului dumneavoastră oricând, prin email la <a href="mailto:contact@zonaro.ro" className="text-brand-700 hover:underline">contact@zonaro.ro</a> sau din setările Contului. Ștergerea este definitivă și nu poate fi anulată.</p>
                <p className="mt-3"><strong>11.5. Efectele ștergerii.</strong> La ștergerea Contului: (a) accesul la Platformă încetează imediat; (b) abonamentele active nu sunt rambursate; (c) datele personale vor fi tratate conform Politicii de Confidențialitate; (d) Recenziile lăsate de Utilizator pot fi păstrate în formă anonimizată; (e) Profilul Firmei poate fi convertit în profil nerevendicat.</p>
              </section>

              {/* 12 */}
              <section id="dispute">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">12. Soluționarea Disputelor</h2>
                <p><strong>12.1. Jurisdicție și legea aplicabilă.</strong> Prezentii Termeni și Condiții sunt guvernați de legea română. Orice litigiu decurgând din sau în legătură cu utilizarea Platformei va fi supus jurisdicției exclusive a instanțelor judecătorești competente din România.</p>
                <p className="mt-3"><strong>12.2. Rezolvare amiabilă.</strong> Înainte de a iniția orice procedură judiciară sau arbitrală, părțile se obligă să depună eforturi rezonabile pentru a soluționa disputa pe cale amiabilă, în termen de maximum 30 de zile de la notificarea scrisă a reclamației.</p>
                <p className="mt-3"><strong>12.3. ANPC.</strong> Consumatorii (persoane fizice) au dreptul de a adresa reclamații la Autoritatea Națională pentru Protecția Consumatorilor (ANPC): <a href="https://www.anpc.ro" className="text-brand-700 hover:underline" target="_blank" rel="noopener noreferrer">www.anpc.ro</a>.</p>
                <p className="mt-3"><strong>12.4. SOL — Soluționarea Online a Litigiilor.</strong> Conform Regulamentului UE nr. 524/2013, consumatorii din UE pot accesa platforma europeană de soluționare online a litigiilor la adresa: <a href="https://ec.europa.eu/consumers/odr" className="text-brand-700 hover:underline" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>. Adresa noastră de email pentru SOL: <a href="mailto:contact@zonaro.ro" className="text-brand-700 hover:underline">contact@zonaro.ro</a>.</p>
              </section>

              {/* 13 */}
              <section id="finale">
                <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b border-gray-100">13. Dispoziții Finale</h2>
                <p><strong>13.1. Integralitatea acordului.</strong> Prezentii Termeni și Condiții, împreună cu Politica de Confidențialitate și orice alte politici publicate pe Platformă, constituie întregul acord dintre Utilizator și ZonaRo cu privire la utilizarea Platformei.</p>
                <p className="mt-3"><strong>13.2. Nulitatea parțială.</strong> Dacă orice prevedere a acestor Termeni este declarată nulă sau inaplicabilă de o instanță competentă, celelalte prevederi rămân în vigoare și produc efecte depline.</p>
                <p className="mt-3"><strong>13.3. Cesiunea drepturilor.</strong> ZonaRo poate cesiona drepturile și obligațiile sale decurgând din acești Termeni oricărui succesor sau dobânditor al afacerii, fără consimțământul prealabil al Utilizatorilor. Utilizatorii nu pot ceda drepturile lor fără acordul scris prealabil al ZonaRo.</p>
                <p className="mt-3"><strong>13.4. Contact.</strong> Pentru orice întrebări juridice sau legate de acești Termeni, ne puteți contacta la:</p>
                <div className="bg-gray-50 rounded-xl p-4 mt-3 text-sm not-prose">
                  <p><strong>ZonaRo — [NUMELE SRL]</strong></p>
                  <p>Sediu: [ADRESA COMPLETĂ]</p>
                  <p>CUI: [CUI]</p>
                  <p>Email: <a href="mailto:contact@zonaro.ro" className="text-brand-700 hover:underline">contact@zonaro.ro</a></p>
                </div>
                <p className="mt-4"><strong>13.5. Data intrării în vigoare:</strong> 04 Iunie 2026</p>
                <p className="mt-2"><strong>13.6. Versiunea:</strong> 1.0</p>
              </section>

              {/* Disclaimer */}
              <div className="mt-12 pt-6 border-t border-gray-200 bg-gray-50 rounded-xl p-5 not-prose">
                <p className="text-xs text-gray-500 italic leading-relaxed">
                  Document generat pentru zonaro.ro — Versiunea 1.0, 04 Iunie 2026.
                  Se recomandă verificarea de către un avocat specializat în drept digital și comercial înainte de publicare.
                  ZonaRo nu oferă consultanță juridică prin intermediul acestui document.
                </p>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <Link
                href="/confidentialitate"
                className="flex-1 bg-brand-700 text-white text-center py-3 px-6 rounded-xl font-medium hover:bg-brand-800 transition-colors"
              >
                Citește Politica de Confidențialitate →
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
