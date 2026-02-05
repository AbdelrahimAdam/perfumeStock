import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  addDoc,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import type { Brand, BrandWithProducts } from '@/types'
import type { Product } from '@/types'
import { useProductsStore } from '@/stores/products'

export const useBrandsStore = defineStore('brands', () => {
  const productsStore = useProductsStore()

  /* =========================
   * STATE (SAFE DEFAULTS)
   * ========================= */
  const brands = ref<Brand[]>([])
  const currentBrand = ref<BrandWithProducts | null>(null)
  const isLoading = ref(false)
  const error = ref<string>('')

  /* =========================
   * GETTERS
   * ========================= */
  const activeBrands = computed(() =>
    brands.value.filter(b => b.isActive === true)
  )

  const brandCount = computed(() => brands.value.length)

  /* =========================
   * HELPERS
   * ========================= */
  const transformBrandData = (docData: any, docId: string): Brand => {
    return {
      id: docId,
      name: docData?.name ?? '',
      slug: docData?.slug ?? '',
      image: docData?.image ?? '',
      signature: docData?.signature ?? '',
      description: docData?.description ?? '',
      category: docData?.category ?? '',
      isActive: docData?.isActive !== false,
      price: Number(docData?.price ?? 0),
      productIds: Array.isArray(docData?.productIds) ? docData.productIds : [],
      createdAt: docData?.createdAt?.toDate?.() ?? new Date(),
      updatedAt: docData?.updatedAt?.toDate?.() ?? new Date()
    }
  }

  /* =========================
   * LOAD ALL BRANDS
   * ========================= */
  const loadBrands = async (): Promise<void> => {
    isLoading.value = true
    error.value = ''

    try {
      const brandsRef = collection(db, 'brands')
      const q = query(brandsRef, orderBy('name'))
      const snapshot = await getDocs(q)

      brands.value = snapshot.docs.map(d =>
        transformBrandData(d.data(), d.id)
      )

      console.log(`✅ Loaded ${brands.value.length} brands`)
    } catch (err: any) {
      brands.value = []
      error.value = err?.message || 'Failed to load brands'
      console.error('❌ loadBrands error:', err)
    } finally {
      isLoading.value = false
    }
  }

  /* =========================
   * GET BRAND BY SLUG
   * ========================= */
  const getBrandBySlug = async (
    slug: string
  ): Promise<BrandWithProducts | null> => {
    isLoading.value = true
    error.value = ''
    currentBrand.value = null

    try {
      const brandsRef = collection(db, 'brands')
      const q = query(brandsRef, where('slug', '==', slug))
      const snapshot = await getDocs(q)

      if (snapshot.empty) return null

      const brandDoc = snapshot.docs[0]
      const brand = transformBrandData(brandDoc.data(), brandDoc.id)

      let products: Product[] = []

      if (brand.productIds.length > 0) {
        const productPromises = brand.productIds.map(async id => {
          try {
            const p = await getDoc(doc(db, 'products', id))
            return p.exists() ? ({ id: p.id, ...p.data() } as Product) : null
          } catch {
            return null
          }
        })

        products = (await Promise.all(productPromises)).filter(
          Boolean
        ) as Product[]
      } else {
        const productsRef = collection(db, 'products')
        const pq = query(productsRef, where('brand', '==', slug))
        const ps = await getDocs(pq)

        products = ps.docs.map(d => ({
          id: d.id,
          ...d.data()
        })) as Product[]
      }

      currentBrand.value = {
        ...brand,
        products
      }

      return currentBrand.value
    } catch (err: any) {
      error.value = err?.message || 'Failed to load brand'
      console.error('❌ getBrandBySlug error:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /* =========================
   * ADD BRAND + PRODUCTS
   * ========================= */
  const addBrandWithProducts = async (
    brandData: Partial<Brand>,
    productsData: Partial<Product>[]
  ): Promise<string | null> => {
    isLoading.value = true
    error.value = ''

    try {
      if (!brandData.name || !brandData.slug) {
        throw new Error('Brand name and slug are required')
      }

      const brandsRef = collection(db, 'brands')

      const slugCheck = await getDocs(
        query(brandsRef, where('slug', '==', brandData.slug))
      )
      if (!slugCheck.empty) {
        throw new Error('Brand slug already exists')
      }

      const brandRef = await addDoc(brandsRef, {
        name: brandData.name,
        slug: brandData.slug,
        image: brandData.image || '',
        signature: brandData.signature || '',
        description: brandData.description || '',
        category: brandData.category || '',
        isActive: brandData.isActive !== false,
        price: brandData.price || 0,
        productIds: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })

      const productIds: string[] = []

      for (const p of productsData) {
        if (!p.name?.en) continue

        const productRef = await addDoc(collection(db, 'products'), {
          ...p,
          slug:
            p.slug ||
            p.name.en.toLowerCase().replace(/\s+/g, '-'),
          brand: brandData.slug,
          brandId: brandRef.id,
          images: Array.isArray(p.images) ? p.images : [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })

        productIds.push(productRef.id)
      }

      await updateDoc(brandRef, {
        productIds,
        updatedAt: serverTimestamp()
      })

      await productsStore.fetchProducts()
      await loadBrands()

      return brandRef.id
    } catch (err: any) {
      error.value = err?.message || 'Failed to add brand'
      console.error('❌ addBrandWithProducts error:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  /* =========================
   * UPDATE / DELETE
   * ========================= */
  const updateBrand = async (
    brandId: string,
    updates: Partial<Brand>
  ): Promise<boolean> => {
    try {
      await updateDoc(doc(db, 'brands', brandId), {
        ...updates,
        updatedAt: serverTimestamp()
      })
      await loadBrands()
      return true
    } catch {
      return false
    }
  }

  const deleteBrand = async (brandId: string): Promise<boolean> => {
    try {
      await deleteDoc(doc(db, 'brands', brandId))
      await loadBrands()
      return true
    } catch {
      return false
    }
  }

  /* =========================
   * INIT
   * ========================= */
  const initialize = async () => {
    if (brands.value.length === 0) {
      await loadBrands()
    }
  }

  return {
    brands,
    currentBrand,
    isLoading,
    error,

    activeBrands,
    brandCount,

    initialize,
    loadBrands,
    getBrandBySlug,
    addBrandWithProducts,
    updateBrand,
    deleteBrand
  }
})
