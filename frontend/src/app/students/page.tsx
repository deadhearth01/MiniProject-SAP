'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { Search, Trophy, User, Mail, Book, Calendar, Download, Loader2 } from 'lucide-react'
import * as XLSX from 'xlsx'

interface Student {
  id: string
  name: string
  roll_number_faculty_id: string
  email: string
  school: string
  branch: string
  batch: string
  phone: string
  total_points?: number
  achievement_count?: number
}

interface Achievement {
  id: string
  event_name: string
  category: string
  level: string
  date: string
  position: string
  points: number
  status: string
}

export default function SearchStudentsPage() {
  const { userProfile } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [studentAchievements, setStudentAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [achievementsLoading, setAchievementsLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)

  useEffect(() => {
    fetchStudents()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStudents(students)
    } else {
      const filtered = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.roll_number_faculty_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.school.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredStudents(filtered)
    }
  }, [searchTerm, students])

  const fetchStudents = async () => {
    try {
      setLoading(true)
      
      // Fetch all students (not faculty or admin)
      const { data: studentsData, error: studentsError } = await supabase
        .from('users')
        .select('*')
        .eq('is_faculty', false)
        .eq('is_admin', false)
        .order('name')

      if (studentsError) throw studentsError

      // Fetch achievements count and points for each student
      const studentsWithStats = await Promise.all(
        (studentsData || []).map(async (student) => {
          const { data: achievements } = await supabase
            .from('achievements')
            .select('points, status')
            .eq('user_id', student.id)

          const approvedAchievements = achievements?.filter(a => a.status === 'approved') || []
          const totalPoints = approvedAchievements.reduce((sum, a) => sum + (a.points || 0), 0)
          
          return {
            ...student,
            achievement_count: achievements?.length || 0,
            total_points: totalPoints
          }
        })
      )

      setStudents(studentsWithStats)
      setFilteredStudents(studentsWithStats)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudentAchievements = async (studentId: string) => {
    try {
      setAchievementsLoading(true)
      
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', studentId)
        .order('date', { ascending: false })

      if (error) throw error

      setStudentAchievements(data || [])
    } catch (error) {
      console.error('Error fetching achievements:', error)
    } finally {
      setAchievementsLoading(false)
    }
  }

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student)
    fetchStudentAchievements(student.id)
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
      case 'International': return 'text-purple-600'
      case 'National': return 'text-blue-600'
      case 'State': return 'text-green-600'
      case 'College': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  const exportStudents = async () => {
    setExportLoading(true)
    try {
      console.log('👥 [EXPORT] Starting student search export...')

      // Use filtered students if there's a search term, otherwise all students
      const studentsToExport = searchTerm.trim() !== '' ? filteredStudents : students

      // Transform data for Excel
      const excelData = studentsToExport.map((student) => ({
        'Name': student.name,
        'Roll Number/ID': student.roll_number_faculty_id,
        'Email': student.email,
        'School': student.school,
        'Branch': student.branch,
        'Batch': student.batch,
        'Phone': student.phone,
        'Total Points': student.total_points || 0,
        'Achievement Count': student.achievement_count || 0,
        'Search Filter': searchTerm.trim() !== '' ? `Search: "${searchTerm}"` : 'All Students'
      }))

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
        { wch: 8 },  // Batch
        { wch: 12 }, // Phone
        { wch: 12 }, // Total Points
        { wch: 16 }, // Achievement Count
        { wch: 20 }  // Search Filter
      ]
      ws['!cols'] = colWidths

      XLSX.utils.book_append_sheet(wb, ws, 'Students')

      // Generate filename with timestamp and search info
      const timestamp = new Date().toISOString().split('T')[0]
      const searchSuffix = searchTerm.trim() !== '' ? '_search_results' : '_all'
      const filename = `students${searchSuffix}_${timestamp}.xlsx`

      // Save file
      XLSX.writeFile(wb, filename)

      console.log('✅ [EXPORT] Student search export completed')

    } catch (error: any) {
      console.error('❌ [EXPORT] Student search export failed:', error)
      alert('Failed to export student data. Please try again.')
    } finally {
      setExportLoading(false)
    }
  }

  return (
    <ProtectedRoute requiredRole="faculty">
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Search Students</h1>
                <p className="text-sm sm:text-base text-gray-600">Search and view student achievement records</p>
              </div>
              <button
                onClick={exportStudents}
                disabled={exportLoading || filteredStudents.length === 0}
                className={`flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                  exportLoading || filteredStudents.length === 0
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
                    Export Results
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, roll number, email, branch, or school..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007367] focus:border-transparent"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Found {filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Students List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="bg-[#007367] text-white px-4 sm:px-6 py-3 sm:py-4">
                <h2 className="text-lg sm:text-xl font-semibold">Students</h2>
              </div>
              
              <div className="divide-y divide-gray-200 max-h-[400px] sm:max-h-[600px] overflow-y-auto">
                {loading ? (
                  <div className="p-6 sm:p-8 text-center text-gray-500 text-sm sm:text-base">
                    Loading students...
                  </div>
                ) : filteredStudents.length === 0 ? (
                  <div className="p-6 sm:p-8 text-center text-gray-500 text-sm sm:text-base">
                    No students found
                  </div>
                ) : (
                  filteredStudents.map((student) => (
                    <button
                      key={student.id}
                      onClick={() => handleStudentClick(student)}
                      className={`w-full text-left p-3 sm:p-4 hover:bg-gray-50 transition-colors ${
                        selectedStudent?.id === student.id ? 'bg-[#ebdfbc]' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{student.name}</h3>
                          <p className="text-xs sm:text-sm text-gray-600">{student.roll_number_faculty_id}</p>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">{student.branch} • {student.batch}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="flex items-center gap-1 text-[#007367] font-semibold text-sm sm:text-base">
                            <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{student.achievement_count || 0}</span>
                          </div>
                          <p className="text-xs text-gray-500">{student.total_points || 0} pts</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Student Details & Achievements */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {selectedStudent ? (
                <>
                  <div className="bg-[#007367] text-white px-4 sm:px-6 py-3 sm:py-4">
                    <h2 className="text-lg sm:text-xl font-semibold">Student Details</h2>
                  </div>
                  
                  {/* Student Info */}
                  <div className="p-4 sm:p-6 border-b border-gray-200">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-gray-500">Name</p>
                          <p className="font-semibold text-sm sm:text-base truncate">{selectedStudent.name}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Book className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-gray-500">Roll Number</p>
                          <p className="font-semibold text-sm sm:text-base">{selectedStudent.roll_number_faculty_id}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm text-gray-500">Email</p>
                          <p className="font-semibold text-xs sm:text-sm break-all">{selectedStudent.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm text-gray-500">Branch & Batch</p>
                          <p className="font-semibold text-sm sm:text-base">{selectedStudent.branch} • {selectedStudent.batch}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 sm:gap-6 pt-3">
                        <div className="text-center flex-1">
                          <p className="text-xl sm:text-2xl font-bold text-[#007367]">{selectedStudent.achievement_count || 0}</p>
                          <p className="text-xs text-gray-500">Achievements</p>
                        </div>
                        <div className="text-center flex-1">
                          <p className="text-xl sm:text-2xl font-bold text-[#007367]">{selectedStudent.total_points || 0}</p>
                          <p className="text-xs text-gray-500">Total Points</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Achievements List */}
                  <div className="p-4 sm:p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Achievements</h3>
                    <div className="space-y-3 max-h-[350px] overflow-y-auto">
                      {achievementsLoading ? (
                        <p className="text-center text-gray-500 py-4">Loading achievements...</p>
                      ) : studentAchievements.length === 0 ? (
                        <p className="text-center text-gray-500 py-4">No achievements found</p>
                      ) : (
                        studentAchievements.map((achievement) => (
                          <div key={achievement.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900">{achievement.event_name}</h4>
                              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(achievement.status)}`}>
                                {achievement.status}
                              </span>
                            </div>
                            <div className="space-y-1 text-sm">
                              <p className="text-gray-600">
                                <span className={`font-semibold ${getLevelColor(achievement.level)}`}>
                                  {achievement.level}
                                </span>
                                {' • '}
                                {achievement.category}
                              </p>
                              <p className="text-gray-600">{achievement.position}</p>
                              <p className="text-gray-500">{new Date(achievement.date).toLocaleDateString()}</p>
                              {achievement.status === 'approved' && (
                                <p className="text-[#007367] font-semibold">{achievement.points} points</p>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[500px] text-gray-500">
                  <div className="text-center">
                    <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-sm sm:text-base text-gray-600">Select a student to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
