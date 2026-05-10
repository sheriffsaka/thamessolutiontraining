import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  FileText, 
  HelpCircle, 
  Layout, 
  Users, 
  Image as ImageIcon,
  CheckCircle2,
  Save,
  X,
  MessageSquare,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { supabase } from '@/src/lib/supabase';
import { uploadImage } from '@/src/lib/storage';

type CMSTab = 'courses' | 'faq' | 'team' | 'testimonials' | 'pages' | 'settings';

export function SiteContentCMS() {
  const [activeTab, setActiveTab] = useState<CMSTab>('courses');

  const tabs: { id: CMSTab; label: string; icon: any }[] = [
    { id: 'courses', label: 'Courses', icon: FileText },
    { id: 'pages', label: 'Site Pages', icon: Layout },
    { id: 'faq', label: 'FAQ', icon: HelpCircle },
    { id: 'team', label: 'Our Team', icon: Users },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Save },
  ];

  return (
    <div className="space-y-8">
      {/* CMS Sub-navigation */}
      <div className="flex flex-wrap gap-4 p-2 bg-slate-100 rounded-2xl border border-slate-200 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-3 px-6 py-3 rounded-xl text-xs font-bold transition-all",
              activeTab === tab.id 
                ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/20" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-200"
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10">
        <AnimatePresence mode="wait">
          {activeTab === 'courses' && <CourseManager key="courses" />}
          {activeTab === 'pages' && <PagesManager key="pages" />}
          {activeTab === 'faq' && <FAQManager key="faq" />}
          {activeTab === 'team' && <TeamManager key="team" />}
          {activeTab === 'testimonials' && <TestimonialManager key="testimonials" />}
          {activeTab === 'settings' && <SiteSettingsManager key="settings" />}
        </AnimatePresence>
      </div>
    </div>
  );
}

function SiteSettingsManager() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      const { data } = await (supabase.from('site_contents').select('*').eq('id', 'site_settings').single() as any);
      if (data) {
        setSettings(data.content);
      } else {
        setSettings({
          phone: "07426566335",
          email: "admin@thamessolutiontraining.co.uk",
          address: "Capital House, Catford, London SE6 4AS",
          facebook: "#",
          twitter: "#",
          instagram: "#",
          linkedin: "#"
        });
      }
      setLoading(false);
    }
    fetchSettings();
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const newSettings: any = {};
    formData.forEach((value, key) => {
      newSettings[key] = value;
    });

    const { error } = await (supabase.from('site_contents') as any).upsert({
      id: 'site_settings',
      section: 'global',
      content: newSettings,
      updated_at: new Date().toISOString()
    });

    if (!error) alert('Settings updated successfully');
  }

  if (loading) return <div className="p-20 text-center text-brand-teal"><Clock className="animate-spin inline mr-2" /> Loading...</div>;

  const fields = [
    { name: 'phone', label: 'Contact Phone', type: 'text' },
    { name: 'email', label: 'Contact Email', type: 'email' },
    { name: 'address', label: 'Office Address', type: 'text' },
    { name: 'facebook', label: 'Facebook URL', type: 'text' },
    { name: 'twitter', label: 'Twitter URL', type: 'text' },
    { name: 'instagram', label: 'Instagram URL', type: 'text' },
    { name: 'linkedin', label: 'LinkedIn URL', type: 'text' },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-slate-900 font-serif mb-2">Global Settings</h3>
        <p className="text-sm text-slate-500 font-medium">Manage contact information and social media links across the site.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 flex flex-col gap-8">
           <div className="flex items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
             <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center transition-all", settings?.banner_active ? "bg-brand-teal text-white shadow-lg shadow-brand-teal/20" : "bg-slate-100 text-slate-400")}>
               <Save size={20} />
             </div>
             <div className="flex-1">
               <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Site-wide Notice Banner</div>
               <div className="text-sm font-bold text-slate-900 mt-1">Status: {settings?.banner_active ? 'Active' : 'Inactive'}</div>
             </div>
             <label className="relative inline-flex items-center cursor-pointer">
               <input 
                 type="checkbox" 
                 name="banner_active" 
                 defaultChecked={settings?.banner_active} 
                 className="sr-only peer"
                 onChange={(e) => setSettings({ ...settings, banner_active: e.target.checked })}
               />
               <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-brand-teal"></div>
             </label>
           </div>
           
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Banner Message</label>
              <input 
                name="banner_text"
                defaultValue={settings?.banner_text}
                placeholder="e.g. Enrollment for Summer 2024 is now open! 🚀"
                className="w-full p-5 bg-white border border-slate-100 rounded-2xl outline-none focus:border-brand-teal font-bold text-slate-900 shadow-sm"
              />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
          {fields.map(field => (
            <div key={field.name} className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">{field.label}</label>
              <input 
                name={field.name}
                type={field.type}
                defaultValue={settings[field.name]}
                className="w-full p-5 bg-white border border-slate-100 rounded-2xl outline-none focus:border-brand-teal font-bold text-slate-900 shadow-sm"
              />
            </div>
          ))}
          <div className="md:col-span-2 pt-6 flex justify-end">
            <button type="submit" className="bg-brand-teal text-white px-12 py-5 rounded-2xl font-bold hover:bg-brand-accent transition-all flex items-center gap-3 shadow-xl shadow-brand-teal/20">
              <Save size={20} />
              Save Global Settings
            </button>
          </div>
        </div>
      </form>
    </motion.div>
  );
}

