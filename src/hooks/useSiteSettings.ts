import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';

export interface SiteSettings {
  phone: string;
  email: string;
  address: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  banner_active?: boolean;
  banner_text?: string;
}

const defaultSettings: SiteSettings = {
  phone: "07426566335",
  email: "admin@thamessolutiontraining.co.uk",
  address: "Capital House, Catford, London SE6 4AS",
  facebook: "#",
  twitter: "#",
  instagram: "#",
  linkedin: "#",
  banner_active: false,
  banner_text: "Welcome to Thames Solution Training & Consultancy!"
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const { data, error } = await supabase
          .from('site_contents')
          .select('content')
          .eq('id', 'site_settings')
          .single();

        if (data && data.content) {
          setSettings(data.content as SiteSettings);
        }
      } catch (err) {
        console.error('Error fetching site settings:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchSettings();
  }, []);

  return { settings, loading };
}
