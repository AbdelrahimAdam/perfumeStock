import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useHomepageStore } from './homepage' // Import homepage store
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export interface Offer {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  imageUrl: string
  oldPrice: number
  newPrice: number
  linkUrl?: string
  startDate?: string      // ISO date string (YYYY-MM-DD)
  endDate?: string
  offerType: string        // 'percentage', 'fixed', 'bundle', 'free-shipping', 'buy-one-get-one'
  terms?: string
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export interface OfferInput {
  slug: string
  title: string
  subtitle: string
  description: string
  imageUrl: string
  oldPrice: number
  newPrice: number
  linkUrl?: string
  startDate?: string
  endDate?: string
  offerType?: string
  terms?: string
  active?: boolean
}

export const useOffersStore = defineStore('offers', () => {
  // Get homepage store instance
  const homepageStore = useHomepageStore()
  
  // State
  const offers = ref<Offer[]>([])
  const currentOffer = ref<Offer | null>(null)
  const isLoading = ref(false)
  const error = ref<string>('')
  const dataSource = ref<'homepage' | 'firebase' | 'none'>('none')

  // Getters
  const activeOffers = computed(() =>
    offers.value.filter(o => o.active === true)
  )

  // Helper to transform Firestore document to Offer
  const transformOffer = (doc: any): Offer => {
    const data = doc.data()
    return {
      id: doc.id,
      slug: data.slug || '',
      title: data.title || '',
      subtitle: data.subtitle || '',
      description: data.description || '',
      imageUrl: data.imageUrl || '',
      oldPrice: data.oldPrice || 0,
      newPrice: data.newPrice || 0,
      linkUrl: data.linkUrl,
      startDate: data.startDate,
      endDate: data.endDate,
      offerType: data.offerType || 'percentage',
      terms: data.terms,
      active: data.active !== false,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date()
    }
  }

  // Helper to transform homepage offer to Offer format
  const transformHomepageOffer = (offer: any, index: number): Offer => {
    return {
      id: offer.id || `homepage-offer-${index}`,
      slug: offer.slug || '',
      title: offer.title || '',
      subtitle: offer.subtitle || '',
      description: offer.description || '',
      imageUrl: offer.imageUrl || '',
      oldPrice: offer.oldPrice || 0,
      newPrice: offer.newPrice || 0,
      linkUrl: offer.linkUrl,
      startDate: offer.startDate,
      endDate: offer.endDate,
      offerType: offer.offerType || 'percentage',
      terms: offer.terms,
      active: offer.active !== false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }

  // ========== Actions ==========

  // Load offers from homepage store first, then fallback to Firebase
  const loadOffers = async (onlyActive: boolean = false) => {
    isLoading.value = true
    error.value = ''

    try {
      console.log('📦 Loading offers...')
      
      // First, try to load from homepage store
      if (homepageStore.homepageData?.activeOffers?.length > 0) {
        console.log('📋 Loading offers from homepage store')
        const homepageOffers = homepageStore.homepageData.activeOffers
        offers.value = homepageOffers.map((offer, index) => 
          transformHomepageOffer(offer, index)
        )
        dataSource.value = 'homepage'
        console.log(`✅ Loaded ${offers.value.length} offers from homepage store`)
        return
      }

      // If no offers in homepage, ensure homepage data is loaded
      console.log('🔄 No offers in homepage store, loading homepage data...')
      await homepageStore.loadHomepageData()
      
      if (homepageStore.homepageData?.activeOffers?.length > 0) {
        const homepageOffers = homepageStore.homepageData.activeOffers
        offers.value = homepageOffers.map((offer, index) => 
          transformHomepageOffer(offer, index)
        )
        dataSource.value = 'homepage'
        console.log(`✅ Loaded ${offers.value.length} offers from homepage store after loading`)
        return
      }

      // Finally, fallback to Firebase
      console.log('🔄 No offers in homepage, loading from Firebase...')
      const offersRef = collection(db, 'offers')
      let q
      if (onlyActive) {
        q = query(offersRef, where('active', '==', true), orderBy('createdAt', 'desc'))
      } else {
        q = query(offersRef, orderBy('createdAt', 'desc'))
      }
      const snapshot = await getDocs(q)
      offers.value = snapshot.docs.map(transformOffer)
      dataSource.value = 'firebase'
      console.log(`✅ Loaded ${offers.value.length} offers from Firebase`)
      
    } catch (err: any) {
      error.value = err.message || 'Failed to load offers'
      console.error('loadOffers error:', err)
      
      // If Firebase fails, try to get from homepage as fallback
      if (homepageStore.homepageData?.activeOffers?.length > 0) {
        console.log('⚠️ Firebase failed, using homepage offers as fallback')
        const homepageOffers = homepageStore.homepageData.activeOffers
        offers.value = homepageOffers.map((offer, index) => 
          transformHomepageOffer(offer, index)
        )
        dataSource.value = 'homepage'
      }
    } finally {
      isLoading.value = false
    }
  }

  // Get a single offer by slug
  const getOfferBySlug = async (slug: string): Promise<Offer | null> => {
    isLoading.value = true
    error.value = ''
    currentOffer.value = null

    try {
      console.log('🔍 Looking for offer by slug:', slug)
      
      // First, check in homepage store
      if (homepageStore.homepageData?.activeOffers?.length > 0) {
        const found = homepageStore.homepageData.activeOffers.find(o => o.slug === slug)
        if (found) {
          console.log('✅ Offer found in homepage store by slug')
          currentOffer.value = transformHomepageOffer(found, 0)
          return currentOffer.value
        }
      }

      // If not found, try Firebase
      const offersRef = collection(db, 'offers')
      const q = query(offersRef, where('slug', '==', slug))
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        console.log('❌ No offer found with slug:', slug)
        return null
      }

      const docSnap = snapshot.docs[0]
      currentOffer.value = transformOffer(docSnap)
      console.log('✅ Offer found in Firebase by slug:', currentOffer.value.title)
      return currentOffer.value
    } catch (err: any) {
      error.value = err.message || 'Failed to load offer'
      console.error('getOfferBySlug error:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Get a single offer by ID
  const getOfferById = async (id: string): Promise<Offer | null> => {
    isLoading.value = true
    error.value = ''
    currentOffer.value = null

    try {
      console.log('🔍 Looking for offer by ID:', id)
      
      // First, check in homepage store
      if (homepageStore.homepageData?.activeOffers?.length > 0) {
        const found = homepageStore.homepageData.activeOffers.find(o => o.id === id)
        if (found) {
          console.log('✅ Offer found in homepage store by ID')
          currentOffer.value = transformHomepageOffer(found, 0)
          return currentOffer.value
        }
      }

      // If not found, try Firebase
      const offerRef = doc(db, 'offers', id)
      const docSnap = await getDoc(offerRef)

      if (!docSnap.exists()) {
        console.log('❌ No offer found with ID:', id)
        return null
      }

      currentOffer.value = transformOffer(docSnap)
      console.log('✅ Offer found in Firebase by ID:', currentOffer.value.title)
      return currentOffer.value
    } catch (err: any) {
      error.value = err.message || 'Failed to load offer'
      console.error('getOfferById error:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Get a single offer by either slug or ID (auto-detects)
  const getOffer = async (identifier: string): Promise<Offer | null> => {
    isLoading.value = true
    error.value = ''
    currentOffer.value = null

    try {
      console.log('🔍 Looking for offer with identifier:', identifier)
      
      // First, check in homepage store
      if (homepageStore.homepageData?.activeOffers?.length > 0) {
        const found = homepageStore.homepageData.activeOffers.find(o => 
          o.slug === identifier || o.id === identifier
        )
        if (found) {
          console.log('✅ Offer found in homepage store')
          currentOffer.value = transformHomepageOffer(found, 0)
          return currentOffer.value
        }
      }

      // If not found, try Firebase by slug
      console.log('🔄 Not found in homepage, trying Firebase by slug...')
      const offersRef = collection(db, 'offers')
      const slugQuery = query(offersRef, where('slug', '==', identifier))
      const slugSnapshot = await getDocs(slugQuery)

      if (!slugSnapshot.empty) {
        const docSnap = slugSnapshot.docs[0]
        currentOffer.value = transformOffer(docSnap)
        console.log('✅ Offer found in Firebase by slug:', currentOffer.value.title)
        return currentOffer.value
      }

      // If not found by slug, try as ID
      console.log('🔄 Not found by slug, trying Firebase by ID...')
      const offerRef = doc(db, 'offers', identifier)
      const docSnap = await getDoc(offerRef)

      if (docSnap.exists()) {
        currentOffer.value = transformOffer(docSnap)
        console.log('✅ Offer found in Firebase by ID:', currentOffer.value.title)
        return currentOffer.value
      }

      console.log('❌ No offer found with identifier:', identifier)
      return null
    } catch (err: any) {
      error.value = err.message || 'Failed to load offer'
      console.error('getOffer error:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Refresh offers from homepage store
  const refreshFromHomepage = () => {
    if (homepageStore.homepageData?.activeOffers?.length > 0) {
      console.log('🔄 Refreshing offers from homepage store')
      const homepageOffers = homepageStore.homepageData.activeOffers
      offers.value = homepageOffers.map((offer, index) => 
        transformHomepageOffer(offer, index)
      )
      dataSource.value = 'homepage'
      console.log(`✅ Refreshed ${offers.value.length} offers from homepage store`)
    }
  }

  // Admin: create a new offer
  const createOffer = async (input: OfferInput): Promise<string | null> => {
    isLoading.value = true
    error.value = ''

    try {
      // Check slug uniqueness
      const slugCheck = await getDocs(
        query(collection(db, 'offers'), where('slug', '==', input.slug))
      )
      if (!slugCheck.empty) {
        throw new Error(`Offer slug "${input.slug}" already exists`)
      }

      const offersRef = collection(db, 'offers')
      const docRef = await addDoc(offersRef, {
        ...input,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      await loadOffers()
      return docRef.id
    } catch (err: any) {
      error.value = err.message || 'Failed to create offer'
      console.error('createOffer error:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // Admin: update an existing offer
  const updateOffer = async (id: string, input: Partial<OfferInput>): Promise<boolean> => {
    isLoading.value = true
    error.value = ''

    try {
      const offerRef = doc(db, 'offers', id)
      // If slug is being updated, check uniqueness
      if (input.slug) {
        const slugCheck = await getDocs(
          query(collection(db, 'offers'), where('slug', '==', input.slug))
        )
        const exists = slugCheck.docs.some(d => d.id !== id)
        if (exists) {
          throw new Error(`Offer slug "${input.slug}" already exists`)
        }
      }

      await updateDoc(offerRef, {
        ...input,
        updatedAt: serverTimestamp()
      })

      await loadOffers()
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to update offer'
      console.error('updateOffer error:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Admin: delete an offer
  const deleteOffer = async (id: string): Promise<boolean> => {
    isLoading.value = true
    error.value = ''

    try {
      await deleteDoc(doc(db, 'offers', id))
      await loadOffers()
      return true
    } catch (err: any) {
      error.value = err.message || 'Failed to delete offer'
      console.error('deleteOffer error:', err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Clear current offer
  const clearCurrentOffer = () => {
    currentOffer.value = null
  }

  return {
    offers,
    currentOffer,
    isLoading,
    error,
    dataSource,
    activeOffers,
    loadOffers,
    getOfferBySlug,
    getOfferById,
    getOffer,
    refreshFromHomepage,
    createOffer,
    updateOffer,
    deleteOffer,
    clearCurrentOffer
  }
})