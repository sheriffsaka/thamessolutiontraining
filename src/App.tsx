import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { CourseDetail } from './pages/CourseDetail';
import { Safeguarding } from './pages/Info/Safeguarding';
import { InfoPage } from './pages/Info/InfoPages';
import { Login } from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Policy } from './pages/Info/Policy';
import { PolicyDetail } from './pages/Info/PolicyDetail';
import { Disclaimer } from './pages/Info/Disclaimer';
import { FAQ } from './pages/Info/FAQ';
import { Privacy } from './pages/Info/Privacy';
import { Terms } from './pages/Info/Terms';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { StudentDashboard } from './pages/LMS/StudentDashboard';
import { MyCourses as StudentCourses } from './pages/LMS/Student/MyCourses';
import { Resources as StudentResources } from './pages/LMS/Student/Resources';
import { Profile } from './pages/LMS/Profile';
import { InstructorDashboard } from './pages/LMS/InstructorDashboard';
import { ManageCourses as InstructorManageCourses } from './pages/LMS/Instructor/ManageCourses';
import { ManageStudents as InstructorManageStudents } from './pages/LMS/Instructor/ManageStudents';
import { AdminDashboard } from './pages/LMS/AdminDashboard';
import { ManageApplications as AdminManageApplications } from './pages/LMS/Admin/ManageApplications';
import { 
  LayoutDashboard, 
  BookOpen, 
  FileText, 
  Bell, 
  Settings, 
  User,
  ShieldCheck,
  Users,
  Mail
} from 'lucide-react';

// Placeholder Pages
const PlaceholderPage = ({ title }: { title: string }) => (
  <div className="min-h-screen pt-40 px-4 text-center bg-slate-50">
    <h1 className="text-4xl lg:text-7xl font-bold text-slate-900 mb-6 font-serif tracking-tight">{title}</h1>
    <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
      We are currently finalizing the content for this section. Thames Solution is committed to providing accurate and high-quality information.
    </p>
    <div className="w-20 h-1.5 bg-brand-teal mx-auto rounded-full shadow-lg shadow-brand-teal/20" />
  </div>
);

const studentMenu = [
  { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
  { name: 'My Courses', path: '/dashboard/courses', icon: BookOpen },
  { name: 'Resource Library', path: '/dashboard/resources', icon: FileText },
  { name: 'Announcements', path: '/dashboard/news', icon: Bell },
  { name: 'Profile', path: '/dashboard/profile', icon: User },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

const instructorMenu = [
  { name: 'Instructor Home', path: '/instructor', icon: LayoutDashboard },
  { name: 'Manage Courses', path: '/instructor/courses', icon: BookOpen },
  { name: 'Students', path: '/instructor/students', icon: Users },
  { name: 'Upload Resources', path: '/instructor/uploads', icon: FileText },
  { name: 'Profile', path: '/instructor/profile', icon: User },
];

const adminMenu = [
  { name: 'Admin Hub', path: '/admin', icon: LayoutDashboard },
  { name: 'Site Content', path: '/admin/cms', icon: BookOpen },
  { name: 'Manage Users', path: '/admin/users', icon: Users },
  { name: 'Applications', path: '/admin/applications', icon: FileText },
  { name: 'Enquiries', path: '/admin/enquiries', icon: Mail },
  { name: 'System Settings', path: '/admin/settings', icon: Settings },
];

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="policy" element={<Policy />} />
        <Route path="policy/:id" element={<PolicyDetail />} />
        <Route path="disclaimer" element={<Disclaimer />} />
        <Route path="faqs" element={<FAQ />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="courses" element={<Courses />} />
        <Route path="courses/:id" element={<CourseDetail />} />
        <Route path="safeguarding" element={<Safeguarding />} />
        <Route path="prevent-duty" element={<InfoPage type="prevent" />} />
        <Route path="british-values" element={<InfoPage type="values" />} />
        <Route path="employability" element={<InfoPage type="employability" />} />
        <Route path="contact" element={<Contact />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* LMS Protected Zones (Mocked Layouts) */}
      <Route path="/dashboard" element={<DashboardLayout userRole="Student" menuItems={studentMenu}><StudentDashboard /></DashboardLayout>} />
      <Route path="/dashboard/courses" element={<DashboardLayout userRole="Student" menuItems={studentMenu}><StudentCourses /></DashboardLayout>} />
      <Route path="/dashboard/resources" element={<DashboardLayout userRole="Student" menuItems={studentMenu}><StudentResources /></DashboardLayout>} />
      <Route path="/dashboard/news" element={<DashboardLayout userRole="Student" menuItems={studentMenu}><PlaceholderPage title="Announcements" /></DashboardLayout>} />
      <Route path="/dashboard/profile" element={<DashboardLayout userRole="Student" menuItems={studentMenu}><Profile /></DashboardLayout>} />
      <Route path="/dashboard/settings" element={<DashboardLayout userRole="Student" menuItems={studentMenu}><PlaceholderPage title="Settings" /></DashboardLayout>} />
      
      <Route path="/instructor" element={<DashboardLayout userRole="Instructor" menuItems={instructorMenu}><InstructorDashboard /></DashboardLayout>} />
      <Route path="/instructor/courses" element={<DashboardLayout userRole="Instructor" menuItems={instructorMenu}><InstructorManageCourses /></DashboardLayout>} />
      <Route path="/instructor/students" element={<DashboardLayout userRole="Instructor" menuItems={instructorMenu}><InstructorManageStudents /></DashboardLayout>} />
      <Route path="/instructor/uploads" element={<DashboardLayout userRole="Instructor" menuItems={instructorMenu}><PlaceholderPage title="Upload Resources" /></DashboardLayout>} />
      <Route path="/instructor/profile" element={<DashboardLayout userRole="Instructor" menuItems={instructorMenu}><Profile /></DashboardLayout>} />
      
      <Route path="/admin" element={<DashboardLayout userRole="Admin" menuItems={adminMenu}><AdminDashboard /></DashboardLayout>} />
      <Route path="/admin/cms" element={<DashboardLayout userRole="Admin" menuItems={adminMenu}><AdminDashboard activeTabOverride="cms" /></DashboardLayout>} />
      <Route path="/admin/users" element={<DashboardLayout userRole="Admin" menuItems={adminMenu}><AdminDashboard activeTabOverride="users" /></DashboardLayout>} />
      <Route path="/admin/applications" element={<DashboardLayout userRole="Admin" menuItems={adminMenu}><AdminDashboard activeTabOverride="applications" /></DashboardLayout>} />
      <Route path="/admin/enquiries" element={<DashboardLayout userRole="Admin" menuItems={adminMenu}><AdminDashboard activeTabOverride="enquiries" /></DashboardLayout>} />
      <Route path="/admin/settings" element={<DashboardLayout userRole="Admin" menuItems={adminMenu}><PlaceholderPage title="System Settings" /></DashboardLayout>} />
    </Routes>
  );
}
