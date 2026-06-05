-- ============================================================
-- ZONARO — Schema completă Supabase PostgreSQL
-- ============================================================

-- Activare extensii necesare
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('business', 'admin');
CREATE TYPE business_status AS ENUM ('unclaimed', 'pending', 'active', 'suspended');
CREATE TYPE business_plan AS ENUM ('free', 'plus', 'pro', 'elite');
CREATE TYPE subscription_plan AS ENUM ('plus', 'pro', 'elite');
CREATE TYPE billing_period AS ENUM ('monthly', 'yearly');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired');
CREATE TYPE review_type AS ENUM ('invited', 'independent');
CREATE TYPE review_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE claim_status AS ENUM ('pending', 'claimed', 'expired');

-- ============================================================
-- TABELE
-- ============================================================

-- Users (extinde auth.users Supabase)
CREATE TABLE public.users (
  id         UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email      TEXT UNIQUE NOT NULL,
  role       user_role NOT NULL DEFAULT 'business',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categorii (cu suport subcategorii)
CREATE TABLE public.categories (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  slug        TEXT UNIQUE NOT NULL,
  icon        TEXT NOT NULL DEFAULT 'Briefcase',
  parent_id   UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Firme / Meșteri
CREATE TABLE public.businesses (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id               UUID REFERENCES public.users(id) ON DELETE SET NULL,
  name                  TEXT NOT NULL,
  cui                   TEXT UNIQUE,
  slug                  TEXT UNIQUE NOT NULL,
  description_short     TEXT,
  description_long      TEXT,
  phone                 TEXT,
  email                 TEXT,
  website               TEXT,
  address               TEXT,
  city                  TEXT NOT NULL,
  county                TEXT NOT NULL,
  category_id           UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  status                business_status NOT NULL DEFAULT 'unclaimed',
  verified              BOOLEAN NOT NULL DEFAULT FALSE,
  plan                  business_plan NOT NULL DEFAULT 'free',
  plan_expires_at       TIMESTAMPTZ,
  youtube_url           TEXT,
  profile_views         INTEGER NOT NULL DEFAULT 0,
  phone_clicks          INTEGER NOT NULL DEFAULT 0,
  contact_form_sends    INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Poze firme
CREATE TABLE public.photos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  is_primary  BOOLEAN NOT NULL DEFAULT FALSE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Servicii oferite
CREATE TABLE public.services (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT,
  price_range TEXT,
  order_index INTEGER NOT NULL DEFAULT 0
);

-- Recenzii
CREATE TABLE public.reviews (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id     UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  reviewer_name   TEXT NOT NULL,
  reviewer_email  TEXT NOT NULL,
  rating          INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment         TEXT NOT NULL,
  invoice_number  TEXT,
  type            review_type NOT NULL DEFAULT 'independent',
  status          review_status NOT NULL DEFAULT 'pending',
  owner_reply     TEXT,
  invite_token    TEXT UNIQUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Abonamente Stripe
CREATE TABLE public.subscriptions (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id             UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  plan                    subscription_plan NOT NULL,
  billing_period          billing_period NOT NULL DEFAULT 'monthly',
  amount                  INTEGER NOT NULL,
  status                  subscription_status NOT NULL DEFAULT 'active',
  stripe_subscription_id  TEXT UNIQUE,
  stripe_customer_id      TEXT,
  started_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at              TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cereri revendicare profil
CREATE TABLE public.claim_requests (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id       UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  email             TEXT NOT NULL,
  verification_code TEXT NOT NULL,
  status            claim_status NOT NULL DEFAULT 'pending',
  sent_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  claimed_at        TIMESTAMPTZ
);

-- Mesaje de contact
CREATE TABLE public.contact_messages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id   UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  sender_name   TEXT NOT NULL,
  sender_email  TEXT NOT NULL,
  sender_phone  TEXT,
  message       TEXT NOT NULL,
  read          BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDECȘI pentru performanță
-- ============================================================

CREATE INDEX idx_businesses_slug ON public.businesses(slug);
CREATE INDEX idx_businesses_city ON public.businesses(city);
CREATE INDEX idx_businesses_county ON public.businesses(county);
CREATE INDEX idx_businesses_category ON public.businesses(category_id);
CREATE INDEX idx_businesses_status ON public.businesses(status);
CREATE INDEX idx_businesses_plan ON public.businesses(plan);
CREATE INDEX idx_businesses_user ON public.businesses(user_id);
CREATE INDEX idx_reviews_business ON public.reviews(business_id);
CREATE INDEX idx_reviews_status ON public.reviews(status);
CREATE INDEX idx_photos_business ON public.photos(business_id);
CREATE INDEX idx_services_business ON public.services(business_id);
CREATE INDEX idx_subscriptions_business ON public.subscriptions(business_id);
CREATE INDEX idx_contact_messages_business ON public.contact_messages(business_id);
CREATE INDEX idx_categories_parent ON public.categories(parent_id);
CREATE INDEX idx_categories_slug ON public.categories(slug);

-- Index full-text search pentru firme
CREATE INDEX idx_businesses_search ON public.businesses
  USING GIN(to_tsvector('romanian', coalesce(name,'') || ' ' || coalesce(description_short,'') || ' ' || coalesce(city,'')));

-- ============================================================
-- FUNCȚII TRIGGER
-- ============================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Creare automată profil user după signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (NEW.id, NEW.email, 'business');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.claim_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Funcție helper: verifică dacă utilizatorul curent e admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Funcție helper: obține business_id al utilizatorului curent
CREATE OR REPLACE FUNCTION public.my_business_id()
RETURNS UUID AS $$
  SELECT id FROM public.businesses WHERE user_id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- POLICIES: users
CREATE POLICY "users_select_own" ON public.users
  FOR SELECT USING (id = auth.uid() OR is_admin());

CREATE POLICY "users_update_own" ON public.users
  FOR UPDATE USING (id = auth.uid());

-- POLICIES: categories (publice pentru citire)
CREATE POLICY "categories_public_read" ON public.categories
  FOR SELECT USING (TRUE);

CREATE POLICY "categories_admin_write" ON public.categories
  FOR ALL USING (is_admin());

-- POLICIES: businesses
CREATE POLICY "businesses_public_read" ON public.businesses
  FOR SELECT USING (status = 'active' OR user_id = auth.uid() OR is_admin());

CREATE POLICY "businesses_owner_update" ON public.businesses
  FOR UPDATE USING (user_id = auth.uid() OR is_admin());

CREATE POLICY "businesses_admin_insert" ON public.businesses
  FOR INSERT WITH CHECK (is_admin() OR auth.uid() IS NOT NULL);

CREATE POLICY "businesses_admin_delete" ON public.businesses
  FOR DELETE USING (is_admin());

-- POLICIES: photos
CREATE POLICY "photos_public_read" ON public.photos
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND (b.status = 'active' OR b.user_id = auth.uid()))
  );

CREATE POLICY "photos_owner_write" ON public.photos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND (b.user_id = auth.uid() OR is_admin()))
  );

-- POLICIES: services
CREATE POLICY "services_public_read" ON public.services
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND (b.status = 'active' OR b.user_id = auth.uid()))
  );

