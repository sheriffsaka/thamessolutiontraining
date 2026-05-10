import React, { useState, useEffect } from 'react';
import { FileText, Search, CheckCircle, XCircle, Eye, Loader2, X, MapPin, Phone, Mail, Calendar, User, Shield, Key, ExternalLink } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export function ManageApplications() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApplications(data || []);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, status: 'approved' | 'rejected' | 'onboarded', extraData: any = {}) {
    setIsUpdating(true);
    try {
      const updateData: any = { status, ...extraData };
      
      // Auto-generate password if approved and none exists
      if (status === 'approved' && !extraData.generated_password) {
        const randomPass = 'TMS-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        updateData.generated_password = randomPass;
      }

      const { error } = await (supabase
        .from('applications') as any)
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
      
      if (selectedApp?.id === id) {
        setSelectedApp({ ...selectedApp, ...updateData });
      }

      setApplications(prev => prev.map(app => app.id === id ? { ...app, ...updateData } : app));
    } catch (error: any) {
      console.error('Error updating status:', error);
      alert('Update failed: ' + (error?.message || 'Unknown error'));
    } finally {
      setIsUpdating(false);
    }
  }

  const filteredApps = applications.filter(app => {
    const search = searchQuery.toLowerCase();
    const fullName = (app.full_name || '').toLowerCase();
    const email = (app.email || '').toLowerCase();
    const courseTitle = (app.courses?.title || app.course_title || '').toLowerCase();
    
    return fullName.includes(search) || 
           email.includes(search) || 
           courseTitle.includes(search);
  });

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Registration Desk</h1>
          <p className="text-slate-500 font-medium italic">"Bridging the gap between ambition and employment"</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Queue Size</div>
          <div className="text-2xl font-bold text-brand-teal">{applications.filter(a => a.status === 'pending').length} New</div>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-2xl relative">
        <div className="p-8 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-slate-900 outline-none focus:border-brand-teal transition-all font-bold shadow-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <Loader2 className="animate-spin text-brand-teal" size={48} />
                <div className="absolute inset-0 bg-brand-teal/10 blur-xl rounded-full" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Accessing Database...</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-50/80 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                <tr>
                  <th className="px-10 py-6">Applicant Details</th>
                  <th className="px-10 py-6">Applied Course</th>
                  <th className="px-10 py-6">Submission</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4 text-slate-400">
                        <FileText size={48} className="opacity-20" />
                        <p className="font-bold">No application records found</p>
                        <p className="text-xs">Try adjusting your search or check if the database is populated.</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-brand-teal/[0.02] transition-all group">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-brand-teal group-hover:text-white transition-all shadow-inner">
                          <User size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-lg font-serif">{app.full_name}</div>
                          <div className="text-xs text-slate-400 font-bold tracking-tight">{app.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-sm text-slate-700 font-bold max-w-[200px] leading-tight">
                        {app.courses?.title || app.course_title || 'General Enquiry'}
                      </div>
                      <div className="text-[10px] text-slate-400 font-black uppercase mt-1 tracking-widest">
                        {app.course_id ? 'VOCATIONAL' : 'GENERAL'}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="text-sm font-bold text-slate-900">
                        {new Date(app.created_at).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">At {new Date(app.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border ${
                        app.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        app.status === 'onboarded' ? 'bg-brand-teal text-white border-brand-teal shadow-lg shadow-brand-teal/20' :
                        app.status === 'rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <button 
                        onClick={() => setSelectedApp(app)}
                        className="px-6 py-3 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-brand-teal hover:text-white transition-all border border-slate-100 shadow-sm"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      <AnimatePresence mode="wait">
        {selectedApp && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 lg:p-12 xl:ml-80 transition-all">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-5xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] z-10"
            >
              {/* Modal Header */}
              <div className="p-8 lg:p-10 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-brand-teal rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-brand-teal/20 shrink-0">
                    <FileText size={32} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.3em] mb-1 italic">Application Record</div>
                    <h2 className="text-2xl lg:text-3xl font-bold text-slate-900 font-serif truncate">{selectedApp.full_name}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <a 
                    href={`mailto:${selectedApp.email}?subject=Application Status: ${selectedApp.status}&body=Hello ${selectedApp.full_name},%0D%0A%0D%0AYour application for ${selectedApp.course_title} has been ${selectedApp.status}. %0D%0A%0D%0AYour default password is: ${selectedApp.generated_password}%0D%0A%0D%0APlease sign up at: ${window.location.origin}/signup to claim your account.`}
                    className="hidden sm:flex items-center gap-2 px-6 py-4 bg-white text-brand-teal rounded-2xl font-bold border border-brand-teal/20 hover:bg-brand-teal hover:text-white transition-all shadow-sm"
                  >
                    <Mail size={18} />
                    Notify via Email
                  </a>
                  <button 
                    onClick={() => setSelectedApp(null)}
                    className="p-4 bg-white rounded-2xl text-slate-400 hover:text-rose-500 transition-all border border-slate-100 shadow-sm"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Left Column: Personal Info */}
                  <div className="space-y-10">
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-l-4 border-brand-teal pl-4">Contact Details</h3>
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 text-slate-600">
                          <Mail className="text-brand-teal shrink-0" size={18} />
                          <span className="font-bold break-all">{selectedApp.email}</span>
                        </div>
                        <div className="flex items-center gap-4 text-slate-600">
                          <Phone className="text-brand-teal shrink-0" size={18} />
                          <span className="font-bold">{selectedApp.phone}</span>
                        </div>
                        <div className="flex items-start gap-4 text-slate-600">
                          <MapPin className="text-brand-teal shrink-0 mt-1" size={18} />
                          <span className="font-bold leading-relaxed">{selectedApp.address || 'No address provided'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-l-4 border-brand-teal pl-4">Personal Profile</h3>
                      <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-100">
                        <div>
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Birth Date</div>
                          <div className="text-sm font-bold text-slate-900">{selectedApp.date_of_birth || 'Not set'}</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Gender</div>
                          <div className="text-sm font-bold text-slate-900 capitalize">{selectedApp.gender || 'Not specified'}</div>
                        </div>
                        <div>
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Employment</div>
                          <div className="text-sm font-bold text-slate-900 capitalize">{selectedApp.employment_status || 'Not set'}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Emergency contact</div>
                          <div className="text-sm font-bold text-slate-900">{selectedApp.emergency_contact || 'None listed'}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Application Details & Password */}
                  <div className="space-y-10">
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 border-l-4 border-brand-teal pl-4">Enrollment Intent</h3>
                      <div className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-inner">
                        <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest mb-2">Target Course</div>
                        <div className="text-xl font-bold text-slate-900 font-serif leading-tight mb-4">{selectedApp.courses?.title || selectedApp.course_title}</div>
                        <div className="text-xs text-slate-500 font-medium leading-relaxed italic border-t border-slate-50 pt-4">
                          "{selectedApp.notes || 'No additional notes provided by applicant.'}"
                        </div>
                      </div>
                    </div>

                    {/* Password Management */}
                    {(selectedApp.status === 'approved' || selectedApp.status === 'onboarded') && (
                      <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/20 rounded-full blur-2xl" />
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                              <Key className="text-brand-teal" size={20} />
                              <h3 className="text-xs font-black uppercase tracking-[0.15em]">Access Credentials</h3>
                            </div>
                            <span className="text-[9px] font-black text-white/40 uppercase tracking-widest italic flex items-center gap-1">
                              <Shield size={10} /> Secure Generated
                            </span>
                          </div>
                          
                          <div className="space-y-3">
                            <label className="text-[9px] font-black text-white/50 uppercase tracking-widest pl-1">Student Password</label>
                            <div className="flex gap-3">
                              <input 
                                type="text"
                                defaultValue={selectedApp.generated_password}
                                onChange={(e) => setApplications(prev => prev.map(a => a.id === selectedApp.id ? { ...a, generated_password: e.target.value } : a))}
                                className="flex-1 bg-white/10 border border-white/10 rounded-xl px-5 py-3 outline-none focus:border-brand-teal font-mono text-sm tracking-wider"
                              />
                              <button 
                                onClick={() => updateStatus(selectedApp.id, selectedApp.status, { generated_password: selectedApp.generated_password })}
                                className="bg-brand-teal p-3 rounded-xl hover:bg-brand-accent transition-all shadow-lg"
                              >
                                <CheckCircle size={20} />
                              </button>
                            </div>
                            <p className="text-[9px] text-white/40 font-medium italic pt-2">Admin can regenerate or manually set this password before official onboarding.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="p-10 border-t border-slate-50 bg-slate-50/30 flex justify-between items-center gap-8">
                <div className="flex gap-4">
                  {selectedApp.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => updateStatus(selectedApp.id, 'approved')}
                        disabled={isUpdating}
                        className="px-12 py-5 bg-brand-teal text-white rounded-2xl font-bold hover:bg-brand-accent transition-all flex items-center gap-3 shadow-xl shadow-brand-teal/20"
                      >
                        {isUpdating ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                        Approve & Generate Password
                      </button>
                      <button 
                        onClick={() => updateStatus(selectedApp.id, 'rejected')}
                        disabled={isUpdating}
                        className="px-10 py-5 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-rose-500 hover:text-white transition-all"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {(selectedApp.status === 'approved' || selectedApp.status === 'onboarded') && (
                    <button 
                      onClick={() => updateStatus(selectedApp.id, 'onboarded')}
                      disabled={isUpdating || selectedApp.status === 'onboarded'}
                      className={cn(
                        "px-12 py-5 rounded-2xl font-bold transition-all flex items-center gap-3 shadow-xl shadow-slate-900/20",
                        selectedApp.status === 'onboarded' 
                          ? "bg-emerald-500 text-white cursor-default" 
                          : "bg-slate-900 text-white hover:bg-brand-teal"
                      )}
                    >
                      {isUpdating ? <Loader2 className="animate-spin" size={20} /> : (selectedApp.status === 'onboarded' ? <CheckCircle size={20} /> : <ExternalLink size={20} />)}
                      {selectedApp.status === 'onboarded' ? 'Onboarding Complete' : 'Grant Activation Now'}
                    </button>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Application ID</div>
                  <div className="text-xs font-mono text-slate-300">#{selectedApp.id.substring(0, 8)}</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
