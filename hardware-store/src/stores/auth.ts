'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { MedusaCustomer, LoginCredentials, RegisterData } from '@/types'
import * as medusa from '@/services/medusa'

interface AuthState {
  customer: MedusaCustomer | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthStore extends AuthState {
  login: (credentials: LoginCredentials) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      customer: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Login
      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null })
        
        try {
          const customer = await medusa.login(credentials)
          set({
            customer,
            isAuthenticated: true,
            isLoading: false,
          })
          return true
        } catch (error) {
          set({
            error: '登录失败，请检查邮箱和密码',
            isLoading: false,
          })
          return false
        }
      },

      // Register
      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null })
        
        try {
          const customer = await medusa.register(data)
          set({
            customer,
            isAuthenticated: true,
            isLoading: false,
          })
          return true
        } catch (error) {
          set({
            error: '注册失败，该邮箱可能已被注册',
            isLoading: false,
          })
          return false
        }
      },

      // Logout
      logout: async () => {
        set({ isLoading: true })
        
        try {
          await medusa.logout()
        } catch {
          // Ignore logout errors
        }
        
        set({
          customer: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        })
      },

      // Check authentication status
      checkAuth: async () => {
        const { isAuthenticated } = get()
        if (!isAuthenticated) return
        
        set({ isLoading: true })
        
        try {
          const customer = await medusa.getCustomer()
          if (customer) {
            set({
              customer,
              isAuthenticated: true,
              isLoading: false,
            })
          } else {
            set({
              customer: null,
              isAuthenticated: false,
              isLoading: false,
            })
          }
        } catch {
          set({
            customer: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      // Clear error
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Selector hooks
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useCustomer = () => useAuthStore((state) => state.customer)
