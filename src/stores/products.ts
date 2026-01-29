// src/stores/products.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  getAllProducts,
  getProductBySlug,
  getFeaturedProducts,
  getNewArrivals,
  getProductsByBrand
} from '@/data/products'
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
      .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
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
      // Load from local data
      products.value = getAllProducts()
      
      // Also load featured and new arrivals
      featuredProducts.value = getFeaturedProducts(8)
      newArrivals.value = getNewArrivals(8)
      
      lastUpdated.value = new Date()
      
      console.log(`✅ Loaded ${products.value.length} products from local data`)
      
      // Cache products
      localStorage.setItem('luxury_products_cache', JSON.stringify({
        products: products.value,
        timestamp: lastUpdated.value.getTime()
      }))
      
    } catch (err: any) {
      error.value = err.message || 'Failed to load products'
      productNotification.error('Failed to load luxury products')
      
      // Try to load from cache
      const cached = localStorage.getItem('luxury_products_cache')
      if (cached) {
        try {
          const { products: cachedProducts } = JSON.parse(cached)
          products.value = cachedProducts
          console.log('📦 Loaded products from cache')
        } catch {
          // Cache is invalid
          console.error('❌ Cache is invalid')
        }
      }
    } finally {
      isLoading.value = false
    }
  }

  const fetchFeaturedProducts = async () => {
    isLoading.value = true
    try {
      featuredProducts.value = getFeaturedProducts(8)
    } catch (err: any) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  const fetchNewArrivals = async () => {
    isLoading.value = true
    try {
      newArrivals.value = getNewArrivals(8)
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
      // First try to find in already loaded products
      let product = products.value.find(p => p.slug === slug)
      
      // If not found, get from data
      if (!product) {
        product = getProductBySlug(slug)
      }
      
      if (!product) {
        throw new Error(`Product with slug "${slug}" not found`)
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
      // In local mode, we can't actually add to Firebase
      // For demo purposes, we'll simulate adding
      const mockProduct: Product = {
        id: `local-${Date.now()}`,
        slug: productData.name.en.toLowerCase().replace(/\s+/g, '-'),
        name: productData.name,
        description: productData.description,
        brand: productData.brand || '',
        category: productData.category || 'luxury',
        price: productData.price || 0,
        size: productData.size || '100ml',
        concentration: productData.concentration || 'Eau de Parfum',
        imageUrl: productData.imageUrl || '',
        isBestSeller: productData.isBestSeller || false,
        isFeatured: productData.isFeatured || false,
        rating: 0,
        reviewCount: 0,
        notes: productData.notes || { top: [], heart: [], base: [] },
        inStock: true,
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
      // Find and update product in local state
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
    
    // For local mode, just remove with confirmation
    const confirmed = window.confirm(
      `Are you sure you want to delete ${product?.name.en}?`
    )

    if (!confirmed) return

    isLoading.value = true
    error.value = null

    try {
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
        (p.createdAt.seconds > oneMonthAgo) === options.newArrival
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
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'popular':
        filtered.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0))
        break
      case 'newest':
        filtered.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
        break
      case 'name-asc':
        filtered.sort((a, b) => a.name.en.localeCompare(b.name.en))
        break
      case 'name-desc':
        filtered.sort((a, b) => b.name.en.localeCompare(a.name.en))
        break
      default:
        filtered.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds)
    }

    return filtered
  }

  const getProductById = (id: string): Product | undefined => {
    return products.value.find(p => p.id === id)
  }

  // Use local data function for brand filtering
  const getProductsByBrand = (brandSlug: string): Product[] => {
    // First check if we have products loaded
    if (products.value.length > 0) {
      return products.value.filter(p => p.brand === brandSlug)
    }
    
    // If not, use the data function
    return getProductsByBrand(brandSlug)
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

  // Initialize products on store creation
  const initialize = () => {
    if (products.value.length === 0) {
      fetchProducts()
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