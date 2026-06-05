import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createServiceClient } from '@/lib/supabase/server';
import { resend, FROM_EMAIL, SITE_URL } from '@/lib/resend';
import Stripe from 'stripe';

// Mapare plan → sume RON (prețuri ZonaRo)
const PLAN_AMOUNTS: Record<string, Record<string, number>> = {
  plus:  { monthly: 34.99, yearly: 314.99 },
  pro:   { monthly: 69.99, yearly: 629.99 },
  elite: { monthly: 139.99, yearly: 1259.99 },
};

function getExpiresAt(billingPeriod: string): string {
  const days = billingPeriod === 'yearly' ? 365 : 30;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: 'Webhook signature invalid' }, { status: 400 });
  }

  const supabase = createServiceClient();

  switch (event.type) {

    // ── Checkout finalizat ─────────────────────────────────
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const { business_id, plan, billing_period } = session.metadata ?? {};
      if (!business_id || !plan) break;

      const amount = PLAN_AMOUNTS[plan]?.[billing_period ?? 'monthly'] ?? 0;
      const expiresAt = getExpiresAt(billing_period ?? 'monthly');

      await supabase.from('businesses')
        .update({ plan, plan_expires_at: expiresAt })
        .eq('id', business_id);

      await supabase.from('subscriptions').upsert({
        business_id,
        plan,
        billing_period: billing_period ?? 'monthly',
        amount,
        status: 'active',
        stripe_subscription_id: session.subscription as string,
        stripe_customer_id: session.customer as string,
        expires_at: expiresAt,
      }, { onConflict: 'stripe_subscription_id' });

      // Email confirmare
      const { data: biz } = await supabase
        .from('businesses')
        .select('name, email')
        .eq('id', business_id)
        .single();

      if (biz?.email) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: biz.email,
          subject: `✅ Planul ${plan.charAt(0).toUpperCase() + plan.slice(1)} activat — ZonaRo`,
          html: emailPlanActivated(biz.name, plan, amount, billing_period ?? 'monthly', expiresAt),
        }).catch(() => {});
      }
      break;
    }

    // ── Factură plătită (reînnoire) ─────────────────────────
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      const subId = invoice.subscription as string;
      if (!subId) break;

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('business_id, plan, billing_period')
        .eq('stripe_subscription_id', subId)
        .single();

      if (sub?.business_id) {
        const expiresAt = getExpiresAt(sub.billing_period ?? 'monthly');
        await supabase.from('businesses')
          .update({ plan_expires_at: expiresAt })
          .eq('id', sub.business_id);
        await supabase.from('subscriptions')
          .update({ status: 'active', expires_at: expiresAt })
          .eq('stripe_subscription_id', subId);
      }
      break;
    }

    // ── Plată eșuată ────────────────────────────────────────
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      const subId = invoice.subscription as string;
      if (!subId) break;

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('business_id')
        .eq('stripe_subscription_id', subId)
        .single();

      if (sub?.business_id) {
        const { data: biz } = await supabase
          .from('businesses')
          .select('name, email')
          .eq('id', sub.business_id)
          .single();

        if (biz?.email) {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: biz.email,
            subject: '⚠️ Plata abonamentului ZonaRo a eșuat',
            html: emailPaymentFailed(biz.name, `${SITE_URL}/cont/abonament`),
          }).catch(() => {});
        }
      }
      break;
    }

    // ── Abonament anulat ────────────────────────────────────
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      const { business_id } = sub.metadata ?? {};
      if (!business_id) break;

      await supabase.from('businesses')
        .update({ plan: 'free', plan_expires_at: null })
        .eq('id', business_id);
      await supabase.from('subscriptions')
        .update({ status: 'cancelled' })
        .eq('stripe_subscription_id', sub.id);

      const { data: biz } = await supabase
        .from('businesses')
        .select('name, email')
        .eq('id', business_id)
        .single();

      if (biz?.email) {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: biz.email,
          subject: 'Abonamentul tău ZonaRo a fost anulat',
          html: emailSubscriptionCancelled(biz.name, `${SITE_URL}/cont/abonament`),
        }).catch(() => {});
      }
      break;
    }

    // ── Subscripție actualizată (upgrade/downgrade din portal) ─
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      const { business_id, plan, billing_period } = sub.metadata ?? {};
      if (!business_id || !plan) break;

      const expiresAt = new Date(sub.current_period_end * 1000).toISOString();
      await supabase.from('businesses')
        .update({ plan, plan_expires_at: expiresAt })
        .eq('id', business_id);
      await supabase.from('subscriptions')
        .update({
          plan,
          billing_period: billing_period ?? 'monthly',
          status: sub.status === 'active' ? 'active' : 'cancelled',
          expires_at: expiresAt,
        })
        .eq('stripe_subscription_id', sub.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

// ── Template-uri email ────────────────────────────────────────

function emailPlanActivated(
  bizName: string,
  plan: string,
  amount: number,
  billing: string,
  expiresAt: string
): string {
  const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);
  const billingLabel = billing === 'yearly' ? 'anual' : 'lunar';
  const expiryDate = new Date(expiresAt).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' });

  return `<!DOCTYPE html>
<html lang="ro"><head><meta charset="UTF-8"></head>
<body style="font-family:Inter,sans-serif;background:#f8fafc;margin:0;padding:40px 20px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
  <div style="background:#1e40af;padding:32px 40px;">
    <h1 style="color:#fff;margin:0;font-size:24px;">ZonaRo</h1>
  </div>
  <div style="padding:40px;">
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;">✅</div>
      <h2 style="color:#1e293b;margin:8px 0;">Planul ${planLabel} a fost activat!</h2>
    </div>
    <p style="color:#475569;">Felicitări, <strong>${bizName}</strong>! Abonamentul tău a fost procesat cu succes.</p>
    <div style="background:#f1f5f9;border-radius:8px;padding:16px;margin:20px 0;">
      <p style="margin:0 0 8px;font-size:14px;color:#64748b;">Detalii abonament:</p>
      <p style="margin:0;font-weight:600;color:#1e293b;">Plan <strong>${planLabel}</strong> — facturat ${billingLabel}</p>
      <p style="margin:4px 0 0;font-size:14px;color:#64748b;">Suma: <strong>${amount} RON</strong></p>
      <p style="margin:4px 0 0;font-size:14px;color:#64748b;">Valabil până la: <strong>${expiryDate}</strong></p>
    </div>
    <a href="${SITE_URL}/cont" style="display:inline-block;margin-top:16px;padding:14px 28px;background:#1e40af;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
      Accesează Dashboard-ul
    </a>
  </div>
</div></body></html>`;
}

