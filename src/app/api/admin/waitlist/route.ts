import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function getAdminSupabase() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
  return data?.role === 'admin' ? supabase : null;
}

export async function GET(req: NextRequest) {
  const supabase = await getAdminSupabase();
  if (!supabase) return NextResponse.json({ error: 'Neautorizat' }, { status: 403 });

  const { data } = await supabase
    .from('waitlist')
    .select('*')
    .order('created_at', { ascending: false });

  const format = req.nextUrl.searchParams.get('format');
  if (format === 'csv') {
    const headers = ['Nume', 'Email', 'Telefon', 'Firmă', 'Categorie', 'Oraș', 'Data înscrierii'];
    const rows = (data ?? []).map((r: any) => [
      r.name,
      r.email,
      r.phone ?? '',
      r.company_name ?? '',
      r.company_category ?? '',
      r.city ?? '',
      new Date(r.created_at).toLocaleDateString('ro-RO'),
    ]);
    const csv = [headers, ...rows]
      .map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    return new NextResponse('﻿' + csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="waitlist-zonaro.csv"',
      },
    });
  }

  return NextResponse.json(data ?? []);
}
