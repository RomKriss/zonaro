import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { z } from 'zod';

const schema = z.object({ invoice_id: z.string().min(1) });

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide' }, { status: 400 });

  const { data: biz } = await supabase
    .from('businesses')
    .select('id, name, email')
    .eq('user_id', user.id)
    .single();

  if (!biz?.email) return NextResponse.json({ error: 'Email firmă negăsit.' }, { status: 404 });

  // Verifică că factura aparține acestui customer
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('stripe_customer_id')
    .eq('business_id', biz.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!sub?.stripe_customer_id) {
    return NextResponse.json({ error: 'Nicio subscripție activă.' }, { status: 404 });
  }

  const invoice = await stripe.invoices.retrieve(parsed.data.invoice_id);

  if (invoice.customer !== sub.stripe_customer_id) {
    return NextResponse.json({ error: 'Neautorizat' }, { status: 403 });
  }

  if (!invoice.invoice_pdf) {
    return NextResponse.json({ error: 'Factura PDF nu este disponibilă.' }, { status: 404 });
  }

  const amount = invoice.amount_paid / 100;
  const currency = invoice.currency.toUpperCase();
  const invoiceNumber = invoice.number ?? invoice.id;
  const paidAt = new Date(invoice.created * 1000).toLocaleDateString('ro-RO', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  await resend.emails.send({
    from: FROM_EMAIL,
    to: biz.email,
    subject: `Factură ZonaRo — ${invoiceNumber}`,
    html: buildEmailHtml(biz.name, invoiceNumber, amount, currency, paidAt, invoice.invoice_pdf, invoice.hosted_invoice_url ?? ''),
  });

  return NextResponse.json({ success: true });
}

function buildEmailHtml(
  bizName: string,
  invoiceNumber: string,
  amount: number,
  currency: string,
  paidAt: string,
  pdfUrl: string,
  hostedUrl: string,
): string {
  return `<!DOCTYPE html>
<html lang="ro"><head><meta charset="UTF-8"></head>
<body style="font-family:Inter,sans-serif;background:#f8fafc;margin:0;padding:40px 20px;">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
  <div style="background:#1e40af;padding:32px 40px;"><h1 style="color:#fff;margin:0;font-size:24px;">ZonaRo</h1></div>
  <div style="padding:40px;">
    <h2 style="color:#1e293b;margin:0 0 8px;">Factură ${invoiceNumber}</h2>
    <p style="color:#475569;">Dragă <strong>${bizName}</strong>, găsești mai jos factura solicitată.</p>
    <div style="background:#f1f5f9;border-radius:8px;padding:16px;margin:20px 0;">
      <p style="margin:0 0 6px;font-size:14px;color:#64748b;">Detalii factură:</p>
      <p style="margin:0;font-weight:600;color:#1e293b;">Sumă: ${amount.toFixed(2)} ${currency}</p>
      <p style="margin:4px 0 0;font-size:14px;color:#64748b;">Data plății: ${paidAt}</p>
    </div>
    <div style="display:flex;gap:12px;flex-wrap:wrap;margin-top:16px;">
      <a href="${pdfUrl}" style="display:inline-block;padding:12px 24px;background:#1e40af;color:#fff;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
        Descarcă factura PDF
      </a>
      ${hostedUrl ? `<a href="${hostedUrl}" style="display:inline-block;padding:12px 24px;background:#f1f5f9;color:#1e293b;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">Vizualizează online</a>` : ''}
    </div>
  </div>
</div></body></html>`;
}
