import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AdminUser } from '@/types'
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser
} from 'firebase/auth'
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore'
import { auth, db } from '@/firebase/config'
import { authNotification } from '@/utils/notifications'

export const useAuthStore = defineStore('auth', () => {
  // Super-admin state
  const user = ref<AdminUser | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastLogin = ref<Date | null>(null)
  const sessionExpiry = ref<Date | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const isSuperAdmin = computed(() => user.value?.role?.toLowerCase() === 'super-admin')
  const userInitials = computed(() => {
    if (!user.value?.displayName) return ''
    return user.value.displayName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
  })
  const sessionTimeLeft = computed(() => {
    if (!sessionExpiry.value) return 0
    return Math.max(0, sessionExpiry.value.getTime() - new Date().getTime())
  })

  // Helper: fetch super-admin from 'admins' collection
  const getSuperAdminFromFirestore = async (firebaseUser: FirebaseUser): Promise<AdminUser | null> => {
    try {
      const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid))
      if (!adminDoc.exists()) return null
      const data = adminDoc.data()
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: data.displayName || firebaseUser.displayName || '',
        role: 'super-admin',
        photoURL: data.photoURL || firebaseUser.photoURL || null,
        isActive: data.isActive !== false,
        permissions: data.permissions || ['all'],
        createdAt: data.createdAt?.toDate?.() || new Date(),
        updatedAt: data.updatedAt?.toDate?.() || new Date(),
        lastLogin: new Date()
      }
    } catch (err) {
      console.error('❌ Error getting super-admin from Firestore:', err)
      return null
    }
  }

  // Login action (only super-admin)
  const login = async (email: string, password: string): Promise<AdminUser> => {
    isLoading.value = true
    error.value = null
    try {
      console.log('🔐 Attempting super-admin login:', email)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      const adminData = await getSuperAdminFromFirestore(firebaseUser)

      if (!adminData) {
        throw new Error('Access denied: not a super-admin')
      }

      // Update lastLogin in Firestore
      await updateDoc(doc(db, 'admins', firebaseUser.uid), { lastLogin: serverTimestamp() })

      user.value = adminData
      lastLogin.value = new Date()
      sessionExpiry.value = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h session

      localStorage.setItem('luxury_admin_session', JSON.stringify({
        user: user.value,
        expiry: sessionExpiry.value.getTime(),
        timestamp: Date.now()
      }))

      authNotification.loggedIn(user.value.displayName)
      console.log('✅ Super-admin authenticated:', user.value.email)
      return user.value
    } catch (err: any) {
      console.error('❌ Super-admin login error:', err)
      error.value = err.message || 'Invalid credentials'
      authNotification.error(error.value)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Logout action
  const logout = async () => {
    isLoading.value = true
    error.value = null
    try {
      await signOut(auth)
      user.value = null
      sessionExpiry.value = null
      localStorage.removeItem('luxury_admin_session')
      authNotification.loggedOut()
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Check session/auth state
  const checkAuth = async () => {
    isLoading.value = true
    try {
      const saved = localStorage.getItem('luxury_admin_session')
      if (saved) {
        const { user: savedUser, expiry } = JSON.parse(saved)
        if (new Date(expiry) > new Date()) {
          user.value = savedUser
          sessionExpiry.value = new Date(expiry)
          return
        } else {
          localStorage.removeItem('luxury_admin_session')
        }
      }

      return new Promise<void>((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            const adminData = await getSuperAdminFromFirestore(firebaseUser)
            if (adminData) {
              user.value = adminData
              sessionExpiry.value = new Date(Date.now() + 24 * 60 * 60 * 1000)
              localStorage.setItem('luxury_admin_session', JSON.stringify({
                user: user.value,
                expiry: sessionExpiry.value.getTime(),
                timestamp: Date.now()
              }))
            } else {
              user.value = null
              localStorage.removeItem('luxury_admin_session')
            }
          } else {
            user.value = null
            localStorage.removeItem('luxury_admin_session')
          }
          unsubscribe()
          resolve()
        })
      })

    } catch (err) {
      console.error('❌ Super-admin auth check failed:', err)
      user.value = null
      localStorage.removeItem('luxury_admin_session')
    } finally {
      isLoading.value = false
    }
  }

  // Create initial super-admin
  const createSuperAdmin = async (email: string, password: string, displayName: string) => {
    isLoading.value = true
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      const adminData: AdminUser = {
        id: firebaseUser.uid,
        email,
        displayName,
        role: 'super-admin',
        photoURL: null,
        isActive: true,
        permissions: ['all'],
        createdAt: new Date(),
        updatedAt: new Date(),
        lastLogin: new Date()
      }
      await setDoc(doc(db, 'admins', firebaseUser.uid), {
        ...adminData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      console.log('✅ Super-admin created:', adminData.email)
      return adminData
    } catch (err: any) {
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // Refresh session
  const refreshSession = () => {
    if (!user.value) return
    sessionExpiry.value = new Date(Date.now() + 24 * 60 * 60 * 1000)
    localStorage.setItem('luxury_admin_session', JSON.stringify({
      user: user.value,
      expiry: sessionExpiry.value.getTime(),
      timestamp: Date.now()
    }))
  }

  // Clear error
  const clearError = () => { error.value = null }

  // Initialize listener
  const init = () => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const adminData = await getSuperAdminFromFirestore(firebaseUser)
        user.value = adminData
      } else {
        user.value = null
      }
    })
  }

  return {
    user,
    isLoading,
    error,
    lastLogin,
    sessionExpiry,
    isAuthenticated,
    isSuperAdmin,
    userInitials,
    sessionTimeLeft,
    login,
    logout,
    checkAuth,
    createSuperAdmin,
    refreshSession,
    clearError,
    init
  }
})
