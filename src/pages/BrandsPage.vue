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

      <!-- Brands Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="brand in brands"
          :key="brand.slug"
          class="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-primary-300"
        >
          <router-link :to="`/brand/${brand.slug}`" class="block">
            <!-- Brand Image -->
            <div class="relative h-48 overflow-hidden">
              <img 
                :src="brand.image" 
                :alt="brand.nameKey"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <!-- Brand Logo Overlay -->
              <div class="absolute top-4 right-4 w-16 h-16 bg-white rounded-full p-2 shadow-lg">
                <img 
                  :src="brand.logo" 
                  :alt="brand.nameKey + ' Logo'"
                  class="w-full h-full object-contain"
                />
              </div>
            </div>

            <!-- Brand Info -->
            <div class="p-6">
              <h3 class="text-xl font-display-en font-bold text-gray-900 mb-2">
                {{ t(brand.nameKey) }}
              </h3>
              <p class="text-gray-600 mb-4 line-clamp-2">
                {{ t(brand.signatureKey) }}
              </p>
              
              <!-- Brand Products Count -->
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-primary-600">
                  {{ currentLanguage === 'en' ? 'Products' : 'المنتجات' }}: {{ getBrandProductsCount(brand.slug) }}
                </span>
                <span class="text-primary-500 group-hover:text-primary-600 transition-colors">
                  {{ currentLanguage === 'en' ? 'Explore →' : 'استكشف →' }}
                </span>
              </div>
            </div>
          </router-link>
        </div>
      </div>

      <!-- No Brands Message -->
      <div v-if="brands.length === 0" class="text-center py-20">
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
import SEOHead from '@/components/UI/SEOHead.vue'

const languageStore = useLanguageStore()
const productsStore = useProductsStore()

const { currentLanguage, isRTL, t } = languageStore

// Brand data from your BrandPage
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

// Methods
const getBrandProductsCount = (brandSlug: string) => {
  return productsStore.getProductsByBrand(brandSlug).length
}

// On mounted
onMounted(() => {
  // Load products if not already loaded
  if (productsStore.products.length === 0) {
    productsStore.fetchProducts()
  }
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