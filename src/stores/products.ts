// stores/products.ts - UPDATED FOR FIREBASE
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  QueryConstraint
} from 'firebase/firestore'
import { ref as storageRef, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/firebase/config'
import type { Product, ProductFormData, FilterOptions } from '@/types'
import { useLocalStorage } from '@vueuse/core'
import { productNotification } from '@/utils/notifications'
import { LUXURY_CATEGORIES } from '@/utils/luxuryConstants'

export const useProductsStore = defineStore('products', () => {
  // Luxury State
  const products = ref<Product[]>([])
  const featuredProducts = ref<Product[]>([])
  const newArrivals = ref<Product[]>([])
  const luxuryCollections = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const lastUpdated = ref<Date | null>(null)
  const lastVisible = ref<DocumentSnapshot | null>(null)
  const hasMore = ref(true)
  const limitPerPage = 12

  // Filters state
  const filters = useLocalStorage<FilterOptions>('luxury_product_filters', {})

  // Luxury Getters
  const categories = computed(() => LUXURY_CATEGORIES)

  const bestSellers = computed(() => 
    products.value
      .filter(p => p.isBestSeller)
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 10)
  )

  const luxuryBrands = computed(() => {
    const brands = new Set(products.value.map(p => p.brand))
    return Array.from(brands).sort()
  })

  const byCategory = computed(() => 
    (categoryId: string) => products.value
      .filter(p => p.category === categoryId)
      .sort((a, b) => {
        const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(0)
        const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(0)
        return dateB.getTime() - dateA.getTime()
      })
  )

  const getCategoryById = computed(() => 
    (id: string) => LUXURY_CATEGORIES.find(c => c.id === id)
  )

  const totalProducts = computed(() => products.value.length)

  const priceRange = computed(() => {
    if (products.value.length === 0) return { min: 0, max: 0 }
    
    const prices = products.value.map(p => p.price)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }
  })

  // Firebase Collection Reference
  const getProductsCollection = () => collection(db, 'products')

  // Firebase Actions
  const fetchProducts = async (options: FilterOptions = {}, resetPagination: boolean = true) => {
    if (isLoading.value) return

    isLoading.value = true
    error.value = null

    try {
      if (resetPagination) {
        lastVisible.value = null
        hasMore.value = true
        products.value = []
      }

      // Build query constraints
      const constraints: QueryConstraint[] = [
        where('inStock', '==', true),
        orderBy('createdAt', 'desc'),
        limit(limitPerPage)
      ]

      // Add filters to constraints if provided
      if (options.category) {
        constraints.unshift(where('category', '==', options.category))
      }
      
      if (options.brand) {
        constraints.unshift(where('brand', '==', options.brand))
      }
      
      if (options.bestseller !== undefined) {
        constraints.unshift(where('isBestSeller', '==', options.bestseller))
      }

      // Add pagination
      if (lastVisible.value && !resetPagination) {
        constraints.push(startAfter(lastVisible.value))
      }

      // Execute query
      const productsQuery = query(getProductsCollection(), ...constraints)
      const snapshot = await getDocs(productsQuery)
      
      if (snapshot.empty) {
        hasMore.value = false
        if (resetPagination) {
          products.value = []
        }
      } else {
        lastVisible.value = snapshot.docs[snapshot.docs.length - 1]
        
        const fetchedProducts = await Promise.all(
          snapshot.docs.map(async (docSnap) => {
            const data = docSnap.data()
            
            // Handle timestamps
            const createdAt = data.createdAt || { seconds: Date.now() / 1000, nanoseconds: 0 }
            const updatedAt = data.updatedAt || { seconds: Date.now() / 1000, nanoseconds: 0 }
            
            // Fetch main image from storage if path is provided
            let imageUrl = data.imageUrl || ''
            if (data.imagePath) {
              try {
                const imageRef = storageRef(storage, data.imagePath)
                imageUrl = await getDownloadURL(imageRef)
              } catch (error) {
                console.error('Error fetching image:', error)
                // Fallback to imageUrl or default
              }
            }

            // Fetch additional images if available
            let images: string[] = []
            if (data.images && Array.isArray(data.images)) {
              images = await Promise.all(
                data.images.map(async (imagePath: string) => {
                  try {
                    const ref = storageRef(storage, imagePath)
                    return await getDownloadURL(ref)
                  } catch (error) {
                    console.error('Error fetching additional image:', error)
                    return imagePath // Fallback to the path itself
                  }
                })
              )
            }

            return {
              id: docSnap.id,
              slug: data.slug || docSnap.id,
              name: data.name || { en: 'Unnamed Product', ar: 'منتج بدون اسم' },
              description: data.description || { en: '', ar: '' },
              brand: data.brand || '',
              category: data.category || '',
              price: data.price || 0,
              originalPrice: data.originalPrice || data.price,
              size: data.size || '100ml',
              concentration: data.concentration || 'Eau de Parfum',
              imageUrl: imageUrl,
              images: images.length > 0 ? images : [imageUrl],
              isBestSeller: data.isBestSeller || false,
              isFeatured: data.isFeatured || false,
              rating: data.rating || 0,
              reviewCount: data.reviewCount || 0,
              notes: data.notes || { top: [], heart: [], base: [] },
              inStock: data.inStock !== false,
              stockQuantity: data.stockQuantity || 0,
              createdAt: createdAt,
              updatedAt: updatedAt,
              meta: data.meta || {}
            } as Product
          })
        )

        if (resetPagination) {
          products.value = fetchedProducts
        } else {
          products.value = [...products.value, ...fetchedProducts]
        }

        hasMore.value = snapshot.docs.length === limitPerPage
        lastUpdated.value = new Date()
        
        // Cache products locally
        localStorage.setItem('luxury_products_cache', JSON.stringify({
          products: products.value,
          timestamp: lastUpdated.value.getTime()
        }))

        // Also load featured and new arrivals
        await Promise.all([
          fetchFeaturedProducts(),
          fetchNewArrivals(),
          fetchLuxuryCollections()
        ])
        
        console.log(`✅ Loaded ${products.value.length} products from Firebase`)
      }
    } catch (err: any) {
      console.error('Error fetching products:', err)
      error.value = err.message || 'Failed to load products'
      productNotification.error('Failed to load luxury products')
      
      // Fallback to cache
      const cached = localStorage.getItem('luxury_products_cache')
      if (cached) {
        try {
          const { products: cachedProducts } = JSON.parse(cached)
          products.value = cachedProducts
          console.log('📦 Loaded products from cache')
        } catch {
          console.error('❌ Cache is invalid')
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchFeaturedProducts = async () => {
    if (isLoading.value) return
    
    try {
      const featuredQuery = query(
        getProductsCollection(),
        where('isFeatured', '==', true),
        where('inStock', '==', true),
        orderBy('createdAt', 'desc'),
        limit(8)
      )
      
      const snapshot = await getDocs(featuredQuery)
      featuredProducts.value = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data()
          
          // Fetch image from storage if path is provided
          let imageUrl = data.imageUrl || ''
          if (data.imagePath) {
            try {
              const imageRef = storageRef(storage, data.imagePath)
              imageUrl = await getDownloadURL(imageRef)
            } catch (error) {
              console.error('Error fetching featured image:', error)
            }
          }
          
          return {
            id: docSnap.id,
            ...data,
            imageUrl: imageUrl,
            images: data.images || [imageUrl],
            createdAt: data.createdAt || { seconds: Date.now() / 1000, nanoseconds: 0 },
            updatedAt: data.updatedAt || { seconds: Date.now() / 1000, nanoseconds: 0 }
          } as Product
        })
      )
    } catch (err: any) {
      console.error('Error fetching featured products:', err)
      // Use local products as fallback
      featuredProducts.value = products.value
        .filter(p => p.isFeatured)
        .slice(0, 8)
    }
  }

  const fetchNewArrivals = async () => {
    if (isLoading.value) return
    
    try {
      const newArrivalsQuery = query(
        getProductsCollection(),
        where('inStock', '==', true),
        orderBy('createdAt', 'desc'),
        limit(8)
      )
      
      const snapshot = await getDocs(newArrivalsQuery)
      newArrivals.value = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data()
          
          // Fetch image from storage
          let imageUrl = data.imageUrl || ''
          if (data.imagePath) {
            try {
              const imageRef = storageRef(storage, data.imagePath)
              imageUrl = await getDownloadURL(imageRef)
            } catch (error) {
              console.error('Error fetching new arrival image:', error)
            }
          }
          
          return {
            id: docSnap.id,
            ...data,
            imageUrl: imageUrl,
            images: data.images || [imageUrl],
            createdAt: data.createdAt || { seconds: Date.now() / 1000, nanoseconds: 0 },
            updatedAt: data.updatedAt || { seconds: Date.now() / 1000, nanoseconds: 0 }
          } as Product
        })
      )
    } catch (err: any) {
      console.error('Error fetching new arrivals:', err)
      // Use local products as fallback
      newArrivals.value = [...products.value]
        .sort((a, b) => {
          const dateA = a.createdAt?.seconds ? new Date(a.createdAt.seconds * 1000) : new Date(0)
          const dateB = b.createdAt?.seconds ? new Date(b.createdAt.seconds * 1000) : new Date(0)
          return dateB.getTime() - dateA.getTime()
        })
        .slice(0, 8)
    }
  }

  const fetchLuxuryCollections = async () => {
    if (isLoading.value) return
    
    try {
      const luxuryQuery = query(
        getProductsCollection(),
        where('price', '>', 200),
        where('inStock', '==', true),
        orderBy('price', 'desc'),
        limit(10)
      )
      
      const snapshot = await getDocs(luxuryQuery)
      luxuryCollections.value = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data()
          
          // Fetch image from storage
          let imageUrl = data.imageUrl || ''
          if (data.imagePath) {
            try {
              const imageRef = storageRef(storage, data.imagePath)
              imageUrl = await getDownloadURL(imageRef)
            } catch (error) {
              console.error('Error fetching luxury collection image:', error)
            }
          }
          
          return {
            id: docSnap.id,
            ...data,
            imageUrl: imageUrl,
            images: data.images || [imageUrl],
            createdAt: data.createdAt || { seconds: Date.now() / 1000, nanoseconds: 0 },
            updatedAt: data.updatedAt || { seconds: Date.now() / 1000, nanoseconds: 0 }
          } as Product
        })
      )
    } catch (err: any) {
      console.error('Error fetching luxury collections:', err)
      // Use local products as fallback
      luxuryCollections.value = products.value
        .filter(p => p.price > 200)
        .sort((a, b) => b.price - a.price)
        .slice(0, 10)
    }
  }

  const fetchProductBySlug = async (slug: string) => {
    isLoading.value = true
    error.value = null

    try {
      // First try to find in already loaded products
      let product = products.value.find(p => p.slug === slug)
      
      // If not found, fetch from Firebase
      if (!product) {
        const productQuery = query(
          getProductsCollection(),
          where('slug', '==', slug),
          where('inStock', '==', true),
          limit(1)
        )
        
        const snapshot = await getDocs(productQuery)
        
        if (snapshot.empty) {
          throw new Error(`Product with slug "${slug}" not found`)
        }
        
        const docSnap = snapshot.docs[0]
        const data = docSnap.data()
        
        // Fetch main image
        let imageUrl = data.imageUrl || ''
        if (data.imagePath) {
          try {
            const imageRef = storageRef(storage, data.imagePath)
            imageUrl = await getDownloadURL(imageRef)
          } catch (error) {
            console.error('Error fetching product image:', error)
          }
        }
        
        // Fetch additional images
        let images: string[] = []
        if (data.images && Array.isArray(data.images)) {
          images = await Promise.all(
            data.images.map(async (imagePath: string) => {
              try {
                const ref = storageRef(storage, imagePath)
                return await getDownloadURL(ref)
              } catch (error) {
                console.error('Error fetching additional image:', error)
                return imagePath
              }
            })
          )
        }

        product = {
          id: docSnap.id,
          slug: data.slug || docSnap.id,
          name: data.name || { en: 'Unnamed Product', ar: 'منتج بدون اسم' },
          description: data.description || { en: '', ar: '' },
          brand: data.brand || '',
          category: data.category || '',
          price: data.price || 0,
          originalPrice: data.originalPrice || data.price,
          size: data.size || '100ml',
          concentration: data.concentration || 'Eau de Parfum',
          imageUrl: imageUrl,
          images: images.length > 0 ? images : [imageUrl],
          isBestSeller: data.isBestSeller || false,
          isFeatured: data.isFeatured || false,
          rating: data.rating || 0,
          reviewCount: data.reviewCount || 0,
          notes: data.notes || { top: [], heart: [], base: [] },
          inStock: data.inStock !== false,
          stockQuantity: data.stockQuantity || 0,
          createdAt: data.createdAt || { seconds: Date.now() / 1000, nanoseconds: 0 },
          updatedAt: data.updatedAt || { seconds: Date.now() / 1000, nanoseconds: 0 },
          meta: data.meta || {}
        } as Product
      }
      
      currentProduct.value = product
      return product
    } catch (err: any) {
      error.value = err.message
      productNotification.error(`Failed to load product: ${err.message}`)
      return null
    } finally {
      isLoading.value = false
    }
  }

  const addProduct = async (productData: ProductFormData) => {
    isLoading.value = true
    error.value = null

    try {
      // Note: On Spark Plan, we cannot write to Firestore directly
      // This is a simulation for admin panel
      
      console.log('⚠️ Spark Plan: Write operations are not available')
      console.log('Product data would be added:', productData)
      
      // For demo purposes, add to local state only
      const mockProduct: Product = {
        id: `local-${Date.now()}`,
        slug: productData.name.en.toLowerCase().replace(/\s+/g, '-'),
        name: productData.name,
        description: productData.description,
        brand: productData.brand || '',
        category: productData.category || 'luxury',
        price: productData.price || 0,
        originalPrice: productData.originalPrice || productData.price,
        size: productData.size || '100ml',
        concentration: productData.concentration || 'Eau de Parfum',
        imageUrl: productData.imageUrl || '',
        images: productData.images || [],
        isBestSeller: productData.isBestSeller || false,
        isFeatured: productData.isFeatured || false,
        rating: 0,
        reviewCount: 0,
        notes: productData.notes || { top: [], heart: [], base: [] },
        inStock: productData.inStock !== false,
        stockQuantity: productData.stockQuantity || 0,
        createdAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 },
        updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }
      }
      
      // Add to local state
      products.value.unshift(mockProduct)
      
      productNotification.added(productData.name.en)
      
      return mockProduct.id
    } catch (err: any) {
      error.value = err.message
      productNotification.error('Failed to add product')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const editProduct = async (id: string, productData: Partial<ProductFormData>) => {
    isLoading.value = true
    error.value = null

    try {
      // Note: On Spark Plan, we cannot write to Firestore directly
      console.log('⚠️ Spark Plan: Write operations are not available')
      console.log('Product would be updated:', { id, productData })
      
      // For demo purposes, update local state only
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = {
          ...products.value[index],
          ...productData,
          updatedAt: { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 }
        }
      }
      
      productNotification.updated(productData.name?.en || 'Product')
    } catch (err: any) {
      error.value = err.message
      productNotification.error('Failed to update product')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const removeProduct = async (id: string) => {
    const product = products.value.find(p => p.id === id)
    
    // For demo purposes only
    const confirmed = await confirmAction({
      title: 'Delete Product',
      message: `Are you sure you want to delete ${product?.name.en}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'warning'
    })

    if (!confirmed) return

    isLoading.value = true
    error.value = null

    try {
      // Note: On Spark Plan, we cannot delete from Firestore
      console.log('⚠️ Spark Plan: Delete operations are not available')
      console.log('Product would be deleted:', id)
      
      // For demo purposes, remove from local state
      products.value = products.value.filter(p => p.id !== id)
      
      if (product) {
        productNotification.deleted(product.name.en)
      }
    } catch (err: any) {
      error.value = err.message
      productNotification.error('Failed to delete product')
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const searchProducts = (searchTerm: string): Product[] => {
    if (!searchTerm.trim()) return []

    const term = searchTerm.toLowerCase()
    
    return products.value.filter(product => 
      product.name.en.toLowerCase().includes(term) ||
      product.name.ar.toLowerCase().includes(term) ||
      product.description.en.toLowerCase().includes(term) ||
      product.description.ar.toLowerCase().includes(term) ||
      product.brand.toLowerCase().includes(term) ||
      product.notes.top.some(note => note.toLowerCase().includes(term)) ||
      product.notes.heart.some(note => note.toLowerCase().includes(term)) ||
      product.notes.base.some(note => note.toLowerCase().includes(term)) ||
      product.concentration.toLowerCase().includes(term)
    )
  }

  const filterProducts = (options: FilterOptions): Product[] => {
    let filtered = [...products.value]

    // Filter by category
    if (options.category) {
      filtered = filtered.filter(p => p.category === options.category)
    }

    // Filter by brand
    if (options.brand) {
      filtered = filtered.filter(p => p.brand === options.brand)
    }

    // Filter by price range
    if (options.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= options.minPrice!)
    }

    if (options.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= options.maxPrice!)
    }

    // Filter by concentration
    if (options.concentration) {
      filtered = filtered.filter(p => p.concentration === options.concentration)
    }

    // Filter by rating
    if (options.minRating !== undefined) {
      filtered = filtered.filter(p => p.rating >= options.minRating!)
    }

    // Filter by bestseller
    if (options.bestseller !== undefined) {
      filtered = filtered.filter(p => p.isBestSeller === options.bestseller)
    }

    // Filter by new arrival (products from last 30 days)
    if (options.newArrival !== undefined) {
      const oneMonthAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60)
      filtered = filtered.filter(p => 
        (p.createdAt?.seconds || 0) > oneMonthAgo
      )
    }

    // Sort products
    switch (options.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'popular':
        filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0))
        break
      case 'newest':
        filtered.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0
          const dateB = b.createdAt?.seconds || 0
          return dateB - dateA
        })
        break
      case 'name-asc':
        filtered.sort((a, b) => a.name.en.localeCompare(b.name.en))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.name.en.localeCompare(a.name.en))
        break
      default:
        filtered.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0
          const dateB = b.createdAt?.seconds || 0
          return dateB - dateA
        })
    }

    return filtered
  }

  const getProductById = (id: string): Product | undefined => {
    return products.value.find(p => p.id === id)
  }

  const getProductsByBrand = (brandSlug: string): Product[] => {
    return products.value.filter(p => 
      p.brand.toLowerCase() === brandSlug.toLowerCase()
    )
  }

  const getRelatedProducts = (product: Product, limit: number = 4): Product[] => {
    return products.value
      .filter(p => 
        p.id !== product.id && 
        (p.category === product.category || p.brand === product.brand)
      )
      .slice(0, limit)
  }

  const clearError = () => {
    error.value = null
  }

  const refreshProducts = async () => {
    // Clear cache and refresh
    localStorage.removeItem('luxury_products_cache')
    await fetchProducts({}, true)
  }

  const loadMoreProducts = async () => {
    if (!hasMore.value || isLoading.value) return
    await fetchProducts(filters.value, false)
  }

  const setFilters = (newFilters: FilterOptions) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const resetFilters = () => {
    filters.value = {}
  }

  // Helper function for confirmations
  const confirmAction = async (options: {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    type?: string
  }): Promise<boolean> => {
    return new Promise((resolve) => {
      const confirmEvent = new CustomEvent('luxury-confirmation', {
        detail: {
          ...options,
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false)
        }
      })
      window.dispatchEvent(confirmEvent)
    })
  }

  // Initialize products on store creation
  const initialize = async () => {
    if (products.value.length === 0) {
      await fetchProducts({}, true)
    }
  }

  // Auto-initialize
  initialize()

  return {
  // State
  products,
  featuredProducts,
  newArrivals,
  luxuryCollections,
  currentProduct,
  isLoading,
  error,
  lastUpdated,
  hasMore,
  filters,

  // Getters
  categories,
  bestSellers,
  luxuryBrands,
  byCategory,
  getCategoryById,
  totalProducts,
  priceRange,

  // Actions
  fetchProducts,
  fetchFeaturedProducts,
  fetchNewArrivals,
  fetchLuxuryCollections,
  fetchProductBySlug,
  addProduct,
  editProduct,
  removeProduct,
  searchProducts,
  filterProducts,
  getProductById,
  getProductsByBrand,
  getRelatedProducts,
  clearError,
  refreshProducts,
  loadMoreProducts,
  setFilters,
  resetFilters,
  confirmAction,

  // ✅ Add initialize here
  initialize
}
})