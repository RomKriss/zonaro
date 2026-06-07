import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import {
  LayoutDashboard, Building2, Star, Shield, BarChart2,
  Settings, Users, ExternalLink,
} from 'lucide-react';

const ADMIN_NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/firme', label: 'Firme', icon: Building2 },
  { href: '/admin/recenzii', label: 'Recenzii', icon: Star },
  { href: '/admin/claim', label: 'Revendicări', icon: Shield },
  { href: '/admin/statistici', label: 'Statistici', icon: BarChart2 },
  { href: '/admin/waitlist', label: 'Lista așteptare', icon: Users },
  { href: '/admin/setari', label: 'Setări Site', icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/autentificare');

  const { data: userData } = await supabase.from('users').select('role').eq('id', user.id).single();
  if (userData?.role !== 'admin') redirect('/');

  return (
    <div className="container-page py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Admin sidebar */}
        <aside className="w-full lg:w-56 flex-shrink-0">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
            Admin Panel
          </p>
          <nav className="space-y-1">
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <a
              href="/studio"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Studio Blog
            </a>
          </div>
        </aside>

        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
