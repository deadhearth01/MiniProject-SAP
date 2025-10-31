'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { useSearchParams } from 'next/navigation'
import { 
  Trophy, 
  Filter, 
  Search, 
  Calendar,
  MapPin,
  Award,
  User,
  Eye,
  Download,
  Plus
} from 'lucide-react'
import Link from 'next/link'

function AchievementsContent() {
  const { userProfile } = useAuth()
  const searchParams = useSearchParams()
  const [achievements, setAchievements] = useState<any[]>([])
  const [filteredAchievements, setFilteredAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    category: '',
    level: '',
    status: '',
    year: '',
    month: ''
  })
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    if (searchParams.get('success')) {
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 5000)
    }
    fetchAchievements()
  }, [searchParams])

  useEffect(() => {
    applyFilters()
  }, [achievements, searchTerm, selectedFilters])

  const fetchAchievements = async () => {
    try {
      let query = supabase
        .from('achievements')
        .select(`
          *,
          users:user_id (
            name,
            roll_number_faculty_id,
            school,
            branch
          )
        `)

      // If not admin/faculty, only show approved achievements + own achievements
      if (!userProfile?.is_admin && !userProfile?.is_faculty) {
        query = query.or(`status.eq.approved,user_id.eq.${userProfile?.id}`)
      }

      const { data, error } = await query.order('submitted_at', { ascending: false })

      if (error) {
        console.error('Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        })
        throw error
      }
      
      setAchievements(data || [])
    } catch (error: any) {
      console.error('Error fetching achievements:', error)
      console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...achievements]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter((achievement: any) => {
        const user = achievement.users
        return achievement.event_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          achievement.organizer.toLowerCase().includes(searchTerm.toLowerCase())
      })
    }

    // Category filter
    if (selectedFilters.category) {
      filtered = filtered.filter(achievement => achievement.category === selectedFilters.category)
    }

    // Level filter
    if (selectedFilters.level) {
      filtered = filtered.filter(achievement => achievement.level === selectedFilters.level)
    }

    // Status filter
    if (selectedFilters.status) {
      filtered = filtered.filter(achievement => achievement.status === selectedFilters.status)
    }

    // Year filter
    if (selectedFilters.year) {
      filtered = filtered.filter(achievement => 
        new Date(achievement.date).getFullYear().toString() === selectedFilters.year
      )
    }

    // Month filter
    if (selectedFilters.month) {
      filtered = filtered.filter(achievement => 
        (new Date(achievement.date).getMonth() + 1).toString() === selectedFilters.month
      )
    }

    setFilteredAchievements(filtered)
  }

  const handleFilterChange = (filterType: string, value: string) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearFilters = () => {
    setSelectedFilters({
      category: '',
      level: '',
      status: '',
      year: '',
      month: ''
    })
    setSearchTerm('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'International': return 'bg-purple-100 text-purple-800'
      case 'National': return 'bg-blue-100 text-blue-800'
      case 'State': return 'bg-green-100 text-green-800'
      case 'College': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPositionIcon = (position: string) => {
    switch (position) {
      case '1st': return '🥇'
      case '2nd': return '🥈'
      case '3rd': return '🥉'
      default: return '🏅'
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
            {/* Success Message */}
            {showSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">
                Achievement submitted successfully! It will be reviewed by the admin team.
              </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
                <p className="text-gray-600 mt-2">
                  Explore achievements from the GITAM community
                </p>
              </div>
              <Link
                href="/achievements/submit"
                className="gitam-btn-primary flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Submit Achievement</span>
              </Link>
            </div>

            {/* Filters and Search */}
            <div className="gitam-card p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                {/* Search */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      placeholder="Search achievements..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-gitam-primary focus:ring-gitam-primary sm:text-sm"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <select
                    value={selectedFilters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-gitam-primary focus:ring-gitam-primary sm:text-sm"
                  >
                    <option value="">All Categories</option>
                    <option value="Curricular">Curricular</option>
                    <option value="Co-curricular">Co-curricular</option>
                    <option value="Extracurricular">Extracurricular</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Level Filter */}
                <div>
                  <select
                    value={selectedFilters.level}
                    onChange={(e) => handleFilterChange('level', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-gitam-primary focus:ring-gitam-primary sm:text-sm"
                  >
                    <option value="">All Levels</option>
                    <option value="International">International</option>
                    <option value="National">National</option>
                    <option value="State">State</option>
                    <option value="College">College</option>
                  </select>
                </div>

                {/* Status Filter (Admin/Faculty only) */}
                {(userProfile?.is_admin || userProfile?.is_faculty) && (
                  <div>
                    <select
                      value={selectedFilters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-gitam-primary focus:ring-gitam-primary sm:text-sm"
                    >
                      <option value="">All Status</option>
                      <option value="approved">Approved</option>
                      <option value="pending">Pending</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                )}

                {/* Year Filter */}
                <div>
                  <select
                    value={selectedFilters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-gitam-primary focus:ring-gitam-primary sm:text-sm"
                  >
                    <option value="">All Years</option>
                    {[2024, 2025, 2026, 2027].map(year => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Showing {filteredAchievements.length} of {achievements.length} achievements
                </p>
                <button
                  onClick={clearFilters}
                  className="text-gitam-primary hover:text-gitam-dark text-sm font-medium"
                >
                  Clear filters
                </button>
              </div>
            </div>

            {/* Achievements Grid */}
            {filteredAchievements.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAchievements.map((achievement) => (
                  <div key={achievement.id} className="gitam-card overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-2xl">{getPositionIcon(achievement.position)}</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(achievement.level)}`}>
                            {achievement.level}
                          </span>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(achievement.status)}`}>
                          {achievement.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {achievement.event_name}
                      </h3>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          <span>
                            {achievement.users?.name} ({achievement.users?.roll_number_faculty_id})
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Award className="h-4 w-4 mr-2" />
                          <span>{achievement.organizer}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>{achievement.place}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{new Date(achievement.date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-gray-500">Category:</span>
                          <span className="text-sm font-medium text-gray-900 ml-1">
                            {achievement.category}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Trophy className="h-4 w-4 text-gitam-primary" />
                          <span className="text-sm font-semibold text-gitam-primary">
                            {achievement.points} pts
                          </span>
                        </div>
                      </div>

                      {achievement.remarks && (
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <p className="text-sm text-gray-600">{achievement.remarks}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Trophy className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements found</h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm || Object.values(selectedFilters).some(v => v)
                    ? 'Try adjusting your search or filters'
                    : 'Be the first to submit an achievement!'
                  }
                </p>
                <Link
                  href="/achievements/submit"
                  className="gitam-btn-primary inline-flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Submit Achievement</span>
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}

export default function AchievementsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gitam-primary mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading achievements...</p>
      </div>
    </div>}>
      <AchievementsContent />
    </Suspense>
  )
}
