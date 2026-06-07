import { NextRequest, NextResponse } from 'next/server';
import { createClient, createServiceClient } from '@/lib/supabase/server';
import { revalidateTag } from 'next/cache';

async function isAdmin(): Promise<boolean> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;
    const { data } = await supabase.from('users').select('role').eq('id', user.id).single();
    return data?.role === 'admin';
  } catch {
    return false;
  }
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Neautorizat' }, { status: 403 });

  const db = createServiceClient();
  const { data, error } = await db
    .from('site_settings')
    .select('*')
    .eq('id', 'main')
    .single();

  if (error) return NextResponse.json(null);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Neautorizat' }, { status: 403 });

  const { maintenance_mode, maintenance_title, maintenance_description, waitlist_button_text } =
    await req.json();

  const db = createServiceClient();
  const { error } = await db.from('site_settings').upsert({
    id: 'main',
    maintenance_mode,
    maintenance_title,
    maintenance_description,
    waitlist_button_text,
    updated_at: new Date().toISOString(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  revalidateTag('site-settings');
  return NextResponse.json({ success: true });
}
