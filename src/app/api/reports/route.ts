/*
  SQL pentru crearea tabelei reports (deja rulat în Supabase):

  CREATE TABLE IF NOT EXISTS public.reports (
    id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id    UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    reporter_email TEXT NOT NULL,
    message        TEXT NOT NULL,
    status         TEXT NOT NULL DEFAULT 'pending',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
*/

import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({
  business_id:    z.string().uuid(),
  reporter_email: z.string().email(),
  message:        z.string().min(10, 'Minim 10 caractere').max(500),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Date invalide.' }, { status: 400 });
    }

    const supabase = createServiceClient();
    const { error } = await supabase.from('reports').insert({
      business_id:    parsed.data.business_id,
      reporter_email: parsed.data.reporter_email,
      message:        parsed.data.message,
      status:         'pending',
    });

    if (error) {
      return NextResponse.json({ error: 'Eroare la salvarea raportului.' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Eroare internă.' }, { status: 500 });
  }
}
