export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      site_contents: {
        Row: {
          id: string
          section: string
          content: Json
          updated_at: string | null
        }
        Insert: {
          id: string
          section: string
          content?: Json
          updated_at?: string | null
        }
        Update: {
          id?: string
          section?: string
          content?: Json
          updated_at?: string | null
        }
      }
      faqs: {
        Row: {
          id: string
          category: string | null
          question: string
          answer: string
          order_index: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category?: string | null
          question: string
          answer: string
          order_index?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          category?: string | null
          question?: string
          answer?: string
          order_index?: number
          is_active?: boolean
          created_at?: string
        }
      }
      announcements: {
        Row: {
          id: string
          course_id: string | null
          title: string
          content: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          course_id?: string | null
          title: string
          content: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string | null
          title?: string
          content?: string
          is_active?: boolean
          created_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          title: string
          message: string
          is_read: boolean
          link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          message: string
          is_read?: boolean
          link?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          message?: string
          is_read?: boolean
          link?: string | null
          created_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          slug: string
          description: string | null
          icon: string | null
          order_index: number
        }
        Insert: {
          id?: number
          name: string
          slug: string
          description?: string | null
          icon?: string | null
          order_index?: number
        }
        Update: {
          id?: number
          name?: string
          slug?: string
          description?: string | null
          icon?: string | null
          order_index?: number
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          role: 'student' | 'instructor' | 'admin'
          avatar_url: string | null
          phone: string | null
          address: string | null
          date_of_birth: string | null
          gender: string | null
          emergency_contact: string | null
          employment_status: string | null
          managed_password: string | null
          is_approved: boolean
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          role?: 'student' | 'instructor' | 'admin'
          avatar_url?: string | null
          is_approved?: boolean
          phone?: string | null
          address?: string | null
          date_of_birth?: string | null
          gender?: string | null
          emergency_contact?: string | null
          employment_status?: string | null
          managed_password?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          role?: 'student' | 'instructor' | 'admin'
          is_approved?: boolean
          avatar_url?: string | null
          phone?: string | null
          address?: string | null
          date_of_birth?: string | null
          gender?: string | null
          emergency_contact?: string | null
          employment_status?: string | null
          managed_password?: string | null
          updated_at?: string | null
        }
      }
      courses: {
        Row: {
          id: string
          category_id: number | null
          category: string | null
          sub_category: string | null
          title: string
          slug: string | null
          description: string | null
          long_description: string | null
          outcomes: string[] | null
          requirements: string[] | null
          duration: string | null
          certification_info: string | null
          image_url: string | null
          syllabus_url: string | null
          instructor_id: string | null
          is_published: boolean
          created_at: string
        }
        Insert: {
          id?: string
          category_id?: number | null
          category?: string | null
          sub_category?: string | null
          title: string
          slug?: string | null
          description?: string | null
          long_description?: string | null
          outcomes?: string[] | null
          requirements?: string[] | null
          duration?: string | null
          certification_info?: string | null
          image_url?: string | null
          syllabus_url?: string | null
          instructor_id?: string | null
          is_published?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: number | null
          category?: string | null
          sub_category?: string | null
          title?: string
          slug?: string | null
          description?: string | null
          long_description?: string | null
          outcomes?: string[] | null
          requirements?: string[] | null
          duration?: string | null
          certification_info?: string | null
          image_url?: string | null
          syllabus_url?: string | null
          instructor_id?: string | null
          is_published?: boolean
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          course_id: string
          title: string
          content: string | null
          video_url: string | null
          order_index: number
          duration: string | null
          created_at: string
        }
        Insert: {
          id?: string
          course_id: string
          title: string
          content?: string | null
          video_url?: string | null
          order_index: number
          duration?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string
          title?: string
          content?: string | null
          video_url?: string | null
          order_index?: number
          duration?: string | null
          created_at?: string
        }
      }
      applications: {
        Row: {
          id: string
          course_id: string | null
          course_title: string | null
          full_name: string
          email: string
          phone: string
          date_of_birth: string | null
          gender: string | null
          employment_status: string | null
          address: string | null
          emergency_contact: string | null
          notes: string | null
          status: 'pending' | 'approved' | 'rejected' | 'onboarded'
          generated_password: string | null
          created_at: string
        }
        Insert: {
          id?: string
          course_id?: string | null
          course_title?: string | null
          full_name: string
          email: string
          phone: string
          date_of_birth?: string | null
          gender?: string | null
          employment_status?: string | null
          address?: string | null
          emergency_contact?: string | null
          notes?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'onboarded'
          generated_password?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          course_id?: string | null
          course_title?: string | null
          full_name?: string
          email?: string
          phone?: string
          date_of_birth?: string | null
          gender?: string | null
          employment_status?: string | null
          address?: string | null
          emergency_contact?: string | null
          notes?: string | null
          status?: 'pending' | 'approved' | 'rejected' | 'onboarded'
          generated_password?: string | null
          created_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          student_id: string
          course_id: string
          progress: number
          status: 'active' | 'completed' | 'dropped'
          enrolled_at: string
        }
        Insert: {
          id?: string
          student_id: string
          course_id: string
          progress?: number
          status?: 'active' | 'completed' | 'dropped'
          enrolled_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          course_id?: string
          progress?: number
          status?: 'active' | 'completed' | 'dropped'
          enrolled_at?: string
        }
      }
      enquiries: {
        Row: {
          id: string
          full_name: string
          email: string
          subject: string | null
          message: string
          status: 'unread' | 'read' | 'archived'
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          subject?: string | null
          message: string
          status?: 'unread' | 'read' | 'archived'
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          subject?: string | null
          message?: string
          status?: 'unread' | 'read' | 'archived'
          created_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          name: string
          role: string
          bio: string | null
          image_url: string | null
          order_index: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          role: string
          bio?: string | null
          image_url?: string | null
          order_index?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          bio?: string | null
          image_url?: string | null
          order_index?: number
          created_at?: string
        }
      }
      testimonials: {
        Row: {
          id: string
          student_name: string
          course_name: string
          content: string
          image_url: string | null
          rating: number
          created_at: string
        }
        Insert: {
          id?: string
          student_name: string
          course_name: string
          content: string
          image_url?: string | null
          rating?: number
          created_at?: string
        }
        Update: {
          id?: string
          student_name?: string
          course_name?: string
          content?: string
          image_url?: string | null
          rating?: number
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
