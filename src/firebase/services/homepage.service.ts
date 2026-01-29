// src/firebase/services/homepage.service.ts
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteField 
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/firebase/config'

export interface HeroBanner {
  imageUrl: string
  title: string
  subtitle: string
}

export interface FeaturedBrand {
  id: string
  name: string
  image: string
  signature: string
  price: number
  slug: string
}

export interface ActiveOffer {
  id: string
  title: string
  imageUrl: string
  subtitle: string
  oldPrice: number
  newPrice: number
  slug: string
}

export interface MarqueeBrand {
  id: string
  name: string
  logo: string
  slug: string
}

export interface HomepageSettings {
  isDarkMode: boolean
  defaultLanguage: string
}

export interface HomepageData {
  heroBanner: HeroBanner
  featuredBrands: FeaturedBrand[]
  activeOffers: ActiveOffer[]
  marqueeBrands: MarqueeBrand[]
  settings: HomepageSettings
}

export const homepageService = {
  // Get homepage data from Firebase
  async getHomepageData(): Promise<HomepageData> {
    try {
      const homepageRef = doc(db, 'homepage', 'content')
      const docSnap = await getDoc(homepageRef)
      
      if (docSnap.exists()) {
        return docSnap.data() as HomepageData
      } else {
        // Create default homepage data in Firebase
        const defaultData = await this.getDefaultData()
        await setDoc(homepageRef, defaultData)
        return defaultData
      }
    } catch (error) {
      console.error('Error getting homepage data:', error)
      throw error
    }
  },

  // Get default data (matches your local data)
  async getDefaultData(): Promise<HomepageData> {
    return {
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
      }
    }
  },

  // Update hero banner
  async updateHeroBanner(heroData: Partial<HeroBanner>): Promise<void> {
    try {
      const homepageRef = doc(db, 'homepage', 'content')
      await updateDoc(homepageRef, {
        'heroBanner': {
          ...heroData
        }
      })
    } catch (error) {
      console.error('Error updating hero banner:', error)
      throw error
    }
  },

  // Update featured brands
  async updateFeaturedBrands(brands: FeaturedBrand[]): Promise<void> {
    try {
      const homepageRef = doc(db, 'homepage', 'content')
      await updateDoc(homepageRef, {
        'featuredBrands': brands
      })
    } catch (error) {
      console.error('Error updating featured brands:', error)
      throw error
    }
  },

  // Update active offers
  async updateActiveOffers(offers: ActiveOffer[]): Promise<void> {
    try {
      const homepageRef = doc(db, 'homepage', 'content')
      await updateDoc(homepageRef, {
        'activeOffers': offers
      })
    } catch (error) {
      console.error('Error updating active offers:', error)
      throw error
    }
  },

  // Update marquee brands
  async updateMarqueeBrands(brands: MarqueeBrand[]): Promise<void> {
    try {
      const homepageRef = doc(db, 'homepage', 'content')
      await updateDoc(homepageRef, {
        'marqueeBrands': brands
      })
    } catch (error) {
      console.error('Error updating marquee brands:', error)
      throw error
    }
  },

  // Update homepage settings
  async updateSettings(settings: Partial<HomepageSettings>): Promise<void> {
    try {
      const homepageRef = doc(db, 'homepage', 'content')
      await updateDoc(homepageRef, {
        'settings': {
          ...settings
        }
      })
    } catch (error) {
      console.error('Error updating settings:', error)
      throw error
    }
  },

  // Upload image to Firebase Storage
  async uploadImage(file: File, folder: string = 'homepage'): Promise<string> {
    try {
      const timestamp = Date.now()
      const fileName = `${folder}/${timestamp}_${file.name}`
      const storageRef = ref(storage, fileName)
      
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)
      
      return downloadURL
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error
    }
  },

  // Reset to default data
  async resetToDefaults(): Promise<void> {
    try {
      const homepageRef = doc(db, 'homepage', 'content')
      const defaultData = await this.getDefaultData()
      await setDoc(homepageRef, defaultData)
    } catch (error) {
      console.error('Error resetting to defaults:', error)
      throw error
    }
  }
}