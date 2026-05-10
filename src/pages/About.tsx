import { Target, CheckCircle2, Eye, Heart, Star, Quote } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { getSiteContent } from '@/src/services/contentService';
import { supabase } from '@/src/lib/supabase';
import { Link } from 'react-router-dom';

export function About() {
  const [content, setContent] = useState<any>({
    title: "Empowering Careers Through \nExpert Training",
    description: "Thames Solution Training & Consultancy Ltd is a leading provider of professional training and vocational qualifications in London. We bridge the gap between ambition and employment.",
    mission: "To provide high-quality, accessible, and inclusive training that empowers individuals to achieve their full potential and secure meaningful employment. We are dedicated to excellence in education and consultancy."
  });
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const siteData = await getSiteContent('about');
      const aboutPage = siteData.find(item => item.id === 'about_page');
      if (aboutPage?.content) setContent(aboutPage.content);

      const { data: testData } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);

      if (testData) setTestimonials(testData);
    }
    loadData();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pt-20 text-sharp">
      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-center overflow-hidden border-b border-slate-100 bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000" 
            alt="Thames Solution Modern Office" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent z-10" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 text-left">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-black text-brand-teal uppercase tracking-[0.5em] mb-6"
            >
              Our Legacy & Mission
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-6xl font-bold mb-8 font-serif text-white tracking-tighter leading-none"
            >
              {content.title.split('\n')[0]} <br /> 
              <span className="text-brand-teal font-sans italic">{content.title.split('\n')[1] || ''}</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl text-slate-200 leading-relaxed font-serif italic max-w-2xl border-l-4 border-brand-teal pl-8 shadow-sm"
            >
              {content.description}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission, Vision & Values */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 font-serif mb-6">Built on Strong Foundations</h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto font-medium">Our purpose is clear, our goals are ambitious, and our values are non-negotiable.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Our Mission",
                desc: "To empower individuals through high-quality vocational education, fostering skills that drive excellence in the health and social care sectors and beyond.",
                icon: <Target className="text-brand-teal" size={32} />
              },
              {
                title: "Our Vision",
                desc: "To be the leading provider of innovative training solutions, recognized globally for producing competent professionals who transform their workplaces.",
                icon: <Eye className="text-brand-teal" size={32} />
              },
              {
                title: "Our Values",
                desc: "Integrity, Excellence, and Compassion form the bedrock of TMS. We believe in personalized learning that respects the dignity of every student and professional.",
                icon: <Heart className="text-brand-teal" size={32} />
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 p-10 rounded-xl border border-slate-200 hover:shadow-xl transition-all group"
              >
                <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4 font-serif">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed font-semibold italic">"{item.desc}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 text-slate-900">
            <h2 className="text-4xl font-bold font-serif">A Commitment to Quality</h2>
            <p className="text-lg text-slate-600 leading-relaxed font-medium">
              We specialize in delivering RQF qualifications that are not just certificates, but real markers of professional capability. Our approach is student-centric, ensuring that every learner has the support needed to succeed.
            </p>
            <div className="space-y-4">
              {[
                'Industry-Accredited Qualifications',
                'Personalized Learner Support',
                'Expert Industry Practitioners',
                'Modern Learning Environments'
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="text-brand-teal font-black" size={20} />
                  <span className="font-bold">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square bg-white rounded-xl border border-slate-100 flex items-center justify-center overflow-hidden shadow-2xl relative group">
               <img 
                 src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1000" 
                 alt="Collaboration and Quality" 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-60" />
            </div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="absolute -bottom-6 -right-6 p-8 bg-brand-teal rounded-xl text-white shadow-2xl max-w-xs backdrop-blur-md bg-brand-teal/90"
            >
               <p className="text-lg font-bold leading-tight">"Excellence is not an act, but a habit."</p>
               <p className="text-[10px] text-white/70 mt-3 font-black uppercase tracking-[0.2em]">— Our Founding Principle</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-40 bg-white relative overflow-hidden border-t border-slate-100">
          <div className="absolute top-0 right-0 p-20 opacity-[0.02] text-slate-900 pointer-events-none">
            <Quote size={400} />
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-24">
              <p className="text-brand-teal font-black uppercase tracking-[0.4em] text-xs mb-6">Testimonials</p>
              <h2 className="text-5xl md:text-6xl font-bold font-serif text-slate-900 mb-8 tracking-tighter">Success Stories</h2>
              <div className="h-1.5 w-24 bg-brand-teal mx-auto rounded-full" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((t, i) => (
                <motion.div 
                  key={t.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-slate-50 p-10 rounded-none border-l-8 border-brand-teal border-y border-r border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col"
                >
                  <div className="mb-8 flex gap-1">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-brand-teal text-brand-teal" />)}
                  </div>
                  <p className="text-lg font-serif italic text-slate-700 leading-relaxed mb-10 flex-1">
                    "{t.content}"
                  </p>
                  <div className="mt-auto pt-8 border-t border-slate-200/50">
                    <div className="font-bold text-lg text-slate-900 antialiased tracking-tight">{t.student_name}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-brand-teal mt-1">{t.course_name}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact CTA */}
      <section className="py-32 bg-sky-50/50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-8 font-serif">Ready to take the next step?</h2>
          <p className="text-slate-600 mb-10 text-lg font-medium">Join thousands of successful graduates who have transformed their careers with Thames Solution.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/courses" className="px-12 py-4 bg-brand-teal text-white rounded-lg font-bold hover:bg-brand-accent transition-all shadow-xl shadow-brand-teal/20">
              Browse Courses
            </Link>
            <Link to="/contact" className="px-12 py-4 bg-white border border-slate-200 text-slate-900 rounded-lg font-bold hover:bg-slate-50 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
