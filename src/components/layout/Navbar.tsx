import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, User, Bell } from 'lucide-react';
import { Logo } from '@/src/components/ui/Logo';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useSiteSettings } from '@/src/hooks/useSiteSettings';
import { getNavbarCourses } from '@/src/services/courseService';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [activeDeepMenu, setActiveDeepMenu] = useState<string | null>(null);
  const [navLinks, setNavLinks] = useState<any[]>([
    {
      name: 'About',
      children: [
        { name: 'About Us', path: '/about' },
        { name: 'Policy & Procedures', path: '/policy' },
        { name: 'Disclaimer', path: '/disclaimer' },
      ],
    },
    {
      name: 'Courses',
      path: '/courses',
      isHierarchical: true,
      children: []
    },
    { name: 'Employability', path: '/employability' },
    {
      name: 'Safeguard & Prevent',
      children: [
        { name: 'Safeguarding Hub', path: '/safeguarding' },
        { name: 'Prevent Duty', path: '/prevent-duty' },
        { name: 'British Values', path: '/british-values' },
      ],
    },
    { name: 'Contact Us', path: '/contact' },
  ]);

  const location = useLocation();
  const isHome = location.pathname === '/';
  const { settings } = useSiteSettings();

  useEffect(() => {
    async function loadNavData() {
      const coursesData = await getNavbarCourses();
      if (coursesData && coursesData.length > 0) {
        setNavLinks(prev => prev.map(link => 
          link.name === 'Courses' ? { ...link, children: coursesData } : link
        ));
      } else {
        // Minimum empty state for Courses to avoid breaking UI if DB empty
        setNavLinks(prev => prev.map(link => 
          link.name === 'Courses' ? { 
            ...link, 
            children: [
              { name: 'Health and social care', id: 'health-and-social-care', path: '/courses?category=health-and-social-care', items: [] },
              { name: 'Assessor courses', id: 'assessor', path: '/courses?category=assessor', items: [] }
            ] 
          } : link
        ));
      }
    }
    loadNavData();
  }, []);

  return (
    <>
      <AnimatePresence>
        {settings.banner_active && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-brand-teal text-white py-3 px-4 text-center text-[10px] font-black uppercase tracking-[0.25em] relative overflow-hidden"
          >
            <div className="flex items-center justify-center gap-4 relative z-10">
              <Bell size={12} className="animate-bounce" />
              <span>{settings.banner_text}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <nav className={cn(
      "sticky top-0 z-50 border-b transition-all duration-300",
      isHome 
        ? "bg-white/80 backdrop-blur-md border-slate-100 shadow-sm" 
        : "bg-white border-slate-100 shadow-sm"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between h-32">
          <div className="flex items-center">
            <Link to="/">
              <Logo dark={true} size="xl" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative h-full flex items-center"
                onMouseEnter={() => {
                  setActiveDropdown(link.name);
                  if (link.isHierarchical && link.children && link.children.length > 0) {
                    setActiveSubMenu(link.children[0].name);
                  }
                }}
                onMouseLeave={() => {
                  setActiveDropdown(null);
                  setActiveSubMenu(null);
                  setActiveDeepMenu(null);
                }}
              >
                {link.children ? (
                  <button className={cn(
                    "flex items-center gap-1.5 text-[15px] font-bold tracking-tight transition-all py-2 h-full font-montserrat",
                    activeDropdown === link.name ? "text-brand-teal" : "text-slate-800 hover:text-brand-teal"
                  )}>
                    {link.name}
                    <ChevronDown size={14} className={cn("transition-transform opacity-50", activeDropdown === link.name && "rotate-180")} />
                  </button>
                ) : (
                  <Link
                    to={link.path!}
                    className={cn(
                      "text-[15px] font-bold tracking-tight transition-colors py-2 h-full flex items-center font-montserrat",
                      location.pathname === link.path 
                        ? "text-brand-teal" 
                        : "text-slate-800 hover:text-brand-teal"
                    )}
                  >
                    {link.name}
                  </Link>
                )}

                <AnimatePresence>
                  {link.children && activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={cn(
                        "bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 z-50",
                        link.isHierarchical 
                          ? "fixed left-1/2 -translate-x-1/2 top-[128px] w-[calc(100vw-2rem)] max-w-7xl flex min-h-[600px] rounded-b-2xl overflow-hidden" 
                          : "absolute left-0 top-full w-80 p-3 rounded-b-lg overflow-hidden"
                      )}
                    >
                      {link.isHierarchical ? (
                        <>
                          {/* Categories (Level 1) */}
                          <div className="w-[30%] bg-slate-50/50 border-r border-slate-100 py-6 font-montserrat">
                            {link.children.map((section: any) => (
                              <div
                                key={section.name}
                                onMouseEnter={() => {
                                  setActiveSubMenu(section.name);
                                  const isHSC = section.name.toLowerCase().includes('health') && section.name.toLowerCase().includes('social');
                                  if (isHSC && section.items && section.items.length > 0) {
                                    setActiveDeepMenu(section.items[0].name);
                                  } else {
                                    setActiveDeepMenu(null);
                                  }
                                }}
                                className={cn(
                                  "flex items-center justify-between px-10 py-6 transition-all cursor-pointer group",
                                  activeSubMenu === section.name ? "bg-white text-brand-teal shadow-sm" : "text-slate-900"
                                )}
                              >
                                <span className={cn(
                                  "text-[14px] font-bold leading-tight pr-4",
                                  activeSubMenu === section.name ? "text-brand-teal" : "text-slate-900"
                                )}>
                                  {section.name}
                                </span>
                                {(section.name.toLowerCase().includes('health') && section.name.toLowerCase().includes('social')) ? <ChevronDown size={14} className="-rotate-90 opacity-40 group-hover:translate-x-1 transition-transform" /> : null}
                              </div>
                            ))}
                          </div>

                          {/* Sub-categories (Level 2) - Only show for Health and Social Care */}
                          <div className={cn(
                            "w-[35%] bg-white border-r border-slate-100 py-6",
                            (!activeSubMenu || !(activeSubMenu.toLowerCase().includes('health') && activeSubMenu.toLowerCase().includes('social')) || (link.children.find((s: any) => s.name === activeSubMenu)?.items?.length || 0) === 0) && "hidden"
                          )}>
                            <AnimatePresence mode="wait">
                              {activeSubMenu && (
                                <motion.div
                                  key={activeSubMenu}
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                >
                                  {((link.children.find((s: any) => s.name === activeSubMenu) as any)?.items || []).map((subCat: any) => (
                                    <div
                                      key={subCat.name}
                                      onMouseEnter={() => setActiveDeepMenu(subCat.name)}
                                      className={cn(
                                        "flex items-center justify-between px-10 py-5 transition-all cursor-pointer group",
                                        activeDeepMenu === subCat.name ? "bg-slate-50 text-brand-teal" : "text-slate-700"
                                      )}
                                    >
                                      <span className="text-[13px] font-bold font-montserrat leading-tight pr-4">
                                        {subCat.name}
                                      </span>
                                      {subCat.items && subCat.items.length > 0 && <ChevronDown size={14} className="-rotate-90 opacity-40 group-hover:translate-x-1 transition-transform" />}
                                    </div>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Final Courses */}
                          <div className="flex-1 bg-white p-12">
                            <AnimatePresence mode="wait">
                              {activeSubMenu && (
                                <motion.div
                                  key={activeDeepMenu || activeSubMenu}
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  className="space-y-8"
                                >
                                  <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-brand-teal mb-8 border-b border-slate-100 pb-4 inline-block font-montserrat">
                                    {activeDeepMenu || activeSubMenu}
                                  </h4>
                                  <div className={cn(
                                    "grid gap-x-12 gap-y-6",
                                    (
                                      (link.children.find((s: any) => s.name === activeSubMenu)?.items || []).find((sub: any) => sub.name === activeDeepMenu)?.items?.length || 
                                      (link.children.find((s: any) => s.name === activeSubMenu)?.items || []).flatMap((sub: any) => sub.items || []).length || 0
                                    ) > 8 
                                      ? "grid-cols-2" 
                                      : "grid-cols-1"
                                  )}>
                                    {activeDeepMenu ? (
                                      // Deep level
                                      (
                                        (link.children.find((s: any) => s.name === activeSubMenu)?.items || [])
                                        .find((sub: any) => sub.name === activeDeepMenu)?.items || []
                                      ).map((course: any) => (
                                        <Link
                                          key={course.id}
                                          to={course.path}
                                          className="text-[14px] font-bold text-slate-700 hover:text-brand-teal transition-all leading-tight flex items-center gap-4 hover:translate-x-2 font-montserrat"
                                        >
                                          <div className="w-2 h-2 bg-brand-teal/20 rounded-full" />
                                          {course.name}
                                        </Link>
                                      ))
                                    ) : (
                                      // Flat level
                                      (
                                        (link.children.find((s: any) => s.name === activeSubMenu)?.items || [])
                                        .flatMap((sub: any) => sub.items || [])
                                      ).map((course: any) => (
                                        <Link
                                          key={course.id}
                                          to={course.path}
                                          className="text-[14px] font-bold text-slate-700 hover:text-brand-teal transition-all leading-tight flex items-center gap-4 hover:translate-x-2 font-montserrat"
                                        >
                                          <div className="w-2 h-2 bg-brand-teal/20 rounded-full" />
                                          {course.name}
                                        </Link>
                                      ))
                                    )}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </>
                      ) : (
                        <div className="space-y-1">
                          {link.children.map((child: any) => (
                            <Link
                              key={child.name}
                              to={child.path}
                              className="block px-8 py-5 text-[15px] font-bold text-slate-700 hover:bg-slate-50 hover:text-brand-teal rounded-lg transition-all font-montserrat"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            <Link
              to="/login"
              className="bg-brand-teal text-white px-10 py-3.5 rounded-lg text-[13px] font-bold uppercase tracking-[0.2em] hover:bg-brand-accent transition-all shadow-xl shadow-brand-teal/20 font-montserrat"
            >
              LMS Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "p-2 transition-colors rounded-xl",
                "text-slate-900 hover:text-brand-teal bg-slate-100"
              )}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={cn(
              "lg:hidden border-t overflow-hidden shadow-2xl",
              "bg-white border-slate-100"
            )}
          >
            <div className="px-6 pt-6 pb-16 space-y-4">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.children ? (
                    <div className="space-y-4 mb-8">
                      <div className="px-4 py-3 text-[10px] font-black text-brand-teal uppercase tracking-[0.4em] opacity-80 border-b border-slate-100 mb-6">{link.name}</div>
                      {link.isHierarchical ? (
                        <div className="space-y-8">
                          {link.children.map((section: any) => (
                            <div key={section.name} className="pl-6 space-y-4">
                              <Link 
                                to={section.path}
                                onClick={() => setIsOpen(false)}
                                className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-brand-teal block"
                              >
                                {section.name}
                              </Link>
                              <div className="grid grid-cols-1 gap-2 pl-4">
                                {((section.name.toLowerCase().includes('health') && section.name.toLowerCase().includes('social')) ? section.items : []).map((item: any) => (
                                  <Link
                                    key={item.id}
                                    to={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                      "block px-4 py-3 text-sm font-bold transition-colors rounded-xl font-serif",
                                      "text-slate-600 hover:text-brand-teal hover:bg-slate-50"
                                    )}
                                  >
                                    {item.name}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-1 pl-4">
                          {link.children.map((child: any) => (
                            <Link
                              key={child.name}
                              to={child.path}
                              onClick={() => setIsOpen(false)}
                              className={cn(
                                "block px-6 py-4 text-sm font-bold transition-colors rounded-xl font-serif",
                                "text-slate-600 hover:text-brand-teal hover:bg-slate-50"
                              )}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={link.path!}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "block px-4 py-5 text-sm font-black uppercase tracking-[0.2em] transition-all rounded-lg",
                        location.pathname === link.path 
                          ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/20" 
                          : "text-slate-600 hover:text-brand-teal hover:bg-slate-50"
                      )}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
              <div className="pt-8 px-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-brand-teal text-white py-6 rounded-lg font-black uppercase tracking-[0.25em] text-xs shadow-2xl shadow-brand-teal/20 active:scale-95 transition-all"
                >
                  LMS Login
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
    </>
  );
}
