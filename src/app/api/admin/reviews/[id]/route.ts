import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (userData?.role !== 'admin') return NextResponse.json({ error: 'Neautorizat' }, { status: 403 });

  const formData = await req.formData();
  const action = formData.get('action') as string;

  const status = action === 'approve' ? 'approved' : 'rejected';
  await supabase.from('reviews').update({ status }).eq('id', params.id);

  return NextResponse.redirect(new URL('/admin/recenzii', req.url));
}