CREATE POLICY "services_owner_write" ON public.services
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND (b.user_id = auth.uid() OR is_admin()))
  );

-- POLICIES: reviews
CREATE POLICY "reviews_public_read" ON public.reviews
  FOR SELECT USING (status = 'approved' OR EXISTS (
    SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.user_id = auth.uid()
  ) OR is_admin());

CREATE POLICY "reviews_public_insert" ON public.reviews
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "reviews_owner_reply" ON public.reviews
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.user_id = auth.uid())
    OR is_admin()
  );

-- POLICIES: subscriptions
CREATE POLICY "subscriptions_owner_read" ON public.subscriptions
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.user_id = auth.uid())
    OR is_admin()
  );

CREATE POLICY "subscriptions_service_write" ON public.subscriptions
  FOR ALL USING (is_admin());

-- POLICIES: claim_requests
CREATE POLICY "claim_requests_public_insert" ON public.claim_requests
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "claim_requests_admin_read" ON public.claim_requests
  FOR SELECT USING (is_admin() OR email = (SELECT email FROM public.users WHERE id = auth.uid()));

CREATE POLICY "claim_requests_admin_update" ON public.claim_requests
  FOR UPDATE USING (is_admin());

-- POLICIES: contact_messages
CREATE POLICY "contact_messages_public_insert" ON public.contact_messages
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "contact_messages_owner_read" ON public.contact_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.user_id = auth.uid())
    OR is_admin()
  );

-- ============================================================
-- SUPABASE STORAGE — bucket-uri
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('business-photos', 'business-photos', true)
ON CONFLICT DO NOTHING;

-- Policy: oricine poate citi pozele publice
CREATE POLICY "photos_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'business-photos');

-- Policy: proprietarul firmei poate încărca poze
CREATE POLICY "photos_owner_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'business-photos'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY "photos_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'business-photos'
    AND auth.uid() IS NOT NULL
  );

-- ============================================================
-- DATE SEED — Categorii principale
-- ============================================================

