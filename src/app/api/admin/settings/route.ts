import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { revalidateTag } from 'next/cache';

async function getAdminSupabase() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
  return data?.role === 'admin' ? supabase : null;
}

export async function GET() {
  const supabase = await getAdminSupabase();
  if (!supabase) return NextResponse.json({ error: 'Neautorizat' }, { status: 403 });

  const { data } = await supabase
    .from('site_settings')
    .select('*')
    .eq('id', 'main')
    .single();

  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = await getAdminSupabase();
  if (!supabase) return NextResponse.json({ error: 'Neautorizat' }, { status: 403 });

  const { maintenance_mode, maintenance_title, maintenance_description, waitlist_button_text } =
    await req.json();

  const { error } = await supabase.from('site_settings').update({
    maintenance_mode,
    maintenance_title,
    maintenance_description,
    waitlist_button_text,
    updated_at: new Date().toISOString(),
  }).eq('id', 'main');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag('site-settings');
  return NextResponse.json({ success: true });
}
