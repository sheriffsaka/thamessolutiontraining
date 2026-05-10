import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { UserPlus, Mail, Lock, User, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function Signup() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirm_password: ''
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.full_name,
            password: formData.password // Storing it in metadata so trigger can pick it up if needed
          }
        }
      });

      if (signUpError) throw signUpError;
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-teal/10 via-transparent to-transparent">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3.5rem] shadow-3xl p-12 text-center"
        >
          <div className="w-24 h-24 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="text-brand-teal" size={48} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Check your email</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">
            We've sent a verification link to <span className="font-semibold text-slate-900">{formData.email}</span>. 
            Please click the link to activate your account.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="w-full h-18 bg-brand-teal text-white rounded-3xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-brand-dark-teal group"
          >
            Go to Login
            <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-teal/10 via-transparent to-transparent">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm mb-6">
            <ShieldCheck className="text-brand-teal" size={32} />
            <span className="text-xl font-bold text-slate-900 tracking-tight">Thames Solution</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Create Account</h1>
          <p className="text-slate-500 mt-2">Join our professional learning community</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3.5rem] shadow-3xl p-10 lg:p-12"
        >
          {error && (
            <div className="mb-8 p-6 bg-red-50 border border-red-100 text-red-600 rounded-3xl text-sm font-medium flex items-center gap-3">
              <CheckCircle2 className="text-red-400 rotate-180" size={20} />
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-4">Full Name</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-teal transition-colors">
                  <User size={22} />
                </div>
                <input 
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full h-18 pl-18 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-brand-teal focus:bg-white outline-none transition-all font-medium"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-4">Email Address</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-teal transition-colors">
                  <Mail size={22} />
                </div>
                <input 
                  type="email"
                  required
                  placeholder="your@email.com"
                  className="w-full h-18 pl-18 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-brand-teal focus:bg-white outline-none transition-all font-medium"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-4">Create Password</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-teal transition-colors">
                  <Lock size={22} />
                </div>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full h-18 pl-18 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-brand-teal focus:bg-white outline-none transition-all font-medium"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-4">Confirm Password</label>
              <div className="relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-teal transition-colors">
                  <Lock size={22} />
                </div>
                <input 
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full h-18 pl-18 bg-slate-50 rounded-3xl border-2 border-transparent focus:border-brand-teal focus:bg-white outline-none transition-all font-medium"
                  value={formData.confirm_password}
                  onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full h-18 bg-brand-teal text-white rounded-3xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-brand-dark-teal group shadow-lg shadow-brand-teal/20 mt-8 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Register Account
                  <UserPlus size={20} className="transition-transform group-hover:scale-110" />
                </>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-slate-500 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-teal hover:underline font-bold">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
