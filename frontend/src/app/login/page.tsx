'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Image from 'next/image'
import { Eye, EyeOff, User, Lock } from 'lucide-react'

export default function LoginPage() {
  const [rollNumberOrFacultyId, setRollNumberOrFacultyId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn } = useAuth()
  const router = useRouter()

  // Load saved credentials on mount
  React.useEffect(() => {
    const savedId = localStorage.getItem('rememberedId')
    if (savedId) {
      setRollNumberOrFacultyId(savedId)
      setRememberMe(true)
    }
  }, [])

  // Always reset loading state after navigation attempt
  React.useEffect(() => {
    return () => {
      setLoading(false)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false)
      setError('Login timeout - please try again')
    }, 10000) // 10 second timeout

    try {
      const result = await signIn(rollNumberOrFacultyId, password)
      
      clearTimeout(timeoutId) // Clear timeout on success
      
      if (result.success) {
        // Save ID if remember me is checked
        if (rememberMe) {
          localStorage.setItem('rememberedId', rollNumberOrFacultyId)
        } else {
          localStorage.removeItem('rememberedId')
        }
        
        // Navigate immediately - no delay needed
        router.replace('/dashboard')
      } else {
        setError(result.error || 'Login failed')
        setLoading(false)
      }
    } catch (err) {
      clearTimeout(timeoutId)
      console.error('Login error:', err)
      setError('An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gitam-primary via-gitam-dark to-gitam-primary py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="gitam-card p-8">
          {/* Logo and Header */}
          <div className="text-center">
            <div className="mx-auto h-20 w-20 mb-4">
              <Image
                src="/gitam.png"
                alt="GITAM Logo"
                width={80}
                height={80}
                className="mx-auto"
              />
            </div>
            <h2 className="text-3xl font-bold text-gitam-primary mb-2">
              GITAM Achievement Portal
            </h2>
            <p className="text-gray-600 text-sm">
              Gandhi Institute of Technology and Management
            </p>
          </div>

          {/* Login Form */}
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="rollNumberOrFacultyId" className="sr-only">
                  Roll Number / Faculty ID
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="rollNumberOrFacultyId"
                    name="rollNumberOrFacultyId"
                    type="text"
                    required
                    value={rollNumberOrFacultyId}
                    onChange={(e) => setRollNumberOrFacultyId(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gitam-primary focus:border-gitam-primary focus:z-10 sm:text-sm"
                    placeholder="Roll Number / Faculty ID"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-gitam-primary focus:border-gitam-primary focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-gitam-primary focus:ring-gitam-primary border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <a href="#" className="font-medium text-gitam-primary hover:text-gitam-dark">
                  Forgot password?
                </a>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white gitam-btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gitam-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Need help? Contact:{' '}
                <a href="mailto:support@gitam.edu" className="text-gitam-primary hover:text-gitam-dark font-medium">
                  support@gitam.edu
                </a>
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-white opacity-90">
          <p>© 2025 Gandhi Institute of Technology and Management</p>
          <p>All rights reserved</p>
        </div>
      </div>
    </div>
  )
}
