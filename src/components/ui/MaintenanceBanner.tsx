import { getSiteSettings } from '@/lib/siteSettings';

export async function MaintenanceBanner() {
  const settings = await getSiteSettings();
  if (!settings.maintenance_mode) return null;

  return (
    <div className="bg-amber-500 text-white text-center py-2.5 px-4 text-sm font-medium">
      🚧 Zonaro.ro se pregătește de lansare — unele funcționalități sunt temporar indisponibile
    </div>
  );
}
