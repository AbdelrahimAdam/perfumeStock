<!-- src/pages/WishlistPage.vue -->
<template>
  <div class="wishlist-page">
    <!-- Header -->
    <div class="bg-gradient-to-r from-pink-900 to-purple-700 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-2xl sm:text-3xl font-bold">{{ t('My Wishlist') }}</h1>
        <p class="mt-2 text-pink-100">{{ t('Save your favorite perfumes for later') }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
        <p class="mt-4 text-gray-600">{{ t('Loading your wishlist...') }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="wishlistItems.length === 0" class="text-center py-12">
        <div class="mx-auto h-24 w-24 text-pink-400 mb-6">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('Your wishlist is empty') }}</h3>
        <p class="text-gray-500 mb-6">{{ t('Add perfumes you love to your wishlist') }}</p>
        <router-link
          to="/shop"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600"
        >
          <svg class="mr-2 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
          {{ t('Browse Perfumes') }}
        </router-link>
      </div>

      <!-- Wishlist Content -->
      <div v-else>
        <!-- Wishlist Stats -->
        <div class="mb-8">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="bg-white rounded-lg p-4 shadow border">
              <p class="text-sm text-gray-500">{{ t('Total Items') }}</p>
              <p class="text-2xl font-bold text-gray-900">{{ wishlistItems.length }}</p>
            </div>
            <div class="bg-white rounded-lg p-4 shadow border">
              <p class="text-sm text-gray-500">{{ t('Total Value') }}</p>
              <p class="text-2xl font-bold text-pink-600">{{ formatCurrency(totalValue) }} EGP</p>
            </div>
            <div class="bg-white rounded-lg p-4 shadow border">
              <p class="text-sm text-gray-500">{{ t('In Stock') }}</p>
              <p class="text-2xl font-bold text-green-600">{{ inStockCount }}</p>
            </div>
            <div class="bg-white rounded-lg p-4 shadow border">
              <p class="text-sm text-gray-500">{{ t('Low Stock') }}</p>
              <p class="text-2xl font-bold text-yellow-600">{{ lowStockCount }}</p>
            </div>
          </div>
        </div>

        <!-- Action Bar -->
        <div class="mb-6 bg-white rounded-lg shadow border p-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between">
            <div class="flex items-center space-x-4 mb-4 sm:mb-0">
              <!-- Select All -->
              <div class="flex items-center">
                <input
                  id="select-all"
                  type="checkbox"
                  v-model="selectAll"
                  @change="toggleSelectAll"
                  class="h-4 w-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
                <label for="select-all" class="ml-2 text-sm text-gray-700">
                  {{ t('Select All') }}
                </label>
              </div>

              <!-- Selected Actions -->
              <div v-if="selectedItems.length > 0" class="flex items-center space-x-3">
                <span class="text-sm text-gray-500">
                  {{ selectedItems.length }} {{ t('selected') }}
                </span>
                <button
                  @click="moveSelectedToCart"
                  class="text-sm px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600"
                >
                  {{ t('Add to Cart') }}
                </button>
                <button
                  @click="removeSelected"
                  class="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  {{ t('Remove') }}
                </button>
              </div>
            </div>

            <!-- Sort Options -->
            <div class="flex items-center space-x-4">
              <label class="text-sm text-gray-500">{{ t('Sort by:') }}</label>
              <select
                v-model="sortBy"
                class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
              >
                <option value="dateAdded">{{ t('Date Added') }}</option>
                <option value="priceLow">{{ t('Price: Low to High') }}</option>
                <option value="priceHigh">{{ t('Price: High to Low') }}</option>
                <option value="name">{{ t('Name A-Z') }}</option>
                <option value="brand">{{ t('Brand') }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Wishlist Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="item in sortedItems"
            :key="item.id"
            class="bg-white rounded-lg shadow border overflow-hidden hover:shadow-lg transition-shadow"
          >
            <!-- Product Image -->
            <div class="relative">
              <router-link :to="`/product/${item.slug}`">
                <img
                  :src="item.image"
                  :alt="item.name"
                  class="w-full h-48 object-cover"
                />
              </router-link>
              
              <!-- Wishlist Button -->
              <button
                @click="removeFromWishlist(item.id)"
                class="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                :title="t('Remove from wishlist')"
              >
                <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" 
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" 
                        clip-rule="evenodd"/>
                </svg>
              </button>

              <!-- Stock Status -->
              <div v-if="item.stockStatus" class="absolute top-3 left-3">
                <span :class="[
                  'px-2 py-1 rounded-full text-xs font-medium',
                  item.stockStatus === 'in_stock' ? 'bg-green-100 text-green-800' :
                  item.stockStatus === 'low_stock' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                ]">
                  {{ getStockText(item.stockStatus) }}
                </span>
              </div>

              <!-- Select Checkbox -->
              <div class="absolute top-3 left-12">
                <input
                  type="checkbox"
                  :id="`select-${item.id}`"
                  v-model="selectedItems"
                  :value="item.id"
                  class="h-5 w-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                />
              </div>
            </div>

            <!-- Product Info -->
            <div class="p-4">
              <div class="flex justify-between items-start">
                <div class="flex-1 min-w-0">
                  <router-link 
                    :to="`/product/${item.slug}`"
                    class="text-sm font-medium text-gray-900 hover:text-pink-600 truncate block"
                  >
                    {{ item.name }}
                  </router-link>
                  <p class="text-sm text-gray-500 mt-1">{{ item.brand }}</p>
                  <p class="text-sm text-gray-500 mt-1">{{ item.size }} • {{ item.concentration }}</p>
                </div>
                
                <div class="ml-2 flex-shrink-0">
                  <button
                    @click="toggleNotes(item.id)"
                    class="p-1 text-gray-400 hover:text-gray-600"
                    :title="t('View notes')"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Price -->
              <div class="mt-3 flex items-center justify-between">
                <div>
                  <p class="text-lg font-bold text-gray-900">{{ formatCurrency(item.price) }} EGP</p>
                  <p v-if="item.originalPrice && item.originalPrice > item.price" class="text-sm text-gray-500 line-through">
                    {{ formatCurrency(item.originalPrice) }} EGP
                  </p>
                </div>
                
                <!-- Add to Cart Button -->
                <button
                  @click="addToCart(item)"
                  :disabled="item.stockStatus === 'out_of_stock'"
                  :class="[
                    'px-4 py-2 rounded-md text-sm font-medium',
                    item.stockStatus === 'out_of_stock'
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-pink-500 text-white hover:bg-pink-600'
                  ]"
                >
                  <svg class="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  {{ t('Add to Cart') }}
                </button>
              </div>

              <!-- Fragrance Notes (Collapsible) -->
              <div v-if="expandedItems.includes(item.id)" class="mt-4 pt-4 border-t border-gray-200">
                <h4 class="text-sm font-medium text-gray-900 mb-2">{{ t('Fragrance Notes') }}</h4>
                <div class="space-y-2">
                  <div v-if="item.notes?.top?.length">
                    <p class="text-xs text-gray-500">{{ t('Top Notes') }}</p>
                    <p class="text-sm">{{ item.notes.top.join(', ') }}</p>
                  </div>
                  <div v-if="item.notes?.heart?.length">
                    <p class="text-xs text-gray-500">{{ t('Heart Notes') }}</p>
                    <p class="text-sm">{{ item.notes.heart.join(', ') }}</p>
                  </div>
                  <div v-if="item.notes?.base?.length">
                    <p class="text-xs text-gray-500">{{ t('Base Notes') }}</p>
                    <p class="text-sm">{{ item.notes.base.join(', ') }}</p>
                  </div>
                </div>
              </div>

              <!-- Date Added -->
              <div class="mt-4 pt-4 border-t border-gray-100">
                <p class="text-xs text-gray-500">
                  {{ t('Added on') }} {{ formatDate(item.dateAdded) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Share Wishlist -->
        <div class="mt-8 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-200">
          <div class="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ t('Share Your Wishlist') }}</h3>
              <p class="mt-1 text-sm text-gray-600">{{ t('Let friends and family know what you love') }}</p>
            </div>
            <div class="mt-4 md:mt-0 flex space-x-3">
              <button
                @click="shareWishlist"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-500 hover:bg-pink-600"
              >
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                </svg>
                {{ t('Share') }}
              </button>
              <button
                @click="printWishlist"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
                {{ t('Print') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Share Modal -->
    <div v-if="showShareModal" class="fixed inset-0 overflow-hidden z-50">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="showShareModal = false"></div>
        <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div class="relative w-screen max-w-md">
            <div class="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <div class="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div class="flex items-start justify-between">
                  <h2 class="text-lg font-medium text-gray-900">{{ t('Share Wishlist') }}</h2>
                  <button
                    @click="showShareModal = false"
                    class="ml-3 h-7 w-7 rounded-full bg-white text-gray-400 hover:text-gray-500"
                  >
                    <span class="sr-only">{{ t('Close panel') }}</span>
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>

                <div class="mt-8">
                  <!-- Share Link -->
                  <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ t('Shareable Link') }}
                    </label>
                    <div class="flex rounded-md shadow-sm">
                      <input
                        type="text"
                        readonly
                        :value="shareableLink"
                        class="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md border border-gray-300 focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                      />
                      <button
                        @click="copyLink"
                        class="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                      >
                        {{ t('Copy') }}
                      </button>
                    </div>
                    <p class="mt-2 text-xs text-gray-500">
                      {{ t('Anyone with this link can view your wishlist') }}
                    </p>
                  </div>

                  <!-- Social Sharing -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-3">
                      {{ t('Share on Social Media') }}
                    </label>
                    <div class="grid grid-cols-2 gap-3">
                      <button
                        @click="shareOnSocial('facebook')"
                        class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                      >
                        <svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"/>
                        </svg>
                        Facebook
                      </button>
                      <button
                        @click="shareOnSocial('twitter')"
                        class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-sky-500 hover:bg-sky-600"
                      >
                        <svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                        </svg>
                        Twitter
                      </button>
                      <button
                        @click="shareOnSocial('whatsapp')"
                        class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-600"
                      >
                        <svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.76.982.998-3.675-.236-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.9 6.994c-.004 5.45-4.438 9.88-9.888 9.88m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.333.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.333 11.893-11.893 0-3.18-1.24-6.162-3.495-8.411"/>
                        </svg>
                        WhatsApp
                      </button>
                      <button
                        @click="shareOnSocial('email')"
                        class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-800"
                      >
                        <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        Email
                      </button>
                    </div>
                  </div>

                  <!-- Privacy Settings -->
                  <div class="mt-8 pt-6 border-t border-gray-200">
                    <div class="flex items-center justify-between">
                      <div>
                        <h4 class="text-sm font-medium text-gray-900">{{ t('Privacy Settings') }}</h4>
                        <p class="text-xs text-gray-500 mt-1">{{ t('Control who can see your wishlist') }}</p>
                      </div>
                      <select
                        v-model="privacySetting"
                        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm rounded-md"
                      >
                        <option value="private">{{ t('Private (Only Me)') }}</option>
                        <option value="shared">{{ t('Shared with Link') }}</option>
                        <option value="public">{{ t('Public') }}</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useRouter } from 'vue-router'

const languageStore = useLanguageStore()
const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const { t } = languageStore

// State
const isLoading = ref(true)
const wishlistItems = ref<any[]>([])
const selectedItems = ref<string[]>([])
const expandedItems = ref<string[]>([])
const selectAll = ref(false)
const sortBy = ref('dateAdded')
const showShareModal = ref(false)
const shareableLink = ref('')
const privacySetting = ref('private')

// Computed
const totalValue = computed(() => {
  return wishlistItems.value.reduce((sum, item) => sum + item.price, 0)
})

const inStockCount = computed(() => {
  return wishlistItems.value.filter(item => item.stockStatus === 'in_stock').length
})

const lowStockCount = computed(() => {
  return wishlistItems.value.filter(item => item.stockStatus === 'low_stock').length
})

const sortedItems = computed(() => {
  const items = [...wishlistItems.value]
  
  switch (sortBy.value) {
    case 'priceLow':
      return items.sort((a, b) => a.price - b.price)
    case 'priceHigh':
      return items.sort((a, b) => b.price - a.price)
    case 'name':
      return items.sort((a, b) => a.name.localeCompare(b.name))
    case 'brand':
      return items.sort((a, b) => a.brand.localeCompare(b.brand))
    case 'dateAdded':
    default:
      return items.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
  }
})

// Methods
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-EG').format(amount)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStockText = (status: string) => {
  const texts: Record<string, string> = {
    in_stock: t('In Stock'),
    low_stock: t('Low Stock'),
    out_of_stock: t('Out of Stock')
  }
  return texts[status] || status
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedItems.value = wishlistItems.value.map(item => item.id)
  } else {
    selectedItems.value = []
  }
}

