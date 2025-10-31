'use client'

import { useAuthRefresh } from '@/hooks/useAuthRefresh'

export default function AuthRefreshWrapper({ children }: { children: React.ReactNode }) {
  useAuthRefresh()
  return <>{children}</>
}
