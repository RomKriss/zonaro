import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { resend, FROM_EMAIL, SITE_URL } from '@/lib/resend';
import { emailClaimCode } from '@/lib/emails/templates';
import { z } from 'zod';

const schema = z.object({
  business_id: z.string().uuid(),
  email:       z.string().email(),
});

// Generează cod de 6 cifre
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide' }, { status: 400 });

  const { business_id, email } = parsed.data;
  const supabase = createServiceClient();

  const { data: biz } = await supabase
    .from('businesses')
    .select('id, name, status')
    .eq('id', business_id)
    .single();

  if (!biz) return NextResponse.json({ error: 'Firma nu a fost găsită.' }, { status: 404 });
  if (biz.status !== 'unclaimed') return NextResponse.json({ error: 'Acest profil a fost deja revendicat.' }, { status: 409 });

  const code = generateCode();

  // Invalidează cererile precedente
  await supabase
    .from('claim_requests')
    .update({ status: 'expired' })
    .eq('business_id', business_id)
    .eq('status', 'pending');

  // Creează cerere nouă
  await supabase.from('claim_requests').insert({
    business_id,
    email,
    verification_code: code,
    status: 'pending',
  });

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Codul de verificare ZonaRo — ${biz.name}`,
    html: emailClaimCode(code, biz.name, `${SITE_URL}/revendica/${business_id}`),
  });

  return NextResponse.json({ success: true });
}
