import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Dacă Supabase nu e configurat, lasă request-ul să treacă
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project')) {
    return NextResponse.next({ request });
  }

  try {
    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    });

    const { data: { user } } = await supabase.auth.getUser();

    // Rute protejate pentru firmă
    if (request.nextUrl.pathname.startsWith('/cont')) {
      if (!user) {
        return NextResponse.redirect(new URL('/autentificare', request.url));
      }
    }

    // Rute protejate pentru admin
    if (request.nextUrl.pathname.startsWith('/admin')) {
      if (!user) {
        return NextResponse.redirect(new URL('/autentificare', request.url));
      }
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (userData?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url));
      }
    }

    // Redirecționare dacă e deja autentificat
    if (
      user &&
      (request.nextUrl.pathname === '/autentificare' ||
        request.nextUrl.pathname === '/inregistrare')
    ) {
      return NextResponse.redirect(new URL('/cont', request.url));
    }

    return supabaseResponse;
  } catch {
    // Dacă Supabase aruncă eroare, lasă request-ul să treacă normal
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
