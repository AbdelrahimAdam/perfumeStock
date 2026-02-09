// src/stores/homepage.ts - SIMPLIFIED TO MATCH CLIENT REQUIREMENTS
import { defineStore } from 'pinia'
import { ref, reactive, computed, onUnmounted } from 'vue'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from '@/stores/auth'

// Type definitions matching client requirements
interface Settings {
  isDarkMode: boolean
  defaultLanguage: string
}

interface HomepageData {
  heroTitle: string
  heroSubtitle: string
  aboutWork: {
    title: string
    description: string
  }
  settings: Settings
  lastUpdated?: string
  source?: 'firebase' | 'cache' | 'default'
}

// Listener callback interface
type ListenerCallback = (data: HomepageData) => void

export const useHomepageStore = defineStore('homepage', () => {
  const authStore = useAuthStore()
  
  // Default local data - SIMPLE STRUCTURE PER CLIENT REQUIREMENTS
  const defaultLocalData: HomepageData = {
    heroTitle: 'P. Notes',
    heroSubtitle: 'PERFUME STORE',
    aboutWork: {
      title: 'what about our work',
      description: 'Premium perfume collections curated with expertise and passion for luxury scents.'
    },
    settings: {
      isDarkMode: false,
      defaultLanguage: 'ar'
    },
    lastUpdated: new Date().toISOString(),
    source: 'default'
  }

  // Homepage data structure - SIMPLE REACTIVE OBJECT
  const homepageData = reactive<HomepageData>({
    ...defaultLocalData
  })

  // Loading states
  const isLoading = ref(false)
  const error = ref<string>('')
  
  // Real-time listener reference
  let unsubscribe: (() => void) | null = null
  const isListening = ref(false)
  
  // Component listeners
  const listeners = new Set<ListenerCallback>()

  // Cache key for localStorage
  const CACHE_KEY = 'homepage_cache_v2'
  const CACHE_TIMESTAMP_KEY = 'homepage_cache_timestamp_v2'
  const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes cache

  // =================== HELPER FUNCTIONS ===================
  
  // Check if user has permission to modify
  const checkPermission = (): boolean => {
    if (authStore.user?.role !== 'super-admin') {
      throw new Error('Permission denied: Only super admin can modify homepage')
    }
    return true
  }

  // Get cached data from localStorage
  const getCachedData = (): HomepageData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)
      
      if (cached && timestamp) {
        const cacheAge = Date.now() - parseInt(timestamp)
        if (cacheAge < CACHE_DURATION) {
          console.log('📦 Using cached homepage data')
          return JSON.parse(cached) as HomepageData
        } else {
          console.log('🕒 Cache expired, removing old cache')
          localStorage.removeItem(CACHE_KEY)
          localStorage.removeItem(CACHE_TIMESTAMP_KEY)
        }
      }
    } catch (err) {
      console.warn('⚠️ Error reading cache:', err)
    }
    return null
  }

  // Save data to cache
  const saveToCache = (data: HomepageData) => {
    try {
      const dataToCache = {
        ...data,
        source: 'cache' as const
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(dataToCache))
      localStorage.setItem(CACHE_TIMESTAMP_KEY, Date.now().toString())
    } catch (err) {
      console.warn('⚠️ Error saving to cache:', err)
    }
  }

  // Clear cache
  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY)
    localStorage.removeItem(CACHE_TIMESTAMP_KEY)
  }

  // Notify all listeners of data changes
  const notifyListeners = (data: HomepageData) => {
    listeners.forEach(callback => callback(data))
  }

  // Setup Firebase real-time listener
  const setupFirebaseListener = async (): Promise<void> => {
    if (unsubscribe) {
      return
    }
    
    try {
      const homepageRef = doc(db, 'homepage', 'content_v2') // New collection for v2 structure
      
      unsubscribe = onSnapshot(homepageRef, (docSnap) => {
        if (docSnap.exists()) {
          const firebaseData = docSnap.data() as HomepageData
          
          // Update local data
          Object.assign(homepageData, {
            ...firebaseData,
            source: 'firebase' as const
          })
          
          // Save to cache
          saveToCache(homepageData)
          
          // Notify listeners
          notifyListeners(homepageData)
          
          // Apply dark mode
          if (homepageData.settings?.isDarkMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          
          error.value = ''
          isListening.value = true
          
        } else {
          // Document doesn't exist yet, create it
          initializeFirebaseData()
          isListening.value = true
        }
        
      }, (err) => {
        console.error('❌ Firebase listener error:', err)
        error.value = `Firebase error: ${err.message}`
        isListening.value = false
      })
      
    } catch (err: any) {
      console.error('❌ Error setting up Firebase listener:', err)
      error.value = 'Failed to setup Firebase listener'
      isListening.value = false
    }
  }

  // Initialize Firebase data
  const initializeFirebaseData = async (): Promise<boolean> => {
    try {
      checkPermission()
      
      const homepageRef = doc(db, 'homepage', 'content_v2')
      
      const dataToSave = {
        ...homepageData,
        lastUpdated: new Date().toISOString(),
        source: 'firebase' as const
      }
      
      await setDoc(homepageRef, dataToSave)
      
      return true
    } catch (err: any) {
      console.error('❌ Error initializing Firebase data:', err)
      error.value = 'Failed to initialize Firebase data: ' + err.message
      return false
    }
  }

  // Subscribe to updates from components
  const subscribeToUpdates = (callback: ListenerCallback): (() => void) => {
    listeners.add(callback)
    
    // Return unsubscribe function
    return () => {
      listeners.delete(callback)
    }
  }

  // Load homepage data from Firebase with real-time updates
  const loadHomepageData = async (forceRefresh: boolean = false): Promise<void> => {
    try {
      isLoading.value = true
      error.value = ''
      
      // Clear cache if forcing refresh
      if (forceRefresh) {
        clearCache()
      }
      
      // Try cache first (if not forcing refresh)
      if (!forceRefresh) {
        const cachedData = getCachedData()
        if (cachedData) {
          Object.assign(homepageData, cachedData)
          notifyListeners(cachedData)
        }
      }
      
      // Setup Firebase listener for real-time updates
      await setupFirebaseListener()
      
      // Also fetch initial data directly
      try {
        const homepageRef = doc(db, 'homepage', 'content_v2')
        const docSnap = await getDoc(homepageRef)
        
        if (docSnap.exists()) {
          const firebaseData = docSnap.data() as HomepageData
          
          Object.assign(homepageData, {
            ...firebaseData,
            source: 'firebase' as const
          })
          
          // Save to cache
          saveToCache(homepageData)
          
          // Notify listeners
          notifyListeners(homepageData)
        } else {
          // Save current data to cache
          saveToCache(homepageData)
        }
        
      } catch (fetchErr) {
        console.warn('⚠️ Could not fetch initial Firebase data:', fetchErr)
      }
      
    } catch (err: any) {
      console.error('❌ Error loading homepage data:', err)
      error.value = 'Failed to load homepage data'
      
      // Fallback to cache
      const cachedData = getCachedData()
      if (cachedData) {
        Object.assign(homepageData, cachedData)
        notifyListeners(cachedData)
      }
    } finally {
      isLoading.value = false
    }
  }

  // Update homepage data
  const updateHomepageData = async (updates: Partial<HomepageData>): Promise<boolean> => {
    try {
      checkPermission()
      isLoading.value = true
      
      const homepageRef = doc(db, 'homepage', 'content_v2')
      
      // Get current document first
      const docSnap = await getDoc(homepageRef)
      let currentData: HomepageData
      
      if (docSnap.exists()) {
        currentData = docSnap.data() as HomepageData
      } else {
        currentData = { ...homepageData }
      }
      
      // Create new data with updates
      const newData: HomepageData = {
        ...currentData,
        ...updates,
        lastUpdated: new Date().toISOString(),
        source: 'firebase' as const
      }
      
      // Save to Firebase
      await setDoc(homepageRef, newData, { merge: false })
      
      // Update local store
      Object.assign(homepageData, newData)
      
      // Clear cache
      clearCache()
      
      // Save updated data to cache
      saveToCache(newData)
      
      // Notify listeners
      notifyListeners(newData)
      
      return true
      
    } catch (err: any) {
      console.error('❌ Error updating Firebase:', err)
      throw new Error(`Failed to update homepage: ${err.message}`)
    } finally {
      isLoading.value = false
    }
  }

  // Stop listening to Firebase
  const stopListening = () => {
    if (unsubscribe) {
      unsubscribe()
      unsubscribe = null
      isListening.value = false
    }
    
    // Clear component listeners
    listeners.clear()
  }

  // Force refresh data
  const forceRefresh = async (): Promise<void> => {
    await loadHomepageData(true)
  }

  // Check Firebase connection
  const checkConnection = async (): Promise<{ connected: boolean; lastUpdate?: string }> => {
    try {
      const homepageRef = doc(db, 'homepage', 'content_v2')
      const docSnap = await getDoc(homepageRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data() as HomepageData
        return {
          connected: true,
          lastUpdate: data.lastUpdated
        }
      }
      
      return {
        connected: true,
        lastUpdate: undefined
      }
    } catch (err) {
      return {
        connected: false
      }
    }
  }

  // Toggle dark mode
  const toggleDarkMode = async (): Promise<boolean> => {
    try {
      checkPermission()
      const newDarkModeState = !homepageData.settings.isDarkMode
      
      await updateHomepageData({
        settings: {
          ...homepageData.settings,
          isDarkMode: newDarkModeState
        }
      })
      
      return newDarkModeState
    } catch (err) {
      console.error('Error toggling dark mode:', err)
      return homepageData.settings.isDarkMode
    }
  }

  // Reset to defaults
  const resetToDefaults = async (): Promise<boolean> => {
    try {
      checkPermission()
      isLoading.value = true
      
      const resetData = {
        ...defaultLocalData,
        lastUpdated: new Date().toISOString(),
        source: 'default' as const
      }
      
      await updateHomepageData(resetData)
      
      return true
    } catch (err: any) {
      error.value = 'Failed to reset to defaults: ' + err.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Cleanup on store destruction
  onUnmounted(() => {
    stopListening()
  })

  // =================== EXPORT EVERYTHING ===================
  return {
    // STATE
    homepageData,
    isLoading,
    error,
    isListening,
    
    // ACTIONS
    loadHomepageData,
    stopListening,
    subscribeToUpdates,
    updateHomepageData,
    toggleDarkMode,
    resetToDefaults,
    forceRefresh,
    clearCache,
    checkConnection,
    initializeFirebaseData
  }
})