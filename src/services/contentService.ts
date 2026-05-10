import { supabase } from '../lib/supabase';

export async function getAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching announcements:', error);
    return [];
  }
  return data;
}

export async function getFAQs() {
  const { data, error } = await supabase
    .from('faqs')
    .select('*')
    .eq('is_active', true)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
  return data;
}

export async function getSiteContent(section: string) {
  const { data, error } = await supabase
    .from('site_contents')
    .select('*')
    .eq('section', section);

  if (error) {
    console.error('Error fetching site content:', error);
    return [];
  }
  return data;
}

export async function getTeam() {
  const { data, error } = await supabase
    .from('team_members')
    .select('*')
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching team:', error);
    return [];
  }
  return data;
}

export async function getTestimonials() {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
  return data;
}

export async function getNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
  return data;
}
