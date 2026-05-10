-- Comprehensive Supabase SQL Schema for Thames Solution
-- This script is idempotent and can be run multiple times safely.
-- IMPORTANT: Use THIS file (supabase_schema.sql) for all database updates.

-- 1. Profiles
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  date_of_birth TEXT,
  emergency_contact TEXT,
  gender TEXT,
  employment_status TEXT,
  managed_password TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
  is_approved BOOLEAN DEFAULT FALSE,
  avatar_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ensure columns exist
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS emergency_contact TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employment_status TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS managed_password TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'student';

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  app_record RECORD;
  is_admin_user BOOLEAN;
BEGIN
  -- 1. Identify Admin
  is_admin_user := LOWER(NEW.email) IN ('thamestraining@outlook.com', 'sheriffdeenalade@gmail.com');

  -- 2. Insert/Update Profile (Idempotent)
  INSERT INTO public.profiles (id, full_name, email, role, managed_password, is_approved)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    CASE WHEN is_admin_user THEN 'admin' ELSE 'student' END,
    NEW.raw_user_meta_data->>'password',
    is_admin_user
  )
  ON CONFLICT (id) DO UPDATE SET 
    email = EXCLUDED.email,
    full_name = CASE WHEN profiles.full_name IS NULL OR profiles.full_name = '' THEN EXCLUDED.full_name ELSE profiles.full_name END,
    role = CASE WHEN is_admin_user THEN 'admin' ELSE profiles.role END,
    is_approved = CASE WHEN is_admin_user THEN TRUE ELSE profiles.is_approved END;

  -- 3. Check for application (Case-insensitive)
  -- We allow any status here, but will only auto-enroll if it's approved/onboarded
  SELECT * INTO app_record FROM public.applications 
  WHERE LOWER(email) = LOWER(NEW.email)
  ORDER BY created_at DESC
  LIMIT 1;

  IF app_record.id IS NOT NULL THEN
    -- Sync profile data from application
    BEGIN
      UPDATE public.profiles SET
        phone = COALESCE(phone, app_record.phone),
        address = COALESCE(address, app_record.address),
        date_of_birth = COALESCE(date_of_birth, app_record.date_of_birth),
        emergency_contact = COALESCE(emergency_contact, app_record.emergency_contact),
        gender = COALESCE(gender, app_record.gender),
        employment_status = COALESCE(employment_status, app_record.employment_status),
        managed_password = COALESCE(managed_password, app_record.generated_password),
        -- Auto approve if the application is already approved/onboarded
        is_approved = CASE WHEN app_record.status IN ('approved', 'onboarded') THEN TRUE ELSE is_approved END
      WHERE id = NEW.id;
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;

    -- If application is already approved or onboarded, auto-enroll
    IF app_record.status IN ('approved', 'onboarded') THEN
      BEGIN
        INSERT INTO public.enrollments (student_id, course_id, status)
        VALUES (NEW.id, app_record.course_id, 'active')
        ON CONFLICT (student_id, course_id) DO NOTHING;
      EXCEPTION WHEN OTHERS THEN
        NULL;
      END;
      
      -- Ensure application is marked as onboarded
      UPDATE public.applications SET status = 'onboarded' WHERE id = app_record.id;
    END IF;
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for Applications: Handle case where admin updates status
CREATE OR REPLACE FUNCTION public.handle_application_onboarding()
RETURNS TRIGGER AS $$
DECLARE
  profile_id UUID;
BEGIN
  -- 1. Identity Guard
  IF NEW.email IS NULL THEN
    RETURN NEW;
  END IF;

  -- 2. If status moves to 'approved' or 'onboarded'
  IF (NEW.status = 'onboarded' OR NEW.status = 'approved') AND (OLD.status IS NULL OR OLD.status != NEW.status) THEN
    -- Check if profile exists
    SELECT id INTO profile_id FROM public.profiles WHERE LOWER(email) = LOWER(NEW.email) LIMIT 1;
    
    IF profile_id IS NOT NULL THEN
      -- Create enrollment if course_id present
      IF NEW.course_id IS NOT NULL THEN
        BEGIN
          INSERT INTO public.enrollments (student_id, course_id, status)
          VALUES (profile_id, NEW.course_id, 'active')
          ON CONFLICT (student_id, course_id) DO NOTHING;
        EXCEPTION WHEN OTHERS THEN
          NULL;
        END;
      END IF;

      -- Update profile: Important to set is_approved = TRUE
      BEGIN
        UPDATE public.profiles SET
          is_approved = TRUE,
          phone = COALESCE(phone, NEW.phone),
          address = COALESCE(address, NEW.address),
          date_of_birth = COALESCE(date_of_birth, NEW.date_of_birth),
          emergency_contact = COALESCE(emergency_contact, NEW.emergency_contact),
          gender = COALESCE(gender, NEW.gender),
          employment_status = COALESCE(employment_status, NEW.employment_status),
          managed_password = COALESCE(managed_password, NEW.generated_password),
          updated_at = NOW()
        WHERE id = profile_id;
      EXCEPTION WHEN OTHERS THEN
        -- Log or ignore to allow application update to proceed
        NULL;
      END;
      
      -- Coerce status to onboarded if profile was found and updated
      NEW.status := 'onboarded';
    END IF;
  END IF;
  
  -- 3. If status is rejected, make sure profile is not approved
  IF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
    BEGIN
      SELECT id INTO profile_id FROM public.profiles WHERE LOWER(email) = LOWER(NEW.email) LIMIT 1;
      IF profile_id IS NOT NULL THEN
        UPDATE public.profiles SET is_approved = FALSE WHERE id = profile_id;
      END IF;
    EXCEPTION WHEN OTHERS THEN
      NULL;
    END;
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_application_updated ON public.applications;
CREATE TRIGGER on_application_updated
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE PROCEDURE public.handle_application_onboarding();

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Promote existing users to admin
UPDATE public.profiles SET role = 'admin' WHERE email IN ('thamestraining@outlook.com', 'sheriffdeenalade@gmail.com');

