import React, { useState, useEffect } from 'react';
import { Mail, Search, CheckCircle, Trash2, Eye, Loader2 } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import { cn } from '@/src/lib/utils';

export function ManageEnquiries() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEnquiries();
  }, []);

  async function fetchEnquiries() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('enquiries' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEnquiries(data || []);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: 'read' | 'unread' | 'archived') {
    try {
      const { error } = await (supabase
        .from('enquiries') as any)
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setEnquiries(prev => prev.map(enq => enq.id === id ? { ...enq, status } : enq));
    } catch (error) {
      console.error('Error updating enquiry status:', error);
    }
  }

  const filteredEnq = enquiries.filter(enq => 
    enq.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enq.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enq.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enq.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 font-serif">Contact Enquiries</h1>
        <p className="text-slate-500 font-medium">Manage messages received via the contact form.</p>
      </header>

      <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-12 pr-6 text-slate-900 outline-none focus:border-brand-teal transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-brand-teal" size={40} />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Messages...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-8 py-5">Sender</th>
                  <th className="px-8 py-5">Subject</th>
                  <th className="px-8 py-5">Message</th>
                  <th className="px-8 py-5">Date</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredEnq.map((enq) => (
                  <tr key={enq.id} className={cn("hover:bg-slate-50/50 transition-all group", enq.status === 'unread' && "bg-brand-teal/5")}>
                    <td className="px-8 py-6">
                      <div className="font-bold text-slate-900 flex items-center gap-2">
                        {enq.full_name}
                        {enq.status === 'unread' && <div className="w-2 h-2 rounded-full bg-brand-teal" />}
                      </div>
                      <div className="text-xs text-slate-400 font-medium">{enq.email}</div>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-600 font-bold max-w-[200px] truncate">
                      {enq.subject}
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-400 max-w-[300px] truncate font-medium">
                      {enq.message}
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-400">
                      {new Date(enq.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                         {enq.status === 'unread' ? (
                            <button 
                              onClick={() => updateStatus(enq.id, 'read')}
                              title="Mark as Read"
                              className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-brand-teal hover:bg-white transition-all border border-slate-100 shadow-sm"
                            >
                              <CheckCircle size={18} />
                            </button>
                         ) : (
                            <button 
                              onClick={() => updateStatus(enq.id, 'unread')}
                              title="Mark as Unread"
                              className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-white transition-all border border-slate-100 shadow-sm"
                            >
                              <Mail size={18} />
                            </button>
                         )}
                         <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-white transition-all border border-slate-100 shadow-sm">
                           <Eye size={18} />
                         </button>
                         <button 
                          onClick={() => updateStatus(enq.id, 'archived')}
                          title="Archive"
                          className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-white transition-all border border-slate-100 shadow-sm"
                        >
                           <Trash2 size={18} />
                         </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredEnq.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-20 text-center">
                      <p className="text-slate-400 font-medium">No messages found.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
