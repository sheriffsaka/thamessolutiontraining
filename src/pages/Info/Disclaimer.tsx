import { useState, useEffect } from 'react';
import { AlertTriangle, Hammer, ShieldAlert, Scale } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

export function Disclaimer() {
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      const { data } = await supabase.from('site_contents').select('*').eq('id', 'disclaimer_content').single();
      if (data) {
        setCmsContent(data.content);
      }
      setLoading(false);
    }
    fetchContent();
  }, []);

  return (
    <div className="bg-white min-h-screen pt-20">
      <section className="relative min-h-[50vh] flex items-center overflow-hidden border-b border-slate-100 bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=2000" 
            alt="Law and Justice" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent z-10" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="max-w-3xl">
            <p className="text-brand-teal font-black uppercase tracking-[0.4em] text-xs mb-6">Legal Notice & Disclosure</p>
            <h1 className="text-5xl lg:text-8xl font-bold tracking-tighter font-serif text-white leading-none">
              {cmsContent?.title || 'Disclaimer'}
            </h1>
            <p className="text-2xl text-slate-300 mt-8 font-serif leading-relaxed italic border-l-4 border-brand-teal pl-8">
              "Official legal statements regarding the use of our services, information accuracy, and institutional liability."
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          <div className="prose prose-lg prose-slate max-w-none">
            <div className="text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
              {cmsContent?.content || `The information provided by Thames Solution Training & Consultancy Ltd ("we," "us," or "our") on this website is for general educational and informational purposes only.

All information on the site is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.

This site cannot and does not contain legal or vocational advice. The vocational training information is provided for general informational and educational purposes only and is not a substitute for professional advice.`}
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-24 border-t border-slate-100 italic text-slate-400 text-sm font-medium text-center">
        Thames Solution Training & Consultancy Ltd reserves the right to make additions, deletions, or modifications to the contents on the service at any time without prior notice.
      </section>
    </div>
  );
}
