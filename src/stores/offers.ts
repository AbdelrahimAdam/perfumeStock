import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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
  // State
  const offers = ref<Offer[]>([])
  const currentOffer = ref<Offer | null>(null)
  const isLoading = ref(false)
  const error = ref<string>('')

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

  // ========== Actions ==========

  // Load all offers (optionally only active)
  const loadOffers = async (onlyActive: boolean = false) => {
    isLoading.value = true
    error.value = ''

    try {
      const offersRef = collection(db, 'offers')
      let q
      if (onlyActive) {
        q = query(offersRef, where('active', '==', true), orderBy('createdAt', 'desc'))
      } else {
        q = query(offersRef, orderBy('createdAt', 'desc'))
      }
      const snapshot = await getDocs(q)
      offers.value = snapshot.docs.map(transformOffer)
    } catch (err: any) {
      error.value = err.message || 'Failed to load offers'
      console.error('loadOffers error:', err)
    } finally {
      isLoading.value = false
    }
  }

  // Get a single offer by slug (or id)
  const getOfferBySlug = async (slug: string): Promise<Offer | null> => {
    isLoading.value = true
    error.value = ''
    currentOffer.value = null

    try {
      const offersRef = collection(db, 'offers')
      const q = query(offersRef, where('slug', '==', slug))
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        return null
      }

      const docSnap = snapshot.docs[0]
      currentOffer.value = transformOffer(docSnap)
      return currentOffer.value
    } catch (err: any) {
      error.value = err.message || 'Failed to load offer'
      console.error('getOfferBySlug error:', err)
      return null
    } finally {
      isLoading.value = false
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
    activeOffers,
    loadOffers,
    getOfferBySlug,
    createOffer,
    updateOffer,
    deleteOffer,
    clearCurrentOffer
  }
})