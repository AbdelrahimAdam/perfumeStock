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
      :image="productImage"
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
          v-if="brandSlug"
          :to="`/brand/${brandSlug}`" 
          class="hover:text-primary-600 transition-colors"
        >
          {{ brandName }}
        </router-link>
        <span v-else class="text-gray-500">
          {{ brandName }}
        </span>
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
              :src="productImage" 
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
              {{ brandName }}
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
              {{ t('currencyLE') }} {{ product.price.toFixed(2) }}
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
              {{ productRating }} • {{ product.reviewCount || 0 }} {{ t('reviews') }}
            </span>
          </div>

          <!-- Description -->
          <div class="prose max-w-none mb-8">
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">
              {{ product.description[currentLanguage] }}
            </p>
          </div>

          <!-- Fragrance Notes -->
          <div class="mb-8" v-if="hasFragranceNotes">
            <h3 class="text-xl font-display-en font-bold mb-4">
              {{ t('Fragrance Notes') }}
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-gray-50 rounded-xl p-5" v-if="product.notes?.top?.length">
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
              <div class="bg-gray-50 rounded-xl p-5" v-if="product.notes?.heart?.length">
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
              <div class="bg-gray-50 rounded-xl p-5" v-if="product.notes?.base?.length">
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
                :disabled="!product.isActive"
              >
                <template v-if="!product.isActive">
                  {{ t('Out of Stock') }}
                </template>
                <template v-else>
                  {{ t('Add to Cart') }} • {{ t('currencyLE') }} {{ (product.price * quantity).toFixed(2) }}
                </template>
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
import { useBrandsStore } from '@/stores/brands'
import ProductGrid from '@/components/Products/ProductGrid.vue'
import LoadingSpinner from '@/components/UI/LoadingSpinner.vue'
import SEOHead from '@/components/UI/SEOHead.vue'
import type { Product } from '@/types'

const route = useRoute()
const router = useRouter()
const languageStore = useLanguageStore()
const productsStore = useProductsStore()
const cartStore = useCartStore()
const brandsStore = useBrandsStore()

const { currentLanguage, isRTL, t } = languageStore

const product = ref<Product | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const quantity = ref(1)
const selectedImage = ref('')
const brandDetails = ref<any>(null)

// Computed properties
const productImage = computed(() => {
  return selectedImage.value || product.value?.imageUrl || ''
})

const productImages = computed(() => {
  if (!product.value) return []
  
  // Start with main image
  const images = [product.value.imageUrl || '']
  
  // Add additional images if available
  if (product.value.images && Array.isArray(product.value.images)) {
    product.value.images.forEach(img => {
      if (img && !images.includes(img)) {
        images.push(img)
      }
    })
  }
  
  return images.filter(Boolean)
})

const productDescription = computed(() => {
  if (!product.value) return ''
  const desc = product.value.description?.[currentLanguage] || ''
  return desc.length > 160 ? desc.substring(0, 160) + '...' : desc
})

const isNewArrival = computed(() => {
  if (!product.value?.isNew) return false
  return product.value.isNew
})

const productRating = computed(() => {
  if (!product.value?.rating) return '0.0'
  return typeof product.value.rating === 'number' ? product.value.rating.toFixed(1) : '0.0'
})

const hasFragranceNotes = computed(() => {
  if (!product.value?.notes) return false
  const notes = product.value.notes
  return (notes.top && notes.top.length > 0) || 
         (notes.heart && notes.heart.length > 0) || 
         (notes.base && notes.base.length > 0)
})

const brandSlug = computed(() => {
  return product.value?.brandSlug || product.value?.brand || ''
})

const brandName = computed(() => {
  if (brandDetails.value) {
    return brandDetails.value.name
  }
  
  if (product.value?.brandName) {
    return product.value.brandName
  }
  
  // Fallback to slug if no name available
  return brandSlug.value
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
})

const relatedProducts = computed(() => {
  if (!product.value) return []
  
  // Get products from the same brand
  const sameBrandProducts = productsStore.products.filter(p => 
    p.id !== product.value?.id && 
    p.brandSlug === product.value?.brandSlug &&
    p.isActive
  )
  
  // If not enough products from same brand, add similar category products
  if (sameBrandProducts.length < 4) {
    const similarCategoryProducts = productsStore.products.filter(p => 
      p.id !== product.value?.id && 
      p.category === product.value?.category &&
      p.isActive &&
      !sameBrandProducts.find(sp => sp.id === p.id)
    )
    
    return [...sameBrandProducts, ...similarCategoryProducts].slice(0, 4)
  }
  
  return sameBrandProducts.slice(0, 4)
})

// Methods
const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const increaseQuantity = () => {
  quantity.value++
}

const addToCart = async () => {
  if (product.value && product.value.isActive) {
    try {
      await cartStore.addToCart(product.value, quantity.value)
      
      // Show success notification (you can implement a toast notification here)
      console.log('Added to cart:', product.value.name[currentLanguage])
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
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

const loadBrandDetails = async () => {
  if (!brandSlug.value) return
  
  try {
    const brand = await brandsStore.getBrandBySlug(brandSlug.value)
    if (brand) {
      brandDetails.value = brand
    }
  } catch (error) {
    console.error('Failed to load brand details:', error)
  }
}

// Watch for route changes
watch(
  () => route.params.slug,
  async (newSlug) => {
    if (newSlug) {
      loading.value = true
      error.value = null
      
      try {
        // Fetch product by slug from Firebase
        const fetchedProduct = await productsStore.fetchProductBySlug(newSlug as string)
        
        if (!fetchedProduct) {
          error.value = t('Product not found')
          product.value = null
        } else {
          product.value = fetchedProduct
          selectedImage.value = product.value.imageUrl || ''
          quantity.value = 1
          
          // Load brand details
          await loadBrandDetails()
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
onMounted(async () => {
  // Make sure products are loaded (for related products)
  if (productsStore.products.length === 0) {
    await productsStore.fetchProducts()
  }
  
  // Make sure brands are loaded
  if (brandsStore.brands.length === 0) {
    await brandsStore.loadBrands()
  }
})
</script>

<style scoped>
/* Custom styles */
.shadow-luxury-lg {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
}

.shadow-gold-lg {
  box-shadow: 0 10px 40px rgba(245, 158, 11, 0.3);
}

.font-display-en {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .sticky {
    position: relative;
    top: 0;
  }
}

/* Loading animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

div[class*="bg-gradient"] {
  animation: fadeIn 0.5s ease-out;
}

/* Custom scrollbar for thumbnails */
.overflow-x-auto::-webkit-scrollbar {
  height: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 10px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>