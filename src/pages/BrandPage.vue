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
    <div v-else class="container mx-auto px-4 py-8">
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
        <span class="text-gray-900 font-medium">{{ brandName }}</span>
      </nav>

      <!-- Brand Header -->
      <div class="mb-12">
        <div class="flex items-center gap-6 mb-6" :class="{ 'flex-row-reverse': isRTL }">
          <div class="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <img 
              :src="brandLogo" 
              :alt="brandName"
              class="w-full h-full object-cover"
            />
          </div>
          <div :class="{ 'text-right': isRTL }">
            <h1 class="text-4xl lg:text-5xl font-display-en font-bold text-gray-900 mb-2">
              {{ brandName }}
            </h1>
            <p class="text-lg text-gray-600">{{ brandSignature }}</p>
          </div>
        </div>
        
        <div class="prose max-w-none" :class="{ 'text-right': isRTL }">
          <p class="text-gray-700 leading-relaxed">
            {{ brandDescription }}
          </p>
        </div>
      </div>

      <!-- Brand Products -->
      <div v-if="brandProducts.length > 0">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-display-en font-bold text-gray-900">
            {{ t('Brand Collection') }} <span class="text-primary-500">({{ brandProducts.length }})</span>
          </h2>
          
          <!-- Filter Options -->
          <div class="flex items-center gap-4">
            <select 
              v-model="sortBy"
              class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="newest">{{ t('Newest First') }}</option>
              <option value="price-low">{{ t('Price: Low to High') }}</option>
              <option value="price-high">{{ t('Price: High to Low') }}</option>
              <option value="name">{{ t('Name') }}</option>
            </select>
          </div>
        </div>

        <!-- Products Grid -->
        <ProductGrid 
          :products="sortedProducts"
          @view-product="viewProduct"
          @add-to-cart="addToCart"
        />
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
        <p class="text-gray-600 mb-6">{{ t('There are no products available for this brand yet.') }}</p>
        <router-link to="/" class="text-primary-600 hover:underline font-medium">
          {{ t('Browse All Brands') }}
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
import { useCartStore } from '@/stores/cart'
import ProductGrid from '@/components/Products/ProductGrid.vue'
import LoadingSpinner from '@/components/UI/LoadingSpinner.vue'
import SEOHead from '@/components/UI/SEOHead.vue'
import type { Product } from '@/types'

const route = useRoute()
const router = useRouter()
const languageStore = useLanguageStore()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const { currentLanguage, isRTL, t } = languageStore

const loading = ref(true)
const error = ref<string | null>(null)
const sortBy = ref('newest')
const brandSlug = ref('')

// Brand data from homepage
const brands = [
  { 
    id: 1, 
    slug: 'tom-ford', 
    nameKey: 'brandTomFord',
    signatureKey: 'noirExtreme',
    image: '/images/GURLAND.png', 
    logo: '/images/tomford.png',
    descriptionKey: 'tomFordDescription'
  },
  { 
    id: 2, 
    slug: 'saint-laurent', 
    nameKey: 'brandYsl',
    signatureKey: 'blackOpium',
    image: '/images/santlaurent.jpg', 
    logo: '/images/saintlaurent.jpg',
    descriptionKey: 'yslDescription'
  },
  { 
    id: 3, 
    slug: 'versace', 
    nameKey: 'brandVersace',
    signatureKey: 'erosFlame',
    image: '/images/versacee.jpg', 
    logo: '/images/versace.jpeg',
    descriptionKey: 'versaceDescription'
  },
  { 
    id: 4, 
    slug: 'chanel', 
    nameKey: 'brandChanel',
    signatureKey: 'cocoMademoiselle',
    image: '/images/chanceshaneal.jpeg', 
    logo: '/images/shaneal.jpg',
    descriptionKey: 'chanelDescription'
  },
  { 
    id: 5, 
    slug: 'dior', 
    nameKey: 'brandDior',
    signatureKey: 'sauvageElixir',
    image: '/images/DIOUR.jpg', 
    logo: '/images/dior.jpg',
    descriptionKey: 'diorDescription'
  },
  { 
    id: 6, 
    slug: 'gucci', 
    nameKey: 'brandGucci',
    signatureKey: 'bloom',
    image: '/images/GUCCI.jpg', 
    logo: '/images/goochi.jpg',
    descriptionKey: 'gucciDescription'
  },
]

// Computed properties
const currentBrand = computed(() => {
  return brands.find(brand => brand.slug === brandSlug.value)
})

const brandName = computed(() => {
  return currentBrand.value ? t(currentBrand.value.nameKey) : ''
})

const brandSignature = computed(() => {
  return currentBrand.value ? t(currentBrand.value.signatureKey) : ''
})

const brandImage = computed(() => {
  return currentBrand.value?.image || ''
})

const brandLogo = computed(() => {
  return currentBrand.value?.logo || ''
})

const brandDescription = computed(() => {
  if (!currentBrand.value) return ''
  const description = t(currentBrand.value.descriptionKey)
  return description || t('brandDefaultDescription')
})

const brandTitle = computed(() => {
  return `${brandName.value} | ${t('Luxury Perfumes')}`
})

// Use store method to get brand products
const brandProducts = computed(() => {
  if (!currentBrand.value) return []
  
  // Use the store's getProductsByBrand method
  return productsStore.getProductsByBrand(currentBrand.value.slug)
})

// Sorted products
const sortedProducts = computed(() => {
  const products = [...brandProducts.value]
  
  switch (sortBy.value) {
    case 'price-low':
      return products.sort((a, b) => a.price - b.price)
    case 'price-high':
      return products.sort((a, b) => b.price - a.price)
    case 'name':
      return products.sort((a, b) => 
        a.name[currentLanguage]?.localeCompare(b.name[currentLanguage] || '')
      )
    case 'newest':
    default:
      return products.sort((a, b) => 
        (b.createdAt?.toDate?.() || new Date(0)) - (a.createdAt?.toDate?.() || new Date(0))
      )
  }
})

// Methods
const viewProduct = (product: Product) => {
  router.push(`/product/${product.slug}`)
}

const addToCart = (product: Product, quantity: number = 1) => {
  cartStore.addToCart(product, quantity)
}

// Watch for route changes
watch(
  () => route.params.slug,
  async (newSlug) => {
    if (newSlug) {
      loading.value = true
      error.value = null
      brandSlug.value = newSlug as string
      
      try {
        // Check if brand exists
        if (!currentBrand.value) {
          error.value = t('Brand not found')
        }
        
        // Make sure products are loaded
        if (productsStore.products.length === 0) {
          await productsStore.fetchProducts()
        }
        
      } catch (err: any) {
        error.value = err.message || t('Failed to load brand')
      } finally {
        loading.value = false
      }
    }
  },
  { immediate: true }
)

// On mounted
onMounted(() => {
  // Load products if not already loaded
  if (productsStore.products.length === 0) {
    productsStore.fetchProducts()
  }
})
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>