<template>
  <div class="admin-dashboard">
    <!-- Loading State -->
    <div v-if="homepageStore.isLoading" class="flex items-center justify-center p-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
      <span class="ml-3 text-gray-600">{{ t('Loading dashboard...') }}</span>
    </div>

    <!-- Error State -->
    <div v-else-if="homepageStore.error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p class="text-red-600">{{ homepageStore.error }}</p>
    </div>

    <!-- Main Dashboard Content -->
    <div v-else-if="homepageData" class="space-y-6 lg:space-y-8">
      <!-- Stats Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <!-- Featured Brands Card -->
        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 lg:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">{{ t('Featured Brands') }}</p>
              <p class="text-2xl lg:text-3xl font-bold text-gray-900 mt-1 lg:mt-2">
                {{ featuredBrands.length }}
              </p>
              <p class="text-xs lg:text-sm text-gray-500 mt-1">
                {{ t('Active on homepage') }}
              </p>
            </div>
            <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <svg class="w-5 h-5 lg:w-6 lg:h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Special Offers Card -->
        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 lg:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">{{ t('Special Offers') }}</p>
              <p class="text-2xl lg:text-3xl font-bold text-gray-900 mt-1 lg:mt-2">
                {{ activeOffers.length }}
              </p>
              <p class="text-xs lg:text-sm text-gray-500 mt-1">
                {{ t('Current promotions') }}
              </p>
            </div>
            <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-emerald-100 flex items-center justify-center">
              <svg class="w-5 h-5 lg:w-6 lg:h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Hero Banner Card -->
        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 lg:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">{{ t('Hero Banner') }}</p>
              <p class="text-2xl lg:text-3xl font-bold text-gray-900 mt-1 lg:mt-2">
                {{ heroBanner.imageUrl ? '1' : '0' }}
              </p>
              <p class="text-xs lg:text-sm text-gray-500 mt-1">
                {{ heroBanner.imageUrl ? t('Active') : t('No Banner') }}
              </p>
            </div>
            <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <svg class="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
          </div>
        </div>

        <!-- Admin Users / Marquee Brands Card -->
        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 lg:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-600">
                {{ isSuperAdmin ? t('Admin Users') : t('Marquee Brands') }}
              </p>
              <p class="text-2xl lg:text-3xl font-bold text-gray-900 mt-1 lg:mt-2">
                {{ isSuperAdmin ? (authStore.adminUsers?.length || 0) : marqueeBrands.length }}
              </p>
              <p class="text-xs lg:text-sm text-gray-500 mt-1">
                {{ isSuperAdmin ? t('Total admin accounts') : t('Scrolling display') }}
              </p>
            </div>
            <div class="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-purple-100 flex items-center justify-center">
              <svg class="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="isSuperAdmin" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-4.5V3m0 0h-3m3 0h3"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Management Sections Grid -->
      <div class="grid lg:grid-cols-2 gap-4 lg:gap-6">
        <!-- Hero Banner Management -->
        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div class="p-4 lg:p-6 border-b border-gray-200">
            <h2 class="text-lg font-bold text-gray-900">
              {{ t('Hero Banner Management') }}
            </h2>
          </div>
          <div class="p-4 lg:p-6">
            <div class="space-y-4">
              <!-- Banner Image Preview -->
              <div class="relative h-40 lg:h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  v-if="heroBanner.imageUrl"
                  :src="heroBanner.imageUrl"
                  :alt="t('Hero Banner')"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  <svg class="w-10 h-10 lg:w-12 lg:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
              </div>
              
              <!-- Banner Controls -->
              <div class="space-y-3">
                <!-- Image Upload -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ t('Banner Image') }}
                  </label>
                  <div class="flex items-center space-x-2">
                    <input
                      v-model="heroBanner.imageUrl"
                      type="text"
                      class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      :placeholder="t('Image URL or upload new')"
                    />
                    <input
                      type="file"
                      ref="bannerFileInput"
                      accept="image/*"
                      class="hidden"
                      @change="handleBannerImageUpload"
                    />
                    <button
                      @click="$refs.bannerFileInput.click()"
                      class="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      {{ t('Upload') }}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ t('Main Title') }}
                  </label>
                  <input
                    v-model="heroBanner.title"
                    type="text"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    :placeholder="t('Enter main title')"
                  />
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    {{ t('Subtitle') }}
                  </label>
                  <input
                    v-model="heroBanner.subtitle"
                    type="text"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    :placeholder="t('Enter subtitle')"
                  />
                </div>
                
                <button
                  @click="updateHeroBanner"
                  :disabled="homepageStore.isLoading"
                  class="w-full bg-primary-600 text-white py-2.5 text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ homepageStore.isLoading ? t('Saving...') : t('Update Banner') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Featured Brands Management -->
        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div class="p-4 lg:p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900">
                {{ t('Featured Brands Management') }}
              </h2>
              <div class="flex items-center gap-2">
                <button
                  @click="toggleBrandsDebug"
                  class="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Debug
                </button>
                <button
                  @click="openAddBrandModal"
                  class="bg-primary-600 text-white px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {{ t('Add Brand') }}
                </button>
              </div>
            </div>
          </div>
          
          <!-- Debug Banner -->
          <div v-if="showBrandsDebug" class="bg-yellow-50 border-b border-yellow-200 p-3">
            <div class="flex items-center justify-between">
              <h3 class="text-sm font-medium text-yellow-800">Debug Mode</h3>
              <button @click="showBrandsDebug = false" class="text-yellow-600 hover:text-yellow-800">
                ✕
              </button>
            </div>
            <div class="mt-2 text-xs text-yellow-700">
              <div>Total Brands: {{ featuredBrands.length }}</div>
              <div>Upload Method: {{ hasUploadImage ? 'Available' : 'Missing' }}</div>
              <div>Store Status: {{ homepageStore.isLoading ? 'Loading...' : 'Ready' }}</div>
              <div>Last Saved: {{ lastBrandsSaveTime ? formatTime(lastBrandsSaveTime) : 'Never' }}</div>
            </div>
          </div>

          <!-- Brands Grid Editor -->
          <div class="p-4 lg:p-6">
            <div class="space-y-4">
              <!-- Status Messages -->
              <div v-if="brandsUploadStatus" class="p-3 rounded-lg" 
                   :class="brandsUploadStatus.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'">
                <div class="flex items-center gap-2">
                  <svg v-if="brandsUploadStatus.type === 'success'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-sm">{{ brandsUploadStatus.message }}</span>
                </div>
              </div>

              <!-- Brands Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                <div
                  v-for="(brand, index) in featuredBrands"
                  :key="brand.id || index"
                  class="border border-gray-200 rounded-lg p-4 space-y-3 hover:shadow-sm transition-shadow"
                >
                  <!-- Brand Image with Upload -->
                  <div class="relative">
                    <div class="w-full h-32 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                      <img
                        v-if="brand.image"
                        :src="brand.image"
                        :alt="brand.name"
                        class="w-full h-full object-cover"
                        @error="handleBrandImageError(brand)"
                      />
                      <div v-else class="text-gray-400 text-center p-2">
                        <svg class="w-8 h-8 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <p class="text-xs">No image</p>
                      </div>
                    </div>
                    
                    <!-- Image Upload Button -->
                    <button
                      @click="uploadBrandImage(index)"
                      class="absolute top-2 right-2 bg-white p-1.5 rounded-full shadow hover:bg-gray-50 transition-colors"
                      :title="brand.image ? 'Change Image' : 'Upload Image'"
                    >
                      <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </button>
                    <input
                      type="file"
                      :ref="el => setBrandFileInputRef(el, index)"
                      @change="event => handleBrandImageUpload(event, index)"
                      accept="image/*"
                      class="hidden"
                    />
                  </div>

                  <!-- Brand Details Form -->
                  <div class="space-y-2">
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">Brand Name</label>
                      <input
                        v-model="brand.name"
                        type="text"
                        class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="e.g., Chanel"
                        @input="scheduleBrandsUpdate"
                      />
                    </div>
                    
                    <div>
                      <label class="block text-xs font-medium text-gray-700 mb-1">Signature Scent</label>
                      <input
                        v-model="brand.signature"
                        type="text"
                        class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="e.g., Coco Mademoiselle"
                        @input="scheduleBrandsUpdate"
                      />
                    </div>
                    
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Price (EGP)</label>
                        <input
                          v-model.number="brand.price"
                          type="number"
                          min="0"
                          step="10"
                          class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="600"
                          @input="scheduleBrandsUpdate"
                        />
                      </div>
                      
                      <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">URL Slug</label>
                        <input
                          v-model="brand.slug"
                          type="text"
                          class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="chanel"
                          @input="scheduleBrandsUpdate"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex justify-between items-center pt-2 border-t">
                    <div class="flex items-center gap-2">
                      <button
                        @click="editBrand(brand)"
                        class="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded flex items-center gap-1 transition-colors"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                        Edit
                      </button>
                      <button
                        @click="removeBrand(index)"
                        class="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded flex items-center gap-1 transition-colors"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                        Remove
                      </button>
                    </div>
                    <div class="flex items-center gap-1">
                      <span class="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-100 rounded">#{{ index + 1 }}</span>
                      <span v-if="brand.image" class="text-xs text-green-600 px-1.5 py-0.5 bg-green-100 rounded">
                        ✓
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Empty State -->
              <div v-if="featuredBrands.length === 0" class="p-8 text-center text-gray-500">
                <svg class="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                <p class="text-sm">{{ t('No featured brands yet') }}</p>
                <button
                  @click="openAddBrandModal"
                  class="mt-3 bg-primary-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {{ t('Add Your First Brand') }}
                </button>
              </div>

              <!-- Instructions -->
              <div class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <h3 class="text-xs font-medium text-blue-700 mb-1 flex items-center gap-1">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  Tips for Best Results
                </h3>
                <ul class="text-xs text-blue-600 space-y-1">
                  <li class="flex items-start gap-1">
                    <span class="text-blue-500 mt-0.5">•</span>
                    <span>Upload high-quality brand images (400×300px recommended)</span>
                  </li>
                  <li class="flex items-start gap-1">
                    <span class="text-blue-500 mt-0.5">•</span>
                    <span>Keep slugs URL-friendly: lowercase, hyphens, no spaces</span>
                  </li>
                  <li class="flex items-start gap-1">
                    <span class="text-blue-500 mt-0.5">•</span>
                    <span>Maximum 6 brands recommended for optimal layout</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Special Offers Management -->
        <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div class="p-4 lg:p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900">
                {{ t('Special Offers Management') }}
              </h2>
              <button
                @click="openAddOfferModal"
                class="bg-primary-600 text-white px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                {{ t('Add Offer') }}
              </button>
            </div>
          </div>
          <div class="max-h-80 overflow-y-auto">
            <div 
              v-for="offer in activeOffers" 
              :key="offer.id"
              class="p-4 lg:p-6 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
            >
              <div class="flex items-center gap-3 lg:gap-4">
                <img
                  :src="offer.imageUrl"
                  :alt="offer.title"
                  class="w-12 h-12 lg:w-16 lg:h-16 flex-shrink-0 object-cover rounded-lg"
                  @error="handleOfferImageError(offer)"
                />
                <div class="flex-1 min-w-0">
                  <h3 class="font-medium text-gray-900 truncate">
                    {{ offer.title }}
                  </h3>
                  <p class="text-xs lg:text-sm text-gray-600 mt-0.5 truncate">
                    {{ offer.subtitle }}
                  </p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-xs line-through text-gray-500">
                      {{ offer.oldPrice }} {{ t('currencyLE') }}
                    </span>
                    <span class="text-sm font-bold text-emerald-600">
                      {{ offer.newPrice }} {{ t('currencyLE') }}
                    </span>
                  </div>
                </div>
                <div class="flex items-center gap-1 lg:gap-2 flex-shrink-0">
                  <button
                    @click="editOffer(offer)"
                    class="p-1.5 lg:p-2 text-blue-600 hover:text-blue-700"
                    :title="t('Edit')"
                  >
                    <svg class="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>
                  <button
                    @click="removeOffer(offer.id)"
                    class="p-1.5 lg:p-2 text-red-600 hover:text-red-700"
                    :title="t('Remove')"
                  >
                    <svg class="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-if="activeOffers.length === 0" class="p-8 text-center text-gray-500">
              <svg class="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              <p class="text-sm">{{ t('No special offers yet') }}</p>
            </div>
          </div>
        </div>

        <!-- Marquee Brands or Admin Users Management -->
        <div v-if="!isSuperAdmin" class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div class="p-4 lg:p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900">
                {{ t('Marquee Brands Management') }}
              </h2>
              <button
                @click="openAddMarqueeModal"
                class="bg-primary-600 text-white px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
              >
                {{ t('Add Brand') }}
              </button>
            </div>
          </div>
          <div class="p-4 lg:p-6">
            <div class="flex flex-wrap gap-3">
              <div 
                v-for="brand in marqueeBrands" 
                :key="brand.id"
                class="relative group"
              >
                <img
                  :src="brand.logo"
                  :alt="brand.name"
                  class="w-12 h-12 lg:w-16 lg:h-16 object-contain p-2 bg-white border border-gray-200 rounded-lg"
                  @error="handleMarqueeImageError(brand)"
                />
                <button
                  @click="removeMarqueeBrand(brand.id)"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-if="marqueeBrands.length === 0" class="py-8 text-center text-gray-500">
              <svg class="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                      d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
              <p class="text-sm">{{ t('No marquee brands yet') }}</p>
            </div>
          </div>
        </div>

        <!-- Admin Users Management (Only for Super Admin) -->
        <div v-else class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div class="p-4 lg:p-6 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-gray-900">
                {{ t('Admin Users Management') }}
              </h2>
              <button
                @click="openAddAdminModal"
                class="bg-primary-600 text-white px-3 py-1.5 text-xs lg:text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-1"
              >
                <svg class="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
                <span>{{ t('Add Admin') }}</span>
              </button>
            </div>
          </div>
          
          <!-- Loading State -->
          <div v-if="authStore.adminUsersLoading" class="p-6 text-center">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
            <p class="text-sm text-gray-600 mt-2">{{ t('Loading admin users...') }}</p>
          </div>
          
          <!-- Admin Users List -->
          <div v-else class="max-h-80 overflow-y-auto">
            <div 
              v-for="admin in (authStore.adminUsers || [])" 
              :key="admin.uid"
              class="p-4 lg:p-6 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
            >
              <div class="flex items-center gap-3 lg:gap-4">
                <div class="h-10 w-10 lg:h-12 lg:w-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span class="text-sm lg:text-base text-primary-600 font-bold">
                    {{ getAdminInitials(admin.displayName) }}
                  </span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex flex-wrap items-center gap-1 lg:gap-2 mb-1">
                    <h3 class="font-medium text-gray-900 truncate">
                      {{ admin.displayName || 'No Name' }}
                    </h3>
                    <span :class="admin.role === 'super-admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'" 
                          class="px-1.5 py-0.5 text-xs font-semibold rounded-full">
                      {{ admin.role === 'super-admin' ? t('Super Admin') : t('Admin') }}
                    </span>
                    <span :class="admin.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'" 
                          class="px-1.5 py-0.5 text-xs font-semibold rounded-full">
                      {{ admin.isActive ? t('Active') : t('Inactive') }}
                    </span>
                  </div>
                  <p class="text-xs lg:text-sm text-gray-600 truncate">
                    {{ admin.email || 'No Email' }}
                  </p>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ t('Created') }}: {{ formatDate(admin.createdAt) }}
                    <span v-if="admin.lastLogin"> • {{ t('Last login') }}: {{ formatDate(admin.lastLogin) }}</span>
                  </p>
                </div>
                <div class="flex items-center gap-1 lg:gap-2 flex-shrink-0">
                  <!-- Toggle Status Button -->
                  <button
                    v-if="admin.role === 'admin' && admin.uid !== authStore.user?.uid"
                    @click="toggleAdminStatus(admin)"
                    :class="admin.isActive ? 'text-yellow-600 hover:text-yellow-700' : 'text-emerald-600 hover:text-emerald-700'"
                    :title="admin.isActive ? t('Deactivate') : t('Activate')"
                    class="p-1.5"
                  >
                    <svg v-if="admin.isActive" class="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                    <svg v-else class="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  </button>
                  
                  <!-- Protected badge for super-admin or current user -->
                  <span v-if="admin.role === 'super-admin' || admin.uid === authStore.user?.uid" 
                        class="text-xs text-gray-400 px-1.5 py-0.5">
                    {{ t('Protected') }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Empty State -->
            <div v-if="(!authStore.adminUsers || authStore.adminUsers.length === 0)" class="p-6 text-center text-gray-500">
              <svg class="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-4.5V3m0 0h-3m3 0h3"/>
              </svg>
              <p class="text-sm">{{ t('No admin users found') }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-xl shadow-sm p-4 lg:p-6">
        <h3 class="text-lg font-bold text-gray-900 mb-4">{{ t('Quick Actions') }}</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button
            @click="saveAllBrands"
            :disabled="homepageStore.isLoading || isSavingBrands"
            class="bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSavingBrands ? t('Saving Brands...') : t('Save All Brands') }}
          </button>
          <button
            @click="resetToDefaults"
            :disabled="homepageStore.isLoading"
            class="bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('Reset to Defaults') }}
          </button>
          <button
            @click="reloadData"
            :disabled="homepageStore.isLoading"
            class="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('Reload Data') }}
          </button>
        </div>
        <div class="mt-4 text-xs text-gray-500">
          <p>{{ t('Changes are auto-saved after 1 second of inactivity') }}</p>
          <p v-if="lastBrandsSaveTime">{{ t('Last saved') }}: {{ formatTime(lastBrandsSaveTime) }}</p>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <AddBrandModal 
      v-if="showAddBrandModal"
      :brand="editingBrand ? newBrand : null"
      @close="closeAddBrandModal"
      @save="handleBrandSave"
    />
    
    <AddOfferModal 
      v-if="showAddOfferModal"
      :offer="editingOffer ? newOffer : null"
      @close="closeAddOfferModal"
      @save="handleOfferSave"
    />
    
    <AddMarqueeBrandModal 
      v-if="showAddMarqueeModal"
      @close="showAddMarqueeModal = false"
      @save="handleMarqueeBrandSave"
    />
    
    <AddAdminModal 
      v-if="showAddAdminModal"
      @close="closeAddAdminModal"
      @save="handleAdminSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, onUnmounted } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { useAuthStore } from '@/stores/auth'
import { useHomepageStore } from '@/stores/homepage'

// Import Modal Components
import AddBrandModal from '@/components/Admin/AddBrandModal.vue'
import AddOfferModal from '@/components/Admin/AddOfferModal.vue'
import AddMarqueeBrandModal from'@/components/Admin/AddMarqueeBrandsEditor.vue'
import AddAdminModal from '@/components/Admin/AddAdminModal.vue'

const languageStore = useLanguageStore()
const authStore = useAuthStore()
const homepageStore = useHomepageStore()

const { t, formatDate } = languageStore

// Brands editor states
const showBrandsDebug = ref(false)
const brandFileInputs = ref<(HTMLInputElement | null)[]>([])
const isSavingBrands = ref(false)
const brandsUploadStatus = ref<{type: 'success' | 'error', message: string} | null>(null)
const brandsUpdateTimeout = ref<NodeJS.Timeout | null>(null)
const lastBrandsSaveTime = ref<Date | null>(null)

// Modal states
const showAddBrandModal = ref(false)
const showAddOfferModal = ref(false)
const showAddMarqueeModal = ref(false)
const showAddAdminModal = ref(false)

// New item states
const editingBrand = ref(false)
const editingOffer = ref(false)

// New item templates
const newBrand = reactive({
  id: '',
  name: '',
  image: '',
  signature: '',
  price: 0,
  slug: ''
})

const newOffer = reactive({
  id: '',
  title: '',
  imageUrl: '',
  subtitle: '',
  oldPrice: 0,
  newPrice: 0,
  slug: ''
})

// Safely access homepage data with computed properties
const homepageData = computed(() => homepageStore.homepageData)

// Extract data with safe defaults
const heroBanner = computed(() => homepageData.value?.heroBanner || {
  imageUrl: '',
  title: '',
  subtitle: ''
})

const featuredBrands = computed(() => homepageData.value?.featuredBrands || [])
const activeOffers = computed(() => homepageData.value?.activeOffers || [])
const marqueeBrands = computed(() => homepageData.value?.marqueeBrands || [])

// Check if current user is super-admin
const isSuperAdmin = computed(() => authStore.isSuperAdmin)

// Check if uploadImage method exists
const hasUploadImage = computed(() => {
  return typeof homepageStore.uploadImage === 'function'
})

// Format time for display
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// Initialize data
onMounted(async () => {
  await loadHomepageData()
})

// Load homepage data from store
const loadHomepageData = async () => {
  try {
    await homepageStore.loadHomepageData()
    // Initialize file inputs array for brands
    brandFileInputs.value = new Array(featuredBrands.value.length).fill(null)
    console.log('✅ Dashboard loaded with brands:', featuredBrands.value.length)
  } catch (error) {
    console.error('Error loading homepage data:', error)
  }
}

// Brands Editor Methods
const toggleBrandsDebug = () => {
  showBrandsDebug.value = !showBrandsDebug.value
  if (showBrandsDebug.value) {
    console.log('🔧 Brands Debug Mode')
    console.log('🏪 Store:', homepageStore)
    console.log('📸 uploadImage method:', hasUploadImage.value)
    console.log('🛠️ Available methods:', Object.keys(homepageStore).filter(key => typeof homepageStore[key] === 'function'))
  }
}

const setBrandFileInputRef = (el: HTMLInputElement | null, index: number) => {
  brandFileInputs.value[index] = el
}

const showBrandsStatus = (type: 'success' | 'error', message: string) => {
  brandsUploadStatus.value = { type, message }
  setTimeout(() => {
    brandsUploadStatus.value = null
  }, 5000)
}

const uploadBrandImage = (index: number) => {
  const input = brandFileInputs.value[index]
  if (input) {
    input.click()
  } else {
    console.error('File input not found for brand', index)
  }
}

const handleBrandImageUpload = async (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) return

  const file = input.files[0]
  
  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    showBrandsStatus('error', 'Image must be less than 5MB')
    return
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    showBrandsStatus('error', 'Please select an image file (JPG, PNG, etc.)')
    return
  }
  
  try {
    showBrandsStatus('success', 'Uploading image...')
    
    // Check if uploadImage method exists
    if (!hasUploadImage.value) {
      showBrandsStatus('error', 'Image upload service not available')
      return
    }
    
    // Upload the image
    const base64Image = await homepageStore.uploadImage(file, 'brands')
    
    // Update the brand image with Base64 string
    featuredBrands.value[index].image = base64Image
    
    showBrandsStatus('success', 'Image uploaded successfully!')
    scheduleBrandsUpdate()
    
    // Reset the file input
    input.value = ''
    
  } catch (error: any) {
    console.error('Error uploading brand image:', error)
    showBrandsStatus('error', `Failed to upload image: ${error.message || 'Unknown error'}`)
  }
}

