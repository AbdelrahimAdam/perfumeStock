<template>
  <div class="min-h-screen bg-white">
    <!-- SEO Head -->
    <SEOHead 
      title="Shop All Perfumes | Luxury Fragrance Store"
      description="Browse our complete collection of luxury perfumes from all brands and categories. Prices in EGP."
      type="website"
    />

    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div class="container mx-auto px-4 py-16 md:py-24">
        <div class="max-w-3xl" :class="{ 'text-right': isRTL }">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-display-en font-bold mb-6">
            {{ currentLanguage === 'en' ? 'Luxury Perfume Collection' : 'مجموعة العطور الفاخرة' }}
          </h1>
          <p class="text-lg md:text-xl text-gray-300 mb-8">
            {{ currentLanguage === 'en' 
               ? 'Discover our exclusive collection of premium fragrances from the world\'s most prestigious brands. All prices in EGP.' 
               : 'اكتشف مجموعتنا الحصرية من العطور المميزة من أشهر الماركات العالمية. جميع الأسعار بالجنيه المصري.' }}
          </p>
          <div class="flex items-center gap-4 text-sm">
            <span class="bg-primary-500/20 text-primary-300 px-4 py-2 rounded-full">
              {{ currentLanguage === 'en' ? 'Free Shipping' : 'شحن مجاني' }}
            </span>
            <span class="bg-primary-500/20 text-primary-300 px-4 py-2 rounded-full">
              {{ currentLanguage === 'en' ? 'Authentic Products' : 'منتجات أصلية' }}
            </span>
            <span class="bg-primary-500/20 text-primary-300 px-4 py-2 rounded-full">
              {{ currentLanguage === 'en' ? 'EGP Prices' : 'أسعار بالجنيه المصري' }}
            </span>
          </div>
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
        <span class="text-gray-900 font-medium">{{ currentLanguage === 'en' ? 'Shop All' : 'تسوق الكل' }}</span>
      </nav>

      <div class="grid lg:grid-cols-4 gap-8">
        <!-- Sidebar Filters -->
        <div class="lg:col-span-1">
          <div class="sticky top-24">
            <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h3 class="text-lg font-display-en font-bold mb-4">
                {{ currentLanguage === 'en' ? 'Categories' : 'الفئات' }}
              </h3>
              <div class="space-y-2">
                <button
                  v-for="category in categories"
                  :key="category.id"
                  @click="updateFilter('category', category.id)"
                  :class="[
                    'w-full text-left px-4 py-3 rounded-lg transition-all duration-200',
                    filters.category === category.id
                      ? 'bg-primary-500 text-white shadow-gold'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  ]"
                  :style="{ direction: isRTL ? 'rtl' : 'ltr' }"
                >
                  {{ category[currentLanguage] }}
                </button>
              </div>
            </div>

            <div class="bg-white rounded-xl shadow-lg p-6">
              <h3 class="text-lg font-display-en font-bold mb-4">
                {{ currentLanguage === 'en' ? 'Price Range (EGP)' : 'نطاق السعر (جنيه مصري)' }}
              </h3>
              <div class="space-y-2">
                <button
                  v-for="range in priceRanges"
                  :key="range.label[currentLanguage]"
                  @click="updatePriceRange(range)"
                  :class="[
                    'w-full text-left px-4 py-3 rounded-lg transition-all duration-200',
                    isPriceRangeSelected(range)
                      ? 'bg-primary-500 text-white shadow-gold'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  ]"
                >
                  {{ range.label[currentLanguage] }}
                </button>
              </div>

              <div class="mt-6 pt-6 border-t border-gray-200">
                <h3 class="text-lg font-display-en font-bold mb-4">
                  {{ currentLanguage === 'en' ? 'Brands' : 'الماركات' }}
                </h3>
                <div class="space-y-2 max-h-64 overflow-y-auto">
                  <button
                    v-for="brand in luxuryBrands"
                    :key="brand"
                    @click="updateFilter('brand', brand)"
                    :class="[
                      'w-full text-left px-4 py-2 rounded-lg transition-all duration-200',
                      filters.brand === brand
                        ? 'bg-primary-100 text-primary-700 border border-primary-300'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    ]"
                  >
                    {{ brand }}
                  </button>
                </div>
              </div>

              <button
                @click="clearFilters"
                class="w-full mt-6 px-4 py-3 text-gray-600 hover:text-primary-600 
                       border border-gray-300 rounded-lg hover:border-primary-500 
                       transition-all duration-200 font-medium"
              >
                {{ currentLanguage === 'en' ? 'Clear All Filters' : 'مسح جميع الفلاتر' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Products Grid -->
        <div class="lg:col-span-3">
          <!-- Header with counts and sort -->
          <div class="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 class="text-2xl font-display-en font-bold text-gray-900">
                {{ currentLanguage === 'en' ? 'All Products' : 'جميع المنتجات' }}
                <span class="text-primary-500">({{ filteredProducts.length }})</span>
              </h2>
              <p class="text-gray-600 mt-1">
                {{ currentLanguage === 'en' 
                   ? `Showing ${filteredProducts.length} of ${products.length} products` 
                   : `عرض ${filteredProducts.length} من أصل ${products.length} منتج` }}
              </p>
            </div>

            <div class="flex items-center gap-4">
              <select
                v-model="filters.sortBy"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-primary-500 focus:border-transparent bg-white"
              >
                <option value="newest">{{ currentLanguage === 'en' ? 'Newest First' : 'الأحدث أولاً' }}</option>
                <option value="price-low">{{ currentLanguage === 'en' ? 'Price: Low to High' : 'السعر: منخفض إلى مرتفع' }}</option>
                <option value="price-high">{{ currentLanguage === 'en' ? 'Price: High to Low' : 'السعر: مرتفع إلى منخفض' }}</option>
                <option value="rating">{{ currentLanguage === 'en' ? 'Highest Rated' : 'الأعلى تقييماً' }}</option>
                <option value="name">{{ currentLanguage === 'en' ? 'Name' : 'الاسم' }}</option>
              </select>
            </div>
          </div>

          <!-- Products Grid -->
          <div v-if="filteredProducts.length > 0">
            <ProductGrid 
              :products="filteredProducts"
              @view-product="viewProduct"
              @add-to-cart="addToCart"
            />

            <!-- Load More Button -->
            <div v-if="showLoadMore" class="text-center mt-12">
              <button
                @click="loadMoreProducts"
                class="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 
                       transition-colors duration-200 font-medium"
              >
                {{ currentLanguage === 'en' ? 'Load More Products' : 'تحميل المزيد من المنتجات' }}
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
            <h3 class="text-xl font-medium text-gray-900 mb-2">
              {{ currentLanguage === 'en' ? 'No Products Found' : 'لم يتم العثور على منتجات' }}
            </h3>
            <p class="text-gray-600 mb-6">
              {{ currentLanguage === 'en' 
                 ? 'Try adjusting your filters or browse all categories.' 
                 : 'حاول تعديل الفلاتر أو تصفح جميع الفئات.' }}
            </p>
            <button
              @click="clearFilters"
              class="text-primary-600 hover:text-primary-700 font-medium underline"
            >
              {{ currentLanguage === 'en' ? 'Clear All Filters' : 'مسح جميع الفلاتر' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import ProductGrid from '@/components/Products/ProductGrid.vue'
import SEOHead from '@/components/UI/SEOHead.vue'
import type { Product, FilterOptions } from '@/types'

const router = useRouter()
const languageStore = useLanguageStore()
const productsStore = useProductsStore()
const cartStore = useCartStore()

const { currentLanguage, isRTL } = languageStore
const { categories, luxuryBrands, products, filterProducts } = productsStore

// State
const filters = ref<FilterOptions>({
  sortBy: 'newest'
})
const visibleCount = ref(12)

// Price ranges in EGP
const priceRanges = [
  { min: 0, max: 1000, label: { en: 'Under 1000 EGP', ar: 'أقل من 1000 جنيه' } },
  { min: 1000, max: 2000, label: { en: '1000 - 2000 EGP', ar: '1000 - 2000 جنيه' } },
  { min: 2000, max: 5000, label: { en: '2000 - 5000 EGP', ar: '2000 - 5000 جنيه' } },
  { min: 5000, max: 10000, label: { en: '5000 - 10000 EGP', ar: '5000 - 10000 جنيه' } },
  { min: 10000, max: Infinity, label: { en: '10000+ EGP', ar: '10000+ جنيه' } }
]

// Computed
const filteredProducts = computed(() => {
  return productsStore.filterProducts(filters.value)
})

const visibleProducts = computed(() => {
  return filteredProducts.value.slice(0, visibleCount.value)
})

const showLoadMore = computed(() => {
  return visibleCount.value < filteredProducts.value.length
})

// Methods
const updateFilter = (key: keyof FilterOptions, value: any) => {
  if (filters.value[key] === value) {
    delete filters.value[key]
  } else {
    filters.value[key] = value
  }
  visibleCount.value = 12 // Reset to first page
}

const updatePriceRange = (range: typeof priceRanges[0]) => {
  if (isPriceRangeSelected(range)) {
    delete filters.value.minPrice
    delete filters.value.maxPrice
  } else {
    filters.value.minPrice = range.min
    filters.value.maxPrice = range.max === Infinity ? undefined : range.max
  }
  visibleCount.value = 12
}

const isPriceRangeSelected = (range: typeof priceRanges[0]) => {
  return (
    filters.value.minPrice === range.min &&
    (filters.value.maxPrice === range.max || 
     (range.max === Infinity && filters.value.maxPrice === undefined))
  )
}

const clearFilters = () => {
  filters.value = { sortBy: 'newest' }
  visibleCount.value = 12
}

const loadMoreProducts = () => {
  visibleCount.value += 12
}

const viewProduct = (product: Product) => {
  router.push(`/product/${product.slug}`)
}

const addToCart = (product: Product, quantity: number = 1) => {
  cartStore.addToCart(product, quantity)
}

// Watch for language changes to update SEO
watch(() => currentLanguage.value, () => {
  // Language changed, component will automatically update
})

// On mounted
onMounted(() => {
  // Load products if not already loaded
  if (productsStore.products.length === 0) {
    productsStore.fetchProducts()
  }
})
</script>

<style scoped>
/* Custom scrollbar for brands list */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #b8941f;
}
</style>