const toggleNotes = (itemId: string) => {
  const index = expandedItems.value.indexOf(itemId)
  if (index > -1) {
    expandedItems.value.splice(index, 1)
  } else {
    expandedItems.value.push(itemId)
  }
}

const addToCart = (item: any) => {
  if (item.stockStatus === 'out_of_stock') {
    alert(t('This item is out of stock'))
    return
  }

  cartStore.addToCart({
    id: item.id,
    name: item.name,
    price: item.price,
    image: item.image,
    quantity: 1,
    variant: item.size
  })

  // Show success notification (you can integrate with your notification system)
  alert(`${item.name} ${t('added to cart')}`)
}

const removeFromWishlist = (itemId: string) => {
  const index = wishlistItems.value.findIndex(item => item.id === itemId)
  if (index !== -1) {
    wishlistItems.value.splice(index, 1)
    
    // Remove from selected items if present
    const selectedIndex = selectedItems.value.indexOf(itemId)
    if (selectedIndex > -1) {
      selectedItems.value.splice(selectedIndex, 1)
    }
  }
}

const moveSelectedToCart = () => {
  selectedItems.value.forEach(itemId => {
    const item = wishlistItems.value.find(i => i.id === itemId)
    if (item && item.stockStatus !== 'out_of_stock') {
      addToCart(item)
    }
  })
  
  // Clear selection
  selectedItems.value = []
  selectAll.value = false
}

