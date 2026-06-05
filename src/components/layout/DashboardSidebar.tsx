'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, User, Image, Wrench, Star,
  BarChart2, CreditCard, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/cont', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/cont/profil', icon: User, label: 'Profil' },
  { href: '/cont/poze', icon: Image, label: 'Poze' },
  { href: '/cont/servicii', icon: Wrench, label: 'Servicii' },
  { href: '/cont/recenzii', icon: Star, label: 'Recenzii' },
  { href: '/cont/statistici', icon: BarChart2, label: 'Statistici' },
  { href: '/cont/abonament', icon: CreditCard, label: 'Abonament' },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <nav className="w-full lg:w-56 flex-shrink-0">
      <ul className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
        {NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-shrink-0">
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap',
                  active
                    ? 'bg-brand-700 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
                {active && <ChevronRight className="h-3.5 w-3.5 ml-auto hidden lg:block" />}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
