import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AdminUser } from '@/types'
import { loginAdmin, logoutAdmin, getCurrentAdmin } from '@/firebase/auth'
import { authNotification } from '@/utils/notifications'

export const useAuthStore = defineStore('auth', () => {
  // Luxury Auth State
  const user = ref<AdminUser | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastLogin = ref<Date | null>(null)
  const sessionExpiry = ref<Date | null>(null)

  // Luxury Getters
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === 'admin')
  const isSuperAdmin = computed(() => user.value?.role === 'super-admin')
  const userInitials = computed(() => {
    if (!user.value) return ''
    return user.value.displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  })

  const sessionTimeLeft = computed(() => {
    if (!sessionExpiry.value) return 0
    const now = new Date()
    return Math.max(0, sessionExpiry.value.getTime() - now.getTime())
  })

  // Luxury Actions
  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      user.value = await loginAdmin(email, password)
      lastLogin.value = new Date()
      sessionExpiry.value = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      
      authNotification.loggedIn(user.value.displayName)
      
      // Store session
      localStorage.setItem('luxury_admin_session', JSON.stringify({
        user: user.value,
        expiry: sessionExpiry.value.getTime()
      }))
      
    } catch (err: any) {
      error.value = err.message
      authNotification.error(err.message || 'Login failed')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    isLoading.value = true
    error.value = null

    try {
      await logoutAdmin()
      user.value = null
      sessionExpiry.value = null
      
      // Clear session
      localStorage.removeItem('luxury_admin_session')
      
      authNotification.loggedOut()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const checkAuth = async () => {
    isLoading.value = true

    try {
      // Check localStorage first
      const savedSession = localStorage.getItem('luxury_admin_session')
      if (savedSession) {
        const { user: savedUser, expiry } = JSON.parse(savedSession)
        
        // Check if session is still valid
        if (new Date(expiry) > new Date()) {
          user.value = savedUser
          sessionExpiry.value = new Date(expiry)
          return
        }
      }

      // Try to get current admin from Firebase
      user.value = await getCurrentAdmin()
      if (user.value) {
        sessionExpiry.value = new Date(Date.now() + 24 * 60 * 60 * 1000)
        localStorage.setItem('luxury_admin_session', JSON.stringify({
          user: user.value,
          expiry: sessionExpiry.value.getTime()
        }))
      }
    } catch (err: any) {
      // Clear invalid session
      localStorage.removeItem('luxury_admin_session')
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  const refreshSession = async () => {
    if (!user.value) return
    
    try {
      sessionExpiry.value = new Date(Date.now() + 24 * 60 * 60 * 1000)
      localStorage.setItem('luxury_admin_session', JSON.stringify({
        user: user.value,
        expiry: sessionExpiry.value.getTime()
      }))
    } catch (err: any) {
      console.error('Session refresh failed:', err)
    }
  }

  const updateProfile = async (updates: Partial<AdminUser>) => {
    if (!user.value) return
    
    try {
      // Update user profile
      user.value = { ...user.value, ...updates }
      
      // Update stored session
      localStorage.setItem('luxury_admin_session', JSON.stringify({
        user: user.value,
        expiry: sessionExpiry.value?.getTime()
      }))
    } catch (err: any) {
      authNotification.error('Failed to update profile')
      throw err
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user,
    isLoading,
    error,
    lastLogin,
    sessionExpiry,

    // Getters
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    userInitials,
    sessionTimeLeft,

    // Actions
    login,
    logout,
    checkAuth,
    refreshSession,
    updateProfile,
    clearError
  }
})