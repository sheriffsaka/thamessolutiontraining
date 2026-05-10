import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock, Award, Shield, ArrowLeft, Mail, Phone, User, MessageSquare, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/src/lib/supabase';
import { getCourseById } from '@/src/services/courseService';

export function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  useEffect(() => {
    async function loadCourse() {
      if (!id) return;
      setLoading(true);
      const data = await getCourseById(id);
      if (data) {
        setCourse(data);
      }
      setLoading(false);
    }
    loadCourse();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const dob = formData.get('dob') as string;
    const gender = formData.get('gender') as string;
    const employmentStatus = formData.get('employmentStatus') as string;
    const address = formData.get('address') as string;
    const emergencyContact = formData.get('emergencyContact') as string;
    const notes = formData.get('notes') as string;

    try {
      // 1. Always create an application entry (lead generation)
      const applicationPayload = {
        course_id: String(course.id),
        course_title: course.title || '',
        full_name: fullName,
        email: email,
        phone: phone,
        date_of_birth: dob,
        gender: gender,
        employment_status: employmentStatus,
        address: address,
        emergency_contact: emergencyContact,
        notes: notes,
        status: 'pending'
      };

      console.log('Attempting to submit application:', applicationPayload);

      const { error: appError } = await (supabase
        .from('applications') as any)
        .insert([applicationPayload]);

      if (appError) {
        console.error('Database insertion error:', appError);
        const detail = appError.message || appError.details || JSON.stringify(appError);
        throw new Error(`Database error: ${detail} (Code: ${appError.code})`);
      }

      console.log('Application submitted successfully');

      // 2. If user is logged in, also create an actual enrollment
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      
      if (user && course) {
        // Try both student_id and user_id just in case of schema variations
        const enrollmentPayload = {
          student_id: user.id,
          course_id: course.id,
          progress: 0,
          status: 'active'
        };

        const { error: enrollError } = await (supabase
          .from('enrollments') as any)
          .insert([enrollmentPayload]);
          
        if (enrollError) {
          console.error('Enrollment creation failed (might be schema mismatch):', enrollError);
          
          // Fallback if student_id column is actually named user_id
          if (enrollError.message.includes('column "student_id" does not exist')) {
            await (supabase
              .from('enrollments') as any)
              .insert([{
                user_id: user.id,
                course_id: course.id,
                progress: 0,
                status: 'active'
              }]);
          }
        }
      }

      setFormStatus('success');
    } catch (error: any) {
      console.error('Application submission error:', error);
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = error.message || error.details || JSON.stringify(error);
      } else {
        errorMessage = String(error);
      }
      alert('Submission failed: ' + errorMessage);
      setFormStatus('idle'); 
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4 font-serif">Course Not Found</h2>
          <button onClick={() => navigate('/courses')} className="text-brand-teal font-bold hover:underline">
            Back to Course Catalog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pt-20 text-sharp">
      <section className="relative h-[600px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={course.image_url || course.image} 
            alt={course.title} 
            className="w-full h-full object-cover scale-105" 
          />
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-brand-teal/20" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-white">
          <motion.button 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-white hover:bg-white/20 transition-all mb-12 font-black text-[10px] uppercase tracking-[0.2em] bg-white/10 backdrop-blur-xl px-8 py-3 rounded-xl border border-white/30 shadow-2xl"
          >
            <ArrowLeft size={16} />
            Back to Catalog
          </motion.button>
          
          <div className="flex flex-wrap gap-4 mb-8">
            <span className="px-8 py-2.5 bg-brand-teal text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-teal/40 border border-white/20">
              {course.category?.replace(/-/g, ' ')}
            </span>
            {(course.sub_category || course.subCategory || course.level) && (
              <span className="px-8 py-2.5 bg-white/10 backdrop-blur-md text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl border border-white/20">
                {course.sub_category || course.subCategory || course.level}
              </span>
            )}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold max-w-5xl font-serif leading-[1.1] select-none tracking-tight text-white drop-shadow-2xl">
            {course.title}
          </h1>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-8 font-serif flex items-center gap-6">
                <div className="w-12 h-1 bg-brand-teal rounded-full" />
                Course Overview
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line font-medium">
                {course.long_description || course.longDesc || course.description || course.desc}
              </p>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-8 font-serif flex items-center gap-6">
                <div className="w-12 h-1 bg-brand-teal rounded-full" />
                Entry Requirements
              </h2>
              <ul className="space-y-5 px-6">
                {(course.requirements || [
                  'Aged 16 or above',
                  'Interest in the subject area',
                  'Basic understanding of English/Maths',
                  'A placement in a relevant working environment (for practical modules)'
                ]).map((req: string, i: number) => (
                  <li key={i} className="flex items-center gap-4 text-slate-600 font-bold text-sm">
                    <div className="w-2.5 h-2.5 rounded-full border-2 border-brand-teal bg-white" />
                    {req}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-8 font-serif flex items-center gap-6">
                <div className="w-12 h-1 bg-brand-teal rounded-full" />
                Assessment Method
              </h2>
              <p className="text-slate-600 text-lg leading-relaxed font-medium bg-white p-10 rounded-xl border border-slate-100 shadow-xl">
                Assessment for this qualification is via a portfolio of evidence. Your tutor will guide you through building a professional portfolio that demonstrates your competence and knowledge in <strong>{course.title}</strong>. This may include observations, witness testimonies, and professional discussions.
              </p>
            </motion.div>

            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-8 font-serif flex items-center gap-6">
                <div className="w-12 h-1 bg-brand-teal rounded-full" />
                Application Process
              </h2>
              <div className="bg-slate-900 text-white p-12 rounded-xl relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-teal/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <p className="text-slate-300 text-lg leading-relaxed mb-10 font-medium">
                    Applying to study with TMS is simple. To start your journey:
                  </p>
                  <ol className="space-y-6 mb-12">
                    <li className="flex gap-5 items-start font-bold">
                      <div className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center shrink-0 text-sm">1</div>
                      <p>Click the <span className="text-brand-teal uppercase tracking-widest text-xs">Enroll Now</span> button on this page to open the application window.</p>
                    </li>
                    <li className="flex gap-5 items-start font-bold">
                      <div className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center shrink-0 text-sm">2</div>
                      <p>Fill in your contact details and any specific questions you have.</p>
                    </li>
                    <li className="flex gap-5 items-start font-bold">
                      <div className="w-8 h-8 rounded-full bg-brand-teal text-white flex items-center justify-center shrink-0 text-sm">3</div>
                      <p>Our admissions team will contact you to discuss your eligibility and guide you through the next steps.</p>
                    </li>
                  </ol>
                  <button 
                    onClick={() => setIsApplying(true)}
                    className="w-full bg-brand-teal text-white py-5 rounded-lg font-black uppercase tracking-[0.2em] text-[11px] hover:bg-brand-accent transition-all shadow-2xl shadow-brand-teal/20"
                  >
                    Start Your Application Now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar / CTA */}
          <aside className="space-y-8">
            <div className="sticky top-32 bg-white border border-slate-100 rounded-xl p-12 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-teal/10 transition-all" />
              
              <div className="relative z-10 text-center">
                <div className="mb-12">
                  <div className="flex justify-center mb-8">
                    <div className="w-24 h-24 bg-slate-50 border border-slate-100 rounded-[2rem] flex items-center justify-center text-brand-teal shadow-inner">
                      <Clock size={40} />
                    </div>
                  </div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-3 text-center">Duration</h3>
                  <p className="text-4xl font-bold text-slate-900 font-serif">{course.duration}</p>
                </div>

                <div className="space-y-6">
                  <button 
                    onClick={() => setIsApplying(true)}
                    className="w-full bg-brand-teal text-white py-5 rounded-2xl font-bold text-lg hover:bg-brand-accent transition-all shadow-xl shadow-brand-teal/20"
                  >
                    Enroll Now
                  </button>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] pt-8 border-t border-slate-50">
                    Limited Seats Available
                  </p>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {isApplying && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsApplying(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-lg"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-3xl border border-slate-100 scrollbar-hide"
            >
              {formStatus === 'success' ? (
                <div className="p-12 lg:p-20 text-center">
                  <div className="w-24 h-24 bg-brand-teal/10 text-brand-teal rounded-full flex items-center justify-center mx-auto mb-10 border border-brand-teal/20">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-6 font-serif">Application Received!</h2>
                  <p className="text-slate-600 mb-10 text-lg leading-relaxed font-medium">
                    Thank you for applying for the <strong>{course.title}</strong>. Our admissions team will review your application and contact you within 48 hours.
                  </p>
                  <button 
                    onClick={() => setIsApplying(false)}
                    className="w-full bg-brand-teal text-white py-5 rounded-2xl font-bold text-lg hover:bg-brand-accent transition-all"
                  >
                    Back to Course
                  </button>
                </div>
              ) : (
                <div className="p-8 lg:p-10">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 font-serif mb-1">Apply for Course</h2>
                    <p className="text-brand-teal font-black text-[9px] uppercase tracking-widest">Submit your details to get started</p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <div className="relative">
                        <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          required
                          name="fullName"
                          type="text"
                          placeholder="Your Full Name"
                          className="w-full pl-14 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-brand-teal outline-none text-slate-900 transition-all placeholder:text-slate-400 font-medium text-sm"
                        />
                      </div>
                      <div className="relative">
                        <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          required
                          name="email"
                          type="email"
                          placeholder="Email Address"
                          className="w-full pl-14 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-brand-teal outline-none text-slate-900 transition-all placeholder:text-slate-400 font-medium text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <input
                            required
                            name="dob"
                            type="date"
                            placeholder="Date of Birth"
                            className="w-full pl-14 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-brand-teal outline-none text-slate-900 transition-all placeholder:text-slate-400 font-medium text-sm"
                          />
                        </div>
                        <div className="relative">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                          <select
                            required
                            name="gender"
                            className="w-full pl-14 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-brand-teal outline-none text-slate-900 transition-all placeholder:text-slate-400 font-medium text-sm appearance-none"
                          >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                          </select>
                        </div>
                      </div>
                      <div className="relative">
                        <Shield className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select
                          required
                          name="employmentStatus"
                          className="w-full pl-14 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-brand-teal outline-none text-slate-900 transition-all placeholder:text-slate-400 font-medium text-sm appearance-none"
                        >
                          <option value="">Employment Status</option>
                          <option value="employed">Employed</option>
                          <option value="unemployed">Unemployed</option>
                          <option value="student">Student</option>
                          <option value="retired">Retired</option>
                        </select>
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          required
                          name="phone"
                          type="tel"
                          placeholder="Phone Number"
                          className="w-full pl-14 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-brand-teal outline-none text-slate-900 transition-all placeholder:text-slate-400 font-medium text-sm"
                        />
                      </div>
                      <div className="relative">
                        <Shield className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                          required
                          name="emergencyContact"
                          type="text"
                          placeholder="Emergency Contact (Name & Phone)"
                          className="w-full pl-14 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-brand-teal outline-none text-slate-900 transition-all placeholder:text-slate-400 font-medium text-sm"
                        />
                      </div>
                      <div className="relative">
                        <MapPin className="absolute left-5 top-5 text-slate-400" size={16} />
                        <textarea
                          required
                          name="address"
                          placeholder="Home Address"
                          rows={2}
                          className="w-full pl-14 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-brand-teal outline-none text-slate-900 transition-all placeholder:text-slate-400 resize-none font-medium text-sm"
                        />
                      </div>
                      <div className="relative">
                        <MessageSquare className="absolute left-5 top-5 text-slate-400" size={16} />
                        <textarea
                          name="notes"
                          placeholder="Any specific questions or goals?"
                          rows={3}
                          className="w-full pl-14 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-xl focus:border-brand-teal outline-none text-slate-900 transition-all placeholder:text-slate-400 resize-none font-medium text-sm"
                        />
                      </div>
                    </div>

                    <button
                      disabled={formStatus === 'submitting'}
                      className="w-full bg-brand-teal text-white py-4 rounded-xl font-bold text-base hover:bg-brand-accent transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-brand-teal/20"
                    >
                      {formStatus === 'submitting' ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : 'Submit Application'}
                    </button>
                    
                    <p className="text-[10px] text-center text-slate-400 font-black uppercase tracking-[0.2em]">
                      Secure Application • Privacy Guaranteed
                    </p>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
