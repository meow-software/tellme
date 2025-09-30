'use client'

import { create } from 'zustand'
import { authService } from '@/lib'

export interface User {
  id: string
  username: string
  email?: string
}

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null

  fetchUser: () => Promise<void>
  login: (usernameOrEmail: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refresh: () => Promise<void>
  clearAuth: () => void

  accessXCsrfToken: string | null
  refreshXCsrfToken: string | null
  setAccessXCsrfToken: (token: string) => void
  setRefreshXCsrfToken: (token: string) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  accessXCsrfToken: null,
  refreshXCsrfToken: null,

  fetchUser: async () => {
    set({ loading: true, error: null })
    try {
      const user: User = await authService.me()
      set({ user, loading: false })
    } catch (err: any) {
      set({ user: null, loading: false, error: err?.message || null })
    }
  },

  login: async (usernameOrEmail, password) => {
    set({ loading: true, error: null })
    try {
      const { accessToken, refreshToken } = await authService.login({ usernameOrEmail, password })
      set({ accessXCsrfToken: accessToken, refreshXCsrfToken: refreshToken })

      const user: User = await authService.me()
      set({ user, loading: false })
    } catch (err: any) {
      set({ error: err.response?.data?.message || 'Échec de login', loading: false })
    }
  },

  logout: async () => {
    set({ loading: true })
    try {
      await authService.logout()
    } finally {
      set({ user: null, loading: false, accessXCsrfToken: null, refreshXCsrfToken: null })
    }
  },

  refresh: async () => {
    try {

      const { accessXCsrfToken , refreshXCsrfToken } = await authService.refresh()
      set({ accessXCsrfToken: accessXCsrfToken , refreshXCsrfToken: refreshXCsrfToken })

      const user: User = await authService.me()
      set({ user })
    } catch {
      set({ user: null, accessXCsrfToken: null, refreshXCsrfToken: null })
    }
  },

  clearAuth: () => set({ user: null, error: null, accessXCsrfToken: null, refreshXCsrfToken: null }),
  setAccessXCsrfToken: (token) => set({ accessXCsrfToken: token }),
  setRefreshXCsrfToken: (token) => set({ refreshXCsrfToken: token }),
}))
