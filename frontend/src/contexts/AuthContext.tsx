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
    let mounted = true
    let authCheckComplete = false

    // AGGRESSIVE FIX: Always set loading to false after max 3 seconds
    const emergencyTimeout = setTimeout(() => {
      if (mounted) {
        console.warn('🚨 Emergency timeout - forcing loading to false')
        setLoading(false)
      }
    }, 3000) // 3 second emergency timeout

    // Check if Supabase is properly configured
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('Supabase environment variables not configured')
      setLoading(false)
      clearTimeout(emergencyTimeout)
      return
    }

    // Get initial session from Supabase with timeout
    const getInitialSession = async () => {
      try {
        // Clear any stale auth state from localStorage
        const lastAuthCheck = localStorage.getItem('last_auth_check')
        const now = Date.now()
        
        // If last check was more than 30 minutes ago, clear stale data
        if (lastAuthCheck && (now - parseInt(lastAuthCheck)) > 1800000) {
          console.log('Clearing stale auth data...')
          await supabase.auth.signOut()
        }
        
        localStorage.setItem('last_auth_check', now.toString())

        const { data: { session }, error } = await supabase.auth.getSession()

        if (!mounted) return

        if (error) {
          console.error('Error getting session:', error)
          // Clear any corrupted auth data
          await supabase.auth.signOut()
          authCheckComplete = true
          setLoading(false)
          clearTimeout(emergencyTimeout)
          return
        }

        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        }
        authCheckComplete = true
      } catch (error) {
        console.error('Error in getInitialSession:', error)
        // Clear corrupted state
        await supabase.auth.signOut()
        authCheckComplete = true
      } finally {
        if (mounted) {
          setLoading(false)
          clearTimeout(emergencyTimeout)
        }
      }
    }

    getInitialSession()

    // Fallback timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (mounted && !authCheckComplete) {
        console.warn('Auth initialization timeout - clearing state')
        // Clear auth state
        supabase.auth.signOut().then(() => {
          if (mounted) {
            setLoading(false)
            setSession(null)
            setUser(null)
            setUserProfile(null)
          }
        })
      }
    }, 2500) // 2.5 second timeout

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return

      // Clear timeouts since we got a response
      clearTimeout(timeoutId)
      clearTimeout(emergencyTimeout)
      authCheckComplete = true

      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => {
      mounted = false
      clearTimeout(timeoutId)
      clearTimeout(emergencyTimeout)
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
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const signIn = async (rollNumberOrFacultyId: string, password: string) => {
    try {
      // Clear any stale auth data before signing in
      await supabase.auth.signOut()
      localStorage.removeItem('last_auth_check')
      
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

      // Set fresh auth check timestamp
      localStorage.setItem('last_auth_check', Date.now().toString())

      return { success: true }
      
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
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