function emailPaymentFailed(bizName: string, dashboardUrl: string): string {
  return `<!DOCTYPE html>
<html lang="ro"><head><meta charset="UTF-8"></head>
<body style="font-family:Inter,sans-serif;background:#f8fafc;margin:0;padding:40px 20px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
  <div style="background:#1e40af;padding:32px 40px;"><h1 style="color:#fff;margin:0;font-size:24px;">ZonaRo</h1></div>
  <div style="padding:40px;">
    <h2 style="color:#dc2626;margin:0 0 16px;">⚠️ Plata abonamentului a eșuat</h2>
    <p style="color:#475569;">Dragă <strong>${bizName}</strong>, plata pentru abonamentul tău ZonaRo nu a putut fi procesată.</p>
    <p style="color:#475569;">Te rugăm să actualizezi datele de plată pentru a păstra accesul la funcționalitățile planului tău.</p>
    <a href="${dashboardUrl}" style="display:inline-block;margin-top:16px;padding:14px 28px;background:#dc2626;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
      Actualizează datele de plată
    </a>
  </div>
</div></body></html>`;
}

function emailSubscriptionCancelled(bizName: string, dashboardUrl: string): string {
  return `<!DOCTYPE html>
<html lang="ro"><head><meta charset="UTF-8"></head>
<body style="font-family:Inter,sans-serif;background:#f8fafc;margin:0;padding:40px 20px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
  <div style="background:#1e40af;padding:32px 40px;"><h1 style="color:#fff;margin:0;font-size:24px;">ZonaRo</h1></div>
  <div style="padding:40px;">
    <h2 style="color:#1e293b;margin:0 0 16px;">Abonamentul tău a fost anulat</h2>
    <p style="color:#475569;">Dragă <strong>${bizName}</strong>, abonamentul tău ZonaRo a fost anulat.</p>
    <p style="color:#475569;">Profilul tău a trecut pe planul gratuit. Datele din profil sunt în siguranță — poți reactiva oricând.</p>
    <a href="${dashboardUrl}" style="display:inline-block;margin-top:16px;padding:14px 28px;background:#1e40af;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">
      Reactivează abonamentul
    </a>
  </div>
</div></body></html>`;
}
