<template>
  <div class="min-h-screen bg-white">
    <!-- SEO Head -->
    <SEOHead 
      title="Collections | Curated Perfume Sets"
      description="Discover our specially curated perfume collections and gift sets. Perfect gifts in EGP."
      type="website"
    />

    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-gray-900 via-primary-900 to-gray-900 text-white">
      <div class="container mx-auto px-4 py-16 md:py-24">
        <div class="max-w-3xl" :class="{ 'text-right': isRTL }">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-display-en font-bold mb-6">
            {{ currentLanguage === 'en' ? 'Curated Collections' : 'مجموعات مختارة' }}
          </h1>
          <p class="text-lg md:text-xl text-gray-300 mb-8">
            {{ currentLanguage === 'en' 
               ? 'Explore our specially curated perfume collections, each designed to tell a unique story and evoke specific emotions.' 
               : 'استكشف مجموعات العطور المختارة خصيصاً، كل مجموعة مصممة لتروي قصة فريدة وتثير مشاعر محددة.' }}
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
        <span class="text-gray-900 font-medium">{{ currentLanguage === 'en' ? 'Collections' : 'المجموعات' }}</span>
      </nav>

      <!-- Collections Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- Seasonal Collection -->
        <div class="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl shadow-lg overflow-hidden">
          <div class="p-8">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span class="text-white text-xl">🌸</span>
              </div>
              <h3 class="text-2xl font-display-en font-bold text-gray-900">
                {{ currentLanguage === 'en' ? 'Seasonal Collection' : 'مجموعة موسمية' }}
              </h3>
            </div>
            <p class="text-gray-700 mb-6">
              {{ currentLanguage === 'en' 
                 ? 'Fresh and vibrant scents perfect for spring and summer. Light florals and citrus notes that capture the essence of sunny days.' 
                 : 'عطور منعشة ونابضة بالحياة مثالية للربيع والصيف. نوتات زهرية خفيفة وحمضيات تجسد جو الأيام المشمسة.' }}
            </p>
            <div class="flex items-center justify-between">
              <span class="text-lg font-bold text-primary-600">
                {{ currentLanguage === 'en' ? 'From 1500 EGP' : 'بدءاً من 1500 جنيه' }}
              </span>
              <button
                @click="viewSeasonalProducts"
                class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                {{ currentLanguage === 'en' ? 'Explore' : 'استكشف' }}
              </button>
            </div>
          </div>
          <div class="h-48 bg-gradient-to-r from-blue-200 to-indigo-300"></div>
        </div>

        <!-- Evening Collection -->
        <div class="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl shadow-lg overflow-hidden">
          <div class="p-8">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <span class="text-white text-xl">🌙</span>
              </div>
              <h3 class="text-2xl font-display-en font-bold text-gray-900">
                {{ currentLanguage === 'en' ? 'Evening Elegance' : 'أناقة المساء' }}
              </h3>
            </div>
            <p class="text-gray-700 mb-6">
              {{ currentLanguage === 'en' 
                 ? 'Rich, sensual fragrances for special occasions and evening events. Deep woods, amber, and musk create unforgettable impressions.' 
                 : 'عطور غنية وحسية للمناسبات الخاصة والفعاليات المسائية. الأخشاب العميقة والعنبر والمسك تخلق انطباعات لا تنسى.' }}
            </p>
            <div class="flex items-center justify-between">
              <span class="text-lg font-bold text-primary-600">
                {{ currentLanguage === 'en' ? 'From 2500 EGP' : 'بدءاً من 2500 جنيه' }}
              </span>
              <button
                @click="viewEveningProducts"
                class="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
              >
                {{ currentLanguage === 'en' ? 'Explore' : 'استكشف' }}
              </button>
            </div>
          </div>
          <div class="h-48 bg-gradient-to-r from-purple-200 to-pink-300"></div>
        </div>

        <!-- Gift Sets -->
        <div class="bg-gradient-to-br from-amber-50 to-yellow-100 rounded-2xl shadow-lg overflow-hidden">
          <div class="p-8">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                <span class="text-white text-xl">🎁</span>
              </div>
              <h3 class="text-2xl font-display-en font-bold text-gray-900">
                {{ currentLanguage === 'en' ? 'Premium Gift Sets' : 'مجموعات هدايا مميزة' }}
              </h3>
            </div>
            <p class="text-gray-700 mb-6">
              {{ currentLanguage === 'en' 
                 ? 'Perfect presents for loved ones. Complete sets including perfume, body lotion, and shower gel in matching scents.' 
                 : 'هدايا مثالية للأحباء. مجموعات كاملة تشمل العطر، لوشن الجسم، وجل الاستحمام بنفس الرائحة.' }}
            </p>
            <div class="flex items-center justify-between">
              <span class="text-lg font-bold text-primary-600">
                {{ currentLanguage === 'en' ? 'From 3500 EGP' : 'بدءاً من 3500 جنيه' }}
              </span>
              <button
                @click="viewGiftSets"
                class="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
              >
                {{ currentLanguage === 'en' ? 'Explore' : 'استكشف' }}
              </button>
            </div>
          </div>
          <div class="h-48 bg-gradient-to-r from-amber-200 to-yellow-300"></div>
        </div>

        <!-- Arabic Oud Collection -->
        <div class="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl shadow-lg overflow-hidden">
          <div class="p-8">
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                <span class="text-white text-xl">🌿</span>
              </div>
              <h3 class="text-2xl font-display-en font-bold text-gray-900">
                {{ currentLanguage === 'en' ? 'Arabic Oud Collection' : 'مجموعة العود العربي' }}
              </h3>
            </div>
            <p class="text-gray-700 mb-6">
              {{ currentLanguage === 'en' 
                 ? 'Authentic Arabian oud fragrances with deep, woody notes. Traditional scents with modern elegance for the discerning connoisseur.' 
                 : 'عطور عود عربي أصيلة بنوتات خشبية عميقة. روائح تقليدية بأناقة عصرية للهواة المتميزين.' }}
            </p>
            <div class="flex items-center justify-between">
              <span class="text-lg font-bold text-primary-600">
                {{ currentLanguage === 'en' ? 'From 5000 EGP' : 'بدءاً من 5000 جنيه' }}
              </span>
              <button
                @click="viewOudProducts"
                class="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
              >
                {{ currentLanguage === 'en' ? 'Explore' : 'استكشف' }}
              </button>
            </div>
          </div>
          <div class="h-48 bg-gradient-to-r from-emerald-200 to-teal-300"></div>
        </div>
      </div>

      <!-- Featured Products -->
      <div v-if="featuredProducts.length > 0" class="mt-16">
        <h2 class="text-3xl font-display-en font-bold text-gray-900 mb-8">
          {{ currentLanguage === 'en' ? 'Featured in Collections' : 'مميز في المجموعات' }}
        </h2>
        <ProductGrid 
          :products="featuredProducts"
          @view-product="viewProduct"
          @add-to-cart="addToCart"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import ProductGrid from '@/components/Products/ProductGrid.vue'
import SEOHead from '@/components/UI/SEOHead.vue'
import type { Product } from '@/types'

const router = useRouter()
const languageStore = useLanguageStore()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const { currentLanguage, isRTL } = languageStore

// Computed
const featuredProducts = computed(() => {
  return productsStore.products.filter(product => product.isFeatured).slice(0, 8)
})

// Methods
const viewSeasonalProducts = () => {
  router.push('/shop?category=floral')
}

const viewEveningProducts = () => {
  router.push('/shop?category=oriental')
}

const viewGiftSets = () => {
  router.push('/shop?minPrice=3500')
}

const viewOudProducts = () => {
  router.push('/brand/tom-ford') // Example brand for oud
}

const viewProduct = (product: Product) => {
  router.push(`/product/${product.slug}`)
}

const addToCart = (product: Product, quantity: number = 1) => {
  cartStore.addToCart(product, quantity)
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
/* Additional custom styles if needed */
</style>