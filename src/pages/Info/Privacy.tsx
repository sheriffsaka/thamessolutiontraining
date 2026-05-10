import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export function Privacy() {
  return (
    <div className="bg-white min-h-screen pt-20">
      <section className="relative min-h-[50vh] flex items-center overflow-hidden border-b border-slate-100 bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=2000" 
            alt="Data Privacy" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent z-10" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-20 h-20 bg-brand-teal/10 text-brand-teal rounded-lg flex items-center justify-center mb-10 border border-brand-teal/20 backdrop-blur-sm"
          >
            < Shield size={36} />
          </motion.div>
          <h1 className="text-5xl lg:text-8xl font-bold mb-8 tracking-tighter font-serif text-white leading-none">Privacy<br />Policy</h1>
          <p className="text-2xl text-slate-300 max-w-3xl font-serif leading-relaxed italic border-l-4 border-brand-teal pl-8">
            "Your trust is our most significant asset. Learn how Thames Solution protects and manages your personal data within our professional infrastructure."
          </p>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg p-12 lg:p-20 shadow-2xl border border-slate-100 space-y-20">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900 font-serif">1. Information We Collect</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
              <p>
                We collect personal information that you voluntarily provide to us when you register for a course, sign up for our newsletter, or contact us through our website.
              </p>
              <ul className="list-disc pl-8 space-y-4">
                <li><strong>Personal Data:</strong> Name, email address, phone number, and mailing address.</li>
                <li><strong>Academic Data:</strong> Educational background, certifications, and professional experience.</li>
                <li><strong>Payment Data:</strong> Billing information for course enrollments.</li>
                <li><strong>Technical Data:</strong> IP address, browser type, and usage patterns.</li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900 font-serif">2. How We Use Your Information</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
              <p>
                We use the information we collect to provide, maintain, and improve our training services. This includes:
              </p>
              <ul className="list-disc pl-8 space-y-4">
                <li>Processing your course enrollment and certification.</li>
                <li>Communicating with you regarding your studies.</li>
                <li>Ensuring compliance with UK educational regulations and awarding body requirements.</li>
                <li>Sending you updates and marketing communications (with your consent).</li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900 font-serif">3. Data Sharing & Security</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
              <p>
                Thames Solution does not sell your personal data to third parties. We only share information with:
              </p>
              <ul className="list-disc pl-8 space-y-4">
                <li><strong>Awarding Bodies:</strong> To process your certifications and credits.</li>
                <li><strong>Regulatory Authorities:</strong> To comply with legal obligations and educational standards.</li>
                <li><strong>Service Providers:</strong> Partners who help us deliver our LMS and communication services.</li>
              </ul>
              <div className="p-8 bg-brand-teal/5 rounded-lg border border-brand-teal/10 mt-8">
                <p className="text-slate-800 font-bold mb-4 flex items-center gap-3">
                  <Lock size={20} className="text-brand-teal" />
                  Security Commitment
                </p>
                <p className="text-sm">
                  We use industry-standard encryption and security protocols to protect your data from unauthorized access, disclosure, or misuse.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-100">
            <p className="text-slate-400 text-sm italic">
              Last Updated: April 29, 2026. For any privacy-related inquiries, please contact our Data Protection Officer at admin@thamessolutiontraining.co.uk
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
