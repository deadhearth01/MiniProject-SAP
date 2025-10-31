'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import {
  Download,
  FileSpreadsheet,
  Users,
  Trophy,
  Search,
  Loader2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import * as XLSX from 'xlsx'

interface AchievementData {
  id: string
  user_id: string
  event_name: string
  category: string
  level: string
  position: string
  points: number
  date: string
  organizer: string
  status: string
  submitted_at: string
  approved_at?: string
  user_name: string
  roll_number_faculty_id: string
  school: string
  branch: string
}

interface LeaderboardData {
  rank: number
  name: string
  roll_number_faculty_id: string
  school: string
  branch: string
  total_points: number
  achievement_count: number
}

interface StudentData {
  id: string
  name: string
  roll_number_faculty_id: string
  email: string
  school: string
  branch: string
  is_faculty: boolean
  total_points: number
  achievement_count: number
}

export default function AdminExportPage() {
  const { userProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [exportStatus, setExportStatus] = useState<{
    type: string
    status: 'idle' | 'loading' | 'success' | 'error'
    message?: string
  }>({ type: '', status: 'idle' })

  const exportAchievements = async () => {
    setLoading(true)
    setExportStatus({ type: 'achievements', status: 'loading' })

    try {
      console.log('📊 [EXPORT] Starting achievements export...')

      // Fetch all achievements with user data
      const { data: achievements, error } = await supabase
        .from('achievements')
        .select(`
          *,
          users (
            name,
            roll_number_faculty_id,
            school,
            branch
          )
        `)
        .order('submitted_at', { ascending: false })

      if (error) throw error

      console.log(`✅ [EXPORT] Fetched ${achievements?.length || 0} achievements`)

      // Transform data for Excel
      const excelData = achievements?.map((achievement: any) => ({
        'Student Name': achievement.users?.name || 'Unknown',
        'Roll Number/ID': achievement.users?.roll_number_faculty_id || 'Unknown',
        'School': achievement.users?.school || 'Unknown',
        'Branch': achievement.users?.branch || 'Unknown',
        'Event Name': achievement.event_name,
        'Category': achievement.category,
        'Level': achievement.level,
        'Position': achievement.position,
        'Points': achievement.points,
        'Date': new Date(achievement.date).toLocaleDateString(),
        'Organizer': achievement.organizer,
        'Status': achievement.status,
        'Submitted Date': new Date(achievement.submitted_at).toLocaleString(),
        'Approved Date': achievement.approved_at ? new Date(achievement.approved_at).toLocaleString() : 'Not approved'
      })) || []

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(excelData)

      // Auto-size columns
      const colWidths = [
        { wch: 20 }, // Student Name
        { wch: 15 }, // Roll Number/ID
        { wch: 15 }, // School
        { wch: 15 }, // Branch
        { wch: 25 }, // Event Name
        { wch: 15 }, // Category
        { wch: 10 }, // Level
        { wch: 10 }, // Position
        { wch: 8 },  // Points
        { wch: 12 }, // Date
        { wch: 20 }, // Organizer
        { wch: 10 }, // Status
        { wch: 18 }, // Submitted Date
        { wch: 18 }  // Approved Date
      ]
      ws['!cols'] = colWidths

      XLSX.utils.book_append_sheet(wb, ws, 'Achievements')

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `achievements_export_${timestamp}.xlsx`

      // Save file
      XLSX.writeFile(wb, filename)

      console.log('✅ [EXPORT] Achievements export completed')
      setExportStatus({
        type: 'achievements',
        status: 'success',
        message: `Exported ${excelData.length} achievements to ${filename}`
      })

    } catch (error: any) {
      console.error('❌ [EXPORT] Achievements export failed:', error)
      setExportStatus({
        type: 'achievements',
        status: 'error',
        message: error.message || 'Failed to export achievements'
      })
    } finally {
      setLoading(false)
    }
  }

  const exportLeaderboard = async () => {
    setLoading(true)
    setExportStatus({ type: 'leaderboard', status: 'loading' })

    try {
      console.log('🏆 [EXPORT] Starting leaderboard export...')

      // Fetch leaderboard data
      const { data: leaderboard, error } = await supabase
        .rpc('get_leaderboard')
        .order('total_points', { ascending: false })

      if (error) throw error

      console.log(`✅ [EXPORT] Fetched ${leaderboard?.length || 0} leaderboard entries`)

      // Transform data for Excel
      const excelData = leaderboard?.map((entry: any, index: number) => ({
        'Rank': index + 1,
        'Name': entry.name,
        'Roll Number/ID': entry.roll_number_faculty_id,
        'School': entry.school,
        'Branch': entry.branch,
        'Total Points': entry.total_points,
        'Achievement Count': entry.achievement_count
      })) || []

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
        { wch: 16 }  // Achievement Count
      ]
      ws['!cols'] = colWidths

      XLSX.utils.book_append_sheet(wb, ws, 'Leaderboard')

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `leaderboard_export_${timestamp}.xlsx`

      // Save file
      XLSX.writeFile(wb, filename)

      console.log('✅ [EXPORT] Leaderboard export completed')
      setExportStatus({
        type: 'leaderboard',
        status: 'success',
        message: `Exported ${excelData.length} leaderboard entries to ${filename}`
      })

    } catch (error: any) {
      console.error('❌ [EXPORT] Leaderboard export failed:', error)
      setExportStatus({
        type: 'leaderboard',
        status: 'error',
        message: error.message || 'Failed to export leaderboard'
      })
    } finally {
      setLoading(false)
    }
  }

  const exportStudents = async () => {
    setLoading(true)
    setExportStatus({ type: 'students', status: 'loading' })

    try {
      console.log('👥 [EXPORT] Starting students export...')

      // Fetch all students with achievement stats
      const { data: students, error } = await supabase
        .from('users')
        .select(`
          *,
          achievements (
            points
          )
        `)
        .order('name')

      if (error) throw error

      console.log(`✅ [EXPORT] Fetched ${students?.length || 0} students`)

      // Transform data for Excel
      const excelData = students?.map((student: any) => {
        const achievementCount = student.achievements?.length || 0
        const totalPoints = student.achievements?.reduce((sum: number, ach: any) => sum + (ach.points || 0), 0) || 0

        return {
          'Name': student.name,
          'Roll Number/ID': student.roll_number_faculty_id,
          'Email': student.email,
          'School': student.school,
          'Branch': student.branch,
          'Type': student.is_faculty ? 'Faculty' : 'Student',
          'Total Points': totalPoints,
          'Achievement Count': achievementCount,
          'Joined Date': new Date(student.created_at).toLocaleDateString()
        }
      }) || []

      // Create workbook and worksheet
      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(excelData)

      // Auto-size columns
      const colWidths = [
        { wch: 20 }, // Name
        { wch: 15 }, // Roll Number/ID
        { wch: 25 }, // Email
        { wch: 15 }, // School
        { wch: 15 }, // Branch
        { wch: 8 },  // Type
        { wch: 12 }, // Total Points
        { wch: 16 }, // Achievement Count
        { wch: 12 }  // Joined Date
      ]
      ws['!cols'] = colWidths

      XLSX.utils.book_append_sheet(wb, ws, 'Students')

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `students_export_${timestamp}.xlsx`

      // Save file
      XLSX.writeFile(wb, filename)

      console.log('✅ [EXPORT] Students export completed')
      setExportStatus({
        type: 'students',
        status: 'success',
        message: `Exported ${excelData.length} students to ${filename}`
      })

    } catch (error: any) {
      console.error('❌ [EXPORT] Students export failed:', error)
      setExportStatus({
        type: 'students',
        status: 'error',
        message: error.message || 'Failed to export students'
      })
    } finally {
      setLoading(false)
    }
  }

  const exportOptions = [
    {
      id: 'achievements',
      title: 'Export Achievements',
      description: 'Download all achievement records with student details',
      icon: Trophy,
      color: 'bg-blue-500',
      action: exportAchievements
    },
    {
      id: 'leaderboard',
      title: 'Export Leaderboard',
      description: 'Download current leaderboard rankings',
      icon: FileSpreadsheet,
      color: 'bg-green-500',
      action: exportLeaderboard
    },
    {
      id: 'students',
      title: 'Export Students',
      description: 'Download all student records with achievement stats',
      icon: Users,
      color: 'bg-purple-500',
      action: exportStudents
    }
  ]

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50">
        <Navigation />

        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Data Export</h1>
              <p className="text-gray-600 mt-2">
                Export achievement data, leaderboard rankings, and student information
              </p>
            </div>

            {/* Status Message */}
            {exportStatus.status !== 'idle' && (
              <div className={`mb-6 p-4 rounded-lg flex items-center space-x-3 ${
                exportStatus.status === 'success' ? 'bg-green-50 border border-green-200' :
                exportStatus.status === 'error' ? 'bg-red-50 border border-red-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                {exportStatus.status === 'loading' && <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />}
                {exportStatus.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                {exportStatus.status === 'error' && <AlertCircle className="h-5 w-5 text-red-500" />}

                <div>
                  <p className={`font-medium ${
                    exportStatus.status === 'success' ? 'text-green-800' :
                    exportStatus.status === 'error' ? 'text-red-800' :
                    'text-blue-800'
                  }`}>
                    {exportStatus.status === 'loading' ? `Exporting ${exportStatus.type}...` :
                     exportStatus.status === 'success' ? 'Export Successful' :
                     'Export Failed'}
                  </p>
                  {exportStatus.message && (
                    <p className={`text-sm mt-1 ${
                      exportStatus.status === 'success' ? 'text-green-600' :
                      exportStatus.status === 'error' ? 'text-red-600' :
                      'text-blue-600'
                    }`}>
                      {exportStatus.message}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Export Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exportOptions.map((option) => {
                const Icon = option.icon
                const isLoading = loading && exportStatus.type === option.id

                return (
                  <div key={option.id} className="gitam-card p-6">
                    <div className={`inline-flex p-3 rounded-lg ${option.color} text-white mb-4`}>
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {option.title}
                    </h3>

                    <p className="text-gray-600 text-sm mb-4">
                      {option.description}
                    </p>

                    <button
                      onClick={option.action}
                      disabled={loading}
                      className={`w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                        isLoading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gitam-primary hover:bg-gitam-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gitam-primary'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Exporting...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Export to Excel
                        </>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>

            {/* Information */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start">
                <FileSpreadsheet className="h-6 w-6 text-blue-500 mt-0.5 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-blue-900 mb-2">
                    Export Information
                  </h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• All exports are saved as Excel (.xlsx) files</li>
                    <li>• Files include timestamps in the filename</li>
                    <li>• Achievement exports include approval status and dates</li>
                    <li>• Leaderboard exports show current rankings</li>
                    <li>• Student exports include achievement statistics</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}