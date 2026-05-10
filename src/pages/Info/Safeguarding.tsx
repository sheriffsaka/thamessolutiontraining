import { useState, useEffect } from 'react';
import { Shield, HeartHandshake, PhoneCall, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '@/src/lib/supabase';

export function Safeguarding() {
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      const { data } = await supabase.from('site_contents').select('*').eq('id', 'safeguarding_policy').single();
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
            src="https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&q=80&w=2000" 
            alt="Supportive Office Consultation" 
            className="w-full h-full object-cover opacity-60 shadow-2xl"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent z-10" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <p className="text-brand-teal font-black uppercase tracking-[0.4em] text-xs mb-6">Safe & Inclusive Environment</p>
          <h1 className="text-5xl lg:text-8xl font-bold mb-8 tracking-tighter font-serif text-white leading-none">
            {cmsContent?.title || 'Safeguarding'} Hub
          </h1>
          <p className="text-xl lg:text-2xl text-slate-300 max-w-3xl font-medium mb-10 leading-relaxed">
            {cmsContent?.subtitle || "Protecting our learners, staff, and visitors is our highest priority. We provide a safe, supportive, and inclusive environment for everyone to achieve their potential."}
          </p>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <p className="text-xl text-slate-300 max-w-2xl font-serif leading-relaxed italic border-l-4 border-brand-teal pl-8">
              "{cmsContent?.content?.substring(0, 160)}..."
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-8 font-serif tracking-tight">Our Commitment</h2>
              <div className="text-slate-600 leading-relaxed mb-10 font-medium text-lg whitespace-pre-wrap">
                {cmsContent?.content || `Thames Solution Training & Consultancy Ltd is committed to safeguarding and promoting the welfare of all our learners. We believe that everyone has the right to live and learn in an environment that is free from harm, neglect, and abuse.`}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  'Zero Tolerance for Abuse',
                  'Inclusive Culture',
                  'Confidential Support',
                  'Dedicated Officers',
                  'Regular Staff Training',
                  'Whistleblowing Policy'
                ].map((item) => (
                  <div key={item} className="flex items-center gap-4 p-6 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <Shield className="text-brand-teal shrink-0" size={20} />
                    <span className="font-bold text-sm text-slate-900">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-teal rounded-lg p-12 text-white shadow-2xl relative overflow-hidden border-4 border-brand-accent shadow-brand-teal/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-12 translate-x-12" />
              <div className="relative z-10 text-center lg:text-left">
                <h3 className="text-4xl lg:text-5xl font-bold mb-8 flex items-center justify-center lg:justify-start gap-6 font-serif">
                   <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white shadow-inner">
                      <PhoneCall size={32} />
                   </div>
                   Urgent Support
                </h3>
                <p className="text-white/90 mb-10 font-bold text-xl leading-relaxed">
                  "If you have an immediate concern about your safety or the safety of another student, please contact our Lead Safeguarding Officer without delay."
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a href="tel:07426566335" className="flex items-center justify-center gap-3 w-full bg-white text-brand-teal py-6 rounded-xl font-black uppercase tracking-widest text-sm transition-all hover:scale-105 shadow-2xl">
                     Call: 07426566335
                  </a>
                  <a href="mailto:admin@thamessolutiontraining.co.uk" className="flex items-center justify-center gap-3 w-full bg-brand-dark border border-brand-teal/40 py-6 rounded-xl font-black uppercase tracking-widest text-sm text-white hover:bg-black transition-all">
                     Email Admin
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-12">
             <div className="bg-white rounded-lg p-12 border border-slate-100 shadow-2xl">
                <h3 className="text-3xl font-bold text-slate-900 mb-10 font-serif tracking-tight">External Agencies</h3>
                <div className="space-y-6">
                   {[
                     { name: 'NSPCC', url: 'https://www.nspcc.org.uk', desc: 'Expert guidance on child protection and safety standards.' },
                     { name: 'Childline', url: 'https://www.childline.org.uk', desc: '24/7 confidential support for young people across the UK.' },
                     { name: 'Citizens Advice', url: 'https://www.citizensadvice.org.uk', desc: 'Comprehensive legal and personal support services.' },
                     { name: 'Mind', url: 'https://www.mind.org.uk', desc: 'Specialized mental health support and crisis information.' },
                   ].map((link) => (
                     <a 
                       key={link.name} 
                       href={link.url} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="block group p-8 bg-slate-50 rounded-lg hover:bg-slate-900 transition-all border border-transparent shadow-sm"
                     >
                       <div className="flex justify-between items-center mb-4">
                         <h4 className="text-xl font-bold text-slate-900 group-hover:text-white transition-colors font-serif">{link.name}</h4>
                         <ExternalLink size={18} className="text-brand-teal group-hover:text-white transition-colors" />
                       </div>
                       <p className="text-slate-500 font-medium leading-relaxed group-hover:text-slate-400 transition-colors">{link.desc}</p>
                     </a>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>
    </div>

  );
}
