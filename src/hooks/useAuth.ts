'use client'

import { useSession } from 'next-auth/react'
import { useMemo } from 'react'
import {
  extractUserFromSession,
  canAccessPage,
  canPerformAction,
  type AuthUser,
  ACTION_PERMISSIONS,
} from '@/lib/authorization'

/**
 * RBAC-aware auth hook
 * Session'dan kullanıcı rolü, atanmış firmalar ve yetkileri çeker
 */
export function useAuth() {
  const { data: session, status } = useSession()

  const user = useMemo<AuthUser | null>(() => {
    return extractUserFromSession(session)
  }, [session])

  const isAdmin = user?.role === 'ADMIN'
  const isExpert = user?.role === 'EXPERT'
  const isDoctor = user?.role === 'DOCTOR'
  const isDSP = user?.role === 'DSP'
  const isClient = user?.role === 'CLIENT'
  const isOSGBStaff = isAdmin || isExpert || isDoctor || isDSP

  return {
    user,
    status,
    isAdmin,
    isExpert,
    isDoctor,
    isDSP,
    isClient,
    isOSGBStaff,
    
    /** Bu sayfaya erişim var mı? */
    canAccess: (path: string) => user ? canAccessPage(user.role, path) : false,
    
    /** Bu aksiyonu yapabilir mi? */
    can: (action: keyof typeof ACTION_PERMISSIONS) => user ? canPerformAction(user.role, action) : false,
    
    /** Bu firma ID'sine erişim var mı? (ADMIN = tümüne erişim) */
    canAccessFirm: (firmId: string) => {
      if (!user) return false
      if (user.role === 'ADMIN') return true
      return user.assignedFirmIds.includes(firmId)
    },
    
    /** Erişilebilir firma ID'leri */
    assignedFirmIds: user?.assignedFirmIds || [],
    
    /** Listedeki verileri firma bazında filtrele */
    filterByAccess: <T extends Record<string, unknown>>(data: T[], firmIdKey: string = 'firmId'): T[] => {
      if (!user) return []
      if (user.role === 'ADMIN') return data
      const ids = user.assignedFirmIds
      if (ids.length === 0) return []
      return data.filter(item => {
        const fId = String(item[firmIdKey] ?? item.id ?? '')
        return ids.includes(fId)
      })
    },
  }
}
