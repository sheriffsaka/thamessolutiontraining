-- Seed Data for Courses
-- This script populates the courses table with the initial catalog

-- Helper to get category ID by slug
DO $$
DECLARE
    hsc_id INT;
    assessor_id INT;
    fs_id INT;
    mand_id INT;
    care_id INT;
BEGIN
    SELECT id INTO hsc_id FROM categories WHERE slug = 'health-and-social-care';
    SELECT id INTO assessor_id FROM categories WHERE slug = 'assessor';
    SELECT id INTO fs_id FROM categories WHERE slug = 'functional-skills';
    SELECT id INTO mand_id FROM categories WHERE slug = 'mandatory';
    SELECT id INTO care_id FROM categories WHERE slug = 'care-certificate';

    -- HEALTH AND SOCIAL CARE
    INSERT INTO courses (category_id, category, sub_category, title, slug, description, long_description, duration, image_url) VALUES
    (hsc_id, 'health-and-social-care', 'Level 2 Qualifications', 'Level 2 Adult Social Care Certificate', 'level-2-adult-social-care', 'Foundational standards for health and social care roles.', 'The Care Certificate is an agreed set of standards that define the knowledge, skills and behaviours expected of specific job roles...', '6 Months', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600'),
    (hsc_id, 'health-and-social-care', 'Level 2 Qualifications', 'Level 2 Diploma in Clinical Healthcare Support', 'level-2-clinical-healthcare-support', 'Training for clinical support staff working with healthcare professionals.', 'This qualification is aimed at individuals working in a clinical healthcare environment under the supervision of a healthcare professional.', '6 Months', 'https://images.unsplash.com/photo-1584515839997-3afb3b3c990b?q=80&w=600'),
    (hsc_id, 'health-and-social-care', 'Level 2 Qualifications', 'Level 2 Diploma in Care', 'level-2-diploma-in-care', 'Occupational qualification for adult care settings.', 'The Level 2 Diploma in Care is an occupational qualification for learners who work in Adult Care settings in England.', '6 Months', 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?q=80&w=600'),
    
    (hsc_id, 'health-and-social-care', 'Level 3 Qualifications', 'Level 3 Diploma in Adult Care', 'level-3-diploma-in-adult-care', 'Advanced training for workers with technical care responsibilities.', 'This Level 3 Diploma is specifically for those already working in adult care who wish to progress into a more senior or specialized role.', '12 Months', 'https://images.unsplash.com/photo-1516549221187-df9bd638dfd1?q=80&w=600'),
    (hsc_id, 'health-and-social-care', 'Level 3 Qualifications', 'Level 3 Health and Social Care (Adult)', 'level-3-health-and-social-care-adult', 'Advanced qualification for various health and social care settings.', 'This advanced qualification is designed for healthcare professionals working in more complex environments.', '12 Months', 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600'),
    (hsc_id, 'health-and-social-care', 'Level 3 Qualifications', 'Level 3 Healthcare Support Service', 'level-3-healthcare-support-service', 'Specialized healthcare support role training.', 'Tailored for healthcare support workers, this Level 3 qualification focuses on elevated clinical skills and professional accountability.', '12 Months', 'https://images.unsplash.com/photo-1505751172107-164746ecf130?q=80&w=600'),
    
    (hsc_id, 'health-and-social-care', 'Level 5 Qualifications', 'Level 5 Diploma in Health and Social Care and Children and Young People', 'level-5-health-social-care-children', 'Managerial and lead practitioner level qualification.', 'The Level 5 Diploma is the recognized qualification for those managing services for adults or children and young people.', '18 Months', 'https://images.unsplash.com/photo-1454165833767-02a6e3099033?q=80&w=600'),
    (hsc_id, 'health-and-social-care', 'Level 5 Qualifications', 'Level 5 Diploma in Leadership and Management', 'level-5-leadership-membership', 'Strategic leadership training for care facility managers.', 'This high-level qualification is focused on the professional development of leaders and managers in the social care sector.', '18 Months', 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?q=80&w=600'),
    
    (hsc_id, 'health-and-social-care', 'Child Care', 'Level 3 Diploma for Residential Childcare', 'level-3-residential-childcare', 'Professional skills for residential childcare environments.', 'This diploma provides the essential skills for those working in residential childcare environments.', '12 Months', 'https://images.unsplash.com/photo-1484981138541-3d074aa97716?q=80&w=600'),
    (hsc_id, 'health-and-social-care', 'Child Care', 'Level 3 Diploma in Early Years Educator', 'level-3-early-years-educator', 'Qualification for early childhood education professionals.', 'Designed for aspiring early years educators, this course covers the EYFS framework and the holistic development of children.', '12 Months', 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=600'),
    
    -- ASSESSOR COURSES
    (assessor_id, 'assessor', 'Assessor', 'RQF Level 3 Award in Assessing Competency in the Work Environment', 'level-3-award-assessing-competency', 'Accredited training for workplace competency assessors.', 'This RQF Level 3 Award is for practitioners who assess the competence of candidates in their work environment.', '3 Months', 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=600'),
    (assessor_id, 'assessor', 'Assessor', 'RQF Level 3 in Certificate in Assessing Vocational Achievement', 'level-3-certificate-assessing-vocational', 'Comprehensive vocational achievement assessment qualification.', 'Commonly known as the CAVA, this certificate is the comprehensive qualification for those who want to assess in both the workplace and the training environment.', '4 Months', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600'),
    
    -- FUNCTIONAL SKILLS
    (fs_id, 'functional-skills', 'English', 'Level 2 English Functional Skills Qualification', 'level-2-english-functional-skills', 'Professional English literacy and communication skills.', 'This Level 2 English qualification focuses on the mastery of English skills for real-life and professional applications.', '3 Months', 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=600'),
    (fs_id, 'functional-skills', 'Maths', 'Level 2 Maths Functional Skills Qualification', 'level-2-maths-functional-skills', 'Practical mathematical competency for the workplace.', 'Level 2 Maths Functional Skills provides learners with the practical mathematical tools required for professional success.', '3 Months', 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600'),
    
    -- MANDATORY TRAINING
    (mand_id, 'mandatory', 'Safety', 'Manual Handling', 'manual-handling', 'Safe moving and handling of people and objects in a care environment.', 'This comprehensive Manual Handling course provides essential knowledge and practical skills for the safe moving of people and objects.', '1 Day', 'https://images.unsplash.com/photo-1581594632702-f22114888183?q=80&w=600'),
    (mand_id, 'mandatory', 'Safety', 'First Aid', 'first-aid-basics', 'Essential life-saving first aid skills for healthcare professionals.', 'Specifically designed for health and social care staff, this course covers basic life support and emergency interventions.', '1 Day', 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600')
    ON CONFLICT (slug) DO UPDATE SET 
        category_id = EXCLUDED.category_id,
        category = EXCLUDED.category,
        sub_category = EXCLUDED.sub_category,
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        long_description = EXCLUDED.long_description,
        duration = EXCLUDED.duration,
        image_url = EXCLUDED.image_url;

    -- SITE CONTENTS
    INSERT INTO site_contents (id, section, content) VALUES
    ('about_page', 'about', '{
      "title": "Empowering Future Professionals",
      "description": "Thames Solution Training & Consultancy Ltd is a leading provider of professional training and vocational qualifications in London. We bridge the gap between ambition and employment.",
      "mission": "To provide high-quality, accessible, and inclusive training that empowers individuals to achieve their full potential and secure meaningful employment. We are dedicated to excellence in education and consultancy."
    }'::jsonb),
    ('home_hero', 'home', '{
      "title": "Master Your Future with Professional Qualifications",
      "subtitle": "Industry-leading training in Health & Social Care, Assessing, and Mandatory Skills.",
      "cta_primary": "Explore Courses",
      "cta_secondary": "Get in Touch"
    }'::jsonb)
    ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content;

    -- TESTIMONIALS
    INSERT INTO testimonials (student_name, course_name, content, rating) VALUES
    ('James Wilson', 'Level 3 Diploma in Adult Care', 'The instructors were incredibly supportive. I managed to balance my studies with my full-time job and gained the promotion I was aiming for.', 5),
    ('Amara Okafor', 'Assessor Awards', 'The training was very practical. I felt confident starting my new role as a clinical assessor immediately after finishing.', 5),
    ('Robert Teo', 'Health & Social Care Level 5', 'Highly professional consultants. They helped our team achieve full compliance with CQC standards.', 5)
    ON CONFLICT DO NOTHING;

END $$;
