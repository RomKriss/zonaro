import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/server';
import { resend, FROM_EMAIL, SITE_URL } from '@/lib/resend';
import { emailReviewInvite } from '@/lib/emails/templates';
import { z } from 'zod';
import { randomBytes } from 'crypto';

const schema = z.object({
  business_id: z.string().uuid(),
  email:       z.string().email(),
  name:        z.string().optional(),
});

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide' }, { status: 400 });

  const { business_id, email, name } = parsed.data;

  // Verifică proprietar
  const { data: biz } = await supabase
    .from('businesses')
    .select('id, name')
    .eq('id', business_id)
    .eq('user_id', user.id)
    .single();

  if (!biz) return NextResponse.json({ error: 'Neautorizat' }, { status: 403 });

  // Generează token unic
  const token = randomBytes(24).toString('hex');

  // Creează recenzia "placeholder" cu token
  const serviceClient = createServiceClient();
  await serviceClient.from('reviews').insert({
    business_id,
    reviewer_name:  name ?? 'Client',
    reviewer_email: email,
    rating:         0,
    comment:        '',
    type:           'invited',
    status:         'pending',
    invite_token:   token,
  });

  const reviewUrl = `${SITE_URL}/recenzie/${token}`;

  await resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Lasă o recenzie pentru ${biz.name} — ZonaRo`,
    html: emailReviewInvite(biz.name, reviewUrl, name),
  });

  return NextResponse.json({ success: true });
}
