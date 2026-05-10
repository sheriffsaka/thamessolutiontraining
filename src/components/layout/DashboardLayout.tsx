import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Settings, 
  LogOut, 
  Bell, 
  User, 
  BarChart, 
  Shield, 
  MessageSquare,
  Search
} from 'lucide-react';
import { motion } from 'motion/react';
import { Logo } from '@/src/components/ui/Logo';
import { cn } from '@/src/lib/utils';
import { useState, useEffect } from 'react';
import { supabase, Profile } from '@/src/lib/supabase';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

interface DashboardLayoutProps {
  children: React.ReactNode;
  menuItems: SidebarItem[];
  userRole: string;
}

export function DashboardLayout({ children, menuItems, userRole }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (data) setProfile(data as Profile);
      }
    }
    loadProfile();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-white text-slate-900 hidden xl:flex flex-col flex-shrink-0 border-r border-slate-100 shadow-xl relative z-20">
        <div className="p-10 border-b border-slate-100">
          <Link to="/">
            <Logo showText={true} dark={true} />
          </Link>
        </div>

        <nav className="flex-1 p-8 space-y-4 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={cn(
                  "flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all group relative overflow-hidden",
                  isActive
                    ? "bg-brand-teal text-white shadow-xl shadow-brand-teal/20" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-brand-teal"
                )}
              >
                <item.icon size={22} className={cn("transition-colors relative z-10", isActive ? "text-white" : "group-hover:text-brand-teal")} />
                <span className="relative z-10 text-sm">{item.name}</span>
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 bg-brand-teal"
                    transition={{ type: "spring", bounce: 0.1, duration: 0.5 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-6 py-4 w-full rounded-2xl font-bold text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-red-100 transition-colors">
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            </div>
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <header className="h-24 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-12 flex items-center justify-between flex-shrink-0 relative z-10">
          <div className="flex items-center gap-6 lg:hidden">
            <Logo showText={false} dark={true} />
            <h2 className="font-black text-brand-teal px-5 py-2 bg-brand-teal/10 border border-brand-teal/20 rounded-xl text-[10px] uppercase tracking-widest">{userRole} Portal</h2>
          </div>

          <div className="hidden lg:flex items-center bg-slate-50 rounded-2xl px-6 py-3.5 w-[30rem] border border-slate-100 group focus-within:border-brand-teal/50 focus-within:bg-white focus-within:shadow-xl transition-all">
            <Search className="text-slate-400 group-focus-within:text-brand-teal transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search resources, lessons, help..." 
              className="bg-transparent border-none outline-none pl-4 text-sm flex-1 text-slate-900 placeholder:text-slate-400 font-medium" 
            />
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex gap-3">
              <button className="relative w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 hover:bg-white hover:text-brand-teal hover:shadow-lg transition-all group">
                <Bell size={20} />
                <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-brand-teal rounded-full border-2 border-white" />
              </button>
              <button className="relative w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 hover:bg-white hover:text-brand-teal hover:shadow-lg transition-all group">
                <MessageSquare size={20} />
              </button>
            </div>
            
            <div className="h-10 w-px bg-slate-100 mx-2" />
            
            <div className="flex items-center gap-4 pl-2">
              <div className="text-right hidden sm:block">
                <div className="text-base font-bold text-slate-900 leading-none font-serif">{profile?.full_name || 'User'}</div>
                <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.2em] mt-2">{userRole}</div>
              </div>
              <div className="w-12 h-12 rounded-2xl border border-slate-100 p-0.5 bg-gradient-to-tr from-brand-teal to-brand-accent shadow-lg shadow-brand-teal/20">
                <div className="w-full h-full bg-white rounded-xl flex items-center justify-center text-brand-teal overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={24} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-12 relative z-10 custom-scrollbar">
          <div className="max-w-7xl mx-auto pb-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
