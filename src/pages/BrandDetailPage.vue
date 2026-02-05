<template>
  <div class="min-h-screen bg-white">
    <!-- SEO Head -->
    <SEOHead 
      :title="brand?.name"
      :description="brand?.description"
      :image="brand?.image"
      type="website"
    />

    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-20 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      <p class="mt-4 text-gray-600">{{ t('Loading brand...') }}</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-20 text-center">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-600">{{ error }}</p>
        <router-link to="/brands" class="mt-4 inline-block px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
          {{ t('Back to Brands') }}
        </router-link>
      </div>
    </div>

    <!-- Brand Content -->
    <div v-else-if="brand" class="container mx-auto px-4">
      <!-- Breadcrumb -->
      <nav class="flex items-center text-sm text-gray-600 py-8" 
           :class="{ 'flex-row-reverse': isRTL }">
        <router-link to="/" class="hover:text-primary-600 transition-colors">
          {{ t('Home') }}
        </router-link>
        <span class="mx-3">/</span>
        <router-link to="/brands" class="hover:text-primary-600 transition-colors">
          {{ t('Brands') }}
        </router-link>
        <span class="mx-3">/</span>
        <span class="text-gray-900 font-medium">{{ brand.name }}</span>
      </nav>

      <!-- Brand Hero -->
      <div class="relative rounded-3xl overflow-hidden mb-12">
        <div class="absolute inset-0 bg-gradient-to-r from-black/80 to-black/50 z-10"></div>
        <img 
          :src="brand.image" 
          :alt="brand.name"
          class="w-full h-96 object-cover"
          @error="handleImageError"
        />
        <div class="absolute inset-0 z-20 flex items-center">
          <div class="container mx-auto px-12">
            <h1 class="text-5xl md:text-6xl font-display-en font-bold text-white mb-4">
              {{ brand.name }}
            </h1>
            <p class="text-xl text-gray-200 max-w-2xl">
              {{ brand.signature || brand.description }}
            </p>
            <div class="flex items-center gap-4 mt-6">
              <span class="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full">
                {{ brand.category }}
              </span>
              <span class="text-white">
                {{ brand.products?.length || 0 }} {{ t('Products') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Products Section -->
      <div class="mb-16">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-display-en font-bold text-gray-900">
            {{ t('Products') }}
            <span class="text-gray-500"> ({{ brand.products?.length || 0 }})</span>
          </h2>
        </div>

        <!-- Products Grid -->
        <div v-if="brand.products && brand.products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="product in brand.products"
            :key="product.id"
            class="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-primary-300"
          >
            <router-link :to="`/product/${product.slug}`" class="block">
              <!-- Product Image -->
              <div class="relative h-64 overflow-hidden">
                <img 
                  :src="product.imageUrl" 
                  :alt="product.name[currentLanguage]"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div class="absolute top-4 right-4">
                  <span v-if="product.isBestSeller" class="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                    {{ t('Best Seller') }}
                  </span>
                </div>
              </div>

              <!-- Product Info -->
              <div class="p-6">
                <h3 class="text-lg font-display-en font-bold text-gray-900 mb-2">
                  {{ product.name[currentLanguage] }}
                </h3>
                <p class="text-gray-600 mb-4 line-clamp-2 text-sm">
                  {{ product.description?.[currentLanguage] || '' }}
                </p>
                
                <div class="flex items-center justify-between">
                  <div>
                    <span class="text-xl font-bold text-primary-600">
                      ${{ product.price.toFixed(2) }}
                    </span>
                    <span class="text-sm text-gray-500 ml-2">
                      {{ product.size }}
                    </span>
                  </div>
                  <span class="text-primary-500 hover:text-primary-600 transition-colors">
                    {{ t('View') }} →
                  </span>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- No Products -->
        <div v-else class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <h3 class="text-xl font-medium text-gray-900 mb-2">
            {{ t('No Products Available') }}
          </h3>
          <p class="text-gray-600">
            {{ t('No products have been added to this brand yet.') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useBrandsStore } from '@/stores/brands'
import SEOHead from '@/components/UI/SEOHead.vue'

const route = useRoute()
const languageStore = useLanguageStore()
const brandsStore = useBrandsStore()

const { currentLanguage, isRTL, t } = languageStore

const loading = ref(false)
const error = ref('')
const brand = ref<any>(null)

// Watch for route changes
watch(
  () => route.params.slug,
  async (newSlug) => {
    if (newSlug) {
      await loadBrand(newSlug as string)
    }
  },
  { immediate: true }
)

// Methods
const loadBrand = async (slug: string) => {
  loading.value = true
  error.value = ''
  
  try {
    const brandData = await brandsStore.getBrandBySlug(slug)
    
    if (!brandData) {
      error.value = t('Brand not found')
      brand.value = null
    } else {
      brand.value = brandData
      console.log('✅ Loaded brand with products:', brand.value)
    }
  } catch (err: any) {
    error.value = err.message || t('Failed to load brand')
    brand.value = null
  } finally {
    loading.value = false
  }
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/brand-default.jpg'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>