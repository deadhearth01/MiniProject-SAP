'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Award, 
  Star,
  Check,
  Trash2
} from 'lucide-react'

export default function NotificationsPage() {
  const { userProfile } = useAuth()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userProfile) {
      fetchNotifications()
    }
  }, [userProfile])

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userProfile.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_status: true })
        .eq('id', notificationId)

      if (error) throw error

      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read_status: true }
            : notification
        )
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)

      if (error) throw error

      // Update local state
      setNotifications(prev => 
        prev.filter(notification => notification.id !== notificationId)
      )
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read_status: true })
        .eq('user_id', userProfile.id)
        .eq('read_status', false)

      if (error) throw error

      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read_status: true }))
      )
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval': return <CheckCircle className="h-6 w-6 text-green-600" />
      case 'rejection': return <XCircle className="h-6 w-6 text-red-600" />
      case 'badge': return <Award className="h-6 w-6 text-yellow-600" />
      case 'highlight': return <Star className="h-6 w-6 text-blue-600" />
      default: return <Bell className="h-6 w-6 text-gray-600" />
    }
  }

  const getNotificationBg = (type: string, isRead: boolean) => {
    const baseClasses = isRead ? 'bg-gray-50' : 'bg-white border-l-4'
    
    switch (type) {
      case 'approval': return `${baseClasses} ${!isRead ? 'border-green-400' : ''}`
      case 'rejection': return `${baseClasses} ${!isRead ? 'border-red-400' : ''}`
      case 'badge': return `${baseClasses} ${!isRead ? 'border-yellow-400' : ''}`
      case 'highlight': return `${baseClasses} ${!isRead ? 'border-blue-400' : ''}`
      default: return `${baseClasses} ${!isRead ? 'border-gray-400' : ''}`
    }
  }

  const unreadCount = notifications.filter(n => !n.read_status).length

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
        
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                  <Bell className="h-8 w-8 mr-3 text-gitam-primary" />
                  Notifications
                  {unreadCount > 0 && (
                    <span className="ml-3 bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </h1>
                <p className="text-gray-600 mt-2">
                  Stay updated with your achievement approvals and highlights
                </p>
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="gitam-btn-secondary flex items-center space-x-2"
                >
                  <Check className="h-4 w-4" />
                  <span>Mark all as read</span>
                </button>
              )}
            </div>

            {/* Notifications List */}
            {notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-6 rounded-lg transition-all duration-200 ${getNotificationBg(notification.type, notification.read_status)}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${!notification.read_status ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {!notification.read_status && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1 text-gray-400 hover:text-gitam-primary transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Delete notification"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Bell className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications yet</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  You'll receive notifications here when your achievements are reviewed, 
                  when you earn badges, or when there are important updates.
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
