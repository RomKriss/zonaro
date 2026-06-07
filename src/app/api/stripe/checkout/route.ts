import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe, STRIPE_PRICES, StripePlan, StripeBillingPeriod } from '@/lib/stripe';
import { getSiteSettings } from '@/lib/siteSettings';
import { z } from 'zod';

// ID-ul coupon-ului de lansare 50% pentru Plus (3 luni)
// Trebuie creat în Stripe Dashboard sau prin API la configurare inițială
const LAUNCH_COUPON_PLUS = process.env.STRIPE_COUPON_PLUS_LAUNCH ?? '';

// Schema permise și fără business_id (pentru utilizatorii nelogați care vin din /preturi)
const schema = z.object({
  plan:           z.enum(['plus', 'pro', 'elite']),
  billing_period: z.enum(['monthly', 'yearly']),
  business_id:    z.string().uuid().optional(),
});

export async function POST(req: NextRequest) {
  const [settings, supabase] = await Promise.all([getSiteSettings(), createClient()]);
  if (settings.maintenance_mode) {
    return NextResponse.json(
      { error: 'Platforma este temporar în pregătire. Checkout-ul nu este disponibil momentan.' },
      { status: 503 },
    );
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide' }, { status: 400 });

  const { plan, billing_period } = parsed.data;
  let businessId = parsed.data.business_id;

  // Dacă nu s-a trimis business_id, îl detectăm din user
  if (!businessId) {
    const { data: biz } = await supabase
      .from('businesses')
      .select('id')
      .eq('user_id', user.id)
      .single();
    businessId = biz?.id;
  }

  if (!businessId) return NextResponse.json({ error: 'Nicio firmă găsită pentru acest cont.' }, { status: 404 });

  // Verifică că firma aparține utilizatorului
  const { data: biz } = await supabase
    .from('businesses')
    .select('id, name, email')
    .eq('id', businessId)
    .eq('user_id', user.id)
    .single();

  if (!biz) return NextResponse.json({ error: 'Neautorizat' }, { status: 403 });

  // Obține sau creează Stripe customer
  const { data: existingSub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('business_id', businessId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  let customerId = existingSub?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      name:  biz.name,
      metadata: { business_id: businessId, user_id: user.id },
    });
    customerId = customer.id;
  }

  const priceId = STRIPE_PRICES[plan as StripePlan][billing_period as StripeBillingPeriod];
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;

  // Aplică coupon de lansare 50% pentru Plus lunar (automat, fără cod)
  const isPromoEligible =
    plan === 'plus' &&
    billing_period === 'monthly' &&
    !!LAUNCH_COUPON_PLUS &&
    new Date() < new Date('2026-09-05T23:59:59');

  const session = await stripe.checkout.sessions.create({
    customer: customerId || undefined,
    customer_email: customerId ? undefined : (biz.email ?? user.email ?? undefined),
    payment_method_types: ['card'],
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    discounts: isPromoEligible ? [{ coupon: LAUNCH_COUPON_PLUS }] : undefined,
    success_url: `${siteUrl}/cont/abonament?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:  `${siteUrl}/cont/abonament?cancelled=true`,
    metadata: { business_id: businessId, plan, billing_period },
    subscription_data: {
      metadata: { business_id: businessId, plan, billing_period },
    },
    locale: 'ro',
  });

  return NextResponse.json({ url: session.url });
}