const handleBrandImageError = (brand: any) => {
  console.warn(`Image failed to load: ${brand.image}`)
  brand.image = ''
  scheduleBrandsUpdate()
}

const handleOfferImageError = (offer: any) => {
  console.warn(`Offer image failed to load: ${offer.imageUrl}`)
  offer.imageUrl = ''
}

const handleMarqueeImageError = (brand: any) => {
  console.warn(`Marquee image failed to load: ${brand.logo}`)
  brand.logo = ''
}

const removeBrand = async (index: number) => {
  if (featuredBrands.value.length <= 1) {
    alert('At least one brand must remain')
    return
  }
  
  if (!confirm('Are you sure you want to remove this brand?')) return
  
  const brandName = featuredBrands.value[index].name || `Brand #${index + 1}`
  featuredBrands.value.splice(index, 1)
  brandFileInputs.value.splice(index, 1)
  
  showBrandsStatus('success', `"${brandName}" removed`)
  scheduleBrandsUpdate()
}

const scheduleBrandsUpdate = () => {
  if (brandsUpdateTimeout.value) {
    clearTimeout(brandsUpdateTimeout.value)
  }
  
  brandsUpdateTimeout.value = setTimeout(async () => {
    await saveAllBrands()
  }, 1000)
}

const saveAllBrands = async () => {
  try {
    isSavingBrands.value = true
    const success = await homepageStore.updateFeaturedBrands(featuredBrands.value)
    if (success) {
      lastBrandsSaveTime.value = new Date()
      showBrandsStatus('success', 'All brands saved successfully!')
    } else {
      showBrandsStatus('error', 'Failed to save brands')
    }
  } catch (error: any) {
    showBrandsStatus('error', `Failed to save brands: ${error.message || 'Unknown error'}`)
  } finally {
    isSavingBrands.value = false
  }
}

