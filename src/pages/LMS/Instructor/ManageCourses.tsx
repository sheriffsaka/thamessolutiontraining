import { BookOpen, Plus, Search, Layers, Users as UsersIcon } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { mockCourses } from '@/src/constants/courses';

export function ManageCourses() {
  const courses = mockCourses.slice(0, 3).map((c, i) => ({
    ...c,
    students: [156, 89, 210][i],
    modules: [12, 8, 5][i],
    status: i === 1 ? 'Draft' : 'Active'
  }));

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Course Management</h1>
          <p className="text-slate-500 font-medium">Curate and optimize your educational portfolio.</p>
        </div>
        <button className="bg-brand-teal text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-brand-teal/20 hover:scale-105 transition-all flex items-center gap-3">
          <Plus size={20} />
          Add New Curriculum
        </button>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by title or category..."
              className="w-full bg-white border border-slate-100 rounded-xl py-3.5 pl-12 pr-6 text-slate-900 outline-none focus:border-brand-teal transition-all shadow-sm"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-6">Course Information</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-center">Metrics</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {courses.map((course) => (
                <tr key={course.id} className="hover:bg-slate-50/30 transition-all group">
                  <td className="px-8 py-8">
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-100 shadow-sm shrink-0">
                        <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-brand-teal transition-colors font-serif text-lg">{course.title}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{course.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-8">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                      course.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'
                    )}>
                      {course.status}
                    </span>
                  </td>
                  <td className="px-8 py-8">
                    <div className="flex justify-center gap-8">
                       <div className="text-center">
                          <div className="text-sm font-bold text-slate-900 flex items-center justify-center gap-2">
                             <UsersIcon size={14} className="text-brand-teal" />
                             {course.students}
                          </div>
                          <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Students</div>
                       </div>
                       <div className="text-center">
                          <div className="text-sm font-bold text-slate-900 flex items-center justify-center gap-2">
                             <Layers size={14} className="text-brand-teal" />
                             {course.modules}
                          </div>
                          <div className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Modules</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-8 text-right">
                    <button className="text-brand-teal font-black text-[10px] uppercase tracking-widest border border-brand-teal/20 px-6 py-2.5 rounded-xl hover:bg-brand-teal hover:text-white transition-all shadow-sm">
                      Manage Portal
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