INSERT INTO public.categories (id, name, slug, icon, order_index) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Construcții și Renovări', 'constructii-renovari', 'HardHat', 1),
  ('c1000000-0000-0000-0000-000000000002', 'Instalații', 'instalatii', 'Wrench', 2),
  ('c1000000-0000-0000-0000-000000000003', 'Electricitate', 'electricitate', 'Zap', 3),
  ('c1000000-0000-0000-0000-000000000004', 'Servicii Auto', 'servicii-auto', 'Car', 4),
  ('c1000000-0000-0000-0000-000000000005', 'Sănătate și Medicină', 'sanatate-medicina', 'Heart', 5),
  ('c1000000-0000-0000-0000-000000000006', 'Stomatologie', 'stomatologie', 'SmilePlus', 6),
  ('c1000000-0000-0000-0000-000000000007', 'Avocatură și Notariat', 'avocatura-notariat', 'Scale', 7),
  ('c1000000-0000-0000-0000-000000000008', 'Imobiliare', 'imobiliare', 'Building2', 8),
  ('c1000000-0000-0000-0000-000000000009', 'IT și Tehnologie', 'it-tehnologie', 'Monitor', 9),
  ('c1000000-0000-0000-0000-000000000010', 'Saloane și Beauty', 'saloane-beauty', 'Scissors', 10),
  ('c1000000-0000-0000-0000-000000000011', 'Restaurante și Catering', 'restaurante-catering', 'UtensilsCrossed', 11),
  ('c1000000-0000-0000-0000-000000000012', 'Educație și Meditații', 'educatie-meditatii', 'GraduationCap', 12),
  ('c1000000-0000-0000-0000-000000000013', 'Transport și Curierat', 'transport-curierat', 'Truck', 13),
  ('c1000000-0000-0000-0000-000000000014', 'Contabilitate și Consultanță', 'contabilitate-consultanta', 'Calculator', 14),
  ('c1000000-0000-0000-0000-000000000015', 'Curățenie și Menaj', 'curatenie-menaj', 'Sparkles', 15),
  ('c1000000-0000-0000-0000-000000000016', 'Agricultură', 'agricultura', 'Sprout', 16),
  ('c1000000-0000-0000-0000-000000000017', 'Producție și Industrie', 'productie-industrie', 'Factory', 17),
  ('c1000000-0000-0000-0000-000000000018', 'Comerț și Magazine', 'comert-magazine', 'ShoppingBag', 18),
  ('c1000000-0000-0000-0000-000000000019', 'Evenimente și Foto-Video', 'evenimente-foto-video', 'Camera', 19),
  ('c1000000-0000-0000-0000-000000000020', 'Alte Servicii', 'alte-servicii', 'MoreHorizontal', 20);

-- Subcategorii pentru Construcții și Renovări
INSERT INTO public.categories (name, slug, icon, parent_id, order_index) VALUES
  ('Zidărie și Construcții', 'zidarie-constructii', 'HardHat', 'c1000000-0000-0000-0000-000000000001', 1),
  ('Amenajări Interioare', 'amenajari-interioare', 'Paintbrush', 'c1000000-0000-0000-0000-000000000001', 2),
  ('Acoperișuri și Terase', 'acoperisuri-terase', 'Home', 'c1000000-0000-0000-0000-000000000001', 3),
  ('Tâmplărie și Uși', 'tamplarie-usi', 'DoorOpen', 'c1000000-0000-0000-0000-000000000001', 4),
  ('Parchet și Gresie', 'parchet-gresie', 'LayoutGrid', 'c1000000-0000-0000-0000-000000000001', 5),
  ('Vopsitorie și Zugrăveală', 'vopsitorie-zugravire', 'Paintbrush2', 'c1000000-0000-0000-0000-000000000001', 6);

-- Subcategorii pentru Instalații
INSERT INTO public.categories (name, slug, icon, parent_id, order_index) VALUES
  ('Instalații Sanitare', 'instalatii-sanitare', 'Droplets', 'c1000000-0000-0000-0000-000000000002', 1),
  ('Instalații Termice', 'instalatii-termice', 'Flame', 'c1000000-0000-0000-0000-000000000002', 2),
  ('Instalații Gaze', 'instalatii-gaze', 'Gauge', 'c1000000-0000-0000-0000-000000000002', 3),
  ('Climatizare și Ventilație', 'climatizare-ventilatie', 'Wind', 'c1000000-0000-0000-0000-000000000002', 4);

-- Subcategorii IT
INSERT INTO public.categories (name, slug, icon, parent_id, order_index) VALUES
  ('Web Design și Dezvoltare', 'web-design-dezvoltare', 'Globe', 'c1000000-0000-0000-0000-000000000009', 1),
  ('Rețele și Servere', 'retele-servere', 'Network', 'c1000000-0000-0000-0000-000000000009', 2),
  ('Reparații Calculatoare', 'reparatii-calculatoare', 'Laptop', 'c1000000-0000-0000-0000-000000000009', 3),
  ('SEO și Marketing Digital', 'seo-marketing-digital', 'TrendingUp', 'c1000000-0000-0000-0000-000000000009', 4);
