import { NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';

async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
    return data?.role === 'admin';
  } catch {
    return false;
  }
}

export async function POST() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  // Supabase Management API: run SQL directly
  // The endpoint requires a service role key and the project ref extracted from the URL
  const ref = new URL(supabaseUrl).hostname.split('.')[0];

  const sqlStatements = [
    `CREATE TABLE IF NOT EXISTS site_settings (
      id text PRIMARY KEY DEFAULT 'main',
      maintenance_mode boolean NOT NULL DEFAULT false,
      maintenance_title text NOT NULL DEFAULT 'Zonaro.ro este în pregătire',
      maintenance_description text NOT NULL DEFAULT 'În curând firmele vor putea crea profiluri și vor putea fi listate în platformă.',
      waitlist_button_text text NOT NULL DEFAULT 'Înscrie-te pe lista de așteptare',
      updated_at timestamptz DEFAULT now()
    )`,
    `INSERT INTO site_settings (id) VALUES ('main') ON CONFLICT (id) DO NOTHING`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'site_settings' AND policyname = 'Toți pot citi setările') THEN
        ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Toți pot citi setările" ON site_settings FOR SELECT USING (true);
        CREATE POLICY "Doar adminii pot modifica setările" ON site_settings FOR UPDATE
          USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
      END IF;
    END $$`,
    `CREATE TABLE IF NOT EXISTS waitlist (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      email text NOT NULL UNIQUE,
      phone text,
      company_name text,
      company_category text,
      city text,
      created_at timestamptz DEFAULT now()
    )`,
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'waitlist' AND policyname = 'Oricine poate adăuga în waitlist') THEN
        ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Oricine poate adăuga în waitlist" ON waitlist FOR INSERT WITH CHECK (true);
        CREATE POLICY "Doar adminii pot vedea waitlist-ul" ON waitlist FOR SELECT
          USING (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin'));
      END IF;
    END $$`,
  ];

  const results: string[] = [];
  const errors: string[] = [];

  // Try Supabase Management API (needs PAT — won't work with service role)
  // Instead use pg-meta endpoint which IS available via service role
  for (const sql of sqlStatements) {
    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${serviceKey}`,
          'apikey': serviceKey,
        },
        body: JSON.stringify({ sql }),
      });

      if (res.ok) {
        results.push('ok');
      } else {
        // Fallback: try the pg-meta endpoint
        const pgRes = await fetch(`${supabaseUrl}/pg/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${serviceKey}`,
          },
          body: JSON.stringify({ query: sql }),
        });
        if (pgRes.ok) {
          results.push('ok via pg');
        } else {
          const pgText = await pgRes.text().catch(() => '');
          errors.push(pgText.slice(0, 200));
        }
      }
    } catch (e: any) {
      errors.push(e?.message ?? 'fetch error');
    }
  }

  // Verify by trying to read the table
  const db = createServiceClient();
  const { data, error: checkError } = await db
    .from('site_settings')
    .select('id')
    .eq('id', 'main')
    .single();

  if (data) {
    return NextResponse.json({ success: true, message: 'Tabelele există și sunt configurate.' });
  }

  return NextResponse.json({
    success: false,
    message: 'Tabelele nu au putut fi create automat. Rulează manual SQL-ul din supabase/maintenance_waitlist.sql în Supabase Dashboard → SQL Editor.',
    supabase_url: supabaseUrl,
    project_ref: ref,
    errors,
  }, { status: 500 });
}
