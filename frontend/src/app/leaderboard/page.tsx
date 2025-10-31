'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { 
  Trophy, 
  Medal, 
  Award,
  TrendingUp,
  Crown,
  Star,
  Target,
  Calendar,
  Download,
  Loader2
} from 'lucide-react'
import * as XLSX from 'xlsx'

interface LeaderboardEntry {
  user_id: string
  name: string
  roll_number_faculty_id: string
  school: string
  branch: string
  total_points: number
  achievement_count: number
  rank: number
  recent_achievement?: string
}

interface AchievementWithUser {
  user_id: string
  points: number
  date: string
  category: string
  event_name: string
  users: {
    name: string
    roll_number_faculty_id: string
    school: string
    branch: string
    is_faculty: boolean
  }
}

export default function LeaderboardPage() {
  const { userProfile } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState('all') // all, month, semester, year
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null)
  const [exportLoading, setExportLoading] = useState(false)

  useEffect(() => {
    fetchLeaderboard()
  }, [timeFilter, categoryFilter])

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('achievements')
        .select(`
          user_id,
          points,
          date,
          category,
          event_name,
          users:user_id (
            name,
            roll_number_faculty_id,
            school,
            branch,
            is_faculty
          )
        `)
        .eq('status', 'approved')

      // Apply time filters
      const now = new Date()
      if (timeFilter === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        query = query.gte('date', startOfMonth.toISOString().split('T')[0])
      } else if (timeFilter === 'semester') {
        // Assuming semester starts in Jan and July
        const currentMonth = now.getMonth()
        const semesterStart = currentMonth < 6 
          ? new Date(now.getFullYear(), 0, 1) // January
          : new Date(now.getFullYear(), 6, 1) // July
        query = query.gte('date', semesterStart.toISOString().split('T')[0])
      } else if (timeFilter === 'year') {
        const startOfYear = new Date(now.getFullYear(), 0, 1)
        query = query.gte('date', startOfYear.toISOString().split('T')[0])
      }

      // Apply category filter
      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter)
      }

      // Limit results for better performance
      query = query.limit(5000) // Reasonable limit to prevent slow loading

      const { data: achievements, error } = await query

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
        throw error
      }

      // Group by user and calculate totals
      const userStats = new Map<string, {
        user_id: string
        name: string
        roll_number_faculty_id: string
        school: string
        branch: string
        total_points: number
        achievement_count: number
        recent_achievement?: string
        is_faculty: boolean
      }>()

      achievements?.forEach((achievement: any) => {
        const userId = achievement.user_id
        const user = achievement.users

        if (!user) return // Skip if no user data

        if (!userStats.has(userId)) {
          userStats.set(userId, {
            user_id: userId,
            name: user.name,
            roll_number_faculty_id: user.roll_number_faculty_id,
            school: user.school,
            branch: user.branch,
            total_points: 0,
            achievement_count: 0,
            is_faculty: user.is_faculty
          })
        }

        const stats = userStats.get(userId)!
        stats.total_points += achievement.points || 0
        stats.achievement_count += 1
        
        // Keep track of most recent achievement
        if (!stats.recent_achievement) {
          stats.recent_achievement = achievement.event_name
        }
      })

      // Convert to array and sort by points
      const leaderboardData = Array.from(userStats.values())
        .sort((a, b) => b.total_points - a.total_points)
        .map((entry, index) => ({
          ...entry,
          rank: index + 1
        }))

      // Filter out faculty if showing student leaderboard
      const filteredData = leaderboardData.filter(entry => !entry.is_faculty)

      setLeaderboard(filteredData)

      // Find current user's rank
      const currentUserRank = filteredData.find(entry => entry.user_id === userProfile?.id)
      setUserRank(currentUserRank || null)

    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-500" />
      case 2: return <Medal className="h-6 w-6 text-gray-400" />
      case 3: return <Award className="h-6 w-6 text-amber-600" />
      default: return <span className="text-lg font-bold text-gray-600">#{rank}</span>
    }
  }

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white'
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-400 text-white'
      case 3: return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
      default: return 'bg-white'
    }
  }

  const getTimeFilterLabel = () => {
    switch (timeFilter) {
      case 'month': return 'This Month'
      case 'semester': return 'This Semester'
      case 'year': return 'This Year'
      default: return 'All Time'
    }
  }

  const exportLeaderboard = async () => {
    setExportLoading(true)
    try {
      console.log('🏆 [EXPORT] Starting leaderboard export...')

      // Transform current leaderboard data for Excel
      const excelData = leaderboard.map((entry, index) => ({
        'Rank': entry.rank,
        'Name': entry.name,
        'Roll Number/ID': entry.roll_number_faculty_id,
        'School': entry.school,
        'Branch': entry.branch,
        'Total Points': entry.total_points,
        'Achievement Count': entry.achievement_count,
        'Time Period': getTimeFilterLabel(),
        'Category Filter': categoryFilter === 'all' ? 'All Categories' : categoryFilter
      }))

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(excelData)

      // Auto-size columns
      const colWidths = [
        { wch: 6 },  // Rank
        { wch: 20 }, // Name
        { wch: 15 }, // Roll Number/ID
        { wch: 15 }, // School
        { wch: 15 }, // Branch
        { wch: 12 }, // Total Points
        { wch: 16 }, // Achievement Count
        { wch: 12 }, // Time Period
        { wch: 15 }  // Category Filter
      ]
      ws['!cols'] = colWidths

      XLSX.utils.book_append_sheet(wb, ws, 'Leaderboard')

      // Generate filename with timestamp and filters
      const timestamp = new Date().toISOString().split('T')[0]
      const timeSuffix = timeFilter === 'all' ? '' : `_${timeFilter}`
      const categorySuffix = categoryFilter === 'all' ? '' : `_${categoryFilter.toLowerCase()}`
      const filename = `leaderboard${timeSuffix}${categorySuffix}_${timestamp}.xlsx`

      // Save file
      XLSX.writeFile(wb, filename)

      console.log('✅ [EXPORT] Leaderboard export completed')

    } catch (error: any) {
      console.error('❌ [EXPORT] Leaderboard export failed:', error)
      alert('Failed to export leaderboard data. Please try again.')
    } finally {
      setExportLoading(false)
    }
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
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <Trophy className="h-12 w-12 text-gitam-primary" />
              </div>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <h1 className="text-4xl font-bold text-gray-900">Leaderboard</h1>
                <button
                  onClick={exportLeaderboard}
                  disabled={exportLoading || leaderboard.length === 0}
                  className={`flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                    exportLoading || leaderboard.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gitam-primary hover:bg-gitam-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gitam-primary'
                  }`}
                >
                  {exportLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </>
                  )}
                </button>
              </div>
              <p className="text-gray-600">
                Celebrate achievements and compete with peers
              </p>
            </div>

            {/* Filters */}
            <div className="gitam-card p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Period
                  </label>
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-gitam-primary focus:ring-gitam-primary sm:text-sm"
                  >
                    <option value="all">All Time</option>
                    <option value="year">This Year</option>
                    <option value="semester">This Semester</option>
                    <option value="month">This Month</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-gitam-primary focus:ring-gitam-primary sm:text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="Curricular">Curricular</option>
                    <option value="Co-curricular">Co-curricular</option>
                    <option value="Extracurricular">Extracurricular</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Showing</p>
                    <p className="text-2xl font-bold text-gitam-primary">{leaderboard.length}</p>
                    <p className="text-sm text-gray-600">students</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current User Rank (if not in top 10) */}
            {userRank && userRank.rank > 10 && (
              <div className="mb-6">
                <div className="gitam-card p-4 border-2 border-gitam-primary">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-10 h-10 bg-gitam-primary text-white rounded-full font-bold">
                        #{userRank.rank}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Your Rank</h3>
                        <p className="text-sm text-gray-600">{userRank.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Trophy className="h-5 w-5 text-gitam-primary" />
                        <span className="text-xl font-bold text-gitam-primary">
                          {userRank.total_points}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {userRank.achievement_count} achievements
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Top 3 Podium */}
            {leaderboard.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                  🏆 Top Performers - {getTimeFilterLabel()}
                </h2>
                <div className="flex justify-center items-end space-x-4">
                  {/* 2nd Place */}
                  {leaderboard[1] && (
                    <div className="text-center">
                      <div className="gitam-card p-6 w-48 mb-4">
                        <Medal className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          {leaderboard[1].name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {leaderboard[1].roll_number_faculty_id}
                        </p>
                        <div className="flex items-center justify-center space-x-1">
                          <Trophy className="h-4 w-4 text-gitam-primary" />
                          <span className="text-xl font-bold text-gitam-primary">
                            {leaderboard[1].total_points}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {leaderboard[1].achievement_count} achievements
                        </p>
                      </div>
                      <div className="bg-gray-400 h-16 w-48 rounded-t-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">#2</span>
                      </div>
                    </div>
                  )}

                  {/* 1st Place */}
                  {leaderboard[0] && (
                    <div className="text-center">
                      <div className="gitam-card p-6 w-52 mb-4 border-2 border-yellow-400">
                        <Crown className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                        <h3 className="font-bold text-xl text-gray-900 mb-1">
                          {leaderboard[0].name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {leaderboard[0].roll_number_faculty_id}
                        </p>
                        <div className="flex items-center justify-center space-x-1">
                          <Trophy className="h-5 w-5 text-yellow-500" />
                          <span className="text-2xl font-bold text-yellow-500">
                            {leaderboard[0].total_points}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {leaderboard[0].achievement_count} achievements
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-20 w-52 rounded-t-lg flex items-center justify-center">
                        <span className="text-white font-bold text-2xl">#1</span>
                      </div>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {leaderboard[2] && (
                    <div className="text-center">
                      <div className="gitam-card p-6 w-48 mb-4">
                        <Award className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
                          {leaderboard[2].name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {leaderboard[2].roll_number_faculty_id}
                        </p>
                        <div className="flex items-center justify-center space-x-1">
                          <Trophy className="h-4 w-4 text-gitam-primary" />
                          <span className="text-xl font-bold text-gitam-primary">
                            {leaderboard[2].total_points}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {leaderboard[2].achievement_count} achievements
                        </p>
                      </div>
                      <div className="bg-amber-600 h-12 w-48 rounded-t-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">#3</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Full Leaderboard */}
            <div className="gitam-card">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Complete Leaderboard</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {leaderboard.length > 0 ? (
                  leaderboard.map((entry) => (
                    <div key={entry.user_id} className={`p-6 ${getRankBg(entry.rank)} ${entry.user_id === userProfile?.id ? 'ring-2 ring-gitam-primary' : ''}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-10 h-10">
                            {getRankIcon(entry.rank)}
                          </div>
                          <div>
                            <h4 className={`font-semibold ${entry.rank <= 3 ? 'text-white' : 'text-gray-900'}`}>
                              {entry.name}
                              {entry.user_id === userProfile?.id && (
                                <span className="ml-2 text-sm font-normal">(You)</span>
                              )}
                            </h4>
                            <p className={`text-sm ${entry.rank <= 3 ? 'text-white opacity-90' : 'text-gray-600'}`}>
                              {entry.roll_number_faculty_id} • {entry.branch}
                            </p>
                            {entry.recent_achievement && (
                              <p className={`text-xs mt-1 ${entry.rank <= 3 ? 'text-white opacity-75' : 'text-gray-500'}`}>
                                Recent: {entry.recent_achievement}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <Trophy className={`h-5 w-5 ${entry.rank <= 3 ? 'text-white' : 'text-gitam-primary'}`} />
                            <span className={`text-xl font-bold ${entry.rank <= 3 ? 'text-white' : 'text-gitam-primary'}`}>
                              {entry.total_points}
                            </span>
                          </div>
                          <p className={`text-sm ${entry.rank <= 3 ? 'text-white opacity-90' : 'text-gray-600'}`}>
                            {entry.achievement_count} achievements
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-12 text-center">
                    <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No rankings yet</h3>
                    <p className="text-gray-600">
                      Be the first to appear on the leaderboard by submitting an achievement!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
