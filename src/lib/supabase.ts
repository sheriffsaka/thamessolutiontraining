/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Use placeholder to prevent crash during initialization if variables are missing
const isConfigured = supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http');

export const supabase = createClient<Database>(
  isConfigured ? supabaseUrl : 'https://placeholder.supabase.co',
  isConfigured ? supabaseAnonKey : 'placeholder'
);

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Course = Database['public']['Tables']['courses']['Row'];
export type Lesson = Database['public']['Tables']['lessons']['Row'];
export type Enrollment = Database['public']['Tables']['enrollments']['Row'];

export enum UserRole {
  STUDENT = 'student',
  INSTRUCTOR = 'instructor',
  ADMIN = 'admin'
}
