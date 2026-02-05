// src/stores/homepage.ts - SIMPLIFIED FOR SPARK PLAN
import { defineStore } from 'pinia'
import { ref, reactive, computed, onUnmounted, watch } from 'vue'
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from '@/stores/auth'
import { useBrandsStore } from '@/stores/brands'
import { useProductsStore } from '@/stores/products'

// Type definitions matching your homepage
interface Brand {
  id: string
  name: string
  image: string
  signature: string
  price: number
  slug: string
}

interface Offer {
  id: string
  title: string
  imageUrl: string
  subtitle: string
  oldPrice: number
  newPrice: number
  slug: string
  productId?: string
}

interface MarqueeBrand {
  id: string
  name: string
  logo: string
  slug: string
}

interface HeroBanner {
  imageUrl: string
  title: string
  subtitle: string
}

interface Settings {
  isDarkMode: boolean
  defaultLanguage: string
}

interface HomepageData {
  heroBanner: HeroBanner
  featuredBrands: Brand[]
  activeOffers: Offer[]
  marqueeBrands: MarqueeBrand[]
  settings: Settings
  lastUpdated?: string
  source?: 'firebase' | 'cache' | 'brandstore' | 'default'
}

// Listener callback interface
type ListenerCallback = (data: HomepageData) => void

