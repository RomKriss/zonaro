'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, LogOut, Settings, BarChart2, Building2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import type { User } from '@supabase/supabase-js';

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      supabase.from('users').select('role').eq('id', user.id).single()
        .then(({ data }) => setIsAdmin(data?.role === 'admin'));
    }
  }, [user]);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-shadow bg-white',
        scrolled ? 'shadow-md' : 'shadow-sm border-b border-gray-100'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image src="/logo.svg" alt="ZonaRo" width={140} height={34} priority />
          </Link>

          {/* Navigație desktop */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/cauta" className="hover:text-brand-700 transition-colors">
              Caută Firme
            </Link>
            <Link href="/cauta?category=constructii-renovari" className="hover:text-brand-700 transition-colors">
              Categorii
            </Link>
            <Link href="/preturi" className="hover:text-brand-700 transition-colors">
              Prețuri
            </Link>
            <Link href="/inregistrare" className="hover:text-brand-700 transition-colors">
              Listează Firma
            </Link>
          </nav>

          {/* Acțiuni desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm hover:border-brand-300 hover:bg-brand-50 transition-colors"
                >
                  <div className="h-7 w-7 rounded-full bg-brand-100 flex items-center justify-center">
                    <span className="text-brand-700 font-semibold text-xs">
                      {user.email?.[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="max-w-[120px] truncate text-gray-700">{user.email}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white shadow-lg border border-gray-100 py-2 z-50">
                    <Link
                      href="/cont"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Building2 className="h-4 w-4 text-gray-400" />
                      Dashboard Firmă
                    </Link>
                    <Link
                      href="/cont/statistici"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <BarChart2 className="h-4 w-4 text-gray-400" />
                      Statistici
                    </Link>
                    <Link
                      href="/cont/abonament"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 text-gray-400" />
                      Abonament
                    </Link>
                    {isAdmin && (
                      <>
                        <div className="my-1 border-t border-gray-100" />
                        <Link
                          href="/admin"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-brand-700 font-medium hover:bg-brand-50"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      </>
                    )}
                    <div className="my-1 border-t border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Deconectare
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/autentificare">
                  <Button variant="ghost" size="sm">Autentificare</Button>
                </Link>
                <Link href="/inregistrare">
                  <Button size="sm">Adaugă firma ta</Button>
                </Link>
              </>
            )}
          </div>

          {/* Buton meniu mobil */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Meniu mobil */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2">
          <Link href="/cauta" className="block py-2.5 text-gray-700 font-medium" onClick={() => setMobileOpen(false)}>
            Caută Firme
          </Link>
          <Link href="/preturi" className="block py-2.5 text-gray-700 font-medium" onClick={() => setMobileOpen(false)}>
            Prețuri
          </Link>
          <Link href="/inregistrare" className="block py-2.5 text-gray-700 font-medium" onClick={() => setMobileOpen(false)}>
            Listează Firma
          </Link>
          {user ? (
            <>
              <Link href="/cont" className="block py-2.5 text-gray-700 font-medium" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
              {isAdmin && (
                <Link href="/admin" className="block py-2.5 text-brand-700 font-medium" onClick={() => setMobileOpen(false)}>
                  Admin
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2.5 text-red-600 font-medium"
              >
                Deconectare
              </button>
            </>
          ) : (
            <div className="pt-2 space-y-2">
              <Link href="/autentificare" onClick={() => setMobileOpen(false)}>
                <Button variant="outline" fullWidth>Autentificare</Button>
              </Link>
              <Link href="/inregistrare" onClick={() => setMobileOpen(false)}>
                <Button fullWidth>Adaugă firma ta</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
