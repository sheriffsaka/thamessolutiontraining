import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShieldCheck, Calendar, User, FileText, Download, Printer, Share2 } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

const POLICY_DATA: Record<string, any> = {
  privacy: {
    title: 'Privacy Policy',
    lastUpdated: 'May 2024',
    content: `
      ## 1. Introduction
      Thames Solution Training & Consultancy Ltd ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.

      ## 2. Information Collection
      We collect information that you provide directly to us when you:
      - Register for a course
      - Sign up for our newsletter
      - Contact us via email or phone
      - Use our Learning Management System (LMS)

      ## 3. How We Use Your Information
      We use the personal information we collect to:
      - Process your course registrations
      - Provide learner support and feedback
      - Send administrative information, such as updates on certificates
      - Comply with regulatory requirements from awarding bodies and government agencies

      ## 4. Data Sharing
      We may share your data with:
      - Accrediting awarding bodies (to process your qualifications)
      - Government departments where required by law (e.g., Department for Education)
      - Third-party service providers that perform services for us

      ## 5. Your Rights
      Under the GDPR, you have the right to access, rectify, or erase your personal data. You also have the right to object to the processing of your data in certain circumstances.
    `
  },
  terms: {
    title: 'Terms of Service',
    lastUpdated: 'May 2024',
    content: `
      ## 1. Enrollment
      By enrolling in a course with Thames Solution, you agree to abide by these terms and conditions.

      ## 2. Fees and Payments
      Tuition fees must be paid according to the agreed schedule. Failure to pay may result in a delay in processing certificates or exclusion from the course.

      ## 3. Cancellations and Refunds
      Cancellations made within 14 days of enrollment are eligible for a full refund, provided the course has not commenced.

      ## 4. Intellectual Property
      All training materials provided are the property of Thames Solution or its partners and are for individual use only. Redistribution is strictly prohibited.
    `
  },
  gdpr: {
    title: 'Data Protection (GDPR)',
    lastUpdated: 'May 2024',
    content: `
      ## Our Commitment
      TMS Training & Consultancy is a registered data controller. We adhere to the seven principles of GDPR:
      1. Lawfulness, fairness and transparency
      2. Purpose limitation
      3. Data minimisation
      4. Accuracy
      5. Storage limitation
      6. Integrity and confidentiality
      7. Accountability

      ## Subject Access Requests
      You can make a Subject Access Request (SAR) at any time to see what data we hold about you. We will respond within 30 days.
    `
  }
};

export function PolicyDetail() {
  const { id } = useParams<{ id: string }>();
  const [cmsContent, setCmsContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      if (!id) return;
      const contentId = `p_${id}`;
      const { data } = await (supabase.from('site_contents').select('*').eq('id', contentId).single() as any);
      if (data) {
        setCmsContent(data.content);
      }
      setLoading(false);
    }
    fetchContent();
  }, [id]);

  const defaultPolicy = POLICY_DATA[id || ''] || {
    title: id?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || 'Policy',
    lastUpdated: 'May 2024',
    content: 'The official documentation for this procedure is currently undergoing revision. Please contact our compliance office for the latest authorized version.'
  };

  if (!id) return <Navigate to="/policy" />;

  const displayTitle = cmsContent?.title || defaultPolicy.title;
  const displayContent = cmsContent?.content || defaultPolicy.content;

  const policyImages: Record<string, { url: string; alt: string; tagline: string; quote: string }> = {
    privacy: {
      url: "https://images.unsplash.com/photo-1563986768609-322da13575f3",
      alt: "Data Privacy",
      tagline: "Confidentiality & Security",
      quote: "Protecting your information with transparency and integrity."
    },
    terms: {
      url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85",
      alt: "Terms of Service",
      tagline: "Agreement & Compliance",
      quote: "Standardized guidelines for our professional partnership."
    },
    cookies: {
      url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b",
      alt: "Cookie Policy",
      tagline: "Digital Optimization",
      quote: "Enhancing your experience through intelligent browsing."
    },
    gdpr: {
      url: "https://images.unsplash.com/photo-1563986768609-322da13575f3",
      alt: "Data Protection",
      tagline: "Regulatory Compliance",
      quote: "Commitment to the highest standards of data governance."
    },
    conduct: {
      url: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d",
      alt: "Code of Conduct",
      tagline: "Ethics & Integrity",
      quote: "Establishing a respectful and professional learning environment."
    },
    whistleblowing: {
      url: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85",
      alt: "Whistleblowing",
      tagline: "Accountability & Voice",
      quote: "Ensuring integrity through transparent reporting channels."
    },
  };

  const currentPolicyImage = id ? policyImages[id] : null;

  return (
    <div className="bg-white min-h-screen pt-20">
      <section className="relative min-h-[50vh] flex items-center overflow-hidden border-b border-slate-100 bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${currentPolicyImage?.url || "https://images.unsplash.com/photo-1497366811353-6870744d04b2"}?auto=format&fit=crop&q=80&w=2000`} 
            alt={currentPolicyImage?.alt || "Policy Header"} 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent z-10" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <p className="text-brand-teal font-black uppercase tracking-[0.4em] text-xs mb-6">
            {currentPolicyImage?.tagline || 'Governance & Compliance'}
          </p>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl lg:text-8xl font-bold text-white mb-8 font-serif tracking-tighter leading-none"
          >
            {displayTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-slate-300 max-w-3xl font-serif leading-relaxed italic border-l-4 border-brand-teal pl-8"
          >
            "{currentPolicyImage?.quote || 'We are committed to maintaining the highest standards of professional conduct and operational transparency.'}"
          </motion.p>
        </div>
      </section>
      
      {loading ? (
        <div className="py-32 flex justify-center">
          <div className="w-10 h-10 border-4 border-brand-teal border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-headings:tracking-tight prose-p:text-slate-600 prose-p:font-medium prose-p:leading-relaxed prose-strong:text-slate-900">
            <div className="whitespace-pre-line">
              {displayContent}
            </div>
          </div>
          
          <div className="mt-24 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-400 text-sm font-medium italic">
              This document is the property of Thames Solution Training & Consultancy Ltd.
            </p>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 text-slate-400 hover:text-brand-teal transition-colors text-xs font-black uppercase tracking-widest">
                <Printer size={16} />
                Print
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-brand-teal transition-colors text-xs font-black uppercase tracking-widest">
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
