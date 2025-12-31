import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  getProducts,
  getProductBySlug,
  getFeaturedProducts,
  getNewArrivals,
  createProduct,
  updateProduct,
  deleteProduct
} from '@/firebase/firestore'
import type { Product, ProductFormData, Category, FilterOptions } from '@/types'
import { LUXURY_CATEGORIES } from '@/utils/luxuryConstants'
import { productNotification } from '@/utils/notifications'

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
      .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
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

  // Luxury Actions
  const fetchProducts = async (options: FilterOptions = {}) => {
    isLoading.value = true
    error.value = null

    try {
      products.value = await getProducts()
      lastUpdated.value = new Date()
      
      // Cache products
      localStorage.setItem('luxury_products_cache', JSON.stringify({
        products: products.value,
        timestamp: lastUpdated.value.getTime()
      }))
      
    } catch (err: any) {
      error.value = err.message
      productNotification.error('Failed to load luxury products')
      
      // Try to load from cache
      const cached = localStorage.getItem('luxury_products_cache')
      if (cached) {
        try {
          const { products: cachedProducts } = JSON.parse(cached)
          products.value = cachedProducts
        } catch {
          // Cache is invalid
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchFeaturedProducts = async () => {
    isLoading.value = true
    try {
      featuredProducts.value = await getFeaturedProducts()
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const fetchNewArrivals = async () => {
    isLoading.value = true
    try {
      newArrivals.value = await getNewArrivals()
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const fetchLuxuryCollections = async () => {
    isLoading.value = true
    try {
      // Filter for luxury collections (price > $200)
      luxuryCollections.value = products.value
        .filter(p => p.price > 200)
        .sort((a, b) => b.price - a.price)
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const fetchProductBySlug = async (slug: string) => {
    isLoading.value = true
    error.value = null

    try {
      const product = await getProductBySlug(slug)
      currentProduct.value = product
      return product
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  const addProduct = async (productData: ProductFormData) => {
    isLoading.value = true
    error.value = null

    try {
      const productId = await createProduct(productData)
      
      // Refresh products
      await fetchProducts()
      
      productNotification.added(productData.name.en)
      
      return productId
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
      await updateProduct(id, productData)
      
      // Refresh products
      await fetchProducts()
      
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
    
    const confirmed = await confirmAction({
      title: 'Delete Product',
      message: `Are you sure you want to delete ${product?.name.en}?`,
      confirmText: 'Delete',
      cancelText: 'Cancel'
    })

    if (!confirmed) return

    isLoading.value = true
    error.value = null

    try {
      await deleteProduct(id)
      
      // Remove from local state
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
      product.name.ar.includes(searchTerm) ||
      product.description.en.toLowerCase().includes(term) ||
      product.description.ar.includes(searchTerm) ||
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
      filtered = filtered.filter(p => (p.rating || 0) >= options.minRating!)
    }

    // Filter by bestseller
    if (options.bestseller !== undefined) {
      filtered = filtered.filter(p => p.isBestSeller === options.bestseller)
    }

    // Filter by new arrival
    if (options.newArrival !== undefined) {
      const oneMonthAgo = new Date()
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
      filtered = filtered.filter(p => 
        p.createdAt?.toDate() > oneMonthAgo === options.newArrival
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
        filtered.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
        break
      case 'name-asc':
        filtered.sort((a, b) => a.name.en.localeCompare(b.name.en))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.name.en.localeCompare(a.name.en))
        break
      default:
        filtered.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
    }

    return filtered
  }

  const getProductById = (id: string): Product | undefined => {
    return products.value.find(p => p.id === id)
  }

  const getProductsByBrand = (brand: string): Product[] => {
    return products.value.filter(p => p.brand === brand)
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
    await fetchProducts()
  }

  // Helper function for confirmations
  const confirmAction = async (options: {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
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
    confirmAction
  }
})