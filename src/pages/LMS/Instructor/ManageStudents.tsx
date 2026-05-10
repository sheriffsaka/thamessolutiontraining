import { Users, Search, MoreHorizontal, Mail } from 'lucide-react';

const students = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', course: 'Health & Social Care L3', Joined: '2026-03-12' },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', course: 'Clinical Safety', Joined: '2026-03-15' },
  { id: '3', name: 'Charlie Davis', email: 'charlie@example.com', course: 'Workplace H&S', Joined: '2026-03-20' },
];

export function ManageStudents() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 font-serif">Students</h1>
        <p className="text-slate-500 font-medium">Monitor and support your active learners.</p>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Filter by name or course..."
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-6 text-slate-900 outline-none focus:border-brand-teal transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-8 py-3 bg-brand-teal text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-accent transition-all shadow-lg shadow-brand-teal/20">
            Export List
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Full Name</th>
                <th className="px-8 py-5">Enrolled Course</th>
                <th className="px-8 py-5">Joined Date</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 border border-slate-100 shadow-inner">
                        <Users size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-brand-teal transition-colors">{student.name}</div>
                        <div className="text-xs text-slate-400 font-medium">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-slate-600 font-bold">{student.course}</td>
                  <td className="px-8 py-6 text-sm text-slate-400 font-medium">{student.Joined}</td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-2 text-slate-400">
                      <button className="p-2 hover:bg-slate-100 rounded-lg hover:text-brand-teal transition-all">
                        <Mail size={18} />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg hover:text-slate-900 transition-all">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
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
