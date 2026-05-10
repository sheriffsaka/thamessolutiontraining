import { BookOpen, Clock, Calendar, ChevronRight, Award, MessageCircle, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { getEnrollments, getApplicationsByEmail } from '@/src/services/courseService';
import { getAnnouncements } from '@/src/services/contentService';
import { cn } from '@/src/lib/utils';

export function StudentDashboard() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadDashboardData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch profile
        const { data: profileData } = await (supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single() as any);
        
        setProfile(profileData);
        if (profileData && profileData.full_name) {
          setUsername(profileData.full_name.split(' ')[0]);
        }

        // Parallel fetch
        const [enrollData, announcementData, appData] = await Promise.all([
          getEnrollments(user.id),
          getAnnouncements(),
          getApplicationsByEmail(user.email || '')
        ]);
        
        setEnrollments(enrollData);
        setAnnouncements(announcementData || []);
        // Filter out onboarded applications since they are already in enrollments
        setApplications(appData.filter((a: any) => a.status !== 'onboarded'));
      }
      setLoading(false);
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-4xl font-bold text-slate-900 mb-2 font-serif tracking-tight">Welcome back{username ? `, ${username}` : ''}! 👋</h1>
        <p className="text-slate-500 font-medium">
          {enrollments.length > 0 
            ? `You have ${enrollments.length} active courses in your portfolio.`
            : `You have ${applications.length} pending applications.`
          }
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* Pending Applications */}
          {applications.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 font-serif">Your Applications</h2>
              </div>
              <div className="space-y-6">
                {applications.map((app) => (
                  <div key={app.id} className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-brand-teal/5 rounded-2xl flex items-center justify-center text-brand-teal">
                        <FileText size={28} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-slate-900 font-serif">{app.course_title}</h4>
                        <div className="flex items-center gap-4 text-xs text-slate-400 mt-1 font-bold uppercase tracking-widest">
                          <span>Applied: {new Date(app.created_at).toLocaleDateString()}</span>
                          <span className="text-slate-200">|</span>
                          <span className={cn(
                            "px-3 py-1 rounded-full",
                            app.status === 'approved' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                          )}>
                            {app.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Active Courses */}
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 font-serif">Continue Learning</h2>
              <button className="text-brand-teal font-black text-[10px] uppercase tracking-widest hover:bg-brand-teal/5 px-4 py-2 rounded-lg transition-all">View All Courses</button>
            </div>
            <div className="space-y-6">
              {enrollments.length > 0 ? (
                enrollments.map((enrollment) => {
                  const course = enrollment.courses;
                  return (
                    <div key={enrollment.id} className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 group hover:border-brand-teal/20 transition-all">
                      <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="w-2.5 h-2.5 rounded-full bg-brand-teal animate-pulse" />
                            <span className="text-[10px] font-black text-brand-teal uppercase tracking-[0.25em]">{enrollment.status === 'completed' ? 'Completed' : 'In Progress'}</span>
                          </div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-brand-teal transition-colors font-serif">{course.title}</h3>
                          <div className="flex items-center gap-6 text-sm text-slate-400 mb-8 font-medium">
                            <div className="flex items-center gap-2"><Clock size={16} /> Joined {new Date(enrollment.enrolled_at).toLocaleDateString()}</div>
                            <div className="flex items-center gap-2"><BookOpen size={16} /> {course.level || 'Professional'}</div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex justify-between text-sm font-bold text-slate-600 uppercase tracking-widest">
                              <span>Overall Progress</span>
                              <span>{enrollment.progress}%</span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${enrollment.progress}%` }}
                                transition={{ duration: 1.2, ease: "circOut" }}
                                className="h-full bg-brand-teal shadow-lg shadow-brand-teal/20"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col justify-end">
                          <button className="bg-brand-teal text-white px-10 py-5 rounded-2xl font-bold text-sm hover:bg-brand-accent transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-teal/20">
                            Resume Learning
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-100">
                   <p className="text-slate-500 font-medium">You haven't enrolled in any courses yet.</p>
                   <button className="mt-4 text-brand-teal font-bold" onClick={() => navigate('/courses')}>Browse Catalog</button>
                </div>
              )}
            </div>
          </section>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <button className="flex items-center gap-6 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group">
              <div className="w-14 h-14 bg-brand-teal/5 border border-brand-teal/10 rounded-2xl flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all shadow-inner">
                <MessageCircle size={28} />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 font-serif">Contact Instructor</div>
                <div className="text-xs text-slate-500 font-medium">Ask about your current module</div>
              </div>
            </button>
            <button className="flex items-center gap-6 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all group">
              <div className="w-14 h-14 bg-brand-teal/5 border border-brand-teal/10 rounded-2xl flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-all shadow-inner">
                <Calendar size={28} />
              </div>
              <div className="text-left">
                <div className="font-bold text-slate-900 font-serif">Events & Workshops</div>
                <div className="text-xs text-slate-500 font-medium">View upcoming live sessions</div>
              </div>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          {/* Profile Status */}
          <section className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100">
            <h3 className="text-xl font-bold text-slate-900 mb-8 font-serif border-b border-slate-50 pb-4">Account Status</h3>
            <div className="space-y-8">
              <div className="flex gap-5 group cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-100 shadow-sm">
                  <CheckCircle size={28} />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm leading-tight mb-1 font-serif">Identity Verified</div>
                  <p className="text-xs text-slate-500 font-medium">Email: {profile?.email}</p>
                </div>
              </div>
              <div className="flex gap-5 group cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-brand-teal/5 text-brand-teal flex items-center justify-center shrink-0 border border-brand-teal/10 shadow-sm">
                  <BookOpen size={28} />
                </div>
                <div>
                  <div className="font-bold text-slate-800 text-sm leading-tight mb-1 font-serif">Learning Access</div>
                  <p className="text-xs text-slate-500 font-medium">{profile?.is_approved ? 'Full access granted' : 'Pending onboarding'}</p>
                </div>
              </div>
            </div>
          </section>

          {/* Announcements */}
          <section className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-brand-teal/5 rounded-full blur-[50px] -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-teal/10 transition-all" />
            <h3 className="text-xl font-bold text-slate-900 mb-8 font-serif relative z-10 border-b border-slate-50 pb-4">Announcements</h3>
            <div className="space-y-8 relative z-10">
              {announcements.length > 0 ? announcements.map((item, idx) => (
                <div key={item.id} className={cn("space-y-3", idx > 0 && "pt-8 border-t border-slate-50")}>
                  <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.25em]">{item.category || 'System'}</div>
                  <div className="font-bold text-sm leading-relaxed text-slate-700 font-serif">{item.content}</div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>
              )) : (
                <p className="text-slate-400 text-sm font-medium">No new announcements at this time.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
