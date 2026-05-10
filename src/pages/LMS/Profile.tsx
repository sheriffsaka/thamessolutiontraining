import React, { useState, useEffect } from 'react';
import { User, Camera, Mail, Shield, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase, Profile as UserProfile } from '@/src/lib/supabase';
import { uploadImage } from '@/src/lib/storage';
import { cn } from '@/src/lib/utils';

export function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await (supabase
          .from('profiles') as any)
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) {
          setProfile(data as UserProfile);
          setFullName(data.full_name || '');
        }
      }
    }
    loadProfile();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      setIsUploading(true);
      setMessage(null);
      const publicUrl = await uploadImage(file);
      
      // Update profile in DB
      const { error } = await (supabase
        .from('profiles') as any)
        .update({ avatar_url: publicUrl } as any)
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, avatar_url: publicUrl });
      setMessage({ type: 'success', text: 'Profile picture updated successfully!' });
    } catch (err: any) {
      console.error('Upload error:', err);
      setMessage({ type: 'error', text: `Failed to upload image: ${err.message || 'Unknown error'}. Make sure the "uploads" bucket exists.` });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      const { error } = await (supabase
        .from('profiles') as any)
        .update({ full_name: fullName } as any)
        .eq('id', profile.id);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile.' });
    }
  };

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <header>
        <h1 className="text-4xl font-bold text-slate-900 mb-2 font-serif tracking-tight">Account Profile</h1>
        <p className="text-slate-500 font-medium tracking-tight">Manage your personal information and LMS credentials.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Avatar Section */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 flex flex-col items-center">
            <div className="relative group">
              <div className="w-40 h-40 rounded-[2.5rem] bg-slate-50 border border-slate-100 overflow-hidden shadow-inner group-hover:border-brand-teal transition-all">
                {profile.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User size={64} />
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" />
                  </div>
                )}
              </div>
              <label className="absolute -bottom-4 -right-4 bg-brand-teal text-white p-4 rounded-2xl shadow-xl hover:bg-brand-accent transition-all cursor-pointer group-hover:scale-110">
                <Camera size={20} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
              </label>
            </div>
            <div className="mt-12 text-center">
              <div className="text-sm font-black text-brand-teal uppercase tracking-[0.2em] mb-2">{profile.role}</div>
              <div className="text-2xl font-bold text-slate-900 font-serif leading-none mb-4">{profile.full_name}</div>
              <div className="bg-slate-50 px-4 py-2 rounded-full inline-flex items-center gap-2 border border-slate-100">
                <Shield size={12} className="text-brand-teal" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Credentials</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 space-y-10">
            {message && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "p-6 rounded-2xl border flex items-center gap-4 font-medium",
                  message.type === 'success' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-red-50 border-red-100 text-red-600"
                )}
              >
                <CheckCircle2 size={20} />
                {message.text}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-16 py-5 focus:bg-white focus:ring-4 focus:ring-brand-teal/5 transition-all font-bold text-slate-900 outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] pl-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    readOnly
                    value={profile.email || ''}
                    className="w-full bg-slate-50/50 border border-slate-100/50 rounded-2xl px-16 py-5 font-bold text-slate-400 outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-slate-100 flex justify-end">
              <button 
                onClick={handleSave}
                className="bg-brand-teal text-white px-12 py-5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-accent transition-all shadow-xl shadow-brand-teal/20"
              >
                Save Changes
              </button>
            </div>
          </div>

          <div className="bg-brand-teal/5 p-10 rounded-[3rem] border border-brand-teal/10">
            <div className="flex gap-6">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-teal shadow-lg border border-brand-teal/5">
                <Shield size={24} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900 mb-2 font-serif">Credential Security</h4>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">
                  Your profile data is protected by industry-standard encryption. Thames Solution ensures 100% compliance with data protection laws.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
