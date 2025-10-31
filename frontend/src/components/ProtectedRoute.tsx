'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'student' | 'faculty' | 'admin'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()
  const redirectRef = useRef(false)

  useEffect(() => {
    // Wait for auth initialization to complete before redirecting
    if (!loading) {
      if (user === null && !redirectRef.current) {
        redirectRef.current = true
        // User is not authenticated, redirect to login
        router.push('/login')
        return
      }

      if (requiredRole && userProfile) {
        const hasRequiredRole =
          requiredRole === 'admin' ? userProfile.is_admin :
          requiredRole === 'faculty' ? (userProfile.is_faculty || userProfile.is_admin) :
          true // students can access by default

        if (!hasRequiredRole) {
          // Redirect to dashboard if no permission
          router.push('/dashboard')
          return
        }
      }
    }
  }, [loading, user, userProfile, requiredRole, router])

  // While auth is loading, don't render children (AppContent shows a loader)
  if (loading) return null

  // If loading finished and user is null, nothing to render (redirect will happen)
  if (!loading && user === null) return null

  return <>{children}</>
}
