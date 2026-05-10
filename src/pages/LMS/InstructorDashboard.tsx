import { BookOpen, Users, Plus, Upload, MoreVertical, Edit, Trash } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

const myCourses = [
  { id: '1', title: 'Health & Social Care L3', students: 156, modules: 12, status: 'Active' },
  { id: '2', title: 'Clinical Safety Protocols', students: 89, modules: 8, status: 'Draft' },
];

export function InstructorDashboard() {
  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2 font-serif tracking-tight">Instructor Hub</h1>
          <p className="text-slate-500 font-medium">Manage your curriculum and monitor student progress.</p>
        </div>
        <button className="bg-brand-teal text-white px-10 py-5 rounded-2xl font-bold text-sm shadow-xl shadow-brand-teal/20 hover:scale-105 transition-all flex items-center gap-3">
          <Plus size={24} />
          Create New Course
        </button>
      </header>

      {/* Course Management Table */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-slate-900 font-serif tracking-tight">My Courses</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {myCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl hover:border-brand-teal/20 transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-10">
                <div className="w-20 h-20 bg-brand-teal/5 border border-brand-teal/10 rounded-2xl flex items-center justify-center text-brand-teal shadow-inner">
                  <BookOpen size={40} />
                </div>
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]",
                    course.status === 'Active' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-slate-50 text-slate-400 border border-slate-200"
                  )}>
                    {course.status}
                  </span>
                  <button className="p-3 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-100">
                    <MoreVertical size={24} className="text-slate-400" />
                  </button>
                </div>
              </div>

              <h3 className="text-3xl font-bold text-slate-900 mb-8 group-hover:text-brand-teal transition-colors font-serif">
                {course.title}
              </h3>

              <div className="grid grid-cols-2 gap-6 mb-12">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Total Students</div>
                  <div className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <Users size={24} className="text-brand-teal" />
                    {course.students}
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Lessons/Modules</div>
                  <div className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                    <BookOpen size={24} className="text-brand-teal" />
                    {course.modules}
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-brand-teal text-white py-5 rounded-2xl font-bold text-sm hover:bg-brand-accent transition-all flex items-center justify-center gap-3 shadow-xl shadow-brand-teal/20 border border-transparent">
                  <Edit size={18} />
                  Edit Course
                </button>
                <button className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-slate-500 hover:text-brand-teal hover:border-brand-teal transition-all shadow-sm">
                  <Upload size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-2xl">
        <h2 className="text-2xl font-bold text-slate-900 mb-10 font-serif border-b border-slate-50 pb-6">Recent Student Submissions</h2>
        <div className="space-y-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-8 border border-slate-100 rounded-[2rem] hover:border-brand-teal/30 transition-all gap-6 bg-slate-50/30 group">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-300 shadow-inner group-hover:scale-110 transition-transform">
                  <UserIcon size={32} />
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-lg font-serif">Sarah Miller</div>
                  <div className="text-sm text-slate-500 font-medium">Submitted Assignment: <span className="text-brand-teal italic font-bold">"Risk Management Case Study"</span></div>
                </div>
              </div>
              <div className="flex items-center gap-6 w-full sm:w-auto">
                <div className="text-xs text-slate-400 font-bold uppercase tracking-widest">15 mins ago</div>
                <button className="flex-1 sm:flex-none px-8 py-3.5 bg-brand-teal text-white font-bold rounded-xl text-xs hover:bg-brand-accent transition-all shadow-lg shadow-brand-teal/10">
                  Grade Task
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const UserIcon = ({ size, className }: { size?: number, className?: string }) => <Users size={size} className={className} />;
