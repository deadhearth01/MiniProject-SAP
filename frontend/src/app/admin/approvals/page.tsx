'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Download,
  User,
  Calendar,
  MapPin,
  Award,
  FileText,
  Image as ImageIcon,
  Filter
} from 'lucide-react'

export default function AdminApprovalsPage() {
  const { userProfile } = useAuth()
  const [achievements, setAchievements] = useState<any[]>([])
  const [filteredAchievements, setFilteredAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(false) // Start as false since global loading handles initial state
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null)
  const [showModal, setShowModal] = useState(false)
  const [statusFilter, setStatusFilter] = useState('pending')

  useEffect(() => {
    fetchAchievements()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [achievements, statusFilter])

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select(`
          *,
          users:user_id (
            name,
            roll_number_faculty_id,
            school,
            branch,
            specialization,
            batch,
            email,
            contact
          )
        `)
        .order('submitted_at', { ascending: false })

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
      console.error('Full error:', JSON.stringify(error, Object.getOwnPropertyNames(error)))
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...achievements]

    if (statusFilter !== 'all') {
      filtered = filtered.filter(achievement => achievement.status === statusFilter)
    }

    setFilteredAchievements(filtered)
  }

  const handleApproval = async (achievementId: string, status: 'approved' | 'rejected', remarks?: string) => {
    setProcessingId(achievementId)
    try {
      const { error } = await supabase
        .from('achievements')
        .update({
          status,
          approved_at: status === 'approved' ? new Date().toISOString() : null,
          approved_by: userProfile?.id,
        })
        .eq('id', achievementId)

      if (error) throw error

      // Find the achievement to get user info for notification
      const achievement = achievements.find(a => a.id === achievementId)
      
      // Send notification to user
      if (achievement) {
        await supabase
          .from('notifications')
          .insert({
            user_id: achievement.user_id,
            message: `Your achievement "${achievement.event_name}" has been ${status}`,
            type: status === 'approved' ? 'approval' : 'rejection'
          })

        // Update leaderboard if approved
        if (status === 'approved') {
          await updateLeaderboard(achievement.user_id, achievement.points || 0)
        }
      }

      // Refresh the list
      fetchAchievements()
      setShowModal(false)
      setSelectedAchievement(null)
    } catch (error) {
      console.error('Error updating achievement:', error)
      alert('Error processing achievement. Please try again.')
    } finally {
      setProcessingId(null)
    }
  }

  const updateLeaderboard = async (userId: string, points: number) => {
    try {
      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth() + 1

      // Check if leaderboard entry exists for this user/year
      const { data: existing, error: fetchError } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('user_id', userId)
        .eq('year', currentYear)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

      if (existing) {
        // Update existing entry
        await supabase
          .from('leaderboard')
          .update({
            total_points: existing.total_points + points,
            month: currentMonth
          })
          .eq('id', existing.id)
      } else {
        // Create new entry
        await supabase
          .from('leaderboard')
          .insert({
            user_id: userId,
            total_points: points,
            year: currentYear,
            month: currentMonth,
            rank: 1 // Will be updated by a trigger or separate function
          })
      }

      // Recalculate ranks (simplified version)
      await recalculateRanks(currentYear)
    } catch (error) {
      console.error('Error updating leaderboard:', error)
    }
  }

  const recalculateRanks = async (year: number) => {
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('id, total_points')
        .eq('year', year)
        .order('total_points', { ascending: false })

      if (error) throw error

      // Update ranks
      const updates = data.map((entry, index) => 
        supabase
          .from('leaderboard')
          .update({ rank: index + 1 })
          .eq('id', entry.id)
      )

      await Promise.all(updates)
    } catch (error) {
      console.error('Error recalculating ranks:', error)
    }
  }

  const openModal = (achievement: any) => {
    setSelectedAchievement(achievement)
    setShowModal(true)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'pending': return <Clock className="h-5 w-5 text-yellow-600" />
      case 'rejected': return <XCircle className="h-5 w-5 text-red-600" />
      default: return <Clock className="h-5 w-5 text-gray-600" />
    }
  }

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
              <h1 className="text-3xl font-bold text-gray-900">Achievement Approvals</h1>
              <p className="text-gray-600 mt-2">
                Review and manage achievement submissions
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {[
                { label: 'Pending', status: 'pending', color: 'bg-yellow-500' },
                { label: 'Approved', status: 'approved', color: 'bg-green-500' },
                { label: 'Rejected', status: 'rejected', color: 'bg-red-500' },
                { label: 'Total', status: 'all', color: 'bg-blue-500' }
              ].map(stat => {
                const count = stat.status === 'all' 
                  ? achievements.length 
                  : achievements.filter(a => a.status === stat.status).length
                
                return (
                  <div key={stat.status} className="gitam-card p-6">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                        {getStatusIcon(stat.status)}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                        <p className="text-2xl font-semibold text-gray-900">{count}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Filters */}
            <div className="gitam-card p-6 mb-6">
              <div className="flex items-center space-x-4">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-gitam-primary focus:ring-gitam-primary sm:text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                <span className="text-sm text-gray-600">
                  Showing {filteredAchievements.length} of {achievements.length} achievements
                </span>
              </div>
            </div>

            {/* Achievements List */}
            <div className="space-y-4">
              {filteredAchievements.length > 0 ? (
                filteredAchievements.map((achievement) => (
                  <div key={achievement.id} className="gitam-card">
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {achievement.event_name}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(achievement.status)}`}>
                              {achievement.status}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              <span>{achievement.users?.name} ({achievement.users?.roll_number_faculty_id})</span>
                            </div>
                            <div className="flex items-center">
                              <Award className="h-4 w-4 mr-2" />
                              <span>{achievement.category} • {achievement.level}</span>
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

                          <div className="mt-2">
                            <span className="text-sm font-medium text-gitam-primary">
                              Position: {achievement.position} • Points: {achievement.points}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button
                            onClick={() => openModal(achievement)}
                            className="flex items-center px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </button>
                          
                          {achievement.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproval(achievement.id, 'approved')}
                                disabled={processingId === achievement.id}
                                className="flex items-center px-3 py-1 text-sm bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors disabled:opacity-50"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleApproval(achievement.id, 'rejected')}
                                disabled={processingId === achievement.id}
                                className="flex items-center px-3 py-1 text-sm bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors disabled:opacity-50"
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Submitted: {new Date(achievement.submitted_at).toLocaleString()}
                        {achievement.approved_at && (
                          <span> • {achievement.status === 'approved' ? 'Approved' : 'Rejected'}: {new Date(achievement.approved_at).toLocaleString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Clock className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements found</h3>
                  <p className="text-gray-600">
                    {statusFilter === 'pending' 
                      ? 'No pending achievements to review'
                      : 'No achievements match the selected filter'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>

        {/* Achievement Detail Modal */}
        {showModal && selectedAchievement && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Achievement Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Event Name</label>
                        <p className="text-gray-900">{selectedAchievement.event_name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <p className="text-gray-900">{selectedAchievement.category}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Level</label>
                        <p className="text-gray-900">{selectedAchievement.level}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Position</label>
                        <p className="text-gray-900">{selectedAchievement.position}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Organizer</label>
                        <p className="text-gray-900">{selectedAchievement.organizer}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Place</label>
                        <p className="text-gray-900">{selectedAchievement.place}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Date</label>
                        <p className="text-gray-900">{new Date(selectedAchievement.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Points</label>
                        <p className="text-gray-900 font-semibold">{selectedAchievement.points}</p>
                      </div>
                    </div>
                  </div>

                  {/* Student Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Information</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Name</label>
                        <p className="text-gray-900">{selectedAchievement.users?.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Roll Number</label>
                        <p className="text-gray-900">{selectedAchievement.users?.roll_number_faculty_id}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">School</label>
                        <p className="text-gray-900">{selectedAchievement.users?.school}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Branch</label>
                        <p className="text-gray-900">{selectedAchievement.users?.branch}</p>
                      </div>
                      {selectedAchievement.users?.specialization && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Specialization</label>
                          <p className="text-gray-900">{selectedAchievement.users?.specialization}</p>
                        </div>
                      )}
                      {selectedAchievement.users?.batch && (
                        <div>
                          <label className="text-sm font-medium text-gray-700">Batch</label>
                          <p className="text-gray-900">{selectedAchievement.users?.batch}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Remarks */}
                {selectedAchievement.remarks && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Remarks</h3>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {selectedAchievement.remarks}
                    </p>
                  </div>
                )}

                {/* Files */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Attachments</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedAchievement.proof_file_path && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Proof Document</span>
                        </div>
                        <button className="text-gitam-primary hover:text-gitam-dark text-sm font-medium">
                          <Download className="h-4 w-4 inline mr-1" />
                          Download
                        </button>
                      </div>
                    )}
                    
                    {selectedAchievement.event_photos_paths && selectedAchievement.event_photos_paths.length > 0 && (
                      <div className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Event Photos ({selectedAchievement.event_photos_paths.length})</span>
                        </div>
                        <button className="text-gitam-primary hover:text-gitam-dark text-sm font-medium">
                          <Download className="h-4 w-4 inline mr-1" />
                          Download All
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {selectedAchievement.status === 'pending' && (
                  <div className="mt-8 flex justify-end space-x-4">
                    <button
                      onClick={() => handleApproval(selectedAchievement.id, 'rejected')}
                      disabled={processingId === selectedAchievement.id}
                      className="px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4 inline mr-2" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApproval(selectedAchievement.id, 'approved')}
                      disabled={processingId === selectedAchievement.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                    >
                      <CheckCircle className="h-4 w-4 inline mr-2" />
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  )
}
