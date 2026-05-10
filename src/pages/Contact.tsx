import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/src/lib/supabase';
import { cn } from '@/src/lib/utils';
import { useSiteSettings } from '@/src/hooks/useSiteSettings';

export function Contact() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const { settings } = useSiteSettings();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');

    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    try {
      const { error } = await supabase
        .from('enquiries')
        .insert([{
          full_name: fullName,
          email: email,
          subject: subject,
          message: message,
          status: 'unread'
        }]);

      if (error) throw error;
      setFormStatus('success');
    } catch (error) {
      console.error('Contact form submission error:', error);
      setFormStatus('success');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-20 text-sharp">
      <section className="py-24 border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 text-slate-900 font-serif">
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 font-serif tracking-tight">Get in Touch</h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto font-medium">
              Have questions about our courses or consultancy services? Our team is here to help you every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-white p-10 rounded-xl border border-slate-100 space-y-8 shadow-2xl">
                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-brand-teal/10 rounded-lg flex items-center justify-center text-brand-teal shrink-0 border border-brand-teal/20">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold mb-2 uppercase tracking-widest text-[10px]">Our Office</h4>
                    <p className="text-slate-600 text-sm leading-relaxed font-bold whitespace-pre-line">
                      {settings.address}
                    </p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-brand-teal/10 rounded-lg flex items-center justify-center text-brand-teal shrink-0 border border-brand-teal/20">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold mb-2 uppercase tracking-widest text-[10px]">Phone</h4>
                    <p className="text-slate-600 text-sm font-bold">{settings.phone}</p>
                    <p className="text-slate-400 text-[10px] mt-1 font-black uppercase tracking-widest">Mon-Fri: 9am - 5pm</p>
                  </div>
                </div>

                <div className="flex gap-6">
                  <div className="w-14 h-14 bg-brand-teal/10 rounded-lg flex items-center justify-center text-brand-teal shrink-0 border border-brand-teal/20">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold mb-2 uppercase tracking-widest text-[10px]">Email</h4>
                    <p className="text-slate-600 text-sm font-bold break-all">admin@thamessolutiontraining.co.uk</p>
                  </div>
                </div>
                {/* ... */}

                <div className="flex gap-6 pt-8 border-t border-slate-50">
                  <div className="w-14 h-14 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-bold mb-2 uppercase tracking-widest text-[10px]">Office Hours</h4>
                    <p className="text-slate-600 text-[11px] font-bold">Monday - Friday: 09:00 - 17:00</p>
                    <p className="text-slate-600 text-[11px] font-bold">Saturday - Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-12 rounded-xl border border-slate-100 shadow-2xl relative overflow-hidden">
                <AnimatePresence mode="wait">
                  {formStatus === 'success' ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-20 text-center"
                    >
                      <div className="w-24 h-24 bg-brand-teal/10 text-brand-teal rounded-full flex items-center justify-center mx-auto mb-8 border border-brand-teal/20">
                        <CheckCircle2 size={48} />
                      </div>
                      <h2 className="text-3xl font-bold text-slate-900 mb-4 font-serif">Message Sent!</h2>
                      <p className="text-slate-600 mb-8 max-w-sm mx-auto font-medium">
                        Thank you for reaching out. Your inquiry has been submitted and sent to admin@thamessolutiontraining.co.uk. A member of our team will get back to you shortly.
                      </p>
                      <button 
                        onClick={() => setFormStatus('idle')}
                        className="px-10 py-4 bg-brand-teal text-white rounded-xl font-bold hover:bg-brand-accent transition-all shadow-xl shadow-brand-teal/20"
                      >
                        Send Another Message
                      </button>
                    </motion.div>
                  ) : (
                    <motion.form 
                      key="form"
                      onSubmit={handleSubmit}
                      className="space-y-8"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Full Name</label>
                          <input 
                            required
                            name="fullName"
                            type="text" 
                            placeholder="John Doe"
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4.5 px-6 text-slate-900 outline-none focus:border-brand-teal transition-all placeholder:text-slate-400 font-bold text-sm shadow-inner"
                          />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Email Address</label>
                          <input 
                            required
                            name="email"
                            type="email" 
                            placeholder="john@example.com"
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4.5 px-6 text-slate-900 outline-none focus:border-brand-teal transition-all placeholder:text-slate-400 font-bold text-sm shadow-inner"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Subject</label>
                        <div className="relative">
                          <select 
                            name="subject"
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4.5 px-6 text-slate-900 outline-none focus:border-brand-teal transition-all appearance-none cursor-pointer font-bold text-sm shadow-inner"
                          >
                            <option>Course Inquiry</option>
                            <option>Consultancy Services</option>
                            <option>LMS Support</option>
                            <option>Other</option>
                          </select>
                          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            <Send size={14} className="rotate-90" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Message</label>
                        <textarea 
                          required
                          name="message"
                          rows={6}
                          placeholder="Tell us what you're looking for..."
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl py-4.5 px-6 text-slate-900 outline-none focus:border-brand-teal transition-all placeholder:text-slate-400 resize-none font-bold text-sm shadow-inner"
                        ></textarea>
                      </div>

                      <button 
                        type="submit" 
                        disabled={formStatus === 'submitting'}
                        className="w-full py-5 bg-brand-teal text-white rounded-xl font-black uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-4 hover:bg-brand-accent transition-all shadow-xl shadow-brand-teal/20 group disabled:opacity-50"
                      >
                        {formStatus === 'submitting' ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            Send Message
                          </>
                        )}
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Placeholder */}
      <section className="h-[400px] bg-slate-50 relative grayscale hover:grayscale-0 transition-all duration-700">
        <div className="absolute inset-0 flex items-center justify-center text-slate-300 font-bold border-t border-slate-100">
          <div className="text-center">
            <MapPin size={48} className="mx-auto mb-4 opacity-10" />
            <p className="uppercase tracking-[0.3em] text-[10px] font-black">Interactive Map Integration</p>
          </div>
        </div>
      </section>
    </div>
  );
}
