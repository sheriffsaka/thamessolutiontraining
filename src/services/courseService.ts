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
