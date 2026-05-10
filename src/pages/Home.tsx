import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { cn } from '@/src/lib/utils';
import { getFAQs, getSiteContent } from '@/src/services/contentService';
import { getCategoryData } from '@/src/services/courseService';

export function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [dynamicCategories, setDynamicCategories] = useState<any[]>([]);
  const [slides, setSlides] = useState<any[]>([
    {
      title: "Health and social care",
      subtitle: "Professional Excellence",
      desc: "Empowering healthcare professionals with accredited Level 2 to Level 5 diplomas and specialized childcare qualifications.",
      video: "https://res.cloudinary.com/di7okmjsx/video/upload/v1777705199/health-socialworker1_kfe1oe.mp4",
      link: "/courses?category=health-and-social-care"
    },
    {
      title: "Assessor courses",
      subtitle: "Vocational Mastery",
      desc: "Achieve the gold standard in vocational assessment with our RQF Level 3 Award and Certificate programs.",
      video: "https://res.cloudinary.com/di7okmjsx/video/upload/v1777509647/the-trainer-in-the-gray-blazer-speaks-and-gestures_oir7sf.mp4",
      link: "/courses?category=assessor"
    },
    {
      title: "Functional skills",
      subtitle: "Essential Foundations",
      desc: "Future-proof your career with Level 2 English and Maths qualifications essential for professional growth.",
      video: "https://res.cloudinary.com/di7okmjsx/video/upload/v1777656036/FunctionalTraining_exmzfz.mp4",
      link: "/courses?category=functional-skills"
    },
    {
      title: "Mandatory training",
      subtitle: "Compliance Excellence",
      desc: "Ensure 100% workplace compliance with essential training in First Aid, Safeguarding, Mental Capacity, and more.",
      video: "https://res.cloudinary.com/di7okmjsx/video/upload/v1777664670/care_cert_ules5v.mp4",
      link: "/courses?category=mandatory"
    },
    {
      title: "Care certificate",
      subtitle: "Foundation Standards",
      desc: "Master the 15 fundamental standards of care required for all health and social care professionals in the UK.",
      video: "https://res.cloudinary.com/di7okmjsx/video/upload/v1777664670/care_cert_ules5v.mp4",
      link: "/courses?category=care-certificate"
    }
  ]);

  useEffect(() => {
    async function loadContent() {
      const [faqData, heroContent, catData] = await Promise.all([
        getFAQs(),
        getSiteContent('home'),
        getCategoryData()
      ]);

      if (catData && catData.length > 0) {
        setDynamicCategories(catData);
      } else {
        setDynamicCategories([]);
      }

      if (faqData && faqData.length > 0) {
        setFaqs(faqData);
      } else {
        setFaqs([
          { question: 'How do I enroll in a course?', answer: 'To enroll, simply browse our courses, click "View Details", and fill out the "Apply Now" form.' },
          { question: 'Are the certificates recognized?', answer: 'Yes, all our courses are accredited by leading UK awarding bodies.' },
        ]);
      }

      const heroHero = heroContent.find(c => c.id === 'home_hero');
      // Only set slides from database if they have been updated to the new 5-category structure
      // or if they don't look like the stale "Healthcare Excellence" defaults.
      if (heroHero?.content?.slides && heroHero.content.slides.length === 5) {
        setSlides(heroHero.content.slides);
      } else {
        // We keep the hardcoded slides if the database is stale or empty
        console.log('Using hardcoded category slides as database content is stale or empty');
      }
    }
    loadContent();
  }, []);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides || slides.length === 0) return null;
  const slide = slides[currentSlide] || slides[0];

  return (
    <div className="overflow-hidden bg-slate-50 text-sharp">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center pt-20 overflow-hidden border-b border-slate-100 bg-white">
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.video
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5 }}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={slide.video} type="video/mp4" />
            </motion.video>
          </AnimatePresence>
          {/* Subtle gradient at the bottom for readability of stats/indicators */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/40 to-transparent z-10" />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-xl"
            >
              <div className="w-20 h-1.5 bg-brand-teal mb-10" />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xs font-black text-brand-teal uppercase tracking-[0.5em] mb-6 drop-shadow-sm"
              >
                {slide.subtitle}
              </motion.div>
              <h1 className="text-6xl md:text-8xl font-bold leading-[1.05] mb-10 text-slate-900 tracking-tighter drop-shadow-sm">
                {slide.title.split(' ')[0]} <br/>
                <span className="text-brand-accent italic font-serif">
                  {slide.title.split(' ').slice(1).join(' ')}
                </span>
              </h1>
              <p className="text-xl text-slate-700 mb-12 leading-relaxed font-medium drop-shadow-sm bg-white/10 backdrop-blur-[2px] p-4 -ml-4 rounded-xl">
                {slide.desc}
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  to={slide.link}
                  className="bg-brand-teal text-white px-12 py-5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-brand-accent transition-all flex items-center justify-center gap-3 group shadow-2xl shadow-brand-teal/30"
                >
                  View Category
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="bg-white/80 backdrop-blur-md border border-slate-200 text-slate-900 px-12 py-5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white transition-all text-center shadow-lg"
                >
                  Book Consultation
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section with light cards */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-xs font-black text-brand-teal uppercase tracking-[0.4em] mb-4">Core Competencies</h2>
              <h3 className="text-5xl font-bold text-slate-900 tracking-tighter font-serif">Elite Training Categories</h3>
            </div>
            <p className="text-slate-500 text-lg max-w-md font-medium leading-relaxed">
              We specialize in providing industry-standard training across key sectors driving the modern economy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {dynamicCategories.map((cat, i) => (
              <motion.div
                key={cat.id || i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="group relative overflow-hidden rounded-xl aspect-[10/14] shadow-2xl border border-white"
              >
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 p-12 w-full">
                  <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tighter font-serif">{cat.title}</h3>
                  <p className="text-slate-600 text-sm mb-8 leading-relaxed font-medium">
                    {cat.desc}
                  </p>
                  <Link
                    to={`/courses?category=${cat.id}`}
                    className="inline-flex items-center gap-3 text-brand-teal font-black text-[11px] uppercase tracking-widest group/btn"
                  >
                    View Modules
                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="relative rounded-xl overflow-hidden aspect-square shadow-2xl border border-slate-100">
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=800" 
                  alt="Students learning" 
                  className="w-full h-full object-cover grayscale opacity-80"
                />
                <div className="absolute inset-0 bg-brand-teal/5 mix-blend-overlay" />
              </div>
              {/* Floating Stat Card */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="absolute -bottom-10 -right-10 bg-white p-10 rounded-lg border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-20 max-w-[300px]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-brand-teal/10 rounded-xl flex items-center justify-center text-brand-teal">
                    <CheckCircle2 size={24} />
                  </div>
                  <div className="font-black text-2xl text-slate-900 tracking-tighter">100%</div>
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                  Compliance and quality assurance guaranteed across all programs.
                </div>
              </motion.div>
            </div>

            <div className="space-y-12">
              <div>
                <h2 className="text-xs font-black text-brand-teal uppercase tracking-[0.4em] mb-4">The TMS Advantage</h2>
                <h3 className="text-5xl font-bold text-slate-900 tracking-tighter mb-8 font-serif leading-tight">
                  Why Leading Institutions <br/>
                  <span className="italic text-brand-teal">Choose TMS</span>
                </h3>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">
                  At Thames Solution Training, we don't just provide courses; we forge pathways to professional mastery through rigorous standards and innovative pedagogy.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8">
                {[
                  { title: 'Industry Expert Tutors', desc: 'Our instructors bring years of frontline experience in London\'s premier healthcare and business institutions.' },
                  { title: 'Fully Accredited Modules', desc: 'All certifications are recognized by official UK awarding bodies, ensuring portable professional value.' },
                  { title: 'Strategic LMS Platform', desc: 'Access your learning 24/7 with our state-of-the-art Learning Management System designed for modern learners.' }
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6 group"
                  >
                    <div className="w-6 h-6 rounded-full border-2 border-brand-teal bg-white flex items-center justify-center shrink-0 mt-1 transition-colors group-hover:bg-brand-teal">
                      <div className="w-2 h-2 bg-brand-teal rounded-full group-hover:bg-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 mb-2 tracking-tight font-serif">{item.title}</h4>
                      <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with light cards */}
      <section className="py-32 bg-slate-50 relative overflow-hidden border-y border-slate-100">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-teal/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-xs font-black text-brand-teal uppercase tracking-[0.4em] mb-4">Support & Info</h2>
            <h3 className="text-5xl font-bold text-slate-900 tracking-tighter font-serif">Frequently Asked Questions</h3>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {faqs.slice(0, 3).map((faq, i) => (
              <motion.div
                key={faq.id || i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="bg-white rounded-xl p-10 border border-slate-100 hover:border-brand-teal/30 transition-all group overflow-hidden relative shadow-xl"
               >
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-teal scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                <h4 className="text-xl font-bold text-slate-900 mb-4 flex gap-4 font-serif leading-tight">
                  <span className="text-brand-teal">Q.</span> {faq.question}
                </h4>
                <p className="text-slate-500 leading-relaxed pl-10 font-medium">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link 
              to="/faqs"
              className="inline-flex items-center gap-4 text-brand-teal font-black text-xs uppercase tracking-[0.3em] hover:text-brand-accent transition-all group"
            >
              View All Frequently Asked Questions
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
       <section className="py-32 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-xl bg-slate-900 p-12 lg:p-24 overflow-hidden text-center shadow-2xl group">
            {/* Decoration */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-teal/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-teal/20 transition-all duration-1000" />
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-xs font-black text-brand-teal uppercase tracking-[0.4em] mb-8">Ready to Advance?</h2>
              <h3 className="text-5xl lg:text-7xl font-bold text-white mb-10 tracking-tighter leading-[1.1] font-serif">
                Forge Your <span className="italic text-brand-teal">Future</span> 
              </h3>
              <p className="text-xl text-slate-400 mb-14 leading-relaxed font-medium">
                Join thousands of students who have advanced their careers through our practical and accredited training programs.
              </p>
              <Link
                to="/courses"
                className="inline-flex items-center gap-4 bg-brand-teal text-white hover:bg-brand-accent px-16 py-6 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-brand-teal/20 border border-transparent"
              >
                Browse All Courses
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
