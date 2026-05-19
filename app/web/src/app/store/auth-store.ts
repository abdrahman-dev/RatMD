import { create } from 'zustand'
import { client, setOnUnauthorized } from '@/lib/api/client'
import { AUTH, PROFILE } from '@/lib/api/endpoints'
import type { AuthUser, ApiResponse } from '@/types'

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  fetchMe: () => Promise<void>
  verifyEmail: (email: string, otp: string) => Promise<void>
  clearSession: () => void
  updateUserData: (data: Partial<AuthUser>) => void
  updateProfile: (data: Partial<AuthUser>) => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => {
  setOnUnauthorized(() => {
    set({ user: null, isAuthenticated: false })
  })

  return {
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true })
    try {
      await client.post<ApiResponse<never>>(AUTH.login, { email, password })
      await useAuthStore.getState().fetchMe()
    } finally {
      set({ isLoading: false })
    }
  },

  register: async (name: string, email: string, password: string) => {
    set({ isLoading: true })
    try {
      await client.post<ApiResponse<never>>(AUTH.register, { name, email, password })
    } finally {
      set({ isLoading: false })
    }
  },

  logout: async () => {
    try {
      await client.post<ApiResponse<never>>(AUTH.logout)
    } finally {
      set({ user: null, isAuthenticated: false })
    }
  },

  fetchMe: async () => {
    try {
      const res = await client.get<ApiResponse<AuthUser>>(AUTH.me)
      if (res.success && res.data) {
        set({ user: res.data, isAuthenticated: true })
      } else {
        set({ user: null, isAuthenticated: false })
      }
    } catch {
      set({ user: null, isAuthenticated: false })
    }
  },

  verifyEmail: async (email: string, otp: string) => {
    await client.post<ApiResponse<never>>(AUTH.verifyEmail, { email, otp })
    await useAuthStore.getState().fetchMe()
  },

  clearSession: () => {
    set({ user: null, isAuthenticated: false })
  },

  updateUserData: (data: Partial<AuthUser>) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    }))
  },

  updateProfile: async (data: Partial<AuthUser>) => {
    const res = await client.put<ApiResponse<AuthUser>>(PROFILE.update, data)
    if (res.success && res.data) {
      set({ user: res.data })
    }
  },
  }
})