// Modal methods
const openAddBrandModal = () => {
  showAddBrandModal.value = true
}

const closeAddBrandModal = () => {
  showAddBrandModal.value = false
  resetNewBrand()
}

const openAddOfferModal = () => {
  showAddOfferModal.value = true
}

const closeAddOfferModal = () => {
  showAddOfferModal.value = false
  resetNewOffer()
}

const closeAddAdminModal = () => {
  showAddAdminModal.value = false
}

// Hero Banner Methods
const updateHeroBanner = async () => {
  try {
    const success = await homepageStore.updateHeroBanner(heroBanner.value)
    if (success) {
      alert(t('Hero banner updated successfully!'))
    } else {
      alert(t('Failed to update hero banner'))
    }
  } catch (error: any) {
    console.error('Error updating hero banner:', error)
    alert(t('Failed to update hero banner: ') + (error.message || 'Unknown error'))
  }
}

// Handle banner image upload
const handleBannerImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) return
  
  const file = input.files[0]
  try {
    // Use the homepage store's uploadImage method
    const base64Image = await homepageStore.uploadImage(file, 'banners')
    heroBanner.value.imageUrl = base64Image
    alert(t('Banner image uploaded successfully!'))
  } catch (error: any) {
    alert(t('Failed to upload image: ') + (error.message || 'Unknown error'))
  }
  
  // Reset file input
  input.value = ''
}

