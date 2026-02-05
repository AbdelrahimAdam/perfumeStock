<template>
  <div class="min-h-screen bg-white">
    <!-- SEO Head -->
    <SEOHead 
      title="Brands | Luxury Perfume Collections"
      description="Explore our luxury perfume collections from premium brands worldwide. All prices in EGP."
      type="website"
    />

    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-primary-900 to-primary-800 text-white">
      <div class="container mx-auto px-4 py-16 md:py-24">
        <div class="max-w-3xl" :class="{ 'text-right': isRTL }">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-display-en font-bold mb-6">
            {{ currentLanguage === 'en' ? 'Premium Perfume Brands' : 'ماركات العطور المميزة' }}
          </h1>
          <p class="text-lg md:text-xl text-gray-300 mb-8">
            {{ currentLanguage === 'en' 
               ? 'Discover luxury fragrances from the world\'s most prestigious perfume houses. Each brand represents a unique olfactory journey.' 
               : 'اكتشف العطور الفاخرة من أشهر دور العطور العالمية. كل ماركة تمثل رحلة شمية فريدة.' }}
          </p>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center text-sm text-gray-600 mb-8" 
           :class="{ 'flex-row-reverse': isRTL }">
        <router-link to="/" class="hover:text-primary-600 transition-colors">
          {{ currentLanguage === 'en' ? 'Home' : 'الرئيسية' }}
        </router-link>
        <span class="mx-3">/</span>
        <span class="text-gray-900 font-medium">{{ currentLanguage === 'en' ? 'Brands' : 'الماركات' }}</span>
      </nav>

      <!-- Loading State -->
      <div v-if="brandsStore.isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        <p class="mt-4 text-gray-600">{{ t('Loading brands...') }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="brandsStore.error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
          <p class="text-red-600">{{ brandsStore.error }}</p>
          <button @click="loadBrands" class="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
            {{ t('Try Again') }}
          </button>
        </div>
      </div>

      <!-- Brands Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="brand in displayBrands"
          :key="brand.id"
          class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-primary-300"
        >
          <router-link :to="`/brand/${brand.slug}`" class="block">
            <!-- Brand Image -->
            <div class="relative h-48 overflow-hidden">
              <img 
                :src="brand.image" 
                :alt="brand.name"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                @error="handleImageError($event, brand)"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <!-- Status Badge -->
              <div class="absolute top-4 left-4">
                <span :class="[
                  'px-3 py-1 rounded-full text-xs font-medium',
                  brand.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                ]">
                  {{ brand.isActive ? t('Active') : t('Inactive') }}
                </span>
              </div>
            </div>

            <!-- Brand Info -->
            <div class="p-6">
              <h3 class="text-xl font-display-en font-bold text-gray-900 mb-2">
                {{ brand.name }}
              </h3>
              <p class="text-gray-600 mb-4 line-clamp-2">
                {{ brand.signature || brand.description || `${brand.name} Collection` }}
              </p>
              
              <div class="flex items-center justify-between">
                <div>
                  <span class="text-sm font-medium text-primary-600">
                    {{ t('Products') }}: {{ getBrandProductsCount(brand.slug) }}
                  </span>
                  <span class="mx-2 text-gray-300">•</span>
                  <span class="text-sm text-gray-500">
                    {{ brand.category }}
                  </span>
                </div>
                <span class="text-primary-500 group-hover:text-primary-600 transition-colors">
                  {{ currentLanguage === 'en' ? 'Explore →' : 'استكشف →' }}
                </span>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- No Brands Message -->
      <div v-if="!brandsStore.isLoading && !brandsStore.error && displayBrands.length === 0" class="text-center py-20">
        <div class="text-gray-400 mb-4">
          <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <h3 class="text-xl font-medium text-gray-900 mb-2">
          {{ currentLanguage === 'en' ? 'No Brands Available' : 'لا توجد ماركات متاحة' }}
        </h3>
        <p class="text-gray-600">
          {{ currentLanguage === 'en' 
             ? 'Brands will be added soon by the administrator.' 
             : 'سيتم إضافة الماركات قريباً من قبل المسؤول.' }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { useProductsStore } from '@/stores/products'
import { useBrandsStore } from '@/stores/brands' // Import brands store
import SEOHead from '@/components/UI/SEOHead.vue'

const languageStore = useLanguageStore()
const productsStore = useProductsStore()
const brandsStore = useBrandsStore() // Use brands store

const { currentLanguage, isRTL, t } = languageStore

// COMPUTED: Get brands from brands store
const displayBrands = computed(() => {
  console.log('🔄 Getting brands from brands store:', brandsStore.brands.length)
  
  return brandsStore.brands.map(brand => ({
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    signature: brand.signature,
    image: brand.image || '/images/brand-default.jpg',
    description: brand.description,
    category: brand.category,
    isActive: brand.isActive !== false,
    productCount: brand.productIds?.length || 0
  }))
})

// Methods
const getBrandProductsCount = (brandSlug: string) => {
  const count = productsStore.getProductsByBrand(brandSlug).length
  console.log(`📊 Products count for ${brandSlug}:`, count)
  return count
}

const handleImageError = (event: Event, brand: any) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/brand-default.jpg'
}

const loadBrands = async () => {
  await brandsStore.loadBrands()
}

// On mounted
onMounted(async () => {
  console.log('🏠 BrandsPage mounted - Loading data...')
  
  // Load brands from brands store
  if (brandsStore.brands.length === 0) {
    console.log('📥 Loading brands from brands store...')
    await brandsStore.loadBrands()
    console.log('✅ Brands loaded:', brandsStore.brands.length)
  }
  
  // Load products if needed
  if (productsStore.products.length === 0) {
    console.log('📦 Loading products...')
    await productsStore.fetchProducts()
  }
  
  console.log('🎉 BrandsPage ready with', displayBrands.value.length, 'brands')
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}
</style>