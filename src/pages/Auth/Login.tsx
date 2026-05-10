import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import { Logo } from '@/src/components/ui/Logo';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Fetch role and approval status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, is_approved')
        .eq('id', data.user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error('Profile fetch error:', profileError);
        // Continue anyway for admins, they will be bootstrapped
      }

      const userEmail = data.user.email?.toLowerCase() || '';
      const adminEmails = ['thamestraining@outlook.com', 'sheriffdeenalade@gmail.com'];
      const isAdminEmail = adminEmails.includes(userEmail);

      let role = profile ? (profile as any).role : 'student';
      let isApproved = profile ? (profile as any).is_approved : false;
      
      // Fallback for students: Check application status if profile is not yet approved
      if (!isApproved && role === 'student') {
        try {
          const { data: appData } = await supabase
            .from('applications')
            .select('status')
            .eq('email', userEmail)
            .in('status', ['approved', 'onboarded'])
            .maybeSingle();

          if (appData) {
            isApproved = true;
            // Try to sync it back to profile
            await supabase.from('profiles').upsert({ 
              id: data.user.id, 
              is_approved: true,
              email: userEmail,
              role: 'student'
            }, { onConflict: 'id' });
          }
        } catch (err) {
          console.error('Application fallback check error:', err);
        }
      }

      // Bootstrap or Fix Admin status
      if (isAdminEmail) {
        try {
          if (!profile || (profile as any).role !== 'admin' || !(profile as any).is_approved) {
            await supabase.from('profiles').upsert({ 
              id: data.user.id, 
              role: 'admin', 
              is_approved: true,
              email: userEmail,
              full_name: data.user.user_metadata?.full_name || ''
            }, { onConflict: 'id' });
          }
        } catch (err) {
          console.error('Admin bootstrap error:', err);
        }
        role = 'admin';
        isApproved = true;
      }

      if (role === 'admin') {
        navigate('/admin');
      } else if (role === 'instructor') {
        navigate('/instructor');
      } else {
        if (!isApproved) {
          setError('Your account is currently pending approval. If you recently signed up, please wait for an administrator to review your application.');
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-block transform hover:scale-105 transition-all">
            <Logo dark={true} className="flex-col !gap-3" />
          </Link>
          <h2 className="mt-8 text-3xl font-bold text-slate-900 font-serif">LMS Portal Login</h2>
          <p className="mt-2 text-slate-500 font-medium">Access your courses and training resources</p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input
                  required
                  type="email"
                  placeholder="Email Address"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/5 outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={20} />
                <input
                  required
                  type="password"
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-brand-teal focus:ring-4 focus:ring-brand-teal/5 outline-none transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm px-2">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-brand-teal focus:ring-brand-teal" />
                Remember me
              </label>
              <a href="#" className="text-brand-teal font-bold hover:underline">Forgot Password?</a>
            </div>

            <button
              disabled={loading}
              className="w-full bg-brand-teal text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-brand-teal/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={20} />
                  Sign In to LMS
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-100 text-center space-y-3">
            <p className="text-gray-500 text-sm">
              Not a student yet? <Link to="/courses" className="text-brand-teal font-bold hover:underline">Apply for a course</Link>
            </p>
            <p className="text-gray-500 text-sm">
              Already applied and approved? <Link to="/signup" className="text-brand-teal font-bold hover:underline">Sign up to claim your account</Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-400 text-xs flex flex-col gap-2">
          <p>© 2026 Thames Solution Training & Consultancy Ltd</p>
          <div className="flex justify-center gap-4">
            <Link to="/policy" className="hover:text-brand-dark">Policies</Link>
            <Link to="/contact" className="hover:text-brand-dark">Support</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
