<template>
  <div v-if="loading" class="min-h-screen flex items-center justify-center">
    <LoadingSpinner size="lg" />
  </div>

  <div v-else-if="error" class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <p class="text-gray-600 mb-4">{{ error }}</p>
      <router-link to="/" class="text-primary-600 hover:underline">
        {{ t('Back to Home') }}
      </router-link>
    </div>
  </div>

  <div v-else-if="product" class="min-h-screen bg-white">
    <SEOHead 
      :title="product.name[currentLanguage]"
      :description="productDescription"
      :image="product.imageUrl"
      type="product"
    />

    <!-- Breadcrumb -->
    <div class="container mx-auto px-4 pt-8">
      <nav class="flex items-center text-sm text-gray-600 mb-8" 
           :class="{ 'flex-row-reverse': isRTL }">
        <router-link to="/" class="hover:text-primary-600 transition-colors">
          {{ t('Home') }}
        </router-link>
        <span class="mx-3">/</span>
        <router-link 
          :to="`/brand/${product.brand}`" 
          class="hover:text-primary-600 transition-colors"
        >
          {{ getBrandName(product.brand) }}
        </router-link>
        <span class="mx-3">/</span>
        <span class="text-gray-900 font-medium">{{ product.name[currentLanguage] }}</span>
      </nav>
    </div>

    <!-- Product Details -->
    <div class="container mx-auto px-4 pb-20">
      <div class="grid lg:grid-cols-2 gap-12 lg:gap-20">
        <!-- Image Gallery -->
        <div class="sticky top-24">
          <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl overflow-hidden 
                      shadow-luxury-lg">
            <img 
              :src="product.imageUrl" 
              :alt="product.name[currentLanguage]"
              class="w-full h-auto object-cover"
              loading="eager"
            />
          </div>
          
          <!-- Thumbnails (if available) -->
          <div v-if="productImages.length > 1" class="flex gap-4 mt-6 overflow-x-auto">
            <button
              v-for="(img, index) in productImages"
              :key="index"
              @click="selectedImage = img"
              :class="[
                'flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2',
                selectedImage === img 
                  ? 'border-primary-500' 
                  : 'border-transparent hover:border-gray-300'
              ]"
            >
              <img 
                :src="img" 
                :alt="`${product.name[currentLanguage]} - ${index + 1}`"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>

        <!-- Product Info -->
        <div :class="{ 'text-right': isRTL }">
          <!-- Brand & Badges -->
          <div class="flex items-center gap-3 mb-6" :class="{ 'flex-row-reverse': isRTL }">
            <span class="px-4 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm font-medium">
              {{ getBrandName(product.brand) }}
            </span>
            <span 
              v-if="product.isBestSeller"
              class="px-4 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium"
            >
              {{ t('Best Seller') }}
            </span>
            <span 
              v-if="isNewArrival"
              class="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
            >
              {{ t('New Arrival') }}
            </span>
          </div>

          <!-- Product Name -->
          <h1 class="text-4xl lg:text-5xl font-display-en font-bold text-gray-900 mb-4">
            {{ product.name[currentLanguage] }}
          </h1>

          <!-- Price -->
          <div class="flex items-center gap-4 mb-6">
            <span class="text-3xl font-bold text-primary-600">
              ${{ product.price.toFixed(2) }}
            </span>
            <span class="text-gray-500 text-lg">
              {{ product.size }} • {{ product.concentration }}
            </span>
          </div>

          <!-- Rating -->
          <div class="flex items-center gap-2 mb-8">
            <div class="flex text-yellow-400">
              <svg v-for="i in 5" :key="i" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </div>
            <span class="text-gray-600">
              {{ product.rating.toFixed(1) }} • {{ product.reviewCount }} {{ t('reviews') }}
            </span>
          </div>

          <!-- Description -->
          <div class="prose max-w-none mb-8">
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">
              {{ product.description[currentLanguage] }}
            </p>
          </div>

          <!-- Fragrance Notes -->
          <div class="mb-8">
            <h3 class="text-xl font-display-en font-bold mb-4">
              {{ t('Fragrance Notes') }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-gray-50 rounded-xl p-5">
                <div class="text-primary-600 font-bold mb-2 flex items-center gap-2">
                  <span class="w-2 h-2 bg-primary-500 rounded-full"></span>
                  {{ t('Top Notes') }}
                </div>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="note in product.notes.top" 
                    :key="note"
                    class="px-3 py-1 bg-white text-gray-700 rounded-full text-sm"
                  >
                    {{ note }}
                  </span>
                </div>
              </div>
              <div class="bg-gray-50 rounded-xl p-5">
                <div class="text-primary-600 font-bold mb-2 flex items-center gap-2">
                  <span class="w-2 h-2 bg-primary-500 rounded-full"></span>
                  {{ t('Heart Notes') }}
                </div>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="note in product.notes.heart" 
                    :key="note"
                    class="px-3 py-1 bg-white text-gray-700 rounded-full text-sm"
                  >
                    {{ note }}
                  </span>
                </div>
              </div>
              <div class="bg-gray-50 rounded-xl p-5">
                <div class="text-primary-600 font-bold mb-2 flex items-center gap-2">
                  <span class="w-2 h-2 bg-primary-500 rounded-full"></span>
                  {{ t('Base Notes') }}
                </div>
                <div class="flex flex-wrap gap-2">
                  <span 
                    v-for="note in product.notes.base" 
                    :key="note"
                    class="px-3 py-1 bg-white text-gray-700 rounded-full text-sm"
                  >
                    {{ note }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Add to Cart -->
          <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
            <div class="mb-6">
              <label class="block text-sm font-medium text-gray-700 mb-3">
                {{ t('Quantity') }}
              </label>
              <div class="flex items-center gap-4 max-w-xs">
                <button
                  @click="decreaseQuantity"
                  :disabled="quantity <= 1"
                  class="w-12 h-12 rounded-full bg-white border border-gray-300 
                         flex items-center justify-center hover:border-primary-500 
                         disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="text-xl">-</span>
                </button>
                <span class="text-2xl font-bold w-12 text-center">{{ quantity }}</span>
                <button
                  @click="increaseQuantity"
                  class="w-12 h-12 rounded-full bg-white border border-gray-300 
                         flex items-center justify-center hover:border-primary-500"
                >
                  <span class="text-xl">+</span>
                </button>
              </div>
            </div>

            <div class="space-y-4">
              <button
                @click="addToCart"
                class="w-full bg-primary-500 text-white py-4 rounded-xl font-bold 
                       hover:bg-primary-600 transition-all duration-300 transform 
                       hover:-translate-y-0.5 shadow-gold-lg"
              >
                {{ t('Add to Cart') }} • ${{ (product.price * quantity).toFixed(2) }}
              </button>
              
              <button
                @click="addToWishlist"
                class="w-full border-2 border-gray-300 text-gray-700 py-4 rounded-xl 
                       font-bold hover:border-primary-500 hover:text-primary-600 
                       transition-colors"
              >
                {{ t('Add to Wishlist') }}
              </button>
            </div>

            <!-- Shipping Info -->
            <div class="mt-6 pt-6 border-t border-gray-200">
              <div class="flex items-start gap-3" :class="{ 'flex-row-reverse': isRTL }">
                <svg class="w-5 h-5 text-primary-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M5 13l4 4L19 7"/>
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ t('Free Shipping') }}</p>
                  <p class="text-sm text-gray-600">
                    {{ t('Free shipping on orders over $200') }}
                  </p>
                </div>
              </div>
              <div class="flex items-start gap-3 mt-3" :class="{ 'flex-row-reverse': isRTL }">
                <svg class="w-5 h-5 text-primary-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M5 13l4 4L19 7"/>
                </svg>
                <div>
                  <p class="text-sm font-medium text-gray-900">{{ t('Easy Returns') }}</p>
                  <p class="text-sm text-gray-600">
                    {{ t('30-day return policy') }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      <div v-if="relatedProducts.length > 0" class="mt-20">
        <h2 class="text-3xl font-display-en font-bold mb-8">
          {{ t('You May Also Like') }}
        </h2>
        <ProductGrid 
          :products="relatedProducts" 
          @view-product="viewProduct"
          @add-to-cart="addToCart"
        />
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
const { getProductById } = productsStore

const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const quantity = ref(1)
const selectedImage = ref('')

// Computed properties
const productImages = computed(() => {
  if (!product.value) return []
  // Use images array if available, otherwise use single imageUrl
  return product.value.images && product.value.images.length > 0 
    ? product.value.images 
    : [product.value.imageUrl]
})

const productDescription = computed(() => {
  if (!product.value) return ''
  const desc = product.value.description[currentLanguage]
  return desc.length > 160 ? desc.substring(0, 160) + '...' : desc
})

const isNewArrival = computed(() => {
  if (!product.value?.createdAt) return false
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  // Handle both timestamp formats
  const productDate = product.value.createdAt.seconds 
    ? new Date(product.value.createdAt.seconds * 1000)
    : new Date(product.value.createdAt)
  return productDate > oneMonthAgo
})

const relatedProducts = computed(() => {
  if (!product.value || !productsStore.products.length) return []
  
  return productsStore.products
    .filter(p => 
      p.id !== product.value!.id && 
      (p.brand === product.value!.brand || p.category === product.value!.category)
    )
    .slice(0, 4)
})

// Brand data for display
const brands = [
  { slug: 'dior', name: { en: 'Dior', ar: 'ديور' } },
  { slug: 'chanel', name: { en: 'Chanel', ar: 'شانيل' } },
  { slug: 'tom-ford', name: { en: 'Tom Ford', ar: 'توم فورد' } },
  { slug: 'gucci', name: { en: 'Gucci', ar: 'غوتشي' } },
  { slug: 'versace', name: { en: 'Versace', ar: 'فيرساتشي' } },
  { slug: 'yves-saint-laurent', name: { en: 'Yves Saint Laurent', ar: 'ايف سان لوران' } },
  { slug: 'saint-laurent', name: { en: 'Saint Laurent', ar: 'سان لوران' } }
]

// Methods
const getBrandName = (brandSlug: string) => {
  const brand = brands.find(b => b.slug === brandSlug)
  return brand ? brand.name[currentLanguage] : brandSlug
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increaseQuantity = () => {
  quantity.value++
}

const addToCart = () => {
  if (product.value) {
    cartStore.addToCart(product.value, quantity.value)
  }
}

const addToWishlist = () => {
  if (product.value) {
    console.log('Added to wishlist:', product.value.name[currentLanguage])
    // TODO: Implement wishlist functionality
  }
}

const viewProduct = (relatedProduct: Product) => {
  router.push(`/product/${relatedProduct.slug}`)
}

// Watch for route changes
watch(
  () => route.params.slug,
  async (newSlug) => {
    if (newSlug) {
      loading.value = true
      error.value = null
      
      try {
        // Make sure products are loaded
        if (productsStore.products.length === 0) {
          await productsStore.fetchProducts()
        }
        
        // Find product by slug
        const foundProduct = productsStore.products.find(p => p.slug === newSlug)
        
        if (!foundProduct) {
          error.value = t('Product not found')
          product.value = null
        } else {
          product.value = foundProduct
          selectedImage.value = product.value.imageUrl
          quantity.value = 1
        }
      } catch (err: any) {
        error.value = err.message || t('Failed to load product')
        product.value = null
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
/* Custom styles if needed */
</style>