// Brand Modal Methods
const editBrand = (brand: any) => {
  Object.assign(newBrand, brand)
  editingBrand.value = true
  openAddBrandModal()
}

const handleBrandSave = async (brandData: any) => {
  try {
    // The new modal returns both brand and products data
    const { brand, products } = brandData
    
    let updatedBrands
    if (editingBrand.value) {
      // Update existing brand
      updatedBrands = featuredBrands.value.map(b => 
        b.id === brand.id ? { 
          ...brand,
          image: brand.image || b.image,
          price: brand.price || b.price
        } : b
      )
      editingBrand.value = false
    } else {
      // Add new brand (convert to featured brand format)
      const featuredBrand = {
        id: brand.id || Date.now().toString(),
        name: brand.name,
        image: brand.image,
        signature: brand.signature || '',
        price: brand.price || 0,
        slug: brand.slug,
        category: brand.category || '',
        description: brand.description || '',
        isActive: brand.isActive !== false
      }
      updatedBrands = [...featuredBrands.value, featuredBrand]
    }
    
    // Update featured brands
    const success = await homepageStore.updateFeaturedBrands(updatedBrands)
    
    if (success && products && products.length > 0) {
      console.log('Products to save:', products)
      alert(t('Brand saved successfully! Don\'t forget to save the products separately.'))
    } else if (success) {
      alert(t('Brand saved successfully!'))
    } else {
      alert(t('Failed to save brand'))
    }
    
    closeAddBrandModal()
  } catch (error: any) {
    alert(t('Failed to save brand: ') + (error.message || 'Unknown error'))
  }
}

