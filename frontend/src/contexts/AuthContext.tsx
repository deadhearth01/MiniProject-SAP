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

  // Initialize auth - run once on mount
  useEffect(() => {
    let mounted = true

    const initAuth = async () => {
      try {
        console.log('🔄 Initializing auth...')
        
        // Get current session
        const { data: { session }, error } = await supabase.auth.getSession()

        if (!mounted) return

        if (error) {
          console.error('❌ Session error:', error)
        } else if (session?.user) {
          console.log('✅ Session found for:', session.user.email)
          setSession(session)
          setUser(session.user)
          
          // Fetch profile async (don't block)
          fetchUserProfile(session.user.id).catch(console.error)
        } else {
          console.log('ℹ️ No active session')
        }
      } catch (err) {
        console.error('❌ Init error:', err)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    initAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 Auth event:', event)
        
        if (!mounted) return

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          fetchUserProfile(session.user.id).catch(console.error)
        } else {
          setUserProfile(null)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
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
      console.log('✅ Profile loaded:', data.name)
    } catch (err) {
      console.error('❌ Profile error:', err)
    }
  }

  const signIn = async (rollNumberOrFacultyId: string, password: string) => {
    try {
      console.log('🔐 Signing in:', rollNumberOrFacultyId)

      // Find user by roll number/faculty ID
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('roll_number_faculty_id', rollNumberOrFacultyId)
        .single()

      if (userError || !userData) {
        console.error('❌ User not found')
        return { 
          success: false, 
          error: 'User not found. Please check your roll number/faculty ID.' 
        }
      }

      // Sign in with email and password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: password,
      })

      if (signInError) {
        console.error('❌ Sign in error:', signInError)
        return { 
          success: false, 
          error: signInError.message || 'Invalid credentials' 
        }
      }

      console.log('✅ Sign in successful')
      return { success: true }
      
    } catch (err: any) {
      console.error('❌ Sign in exception:', err)
      return { 
        success: false, 
        error: err.message || 'An unexpected error occurred' 
      }
    }
  }

  const signOut = async () => {
    try {
      console.log('🚪 Signing out...')
      
      // Clear local state immediately
      setUser(null)
      setSession(null)
      setUserProfile(null)
      
      // Clear any cached data
      localStorage.removeItem('gitam-testing-session')
      localStorage.removeItem('gitam-testing-profile')
      localStorage.removeItem('last_auth_check')
      localStorage.removeItem('rememberedId')
      
      // Sign out from Supabase
      await supabase.auth.signOut()
      
      console.log('✅ Signed out successfully')
    } catch (err) {
      console.error('❌ Sign out error:', err)
    }
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
