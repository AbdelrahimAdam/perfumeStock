import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AdminUser } from '@/types'
import { 
  loginAdmin, 
  logoutAdmin, 
  getCurrentAdmin 
} from '@/firebase/auth'
import { authNotification } from '@/utils/notifications'

export const useAuthStore = defineStore('auth', () => {
  // Admin state
  const user = ref<AdminUser | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastLogin = ref<Date | null>(null)
  const sessionExpiry = ref<Date | null>(null)

  // Only current admin is fetched on Spark plan
  const adminUsers = ref<AdminUser[]>([])
  const adminUsersLoading = ref(false)

  // Getters - UPDATED ROLE CHECKS
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => {
    if (!user.value) return false
    const role = user.value.role?.toLowerCase()
    return role === 'admin' || role === 'super-admin'
  })
  const isSuperAdmin = computed(() => {
    if (!user.value) return false
    const role = user.value.role?.toLowerCase()
    return role === 'super-admin'
  })
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
  const userPermissions = computed(() => {
    if (!user.value) return []
    return user.value.permissions || []
  })
  const hasAllPermissions = computed(() => {
    return userPermissions.value.includes('all')
  })

  // Actions
  const login = async (email: string, password: string) => {
    isLoading.value = true
    error.value = null

    try {
      user.value = await loginAdmin(email, password)
      
      console.log('✅ Login successful:', {
        email: user.value.email,
        role: user.value.role,
        displayName: user.value.displayName,
        isAdmin: isAdmin.value,
        isSuperAdmin: isSuperAdmin.value
      })
      
      lastLogin.value = new Date()
      sessionExpiry.value = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h session

      authNotification.loggedIn(user.value.displayName)

      // Store session locally
      localStorage.setItem(
        'luxury_admin_session',
        JSON.stringify({ 
          user: user.value, 
          expiry: sessionExpiry.value.getTime(),
          timestamp: Date.now()
        })
      )

      // Fetch only current admin
      await fetchAdminUsers()

      return user.value // Return user data for redirection

    } catch (err: any) {
      error.value = err.message || 'Invalid email or password'
      authNotification.error(error.value)
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
      adminUsers.value = []
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
      // Load session from localStorage
      const savedSession = localStorage.getItem('luxury_admin_session')
      if (savedSession) {
        const { user: savedUser, expiry } = JSON.parse(savedSession)
        if (new Date(expiry) > new Date()) {
          user.value = savedUser
          sessionExpiry.value = new Date(expiry)
          await fetchAdminUsers()
          return
        }
      }

      // Fallback: get current admin from Firebase
      user.value = await getCurrentAdmin()
      if (user.value) {
        console.log('✅ Session restored from Firebase:', {
          email: user.value.email,
          role: user.value.role,
          isSuperAdmin: isSuperAdmin.value
        })
        
        sessionExpiry.value = new Date(Date.now() + 24 * 60 * 60 * 1000)
        localStorage.setItem(
          'luxury_admin_session',
          JSON.stringify({ 
            user: user.value, 
            expiry: sessionExpiry.value.getTime(),
            timestamp: Date.now()
          })
        )
        await fetchAdminUsers()
      }

    } catch (error) {
      console.error('❌ Auth check failed:', error)
      localStorage.removeItem('luxury_admin_session')
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  // Fetch only the currently logged-in admin
  const fetchAdminUsers = async () => {
    if (!user.value) return
    adminUsersLoading.value = true
    try {
      const currentAdmin = await getCurrentAdmin()
      if (currentAdmin) {
        adminUsers.value = [currentAdmin]
      } else {
        adminUsers.value = []
      }
    } catch (err: any) {
      console.error('Failed to fetch admin users:', err)
      adminUsers.value = []
    } finally {
      adminUsersLoading.value = false
    }
  }

  const refreshSession = async () => {
    if (!user.value) return
    sessionExpiry.value = new Date(Date.now() + 24 * 60 * 60 * 1000)
    localStorage.setItem(
      'luxury_admin_session',
      JSON.stringify({ 
        user: user.value, 
        expiry: sessionExpiry.value.getTime(),
        timestamp: Date.now()
      })
    )
  }

  const updateProfile = async (updates: Partial<AdminUser>) => {
    if (!user.value) return
    user.value = { ...user.value, ...updates }
    localStorage.setItem(
      'luxury_admin_session',
      JSON.stringify({ 
        user: user.value, 
        expiry: sessionExpiry.value?.getTime(),
        timestamp: Date.now()
      })
    )
  }

  const clearError = () => {
    error.value = null
  }

  // Check permission
  const hasPermission = (permission: string) => {
    if (!user.value) return false
    if (hasAllPermissions.value) return true
    return userPermissions.value.includes(permission)
  }

  return {
    user,
    isLoading,
    error,
    lastLogin,
    sessionExpiry,
    adminUsers,
    adminUsersLoading,
    isAuthenticated,
    isAdmin,
    isSuperAdmin,
    userInitials,
    sessionTimeLeft,
    userPermissions,
    hasAllPermissions,
    login,
    logout,
    checkAuth,
    refreshSession,
    updateProfile,
    fetchAdminUsers,
    clearError,
    hasPermission
  }
})