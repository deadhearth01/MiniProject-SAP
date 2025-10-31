'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { 
  Users, 
  Trophy, 
  Clock, 
  CheckCircle,
  XCircle,
  BarChart3,
  TrendingUp,
  Award,
  Calendar,
  Download
} from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboardPage() {
  const { userProfile } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAchievements: 0,
    pendingApprovals: 0,
    approvedToday: 0,
    thisMonthAchievements: 0,
    categories: {} as Record<string, number>,
    levels: {} as Record<string, number>
  })
  const [recentAchievements, setRecentAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAdminStats()
  }, [])

  const fetchAdminStats = async () => {
    try {
      console.log('🔍 [ADMIN] Fetching admin statistics...')
      
      // Fetch users count
      const { count: usersCount, error: usersError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      if (usersError) {
        console.error('❌ [ADMIN] Users count error:', usersError)
        throw usersError
      }

      console.log(`✅ [ADMIN] Total users: ${usersCount}`)

      // Fetch achievements data
      const { data: achievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .order('submitted_at', { ascending: false })

      if (achievementsError) {
        console.error('❌ [ADMIN] Achievements error:', achievementsError)
        throw achievementsError
      }

      console.log(`✅ [ADMIN] Total achievements: ${achievements?.length || 0}`)

      const totalAchievements = achievements?.length || 0
      const pendingApprovals = achievements?.filter(a => a.status === 'pending').length || 0
      
      console.log(`📋 [ADMIN] Pending approvals: ${pendingApprovals}`)
      
      // Count achievements approved today
      const today = new Date().toISOString().split('T')[0]
      const approvedToday = achievements?.filter(a => 
        a.status === 'approved' && 
        a.approved_at && 
        new Date(a.approved_at).toISOString().split('T')[0] === today
      ).length || 0

      console.log(`✅ [ADMIN] Approved today: ${approvedToday}`)

      // Count this month's achievements
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      const thisMonthAchievements = achievements?.filter(a => {
        const achDate = new Date(a.date)
        return achDate.getMonth() === currentMonth && achDate.getFullYear() === currentYear
      }).length || 0

      console.log(`📅 [ADMIN] This month achievements: ${thisMonthAchievements}`)

      // Category and level breakdown
      const categories: Record<string, number> = {}
      const levels: Record<string, number> = {}

      achievements?.forEach(achievement => {
        categories[achievement.category] = (categories[achievement.category] || 0) + 1
        levels[achievement.level] = (levels[achievement.level] || 0) + 1
      })

      console.log('📊 [ADMIN] Categories:', categories)
      console.log('📊 [ADMIN] Levels:', levels)

      // Recent achievements for review
      const recent = achievements
        ?.filter(a => a.status === 'pending')
        ?.slice(0, 5) || []

      console.log(`🕒 [ADMIN] Recent pending: ${recent.length}`)

      // Fetch user details for recent achievements
      const recentWithUsers = await Promise.all(
        recent.map(async (achievement) => {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('name, roll_number_faculty_id')
            .eq('id', achievement.user_id)
            .single()
          
          if (userError) {
            console.error(`⚠️  [ADMIN] Error fetching user ${achievement.user_id}:`, userError)
          }
          
          return { ...achievement, user: userData }
        })
      )

      setStats({
        totalUsers: usersCount || 0,
        totalAchievements,
        pendingApprovals,
        approvedToday,
        thisMonthAchievements,
        categories,
        levels
      })

      setRecentAchievements(recentWithUsers)
      setError('')
      console.log('✅ [ADMIN] Dashboard data loaded successfully')
    } catch (error: any) {
      console.error('❌ [ADMIN] Error fetching admin stats:', error)
      setError(`Failed to load admin dashboard: ${error.message || 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: 'Review Achievements',
      description: `${stats.pendingApprovals} pending approvals`,
      icon: Clock,
      href: '/admin/approvals',
      color: 'bg-yellow-500',
      urgent: stats.pendingApprovals > 0
    },
    {
      title: 'View Analytics',
      description: 'Detailed statistics and reports',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-blue-500',
      urgent: false
    },
    {
      title: 'Manage Users',
      description: 'User roles and permissions',
      icon: Users,
      href: '/admin/users',
      color: 'bg-green-500',
      urgent: false
    },
    {
      title: 'Export Data',
      description: 'Download achievement reports',
      icon: Download,
      href: '/admin/export',
      color: 'bg-purple-500',
      urgent: false
    }
  ]

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Total Achievements',
      value: stats.totalAchievements,
      icon: Trophy,
      color: 'bg-green-500',
      change: '+8%'
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: Clock,
      color: 'bg-yellow-500',
      urgent: stats.pendingApprovals > 0
    },
    {
      title: 'Approved Today',
      value: stats.approvedToday,
      icon: CheckCircle,
      color: 'bg-purple-500',
      change: stats.approvedToday > 0 ? `+${stats.approvedToday}` : 'None'
    }
  ]

  if (loading) {
    return (
      <ProtectedRoute requiredRole="admin">
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="flex items-center justify-center pt-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gitam-primary"></div>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Welcome back, {userProfile?.name}. Here's what's happening.
              </p>
            </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            <p className="font-medium">Error Loading Dashboard</p>
            <p className="text-sm mt-1">{error}</p>
            <button 
              onClick={() => fetchAdminStats()} 
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try Again
            </button>
          </div>
        )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat) => {
                const Icon = stat.icon
                return (
                  <div key={stat.title} className={`gitam-card p-6 ${stat.urgent ? 'ring-2 ring-yellow-400' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                        <p className="text-3xl font-semibold text-gray-900 mt-2">{stat.value}</p>
                        {stat.change && (
                          <p className={`text-sm mt-1 ${stat.change.includes('+') ? 'text-green-600' : 'text-gray-600'}`}>
                            {stat.change}
                          </p>
                        )}
                      </div>
                      <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                        <Icon className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Category Breakdown */}
              <div className="gitam-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Categories</h3>
                <div className="space-y-3">
                  {Object.entries(stats.categories).map(([category, count]) => (
                    <div key={category} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{category}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gitam-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(count / stats.totalAchievements) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Level Breakdown */}
              <div className="gitam-card p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievement Levels</h3>
                <div className="space-y-3">
                  {Object.entries(stats.levels).map(([level, count]) => (
                    <div key={level} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{level}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-gitam-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(count / stats.totalAchievements) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Link key={action.title} href={action.href}>
                      <div className={`gitam-card p-6 hover:scale-105 transition-transform cursor-pointer ${action.urgent ? 'ring-2 ring-red-400 animate-pulse' : ''}`}>
                        <div className={`inline-flex p-3 rounded-lg ${action.color} text-white mb-4`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {action.description}
                        </p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Recent Pending Achievements */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Submissions</h2>
                <Link href="/admin/approvals" className="text-gitam-primary hover:text-gitam-dark text-sm font-medium">
                  View all →
                </Link>
              </div>
              
              {recentAchievements.length > 0 ? (
                <div className="space-y-4">
                  {recentAchievements.map((achievement) => (
                    <div key={achievement.id} className="gitam-card p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-medium text-gray-900">{achievement.event_name}</h4>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            by {achievement.user?.name} ({achievement.user?.roll_number_faculty_id})
                          </p>
                          <p className="text-xs text-gray-500">
                            Submitted: {new Date(achievement.submitted_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gitam-primary">
                            {achievement.level} • {achievement.position}
                          </div>
                          <div className="text-xs text-gray-500">
                            {achievement.points} points
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="gitam-card p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">All submissions reviewed!</p>
                  <p className="text-sm text-gray-500 mt-1">Great job keeping up with approvals.</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

