<template>
  <div class="min-h-screen bg-white">
    <SEOHead 
      :title="categoryTitle"
      :description="categoryDescription"
    />
    
    <!-- Category Header -->
    <div class="relative h-64 md:h-96 flex items-center justify-center overflow-hidden">
      <!-- Background -->
      <div class="absolute inset-0 bg-gradient-to-br from-gray-900 to-black">
        <img 
          v-if="categoryImage"
          :src="categoryImage"
          :alt="categoryName"
          class="w-full h-full object-cover opacity-40"
        />
      </div>
      
      <!-- Content -->
      <div class="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <nav class="flex items-center justify-center text-sm text-white/80 mb-6" 
             :class="{ 'flex-row-reverse': isRTL }">
          <router-link to="/" class="hover:text-white transition-colors">
            {{ t('Home') }}
          </router-link>
          <span class="mx-3">/</span>
          <span class="text-white">{{ categoryName }}</span>
        </nav>
        
        <h1 class="text-4xl md:text-6xl font-display-en font-bold text-white mb-4">
          {{ categoryName }}
        </h1>
        <p v-if="categoryDescription" class="text-xl text-gray-300 max-w-2xl mx-auto">
          {{ categoryDescription }}
        </p>
      </div>
    </div>

    <!-- Filters & Products -->
    <div class="container mx-auto px-4 py-12">
      <div class="grid lg:grid-cols-4 gap-8">
        <!-- Sidebar Filters -->
        <div class="lg:col-span-1">
          <div class="sticky top-24">
            <CategoryFilter 
              :filters="filters"
              @update:filters="updateFilters"
            />
          </div>
        </div>

        <!-- Products Section -->
        <div class="lg:col-span-3">
          <!-- Header -->
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 class="text-2xl font-display-en font-bold text-gray-900">
                {{ categoryName }}
              </h2>
              <p v-if="filteredProducts.length" class="text-gray-600 mt-1">
                {{ t('Showing') }} {{ filteredProducts.length }} {{ t('products') }}
              </p>
            </div>
            
            <!-- Sort & View Options -->
            <div class="flex items-center space-x-4" :class="{ 'space-x-reverse': isRTL }">
              <!-- Sort Select -->
              <div class="relative">
                <select
                  v-model="filters.sortBy"
                  @change="updateFilters"
                  class="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg 
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                         bg-white"
                  :style="{ direction: isRTL ? 'rtl' : 'ltr' }"
                >
                  <option value="">{{ t('Sort by') }}</option>
                  <option value="newest">{{ t('Newest') }}</option>
                  <option value="price-low">{{ t('Price: Low to High') }}</option>
                  <option value="price-high">{{ t('Price: High to Low') }}</option>
                  <option value="popular">{{ t('Most Popular') }}</option>
                </select>
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                     :class="{ 'right-auto left-0': isRTL }">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M19 9l-7 7-7-7"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Products Grid -->
          <ProductGrid 
            :products="filteredProducts"
            :loading="productsStore.isLoading"
            :error="productsStore.error"
            @view-product="viewProduct"
            @add-to-cart="addToCart"
            @retry="productsStore.fetchProducts"
          />

          <!-- No Results -->
          <div v-if="!productsStore.isLoading && filteredProducts.length === 0" 
               class="text-center py-16">
            <div class="w-24 h-24 mx-auto mb-6 text-gray-300">
              <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                      d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ t('No products found') }}
            </h3>
            <p class="text-gray-600 mb-6">
              {{ t('Try adjusting your filters or browse other categories') }}
            </p>
            <button
              @click="clearFilters"
              class="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium 
                     hover:bg-primary-600 transition-colors"
            >
              {{ t('Clear Filters') }}
            </button>
          </div>
        </div>
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
import CategoryFilter from '@/components/Products/CategoryFilter.vue'
import SEOHead from '@/components/UI/SEOHead.vue'
import type { Product, FilterOptions } from '@/types'

const route = useRoute()
const router = useRouter()
const languageStore = useLanguageStore()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const { currentLanguage, isRTL, t } = languageStore
const { categories, products, filterProducts } = productsStore

const filters = ref<FilterOptions>({})
const categorySlug = computed(() => route.params.slug as string)

// Computed properties
const currentCategory = computed(() => {
  return categories.find(c => c.id === categorySlug.value)
})

const categoryName = computed(() => {
  return currentCategory.value?.[currentLanguage.value] || categorySlug.value
})

const categoryDescription = computed(() => {
  return currentCategory.value?.description?.[currentLanguage.value]
})

const categoryImage = computed(() => {
  return currentCategory.value?.image
})

const categoryTitle = computed(() => {
  return `${categoryName.value} | ${t('Luxury Perfumes')}`
})

const filteredProducts = computed(() => {
  let filtered = products
  
  // Apply category filter
  if (categorySlug.value && categorySlug.value !== 'best-sellers' && categorySlug.value !== 'new-arrivals') {
    filtered = filtered.filter(p => p.category === categorySlug.value)
  }
  
  // Apply other filters
  filtered = filterProducts(filters.value)
  
  // Special categories
  if (categorySlug.value === 'best-sellers') {
    filtered = filtered.filter(p => p.isBestSeller)
  } else if (categorySlug.value === 'new-arrivals') {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    filtered = filtered.filter(p => p.createdAt?.toDate() > oneMonthAgo)
  }
  
  return filtered
})

// Methods
const updateFilters = (newFilters: FilterOptions) => {
  filters.value = newFilters
}

const clearFilters = () => {
  filters.value = {}
}

const viewProduct = (product: Product) => {
  router.push(`/product/${product.slug}`)
}

const addToCart = (product: Product) => {
  cartStore.addToCart(product)
}

// Watch for route changes
watch(
  () => route.params.slug,
  async (newSlug) => {
    if (newSlug) {
      await productsStore.fetchProducts()
      // Reset filters except category
      filters.value = {}
    }
  },
  { immediate: true }
)

// Initialize
onMounted(async () => {
  if (!products.length) {
    await productsStore.fetchProducts()
  }
})
</script>