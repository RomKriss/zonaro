import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { z } from 'zod';

const schema = z.object({ business_id: z.string().uuid() });

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide' }, { status: 400 });

  const { business_id } = parsed.data;

  // Verifică proprietar
  const { data: biz } = await supabase
    .from('businesses')
    .select('id')
    .eq('id', business_id)
    .eq('user_id', user.id)
    .single();
  if (!biz) return NextResponse.json({ error: 'Neautorizat' }, { status: 403 });

  // Obține customer ID din subscripție activă
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('business_id', business_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: 'Nicio subscripție activă găsită.' }, { status: 404 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${siteUrl}/cont/abonament`,
  });

  return NextResponse.json({ url: session.url });
}
