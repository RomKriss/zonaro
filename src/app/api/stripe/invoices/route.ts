import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const { data: biz } = await supabase
    .from('businesses')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (!biz) return NextResponse.json({ error: 'Nicio firmă găsită.' }, { status: 404 });

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('business_id', biz.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ invoices: [] });
  }

  const stripeInvoices = await stripe.invoices.list({
    customer: sub.stripe_customer_id,
    limit: 12,
  });

  const invoices = stripeInvoices.data.map((inv) => ({
    id: inv.id,
    number: inv.number ?? inv.id,
    date: inv.created,
    amount: inv.amount_paid / 100,
    currency: inv.currency.toUpperCase(),
    status: inv.status,
    pdf_url: inv.invoice_pdf,
    hosted_url: inv.hosted_invoice_url,
  }));

  return NextResponse.json({ invoices });
}