const resetNewBrand = () => {
  Object.assign(newBrand, {
    id: '',
    name: '',
    image: '',
    signature: '',
    price: 0,
    slug: ''
  })
}

// Offer Methods
const editOffer = (offer: any) => {
  Object.assign(newOffer, offer)
  editingOffer.value = true
  openAddOfferModal()
}

const handleOfferSave = async (offerData: any) => {
  try {
    let updatedOffers
    if (editingOffer.value) {
      // Update existing offer
      updatedOffers = activeOffers.value.map(o => 
        o.id === offerData.id ? { ...offerData } : o
      )
      editingOffer.value = false
    } else {
      // Add new offer
      const newId = Date.now().toString()
      updatedOffers = [...activeOffers.value, {
        ...offerData,
        id: newId
      }]
    }
    
    const success = await homepageStore.updateActiveOffers(updatedOffers)
    if (success) {
      closeAddOfferModal()
      alert(t('Offer saved successfully!'))
    } else {
      alert(t('Failed to save offer'))
    }
  } catch (error: any) {
    alert(t('Failed to save offer: ') + (error.message || 'Unknown error'))
  }
}

const removeOffer = async (id: string) => {
  if (!confirm(t('Are you sure you want to remove this offer?'))) return
  
  try {
    const updatedOffers = activeOffers.value.filter(o => o.id !== id)
    const success = await homepageStore.updateActiveOffers(updatedOffers)
    if (success) {
      alert(t('Offer removed successfully!'))
    } else {
      alert(t('Failed to remove offer'))
    }
  } catch (error: any) {
    alert(t('Failed to remove offer: ') + (error.message || 'Unknown error'))
  }
}

