'use client'

import React from 'react'
import SidebarNavigation from './SidebarNavigation'

interface PageWrapperProps {
  children?: React.ReactNode
  loading?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '7xl' | 'full'
}

export default function PageWrapper({ children, loading, maxWidth = '7xl' }: PageWrapperProps) {
  const maxWidthClass = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  }[maxWidth]

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <SidebarNavigation />
        <div className="flex-1 md:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gitam-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarNavigation />
      <main className="flex-1 md:ml-64 p-4 md:p-6">
        <div className={`mx-auto ${maxWidthClass}`}>
          {children}
        </div>
      </main>
    </div>
  )
}
