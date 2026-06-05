import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';
import { resend, FROM_EMAIL, SITE_URL } from '@/lib/resend';
import { emailWelcome } from '@/lib/emails/templates';
import { generateSlug } from '@/lib/utils';
import { z } from 'zod';

const schema = z.object({
  business_id: z.string().uuid(),
  email:       z.string().email(),
  code:        z.string().length(6),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide' }, { status: 400 });

  const { business_id, email, code } = parsed.data;
  const supabase = createServiceClient();

  // Verifică cererea
  const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  const { data: claim } = await supabase
    .from('claim_requests')
    .select('*')
    .eq('business_id', business_id)
    .eq('email', email)
    .eq('verification_code', code)
    .eq('status', 'pending')
    .gt('sent_at', thirtyMinutesAgo)
    .single();

  if (!claim) {
    return NextResponse.json({ error: 'Cod incorect sau expirat. Solicită un cod nou.' }, { status: 400 });
  }

  // Verifică dacă există deja cont cu acest email
  const { data: existingUser } = await supabase.auth.admin.listUsers();
  const existing = existingUser?.users?.find((u: any) => u.email === email);

  let userId: string;

  if (existing) {
    userId = existing.id;
  } else {
    // Creează cont nou cu parolă temporară
    const tempPassword = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      password: tempPassword,
      email_confirm: true,
    });
    if (createError || !newUser.user) {
      return NextResponse.json({ error: 'Eroare la crearea contului.' }, { status: 500 });
    }
    userId = newUser.user.id;

    // Trimite email cu link reset parolă
    await supabase.auth.admin.generateLink({
      type: 'recovery',
      email,
      options: { redirectTo: `${SITE_URL}/cont` },
    });
  }

  // Asociază firma cu utilizatorul
  const { data: biz } = await supabase
    .from('businesses')
    .update({ user_id: userId, status: 'pending' })
    .eq('id', business_id)
    .select('name')
    .single();

  // Marchează cererea ca revendicată
  await supabase
    .from('claim_requests')
    .update({ status: 'claimed', claimed_at: new Date().toISOString() })
    .eq('id', claim.id);

  // Email de bun venit
  if (biz) {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: `Bine ai venit pe ZonaRo — ${biz.name}`,
      html: emailWelcome(biz.name, `${SITE_URL}/cont`),
    }).catch(() => {});
  }

  return NextResponse.json({ success: true });
}
