'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

/**
 * Debug component to log auth state changes
 * Only active in development mode
 */
export function AuthDebugger() {
  const { user, session, userProfile, loading } = useAuth()

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Auth State:', {
        loading,
        hasUser: !!user,
        hasSession: !!session,
        hasProfile: !!userProfile,
        userId: user?.id,
        timestamp: new Date().toISOString()
      })
    }
  }, [user, session, userProfile, loading])

  return null
}
