import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const schema = z.object({ reply: z.string().min(1).max(2000) });

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Neautorizat' }, { status: 401 });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Date invalide' }, { status: 400 });

  // Verifică că recenzia aparține firmei utilizatorului
  const { data: review } = await supabase
    .from('reviews')
    .select('business_id')
    .eq('id', params.id)
    .single();

  if (!review) return NextResponse.json({ error: 'Recenzie negăsită' }, { status: 404 });

  const { data: biz } = await supabase
    .from('businesses')
    .select('id, plan')
    .eq('id', review.business_id)
    .eq('user_id', user.id)
    .single();

  if (!biz) return NextResponse.json({ error: 'Neautorizat' }, { status: 403 });
  if (biz.plan === 'free') return NextResponse.json({ error: 'Necesită plan Plus sau superior' }, { status: 403 });

  const { error } = await supabase
    .from('reviews')
    .update({ owner_reply: parsed.data.reply })
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: 'Eroare la salvare' }, { status: 500 });
  return NextResponse.json({ success: true });
}