-- 2. Storage Setup
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO NOTHING;

DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
    DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
    DROP POLICY IF EXISTS "Admin All Access" ON storage.objects;
END $$;

CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
CREATE POLICY "Authenticated Upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'uploads');
CREATE POLICY "Admin All Access" ON storage.objects FOR ALL TO authenticated 
USING (bucket_id = 'uploads' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
WITH CHECK (bucket_id = 'uploads' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- 3. Categories & Courses
CREATE TABLE IF NOT EXISTS public.categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  order_index INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL,
  category TEXT,
  sub_category TEXT,
  title TEXT NOT NULL,
  slug TEXT UNIQUE,
  description TEXT,
  long_description TEXT,
  outcomes TEXT[],
  requirements TEXT[],
  duration TEXT,
  certification_info TEXT,
  image_url TEXT,
  instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Ensure course columns
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES public.categories(id) ON DELETE SET NULL;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS outcomes TEXT[];
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS requirements TEXT[];
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS instructor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
ALTER TABLE public.courses ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;

-- 4. Enrollments & Lessons
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  video_url TEXT,
  order_index INTEGER NOT NULL,
  duration TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  progress INTEGER DEFAULT 0,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, course_id)
);

-- Handle migration from user_id to student_id if needed
DO $$ 
BEGIN 
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='enrollments' AND column_name='user_id') THEN
    ALTER TABLE public.enrollments RENAME COLUMN user_id TO student_id;
  END IF;
END $$;

-- 5. Applications & Enquiries
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT,
  course_title TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth TEXT,
  gender TEXT,
  employment_status TEXT,
  address TEXT,
  emergency_contact TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'onboarded')),
  generated_password TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT applications_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE SET NULL
);

-- Ensure all columns exist for applications
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS course_title TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS date_of_birth TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS employment_status TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS emergency_contact TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.applications ADD COLUMN IF NOT EXISTS generated_password TEXT;

CREATE TABLE IF NOT EXISTS public.enquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. CMS & Support
CREATE TABLE IF NOT EXISTS public.site_contents (
  id TEXT PRIMARY KEY,
  section TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  course_name TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Announcements & Notifications
CREATE TABLE IF NOT EXISTS public.announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.announcements ADD COLUMN IF NOT EXISTS course_id TEXT;

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Policies
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

-- Profiles: Viewable by all, editable by owner
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "Users can insert own profile." ON public.profiles;
CREATE POLICY "Users can insert own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Courses: Published viewable by all, all viewable by admins
DROP POLICY IF EXISTS "Courses are viewable by everyone." ON public.courses;
CREATE POLICY "Courses are viewable by everyone." ON public.courses FOR SELECT USING (is_published = true OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));
DROP POLICY IF EXISTS "Admins can manage courses." ON public.courses;
CREATE POLICY "Admins can manage courses." ON public.courses FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Applications: Anyone can insert, admins can view and manage
DROP POLICY IF EXISTS "Anyone can apply." ON public.applications;
CREATE POLICY "Anyone can apply." ON public.applications FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can manage applications." ON public.applications;
CREATE POLICY "Admins can manage applications." ON public.applications FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Site Contents: Viewable by all, admins can manage
DROP POLICY IF EXISTS "Site content is viewable by everyone." ON public.site_contents;
CREATE POLICY "Site content is viewable by everyone." ON public.site_contents FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage site content." ON public.site_contents;
CREATE POLICY "Admins can manage site content." ON public.site_contents FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Generic Public Read Policies
DROP POLICY IF EXISTS "Categories are viewable by everyone." ON public.categories;
CREATE POLICY "Categories are viewable by everyone." ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Announcements viewable by everyone." ON public.announcements;
CREATE POLICY "Announcements viewable by everyone." ON public.announcements FOR SELECT USING (true);

