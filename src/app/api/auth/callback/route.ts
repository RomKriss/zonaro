import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/cont';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      // Asigură că userul există în public.users cu status activ
      try {
        const service = createServiceClient();
        await service.from('users').upsert(
          { id: data.user.id, email: data.user.email ?? '', role: 'business' },
          { onConflict: 'id', ignoreDuplicates: true }
        );
      } catch {
        // Non-fatal — continuă redirect-ul indiferent
      }
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/autentificare?error=auth`);
}
