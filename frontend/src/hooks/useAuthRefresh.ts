'use client'

import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

/**
 * Hook to handle auth refresh and clearing stale data
 * Automatically clears auth state if it becomes stale or corrupted
 */
export function useAuthRefresh() {
  useEffect(() => {
    // Check for visibility change to refresh auth
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        // When user returns to tab, verify session is still valid
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !session) {
          // Clear stale auth data
          await supabase.auth.signOut()
          localStorage.removeItem('last_auth_check')
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    // Check for storage events (auth changes in other tabs)
    const handleStorageChange = async (e: StorageEvent) => {
      if (e.key === 'gitam-auth-token' && !e.newValue) {
        // Auth was cleared in another tab
        await supabase.auth.signOut()
        localStorage.removeItem('last_auth_check')
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])
}
