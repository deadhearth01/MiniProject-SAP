'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'student' | 'faculty' | 'admin'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, userProfile } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only redirect if we have definitive auth state
    if (user === null) {
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
        router.push('/dashboard') // Redirect to dashboard if no permission
        return
      }
    }
  }, [user, userProfile, requiredRole, router])

  // If user is not authenticated, don't render anything (will redirect)
  if (user === null) {
    return null
  }

  return <>{children}</>
}
