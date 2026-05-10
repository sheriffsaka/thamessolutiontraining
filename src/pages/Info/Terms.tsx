import { motion } from 'motion/react';
import { Scale, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export function Terms() {
  return (
    <div className="bg-white min-h-screen pt-20">
      <section className="relative min-h-[50vh] flex items-center overflow-hidden border-b border-slate-100 bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2000" 
            alt="Professional Contracts" 
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
            <Scale size={36} />
          </motion.div>
          <h1 className="text-5xl lg:text-8xl font-bold mb-8 tracking-tighter font-serif text-white leading-none">Terms of<br />Service</h1>
          <p className="text-2xl text-slate-300 max-w-3xl font-serif leading-relaxed italic border-l-4 border-brand-teal pl-8">
            "Professional standards and operational agreements governing your relationship with Thames Solution Training & Consultancy Ltd."
          </p>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg p-12 lg:p-20 shadow-2xl border border-slate-100 space-y-20">
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900 font-serif">1. Acceptance of Terms</h2>
            <div className="text-slate-600 leading-relaxed text-lg">
              <p>
                By accessing this website and enrolling in any course provided by Thames Solution Training & Consultancy Ltd, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900 font-serif">2. Enrollment & Payments</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed text-lg">
              <p>
                Course enrollment is subject to availability and the fulfillment of any specified prerequisites.
              </p>
              <ul className="space-y-4">
                <li className="flex gap-4">
                  <CheckCircle2 className="text-brand-teal shrink-0 mt-1" size={20} />
                  <span>Fees must be paid in full at the time of enrollment unless a payment plan has been formally agreed upon.</span>
                </li>
                <li className="flex gap-4">
                  <CheckCircle2 className="text-brand-teal shrink-0 mt-1" size={20} />
                  <span>Cancellations made within 14 days of enrollment are eligible for a partial refund, subject to our refund policy.</span>
                </li>
                <li className="flex gap-4">
                  <CheckCircle2 className="text-brand-teal shrink-0 mt-1" size={20} />
                  <span>Access to course materials is granted for a specific duration, typically the length of the course plus a grace period.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900 font-serif">3. Academic Integrity</h2>
            <div className="space-y-6 text-slate-600 leading-relaxed text-lg text-slate-600">
              <p>
                As a provider of accredited vocational qualifications, we maintain high standards of academic integrity. Students are required to:
              </p>
              <ul className="list-disc pl-8 space-y-4">
                <li>Submit only their own work for assessment.</li>
                <li>Avoid any form of plagiarism or academic dishonesty.</li>
                <li>Maintain professional conduct in all interactions within the LMS and during physical sessions.</li>
              </ul>
              <div className="p-8 bg-amber-50 rounded-lg border border-amber-100 flex gap-6 items-start">
                <AlertCircle size={24} className="text-amber-500 shrink-0" />
                <div>
                   <h4 className="font-bold text-slate-900 mb-2">Notice of Conduct</h4>
                   <p className="text-sm text-slate-600">
                     Any breach of academic integrity may lead to immediate withdrawal from the course without refund and notification to relevant awarding bodies.
                   </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-slate-900 font-serif">4. Intellectual Property</h2>
            <div className="text-slate-600 leading-relaxed text-lg">
              <p>
                All course materials, including but not limited to videos, PDF guides, assessments, and proprietary curriculum, are the intellectual property of Thames Solution Training or its licensors. These materials are for your personal use only and may not be shared, reproduced, or distributed without written permission.
              </p>
            </div>
          </div>

          <div className="pt-12 border-t border-slate-100">
            <p className="text-slate-400 text-sm italic">
              Thames Solution Training & Consultancy Ltd. Registered in England & Wales.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
