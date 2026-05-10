import { BookOpen, Search, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { getEnrollments } from '@/src/services/courseService';
import { cn } from '@/src/lib/utils';

export function MyCourses() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadEnrollments() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const data = await getEnrollments(user.id);
        setEnrollments(data);
      }
      setLoading(false);
    }
    loadEnrollments();
  }, []);

  const filteredEnrollments = enrollments.filter(enrollment => 
    enrollment.courses.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-4 border-brand-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 font-serif">My Courses</h1>
        <p className="text-slate-500 font-medium">Track and manage your enrolled programs.</p>
      </header>

      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search your courses..."
            className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-12 pr-6 text-slate-900 outline-none focus:border-brand-teal transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEnrollments.map((enrollment) => {
          const course = enrollment.courses;
          const isCompleted = enrollment.status === 'completed';
          
          return (
            <div key={enrollment.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 hover:border-brand-teal/30 transition-all group shadow-xl">
              <div className="w-12 h-12 bg-brand-teal/10 rounded-xl flex items-center justify-center text-brand-teal mb-6">
                <BookOpen size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-4 line-clamp-2 min-h-[3.5rem] font-serif group-hover:text-brand-teal transition-colors">
                {course.title}
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                  <span className={isCompleted ? "text-emerald-500" : "text-brand-teal"}>
                    {isCompleted ? 'Completed' : 'In Progress'}
                  </span>
                  <span className="text-slate-400">{enrollment.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${enrollment.progress}%` }}
                    className={cn("h-full", isCompleted ? "bg-emerald-500" : "bg-brand-teal")}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {filteredEnrollments.length === 0 && (
          <div className="lg:col-span-3 text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-slate-100">
            <p className="text-slate-400 font-medium font-serif">No enrollments found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

