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
  Users, 
  BarChart3, 
  Settings, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  Search,
  User
} from 'lucide-react'

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, userProfile, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Achievements', href: '/achievements', icon: Trophy },
    { name: 'Submit Achievement', href: '/achievements/submit', icon: Plus },
    { name: 'Leaderboard', href: '/leaderboard', icon: BarChart3 },
  ]

  const facultyNavItems = [
    { name: 'Search Students', href: '/students', icon: Search },
    { name: 'All Achievements', href: '/achievements/all', icon: Trophy },
  ]

  const adminNavItems = [
    { name: 'Admin Panel', href: '/admin', icon: Settings },
    { name: 'Pending Approvals', href: '/admin/approvals', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ]

  const getNavItems = () => {
    let items = [...navItems]
    
    if (userProfile?.is_faculty || userProfile?.is_admin) {
      items = [...items, ...facultyNavItems]
    }
    
    if (userProfile?.is_admin) {
      items = [...items, ...adminNavItems]
    }
    
    return items
  }

  const isActive = (href: string) => pathname === href

  return (
    <nav className="gitam-gradient shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link href="/dashboard" className="flex-shrink-0 flex items-center">
              <Image
                src="/gitam.png"
                alt="GITAM Logo"
                width={40}
                height={40}
                className="h-10 w-10"
              />
              <span className="ml-3 text-white text-xl font-bold hidden sm:block">
                GITAM Portal
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              {getNavItems().map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'bg-white bg-opacity-20 text-white'
                        : 'text-white hover:bg-white hover:bg-opacity-10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center">
            {/* Notifications */}
            <Link
              href="/notifications"
              className="p-2 rounded-full text-white hover:bg-white hover:bg-opacity-10 hover:text-white transition-colors"
            >
              <Bell className="h-5 w-5" />
            </Link>

            {/* User Profile */}
            <div className="ml-4 flex items-center text-white">
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium">{userProfile?.name}</p>
                  <p className="text-xs text-white opacity-80">
                    {userProfile?.roll_number_faculty_id}
                  </p>
                </div>
              </div>
              
              <button
                onClick={handleSignOut}
                className="ml-4 p-2 rounded-full text-white hover:bg-white hover:bg-opacity-10 hover:text-white transition-colors"
                title="Sign out"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden ml-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-white hover:text-white hover:bg-white hover:bg-opacity-10"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gitam-dark">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {getNavItems().map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-white bg-opacity-20 text-white'
                      : 'text-white hover:bg-white hover:bg-opacity-10 hover:text-white'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}
