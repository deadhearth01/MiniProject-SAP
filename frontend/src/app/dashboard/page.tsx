'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { 
  Trophy, 
  Plus, 
  Users, 
  BarChart3, 
  Award, 
  TrendingUp,
  Calendar,
  Target
} from 'lucide-react'
import Link from 'next/link'

interface DashboardStats {
  totalAchievements: number
  pendingApprovals: number
  monthlyAchievements: number
  leaderboardPosition: number
  totalPoints: number
}

export default function DashboardPage() {
  const { userProfile } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalAchievements: 0,
    pendingApprovals: 0,
    monthlyAchievements: 0,
    leaderboardPosition: 0,
    totalPoints: 0
  })
  const [recentAchievements, setRecentAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userProfile) {
      fetchDashboardData()
    }
  }, [userProfile])

  const fetchDashboardData = async () => {
    try {
      // Fetch user's achievements
      const { data: achievements } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userProfile.id)

      const totalAchievements = achievements?.length || 0
      const pendingApprovals = achievements?.filter(a => a.status === 'pending').length || 0
      
      // Current month achievements
      const currentMonth = new Date().getMonth()
      const monthlyAchievements = achievements?.filter(a => 
        new Date(a.date).getMonth() === currentMonth
      ).length || 0

      // Get recent achievements
      const recent = achievements?.slice(0, 5) || []

      // Calculate total points
      const totalPoints = achievements?.reduce((sum, achievement) => sum + (achievement.points || 0), 0) || 0

      // Get leaderboard position (simplified)
      const { data: leaderboard } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('user_id', userProfile.id)
        .eq('year', new Date().getFullYear())
        .single()

      setStats({
        totalAchievements,
        pendingApprovals,
        monthlyAchievements,
        leaderboardPosition: leaderboard?.rank || 0,
        totalPoints
      })

      setRecentAchievements(recent)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const statCards = [
    {
      title: 'Total Achievements',
      value: stats.totalAchievements,
      icon: Trophy,
      color: 'bg-blue-500',
      href: '/achievements'
    },
    {
      title: 'This Month',
      value: stats.monthlyAchievements,
      icon: Calendar,
      color: 'bg-green-500',
      href: '/achievements?month=current'
    },
    {
      title: 'Total Points',
      value: stats.totalPoints,
      icon: Target,
      color: 'bg-purple-500',
      href: '/leaderboard'
    },
    {
      title: 'Leaderboard Rank',
      value: stats.leaderboardPosition || 'N/A',
      icon: TrendingUp,
      color: 'bg-orange-500',
      href: '/leaderboard'
    }
  ]

  const quickActions = [
    {
      title: 'Submit Achievement',
      description: 'Add your latest achievement',
      icon: Plus,
      href: '/achievements/submit',
      color: 'bg-gitam-primary'
    },
    {
      title: 'View Achievements',
      description: 'Browse all achievements',
      icon: Trophy,
      href: '/achievements',
      color: 'bg-blue-600'
    },
    {
      title: 'Leaderboard',
      description: 'Check your ranking',
      icon: BarChart3,
      href: '/leaderboard',
      color: 'bg-purple-600'
    }
  ]

  if (userProfile?.is_admin) {
    quickActions.push({
      title: 'Admin Panel',
      description: 'Manage achievements',
      icon: Users,
      href: '/admin',
      color: 'bg-red-600'
    })
  }

  if (loading) {
    return (
      <ProtectedRoute>
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
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                {getGreeting()}, {userProfile?.name}!
              </h1>
              <p className="text-gray-600 mt-2">
                Welcome to your achievement portal
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statCards.map((stat) => {
                const Icon = stat.icon
                return (
                  <Link key={stat.title} href={stat.href}>
                    <div className="gitam-card p-6 hover:scale-105 transition-transform cursor-pointer">
                      <div className="flex items-center">
                        <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-600">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-semibold text-gray-900">
                            {stat.value}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* Admin Stats */}
            {userProfile?.is_admin && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="gitam-card p-6">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-yellow-500 text-white">
                        <Award className="h-6 w-6" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                        <p className="text-2xl font-semibold text-gray-900">{stats.pendingApprovals}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quickActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Link key={action.title} href={action.href}>
                      <div className="gitam-card p-6 hover:scale-105 transition-transform cursor-pointer">
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

            {/* Recent Achievements */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Recent Achievements</h2>
                <Link href="/achievements" className="text-gitam-primary hover:text-gitam-dark text-sm font-medium">
                  View all →
                </Link>
              </div>
              
              {recentAchievements.length > 0 ? (
                <div className="space-y-4">
                  {recentAchievements.map((achievement: any) => (
                    <div key={achievement.id} className="gitam-card p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{achievement.event_name}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {achievement.category} • {achievement.level} • {achievement.position}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(achievement.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          achievement.status === 'approved' ? 'bg-green-100 text-green-800' :
                          achievement.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {achievement.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="gitam-card p-8 text-center">
                  <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No achievements yet</p>
                  <Link href="/achievements/submit" className="text-gitam-primary hover:text-gitam-dark font-medium mt-2 inline-block">
                    Submit your first achievement →
                  </Link>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