export const useHomepageStore = defineStore('homepage', () => {
  const authStore = useAuthStore()
  const brandsStore = useBrandsStore()
  const productsStore = useProductsStore()
  
  // Default local data - FALLBACK DATA ONLY
  const defaultLocalData: HomepageData = {
    heroBanner: {
      imageUrl: '/images/banner.jpg',
      title: 'Luxury Perfumes',
      subtitle: 'Premium Collection'
    },
    featuredBrands: [
      {
        id: '1',
        name: 'Tom Ford',
        image: '/images/GURLAND.png',
        signature: 'Noir Extreme',
        price: 450,
        slug: 'tom-ford'
      },
      {
        id: '2',
        name: 'YSL',
        image: '/images/santlaurent.jpg',
        signature: 'Black Opium',
        price: 380,
        slug: 'saint-laurent'
      },
      {
        id: '3',
        name: 'Versace',
        image: '/images/versacee.jpg',
        signature: 'Eros Flame',
        price: 520,
        slug: 'versace'
      },
      {
        id: '4',
        name: 'Chanel',
        image: '/images/chanceshaneal.jpeg',
        signature: 'Coco Mademoiselle',
        price: 600,
        slug: 'chanel'
      },
      {
        id: '5',
        name: 'Dior',
        image: '/images/DIOUR.jpg',
        signature: 'Sauvage Elixir',
        price: 550,
        slug: 'dior'
      },
      {
        id: '6',
        name: 'Gucci',
        image: '/images/GUCCI.jpg',
        signature: 'Bloom',
        price: 480,
        slug: 'gucci'
      }
    ],
    activeOffers: [
      {
        id: '1',
        title: 'Coco Chanel',
        imageUrl: '/images/chanceshaneal.jpeg',
        subtitle: 'Iconic Eau De Parfum',
        oldPrice: 1500,
        newPrice: 150,
        slug: 'coco-chanel-offer'
      }
    ],
    marqueeBrands: [
      {
        id: '1',
        name: 'Tom Ford',
        logo: '/images/tomford.png',
        slug: 'tom-ford'
      },
      {
        id: '2',
        name: 'YSL',
        logo: '/images/saintlaurent.jpg',
        slug: 'saint-laurent'
      },
      {
        id: '3',
        name: 'Versace',
        logo: '/images/versace.jpeg',
        slug: 'versace'
      },
      {
        id: '4',
        name: 'Chanel',
        logo: '/images/shaneal.jpg',
        slug: 'chanel'
      },
      {
        id: '5',
        name: 'Dior',
        logo: '/images/dior.jpg',
        slug: 'dior'
      },
      {
        id: '6',
        name: 'Gucci',
        logo: '/images/goochi.jpg',
        slug: 'gucci'
      }
    ],
    settings: {
      isDarkMode: false,
      defaultLanguage: 'ar'
    },
    lastUpdated: new Date().toISOString(),
    source: 'default'
  }

  // Homepage data structure - REACTIVE
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
  const CACHE_KEY = 'homepage_cache'
  const CACHE_TIMESTAMP_KEY = 'homepage_cache_timestamp'
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

  // =================== FIREBASE INTEGRATION ===================
  
  // Check if user has permission to modify
  const checkPermission = (): boolean => {
    if (authStore.user?.role !== 'super-admin') {
      throw new Error('Permission denied: Only super admin can modify homepage')
    }
    return true
  }

  // Get default data
  const getDefaultData = (): HomepageData => {
    return JSON.parse(JSON.stringify(defaultLocalData))
  }

  // Get cached data from localStorage
  const getCachedData = (): HomepageData | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      const timestamp = localStorage.getItem(CACHE_TIMESTAMP_KEY)
      
      if (cached && timestamp) {
        const cacheAge = Date.now() - parseInt(timestamp)
        if (cacheAge < CACHE_DURATION) {
          console.log('📦 Using cached homepage data (age:', Math.round(cacheAge/1000), 'seconds)')
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
      console.log('💾 Saved homepage data to cache')
    } catch (err) {
      console.warn('⚠️ Error saving to cache:', err)
    }
  }

  // Clear cache
  const clearCache = () => {
    localStorage.removeItem(CACHE_KEY)
    localStorage.removeItem(CACHE_TIMESTAMP_KEY)
    console.log('🧹 Cleared homepage cache')
  }

  // Notify all listeners of data changes
  const notifyListeners = (data: HomepageData) => {
    listeners.forEach(callback => callback(data))
  }

  // Merge Firebase data with current data
  const mergeFirebaseData = (firebaseData: HomepageData): HomepageData => {
    console.log('🔄 Merging Firebase data:', {
      brands: firebaseData.featuredBrands?.length,
      offers: firebaseData.activeOffers?.length,
      marquee: firebaseData.marqueeBrands?.length
    })

    // Always use Firebase data if available
    return {
      ...homepageData,
      heroBanner: firebaseData.heroBanner || homepageData.heroBanner,
      featuredBrands: firebaseData.featuredBrands || homepageData.featuredBrands,
      activeOffers: firebaseData.activeOffers || homepageData.activeOffers,
      marqueeBrands: firebaseData.marqueeBrands || homepageData.marqueeBrands,
      settings: firebaseData.settings || homepageData.settings,
      lastUpdated: firebaseData.lastUpdated || homepageData.lastUpdated,
      source: 'firebase' as const
    }
  }

  // Setup Firebase real-time listener
  const setupFirebaseListener = async (): Promise<void> => {
    if (unsubscribe) {
      console.log('📡 Firebase listener already setup')
      return
    }
    
    try {
      const homepageRef = doc(db, 'homepage', 'content')
      
      unsubscribe = onSnapshot(homepageRef, (docSnap) => {
        console.log('📡 Real-time update received from Firebase')
        
        if (docSnap.exists()) {
          const firebaseData = docSnap.data() as HomepageData
          console.log('✅ Firebase data received:', {
            brands: firebaseData.featuredBrands?.length || 0,
            offers: firebaseData.activeOffers?.length || 0,
            lastUpdated: firebaseData.lastUpdated || 'Never'
          })
          
          // Merge and update data
          const mergedData = mergeFirebaseData(firebaseData)
          Object.assign(homepageData, mergedData)
          
          // Save to cache
          saveToCache(mergedData)
          
          // Notify listeners
          notifyListeners(mergedData)
          
          // Apply dark mode
          if (homepageData.settings?.isDarkMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          
          error.value = ''
          isListening.value = true
          
        } else {
          console.log('📝 No Firebase document found, keeping current data')
          // Document doesn't exist yet, but listener is still connected
          isListening.value = true
        }
        
      }, (err) => {
        console.error('❌ Firebase listener error:', err)
        error.value = `Firebase error: ${err.message}`
        isListening.value = false
      })
      
      console.log('✅ Firebase listener setup complete')
      
    } catch (err: any) {
      console.error('❌ Error setting up Firebase listener:', err)
      error.value = 'Failed to setup Firebase listener'
      isListening.value = false
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
      
      console.log('🔍 Loading homepage data...')
      
      // Clear cache if forcing refresh
      if (forceRefresh) {
        clearCache()
      }
      
      // Try cache first (if not forcing refresh)
      if (!forceRefresh) {
        const cachedData = getCachedData()
        if (cachedData) {
          console.log('📦 Using cached data')
          Object.assign(homepageData, cachedData)
          notifyListeners(cachedData)
        }
      }
      
      // Setup Firebase listener for real-time updates
      await setupFirebaseListener()
      
      // Also fetch initial data directly
      try {
        const homepageRef = doc(db, 'homepage', 'content')
        const docSnap = await getDoc(homepageRef)
        
        if (docSnap.exists()) {
          const firebaseData = docSnap.data() as HomepageData
          console.log('✅ Initial Firebase data loaded')
          
          const mergedData = mergeFirebaseData(firebaseData)
          Object.assign(homepageData, mergedData)
          
          // Save to cache
          saveToCache(mergedData)
          
          // Notify listeners
          notifyListeners(mergedData)
        } else {
          console.log('📝 No Firebase document exists yet')
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
        console.log('✅ Fallback to cached data after error')
      }
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
      console.log('🔇 Stopped Firebase listener')
    }
    
    // Clear component listeners
    listeners.clear()
  }

  // Helper function to ensure complete update
  const updateFirebaseDocument = async (updates: Partial<HomepageData>): Promise<boolean> => {
    try {
      const homepageRef = doc(db, 'homepage', 'content')
      
      // Get current document first to ensure we have all data
      const docSnap = await getDoc(homepageRef)
      let currentData: HomepageData
      
      if (docSnap.exists()) {
        currentData = docSnap.data() as HomepageData
      } else {
        // Use current homepageData as base
        currentData = { ...homepageData }
      }
      
      // Create new data with updates
      const newData: HomepageData = {
        ...currentData,
        ...updates,
        lastUpdated: new Date().toISOString(),
        source: 'firebase' as const
      }
      
      console.log('💾 Saving to Firebase:', {
        updates: Object.keys(updates),
        brands: newData.featuredBrands?.length,
        offers: newData.activeOffers?.length,
        timestamp: newData.lastUpdated
      })
      
      // Save to Firebase - use setDoc with merge: false to overwrite
      await setDoc(homepageRef, newData, { merge: false })
      
      // Update local store immediately (Firebase listener will also update it)
      Object.assign(homepageData, newData)
      
      // Clear cache to force fresh data
      clearCache()
      
      // Save updated data to cache
      saveToCache(newData)
      
      // Notify listeners
      notifyListeners(newData)
      
      console.log('✅ Firebase update successful')
      return true
      
    } catch (err: any) {
      console.error('❌ Error updating Firebase:', err)
      throw new Error(`Failed to update Firebase: ${err.message}`)
    }
  }

  // =================== SIMPLIFIED IMAGE UPLOAD FOR SPARK PLAN ===================
  
  // Helper function to compress Base64 images (optional)
  const compressBase64Image = async (base64String: string, quality: number = 0.7): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas')
          const ctx = canvas.getContext('2d')
          
          if (!ctx) {
            console.warn('⚠️ Canvas context not available, using original image')
            resolve(base64String)
            return
          }
          
          // Calculate new dimensions (max 800px width)
          const maxWidth = 800
          const maxHeight = 600
          let width = img.width
          let height = img.height
          
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width
              width = maxWidth
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height
              height = maxHeight
            }
          }
          
          canvas.width = width
          canvas.height = height
          
          ctx.drawImage(img, 0, 0, width, height)
          
          // Compress to JPEG format for smaller size
          const compressedBase64 = canvas.toDataURL('image/jpeg', quality)
          console.log(`📊 Compression: ${Math.round((compressedBase64.length / base64String.length) * 100)}% of original size`)
          
          resolve(compressedBase64)
        } catch (compressErr) {
          console.warn('⚠️ Image compression failed:', compressErr)
          resolve(base64String) // Return original if compression fails
        }
      }
      
      img.onerror = () => {
        console.warn('⚠️ Failed to load image for compression')
        resolve(base64String) // Return original if image loading fails
      }
      
      img.src = base64String
    })
  }

  // SIMPLIFIED uploadImage function - Just returns Base64 string
  const uploadImage = async (file: File): Promise<string> => {
    console.log('🔄 Uploading image (simple Base64 conversion)')
    console.log('📤 File:', file.name, 'Size:', (file.size / 1024).toFixed(2) + 'KB', 'Type:', file.type)
    
    try {
      // Basic authentication check
      if (!authStore.user) {
        throw new Error('User must be logged in to upload images')
      }
      
      // Validate file size (1MB max for Spark plan)
      const maxSize = 1 * 1024 * 1024 // 1MB
      if (file.size > maxSize) {
        throw new Error(`Image must be less than 1MB (current: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`)
      }
      
      // Convert to Base64 and optionally compress
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        
        reader.onload = async (e) => {
          try {
            const base64String = e.target?.result as string
            console.log('✅ Image converted to Base64, size:', base64String.length)
            
            // Optional: Compress the image for better performance
            try {
              const compressedBase64 = await compressBase64Image(base64String)
              console.log('✅ Image compressed, compressed size:', compressedBase64.length)
              resolve(compressedBase64)
            } catch (compressErr) {
              console.warn('⚠️ Compression failed, using original:', compressErr)
              resolve(base64String)
            }
            
          } catch (err: any) {
            console.error('❌ Error processing image:', err)
            reject(new Error(`Failed to process image: ${err.message}`))
          }
        }
        
        reader.onerror = () => {
          reject(new Error('Failed to read image file'))
        }
        
        reader.readAsDataURL(file)
      })
      
    } catch (err: any) {
      console.error('❌ Error in uploadImage:', err)
      error.value = 'Failed to upload image: ' + err.message
      throw err
    }
  }

  // =================== UPDATE METHODS ===================
  // Update hero banner
  const updateHeroBanner = async (bannerData: HeroBanner): Promise<boolean> => {
    try {
      checkPermission()
      isLoading.value = true
      error.value = ''
      
      await updateFirebaseDocument({
        heroBanner: bannerData
      })
      
      console.log('✅ Hero banner updated')
      return true
    } catch (err: any) {
      console.error('❌ Error updating hero banner:', err)
      error.value = 'Failed to update hero banner: ' + err.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Update featured brands
  const updateFeaturedBrands = async (brands: Brand[]): Promise<boolean> => {
    try {
      checkPermission()
      isLoading.value = true
      error.value = ''
      
      await updateFirebaseDocument({
        featuredBrands: brands
      })
      
      console.log('✅ Featured brands updated:', brands.length, 'brands')
      return true
    } catch (err: any) {
      console.error('❌ Error updating featured brands:', err)
      error.value = 'Failed to update featured brands: ' + err.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Update active offers
  const updateActiveOffers = async (offers: Offer[]): Promise<boolean> => {
    try {
      checkPermission()
      isLoading.value = true
      error.value = ''
      
      await updateFirebaseDocument({
        activeOffers: offers
      })
      
      console.log('✅ Active offers updated')
      return true
    } catch (err: any) {
      console.error('❌ Error updating active offers:', err)
      error.value = 'Failed to update active offers: ' + err.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Update marquee brands
  const updateMarqueeBrands = async (brands: MarqueeBrand[]): Promise<boolean> => {
    try {
      checkPermission()
      isLoading.value = true
      error.value = ''
      
      await updateFirebaseDocument({
        marqueeBrands: brands
      })
      
      console.log('✅ Marquee brands updated')
      return true
    } catch (err: any) {
      console.error('❌ Error updating marquee brands:', err)
      error.value = 'Failed to update marquee brands: ' + err.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Update settings
  const updateSettings = async (settings: Settings): Promise<boolean> => {
    try {
      checkPermission()
      isLoading.value = true
      error.value = ''
      
      await updateFirebaseDocument({
        settings: settings
      })
      
      // Apply dark mode immediately
      if (settings.isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      
      console.log('✅ Settings updated')
      return true
    } catch (err: any) {
      console.error('❌ Error updating settings:', err)
      error.value = 'Failed to update settings: ' + err.message
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Initialize Firebase data
  const initializeFirebaseData = async (): Promise<boolean> => {
    try {
      checkPermission()
      
      const homepageRef = doc(db, 'homepage', 'content')
      
      const dataToSave = {
        ...homepageData,
        lastUpdated: new Date().toISOString(),
        source: 'firebase' as const
      }
      
      await setDoc(homepageRef, dataToSave)
      
      console.log('✅ Homepage data initialized in Firebase')
      return true
    } catch (err: any) {
      console.error('❌ Error initializing Firebase data:', err)
      error.value = 'Failed to initialize Firebase data: ' + err.message
      return false
    }
  }

  // Sync with brand store (manual trigger)
  const syncBrandStoreData = async (): Promise<void> => {
    try {
      console.log('🔄 Manually syncing with brand store...')
      console.log('⚠️ Brand store sync method not implemented in current version')
    } catch (err) {
      console.error('❌ Error in manual sync:', err)
      error.value = 'Failed to sync with brand store'
    }
  }

  // Toggle dark mode
  const toggleDarkMode = async (): Promise<boolean> => {
    try {
      checkPermission()
      const newDarkModeState = !homepageData.settings.isDarkMode
      
      await updateSettings({
        ...homepageData.settings,
        isDarkMode: newDarkModeState
      })
      
      return newDarkModeState
    } catch (err) {
      console.error('Error toggling dark mode:', err)
      return homepageData.settings.isDarkMode
    }
  }

  // Reset to brand store data (clear Firebase customizations)
  const resetToBrandStoreData = async (): Promise<boolean> => {
    try {
      checkPermission()
      isLoading.value = true
      
      // Clear Firebase document to use brand store data
      await initializeFirebaseData()
      
      clearCache()
      
      console.log('✅ Reset to brand store data')
      return true
    } catch (err: any) {
      error.value = 'Failed to reset to brand store data: ' + err.message
      console.error('❌ Error resetting:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Reset to local defaults
  const resetToLocalDefaults = async (): Promise<boolean> => {
    try {
      checkPermission()
      isLoading.value = true
      
      const resetData = {
        ...defaultLocalData,
        lastUpdated: new Date().toISOString(),
        source: 'default' as const
      }
      
      await updateFirebaseDocument(resetData)
      
      console.log('✅ Reset to local defaults')
      return true
    } catch (err: any) {
      error.value = 'Failed to reset to defaults: ' + err.message
      console.error('❌ Error resetting to defaults:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Force refresh data
  const forceRefresh = async (): Promise<void> => {
    console.log('🔄 Force refreshing homepage data...')
    await loadHomepageData(true)
  }

  // Check Firebase connection
  const checkConnection = async (): Promise<{ connected: boolean; lastUpdate?: string }> => {
    try {
      const homepageRef = doc(db, 'homepage', 'content')
      const docSnap = await getDoc(homepageRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data() as HomepageData
        return {
          connected: true,
          lastUpdate: data.lastUpdated
        }
      }
      
      return {
        connected: true, // Connection successful even if doc doesn't exist
        lastUpdate: undefined
      }
    } catch (err) {
      console.error('❌ Connection check failed:', err)
      return {
        connected: false
      }
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
    
    // GETTERS
    getDefaultData,
    
    // ACTIONS
    loadHomepageData,
    stopListening,
    subscribeToUpdates,
    initializeFirebaseData,
    uploadImage, // Simple Base64 upload
    updateHeroBanner,
    updateFeaturedBrands,
    updateActiveOffers,
    updateMarqueeBrands,
    updateSettings,
    toggleDarkMode,
    resetToLocalDefaults,
    resetToBrandStoreData,
    syncBrandStoreData,
    forceRefresh,
    clearCache,
    checkConnection
  }
})