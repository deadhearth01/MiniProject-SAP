'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { 
  Home,
  Trophy,
  Plus,
  Upload,
  Users,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  Menu,
  X,
  CheckCircle,
  FileText,
  Calendar,
  TrendingUp,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: any
  badge?: number
  children?: NavItem[]
}

export default function SidebarNavigation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['achievements'])
  const { userProfile, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev =>
      prev.includes(menuName)
        ? prev.filter(m => m !== menuName)
        : [...prev, menuName]
    )
  }

  const isActive = (href: string) => pathname === href
  const isMenuActive = (children: NavItem[]) => 
    children.some(child => pathname === child.href)

  // Base navigation items for all users
  const studentNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    {
      name: 'Achievements',
      href: '/achievements',
      icon: Trophy,
      children: [
        { name: 'My Achievements', href: '/achievements', icon: Trophy },
        { name: 'Submit New', href: '/achievements/submit', icon: Plus },
        { name: 'Bulk Upload', href: '/achievements/bulk-upload', icon: Upload },
      ]
    },
    { name: 'Leaderboard', href: '/leaderboard', icon: TrendingUp },
    { name: 'Notifications', href: '/notifications', icon: Bell },
  ]

  // Faculty additional items
  const facultyNavItems: NavItem[] = [
    {
      name: 'Faculty Portal',
      href: '/faculty',
      icon: Users,
      children: [
        { name: 'All Achievements', href: '/achievements', icon: Trophy },
        { name: 'Pending Reviews', href: '/admin/approvals', icon: CheckCircle },
        { name: 'Student Search', href: '/students', icon: Users },
        { name: 'Reports', href: '/reports', icon: FileText },
      ]
    },
  ]

  // Admin additional items
  const adminNavItems: NavItem[] = [
    {
      name: 'Admin Panel',
      href: '/admin',
      icon: Settings,
      children: [
        { name: 'Dashboard', href: '/admin', icon: Home },
        { name: 'Pending Approvals', href: '/admin/approvals', icon: CheckCircle },
        { name: 'User Management', href: '/admin/users', icon: Users },
        { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Events', href: '/admin/events', icon: Calendar },
        { name: 'Settings', href: '/admin/settings', icon: Settings },
      ]
    },
  ]

  const getNavItems = (): NavItem[] => {
    let items = [...studentNavItems]
    
    if (userProfile?.is_faculty && !userProfile?.is_admin) {
      items = [...items, ...facultyNavItems]
    }
    
    if (userProfile?.is_admin) {
      items = [...items, ...adminNavItems]
    }
    
    return items
  }

  const renderNavItem = (item: NavItem, depth: number = 0) => {
    const Icon = item.icon
    const hasChildren = item.children && item.children.length > 0
    const isExpanded = expandedMenus.includes(item.name)
    const active = isActive(item.href)
    const childActive = hasChildren && isMenuActive(item.children || [])

    if (hasChildren) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleMenu(item.name)}
            className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
              childActive
                ? 'bg-gitam-primary text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center">
              <Icon className="w-5 h-5 mr-3" />
              <span>{item.name}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1">
              {item.children?.map(child => renderNavItem(child, depth + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
          active
            ? 'bg-gitam-primary text-white'
            : depth > 0
            ? 'text-gray-600 hover:bg-gray-50'
            : 'text-gray-700 hover:bg-gray-100'
        } ${depth > 0 ? 'pl-8' : ''}`}
      >
        <Icon className="w-5 h-5 mr-3" />
        <span>{item.name}</span>
        {item.badge && (
          <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {item.badge}
          </span>
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center">
            <Image src="/gitam.png" alt="GITAM" width={32} height={32} />
            <span className="ml-2 font-bold text-gitam-primary">GITAM Portal</span>
          </div>
          <button
            onClick={handleSignOut}
            className="p-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform bg-white border-r border-gray-200 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-64`}
      >
        <div className="h-full flex flex-col">
          {/* Logo Section */}
          <div className="p-4 border-b border-gray-200">
            <Link href="/dashboard" className="flex items-center">
              <Image
                src="/gitam.png"
                alt="GITAM Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <div className="ml-3">
                <h1 className="text-lg font-bold text-gitam-primary">GITAM Portal</h1>
                <p className="text-xs text-gray-500">Achievement System</p>
              </div>
            </Link>
          </div>

          {/* User Profile Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gitam-primary text-white flex items-center justify-center font-bold">
                {userProfile?.name?.charAt(0) || 'U'}
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {userProfile?.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {userProfile?.roll_number_faculty_id}
                </p>
                {userProfile?.is_admin && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 mt-1">
                    Admin
                  </span>
                )}
                {userProfile?.is_faculty && !userProfile?.is_admin && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                    Faculty
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {getNavItems().map(item => renderNavItem(item))}
            </div>
          </nav>

          {/* Sign Out Button */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content spacer */}
      <div className="md:ml-64 min-h-screen bg-gray-50 pt-16 md:pt-0">
        {/* This div creates space for the sidebar */}
      </div>
    </>
  )
}
