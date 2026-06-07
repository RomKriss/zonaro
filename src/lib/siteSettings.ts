import { unstable_cache } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

export interface SiteSettings {
  maintenance_mode: boolean;
  maintenance_title: string;
  maintenance_description: string;
  waitlist_button_text: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  maintenance_mode: false,
  maintenance_title: 'Zonaro.ro este în pregătire',
  maintenance_description: 'În curând firmele vor putea crea profiluri și vor putea fi listate în platformă.',
  waitlist_button_text: 'Înscrie-te pe lista de așteptare',
};

export const getSiteSettings = unstable_cache(
  async (): Promise<SiteSettings> => {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await supabase
        .from('site_settings')
        .select('maintenance_mode, maintenance_title, maintenance_description, waitlist_button_text')
        .eq('id', 'main')
        .single();
      return { ...DEFAULT_SETTINGS, ...(data ?? {}) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },
  ['site-settings'],
  { tags: ['site-settings'], revalidate: 60 },
);
