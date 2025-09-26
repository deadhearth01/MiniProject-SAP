import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          roll_number_faculty_id: string
          batch: string | null
          school: string
          branch: string
          specialization: string | null
          year_designation: string
          email: string
          contact: string | null
          profile_photo: string | null
          password_hash: string
          is_admin: boolean
          is_faculty: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          roll_number_faculty_id: string
          batch?: string | null
          school: string
          branch: string
          specialization?: string | null
          year_designation: string
          email: string
          contact?: string | null
          profile_photo?: string | null
          password_hash: string
          is_admin?: boolean
          is_faculty?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          roll_number_faculty_id?: string
          batch?: string | null
          school?: string
          branch?: string
          specialization?: string | null
          year_designation?: string
          email?: string
          contact?: string | null
          profile_photo?: string | null
          password_hash?: string
          is_admin?: boolean
          is_faculty?: boolean
          created_at?: string
        }
      }
      achievements: {
        Row: {
          id: string
          user_id: string
          event_name: string
          category: 'Curricular' | 'Co-curricular' | 'Extracurricular' | 'Other'
          level: 'College' | 'State' | 'National' | 'International'
          date: string
          position: '1st' | '2nd' | '3rd' | 'Participation' | 'Other'
          school: string
          branch: string
          specialization: string | null
          batch: string | null
          organizer: string
          place: string
          proof_file_path: string | null
          event_photos_paths: string[] | null
          remarks: string | null
          status: 'pending' | 'approved' | 'rejected'
          submitted_at: string
          approved_at: string | null
          approved_by: string | null
          points: number
        }
        Insert: {
          id?: string
          user_id: string
          event_name: string
          category: 'Curricular' | 'Co-curricular' | 'Extracurricular' | 'Other'
          level: 'College' | 'State' | 'National' | 'International'
          date: string
          position: '1st' | '2nd' | '3rd' | 'Participation' | 'Other'
          school: string
          branch: string
          specialization?: string | null
          batch?: string | null
          organizer: string
          place: string
          proof_file_path?: string | null
          event_photos_paths?: string[] | null
          remarks?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          submitted_at?: string
          approved_at?: string | null
          approved_by?: string | null
          points?: number
        }
        Update: {
          id?: string
          user_id?: string
          event_name?: string
          category?: 'Curricular' | 'Co-curricular' | 'Extracurricular' | 'Other'
          level?: 'College' | 'State' | 'National' | 'International'
          date?: string
          position?: '1st' | '2nd' | '3rd' | 'Participation' | 'Other'
          school?: string
          branch?: string
          specialization?: string | null
          batch?: string | null
          organizer?: string
          place?: string
          proof_file_path?: string | null
          event_photos_paths?: string[] | null
          remarks?: string | null
          status?: 'pending' | 'approved' | 'rejected'
          submitted_at?: string
          approved_at?: string | null
          approved_by?: string | null
          points?: number
        }
      }
      leaderboard: {
        Row: {
          id: string
          user_id: string
          month: number | null
          semester: number | null
          year: number
          total_points: number
          rank: number
        }
        Insert: {
          id?: string
          user_id: string
          month?: number | null
          semester?: number | null
          year: number
          total_points: number
          rank: number
        }
        Update: {
          id?: string
          user_id?: string
          month?: number | null
          semester?: number | null
          year?: number
          total_points?: number
          rank?: number
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          message: string
          type: 'badge' | 'approval' | 'highlight' | 'rejection'
          created_at: string
          read_status: boolean
        }
        Insert: {
          id?: string
          user_id: string
          message: string
          type: 'badge' | 'approval' | 'highlight' | 'rejection'
          created_at?: string
          read_status?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          message?: string
          type?: 'badge' | 'approval' | 'highlight' | 'rejection'
          created_at?: string
          read_status?: boolean
        }
      }
    }
  }
}
