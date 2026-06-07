import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: NextRequest) {
  const { name, email, phone, company_name, company_category, city } = await req.json();

  if (!name?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'Numele și emailul sunt obligatorii.' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { error } = await supabase.from('waitlist').insert({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || null,
    company_name: company_name?.trim() || null,
    company_category: company_category || null,
    city: city?.trim() || null,
  });

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json(
        { error: 'Acest email este deja înregistrat pe lista de așteptare.' },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: 'Eroare la înregistrare. Încearcă din nou.' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
