import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { resend, FROM_EMAIL, SITE_URL } from '@/lib/resend';
import { emailContactMessage } from '@/lib/emails/templates';
import { z } from 'zod';

const schema = z.object({
  business_id:  z.string().uuid(),
  sender_name:  z.string().min(2),
  sender_email: z.string().email(),
  sender_phone: z.string().optional(),
  message:      z.string().min(10).max(2000),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Date invalide.' }, { status: 400 });
  }

  const { business_id, sender_name, sender_email, sender_phone, message } = parsed.data;
  const supabase = createServiceClient();

  // Verifică firma
  const { data: biz } = await supabase
    .from('businesses')
    .select('id, name, email, contact_form_sends')
    .eq('id', business_id)
    .eq('status', 'active')
    .single();

  if (!biz) {
    return NextResponse.json({ error: 'Firma nu a fost găsită.' }, { status: 404 });
  }

  // Salvează mesajul
  const { error: dbError } = await supabase.from('contact_messages').insert({
    business_id,
    sender_name,
    sender_email,
    sender_phone: sender_phone || null,
    message,
  });

  if (dbError) {
    return NextResponse.json({ error: 'Eroare la salvarea mesajului.' }, { status: 500 });
  }

  // Incrementează counter
  await supabase
    .from('businesses')
    .update({ contact_form_sends: (biz.contact_form_sends ?? 0) + 1 })
    .eq('id', business_id);

  // Trimite email firmei (dacă are email setat)
  if (biz.email) {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: biz.email,
      subject: `Mesaj nou de la ${sender_name} — ZonaRo`,
      html: emailContactMessage(biz.name, sender_name, sender_email, message, `${SITE_URL}/cont`),
    }).catch(() => {});
  }

  return NextResponse.json({ success: true });
}
