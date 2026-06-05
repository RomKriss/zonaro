# ZonaRo — Directorul Firmelor și Meșterilor din România

Platformă web completă pentru găsirea și listarea firmelor și meșterilor din România, similară cu Yell.com, construită cu Next.js 14 + Supabase + Stripe.

---

## Stack Tehnologic

| Tehnologie | Utilizare |
|---|---|
| **Next.js 14** (App Router) | Framework principal |
| **Supabase** (PostgreSQL) | Bază de date + Auth + Storage |
| **Stripe** | Abonamente și plăți |
| **Resend** | Email-uri tranzacționale |
| **Tailwind CSS** | Stilizare |
| **Vercel** | Deployment |

---

## Cerințe

- Node.js 18+
- Cont Supabase (gratuit)
- Cont Stripe (test mode pentru development)
- Cont Resend (gratuit pentru development)

---

## Setup Local

### 1. Clonează și instalează dependențe

```bash
git clone https://github.com/your-username/zonaro.git
cd zonaro
npm install
```

### 2. Configurează variabilele de mediu

```bash
cp .env.local.example .env.local
```

Editează `.env.local` cu datele tale:

```env
# Supabase — din dashboard.supabase.com → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Stripe — din dashboard.stripe.com → Developers → API keys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Price IDs Stripe (creează-le în dashboard → Products)
STRIPE_PRICE_PLUS_MONTHLY=price_...
STRIPE_PRICE_PLUS_YEARLY=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_YEARLY=price_...
STRIPE_PRICE_ELITE_MONTHLY=price_...
STRIPE_PRICE_ELITE_YEARLY=price_...

# Resend — din resend.com → API Keys
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@zonaro.ro

# URL site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Configurează Supabase

1. Creează un proiect nou pe [supabase.com](https://supabase.com)
2. Mergi la **SQL Editor** și rulează conținutul din `supabase/schema.sql`
3. Activează **Email Auth** în Authentication → Providers
4. Configurează URL-ul de redirect în Authentication → URL Configuration:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/api/auth/callback`

### 4. Configurează Stripe

1. Creează 6 produse în [dashboard.stripe.com](https://dashboard.stripe.com):
   - **Plus Monthly**: 49 RON/lună
   - **Plus Yearly**: 470 RON/an
   - **Pro Monthly**: 99 RON/lună
   - **Pro Yearly**: 950 RON/an
   - **Elite Monthly**: 199 RON/lună
   - **Elite Yearly**: 1910 RON/an
2. Copiază Price ID-urile în `.env.local`
3. Pentru webhook-ul local, instalează Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

### 5. Rulează local

```bash
npm run dev
```

Aplicația pornește la [http://localhost:3000](http://localhost:3000)

---

## Crearea primului cont Admin

1. Înregistrează-te normal pe `/inregistrare`
2. În Supabase → Table Editor → users → editează rândul tău și schimbă `role` la `admin`
3. Accesează `/admin`

---

## Importul firmelor din ONRC

Fișierul `supabase/schema.sql` conține structura tabelelor. Pentru importul datelor ONRC:

1. Descarcă datele publice de pe [data.gov.ro](https://data.gov.ro) (lista firme)
2. Creează un script de import care:
   - Generează slug-uri unice din `judet/categorie/nume-firma`
   - Setează `status = 'unclaimed'` pentru toate
   - Setează `plan = 'free'` implicit

---

## Deployment pe Vercel

```bash
# Instalează Vercel CLI
npm i -g vercel

# Deploy
vercel

# Adaugă variabilele de mediu în dashboard Vercel
# sau importă din .env.local:
vercel env pull
```

**Webhook Stripe pentru producție:**
1. Mergi la Stripe Dashboard → Webhooks → Add endpoint
2. URL: `https://zonaro.ro/api/stripe/webhook`
3. Evenimente: `checkout.session.completed`, `customer.subscription.deleted`, `invoice.payment_failed`
4. Copiază `Signing secret` în `STRIPE_WEBHOOK_SECRET`

---

## Structura Proiectului

```
zonaro/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [judet]/[cat]/[slug] # Profil firmă public
│   │   ├── cauta/              # Pagina de căutare
│   │   ├── cont/               # Dashboard firmă
│   │   ├── admin/              # Panel admin
│   │   ├── autentificare/      # Login
│   │   ├── inregistrare/       # Signup
│   │   ├── revendica/[id]/     # Claim profile
│   │   ├── recenzie/[token]/   # Recenzie invitată
│   │   └── api/                # API Routes
│   ├── components/
│   │   ├── layout/             # Header, Footer, Sidebar
│   │   ├── home/               # Componente pagina principală
│   │   ├── business/           # Profil, Card, Recenzii, Contact
│   │   └── ui/                 # Badge, Button, Input, etc.
│   ├── lib/
│   │   ├── supabase/           # Client + Server
│   │   ├── emails/             # Template-uri email
│   │   ├── stripe.ts
│   │   ├── resend.ts
│   │   └── utils.ts
│   ├── types/index.ts          # Tipuri TypeScript
│   └── middleware.ts           # Auth middleware
├── supabase/schema.sql         # Schema completă DB
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
└── vercel.json
```

---

## Planuri de Abonament

| Plan | Preț/lună | Anual |
|------|-----------|-------|
| Start (Free) | 0 RON | — |
| Plus | 49 RON | 470 RON |
| Pro ⭐ | 99 RON | 950 RON |
| Elite | 199 RON | 1.910 RON |

---

## Securitate

- **RLS activat** pe toate tabelele Supabase
- Nicio firmă nu poate edita datele altei firme
- Admin-ul are acces complet
- Toate formulare au validare client-side (Zod) și server-side
- Headers de securitate configurate în `next.config.js`
- Webhook Stripe verificat cu semnătură

---

## Licență

Copyright © 2024 ZonaRo SRL. Toate drepturile rezervate.
