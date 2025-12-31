import { ref, computed, onMounted, onUnmounted } from 'vue'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  type QuerySnapshot,
  type DocumentData
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import type { Product, FilterOptions } from '@/types'

export const useFirebaseProducts = () => {
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  let unsubscribe: (() => void) | null = null

  // Fetch products with real-time updates
  const fetchProducts = (options: FilterOptions = {}) => {
    loading.value = true
    error.value = null

    try {
      const constraints = []

      // Apply filters
      if (options.category) {
        constraints.push(where('category', '==', options.category))
      }

      if (options.minPrice !== undefined) {
        constraints.push(where('price', '>=', options.minPrice))
      }

      if (options.maxPrice !== undefined) {
        constraints.push(where('price', '<=', options.maxPrice))
      }

      // Apply sorting
      switch (options.sortBy) {
        case 'price-low':
          constraints.push(orderBy('price', 'asc'))
          break
        case 'price-high':
          constraints.push(orderBy('price', 'desc'))
          break
        case 'popular':
          constraints.push(orderBy('isBestSeller', 'desc'))
          break
        default:
          constraints.push(orderBy('createdAt', 'desc'))
      }

      // Create query
      const q = query(collection(db, 'products'), ...constraints)

      // Set up real-time listener
      unsubscribe = onSnapshot(q, 
        (snapshot: QuerySnapshot<DocumentData>) => {
          products.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Product[]
          loading.value = false
        },
        (err) => {
          error.value = err.message
          loading.value = false
        }
      )
    } catch (err: any) {
      error.value = err.message
      loading.value = false
    }
  }

  // Fetch single product
  const fetchProduct = async (id: string): Promise<Product | null> => {
    loading.value = true
    try {
      const { getProductById } = await import('@/firebase/firestore')
      return await getProductById(id)
    } catch (err: any) {
      error.value = err.message
      return null
    } finally {
      loading.value = false
    }
  }

  // Search products
  const searchProducts = async (searchTerm: string): Promise<Product[]> => {
    loading.value = true
    try {
      const { getProducts } = await import('@/firebase/firestore')
      const allProducts = await getProducts()
      
      return allProducts.filter(product => 
        product.name.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.name.ar.includes(searchTerm) ||
        product.description.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.ar.includes(searchTerm)
      )
    } catch (err: any) {
      error.value = err.message
      return []
    } finally {
      loading.value = false
    }
  }

  // Get best sellers
  const bestSellers = computed(() => 
    products.value.filter(p => p.isBestSeller).slice(0, 8)
  )

  // Get new arrivals
  const newArrivals = computed(() => 
    [...products.value]
      .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
      .slice(0, 8)
  )

  // Get by category
  const getProductsByCategory = (categoryId: string) => 
    computed(() => products.value.filter(p => p.category === categoryId))

  // Cleanup on unmount
  onUnmounted(() => {
    if (unsubscribe) {
      unsubscribe()
    }
  })

  return {
    products,
    loading,
    error,
    bestSellers,
    newArrivals,
    fetchProducts,
    fetchProduct,
    searchProducts,
    getProductsByCategory
  }
}

export const useFirebaseAuth = () => {
  const user = ref<any>(null)
  const loading = ref(true)

  onMounted(async () => {
    const { getCurrentAdmin } = await import('@/firebase/auth')
    user.value = await getCurrentAdmin()
    loading.value = false
  })

  return {
    user,
    loading
  }
}