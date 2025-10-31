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
  User,
  FileText
} from 'lucide-react'

export default function Navigation() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, userProfile, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
    router.push('/login')
  }

  const baseItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Achievements', href: '/achievements', icon: Trophy },
    { name: 'Submit Achievement', href: '/achievements/submit', icon: Plus },
    { name: 'Bulk Upload', href: '/achievements/bulk-upload', icon: FileText },
    { name: 'Leaderboard', href: '/leaderboard', icon: BarChart3 },
    { name: 'Notifications', href: '/notifications', icon: Bell },
  ]

  const facultyItems = [
    { name: 'Search Students', href: '/students', icon: Search },
  ]

  const adminItems = [
    { name: 'Admin Panel', href: '/admin', icon: Settings },
    { name: 'Pending Approvals', href: '/admin/approvals', icon: Users },
  ]

  let items = [...baseItems]
  if (userProfile?.is_faculty || userProfile?.is_admin) items = [...items, ...facultyItems]
  if (userProfile?.is_admin) items = [...items, ...adminItems]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#007367] p-3 flex items-center justify-between text-white">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <Image src="/gitam.png" alt="GITAM" width={28} height={28} />
          <div className="text-sm font-bold">GITAM Portal</div>
        </Link>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-md bg-white/10">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile overlay menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50 p-4">
          <div className="bg-white rounded-lg p-4 text-gray-800">
            <div className="flex justify-between items-center mb-4">
              <div className="font-bold">Menu</div>
              <button onClick={() => setMobileOpen(false)} className="p-2">
                <X />
              </button>
            </div>
            <nav className="space-y-2">
              {items.map(i => (
                <Link key={i.href} href={i.href} className="block px-3 py-2 rounded hover:bg-gray-100" onClick={() => setMobileOpen(false)}>
                  <div className="flex items-center gap-3">
                    {/* @ts-ignore */}
                    <i.icon className="h-4 w-4" />
                    <span>{i.name}</span>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      <aside className="fixed inset-y-0 left-0 w-72 bg-[#007367] text-white shadow-lg hidden md:flex flex-col z-40">
      <div className="flex items-center justify-between px-4 py-4">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <Image src="/gitam.png" alt="GITAM" width={36} height={36} />
          <div>
            <div className="text-lg font-bold">GITAM Portal</div>
            <div className="text-xs opacity-80">Achievement System</div>
          </div>
        </Link>
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-md bg-white/10">
          {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-white/10 ${
                isActive(item.href) ? 'bg-[#ebdfbc] text-[#007367] font-semibold' : ''
              }`}>
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">{userProfile?.name}</div>
            <div className="text-xs opacity-80">{userProfile?.roll_number_faculty_id}</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleSignOut} className="p-2 rounded-md bg-white/10">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

    </aside>
    </>
  )
}
