import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/siteSettings';
import { PreturiClient } from './PreturiClient';

export const metadata: Metadata = {
  title: 'Planuri și Prețuri — ZonaRo',
  description: 'Alege planul potrivit pentru afacerea ta. Vizibilitate locală, recenzii verificate și suport pentru creșterea prezenței digitale.',
  alternates: { canonical: '/preturi' },
};

export default async function PreturiPage() {
  const settings = await getSiteSettings();
  return (
    <PreturiClient
      maintenanceMode={settings.maintenance_mode}
      waitlistButtonText={settings.waitlist_button_text}
    />
  );
}
