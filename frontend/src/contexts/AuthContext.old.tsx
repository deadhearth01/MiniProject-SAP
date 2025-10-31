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
  const [initialized, setInitialized] = useState(false)

  // Initialize auth state once on mount
  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Get current session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession()

        if (!mounted) return

        if (error) {
          console.error('Auth initialization error:', error)
          setSession(null)
          setUser(null)
          setUserProfile(null)
        } else if (session?.user) {
          setSession(session)
          setUser(session.user)
          // Fetch user profile in parallel, don't block
          fetchUserProfile(session.user.id)
        } else {
          setSession(null)
          setUser(null)
          setUserProfile(null)
        }
      } catch (error) {
        console.error('Auth initialization exception:', error)
        setSession(null)
        setUser(null)
        setUserProfile(null)
      } finally {
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    initializeAuth()

    // Listen for auth changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        
        if (!mounted) return

        setSession(session)
        setUser(session?.user ?? null)

        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUserProfile(null)
        }

        // Don't set loading on auth changes after initialization
        if (initialized) {
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [initialized])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Error fetching user profile:', error)
        return
      }

      setUserProfile(data)
    } catch (error) {
      console.error('Exception fetching user profile:', error)
    }
  }
      console.error('Error fetching user profile:', error)
    }
  }

  const signIn = async (rollNumberOrFacultyId: string, password: string) => {
    try {
      console.log('🔐 Starting sign in process...')
      
      // Clear any stale auth data before signing in
      await supabase.auth.signOut()
      localStorage.removeItem('last_auth_check')
      
      // First, find the user by roll number or faculty ID with timeout
      const userQueryPromise = supabase
        .from('users')
        .select('email')
        .eq('roll_number_faculty_id', rollNumberOrFacultyId)
        .single()

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 5000)
      )

      const { data: userData, error: userError } = await Promise.race([
        userQueryPromise,
        timeoutPromise
      ]) as any

      if (userError || !userData) {
        console.error('❌ User not found:', userError)
        return { success: false, error: 'User not found. Please check your roll number/faculty ID.' }
      }

      console.log('✅ User found, attempting authentication...')

      // Sign in with Supabase Auth using email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userData.email,
        password: password,
      })

      if (error) {
        console.error('❌ Auth error:', error)
        return { success: false, error: error.message || 'Invalid credentials' }
      }

      // Set fresh auth check timestamp
      localStorage.setItem('last_auth_check', Date.now().toString())
      
      console.log('✅ Sign in successful!')
      return { success: true }
      
    } catch (error: any) {
      console.error('❌ Sign in exception:', error)
      return { success: false, error: error.message || 'An unexpected error occurred' }
    }
  }

  const signOut = async () => {
    // Clear testing mode data
    localStorage.removeItem('gitam-testing-session')
    localStorage.removeItem('gitam-testing-profile')
    localStorage.removeItem('last_auth_check')
    
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
