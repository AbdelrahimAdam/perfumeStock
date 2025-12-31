import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import { collection, doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useHomepageStore = defineStore('homepage', () => {
  // Homepage data structure
  const homepageData = reactive({
    heroBanner: {
      imageUrl: '',
      title: '',
      subtitle: ''
    },
    featuredBrands: [] as any[],
    activeOffers: [] as any[],
    marqueeBrands: [] as any[],
    settings: {
      isDarkMode: false,
      defaultLanguage: 'ar' // RTL by default
    }
  })

  // Loading states
  const isLoading = ref(false)
  const error = ref('')

  // Load homepage data from Firebase
  const loadHomepageData = async () => {
    try {
      isLoading.value = true
      error.value = ''
      
      const homepageRef = doc(db, 'homepage', 'content')
      const docSnap = await getDoc(homepageRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        Object.assign(homepageData, data)
      } else {
        // Initialize with default data if no document exists
        await initializeHomepageData()
      }
    } catch (err) {
      error.value = 'Failed to load homepage data'
      console.error('Error loading homepage data:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Initialize homepage data
  const initializeHomepageData = async () => {
    try {
      const defaultData = {
        heroBanner: {
          imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1600&h=900&fit=crop&crop=center',
          title: 'Luxury Perfumes',
          subtitle: 'Premium Collection'
        },
        featuredBrands: [
          {
            id: '1',
            name: 'Tom Ford',
            image: 'https://images.unsplash.com/photo-1590736966894-cb4c52f4c4a9?w=500&fit=crop',
            signature: 'Noir Extreme',
            price: 450,
            slug: 'tom-ford'
          },
          {
            id: '2',
            name: 'YSL',
            image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&fit=crop',
            signature: 'Black Opium',
            price: 380,
            slug: 'ysl'
          },
          {
            id: '3',
            name: 'Versace',
            image: 'https://images.unsplash.com/photo-1611077640180-0ca237d2553d?w=500&fit=crop',
            signature: 'Eros Flame',
            price: 520,
            slug: 'versace'
          },
          {
            id: '4',
            name: 'Chanel',
            image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500&fit=crop',
            signature: 'Coco Mademoiselle',
            price: 600,
            slug: 'chanel'
          },
          {
            id: '5',
            name: 'Dior',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&fit=crop',
            signature: 'Sauvage Elixir',
            price: 550,
            slug: 'dior'
          },
          {
            id: '6',
            name: 'Gucci',
            image: 'https://images.unsplash.com/photo-1592948046993-4c0a3eb79b4c?w=500&fit=crop',
            signature: 'Bloom',
            price: 480,
            slug: 'gucci'
          }
        ],
        activeOffers: [
          {
            id: '1',
            title: 'Coco Chanel',
            imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500&h=700&fit=crop',
            subtitle: 'Iconic Eau De Parfum',
            oldPrice: 1500,
            newPrice: 150
          }
        ],
        marqueeBrands: [
          {
            id: '1',
            name: 'Tom Ford',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Tom_Ford_logo.svg/800px-Tom_Ford_logo.svg.png'
          },
          {
            id: '2',
            name: 'YSL',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Yves_Saint_Laurent_logo.svg/800px-Yves_Saint_Laurent_logo.svg.png'
          },
          {
            id: '3',
            name: 'Versace',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Versace_logo.svg/800px-Versace_logo.svg.png'
          },
          {
            id: '4',
            name: 'Chanel',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Chanel_logo.svg/800px-Chanel_logo.svg.png'
          },
          {
            id: '5',
            name: 'Dior',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Christian_Dior_logo.svg/800px-Christian_Dior_logo.svg.png'
          },
          {
            id: '6',
            name: 'Gucci',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Gucci_logo.svg/800px-Gucci_logo.svg.png'
          }
        ],
        settings: {
          isDarkMode: false,
          defaultLanguage: 'ar'
        }
      }

      const homepageRef = doc(db, 'homepage', 'content')
      await setDoc(homepageRef, defaultData)
      Object.assign(homepageData, defaultData)
    } catch (err) {
      error.value = 'Failed to initialize homepage data'
      console.error('Error initializing homepage data:', err)
    }
  }

  // Update hero banner
  const updateHeroBanner = async (bannerData: any) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const homepageRef = doc(db, 'homepage', 'content')
      await updateDoc(homepageRef, {
        heroBanner: bannerData
      })
      
      Object.assign(homepageData.heroBanner, bannerData)
      return true
    } catch (err) {
      error.value = 'Failed to update hero banner'
      console.error('Error updating hero banner:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Update featured brands
  const updateFeaturedBrands = async (brands: any[]) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const homepageRef = doc(db, 'homepage', 'content')
      await updateDoc(homepageRef, {
        featuredBrands: brands
      })
      
      homepageData.featuredBrands = brands
      return true
    } catch (err) {
      error.value = 'Failed to update featured brands'
      console.error('Error updating featured brands:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Update active offers
  const updateActiveOffers = async (offers: any[]) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const homepageRef = doc(db, 'homepage', 'content')
      await updateDoc(homepageRef, {
        activeOffers: offers
      })
      
      homepageData.activeOffers = offers
      return true
    } catch (err) {
      error.value = 'Failed to update active offers'
      console.error('Error updating active offers:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Update marquee brands
  const updateMarqueeBrands = async (brands: any[]) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const homepageRef = doc(db, 'homepage', 'content')
      await updateDoc(homepageRef, {
        marqueeBrands: brands
      })
      
      homepageData.marqueeBrands = brands
      return true
    } catch (err) {
      error.value = 'Failed to update marquee brands'
      console.error('Error updating marquee brands:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Update settings
  const updateSettings = async (settings: any) => {
    try {
      isLoading.value = true
      error.value = ''
      
      const homepageRef = doc(db, 'homepage', 'content')
      await updateDoc(homepageRef, {
        settings: settings
      })
      
      Object.assign(homepageData.settings, settings)
      return true
    } catch (err) {
      error.value = 'Failed to update settings'
      console.error('Error updating settings:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Toggle dark mode
  const toggleDarkMode = async () => {
    try {
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

  return {
    homepageData,
    isLoading,
    error,
    loadHomepageData,
    updateHeroBanner,
    updateFeaturedBrands,
    updateActiveOffers,
    updateMarqueeBrands,
    updateSettings,
    toggleDarkMode
  }
})