'use client'

import React, { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { Upload, FileText, Download, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import * as XLSX from 'xlsx'

interface BulkAchievement {
  event_name: string
  category: string
  level: string
  date: string
  position: string
  school: string
  branch: string
  organizer: string
  place: string
  proof_file_path: string
  remarks?: string
  points: number
}

interface ValidationResult {
  row: number
  achievement: BulkAchievement
  errors: string[]
  status: 'valid' | 'invalid'
}

export default function BulkUploadPage() {
  const { userProfile } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [uploadStats, setUploadStats] = useState({ success: 0, failed: 0 })

  const downloadTemplate = () => {
    const template = [
      {
        event_name: 'Example Hackathon',
        category: 'Technical',
        level: 'National',
        date: '2024-10-15',
        position: '1st Prize',
        school: 'School of Technology',
        branch: 'Computer Science Engineering',
        organizer: 'IIT Delhi',
        place: 'New Delhi',
        proof_file_path: 'https://example.com/certificate.pdf',
        remarks: 'Won first prize',
        points: 100
      }
    ]

    const ws = XLSX.utils.json_to_sheet(template)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Achievements')
    XLSX.writeFile(wb, 'achievement_upload_template.xlsx')
  }

  const validateAchievement = (achievement: BulkAchievement, row: number): ValidationResult => {
    const errors: string[] = []

    if (!achievement.event_name || achievement.event_name.trim().length < 3) {
      errors.push('Event name must be at least 3 characters')
    }
    
    const validCategories = ['Technical', 'Academic', 'Sports', 'Cultural', 'Entrepreneurship', 'Social Service']
    if (!achievement.category || !validCategories.includes(achievement.category)) {
      errors.push(`Category must be one of: ${validCategories.join(', ')}`)
    }

    const validLevels = ['College', 'State', 'National', 'International']
    if (!achievement.level || !validLevels.includes(achievement.level)) {
      errors.push(`Level must be one of: ${validLevels.join(', ')}`)
    }

    if (!achievement.date || !Date.parse(achievement.date)) {
      errors.push('Invalid date format. Use YYYY-MM-DD')
    }

    if (!achievement.position || achievement.position.trim().length < 2) {
      errors.push('Position/Rank is required')
    }

    if (!achievement.points || achievement.points < 0) {
      errors.push('Points must be a positive number')
    }

    return {
      row,
      achievement,
      errors,
      status: errors.length === 0 ? 'valid' : 'invalid'
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0]
    if (!uploadedFile) return

    setFile(uploadedFile)
    setValidationResults([])
    setUploadComplete(false)

    try {
      const data = await uploadedFile.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json<BulkAchievement>(worksheet)

      const results = jsonData.map((achievement: any, index: number) => 
        validateAchievement(achievement, index + 2) // Row 2 is first data row (1 is header)
      )

      setValidationResults(results)
    } catch (error) {
      console.error('Error parsing file:', error)
      alert('Error reading file. Please ensure it\'s a valid Excel or CSV file.')
    }
  }

  const handleBulkUpload = async () => {
    if (!userProfile?.id) return

    const validAchievements = validationResults.filter(r => r.status === 'valid')
    
    if (validAchievements.length === 0) {
      alert('No valid achievements to upload')
      return
    }

    setUploading(true)
    let successCount = 0
    let failedCount = 0

    try {
      for (const result of validAchievements) {
        const { data, error } = await supabase
          .from('achievements')
          .insert({
            user_id: userProfile.id,
            ...result.achievement,
            status: 'pending',
            submitted_at: new Date().toISOString()
          })

        if (error) {
          console.error('Error uploading achievement:', error)
          failedCount++
        } else {
          successCount++
        }
      }

      setUploadStats({ success: successCount, failed: failedCount })
      setUploadComplete(true)
      
    } catch (error) {
      console.error('Bulk upload error:', error)
      alert('Error during bulk upload. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const validCount = validationResults.filter(r => r.status === 'valid').length
  const invalidCount = validationResults.filter(r => r.status === 'invalid').length

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="max-w-6xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Bulk Achievement Upload</h1>
              <p className="text-gray-600 mt-2">
                Upload multiple achievements at once using Excel or CSV files
              </p>
            </div>

            {/* Template Download */}
            <div className="gitam-card p-6 mb-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <Download className="h-8 w-8 text-gitam-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Download Template
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    Download the Excel template to see the required format and column names.
                  </p>
                  <button
                    onClick={downloadTemplate}
                    className="px-4 py-2 bg-gitam-primary text-white rounded-lg hover:bg-gitam-dark transition-colors"
                  >
                    Download Template
                  </button>
                </div>
              </div>
            </div>

            {/* File Upload */}
            <div className="gitam-card p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload File</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">
                  Upload Excel (.xlsx, .xls) or CSV (.csv) file
                </p>
                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer px-6 py-3 bg-gitam-primary text-white rounded-lg hover:bg-gitam-dark transition-colors inline-block"
                >
                  Choose File
                </label>
                {file && (
                  <p className="text-sm text-gray-600 mt-4">
                    Selected: {file.name}
                  </p>
                )}
              </div>
            </div>

            {/* Validation Results */}
            {validationResults.length > 0 && !uploadComplete && (
              <div className="gitam-card p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Validation Results</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold text-green-600">{validCount}</p>
                      <p className="text-sm text-gray-600">Valid Records</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <XCircle className="h-6 w-6 text-red-600" />
                    <div>
                      <p className="text-2xl font-bold text-red-600">{invalidCount}</p>
                      <p className="text-sm text-gray-600">Invalid Records</p>
                    </div>
                  </div>
                </div>

                {invalidCount > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-red-900 mb-2">Errors Found</h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {validationResults
                            .filter(r => r.status === 'invalid')
                            .map((result, index) => (
                              <div key={index} className="text-sm">
                                <p className="font-medium text-red-800">
                                  Row {result.row}: {result.achievement.event_name || 'Unnamed event'}
                                </p>
                                <ul className="list-disc list-inside ml-2 text-red-700">
                                  {result.errors.map((error, i) => (
                                    <li key={i}>{error}</li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {validCount > 0 && (
                  <button
                    onClick={handleBulkUpload}
                    disabled={uploading}
                    className="w-full px-6 py-3 bg-gitam-primary text-white rounded-lg hover:bg-gitam-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : `Upload ${validCount} Achievement(s)`}
                  </button>
                )}
              </div>
            )}

            {/* Upload Complete */}
            {uploadComplete && (
              <div className="gitam-card p-6">
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Complete!</h3>
                  <p className="text-gray-600 mb-4">
                    Successfully uploaded {uploadStats.success} achievement(s)
                    {uploadStats.failed > 0 && ` (${uploadStats.failed} failed)`}
                  </p>
                  <button
                    onClick={() => {
                      setFile(null)
                      setValidationResults([])
                      setUploadComplete(false)
                      setUploadStats({ success: 0, failed: 0 })
                    }}
                    className="px-6 py-2 bg-gitam-primary text-white rounded-lg hover:bg-gitam-dark transition-colors"
                  >
                    Upload More
                  </button>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="gitam-card p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions</h3>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm">
                <li>Download the template file to see the required format</li>
                <li>Fill in your achievements data in the template</li>
                <li>Save the file as Excel (.xlsx) or CSV (.csv)</li>
                <li>Upload the file using the button above</li>
                <li>Review validation results and fix any errors</li>
                <li>Click "Upload" to submit all valid achievements</li>
              </ol>
              <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Required Fields:</h4>
                <p className="text-sm text-blue-800">
                  event_name, category, level, date, position, school, branch, organizer, place, proof_file_path, points
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