DROP POLICY IF EXISTS "FAQs are viewable by everyone." ON public.faqs;
CREATE POLICY "FAQs are viewable by everyone." ON public.faqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Testimonials are viewable by everyone." ON public.testimonials;
CREATE POLICY "Testimonials are viewable by everyone." ON public.testimonials FOR SELECT USING (true);

-- Enrollments: Users view own, admins manage
DROP POLICY IF EXISTS "Users can view own enrollments." ON public.enrollments;
CREATE POLICY "Users can view own enrollments." ON public.enrollments FOR SELECT USING (auth.uid() = student_id);
DROP POLICY IF EXISTS "Admins can manage enrollments." ON public.enrollments;
CREATE POLICY "Admins can manage enrollments." ON public.enrollments FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Enquiries: Anyone can insert, admins manage
DROP POLICY IF EXISTS "Anyone can send enquiries." ON public.enquiries;
CREATE POLICY "Anyone can send enquiries." ON public.enquiries FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can manage enquiries." ON public.enquiries;
CREATE POLICY "Admins can manage enquiries." ON public.enquiries FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Notifications: Users view own
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can view own notifications." ON public.notifications;
CREATE POLICY "Users can view own notifications." ON public.notifications FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "Admins can manage all notifications." ON public.notifications;
CREATE POLICY "Admins can manage all notifications." ON public.notifications FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Automatic Notification Trigger for Applications
CREATE OR REPLACE FUNCTION public.notify_on_application_status_change()
RETURNS TRIGGER AS $$
DECLARE
  profile_id UUID;
