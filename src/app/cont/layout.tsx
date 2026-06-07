import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { getSiteSettings } from '@/lib/siteSettings';
import { WaitlistButton } from '@/components/ui/WaitlistModal';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  let isAdmin = false;

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/autentificare');

    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
    isAdmin = userData?.role === 'admin';
  } catch (e: any) {
    if (e?.digest) throw e;
    redirect('/autentificare');
  }

  const settings = await getSiteSettings();

  if (settings.maintenance_mode && !isAdmin) {
    return (
      <div className="container-page py-20 text-center">
        <div className="max-w-lg mx-auto">
          <div className="text-5xl mb-6">🚧</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {settings.maintenance_title}
          </h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            {settings.maintenance_description}
          </p>
          <WaitlistButton buttonText={settings.waitlist_button_text} size="lg" />
          <p className="text-xs text-gray-400 mt-6">
            Contul tău va fi activat la lansarea platformei.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container-page py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <DashboardSidebar />
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