const removeSelected = () => {
  if (confirm(t('Are you sure you want to remove selected items?'))) {
    wishlistItems.value = wishlistItems.value.filter(item => 
      !selectedItems.value.includes(item.id)
    )
    selectedItems.value = []
    selectAll.value = false
  }
}

const shareWishlist = () => {
  if (!authStore.isAuthenticated) {
    router.push('/login?redirect=/wishlist')
    return
  }
  
  // Generate shareable link
  shareableLink.value = `${window.location.origin}/wishlist/share/${authStore.user?.uid}`
  showShareModal.value = true
}

const printWishlist = () => {
  window.print()
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareableLink.value)
    alert(t('Link copied to clipboard!'))
  } catch (err) {
    console.error('Failed to copy link:', err)
  }
}

const shareOnSocial = (platform: string) => {
  const text = t('Check out my perfume wishlist!')
  const url = shareableLink.value
  
  let shareUrl = ''
  
  switch (platform) {
    case 'facebook':
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
      break
    case 'twitter':
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
      break
    case 'whatsapp':
      shareUrl = `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`
      break
    case 'email':
      shareUrl = `mailto:?subject=${encodeURIComponent(t('My Perfume Wishlist'))}&body=${encodeURIComponent(`${text}\n\n${url}`)}`
      break
  }
  
  if (shareUrl) {
    window.open(shareUrl, '_blank', 'noopener,noreferrer')
  }
}