BEGIN
  IF (NEW.status != OLD.status) AND (NEW.status IN ('approved', 'onboarded')) THEN
    SELECT id INTO profile_id FROM public.profiles WHERE LOWER(email) = LOWER(NEW.email) LIMIT 1;
    
    IF profile_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, title, message, link)
      VALUES (
        profile_id,
        'Application ' || NEW.status,
        'Congratulations! Your application for ' || COALESCE(NEW.course_title, 'your course') || ' has been ' || NEW.status || '. You can now access your lessons.',
        '/dashboard'
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_notify_on_application_status_change ON public.applications;
CREATE TRIGGER tr_notify_on_application_status_change
  AFTER UPDATE ON public.applications
  FOR EACH ROW EXECUTE PROCEDURE public.notify_on_application_status_change();

-- 9. Seed Data
INSERT INTO public.categories (name, slug, icon, order_index) VALUES
('Health & Social Care', 'health-and-social-care', 'Heart', 1),
('Assessor Courses', 'assessor', 'CheckCircle', 2),
('Functional Skills', 'functional-skills', 'BookOpen', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.site_contents (id, section, content) VALUES
('home_hero', 'home', '{
  "slides": [
    {
      "title": "Health and Social Care",
      "subtitle": "Professional Excellence",
      "desc": "Empowering healthcare professionals with accredited Level 2 to Level 5 diplomas and specialized childcare qualifications.",
      "video": "https://res.cloudinary.com/di7okmjsx/video/upload/v1777705199/health-socialworker1_kfe1oe.mp4",
      "link": "/courses?category=health-and-social-care"
    },
    {
      "title": "Assessor Courses",
      "subtitle": "Vocational Mastery",
      "desc": "Achieve the gold standard in vocational assessment with our RQF Level 3 Award and Certificate programs.",
      "video": "https://res.cloudinary.com/di7okmjsx/video/upload/v1777509647/the-trainer-in-the-gray-blazer-speaks-and-gestures_oir7sf.mp4",
      "link": "/courses?category=assessor"
    },
    {
      "title": "Functional Skills",
      "subtitle": "Essential Foundations",
      "desc": "Future-proof your career with Level 2 English and Maths qualifications essential for professional growth.",
      "video": "https://res.cloudinary.com/di7okmjsx/video/upload/v1777656036/FunctionalTraining_exmzfz.mp4",
      "link": "/courses?category=functional-skills"
    },
    {
      "title": "Mandatory Training",
      "subtitle": "Compliance Excellence",
      "desc": "Ensure 100% workplace compliance with essential training in First Aid, Safeguarding, Mental Capacity, and more.",
      "video": "https://res.cloudinary.com/di7okmjsx/video/upload/v1777664670/care_cert_ules5v.mp4",
      "link": "/courses?category=mandatory"
    },
    {
      "title": "Care Certificate",
      "subtitle": "Foundation Standards",
      "desc": "Master the 15 fundamental standards of care required for all health and social care professionals in the UK.",
      "video": "https://res.cloudinary.com/di7okmjsx/video/upload/v1777664670/care_cert_ules5v.mp4",
      "link": "/courses?category=care-certificate"
    }
  ]
}'::jsonb),
('home_about', 'home', '{
  "title": "The TMS Advantage",
  "description": "At Thames Solution Training, we don''t just provide courses; we forge pathways to professional mastery through rigorous standards and innovative pedagogy.",
  "cta_label": "Our Philosophy",
  "cta_link": "/about"
}'::jsonb),
('about_page', 'about', '{
  "title": "Empowering Careers Through \nExpert Training",
  "description": "Thames Solution Training & Consultancy Ltd is a leading provider of professional training and vocational qualifications in London. We bridge the gap between ambition and employment.",
  "mission": "To provide high-quality, accessible, and inclusive training that empowers individuals to achieve their full potential and secure meaningful employment. We are dedicated to excellence in education and consultancy."
}'::jsonb),
('safeguarding_policy', 'policies', '{
  "title": "Safeguarding",
  "subtitle": "Protecting our community and ensuring a safe learning environment for all. We provide dedicated support for every learner to thrive.",
  "content": "Thames Solution Training & Consultancy Ltd is committed to safeguarding and promoting the welfare of all our learners. We believe that everyone has the right to live and learn in an environment that is free from harm, neglect, and abuse. Protecting our learners, staff, and visitors is our highest priority. We provide a safe, supportive, and inclusive environment for everyone to achieve their potential."
}'::jsonb),
('prevent_duty', 'compliance', '{
  "title": "The Prevent Duty",
  "subtitle": "Our commitment to protecting learners from radicalisation and extremism.",
  "text": "The Prevent duty is the duty in the Counter-Terrorism and Security Act 2015 on specified authorities, in the exercise of their functions, to have due regard to the need to prevent people from being drawn into terrorism.",
  "details_json": [
    {"title": "Awareness", "desc": "Ensuring staff and students can identify signs of radicalisation."},
    {"title": "Risk Assessment", "desc": "Regularly reviewing potential threats within our community."},
    {"title": "Support", "desc": "Providing safe spaces for discussion and reporting concerns."}
  ]
}'::jsonb),
('british_values', 'compliance', '{
  "title": "British Values",
  "subtitle": "Promoting democracy, the rule of law, individual liberty, and mutual respect.",
  "text": "We are dedicated to promoting fundamental British values in all our learning environments.",
  "details_json": [
    {"title": "Democracy", "desc": "Respect for democracy and support for participation in the democratic process."},
    {"title": "Rule of Law", "desc": "Respect for the basis on which the law is made and applied in the UK."},
    {"title": "Liberty", "desc": "Support for individual liberty within the framework of the law."},
    {"title": "Respect", "desc": "Support for mutual respect and tolerance of those with different faiths and beliefs."}
  ]
}'::jsonb),
('employability_support', 'services', '{
  "title": "Employability Support",
  "subtitle": "Helping you transition from learner to professional.",
  "text": "Our employability team provides personalized support to help you secure the job you deserve.",
  "details_json": [
    {"title": "CV Workshops", "desc": "Expert guidance on crafting a professional resume."},
    {"title": "Interview Prep", "desc": "Mock interviews and feedback from industry recruiters."},
    {"title": "Job Placement", "desc": "Direct connections to our network of employer partners."}
  ]
}'::jsonb),
('policies_intro', 'policies', '{
  "title": "Our Policies & Procedures",
  "description": "Thames Solution Training operates with transparency and integrity. Explore our governing documents below."
}'::jsonb),
('p_privacy', 'policies', '{
  "title": "Privacy Policy",
  "content": "We take your privacy seriously. This policy outlines how we collect, use, and protect your personal data in accordance with GDPR regulations."
}'::jsonb),
('p_terms', 'policies', '{
  "title": "Terms of Service",
  "content": "By using our services, you agree to comply with our terms and conditions. These terms govern your enrollment, access to materials, and conduct as a student."
}'::jsonb),
('p_gdpr', 'policies', '{
  "title": "GDPR Compliance",
  "content": "Our data protection practices are fully compliant with the General Data Protection Regulation (GDPR). We ensure that your information is stored securely and processed lawfully."
}'::jsonb),
('disclaimer_content', 'policies', '{
  "title": "Disclaimer",
  "content": "While we strive for accuracy, Thames Solution Training does not guarantee that the information on this website is always up-to-date. We reserve the right to modify course details and prices without notice."
}'::jsonb),
('site_settings', 'global', '{
  "phone": "07426566335",
  "email": "admin@thamessolutiontraining.co.uk",
  "address": "Capital House, Catford, London SE6 4AS",
  "facebook": "#",
  "twitter": "#",
  "instagram": "#",
  "linkedin": "#",
  "banner_text": "Enrollment for Summer 2024 is now open! 🚀",
  "banner_active": true
}'::jsonb)
ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content;
