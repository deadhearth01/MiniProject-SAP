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
      // ✅ PRODUCTION MODE: Real Supabase Authentication
      
      // First, find the user by roll number or faculty ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('roll_number_faculty_id', rollNumberOrFacultyId)
        .single()

      if (userError || !userData) {
        return { success: false, error: 'User not found. Please check your roll number/faculty ID.' }
      }

      // Sign in with Supabase Auth using email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: password,
      })

      if (error) {
        return { success: false, error: error.message || 'Invalid credentials' }
      }

      return { success: true }
      
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
