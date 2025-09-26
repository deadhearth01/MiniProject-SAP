'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  userProfile: any | null
  loading: boolean
  signIn: (rollNumberOrFacultyId: string, password: string) => Promise<{success: boolean, error?: string}>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for testing mode session first
    const testingSession = localStorage.getItem('gitam-testing-session')
    const testingProfile = localStorage.getItem('gitam-testing-profile')
    
    if (testingSession && testingProfile) {
      // Restore testing mode session
      const parsedSession = JSON.parse(testingSession)
      const parsedProfile = JSON.parse(testingProfile)
      
      setSession(parsedSession)
      setUser(parsedSession.user)
      setUserProfile(parsedProfile)
      setLoading(false)
      return
    }

    // Get initial session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
        // Clear testing mode data on logout
        localStorage.removeItem('gitam-testing-session')
        localStorage.removeItem('gitam-testing-profile')
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setUserProfile(data)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const signIn = async (rollNumberOrFacultyId: string, password: string) => {
    try {
      // 🚀 TESTING MODE: Accept any roll number and password
      // Remove this section for production use!
      
      // Create mock user profiles for testing
      const mockUsers = {
        'ADMIN001': {
          id: 'mock-admin-id',
          email: 'admin@gitam.edu',
          name: 'GITAM Administrator',
          roll_number_faculty_id: 'ADMIN001',
          is_admin: true,
          is_faculty: true,
          school: 'School of Technology',
          branch: 'Administration',
          year_designation: 'Administrator'
        },
        'FAC001': {
          id: 'mock-faculty-id',
          email: 'faculty@gitam.edu',
          name: 'Dr. Test Faculty',
          roll_number_faculty_id: 'FAC001',
          is_admin: false,
          is_faculty: true,
          school: 'School of Technology',
          branch: 'Computer Science Engineering',
          year_designation: 'Professor'
        },
        'STU001': {
          id: 'mock-student-id',
          email: 'student@gitam.in',
          name: 'Test Student',
          roll_number_faculty_id: 'STU001',
          is_admin: false,
          is_faculty: false,
          school: 'School of Technology',
          branch: 'Computer Science Engineering',
          year_designation: '3rd Year',
          batch: '2022-2026',
          specialization: 'Artificial Intelligence'
        }
      }

      // Check if it's a predefined mock user
      let mockProfile = mockUsers[rollNumberOrFacultyId as keyof typeof mockUsers]
      
      // If not predefined, create a dynamic student profile
      if (!mockProfile) {
        mockProfile = {
          id: `mock-${rollNumberOrFacultyId.toLowerCase()}`,
          email: `${rollNumberOrFacultyId.toLowerCase()}@gitam.in`,
          name: `Student ${rollNumberOrFacultyId}`,
          roll_number_faculty_id: rollNumberOrFacultyId,
          is_admin: false,
          is_faculty: false,
          school: 'School of Technology',
          branch: 'Computer Science Engineering',
          year_designation: '3rd Year',
          batch: '2022-2026',
          specialization: 'General'
        }
      }

      // Create mock session
      const mockSession = {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh',
        expires_in: 3600,
        token_type: 'bearer',
        user: {
          id: mockProfile.id,
          email: mockProfile.email,
          created_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated'
        }
      }

      // Set the mock user and profile
      setUser(mockSession.user as User)
      setSession(mockSession as Session)
      setUserProfile(mockProfile)

      // Persist testing session to localStorage
      localStorage.setItem('gitam-testing-session', JSON.stringify(mockSession))
      localStorage.setItem('gitam-testing-profile', JSON.stringify(mockProfile))

      console.log(`🚀 TESTING: Logged in as ${mockProfile.name} (${rollNumberOrFacultyId})`)
      
      return { success: true }

      // 💡 ORIGINAL CODE (uncomment for production):
      /*
      // First, find the user by roll number or faculty ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email, password_hash')
        .eq('roll_number_faculty_id', rollNumberOrFacultyId)
        .single()

      if (userError || !userData) {
        return { success: false, error: 'User not found' }
      }

      // For now, we'll use email-based auth with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
      */
      
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    // Clear testing mode data
    localStorage.removeItem('gitam-testing-session')
    localStorage.removeItem('gitam-testing-profile')
    
    // Clear state
    setUser(null)
    setSession(null)
    setUserProfile(null)
    
    // Also clear Supabase session (if any)
    await supabase.auth.signOut()
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchUserProfile(user.id)
    }
  }

  const value = {
    user,
    session,
    userProfile,
    loading,
    signIn,
    signOut,
    refreshProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
