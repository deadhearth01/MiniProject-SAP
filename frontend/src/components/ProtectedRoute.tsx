'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: 'student' | 'faculty' | 'admin'
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, userProfile, loading } = useAuth()
  const router = useRouter()
  const [showLoading, setShowLoading] = useState(true)

  useEffect(() => {
    // Emergency timeout: Always hide loading after 4 seconds
    const emergencyTimeout = setTimeout(() => {
      console.warn('🚨 ProtectedRoute: Emergency timeout - hiding loading')
      setShowLoading(false)
      if (!user) {
        router.push('/login')
      }
    }, 4000)

    if (!loading) {
      clearTimeout(emergencyTimeout)
      setShowLoading(false)
      
      if (!user) {
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
    }

    return () => clearTimeout(emergencyTimeout)
  }, [user, userProfile, loading, requiredRole, router])

  if (loading || showLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gitam-primary mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
          <p className="text-gray-400 text-sm mt-2">If this takes too long, please refresh the page</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return <>{children}</>
}
