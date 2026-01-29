// src/stores/homepage.ts - UPDATED WITH REAL-TIME FIREBASE FETCHING
import { defineStore } from 'pinia'
import { ref, reactive, onUnmounted } from 'vue'
import { doc, getDoc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from '@/stores/auth'

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
  lastUpdated?: string // Add timestamp for sync checking
}

interface StoredImage {
  id: string
  filename: string
  type: string
  size: number
  data: string // Base64 string
  path: string
  uploadedAt: string
  uploadedBy: string
  isBase64: boolean
}

export const useHomepageStore = defineStore('homepage', () => {
  const authStore = useAuthStore()
  
  // Default local data - EXACTLY MATCHING YOUR HOMEPAGE
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
    lastUpdated: new Date().toISOString()
  }

  // Homepage data structure - MUST BE REACTIVE
  const homepageData = reactive<HomepageData>({
    ...defaultLocalData
  })

  // Loading states
  const isLoading = ref(false)
  const error = ref<string>('')
  
  // Real-time listener reference
  let unsubscribe: (() => void) | null = null
  const isListening = ref(false)

  // Cache key for localStorage
  const CACHE_KEY = 'homepage_cache'
  const CACHE_TIMESTAMP_KEY = 'homepage_cache_timestamp'
  const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes cache

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
      localStorage.setItem(CACHE_KEY, JSON.stringify(data))
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

  // Load homepage data from Firebase with real-time updates
  const loadHomepageData = async (forceRefresh: boolean = false): Promise<void> => {
    try {
      isLoading.value = true
      error.value = ''
      
      console.log('🔍 Loading homepage data from Firebase...')
      const homepageRef = doc(db, 'homepage', 'content')
      
      // If force refresh, clear cache first
      if (forceRefresh) {
        clearCache()
      }
      
      // Try to load from cache first for faster initial render
      if (!forceRefresh) {
        const cachedData = getCachedData()
        if (cachedData) {
          Object.assign(homepageData, cachedData)
          console.log('✅ Loaded from cache')
        }
      }
      
      // Set up real-time listener
      unsubscribe = onSnapshot(homepageRef, (docSnap) => {
        console.log('📡 Real-time update received from Firebase')
        
        if (docSnap.exists()) {
          const data = docSnap.data() as HomepageData
          console.log('✅ New data received:', {
            brands: data.featuredBrands?.length || 0,
            offers: data.activeOffers?.length || 0,
            lastUpdated: data.lastUpdated || 'Never'
          })
          
          // Update reactive data
          Object.assign(homepageData, data)
          
          // Save to cache
          saveToCache(data)
          
          // Apply dark mode if needed
          if (data.settings?.isDarkMode) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
          
          error.value = ''
          isListening.value = true
        } else {
          console.log('📝 No document found, creating default...')
          // Create default document if it doesn't exist
          initializeFirebaseData()
        }
        
      }, (err) => {
        console.error('❌ Firebase listener error:', err.message)
        error.value = 'Firebase connection error. Using cached data.'
        isListening.value = false
        
        // Fallback to cached data
        const cachedData = getCachedData()
        if (cachedData) {
          Object.assign(homepageData, cachedData)
          console.log('✅ Fallback to cached data')
        }
      })
      
    } catch (err: any) {
      console.error('❌ Error setting up Firebase listener:', err)
      error.value = 'Failed to connect to Firebase'
      
      // Fallback to cache
      const cachedData = getCachedData()
      if (cachedData) {
        Object.assign(homepageData, cachedData)
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
  }

  // Initialize Firebase data
  const initializeFirebaseData = async (): Promise<boolean> => {
    try {
      checkPermission()
      
      const homepageRef = doc(db, 'homepage', 'content')
      await setDoc(homepageRef, {
        ...homepageData,
        lastUpdated: new Date().toISOString()
      })
      console.log('✅ Homepage data initialized in Firebase')
      return true
    } catch (err: any) {
      console.error('❌ Error initializing Firebase data:', err)
      error.value = 'Failed to initialize Firebase data: ' + err.message
      return false
    }
  }

  // =================== BASE64 UPLOAD IMAGE METHOD ===================
  const uploadImage = async (file: File, path: string = 'offers'): Promise<string> => {
    console.log('🔄 uploadImage method called')
    console.log('📤 File:', file.name, 'Size:', (file.size / 1024).toFixed(2) + 'KB')
    
    try {
      checkPermission()
      isLoading.value = true
      error.value = ''
      
      // Validate file size
      const maxSize = 2 * 1024 * 1024 // 2MB
      if (file.size > maxSize) {
        throw new Error(`Image must be less than 2MB (current: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`)
      }
      
      // Convert to Base64
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        
        reader.onload = async (e) => {
          try {
            const base64String = e.target?.result as string
            
            // Create unique ID
            const imageId = `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            
            // Store in Firestore
            const imageData: StoredImage = {
              id: imageId,
              filename: file.name,
              type: file.type,
              size: file.size,
              data: base64String,
              path: path,
              uploadedAt: new Date().toISOString(),
              uploadedBy: authStore.user?.email || 'admin',
              isBase64: true
            }
            
            const imageRef = doc(db, 'images', imageId)
            await setDoc(imageRef, imageData)
            
            console.log('✅ Image stored in Firestore:', imageId)
            resolve(base64String)
            
          } catch (err: any) {
            console.error('❌ Error storing image:', err)
            reject(new Error(`Failed to store image: ${err.message}`))
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
    } finally {
      isLoading.value = false
    }
  }

  // Helper function to ensure complete update
  const updateFirebaseDocument = async (updates: Partial<HomepageData>): Promise<boolean> => {
    try {
      const homepageRef = doc(db, 'homepage', 'content')
      
      // Get current document first to ensure we have all data
      const docSnap = await getDoc(homepageRef)
      let currentData = docSnap.exists() ? docSnap.data() as HomepageData : defaultLocalData
      
      // Merge updates with current data
      const newData = {
        ...currentData,
        ...updates,
        lastUpdated: new Date().toISOString() // Always update timestamp
      }
      
      // Use setDoc with merge to ensure complete update
      await setDoc(homepageRef, newData, { merge: false }) // Use merge: false to replace entire document
      
      // Clear cache to force fresh load
      clearCache()
      
      console.log('✅ Firebase document updated:', Object.keys(updates))
      return true
    } catch (err: any) {
      console.error('❌ Error updating Firebase:', err)
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
      
      Object.assign(homepageData.heroBanner, bannerData)
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
      
      homepageData.featuredBrands = brands
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
      
      homepageData.activeOffers = offers
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
      
      homepageData.marqueeBrands = brands
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
      
      Object.assign(homepageData.settings, settings)
      
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

  // Reset to local defaults
  const resetToLocalDefaults = async (): Promise<boolean> => {
    try {
      checkPermission()
      isLoading.value = true
      
      await updateFirebaseDocument(defaultLocalData)
      
      Object.assign(homepageData, defaultLocalData)
      
      // Apply default dark mode
      if (defaultLocalData.settings.isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      
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
    initializeFirebaseData,
    uploadImage,
    updateHeroBanner,
    updateFeaturedBrands,
    updateActiveOffers,
    updateMarqueeBrands,
    updateSettings,
    toggleDarkMode,
    resetToLocalDefaults,
    forceRefresh,
    clearCache
  }
})