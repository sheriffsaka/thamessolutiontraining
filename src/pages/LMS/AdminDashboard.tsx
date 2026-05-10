import { Users, BookOpen, Clock, CheckCircle, Search, Filter, ShieldCheck, Layout, FileText, Mail } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useState, useEffect } from 'react';
import { SiteContentCMS } from './Admin/SiteContentCMS';
import { ManageUsers } from './Admin/ManageUsers';
import { ManageApplications } from './Admin/ManageApplications';
import { ManageEnquiries } from './Admin/ManageEnquiries';
import { supabase } from '@/src/lib/supabase';

function RecentApplicationsList() {
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('applications')
        .select(`*`)
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setApps(data);
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) return <div className="p-12 flex justify-center"><Clock className="animate-spin text-slate-300" /></div>;
  if (apps.length === 0) return <div className="p-12 text-center text-slate-400 text-sm font-medium">No recent applications</div>;

  return (
    <div className="space-y-4">
      {apps.map((app) => (
        <div key={app.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-brand-teal border border-slate-100 shadow-sm">
            <Users size={20} />
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-900 text-sm">{app.full_name}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">{app.courses?.title || 'Unknown Course'}</div>
          </div>
          <div className={cn(
            "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
            app.status === 'approved' ? 'bg-emerald-50 text-emerald-600' : 
            app.status === 'rejected' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
          )}>
            {app.status}
          </div>
        </div>
      ))}
    </div>
  );
}

function RecentEnquiriesList() {
  const [enqs, setEnqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      if (data) setEnqs(data);
      setLoading(false);
    }
    fetch();
  }, []);

  if (loading) return <div className="p-12 flex justify-center"><Clock className="animate-spin text-slate-300" /></div>;
  if (enqs.length === 0) return <div className="p-12 text-center text-slate-400 text-sm font-medium">No recent enquiries</div>;

  return (
    <div className="space-y-4">
      {enqs.map((enq) => (
        <div key={enq.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 border border-slate-100 shadow-sm">
            <Mail size={20} />
          </div>
          <div className="flex-1">
            <div className="font-bold text-slate-900 text-sm truncate max-w-[150px]">{enq.subject}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">{enq.full_name}</div>
          </div>
          <div className="text-[10px] text-slate-400 font-bold">
            {new Date(enq.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
export function AdminDashboard({ activeTabOverride }: { activeTabOverride?: 'overview' | 'cms' | 'users' | 'applications' | 'enquiries' }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'cms' | 'users' | 'applications' | 'enquiries'>('overview');
  const [stats, setStats] = useState([
    { label: 'Total Users', value: '...', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
    { label: 'Courses', value: '...', icon: BookOpen, color: 'text-brand-teal', bg: 'bg-brand-teal/5', border: 'border-brand-teal/10' },
    { label: 'Pending Apps', value: '...', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
    { label: 'Enrollments', value: '...', icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  ]);

  useEffect(() => {
    if (activeTabOverride) {
      setActiveTab(activeTabOverride);
    } else {
      setActiveTab('overview');
    }
  }, [activeTabOverride]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          { count: usersCount },
          { count: coursesCount },
          { count: appsCount },
          { count: enrollCount }
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('courses').select('*', { count: 'exact', head: true }),
          supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('enrollments').select('*', { count: 'exact', head: true })
        ]);

        setStats([
          { label: 'Total Users', value: (usersCount || 0).toString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Courses', value: (coursesCount || 0).toString(), icon: BookOpen, color: 'text-brand-teal', bg: 'bg-brand-teal/5', border: 'border-brand-teal/10' },
          { label: 'Pending Apps', value: (appsCount || 0).toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          { label: 'Enrollments', value: (enrollCount || 0).toString(), icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        ]);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 font-serif tracking-tight">
            {activeTab === 'overview' ? 'Admin Hub' : 
             activeTab === 'cms' ? 'Site Content' : 
             activeTab === 'users' ? 'User Management' : 
             activeTab === 'applications' ? 'Applications' : 'Enquiries'}
          </h1>
          <p className="text-slate-500 font-medium">
            {activeTab === 'overview' ? 'System-wide overview and site content management.' : 'Manage and update your platform records efficiently.'}
          </p>
        </div>
      </header>

      {activeTab === 'overview' && (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} 
                onClick={() => stat.label === 'Pending Apps' && setActiveTab('applications')}
                className={cn(
                  "bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-2xl relative overflow-hidden group",
                  stat.label === 'Pending Apps' && "cursor-pointer hover:border-brand-teal"
                )}
              >
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border shadow-sm group-hover:scale-110 transition-transform", stat.bg, stat.border)}>
                  <stat.icon className={stat.color} size={28} />
                </div>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-xs font-black text-slate-400 mt-2 uppercase tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Recent Activity */}
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col min-h-[400px]">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-xl font-bold text-slate-900 font-serif">Recent Applications</h3>
                  <button onClick={() => setActiveTab('applications')} className="text-[10px] font-black text-brand-teal uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="flex-1 p-8">
                  <RecentApplicationsList />
                </div>
              </div>

              <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden flex flex-col min-h-[400px]">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="text-xl font-bold text-slate-900 font-serif">Recent Enquiries</h3>
                  <button onClick={() => setActiveTab('enquiries')} className="text-[10px] font-black text-brand-teal uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="flex-1 p-8">
                  <RecentEnquiriesList />
                </div>
              </div>
            </div>

            {/* Sidebar Tools */}
            <div className="space-y-10">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 font-serif">System Status</h2>
                <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-2xl space-y-6">
                  {[
                    { label: 'Database', status: 'Operational' },
                    { label: 'Storage', status: 'Operational' },
                    { label: 'Auth Service', status: 'Operational' }
                  ].map((s) => (
                    <div key={s.label} className="flex items-center justify-between">
                      <div className="text-xs font-black text-slate-400 uppercase tracking-widest">{s.label}</div>
                      <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                        <div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                        {s.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 font-serif">Quick Actions</h2>
                <div className="grid grid-cols-1 gap-4">
                  <button onClick={() => setActiveTab('cms')} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-teal transition-all text-left group">
                    <div className="font-bold text-slate-900 mb-1 font-serif">Update Courses</div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">CMS Manager</p>
                  </button>
                  <button onClick={() => setActiveTab('users')} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-teal transition-all text-left group">
                    <div className="font-bold text-slate-900 mb-1 font-serif">Manage Roles</div>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">User Access</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'cms' && <SiteContentCMS />}
      {activeTab === 'users' && <ManageUsers />}
      {activeTab === 'applications' && <ManageApplications />}
      {activeTab === 'enquiries' && <ManageEnquiries />}
    </div>
  );
}


