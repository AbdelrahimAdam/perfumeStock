<template>
  <div>
    <!-- Header with Spark Plan Warning -->
    <div class="bg-white border-b border-gray-200">
      <div class="px-8 py-6">
        <!-- Spark Plan Warning -->
        <div class="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div class="flex items-start gap-3">
            <svg class="w-6 h-6 text-yellow-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            <div>
              <h3 class="font-semibold text-yellow-800 mb-1">Spark Plan Notice</h3>
              <p class="text-yellow-700 text-sm">
                You are on Firebase's free Spark Plan. Product data is read-only from Firebase. 
                Changes made here are saved locally only and will reset on refresh.
              </p>
              <p class="text-yellow-700 text-sm mt-1">
                <strong>To permanently manage products:</strong> 
                <a href="#export-section" class="underline hover:text-yellow-800">Export data</a> and 
                update in Firebase Console.
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl font-display-en font-bold text-gray-900">
              {{ t('Products Management') }}
            </h1>
            <p class="text-gray-600 mt-1">
              {{ t('Manage your product catalog') }}
              <span class="text-sm text-gray-400 ml-2">
                ({{ products.length }} products loaded)
              </span>
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

            <!-- Export Button -->
            <button
              @click="exportProducts"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
                     hover:bg-gray-50 transition-colors flex items-center gap-2"
              :class="{ 'flex-row-reverse': isRTL }"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
              </svg>
              <span>{{ t('Export') }}</span>
            </button>

            <!-- Refresh Button -->
            <button
              @click="refreshProducts"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg 
                     hover:bg-gray-50 transition-colors flex items-center gap-2"
              :class="{ 'flex-row-reverse': isRTL }"
              :disabled="productsStore.isLoading"
            >
              <svg class="w-5 h-5" :class="{ 'animate-spin': productsStore.isLoading }" 
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              <span>{{ t('Refresh') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Section (Hidden by default) -->
    <div v-if="showExportSection" id="export-section" class="px-8 py-4">
      <div class="bg-white rounded-xl shadow-luxury p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900">Export Products Data</h3>
          <button @click="showExportSection = false" class="text-gray-500 hover:text-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <p class="text-gray-600 mb-4">
          Export your product data as JSON to import into Firebase Console or other systems.
        </p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            @click="exportAsJSON"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div class="font-medium text-gray-900 mb-1">JSON Format</div>
            <div class="text-sm text-gray-500">For Firebase import/export</div>
          </button>
          <button
            @click="exportAsCSV"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div class="font-medium text-gray-900 mb-1">CSV Format</div>
            <div class="text-sm text-gray-500">For spreadsheets</div>
          </button>
          <button
            @click="copyToClipboard"
            class="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left"
          >
            <div class="font-medium text-gray-900 mb-1">Copy to Clipboard</div>
            <div class="text-sm text-gray-500">Quick sharing</div>
          </button>
        </div>
        <div v-if="exportMessage" class="mt-4 p-3 rounded-lg" :class="exportMessageClass">
          {{ exportMessage }}
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="px-8 py-6">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-luxury p-6">
          <div class="text-sm font-medium text-gray-500 mb-2">{{ t('Total Products') }}</div>
          <div class="text-2xl font-bold text-gray-900">{{ products.length }}</div>
          <div class="text-xs text-gray-500 mt-2">{{ t('Loaded from Firebase') }}</div>
        </div>
        <div class="bg-white rounded-xl shadow-luxury p-6">
          <div class="text-sm font-medium text-gray-500 mb-2">{{ t('Best Sellers') }}</div>
          <div class="text-2xl font-bold text-gray-900">{{ bestSellersCount }}</div>
          <div class="text-xs text-gray-500 mt-2">{{ t('Featured products') }}</div>
        </div>
        <div class="bg-white rounded-xl shadow-luxury p-6">
          <div class="text-sm font-medium text-gray-500 mb-2">{{ t('New Arrivals') }}</div>
          <div class="text-2xl font-bold text-gray-900">{{ newArrivalsCount }}</div>
          <div class="text-xs text-gray-500 mt-2">{{ t('Last 30 days') }}</div>
        </div>
        <div class="bg-white rounded-xl shadow-luxury p-6">
          <div class="text-sm font-medium text-gray-500 mb-2">{{ t('Avg Price') }}</div>
          <div class="text-2xl font-bold text-gray-900">${{ averagePrice }}</div>
          <div class="text-xs text-gray-500 mt-2">{{ t('Across all products') }}</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-luxury p-6 mb-6">
        <div class="flex flex-wrap items-center gap-4">
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
              {{ getCategoryDisplayName(category) }}
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
            <option value="in-stock">{{ t('In Stock') }}</option>
            <option value="out-of-stock">{{ t('Out of Stock') }}</option>
          </select>

          <!-- Brand Filter -->
          <select
            v-model="filters.brand"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                   focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">{{ t('All Brands') }}</option>
            <option v-for="brand in uniqueBrands" :key="brand" :value="brand">
              {{ brand }}
            </option>
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
      </div>

      <!-- Products Table -->
      <div class="bg-white rounded-xl shadow-luxury overflow-hidden">
        <!-- Loading State -->
        <div v-if="productsStore.isLoading" class="p-12 text-center">
          <div class="flex justify-center">
            <div class="luxury-loading-spinner"></div>
          </div>
          <p class="text-gray-600 mt-4">{{ t('Loading products from Firebase...') }}</p>
          <p class="text-sm text-gray-400 mt-2">
            {{ t('Spark Plan: Read-only access. Editing disabled.') }}
          </p>
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
            @click="refreshProducts"
            class="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            {{ t('Try Again') }}
          </button>
          <p class="text-sm text-gray-400 mt-4">
            {{ t('Using cached data. Last updated:') }} {{ lastUpdated }}
          </p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredProducts.length === 0 && !productsStore.isLoading" class="p-12 text-center">
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
                  {{ t('Brand') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('Price') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('Stock') }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ t('Status') }}
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
                        :src="getProductImage(product)" 
                        :alt="getProductName(product)"
                        class="h-12 w-12 rounded-lg object-cover bg-gray-100"
                        @error="handleImageError"
                      />
                    </div>
                    <div class="ml-4" :class="{ 'mr-4 ml-0': isRTL }">
                      <div class="text-sm font-medium text-gray-900">
                        {{ getProductName(product) }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ product.size }} • {{ product.concentration }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-sm text-gray-900 font-medium">
                    {{ product.brand }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-bold text-gray-900">
                    ${{ product.price.toFixed(2) }}
                  </div>
                  <div v-if="product.originalPrice && product.originalPrice > product.price" 
                       class="text-xs text-gray-500 line-through">
                    ${{ product.originalPrice.toFixed(2) }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span v-if="product.inStock && product.stockQuantity !== undefined"
                        class="text-sm text-gray-900">
                    {{ product.stockQuantity }} {{ t('units') }}
                  </span>
                  <span v-else-if="product.inStock" 
                        class="text-sm text-green-600 font-medium">
                    {{ t('In Stock') }}
                  </span>
                  <span v-else 
                        class="text-sm text-red-600 font-medium">
                    {{ t('Out of Stock') }}
                  </span>
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
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex items-center gap-3">
                    <!-- View on Site -->
                    <a
                      :href="`/product/${product.slug || product.id}`"
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
                    </a>
                    
                    <!-- Edit (Local Only) -->
                    <button
                      @click="editProductLocal(product)"
                      class="text-primary-600 hover:text-primary-700"
                      :title="t('Edit (local only)')"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    
                    <!-- View Details -->
                    <button
                      @click="viewProductDetails(product)"
                      class="text-gray-600 hover:text-primary-600"
                      :title="t('View details')"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </button>
                    
                    <!-- Delete (Local Only) -->
                    <button
                      @click="confirmDelete(product)"
                      class="text-red-600 hover:text-red-800"
                      :title="t('Delete (local only)')"
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
        <div v-if="filteredProducts.length > 0 && !productsStore.isLoading" class="px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              {{ t('Showing') }} 
              <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, allFilteredProducts.length) }}</span>
              {{ t('of') }}
              <span class="font-medium">{{ allFilteredProducts.length }}</span>
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
          "<span class="font-medium">{{ getProductName(productToDelete) }}</span>"?
          {{ t('This action cannot be undone.') }}
        </p>
        <p class="text-sm text-yellow-600 mb-6">
          <strong>Note:</strong> This will only delete from local state. 
          The product will return on next refresh from Firebase.
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
            @click="deleteProductLocal"
            :disabled="deleting"
            class="px-4 py-2 bg-red-600 text-white rounded-lg font-medium 
                   hover:bg-red-700 transition-colors disabled:opacity-50 
                   disabled:cursor-not-allowed"
          >
            <span v-if="!deleting">{{ t('Delete Locally') }}</span>
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

    <!-- Product Details Modal -->
    <div 
      v-if="showDetailsModal && selectedProduct"
      class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      @click.self="showDetailsModal = false"
    >
      <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-gray-900">Product Details</h3>
            <button @click="showDetailsModal = false" class="text-gray-500 hover:text-gray-700">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Product Image -->
            <div>
              <img 
                :src="getProductImage(selectedProduct)" 
                :alt="getProductName(selectedProduct)"
                class="w-full rounded-xl shadow-luxury"
              />
            </div>
            
            <!-- Product Info -->
            <div>
              <h4 class="text-lg font-bold text-gray-900 mb-2">
                {{ getProductName(selectedProduct) }}
              </h4>
              <div class="space-y-4">
                <div>
                  <label class="text-sm font-medium text-gray-500">Brand</label>
                  <p class="text-gray-900">{{ selectedProduct.brand }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Category</label>
                  <p class="text-gray-900">{{ getCategoryName(selectedProduct.category) }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Price</label>
                  <p class="text-gray-900 font-bold">${{ selectedProduct.price.toFixed(2) }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Size & Concentration</label>
                  <p class="text-gray-900">{{ selectedProduct.size }} • {{ selectedProduct.concentration }}</p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Description</label>
                  <p class="text-gray-900 whitespace-pre-line">
                    {{ selectedProduct.description?.[currentLanguage] || selectedProduct.description?.en || 'No description' }}
                  </p>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Fragrance Notes</label>
                  <div class="mt-2 space-y-2">
                    <div>
                      <span class="text-xs font-medium text-gray-500">Top Notes:</span>
                      <p class="text-gray-900">{{ selectedProduct.notes?.top?.join(', ') || 'None' }}</p>
                    </div>
                    <div>
                      <span class="text-xs font-medium text-gray-500">Heart Notes:</span>
                      <p class="text-gray-900">{{ selectedProduct.notes?.heart?.join(', ') || 'None' }}</p>
                    </div>
                    <div>
                      <span class="text-xs font-medium text-gray-500">Base Notes:</span>
                      <p class="text-gray-900">{{ selectedProduct.notes?.base?.join(', ') || 'None' }}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label class="text-sm font-medium text-gray-500">Created</label>
                  <p class="text-gray-900">{{ formatDateProduct(selectedProduct.createdAt) }}</p>
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
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useProductsStore } from '@/stores/products'
import type { Product, Category } from '@/types'

const router = useRouter()
const languageStore = useLanguageStore()
const productsStore = useProductsStore()

const { currentLanguage, isRTL, t } = languageStore
const { products, categories, lastUpdated } = productsStore

// State
const searchQuery = ref('')
const filters = ref({
  category: '',
  brand: '',
  status: '',
  sort: 'newest'
})

// Pagination
const currentPage = ref(1)
const itemsPerPage = 10

// Modals
const showDeleteModal = ref(false)
const showDetailsModal = ref(false)
const showExportSection = ref(false)
const productToDelete = ref<Product | null>(null)
const selectedProduct = ref<Product | null>(null)
const deleting = ref(false)
const exportMessage = ref('')
const exportMessageClass = ref('')

// Computed properties
const hasActiveFilters = computed(() => {
  return filters.value.category || filters.value.brand || filters.value.status || searchQuery.value
})

const uniqueBrands = computed(() => {
  const brands = new Set(products.map(p => p.brand).filter(Boolean))
  return Array.from(brands).sort()
})

const bestSellersCount = computed(() => {
  return products.filter(p => p.isBestSeller).length
})

const newArrivalsCount = computed(() => {
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  return products.filter(p => isNewArrival(p)).length
})

const averagePrice = computed(() => {
  if (products.length === 0) return '0.00'
  const total = products.reduce((sum, p) => sum + p.price, 0)
  return (total / products.length).toFixed(2)
})

// Get all filtered products (without pagination)
const allFilteredProducts = computed(() => {
  let filtered = [...products]

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(product =>
      getProductName(product).toLowerCase().includes(query) ||
      product.description?.[currentLanguage]?.toLowerCase().includes(query) ||
      product.description?.en?.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (filters.value.category) {
    filtered = filtered.filter(product => product.category === filters.value.category)
  }

  // Apply brand filter
  if (filters.value.brand) {
    filtered = filtered.filter(product => product.brand === filters.value.brand)
  }

  // Apply status filter
  if (filters.value.status === 'best-seller') {
    filtered = filtered.filter(product => product.isBestSeller)
  } else if (filters.value.status === 'new') {
    filtered = filtered.filter(product => isNewArrival(product))
  } else if (filters.value.status === 'in-stock') {
    filtered = filtered.filter(product => product.inStock !== false)
  } else if (filters.value.status === 'out-of-stock') {
    filtered = filtered.filter(product => product.inStock === false)
  }

  // Apply sorting
  switch (filters.value.sort) {
    case 'oldest':
      filtered.sort((a, b) => {
        const dateA = getProductDate(a.createdAt)
        const dateB = getProductDate(b.createdAt)
        return dateA.getTime() - dateB.getTime()
      })
      break
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'name':
      filtered.sort((a, b) => 
        getProductName(a).localeCompare(getProductName(b))
      )
      break
    default: // newest
      filtered.sort((a, b) => {
        const dateA = getProductDate(a.createdAt)
        const dateB = getProductDate(b.createdAt)
        return dateB.getTime() - dateA.getTime()
      })
  }

  return filtered
})

// Get paginated products
const filteredProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return allFilteredProducts.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(allFilteredProducts.value.length / itemsPerPage)
})

// Helper methods
const getCategoryDisplayName = (category: Category) => {
  if (!category) return ''
  if (typeof category === 'string') return category
  return category[currentLanguage] || category.name || category.id || ''
}

const getCategoryName = (categoryId: string) => {
  if (!categoryId) return ''
  
  const category = categories.find(cat => cat.id === categoryId)
  if (category) {
    return getCategoryDisplayName(category)
  }
  
  return categoryId
}

const getProductName = (product: Product | null) => {
  if (!product) return ''
  if (typeof product.name === 'string') return product.name
  return product.name?.[currentLanguage] || product.name?.en || 'Unnamed Product'
}

const getProductImage = (product: Product) => {
  if (!product) return ''
  return product.imageUrl || '/images/placeholder-product.jpg'
}

const getProductDate = (date: any): Date => {
  try {
    if (date instanceof Date) return date
    if (date?.toDate && typeof date.toDate === 'function') return date.toDate()
    if (typeof date === 'string' || typeof date === 'number') return new Date(date)
    if (date?.seconds) return new Date(date.seconds * 1000)
    return new Date()
  } catch {
    return new Date()
  }
}

const formatDateProduct = (date: any) => {
  try {
    const dateObj = getProductDate(date)
    return dateObj.toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch {
    return ''
  }
}

const isNewArrival = (product: Product) => {
  if (!product.createdAt) return false
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  const createdAt = getProductDate(product.createdAt)
  return createdAt > oneMonthAgo
}

const clearFilters = () => {
  searchQuery.value = ''
  filters.value = {
    category: '',
    brand: '',
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

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/placeholder-product.jpg'
  img.onerror = null
}

const refreshProducts = async () => {
  try {
    await productsStore.fetchProducts()
  } catch (error) {
    console.error('Error refreshing products:', error)
  }
}

// Export functions
const exportProducts = () => {
  showExportSection.value = true
}

const exportAsJSON = () => {
  const data = {
    exportDate: new Date().toISOString(),
    products: allFilteredProducts.value.map(product => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      brand: product.brand,
      category: product.category,
      price: product.price,
      originalPrice: product.originalPrice,
      size: product.size,
      concentration: product.concentration,
      imageUrl: product.imageUrl,
      isBestSeller: product.isBestSeller,
      isFeatured: product.isFeatured,
      rating: product.rating,
      reviewCount: product.reviewCount,
      notes: product.notes,
      inStock: product.inStock,
      stockQuantity: product.stockQuantity,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt
    }))
  }
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `products-export-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  showMessage('Products exported as JSON successfully!', 'success')
}

const exportAsCSV = () => {
  const headers = [
    'ID', 'Slug', 'Name (EN)', 'Name (AR)', 'Brand', 'Category', 'Price', 
    'Size', 'Concentration', 'Is Best Seller', 'Is Featured', 'In Stock', 
    'Stock Quantity', 'Rating', 'Review Count'
  ]
  
  const rows = allFilteredProducts.value.map(product => [
    product.id,
    product.slug || '',
    typeof product.name === 'string' ? product.name : product.name?.en || '',
    typeof product.name === 'string' ? '' : product.name?.ar || '',
    product.brand || '',
    product.category || '',
    product.price.toString(),
    product.size || '',
    product.concentration || '',
    product.isBestSeller ? 'Yes' : 'No',
    product.isFeatured ? 'Yes' : 'No',
    product.inStock ? 'Yes' : 'No',
    product.stockQuantity?.toString() || '0',
    product.rating?.toString() || '0',
    product.reviewCount?.toString() || '0'
  ])
  
  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `products-export-${new Date().toISOString().split('T')[0]}.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  showMessage('Products exported as CSV successfully!', 'success')
}

const copyToClipboard = async () => {
  const data = {
    exportDate: new Date().toISOString(),
    products: allFilteredProducts.value.map(product => ({
      name: getProductName(product),
      brand: product.brand,
      price: product.price,
      category: product.category
    }))
  }
  
  try {
    await navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    showMessage('Product data copied to clipboard!', 'success')
  } catch (error) {
    showMessage('Failed to copy to clipboard', 'error')
  }
}

const showMessage = (message: string, type: 'success' | 'error' | 'info') => {
  exportMessage.value = message
  exportMessageClass.value = type === 'success' ? 'bg-green-50 text-green-800' :
                           type === 'error' ? 'bg-red-50 text-red-800' :
                           'bg-blue-50 text-blue-800'
  
  setTimeout(() => {
    exportMessage.value = ''
  }, 3000)
}

// Product actions
const editProductLocal = (product: Product) => {
  // On Spark Plan, we can only edit locally
  showMessage('Spark Plan: Editing is local only. Changes will be lost on refresh.', 'info')
  router.push(`/admin/products/edit/${product.id}`)
}

const viewProductDetails = (product: Product) => {
  selectedProduct.value = product
  showDetailsModal.value = true
}

const confirmDelete = (product: Product) => {
  productToDelete.value = product
  showDeleteModal.value = true
}

const deleteProductLocal = async () => {
  if (!productToDelete.value) return

  deleting.value = true
  try {
    // Only delete from local state on Spark Plan
    await productsStore.removeProduct(productToDelete.value.id)
    showDeleteModal.value = false
    productToDelete.value = null
    showMessage('Product removed from local state. It will return on next refresh from Firebase.', 'info')
  } catch (error) {
    showMessage('Failed to delete product', 'error')
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
  try {
    if (products.length === 0) {
      await productsStore.fetchProducts()
    }
  } catch (error) {
    console.error('Error loading products:', error)
  }
})
</script>

<style scoped>
.luxury-loading-spinner {
  width: 50px;
  height: 50px;
  border: 2px solid rgba(212, 175, 55, 0.2);
  border-top: 2px solid #d4af37;
  border-radius: 50%;
  animation: spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Ensure table cells have proper spacing */
table {
  border-spacing: 0;
}

th, td {
  padding: 0.75rem 1.5rem;
}

/* Improve image display */
img {
  object-fit: cover;
  background-color: #f3f4f6;
}

/* Better hover states */
tr:hover {
  background-color: #f9fafb;
}

/* Responsive improvements */
@media (max-width: 768px) {
  th, td {
    padding: 0.5rem 0.75rem;
  }
  
  .px-8 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>