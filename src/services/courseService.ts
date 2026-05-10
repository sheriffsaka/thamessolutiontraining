import { supabase, Course } from '../lib/supabase';

export async function getCourses(category: string = 'all') {
  try {
    let query = supabase
      .from('courses')
      .select('*');

    // If category is not 'all', we try multiple matching strategies
    if (category !== 'all') {
      const normalizedCategory = category.toLowerCase().trim();
      const withSpaces = normalizedCategory.replace(/-/g, ' ');
      const withAmpersand = normalizedCategory.replace('-and-', ' & ');
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .or(`category.eq."${category}",category.ilike."%${withSpaces}%",category.ilike."%${withAmpersand}%"`);
      
      if (!error && data && data.length > 0) {
        return data as Course[];
      }
      
      // If we still have nothing, try even broader
      const { data: broadData } = await supabase
        .from('courses')
        .select('*')
        .ilike('category', `%${category.split('-')[0]}%`);
      
      if (broadData && broadData.length > 0) return broadData as Course[];
      
      // No matches found for this category, don't return all courses
      return [];
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }

    return data as Course[];
  } catch (err) {
    console.error('Unexpected error in getCourses:', err);
    return [];
  }
}

export async function getCourseById(id: string) {
  const { data, error } = await supabase
    .from('courses')
    .select('*, lessons(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching course:', error);
    return null;
  }

  return data;
}

export async function getEnrollments(userId: string) {
  const { data, error } = await supabase
    .from('enrollments')
    .select('*, courses(*)')
    .eq('student_id', userId);

  if (error) {
    console.error('Error fetching enrollments:', error);
    return [];
  }

  return data;
}

export async function getApplicationsByEmail(email: string) {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
    return [];
  }

  return data;
}

function toSentenceCase(str: string) {
  if (!str) return str;
  const lower = str.toLowerCase().trim();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

export async function getCategoryData() {
  try {
    const { data: courses, error } = await (supabase
      .from('courses')
      .select('category')
      .not('category', 'is', null) as any);

    if (error) throw error;

    const uniqueCategoryIds: string[] = Array.from(new Set((courses || []).map((c: any) => c.category as string)));
    
    // Base metadata for known categories
    const metadataMap: Record<string, { title: string, desc: string, image: string }> = {
      'health-and-social-care': {
        title: 'Health and social care',
        desc: 'Elite clinical and administrative training for modern healthcare sectors.',
        image: 'https://res.cloudinary.com/di7okmjsx/image/upload/v1777909848/Training_for_clinical_support_staff_3_rpetqk.jpg?auto=format&fit=crop&q=80&w=800'
      },
      'assessor': {
        title: 'Assessor courses',
        desc: 'Professional qualifications for vocational assessors and quality assurance.',
        image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800'
      },
      'functional-skills': {
        title: 'Functional skills',
        desc: 'Essential English, Maths, and ICT skills for career advancement.',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800'
      },
      'mandatory': {
        title: 'Mandatory training',
        desc: 'Core compliance training: First Aid, Health & Safety, and Moving & Handling.',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
      },
      'care-certificate': {
        title: 'Care certificate',
        desc: 'Foundation standards for workers new to the health and social care sector.',
        image: 'https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800'
      }
    };

    return uniqueCategoryIds.map((id: string) => {
      const meta = metadataMap[id];
      return {
        id,
        title: meta?.title || toSentenceCase(id.replace(/-/g, ' ')),
        desc: meta?.desc || `Comprehensive ${id.replace(/-/g, ' ')} training modules.`,
        image: meta?.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800'
      };
    });
  } catch (err) {
    console.error('Error in getCategoryData:', err);
    return [];
  }
}

export async function getNavbarCourses() {
  try {
    const { data: courses, error } = await supabase
      .from('courses')
      .select('id, title, category, sub_category');

    if (error) throw error;

    const hierarchy: Record<string, any> = {};

    (courses || []).forEach(course => {
      const cat = course.category || 'Other';
      const sub = course.sub_category || 'General';

      if (!hierarchy[cat]) {
        hierarchy[cat] = {
          name: cat,
          items: {}
        };
      }

      if (!hierarchy[cat].items[sub]) {
        hierarchy[cat].items[sub] = {
          name: sub,
          items: []
        };
      }

      hierarchy[cat].items[sub].items.push({
        name: course.title,
        path: `/courses/${course.id}`
      });
    });

    return Object.keys(hierarchy).map(catKey => {
      const cat = hierarchy[catKey];
      const categoryId = catKey.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and').trim();
      
      return {
        name: toSentenceCase(catKey === 'health-and-social-care' ? 'Health and social care' : catKey),
        id: categoryId,
        path: `/courses?category=${categoryId}`,
        items: Object.keys(cat.items).map(subKey => {
          const sub = cat.items[subKey];
          return {
            name: subKey,
            path: `/courses?category=${categoryId}&sub=${subKey.toLowerCase().replace(/\s+/g, '-')}`,
            items: sub.items
          };
        })
      };
    });
  } catch (err) {
    console.error('Error in getNavbarCourses:', err);
    return [];
  }
}
