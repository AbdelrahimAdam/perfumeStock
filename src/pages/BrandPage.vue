<template>
  <div class="min-h-screen bg-white">
    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <router-link to="/" class="text-primary-600 hover:underline">
          {{ t('Back to Home') }}
        </router-link>
      </div>
    </div>

    <!-- Brand Content -->
    <div v-else-if="currentBrand" class="container mx-auto px-4 py-8">
      <!-- SEO Head -->
      <SEOHead 
        :title="brandTitle"
        :description="brandDescription"
        :image="brandImage"
        type="website"
      />

      <!-- Breadcrumb -->
      <nav class="flex items-center text-sm text-gray-600 mb-8" 
           :class="{ 'flex-row-reverse': isRTL }">
        <router-link to="/" class="hover:text-primary-600 transition-colors">
          {{ t('Home') }}
        </router-link>
        <span class="mx-3">/</span>
        <router-link to="/brands" class="hover:text-primary-600 transition-colors">
          {{ t('Brands') }}
        </router-link>
        <span class="mx-3">/</span>
        <span class="text-gray-900 font-medium">{{ brandName }}</span>
      </nav>

      <!-- Brand Header with Admin Actions -->
      <div class="mb-12">
        <div class="flex items-start justify-between gap-6 mb-6" :class="{ 'flex-row-reverse': isRTL }">
          <div class="flex items-center gap-6">
            <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img 
                :src="brandLogo" 
                :alt="brandName"
                class="w-full h-full object-cover"
                @error="handleBrandImageError"
              />
            </div>
            <div :class="{ 'text-right': isRTL }">
              <h1 class="text-4xl lg:text-5xl font-display-en font-bold text-gray-900 mb-2">
                {{ brandName }}
              </h1>
              <p class="text-lg text-gray-600">{{ brandSignature }}</p>
              
              <!-- Admin Actions (Only visible for authenticated admins) -->
              <div v-if="authStore.isAuthenticated && authStore.isAdmin" 
                   class="mt-4 flex items-center gap-3" :class="{ 'justify-end': isRTL }">
                <router-link
                  :to="`/admin/brands/edit/${currentBrand.id}`"
                  class="px-4 py-2 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                  {{ t('Edit Brand in Admin') }}
                </router-link>
                <router-link
                  :to="`/admin/products/new?brand=${currentBrand.slug}`"
                  class="px-4 py-2 text-sm bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  {{ t('Add Product to Brand') }}
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- Brand Stats -->
          <div class="hidden lg:block">
            <div class="bg-gray-50 rounded-xl p-4 min-w-48">
              <div class="space-y-3">
                <div class="text-center">
                  <div class="text-2xl font-bold text-gray-900">{{ brandProducts.length }}</div>
                  <div class="text-sm text-gray-600">{{ t('Products') }}</div>
                </div>
                <div v-if="brandProducts.length > 0" class="text-center">
                  <div class="text-xl font-bold text-primary-600">
                    ${{ brandPriceRange.min }} - ${{ brandPriceRange.max }}
                  </div>
                  <div class="text-sm text-gray-600">{{ t('Price Range') }}</div>
                </div>
                <div v-if="authStore.isAuthenticated && authStore.isAdmin" class="pt-3 border-t border-gray-200">
                  <div class="text-xs text-gray-500">{{ t('Brand ID') }}:</div>
                  <div class="text-xs font-mono text-gray-700 truncate">{{ currentBrand.id }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Brand Description -->
        <div class="mt-6">
          <div class="prose max-w-none" :class="{ 'text-right': isRTL }">
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">
              {{ brandDescription }}
            </p>
          </div>
          
          <!-- Brand Details (For Admin/Detailed View) -->
          <div v-if="showBrandDetails || (authStore.isAuthenticated && authStore.isAdmin)" 
               class="mt-6 p-4 bg-gray-50 rounded-xl">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div class="text-sm font-medium text-gray-500">{{ t('URL Slug') }}</div>
                <div class="font-mono text-gray-900">{{ currentBrand.slug }}</div>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-500">{{ t('Category') }}</div>
                <div class="text-gray-900">{{ currentBrand.category || 'Not specified' }}</div>
              </div>
              <div>
                <div class="text-sm font-medium text-gray-500">{{ t('Status') }}</div>
                <div class="flex items-center gap-2">
                  <span :class="currentBrand.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'" 
                        class="px-2 py-1 text-xs font-semibold rounded-full">
                    {{ currentBrand.isActive ? t('Active') : t('Inactive') }}
                  </span>
                  <button
                    v-if="authStore.isAuthenticated && authStore.isAdmin"
                    @click="toggleBrandStatus"
                    class="text-xs text-gray-600 hover:text-gray-900"
                  >
                    {{ currentBrand.isActive ? t('Deactivate') : t('Activate') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Toggle Details Button -->
          <button
            v-if="!authStore.isAuthenticated || !authStore.isAdmin"
            @click="showBrandDetails = !showBrandDetails"
            class="mt-4 text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
          >
            <svg class="w-4 h-4 transition-transform" :class="{ 'rotate-180': showBrandDetails }" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
            {{ showBrandDetails ? t('Hide Details') : t('Show Brand Details') }}
          </button>
        </div>
      </div>

      <!-- Brand Products -->
      <div v-if="brandProducts.length > 0">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 class="text-2xl font-display-en font-bold text-gray-900">
              {{ t('Brand Collection') }} 
              <span class="text-primary-500">({{ brandProducts.length }})</span>
            </h2>
            <p class="text-gray-600 mt-1">
              {{ t('Explore our collection of') }} {{ brandName }} {{ t('luxury perfumes') }}
            </p>
          </div>
          
          <!-- Filter Options -->
          <div class="flex flex-wrap items-center gap-4">
            <!-- Sort -->
            <select 
              v-model="sortBy"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="newest">{{ t('Newest First') }}</option>
              <option value="price-low">{{ t('Price: Low to High') }}</option>
              <option value="price-high">{{ t('Price: High to Low') }}</option>
              <option value="name">{{ t('Name') }}</option>
              <option value="rating">{{ t('Highest Rated') }}</option>
            </select>
            
            <!-- In Stock Filter -->
            <label class="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                v-model="inStockOnly"
                class="rounded border-gray-300 text-primary-500 focus:ring-primary-500"
              />
              <span class="text-sm text-gray-700">{{ t('In Stock Only') }}</span>
            </label>
            
            <!-- Concentration Filter -->
            <select 
              v-model="concentrationFilter"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">{{ t('All Concentrations') }}</option>
              <option value="Eau de Parfum">Eau de Parfum</option>
              <option value="Eau de Toilette">Eau de Toilette</option>
              <option value="Parfum">Parfum</option>
              <option value="Cologne">Cologne</option>
            </select>
            
            <!-- Admin Actions -->
            <div v-if="authStore.isAuthenticated && authStore.isAdmin" class="flex items-center gap-2">
              <button
                @click="exportBrandProducts"
                class="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
                </svg>
                {{ t('Export') }}
              </button>
              <button
                @click="refreshBrandProducts"
                class="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                :disabled="loading"
              >
                <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                </svg>
                {{ t('Refresh') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <ProductGrid 
          :products="filteredProducts"
          @view-product="viewProduct"
          @add-to-cart="addToCart"
          :show-admin-actions="authStore.isAuthenticated && authStore.isAdmin"
          @edit-product="editProductInAdmin"
          @delete-product="deleteProductFromBrand"
        />

        <!-- Load More Button (if we implement pagination later) -->
        <div v-if="hasMoreProducts && brandProducts.length >= 12" class="text-center mt-12">
          <button
            @click="loadMoreProducts"
            :disabled="loadingMore"
            class="px-8 py-3 bg-white border-2 border-primary-500 text-primary-600 
                   rounded-lg font-medium hover:bg-primary-50 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loadingMore">{{ t('Load More Products') }}</span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              {{ t('Loading...') }}
            </span>
          </button>
        </div>
      </div>

      <!-- No Products Message -->
      <div v-else class="text-center py-20">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-xl font-medium text-gray-900 mb-2">{{ t('No Products Found') }}</h3>
        <p class="text-gray-600 mb-6">
          {{ t('There are no products available for this brand yet.') }}
        </p>
        <div class="flex justify-center gap-4">
          <router-link to="/brands" class="text-primary-600 hover:underline font-medium">
            {{ t('Browse All Brands') }}
          </router-link>
          <router-link
            v-if="authStore.isAuthenticated && authStore.isAdmin"
            :to="`/admin/products/new?brand=${currentBrand.slug}`"
            class="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            {{ t('Add First Product') }}
          </router-link>
        </div>
      </div>

      <!-- Related Brands -->
      <div v-if="relatedBrands.length > 0" class="mt-20 pt-12 border-t border-gray-200">
        <h2 class="text-2xl font-display-en font-bold text-gray-900 mb-8">
          {{ t('Explore Other Luxury Brands') }}
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <router-link
            v-for="brand in relatedBrands"
            :key="brand.id"
            :to="`/brand/${brand.slug}`"
            class="group block"
          >
            <div class="aspect-square rounded-xl overflow-hidden bg-gray-100 p-4 flex items-center justify-center transition-all group-hover:shadow-lg">
              <img 
                :src="brand.image || '/images/brand-default.jpg'" 
                :alt="brand.name"
                class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                @error="handleImageError"
              />
            </div>
            <p class="text-center text-sm font-medium text-gray-900 mt-2 group-hover:text-primary-600">
              {{ brand.name }}
            </p>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Brand Not Found -->
    <div v-else-if="!loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ t('Brand Not Found') }}</h2>
        <p class="text-gray-600 mb-6">{{ t('The brand you are looking for does not exist.') }}</p>
        <router-link to="/brands" class="text-primary-600 hover:underline font-medium">
          {{ t('View All Brands') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useProductsStore } from '@/stores/products'
import { useBrandsStore } from '@/stores/brands'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import ProductGrid from '@/components/Products/ProductGrid.vue'
import LoadingSpinner from '@/components/UI/LoadingSpinner.vue'
import SEOHead from '@/components/UI/SEOHead.vue'
import type { Product } from '@/types'

const route = useRoute()
const router = useRouter()
const languageStore = useLanguageStore()
const productsStore = useProductsStore()
const brandsStore = useBrandsStore()
const cartStore = useCartStore()
const authStore = useAuthStore()

const { t, isRTL } = languageStore

// State
const loading = ref(false)
const loadingMore = ref(false)
const error = ref<string | null>(null)
const sortBy = ref('newest')
const inStockOnly = ref(false)
const concentrationFilter = ref('')
const showBrandDetails = ref(false)
const currentPage = ref(1)
const itemsPerPage = 12

// Computed properties
const brandSlug = computed(() => route.params.slug as string)
const currentBrand = computed(() => brandsStore.currentBrand)
const brandProducts = computed(() => {
  if (!currentBrand.value) return []
  return currentBrand.value.products || []
})

const filteredProducts = computed(() => {
  let products = [...brandProducts.value]
  
  // Apply filters
  if (inStockOnly.value) {
    products = products.filter(product => product.inStock !== false)
  }
  
  if (concentrationFilter.value) {
    products = products.filter(product => 
      product.concentration?.toLowerCase() === concentrationFilter.value.toLowerCase()
    )
  }
  
  // Apply sorting
  switch (sortBy.value) {
    case 'price-low':
      return products.sort((a, b) => a.price - b.price)
    case 'price-high':
      return products.sort((a, b) => b.price - a.price)
    case 'rating':
      return products.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    case 'name':
      return products.sort((a, b) => {
        const nameA = getProductName(a)
        const nameB = getProductName(b)
        return nameA.localeCompare(nameB)
      })
    case 'newest':
    default:
      return products.sort((a, b) => {
        const dateA = getProductDate(a.createdAt)
        const dateB = getProductDate(b.createdAt)
        return dateB.getTime() - dateA.getTime()
      })
  }
})

const brandName = computed(() => currentBrand.value?.name || formatBrandName(brandSlug.value))
const brandSignature = computed(() => currentBrand.value?.signature || '')
const brandImage = computed(() => currentBrand.value?.image || '/images/brand-default.jpg')
const brandLogo = computed(() => currentBrand.value?.image || '/images/brand-default.jpg')
const brandDescription = computed(() => {
  return currentBrand.value?.description || 
    t('Explore our collection of {brand} luxury perfumes', { brand: brandName.value })
})
const brandTitle = computed(() => `${brandName.value} | ${t('Luxury Perfumes')}`)

const brandPriceRange = computed(() => {
  const products = brandProducts.value
  if (products.length === 0) return { min: 0, max: 0 }
  
  const prices = products.map(p => p.price)
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  }
})

const hasMoreProducts = computed(() => {
  return filteredProducts.value.length > currentPage.value * itemsPerPage
})

const relatedBrands = computed(() => {
  // Get all active brands except current one
  const allBrands = brandsStore.brands.filter(brand => 
    brand.isActive !== false && brand.slug !== brandSlug.value
  )
  
  // Take up to 6 brands
  return allBrands.slice(0, 6)
})

// Helper functions
const getProductDate = (date: any): Date => {
  try {
    if (date instanceof Date) return date
    if (date?.toDate && typeof date.toDate === 'function') return date.toDate()
    if (typeof date === 'string' || typeof date === 'number') return new Date(date)
    if (date?.seconds) return new Date(date.seconds * 1000)
    return new Date()
  } catch {
    return new Date()
  }
}

const getProductName = (product: Product): string => {
  if (!product) return ''
  if (typeof product.name === 'string') return product.name
  return product.name?.en || 'Unnamed Product'
}

const formatBrandName = (slug: string): string => {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Load brand data
const loadBrandData = async () => {
  try {
    loading.value = true
    error.value = null
    
    console.log(`🔄 Loading brand: ${brandSlug.value}`)
    
    // Clear previous brand data
    brandsStore.currentBrand = null
    
    // First, make sure all brands are loaded
    if (brandsStore.brands.length === 0) {
      console.log('📥 Loading all brands first...')
      await brandsStore.loadBrands()
    }
    
    // Load brand with products using brands store
    const brand = await brandsStore.getBrandBySlug(brandSlug.value)
    
    if (!brand) {
      error.value = t('Brand not found')
      console.log(`❌ Brand not found: ${brandSlug.value}`)
      return
    }
    
    console.log(`✅ Loaded brand "${brand.name}" with ${brand.products?.length || 0} products`)
    
    // Update page title
    document.title = `${brand.name} | ${t('Luxury Perfumes')}`
    
    // Also load products store if empty
    if (productsStore.products.length === 0) {
      console.log('📦 Loading products...')
      await productsStore.fetchProducts()
    }
    
  } catch (err: any) {
    console.error('❌ Error loading brand data:', err)
    error.value = t('Failed to load brand: ') + (err.message || 'Unknown error')
  } finally {
    loading.value = false
  }
}

// Watch for route changes
watch(
  brandSlug,
  async (newSlug) => {
    if (newSlug) {
      currentPage.value = 1
      await loadBrandData()
    }
  },
  { immediate: true }
)

// On mounted
onMounted(() => {
  if (brandSlug.value) {
    document.title = brandTitle.value
  }
})

// Image error handlers
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/placeholder-product.jpg'
  img.onerror = null
}

const handleBrandImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/brand-default.jpg'
  img.onerror = null
}

// Methods
const viewProduct = (product: Product) => {
  if (product.slug) {
    router.push(`/product/${product.slug}`)
  } else if (product.id) {
    router.push(`/product/${product.id}`)
  }
}

const addToCart = (product: Product, quantity: number = 1) => {
  cartStore.addToCart(product, quantity)
}

const loadMoreProducts = () => {
  loadingMore.value = true
  setTimeout(() => {
    currentPage.value++
    loadingMore.value = false
  }, 500)
}

// Admin Methods
const editProductInAdmin = (product: Product) => {
  router.push(`/admin/products/edit/${product.id}`)
}

const deleteProductFromBrand = async (product: Product) => {
  if (!confirm(`Are you sure you want to delete "${getProductName(product)}"?`)) return
  
  try {
    await productsStore.removeProduct(product.id)
    // Refresh brand data to update the product list
    await loadBrandData()
  } catch (error) {
    console.error('Error deleting product:', error)
    alert('Failed to delete product')
  }
}

const toggleBrandStatus = async () => {
  if (!currentBrand.value || !authStore.isAuthenticated || !authStore.isAdmin) return
  
  const newStatus = !currentBrand.value.isActive
  const confirmed = confirm(`Are you sure you want to ${newStatus ? 'activate' : 'deactivate'} this brand?`)
  
  if (!confirmed) return
  
  try {
    await brandsStore.updateBrand(currentBrand.value.id, { isActive: newStatus })
    await loadBrandData()
    
    alert(`Brand ${newStatus ? 'activated' : 'deactivated'} successfully!`)
  } catch (error) {
    console.error('Error updating brand status:', error)
    alert('Failed to update brand status')
  }
}

const exportBrandProducts = () => {
  if (!currentBrand.value) return
  
  const data = {
    brand: {
      id: currentBrand.value.id,
      name: currentBrand.value.name,
      slug: currentBrand.value.slug,
      description: currentBrand.value.description,
      category: currentBrand.value.category
    },
    products: brandProducts.value.map(product => ({
      id: product.id,
      name: getProductName(product),
      price: product.price,
      size: product.size,
      concentration: product.concentration,
      inStock: product.inStock
    })),
    exportDate: new Date().toISOString(),
    totalProducts: brandProducts.value.length,
    priceRange: brandPriceRange.value
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${brandSlug.value}-products-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  alert('Products exported successfully!')
}

const refreshBrandProducts = async () => {
  try {
    await loadBrandData()
  } catch (error) {
    console.error('Error refreshing products:', error)
  }
}
</script>

<style scoped>
/* Custom styles */
.brand-logo {
  transition: transform 0.3s ease;
}

.brand-logo:hover {
  transform: scale(1.05);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .flex.items-start.justify-between {
    flex-direction: column;
    gap: 2rem;
  }
  
  .w-24.h-24 {
    width: 80px;
    height: 80px;
  }
  
  .text-4xl {
    font-size: 2rem;
  }
}

/* Loading animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.prose p {
  animation: fadeIn 0.5s ease-out;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.3s ease;
}

/* Hover effects */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

.group:hover .group-hover\:shadow-lg {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>