-- Setări site (singleton row)
CREATE TABLE IF NOT EXISTS site_settings (
  id text PRIMARY KEY DEFAULT 'main',
  maintenance_mode boolean NOT NULL DEFAULT false,
  maintenance_title text NOT NULL DEFAULT 'Zonaro.ro este în pregătire',
  maintenance_description text NOT NULL DEFAULT 'În curând firmele vor putea crea profiluri și vor putea fi listate în platformă.',
  waitlist_button_text text NOT NULL DEFAULT 'Înscrie-te pe lista de așteptare',
  updated_at timestamptz DEFAULT now()
);

INSERT INTO site_settings (id) VALUES ('main') ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Toți pot citi setările" ON site_settings
  FOR SELECT USING (true);

CREATE POLICY "Doar adminii pot modifica setările" ON site_settings
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Lista de așteptare
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL UNIQUE,
  phone text,
  company_name text,
  company_category text,
  city text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Oricine poate adăuga în waitlist" ON waitlist
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Doar adminii pot vedea waitlist-ul" ON waitlist
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
