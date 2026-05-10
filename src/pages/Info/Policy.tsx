import { useState, useEffect } from 'react';
import { FileText, Shield, Scale, Eye, UserCheck, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';

export function Policy() {
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      const { data } = await (supabase.from('site_contents').select('*').eq('id', 'policies_intro').single() as any);
      if (data) {
        setCmsContent(data.content);
      }
      setLoading(false);
    }
    fetchContent();
  }, []);

  const policies = [
    { id: 'privacy', title: 'Privacy Policy', icon: Eye, color: 'text-brand-teal' },
    { id: 'terms', title: 'Terms of Service', icon: Scale, color: 'text-brand-teal' },
    { id: 'cookies', title: 'Cookie Policy', icon: FileText, color: 'text-brand-teal' },
    { id: 'gdpr', title: 'Data Protection (GDPR)', icon: Shield, color: 'text-brand-teal' },
    { id: 'conduct', title: 'Student Code of Conduct', icon: UserCheck, color: 'text-brand-teal' },
    { id: 'whistleblowing', title: 'Whistleblowing Policy', icon: MessageSquare, color: 'text-brand-teal' },
  ];

  return (
    <div className="bg-white min-h-screen pt-20">
      <section className="relative min-h-[50vh] flex items-center overflow-hidden border-b border-slate-100 bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=2000" 
            alt="Compliance Office" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent z-10" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <p className="text-brand-teal font-black uppercase tracking-[0.4em] text-xs mb-6">Compliance & Governance</p>
          <h1 className="text-5xl lg:text-8xl font-bold text-white mb-8 font-serif tracking-tighter leading-none">
            {cmsContent?.title || 'Policy & Procedures'}
          </h1>
          <p className="text-2xl text-slate-300 max-w-3xl font-serif leading-relaxed italic border-l-4 border-brand-teal pl-8">
            "{cmsContent?.description || 'We are committed to transparency and the highest standards of governance. Our operational framework ensures quality and safety for all learners.'}"
          </p>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {policies.map((policy) => {
            const Icon = policy.icon;
            return (
              <Link 
                key={policy.id} 
                to={`/policy/${policy.id}`}
                className="group p-10 bg-white rounded-lg border border-slate-100 hover:shadow-2xl transition-all flex flex-col justify-between min-h-[380px] shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand-teal/[0.03] rounded-full translate-x-8 -translate-y-8 group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10">
                  <div className={`w-14 h-14 bg-slate-50 rounded-lg flex items-center justify-center ${policy.color} mb-10 border border-slate-100 shadow-sm group-hover:bg-brand-teal group-hover:text-white transition-all`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-6 font-serif tracking-tight">{policy.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    Review our standardized guidelines regarding {policy.title.toLowerCase()} to understand how we manage our operations and protect our community members.
                  </p>
                </div>
                
                <div className="mt-12 flex items-center gap-4 text-brand-teal font-black text-[10px] uppercase tracking-widest relative z-10">
                  Access Document 
                  <div className="w-8 h-[2px] bg-brand-teal/20 group-hover:w-16 group-hover:bg-brand-teal transition-all" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-10 font-serif tracking-tight text-brand-teal">Accreditation & Quality</h2>
              <p className="text-lg text-slate-300 leading-relaxed font-medium mb-10">
                Thames Solution Training & Consultancy Ltd is an accredited provider for leading vocational qualifications. Our policies are robustly reviewed annually to ensure they reflect the latest legislative changes.
              </p>
              <div className="flex border-t border-white/10 pt-8 mt-12 bg-white/5 p-4 rounded-lg">
                <div className="text-brand-teal text-[10px] font-black uppercase tracking-widest">
                  Last Updated: Jan 2024
                </div>
                <div className="mx-6 text-white/10">|</div>
                <div className="text-brand-teal text-[10px] font-black uppercase tracking-widest">
                  Next Review: Jan 2025
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 border border-brand-teal/20 p-12 rounded-lg backdrop-blur-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/10 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:bg-brand-teal/20 transition-all" />
              <h4 className="text-2xl font-bold mb-6 font-serif text-brand-teal">Compliance Inquiry</h4>
              <p className="text-slate-200 font-medium leading-relaxed mb-8 relative z-10">
                If you have specific questions regarding our operational policies or governance structure, please contact our teams for detailed clarification.
              </p>
              <Link to="/contact" className="relative z-10 inline-block bg-brand-teal text-white px-10 py-5 rounded-lg font-black uppercase tracking-[0.2em] text-[10px] hover:bg-brand-accent transition-all shadow-xl shadow-brand-teal/20">
                Contact Compliance
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