const loadWishlist = async () => {
  isLoading.value = true
  try {
    // In production: Fetch wishlist from Firebase
    // Mock data for demonstration
    wishlistItems.value = [
      {
        id: '1',
        name: 'Tom Ford Noir Extreme',
        brand: 'Tom Ford',
        size: '100ml',
        concentration: 'Eau de Parfum',
        price: 450,
        originalPrice: 500,
        image: '/images/GURLAND.png',
        slug: 'tom-ford-noir-extreme',
        stockStatus: 'in_stock',
        dateAdded: '2024-01-15',
        notes: {
          top: ['Cardamom', 'Mandarin'],
          heart: ['Nutmeg', 'Saffron', 'Jasmine'],
          base: ['Vanilla', 'Sandalwood', 'Amber']
        }
      },
      {
        id: '2',
        name: 'YSL Black Opium',
        brand: 'Yves Saint Laurent',
        size: '90ml',
        concentration: 'Eau de Parfum',
        price: 380,
        image: '/images/santlaurent.jpg',
        slug: 'ysl-black-opium',
        stockStatus: 'low_stock',
        dateAdded: '2024-01-10',
        notes: {
          top: ['Pink Pepper', 'Orange Blossom'],
          heart: ['Coffee', 'Jasmine'],
          base: ['Vanilla', 'Patchouli', 'Cedar']
        }
      },
      {
        id: '3',
        name: 'Chanel Coco Mademoiselle',
        brand: 'Chanel',
        size: '50ml',
        concentration: 'Eau de Parfum',
        price: 600,
        image: '/images/chanceshaneal.jpeg',
        slug: 'chanel-coco-mademoiselle',
        stockStatus: 'in_stock',
        dateAdded: '2024-01-05',
        notes: {
          top: ['Orange', 'Mandarin', 'Bergamot'],
          heart: ['Jasmine', 'Rose', 'Mimosa'],
          base: ['Patchouli', 'Vetiver', 'Vanilla']
        }
      },
      {
        id: '4',
        name: 'Dior Sauvage Elixir',
        brand: 'Dior',
        size: '60ml',
        concentration: 'Eau de Parfum',
        price: 550,
        image: '/images/DIOUR.jpg',
        slug: 'dior-sauvage-elixir',
        stockStatus: 'out_of_stock',
        dateAdded: '2024-01-01',
        notes: {
          top: ['Grapefruit', 'Cinnamon'],
          heart: ['Lavender', 'Licorice'],
          base: ['Amber', 'Sandalwood', 'Patchouli']
        }
      }
    ]
  } catch (error) {
    console.error('Error loading wishlist:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    loadWishlist()
  }
})

// Watch for changes in selected items
watch(selectedItems, (newVal) => {
  selectAll.value = newVal.length === wishlistItems.value.length && wishlistItems.value.length > 0
})
</script>

<style scoped>
.wishlist-page {
  min-height: calc(100vh - 200px);
}

/* Custom scrollbar */
.overflow-y-scroll::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-scroll::-webkit-scrollbar-thumb {
  background: #ec4899;
  border-radius: 4px;
}

.overflow-y-scroll::-webkit-scrollbar-thumb:hover {
  background: #db2777;
}

/* Animation for modal */
.fixed {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Print styles */
@media print {
  .wishlist-page {
    background: white !important;
  }
  
  .bg-gradient-to-r,
  button,
  .bg-white.shadow {
    background: white !important;
    box-shadow: none !important;
    border: 1px solid #ddd !important;
  }
  
  .text-white,
  .text-pink-100 {
    color: black !important;
  }
}
</style>