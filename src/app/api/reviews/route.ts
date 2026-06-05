import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { resend, FROM_EMAIL, SITE_URL } from '@/lib/resend';
import { emailNewReview } from '@/lib/emails/templates';
import { z } from 'zod';

const schema = z.object({
  business_id:    z.string().uuid(),
  reviewer_name:  z.string().min(2),
  reviewer_email: z.string().email(),
  rating:         z.number().int().min(1).max(5),
  comment:        z.string().min(20).max(3000),
  invoice_number: z.string().optional(),
  type:           z.enum(['invited', 'independent']).default('independent'),
  invite_token:   z.string().optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Date invalide.' }, { status: 400 });
  }

  const supabase = createServiceClient();
  const { invite_token, ...reviewData } = parsed.data;

  // Verifică token invitație dacă e cazul
  let status = 'pending';
  if (invite_token) {
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('invite_token', invite_token)
      .single();
    if (existingReview) {
      return NextResponse.json({ error: 'Această invitație a fost deja folosită.' }, { status: 409 });
    }
    status = 'pending';
  }

  const { error: dbError } = await supabase.from('reviews').insert({
    ...reviewData,
    invite_token: invite_token || null,
    status,
  });

  if (dbError) {
    return NextResponse.json({ error: 'Eroare la salvarea recenziei.' }, { status: 500 });
  }

  // Notifică firma
  const { data: biz } = await supabase
    .from('businesses')
    .select('name, email')
    .eq('id', reviewData.business_id)
    .single();

  if (biz?.email) {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: biz.email,
      subject: `Recenzie nouă pentru ${biz.name} — ZonaRo`,
      html: emailNewReview(biz.name, reviewData.reviewer_name, reviewData.rating, reviewData.comment, `${SITE_URL}/cont`),
    }).catch(() => {});
  }

  return NextResponse.json({ success: true });
}