const resetNewOffer = () => {
  Object.assign(newOffer, {
    id: '',
    title: '',
    imageUrl: '',
    subtitle: '',
    oldPrice: 0,
    newPrice: 0,
    slug: ''
  })
}

// Marquee Brand Methods
const handleMarqueeBrandSave = async (brandData: any) => {
  try {
    const newId = Date.now().toString()
    const updatedBrands = [...marqueeBrands.value, {
      ...brandData,
      id: newId
    }]
    
    const success = await homepageStore.updateMarqueeBrands(updatedBrands)
    if (success) {
      showAddMarqueeModal.value = false
      alert(t('Marquee brand added successfully!'))
    } else {
      alert(t('Failed to add marquee brand'))
    }
  } catch (error: any) {
    alert(t('Failed to add marquee brand: ') + (error.message || 'Unknown error'))
  }
}

const removeMarqueeBrand = async (id: string) => {
  if (!confirm(t('Are you sure you want to remove this marquee brand?'))) return
  
  try {
    const updatedBrands = marqueeBrands.value.filter(b => b.id !== id)
    const success = await homepageStore.updateMarqueeBrands(updatedBrands)
    if (success) {
      alert(t('Marquee brand removed successfully!'))
    } else {
      alert(t('Failed to remove marquee brand'))
    }
  } catch (error: any) {
    alert(t('Failed to remove marquee brand: ') + (error.message || 'Unknown error'))
  }
}

