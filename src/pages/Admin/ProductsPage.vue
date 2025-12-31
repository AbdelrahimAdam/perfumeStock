<template>
  <div class="min-h-screen bg-gray-50">
    <AdminSidebar />

    <div class="lg:ml-64">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200">
        <div class="px-8 py-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 class="text-2xl font-display-en font-bold text-gray-900">
                {{ t('Products Management') }}
              </h1>
              <p class="text-gray-600 mt-1">
                {{ t('Manage your product catalog') }}
              </p>
            </div>
            <div class="flex items-center gap-4">
              <!-- Search -->
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="t('Search products...')"
                  class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg 
                         focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
                         w-full md:w-64"
                  :style="{ direction: isRTL ? 'rtl' : 'ltr' }"
                />
                <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                     :class="{ 'left-auto right-3': isRTL }"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              
              <!-- Add Product Button -->
              <router-link
                to="/admin/products/new"
                class="bg-primary-500 text-white px-6 py-2 rounded-lg font-medium 
                       hover:bg-primary-600 transition-colors flex items-center gap-2"
                :class="{ 'flex-row-reverse': isRTL }"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <span>{{ t('Add Product') }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="px-8 py-6">
        <div class="flex flex-wrap items-center gap-4 mb-6">
          <!-- Category Filter -->
          <select
            v-model="filters.category"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                   focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">{{ t('All Categories') }}</option>
            <option 
              v-for="category in categories" 
              :key="category.id" 
              :value="category.id"
            >
              {{ category[currentLanguage] }}
            </option>
          </select>

          <!-- Status Filter -->
          <select
            v-model="filters.status"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                   focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">{{ t('All Status') }}</option>
            <option value="best-seller">{{ t('Best Sellers') }}</option>
            <option value="new">{{ t('New Arrivals') }}</option>
          </select>

          <!-- Sort -->
          <select
            v-model="filters.sort"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                   focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="newest">{{ t('Newest First') }}</option>
            <option value="oldest">{{ t('Oldest First') }}</option>
            <option value="price-high">{{ t('Price: High to Low') }}</option>
            <option value="price-low">{{ t('Price: Low to High') }}</option>
            <option value="name">{{ t('Name A-Z') }}</option>
          </select>

          <!-- Clear Filters -->
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="px-4 py-2 text-gray-600 hover:text-primary-600"
          >
            {{ t('Clear Filters') }}
          </button>
        </div>

        <!-- Products Table -->
        <div class="bg-white rounded-xl shadow-luxury overflow-hidden">
          <!-- Loading State -->
          <div v-if="productsStore.isLoading" class="p-12 text-center">
            <LoadingSpinner size="lg" />
            <p class="text-gray-600 mt-4">{{ t('Loading products...') }}</p>
          </div>

          <!-- Error State -->
          <div v-else-if="productsStore.error" class="p-12 text-center">
            <div class="w-16 h-16 mx-auto mb-4 text-red-500">
              <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="text-gray-600 mb-4">{{ productsStore.error }}</p>
            <button
              @click="productsStore.fetchProducts()"
              class="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              {{ t('Try Again') }}
            </button>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredProducts.length === 0" class="p-12 text-center">
            <div class="w-16 h-16 mx-auto mb-4 text-gray-300">
              <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                      d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
              </svg>
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-2">
              {{ t('No products found') }}
            </h3>
            <p class="text-gray-600 mb-6">
              {{ t('Try adjusting your filters or add a new product') }}
            </p>
            <router-link
              to="/admin/products/new"
              class="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white 
                     rounded-lg font-medium hover:bg-primary-600 transition-colors"
              :class="{ 'flex-row-reverse': isRTL }"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
              <span>{{ t('Add First Product') }}</span>
            </router-link>
          </div>

          <!-- Products Table -->
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('Product') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('Category') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('Price') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('Status') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('Created') }}
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ t('Actions') }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="product in filteredProducts" 
                  :key="product.id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-12 w-12 flex-shrink-0">
                        <img 
                          :src="product.imageUrl" 
                          :alt="product.name[currentLanguage]"
                          class="h-12 w-12 rounded-lg object-cover"
                        />
                      </div>
                      <div class="ml-4" :class="{ 'mr-4': isRTL }">
                        <div class="text-sm font-medium text-gray-900">
                          {{ product.name[currentLanguage] }}
                        </div>
                        <div class="text-sm text-gray-500">
                          {{ product.size }} • {{ product.concentration }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold 
                                rounded-full bg-gray-100 text-gray-800">
                      {{ getCategoryName(product.category) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-bold text-gray-900">
                      ${{ product.price.toFixed(2) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      v-if="product.isBestSeller"
                      class="px-3 py-1 inline-flex text-xs leading-5 font-semibold 
                             rounded-full bg-emerald-100 text-emerald-800"
                    >
                      {{ t('Best Seller') }}
                    </span>
                    <span 
                      v-else-if="isNewArrival(product)"
                      class="px-3 py-1 inline-flex text-xs leading-5 font-semibold 
                             rounded-full bg-blue-100 text-blue-800"
                    >
                      {{ t('New') }}
                    </span>
                    <span v-else class="text-sm text-gray-500">
                      {{ t('Standard') }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(product.createdAt.toDate()) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center gap-3">
                      <router-link
                        :to="`/product/${product.slug}`"
                        target="_blank"
                        class="text-gray-600 hover:text-primary-600"
                        :title="t('View on site')"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      </router-link>
                      <router-link
                        :to="`/admin/products/edit/${product.id}`"
                        class="text-primary-600 hover:text-primary-700"
                        :title="t('Edit')"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </router-link>
                      <button
                        @click="confirmDelete(product)"
                        class="text-red-600 hover:text-red-800"
                        :title="t('Delete')"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="filteredProducts.length > 0" class="px-6 py-4 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700">
                {{ t('Showing') }} 
                <span class="font-medium">{{ filteredProducts.length }}</span>
                {{ t('of') }}
                <span class="font-medium">{{ products.length }}</span>
                {{ t('products') }}
              </div>
              <div class="flex items-center gap-2">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="px-3 py-1 border border-gray-300 rounded text-sm 
                         disabled:opacity-50 disabled:cursor-not-allowed 
                         hover:bg-gray-50"
                >
                  {{ t('Previous') }}
                </button>
                <span class="px-3 py-1 text-sm text-gray-700">
                  {{ currentPage }} / {{ totalPages }}
                </span>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-1 border border-gray-300 rounded text-sm 
                         disabled:opacity-50 disabled:cursor-not-allowed 
                         hover:bg-gray-50"
                >
                  {{ t('Next') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div 
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">
          {{ t('Delete Product') }}
        </h3>
        <p class="text-gray-600 mb-6">
          {{ t('Are you sure you want to delete') }} 
          "<span class="font-medium">{{ productToDelete?.name[currentLanguage] }}</span>"?
          {{ t('This action cannot be undone.') }}
        </p>
        <div class="flex justify-end gap-3">
          <button
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
                   hover:bg-gray-50 transition-colors"
          >
            {{ t('Cancel') }}
          </button>
          <button
            @click="deleteProduct"
            :disabled="deleting"
            class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium 
                   hover:bg-red-700 transition-colors disabled:opacity-50 
                   disabled:cursor-not-allowed"
          >
            <span v-if="!deleting">{{ t('Delete') }}</span>
            <span v-else class="flex items-center gap-2">
              <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              {{ t('Deleting...') }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { useProductsStore } from '@/stores/products'
import AdminSidebar from '@/components/Admin/AdminSidebar.vue'
import LoadingSpinner from '@/components/UI/LoadingSpinner.vue'
import type { Product } from '@/types'

const languageStore = useLanguageStore()
const productsStore = useProductsStore()

const { currentLanguage, isRTL, t, formatDate } = languageStore
const { products, categories, getCategoryById, removeProduct } = productsStore

// Filters & Search
const searchQuery = ref('')
const filters = ref({
  category: '',
  status: '',
  sort: 'newest'
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Delete Modal
const showDeleteModal = ref(false)
const productToDelete = ref<Product | null>(null)
const deleting = ref(false)

// Computed properties
const hasActiveFilters = computed(() => {
  return filters.value.category || filters.value.status || searchQuery.value
})

const filteredProducts = computed(() => {
  let filtered = [...products]

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product =>
      product.name[currentLanguage.value].toLowerCase().includes(query) ||
      product.description[currentLanguage.value].toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (filters.value.category) {
    filtered = filtered.filter(product => product.category === filters.value.category)
  }

  // Apply status filter
  if (filters.value.status === 'best-seller') {
    filtered = filtered.filter(product => product.isBestSeller)
  } else if (filters.value.status === 'new') {
    const oneMonthAgo = new Date()
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
    filtered = filtered.filter(product => product.createdAt?.toDate() > oneMonthAgo)
  }

  // Apply sorting
  switch (filters.value.sort) {
    case 'oldest':
      filtered.sort((a, b) => a.createdAt?.seconds - b.createdAt?.seconds)
      break
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'name':
      filtered.sort((a, b) => 
        a.name[currentLanguage.value].localeCompare(b.name[currentLanguage.value])
      )
      break
    default: // newest
      filtered.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds)
  }

  // Apply pagination
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(products.length / itemsPerPage)
})

// Methods
const getCategoryName = (categoryId: string) => {
  const category = getCategoryById.value(categoryId)
  return category ? category[currentLanguage.value] : categoryId
}

const isNewArrival = (product: Product) => {
  if (!product.createdAt) return false
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  return product.createdAt.toDate() > oneMonthAgo
}

const clearFilters = () => {
  searchQuery.value = ''
  filters.value = {
    category: '',
    status: '',
    sort: 'newest'
  }
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const confirmDelete = (product: Product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const deleteProduct = async () => {
  if (!productToDelete.value) return

  deleting.value = true
  try {
    await removeProduct(productToDelete.value.id)
    showDeleteModal.value = false
    productToDelete.value = null
  } catch (error) {
    console.error('Error deleting product:', error)
  } finally {
    deleting.value = false
  }
}

// Watch for filter changes
watch([searchQuery, filters], () => {
  currentPage.value = 1
})

// Initialize
onMounted(async () => {
  if (!products.length) {
    await productsStore.fetchProducts()
  }
})
</script>