function PagesManager() {
  const [editingPage, setEditingPage] = useState<any>(null);
  const [siteContents, setSiteContents] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchSiteContents();
  }, []);

  async function fetchSiteContents() {
    const { data } = await supabase.from('site_contents').select('*');
    if (data) setSiteContents(data);
  }

  const sections = [
    { id: 'home_hero', title: 'Home Hero Section', section: 'home', fields: ['title', 'subtitle', 'cta_primary', 'cta_secondary'] },
    { id: 'home_about', title: 'Home About Section', section: 'home', fields: ['title', 'description', 'cta_label', 'cta_link'] },
    { id: 'about_page', title: 'About Page Content', section: 'about', fields: ['title', 'description', 'mission'] },
    { id: 'prevent_duty', title: 'Prevent Duty', section: 'compliance', fields: ['title', 'subtitle', 'text', 'details_json'] },
    { id: 'british_values', title: 'British Values', section: 'compliance', fields: ['title', 'subtitle', 'text', 'details_json'] },
    { id: 'employability_support', title: 'Employability Support', section: 'services', fields: ['title', 'subtitle', 'text', 'details_json'] },
    { id: 'safeguarding_policy', title: 'Safeguarding Policy', section: 'policies', fields: ['title', 'content'] },
    { id: 'disclaimer_content', title: 'Disclaimer Content', section: 'policies', fields: ['title', 'content'] },
    { id: 'policies_intro', title: 'Policy & Procedures Intro', section: 'policies', fields: ['title', 'description'] },
    { id: 'p_privacy', title: 'Privacy Policy', section: 'policies', fields: ['title', 'content'] },
    { id: 'p_terms', title: 'Terms of Service', section: 'policies', fields: ['title', 'content'] },
    { id: 'p_gdpr', title: 'GDPR Policy', section: 'policies', fields: ['title', 'content'] },
  ];

  async function handleSave() {
    if (!editingPage) return;
    
    // Parse JSON fields if necessary
    const contentToSave = { ...editingPage.content };
    for (const key in contentToSave) {
      if (key.endsWith('_json') && typeof contentToSave[key] === 'string') {
        try {
          contentToSave[key] = JSON.parse(contentToSave[key]);
        } catch (e) {
          alert(`Invalid JSON format in ${key}. Please check your syntax.`);
          return;
        }
      }
    }

    const { error } = await (supabase
      .from('site_contents') as any)
      .upsert({
        id: editingPage.id,
        section: editingPage.section,
        content: contentToSave,
        updated_at: new Date().toISOString()
      });

    if (!error) {
       setEditingPage(null);
       fetchSiteContents();
    }
  }

  const updateField = (key: string, value: any) => {
    setEditingPage({
      ...editingPage,
      content: {
        ...editingPage.content,
        [key]: value
      }
    });
  };

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, key: string) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const url = await uploadImage(file);
      updateField(key, url);
    } catch (err: any) {
      console.error('Image upload error:', err);
      alert(`Upload failed: ${err.message || 'Unknown error'}. Make sure the "uploads" bucket exists in Supabase storage.`);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 font-serif mb-2">Website Content</h3>
          <p className="text-sm text-slate-500 font-medium">Easily update titles, descriptions and call-to-actions across your site.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((section) => {
          const currentData = siteContents.find(sc => sc.id === section.id);
          return (
            <div key={section.id} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex flex-col gap-6 shadow-sm group hover:border-brand-teal transition-all">
               <div className="flex justify-between items-start">
                 <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-teal shrink-0 shadow-inner border border-slate-100 group-hover:scale-110 transition-transform">
                    <Layout size={24} />
                 </div>
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-white px-3 py-1 rounded-full border border-slate-100">
                    {section.section} page
                 </div>
               </div>
               <div className="flex-1">
                  <div className="font-bold text-lg text-slate-900 mb-1 font-serif">{section.title}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-6">
                    {currentData ? `Modified: ${new Date(currentData.updated_at).toLocaleDateString()}` : 'No content set'}
                  </div>
                  <p className="text-sm text-slate-500 font-medium line-clamp-2">
                    {currentData?.content?.description || currentData?.content?.subtitle || 'Edit the visible text for this section.'}
                  </p>
               </div>
               <button 
                 onClick={() => setEditingPage({ ...section, content: currentData?.content || {} })}
                 className="w-full py-4 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-brand-teal hover:bg-brand-teal hover:text-white transition-all shadow-sm"
               >
                 Edit Section
               </button>
            </div>
          );
        })}
      </div>

      {editingPage && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            onClick={() => setEditingPage(null)}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-3xl max-h-[85vh] flex flex-col overflow-hidden"
          >
            <div className="flex justify-between items-center mb-10">
              <div>
                <div className="text-[10px] font-black text-brand-teal uppercase tracking-widest mb-1 italic">CMS Content Editor</div>
                <h2 className="text-3xl font-bold text-slate-900 font-serif">{editingPage.title}</h2>
              </div>
              <button onClick={() => setEditingPage(null)} className="p-3 bg-slate-50 rounded-full text-slate-400 hover:text-slate-900 transition-all">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto mb-10 pr-4 custom-scrollbar space-y-8 pb-10">
               {editingPage.fields.map((field: string) => (
                 <div key={field} className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] pl-2">{field.replace(/_/g, ' ')}</label>
                    {field.includes('description') || field.includes('subtitle') || field.includes('mission') || field.includes('content') || field === 'text' ? (
                      <textarea 
                        className="w-full h-32 p-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-brand-teal font-bold text-slate-900 text-sm"
                        value={editingPage.content[field] || ''}
                        onChange={(e) => updateField(field, e.target.value)}
                        placeholder={`Enter ${field.replace(/_/g, ' ')}...`}
                      />
                    ) : field === 'details_json' ? (
                      <div className="space-y-4">
                        <textarea 
                          className="w-full h-48 p-6 bg-slate-900 text-brand-teal rounded-2xl font-mono text-xs border border-slate-800 outline-none focus:border-brand-teal shadow-2xl"
                          value={typeof editingPage.content[field] === 'string' ? editingPage.content[field] : JSON.stringify(editingPage.content[field], null, 2)}
                          onChange={(e) => updateField(field, e.target.value)}
                          placeholder='[{"title": "Item 1", "desc": "Description 1"}]'
                        />
                        <p className="text-[10px] text-slate-400 font-medium italic">Format: {'[{"title": "---", "desc": "---"}]'}</p>
                      </div>
                    ) : field.includes('image') ? (
                      <div className="relative h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center px-6 overflow-hidden">
                        <ImageIcon className="text-brand-teal mr-4" size={20} />
                        <span className="text-sm font-bold text-slate-500 truncate">
                          {editingPage.content[field] ? 'Image Uploaded' : 'Upload Image'}
                        </span>
                        <input type="file" onChange={(e) => handleImageUpload(e, field)} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                        {isUploading && <div className="absolute right-6 animate-spin text-brand-teal"><Clock size={16} /></div>}
                        {editingPage.content[field] && (
                          <div className="absolute right-6 w-10 h-10 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                            <img src={editingPage.content[field]} className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <input 
                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-brand-teal font-bold text-slate-900 text-sm"
                        value={editingPage.content[field] || ''}
                        onChange={(e) => updateField(field, e.target.value)}
                        placeholder={`Enter ${field.replace(/_/g, ' ')}...`}
                      />
                    )}
                 </div>
               ))}
            </div>

            <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
              <button onClick={() => setEditingPage(null)} className="px-8 py-5 bg-slate-50 text-slate-500 rounded-2xl font-bold hover:bg-slate-100 transition-all border border-slate-100">
                Discard Changes
              </button>
              <button 
                onClick={handleSave}
                className="px-14 py-5 bg-brand-teal text-white rounded-2xl font-bold hover:bg-brand-accent transition-all flex items-center gap-3 shadow-xl shadow-brand-teal/20"
              >
                <Save size={20} />
                Publish Updates
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

import { mockCourses, categories } from '@/src/constants/courses';

function CourseManager() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    if (data) setCourses(data);
    setLoading(false);
  }

  async function syncFromMock() {
     if (!confirm('This will sync all courses from the navbar configuration into the database. This ensures CMS courses match exactly with the navbar. Continue?')) return;
     
     setIsSyncing(true);
     try {
       // We can now use String IDs safely since we changed the DB column type to TEXT
       for (const mc of mockCourses) {
         const { error } = await (supabase.from('courses') as any).upsert({
           id: String(mc.id),
           title: mc.title,
           slug: mc.slug || mc.id,
           category: mc.category,
           sub_category: mc.subCategory || mc.level,
           description: mc.desc,
           long_description: mc.longDesc,
           duration: mc.duration,
           image_url: mc.image,
           requirements: mc.requirements || [],
           outcomes: mc.outcomes || [],
           updated_at: new Date().toISOString()
         });
         
         if (error) console.error(`Error syncing ${mc.title}:`, error);
       }
       alert('Standardization completed! Your CMS now matches the navbar courses.');
       fetchCourses();
     } catch (err) {
       console.error('Sync failed:', err);
       alert('Failed to sync courses. Check the console for details.');
     } finally {
       setIsSyncing(false);
     }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get('title') as string;
    const slug = editingCourse?.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const courseData = {
      title,
      slug,
      category: formData.get('category'),
      sub_category: formData.get('sub_category'),
      description: formData.get('description'),
      long_description: formData.get('long_description'),
      duration: formData.get('duration'),
      image_url: editingCourse?.image_url,
      syllabus_url: editingCourse?.syllabus_url,
      outcomes: (formData.get('outcomes') as string)?.split('\n').filter(Boolean) || [],
      requirements: (formData.get('requirements') as string)?.split('\n').filter(Boolean) || [],
    };

    if (editingCourse?.id) {
      await (supabase.from('courses') as any).update(courseData as any).eq('id', editingCourse.id);
    } else {
      await (supabase.from('courses') as any).insert([courseData as any]);
    }
    setEditingCourse(null);
    fetchCourses();
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this course?')) {
      await supabase.from('courses').delete().eq('id', id);
      fetchCourses();
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const url = await uploadImage(file); // uploadImage handles general files too
      if (type === 'image') {
        setEditingCourse({ ...editingCourse, image_url: url });
      } else {
        setEditingCourse({ ...editingCourse, syllabus_url: url });
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      alert(`Upload failed: ${err.message || 'Unknown error'}. Please verify your storage bucket settings.`);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 font-serif mb-2">Manage Courses</h3>
          <p className="text-sm text-slate-500 font-medium">Add, edit or remove courses from the public listing.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={syncFromMock}
            disabled={isSyncing}
            className="px-6 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 text-slate-500 hover:bg-slate-100 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Clock size={16} className={isSyncing ? "animate-spin" : ""} />
            {isSyncing ? 'Syncing...' : 'Standardize with Navbar'}
          </button>
          <button 
            onClick={() => setEditingCourse({})}
            className="bg-brand-teal text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent transition-all flex items-center gap-2 shadow-lg shadow-brand-teal/20"
          >
            <Plus size={16} />
            Add Course
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-20 flex justify-center text-brand-teal">
            <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        ) : courses.map((course) => (
          <div key={course.id} className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 group hover:border-brand-teal transition-all shadow-sm flex flex-col">
            <div className="h-44 rounded-2xl overflow-hidden mb-6 bg-slate-200 border border-slate-100 relative">
              {course.image_url ? (
                <img src={course.image_url} className="w-full h-full object-cover" alt={course.title} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                  <ImageIcon size={32} />
                </div>
              )}
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2 truncate font-serif">{course.title}</h4>
            <div className="text-xs text-brand-teal font-black uppercase tracking-widest mb-4">{course.category}</div>
            <div className="flex justify-between items-center pt-6 mt-auto border-t border-slate-200/60">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] truncate mr-2">
                {course.sub_category || course.level || 'General'}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditingCourse(course)}
                  className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-brand-teal transition-all shadow-sm"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(course.id)}
                  className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingCourse && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setEditingCourse(null)} />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="relative bg-white w-full max-w-2xl rounded-[3rem] p-12 shadow-3xl overflow-y-auto max-h-[90vh]"
          >
            <h2 className="text-3xl font-bold text-slate-900 font-serif mb-10">{editingCourse.id ? 'Edit Course Details' : 'Add New Course'}</h2>
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto mb-10 pr-4 custom-scrollbar space-y-8 pb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Course Title</label>
                  <input name="title" defaultValue={editingCourse.title} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5 outline-none focus:border-brand-teal font-bold text-slate-900" placeholder="e.g. Level 3 Diploma in Adult Care" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Category (Slug)</label>
                  <input name="category" defaultValue={editingCourse.category || 'health-and-social-care'} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5 outline-none focus:border-brand-teal font-bold text-slate-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Sub-Category</label>
                  <input name="sub_category" defaultValue={editingCourse.sub_category || editingCourse.level || ''} placeholder="e.g. Level 2 Qualifications" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5 outline-none focus:border-brand-teal font-bold text-slate-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Duration</label>
                  <input name="duration" defaultValue={editingCourse.duration || '6 Months'} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4.5 outline-none focus:border-brand-teal font-bold text-slate-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 font-bold">Featured Media & Documents</label>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="relative h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center px-6 overflow-hidden group hover:border-brand-teal transition-all">
                      <ImageIcon className="text-brand-teal mr-3" size={18} />
                      <span className="text-sm font-bold text-slate-500 truncate">{editingCourse.image_url ? 'Thumbnail Ready' : 'Upload Thumbnail'}</span>
                      <input type="file" onChange={(e) => handleFileUpload(e, 'image')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                      {isUploading && <div className="absolute right-4 animate-spin text-brand-teal"><Clock size={16} /></div>}
                      {editingCourse.image_url && <div className="absolute right-12 w-8 h-8 rounded border-2 border-white shadow-sm overflow-hidden"><img src={editingCourse.image_url} className="w-full h-full object-cover" /></div>}
                    </div>

                    <div className="relative h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center px-6 overflow-hidden group hover:border-brand-teal transition-all">
                      <FileText className="text-brand-teal mr-3" size={18} />
                      <span className="text-sm font-bold text-slate-500 truncate">{editingCourse.syllabus_url ? 'Syllabus Attached' : 'Upload Syllabus (PDF)'}</span>
                      <input type="file" onChange={(e) => handleFileUpload(e, 'file')} className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.doc,.docx" />
                      {isUploading && <div className="absolute right-4 animate-spin text-brand-teal"><Clock size={16} /></div>}
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Brief Summary</label>
                <textarea name="description" defaultValue={editingCourse.description} className="w-full h-28 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-brand-teal font-bold text-slate-900" placeholder="A short catch-phrase or summary..." />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Full Course Details</label>
                <textarea name="long_description" defaultValue={editingCourse.long_description} className="w-full h-72 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-brand-teal font-bold text-slate-900" placeholder="Detailed curriculum, depth and scope..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">What You Will Learn (One per line)</label>
                  <textarea name="outcomes" defaultValue={editingCourse.outcomes?.join('\n')} className="w-full h-40 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-brand-teal font-bold text-slate-900" placeholder="Standard 1...\nStandard 2..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Entry Requirements (One per line)</label>
                  <textarea name="requirements" defaultValue={editingCourse.requirements?.join('\n')} className="w-full h-40 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-brand-teal font-bold text-slate-900" placeholder="Basic English...\nAge 18+..." />
                </div>
              </div>
              <div className="flex justify-end gap-5 pt-10 border-t border-slate-100">
                <button type="button" onClick={() => setEditingCourse(null)} className="px-10 py-5 bg-slate-50 text-slate-400 rounded-2xl font-bold hover:bg-slate-100 transition-all border border-slate-100">Discard Changes</button>
                <button type="submit" className="bg-brand-teal text-white px-14 py-5 rounded-2xl font-bold hover:bg-brand-accent transition-all flex items-center gap-3 shadow-xl shadow-brand-teal/20">
                  <Save size={20} />
                  {editingCourse.id ? 'Save Changes' : 'Create Course'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

function FAQManager() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState<any>(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  async function fetchFaqs() {
    setLoading(true);
    const { data } = await supabase.from('faqs').select('*').order('order_index', { ascending: true });
    if (data) setFaqs(data);
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const faqData = {
      question: formData.get('question'),
      answer: formData.get('answer'),
      category: formData.get('category'),
      order_index: parseInt(formData.get('order_index') as string) || 0,
      is_active: true
    };

    if (editingFaq?.id) {
      await (supabase.from('faqs') as any).update(faqData as any).eq('id', editingFaq.id);
    } else {
      await (supabase.from('faqs') as any).insert([faqData as any]);
    }
    setEditingFaq(null);
    fetchFaqs();
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this FAQ?')) {
      await supabase.from('faqs').delete().eq('id', id);
      fetchFaqs();
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 font-serif mb-2">Manage FAQs</h3>
          <p className="text-sm text-slate-500 font-medium">Update frequently asked questions for your visitors.</p>
        </div>
        <button 
          onClick={() => setEditingFaq({})}
          className="bg-brand-teal text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent transition-all flex items-center gap-2 shadow-lg shadow-brand-teal/20"
        >
          <Plus size={16} />
          Add FAQ
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-20 flex justify-center text-brand-teal">
            <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        ) : faqs.map((faq) => (
          <div key={faq.id} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 flex gap-8 items-start shadow-sm">
             <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-teal shrink-0 shadow-inner border border-slate-100">
                <HelpCircle size={24} />
             </div>
             <div className="flex-1">
                <div className="font-bold text-slate-900 mb-2 font-serif">{faq.question}</div>
                <div className="text-sm text-slate-600 font-medium leading-relaxed">{faq.answer}</div>
             </div>
             <div className="flex gap-2">
                <button 
                  onClick={() => setEditingFaq(faq)}
                  className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-brand-teal transition-all shadow-sm font-medium"
                >
                  <Edit2 size={18} />
                </button>
                <button 
                  onClick={() => handleDelete(faq.id)}
                  className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm font-medium"
                >
                  <Trash2 size={18} />
                </button>
             </div>
          </div>
        ))}
      </div>

      {editingFaq && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setEditingFaq(null)} />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            className="relative bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-3xl"
          >
            <h2 className="text-2xl font-bold text-slate-900 font-serif mb-8">{editingFaq.id ? 'Edit FAQ' : 'Add FAQ'}</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Question</label>
                <input name="question" defaultValue={editingFaq.question} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-brand-teal font-bold" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Answer</label>
                <textarea name="answer" defaultValue={editingFaq.answer} className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-brand-teal font-bold" required />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Category</label>
                  <input name="category" defaultValue={editingFaq.category || 'General'} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-brand-teal font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px) font-black text-slate-400 uppercase tracking-widest pl-2">Order Index</label>
                  <input name="order_index" type="number" defaultValue={editingFaq.order_index || 0} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-brand-teal font-bold" />
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-6">
                <button type="button" onClick={() => setEditingFaq(null)} className="px-8 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl">Cancel</button>
                <button type="submit" className="bg-brand-teal text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-brand-teal/20 flex items-center gap-2">
                  <Save size={18} />
                  Save FAQ
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

function TeamManager() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    const { data } = await supabase.from('team_members').select('*').order('order_index', { ascending: true });
    if (data) setMembers(data);
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const memberData = {
      name: formData.get('name'),
      role: formData.get('role'),
      bio: formData.get('bio'),
      image_url: editingMember?.image_url,
      order_index: parseInt(formData.get('order_index') as string) || 0,
    };

    if (editingMember?.id) {
      await (supabase.from('team_members') as any).update(memberData as any).eq('id', editingMember.id);
    } else {
      await (supabase.from('team_members') as any).insert([memberData as any]);
    }
    setEditingMember(null);
    fetchMembers();
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const url = await uploadImage(file);
      setEditingMember({ ...editingMember, image_url: url });
    } catch (err) {
      alert('Upload failed');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 font-serif mb-2">Manage Team</h3>
          <p className="text-sm text-slate-500 font-medium">Update staff and instructor profiles.</p>
        </div>
        <button 
          onClick={() => setEditingMember({})}
          className="bg-brand-teal text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent transition-all flex items-center gap-2 shadow-lg shadow-brand-teal/20"
        >
          <Plus size={16} />
          Add Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
         {loading ? (
           <div className="col-span-full py-20 flex justify-center"><div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" /></div>
         ) : members.map((member) => (
           <div key={member.id} className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 text-center shadow-sm">
              <div className="w-24 h-24 bg-white border-2 border-slate-100 rounded-full mx-auto mb-6 overflow-hidden flex items-center justify-center text-slate-300 shadow-inner">
                {member.image_url ? <img src={member.image_url} className="w-full h-full object-cover" /> : <Users size={40} />}
              </div>
              <div className="font-bold text-slate-900 mb-1 font-serif">{member.name}</div>
              <div className="text-[10px] font-black text-brand-teal uppercase tracking-[0.2em] mb-8">{member.role}</div>
              <div className="flex justify-center gap-3">
                <button 
                  onClick={() => setEditingMember(member)}
                  className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-brand-teal transition-all shadow-sm"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={async () => { if(confirm('Delete member?')) { await supabase.from('team_members').delete().eq('id', member.id); fetchMembers(); } }}
                  className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm"
                >
                  <Trash2 size={16} />
                </button>
              </div>
           </div>
         ))}
      </div>

      {editingMember && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setEditingMember(null)} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-3xl">
            <h2 className="text-2xl font-bold text-slate-900 font-serif mb-8">{editingMember.id ? 'Edit Member' : 'Add Member'}</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Name</label>
                <input name="name" defaultValue={editingMember.name} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-brand-teal font-bold" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Role</label>
                <input name="role" defaultValue={editingMember.role} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-brand-teal font-bold" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Profile Photo</label>
                <div className="relative h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center px-6 overflow-hidden">
                  <span className="text-sm font-bold text-slate-500">{editingMember.image_url ? 'Photo Set' : 'Choose Photo'}</span>
                  <input type="file" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                  {isUploading && <div className="absolute right-4 animate-spin"><Clock size={16} /></div>}
                </div>
              </div>
              <div className="flex justify-end gap-4 pt-6">
                <button type="button" onClick={() => setEditingMember(null)} className="px-8 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl">Cancel</button>
                <button type="submit" className="bg-brand-teal text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-brand-teal/20 flex items-center gap-2">
                  <Save size={18} />
                  Save Member
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

function TestimonialManager() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingTestimonial, setEditingTestimonial] = useState<any>(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    setLoading(true);
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
    if (data) setTestimonials(data);
    setLoading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const testimonialData = {
      student_name: formData.get('student_name'),
      course_name: formData.get('course_name'),
      content: formData.get('content'),
      rating: 5,
    };

    if (editingTestimonial?.id) {
      await (supabase.from('testimonials') as any).update(testimonialData as any).eq('id', editingTestimonial.id);
    } else {
      await (supabase.from('testimonials') as any).insert([testimonialData as any]);
    }
    setEditingTestimonial(null);
    fetchTestimonials();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 font-serif mb-2">Manage Testimonials</h3>
          <p className="text-sm text-slate-500 font-medium">Curate success stories from your students.</p>
        </div>
        <button 
          onClick={() => setEditingTestimonial({})}
          className="bg-brand-teal text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-accent transition-all flex items-center gap-2 shadow-lg shadow-brand-teal/20"
        >
          <Plus size={16} />
          Add Story
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {loading ? (
          <div className="col-span-full py-20 flex justify-center"><div className="w-8 h-8 border-2 border-brand-teal border-t-transparent rounded-full animate-spin" /></div>
        ) : testimonials.map((t) => (
          <div key={t.id} className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 relative shadow-sm">
             <div className="text-slate-600 italic mb-10 leading-relaxed font-serif text-lg">
               "{t.content}"
             </div>
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-full border border-slate-200 flex items-center justify-center text-slate-300">
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{t.student_name}</div>
                    <div className="text-[10px] text-brand-teal font-black uppercase tracking-[0.2em]">{t.course_name}</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingTestimonial(t)}
                    className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-brand-teal transition-all shadow-sm"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={async () => { if(confirm('Delete story?')) { await supabase.from('testimonials').delete().eq('id', t.id); fetchTestimonials(); } }}
                    className="p-2.5 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
             </div>
          </div>
        ))}
      </div>

      {editingTestimonial && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setEditingTestimonial(null)} />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-3xl">
            <h2 className="text-2xl font-bold text-slate-900 font-serif mb-8">Add Testimonial</h2>
            <form onSubmit={handleSave} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Student Name</label>
                <input name="student_name" defaultValue={editingTestimonial.student_name} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-brand-teal font-bold" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Course/Credential</label>
                <input name="course_name" defaultValue={editingTestimonial.course_name} className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-brand-teal font-bold" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Content</label>
                <textarea name="content" defaultValue={editingTestimonial.content} className="w-full h-32 bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:border-brand-teal font-bold" required />
              </div>
              <div className="flex justify-end gap-4 pt-6">
                <button type="button" onClick={() => setEditingTestimonial(null)} className="px-8 py-4 text-slate-400 font-bold hover:bg-slate-50 rounded-2xl">Cancel</button>
                <button type="submit" className="bg-brand-teal text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-brand-teal/20 flex items-center gap-2">
                  <Save size={18} />
                  Save Story
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
