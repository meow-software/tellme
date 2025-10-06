'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/stores' 

export const useAuth = () => {
  const {
    user,
    loading,
    error,
    fetchUser,
    login,
    logout,
    refresh,
    clearAuth,
    accessXCsrfToken,
    refreshXCsrfToken,
  } = useAuthStore()

  // Auto load user on mount
  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  return {
    user,
    loading,
    error,
    login,
    logout,
    refresh,
    clearAuth,
    accessXCsrfToken,
    refreshXCsrfToken,
  }
}
