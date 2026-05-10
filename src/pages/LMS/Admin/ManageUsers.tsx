import { useState, useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Search, UserPlus, Shield, UserX, Check } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function ManageUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data } = await supabase.from('profiles').select('*');
    if (data) setUsers(data);
    setLoading(false);
  }

  async function updateUserRole(userId: string, newRole: string) {
    const { error } = await (supabase
      .from('profiles') as any)
      .update({ role: newRole } as any)
      .eq('id', userId);
    
    if (!error) {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
  }

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 font-serif">Platform Users</h2>
          <p className="text-sm text-slate-500 font-medium">Manage user permissions and roles across the system.</p>
        </div>
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-teal transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Search users..." 
            className="pl-12 pr-6 py-3.5 bg-slate-100 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-brand-teal transition-all w-80 font-bold text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100">
            <tr>
              <th className="px-10 py-6">User</th>
              <th className="px-10 py-6">Current Role</th>
              <th className="px-10 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr><td colSpan={3} className="py-20 text-center"><div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin mx-auto" /></td></tr>
            ) : filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-all">
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 font-bold uppercase overflow-hidden">
                      {user.avatar_url ? <img src={user.avatar_url} /> : (user.full_name?.[0] || 'U')}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{user.full_name || 'Anonymous'}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{user.email}</div>
                      {user.managed_password && (
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-[10px] font-black text-brand-teal bg-brand-teal/5 px-2 py-0.5 rounded">PW: {user.managed_password}</span>
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400 tracking-wider">ID: {user.id.slice(0, 8)}</div>
                    </div>
                  </div>
                </td>
                <td className="px-10 py-6">
                  <span className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                    user.role === 'admin' ? "bg-red-50 text-red-600 border-red-100" :
                    user.role === 'instructor' ? "bg-brand-teal/5 text-brand-teal border-brand-teal/10" :
                    "bg-slate-50 text-slate-500 border-slate-100"
                  )}>
                    {user.role}
                  </span>
                </td>
                <td className="px-10 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => updateUserRole(user.id, 'admin')}
                        className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-100"
                        title="Promote to Admin"
                      >
                        <Shield size={16} />
                      </button>
                    )}
                    {user.role !== 'instructor' && (
                      <button 
                        onClick={() => updateUserRole(user.id, 'instructor')}
                        className="p-2.5 bg-brand-teal/5 text-brand-teal rounded-xl hover:bg-brand-teal hover:text-white transition-all shadow-sm border border-brand-teal/10"
                        title="Make Instructor"
                      >
                        <UserPlus size={16} />
                      </button>
                    )}
                    {user.role !== 'student' && (
                      <button 
                        onClick={() => updateUserRole(user.id, 'student')}
                        className="p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm border border-slate-100"
                        title="Reset to Student"
                      >
                        <UserX size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
