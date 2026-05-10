import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, MessageCircle, HelpCircle, Search } from 'lucide-react';
import { getFAQs } from '@/src/services/contentService';
import { cn } from '@/src/lib/utils';

export function FAQ() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<number | null>(null);

  useEffect(() => {
    async function loadFaqs() {
      const data = await getFAQs();
      if (data) {
        setFaqs(data);
      } else {
        setFaqs([
          { question: 'How do I enroll in a course?', answer: 'To enroll, simply browse our courses, click "View Details", and fill out the "Apply Now" form. Our admissions team will review your application and contact you with next steps.' },
          { question: 'Are the certificates recognized?', answer: 'Yes, all our courses are accredited by leading UK awarding bodies including CPD UK, TQUK, NCFE, and Cache.' },
          { question: 'What are the entry requirements?', answer: 'Requirements vary by course. Generally, for Level 2 and 3 courses, a basic level of English and Maths is required. Detailed requirements are listed on each course page.' },
          { question: 'Can I study while working?', answer: 'Absolutely! Our courses are designed for flexibility. Most students balance their studies with full-time employment using our online LMS platform.' },
          { question: 'How long does each course take?', answer: 'The duration depends on the specific course and your pace. Typically, Level 2 certificates take 3-6 months, while Level 5 diplomas can take up to 12-18 months.' },
          { question: 'Is there financial support available?', answer: 'We offer various payment plans to make education accessible. Please contact our finance office for specific details on bursaries or employer-sponsored options.' }
        ]);
      }
      setLoading(false);
    }
    loadFaqs();
  }, []);

  const filteredFaqs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-24 relative overflow-hidden bg-slate-50 border-b border-slate-100">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-teal/[0.03] -skew-x-12 translate-x-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="text-brand-teal font-black uppercase tracking-[0.4em] text-xs mb-6">Assistance & Support</p>
            <h1 className="text-5xl lg:text-8xl font-bold tracking-tighter font-serif text-slate-900 leading-none mb-10">FAQs</h1>
            <p className="text-2xl text-slate-600 font-serif leading-relaxed italic mb-12">
              "Finding answers should be effortless. We've compiled the most common questions to help you navigate your journey with TMS."
            </p>

            <div className="relative max-w-xl">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search for answers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-16 pr-8 py-5 bg-white border border-slate-200 rounded-2xl outline-none focus:border-brand-teal text-slate-900 font-bold transition-all shadow-xl shadow-slate-200/50"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-brand-teal border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredFaqs.length > 0 ? (
            <div className="space-y-6">
              {filteredFaqs.map((faq, idx) => (
                <div 
                  key={idx}
                   className={cn(
                     "bg-white border transition-all duration-500 rounded-3xl overflow-hidden",
                     openId === idx ? "border-brand-teal shadow-2xl p-2" : "border-slate-100 hover:border-slate-200"
                   )}
                >
                  <button 
                    onClick={() => setOpenId(openId === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-8 text-left"
                  >
                    <div className="flex gap-6 items-center">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-all",
                        openId === idx ? "bg-brand-teal text-white" : "bg-slate-50 text-slate-400"
                      )}>
                        {idx + 1}
                      </div>
                      <span className="text-xl font-bold text-slate-900 tracking-tight font-serif">{faq.question}</span>
                    </div>
                    <ChevronDown className={cn("text-slate-400 transition-transform duration-500 shrink-0", openId === idx && "rotate-180 text-brand-teal")} size={20} />
                  </button>
                  <AnimatePresence>
                    {openId === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                      >
                        <div className="px-24 pb-12">
                          <div className="w-8 h-1 bg-brand-teal/20 mb-6 rounded-full" />
                          <p className="text-slate-600 text-lg leading-relaxed font-serif font-medium">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-8 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <HelpCircle className="mx-auto text-slate-300 mb-6" size={48} />
              <p className="text-xl text-slate-500 font-serif italic">"We couldn't find an answer to that specific query. Please reach out to our team directly!"</p>
            </div>
          )}

          {/* Direct Support CTA */}
          <div className="mt-24 p-12 bg-slate-900 rounded-[3rem] text-center relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-teal/20 transition-all duration-1000" />
            <MessageCircle className="mx-auto text-brand-teal mb-8" size={48} />
            <h3 className="text-3xl font-bold text-white mb-4 tracking-tighter font-serif">Still have questions?</h3>
            <p className="text-slate-400 mb-10 max-w-md mx-auto font-medium">
              Our support team is available Monday through Friday to assist you with any inquiries.
            </p>
            <Link 
              to="/contact"
              className="inline-block bg-brand-teal text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-accent transition-all shadow-2xl shadow-brand-teal/20"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
