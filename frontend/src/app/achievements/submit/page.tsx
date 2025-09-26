'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X, FileText, Image as ImageIcon } from 'lucide-react'

const achievementSchema = z.object({
  event_name: z.string().min(1, 'Event name is required'),
  category: z.enum(['Curricular', 'Co-curricular', 'Extracurricular', 'Other']),
  level: z.enum(['College', 'State', 'National', 'International']),
  organizer: z.string().min(1, 'Organizer is required'),
  place: z.string().min(1, 'Place is required'),
  date: z.string().min(1, 'Date is required'),
  position: z.enum(['1st', '2nd', '3rd', 'Participation', 'Other']),
  remarks: z.string().optional(),
})

type AchievementFormData = z.infer<typeof achievementSchema>

export default function SubmitAchievementPage() {
  const { userProfile } = useAuth()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [eventPhotos, setEventPhotos] = useState<File[]>([])
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AchievementFormData>({
    resolver: zodResolver(achievementSchema)
  })

  const calculatePoints = (level: string, position: string) => {
    const levelPoints: Record<string, number> = {
      'International': 100,
      'National': 75,
      'State': 50,
      'College': 25
    }
    
    const positionMultiplier: Record<string, number> = {
      '1st': 1.0,
      '2nd': 0.8,
      '3rd': 0.6,
      'Participation': 0.3,
      'Other': 0.5
    }
    
    return Math.round((levelPoints[level] || 10) * (positionMultiplier[position] || 0.3))
  }

  const uploadFile = async (file: File, bucket: string) => {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file)

    if (error) throw error
    return data.path
  }

  const onSubmit = async (data: AchievementFormData) => {
    if (!userProfile) return
    
    setSubmitting(true)
    try {
      let proofFilePath = null
      let eventPhotoPaths: string[] = []

      // Upload proof file
      if (proofFile) {
        proofFilePath = await uploadFile(proofFile, 'achievement-proofs')
      }

      // Upload event photos
      if (eventPhotos.length > 0) {
        const uploadPromises = eventPhotos.map(photo => uploadFile(photo, 'event-photos'))
        eventPhotoPaths = await Promise.all(uploadPromises)
      }

      // Calculate points
      const points = calculatePoints(data.level, data.position)

      // Insert achievement
      const { error } = await supabase
        .from('achievements')
        .insert({
          ...data,
          user_id: userProfile.id,
          school: userProfile.school,
          branch: userProfile.branch,
          specialization: userProfile.specialization,
          batch: userProfile.batch,
          proof_file_path: proofFilePath,
          event_photos_paths: eventPhotoPaths,
          points,
          status: 'pending'
        })

      if (error) throw error

      // Create notification for admin
      await supabase
        .from('notifications')
        .insert({
          user_id: userProfile.id,
          message: `New achievement submitted: ${data.event_name}`,
          type: 'highlight'
        })

      reset()
      setProofFile(null)
      setEventPhotos([])
      router.push('/achievements?success=true')
    } catch (error) {
      console.error('Error submitting achievement:', error)
      alert('Error submitting achievement. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleProofFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setProofFile(file)
  }

  const handleEventPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setEventPhotos(prev => [...prev, ...files].slice(0, 5)) // Max 5 photos
  }

  const removeEventPhoto = (index: number) => {
    setEventPhotos(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Submit Achievement</h1>
              <p className="text-gray-600 mt-2">
                Share your latest achievement with the GITAM community
              </p>
            </div>

            <div className="gitam-card">
              <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="event_name" className="block text-sm font-medium text-gray-700">
                      Event Name *
                    </label>
                    <input
                      type="text"
                      id="event_name"
                      {...register('event_name')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gitam-primary focus:ring-gitam-primary sm:text-sm"
                      placeholder="e.g., National Programming Contest"
                    />
                    {errors.event_name && (
                      <p className="mt-1 text-sm text-red-600">{errors.event_name.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="organizer" className="block text-sm font-medium text-gray-700">
                      Organizer *
                    </label>
                    <input
                      type="text"
                      id="organizer"
                      {...register('organizer')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gitam-primary focus:ring-gitam-primary sm:text-sm"
                      placeholder="e.g., IEEE, ACM, University Name"
                    />
                    {errors.organizer && (
                      <p className="mt-1 text-sm text-red-600">{errors.organizer.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category *
                    </label>
                    <select
                      id="category"
                      {...register('category')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gitam-primary focus:ring-gitam-primary sm:text-sm"
                    >
                      <option value="">Select category</option>
                      <option value="Curricular">Curricular</option>
                      <option value="Co-curricular">Co-curricular</option>
                      <option value="Extracurricular">Extracurricular</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.category && (
                      <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                      Level *
                    </label>
                    <select
                      id="level"
                      {...register('level')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gitam-primary focus:ring-gitam-primary sm:text-sm"
                    >
                      <option value="">Select level</option>
                      <option value="College">College</option>
                      <option value="State">State</option>
                      <option value="National">National</option>
                      <option value="International">International</option>
                    </select>
                    {errors.level && (
                      <p className="mt-1 text-sm text-red-600">{errors.level.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="place" className="block text-sm font-medium text-gray-700">
                      Place *
                    </label>
                    <input
                      type="text"
                      id="place"
                      {...register('place')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gitam-primary focus:ring-gitam-primary sm:text-sm"
                      placeholder="e.g., Mumbai, Hyderabad, New Delhi"
                    />
                    {errors.place && (
                      <p className="mt-1 text-sm text-red-600">{errors.place.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                      Date *
                    </label>
                    <input
                      type="date"
                      id="date"
                      {...register('date')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gitam-primary focus:ring-gitam-primary sm:text-sm"
                    />
                    {errors.date && (
                      <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="position" className="block text-sm font-medium text-gray-700">
                      Position Secured *
                    </label>
                    <select
                      id="position"
                      {...register('position')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gitam-primary focus:ring-gitam-primary sm:text-sm"
                    >
                      <option value="">Select position</option>
                      <option value="1st">1st Place</option>
                      <option value="2nd">2nd Place</option>
                      <option value="3rd">3rd Place</option>
                      <option value="Participation">Participation</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.position && (
                      <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
                    )}
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label htmlFor="remarks" className="block text-sm font-medium text-gray-700">
                    Remarks (Optional)
                  </label>
                  <textarea
                    id="remarks"
                    {...register('remarks')}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-gitam-primary focus:ring-gitam-primary sm:text-sm"
                    placeholder="Any additional details about the achievement..."
                  />
                </div>

                {/* File Uploads */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Proof of Achievement
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gitam-primary transition-colors">
                      <div className="space-y-1 text-center">
                        <FileText className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="proof-file" className="relative cursor-pointer bg-white rounded-md font-medium text-gitam-primary hover:text-gitam-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gitam-primary">
                            <span>Upload a file</span>
                            <input
                              id="proof-file"
                              name="proof-file"
                              type="file"
                              className="sr-only"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={handleProofFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                        {proofFile && (
                          <p className="text-sm text-gitam-primary">{proofFile.name}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Photos (Optional)
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gitam-primary transition-colors">
                      <div className="space-y-1 text-center">
                        <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="event-photos" className="relative cursor-pointer bg-white rounded-md font-medium text-gitam-primary hover:text-gitam-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gitam-primary">
                            <span>Upload photos</span>
                            <input
                              id="event-photos"
                              name="event-photos"
                              type="file"
                              multiple
                              className="sr-only"
                              accept=".jpg,.jpeg,.png"
                              onChange={handleEventPhotosChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">PNG, JPG up to 5 files</p>
                      </div>
                    </div>
                    
                    {eventPhotos.length > 0 && (
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        {eventPhotos.map((photo, index) => (
                          <div key={index} className="relative">
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                              <span className="text-sm text-gray-600 truncate">{photo.name}</span>
                              <button
                                type="button"
                                onClick={() => removeEventPhoto(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gitam-primary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white gitam-btn-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gitam-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Submitting...' : 'Submit Achievement'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