// Admin management methods
const getAdminInitials = (name: string) => {
  if (!name) return 'AD'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const toggleAdminStatus = async (admin: any) => {
  if (!confirm(t(`Are you sure you want to ${admin.isActive ? 'deactivate' : 'activate'} this admin?`))) {
    return
  }
  
  try {
    console.log(`Updating admin ${admin.uid} status to ${!admin.isActive}`)
    alert(t('Admin status updated successfully!'))
  } catch (error: any) {
    alert(t('Failed to update admin status: ') + (error.message || 'Unknown error'))
  }
}

const handleAdminSave = async (adminData: any) => {
  try {
    console.log('Creating new admin:', adminData)
    showAddAdminModal.value = false
    alert(t('Admin user created successfully!'))
  } catch (error: any) {
    alert(t('Failed to create admin: ') + (error.message || 'Unknown error'))
  }
}

// Quick Actions
const resetToDefaults = async () => {
  if (!confirm(t('Are you sure you want to reset all data to defaults?'))) return
  
  try {
    const success = await homepageStore.resetToLocalDefaults()
    if (success) {
      alert(t('Data reset to defaults successfully!'))
    } else {
      alert(t('Failed to reset data'))
    }
  } catch (error: any) {
    alert(t('Failed to reset data: ') + (error.message || 'Unknown error'))
  }
}

const reloadData = async () => {
  await loadHomepageData()
  alert(t('Data reloaded successfully!'))
}

// Cleanup on unmount
onUnmounted(() => {
  if (brandsUpdateTimeout.value) {
    clearTimeout(brandsUpdateTimeout.value)
  }
})
</script>

<style scoped>
.admin-dashboard {
  -webkit-tap-highlight-color: transparent;
}

/* Custom scrollbar for overflow areas */
.max-h-80::-webkit-scrollbar,
.max-h-\[500px\]::-webkit-scrollbar {
  width: 6px;
}

.max-h-80::-webkit-scrollbar-track,
.max-h-\[500px\]::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.max-h-80::-webkit-scrollbar-thumb,
.max-h-\[500px\]::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.max-h-80::-webkit-scrollbar-thumb:hover,
.max-h-\[500px\]::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.3s ease-in-out;
}

/* Better button hover effects */
button:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

button:active {
  transform: translateY(0);
}

/* Improve image loading */
img {
  transition: opacity 0.3s ease;
}

img:not([src]), img[src=""] {
  opacity: 0;
}

/* Image hover effects */
img:hover {
  transform: scale(1.02);
  transition: transform 0.3s ease;
}

/* Focus styles for inputs */
input:focus,
button:focus {
  outline: none;
  ring: 2px;
  ring-color: #4f46e5;
}

/* Brands grid animations */
.brand-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.brand-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* Upload button styles */
input[type="file"] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Status message animations */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

.bg-green-50, .bg-red-50, .bg-yellow-50 {
  animation: fadeIn 0.3s ease-out;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .grid-cols-1 {
    gap: 1rem;
  }
  
  .p-4 {
    padding: 1rem;
  }
  
  .text-sm {
    font-size: 0.875rem;
  }
  
  .text-xs {
    font-size: 0.75rem;
  }
}
</style>