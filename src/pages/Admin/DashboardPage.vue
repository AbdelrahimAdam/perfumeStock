<template>
  <div class="min-h-screen bg-gray-50">
    <AdminSidebar />

    <div class="lg:ml-64">
      <!-- Header -->
      <div class="bg-white border-b border-gray-200">
        <div class="px-8 py-6">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-2xl font-display-en font-bold text-gray-900">
                {{ t('Dashboard') }}
              </h1>
              <p class="text-gray-600 mt-1">
                {{ t('Manage your homepage content') }}
              </p>
            </div>
            <div class="flex items-center gap-4">
              <!-- Date Display -->
              <div class="hidden md:block text-sm text-gray-600">
                {{ formatDate(new Date()) }}
              </div>
              <!-- Dark Mode Toggle -->
              <button 
                @click="toggleDarkMode"
                class="p-2 text-gray-600 hover:text-primary-600"
                :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
              >
                <svg v-if="isDarkMode" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/>
                </svg>
                <svg v-else class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Homepage Management Tabs -->
      <div class="p-8">
        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <!-- Featured Brands -->
          <div class="bg-white rounded-xl shadow-luxury p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">{{ t('Featured Brands') }}</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">
                  {{ homepageData.featuredBrands.length }}
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  {{ t('Active on homepage') }}
                </p>
              </div>
              <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Special Offers -->
          <div class="bg-white rounded-xl shadow-luxury p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">{{ t('Special Offers') }}</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">
                  {{ homepageData.activeOffers.length }}
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  {{ t('Current promotions') }}
                </p>
              </div>
              <div class="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg class="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Hero Banner -->
          <div class="bg-white rounded-xl shadow-luxury p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">{{ t('Hero Banner') }}</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">
                  {{ homepageData.heroBanner ? '1' : '0' }}
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  {{ homepageData.heroBanner ? 'Active' : 'No Banner' }}
                </p>
              </div>
              <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Marquee Brands -->
          <div class="bg-white rounded-xl shadow-luxury p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600">{{ t('Marquee Brands') }}</p>
                <p class="text-3xl font-bold text-gray-900 mt-2">
                  {{ homepageData.marqueeBrands.length }}
                </p>
                <p class="text-sm text-gray-500 mt-1">
                  {{ t('Scrolling display') }}
                </p>
              </div>
              <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Management Sections -->
        <div class="grid lg:grid-cols-2 gap-8">
          <!-- Hero Banner Management -->
          <div class="bg-white rounded-xl shadow-luxury overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-lg font-display-en font-bold text-gray-900">
                {{ t('Hero Banner Management') }}
              </h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <!-- Banner Image Preview -->
                <div class="relative h-48 bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    v-if="homepageData.heroBanner?.imageUrl"
                    :src="homepageData.heroBanner.imageUrl"
                    alt="Hero Banner"
                    class="w-full h-full object-cover"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                </div>
                
                <!-- Banner Controls -->
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ t('Banner Image URL') }}
                    </label>
                    <input
                      v-model="homepageData.heroBanner.imageUrl"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="https://example.com/banner.jpg"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ t('Main Title') }}
                    </label>
                    <input
                      v-model="homepageData.heroBanner.title"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      :placeholder="t('Enter main title')"
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ t('Subtitle') }}
                    </label>
                    <input
                      v-model="homepageData.heroBanner.subtitle"
                      type="text"
                      class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      :placeholder="t('Enter subtitle')"
                    />
                  </div>
                  
                  <button
                    @click="updateHeroBanner"
                    class="w-full bg-primary-600 text-white py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    {{ t('Update Banner') }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Featured Brands Management -->
          <div class="bg-white rounded-xl shadow-luxury overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-display-en font-bold text-gray-900">
                  {{ t('Featured Brands Management') }}
                </h2>
                <button
                  @click="showAddBrandModal = true"
                  class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  {{ t('Add Brand') }}
                </button>
              </div>
            </div>
            <div class="divide-y divide-gray-100">
              <div 
                v-for="brand in homepageData.featuredBrands" 
                :key="brand.id"
                class="p-6 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center gap-4">
                  <img
                    :src="brand.image"
                    :alt="brand.name"
                    class="w-16 h-16 object-cover rounded-lg"
                  />
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-900">
                      {{ brand.name }}
                    </h3>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ brand.price }} {{ t('currencyLE') }}
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      @click="editBrand(brand)"
                      class="p-2 text-blue-600 hover:text-blue-700"
                      :title="t('Edit')"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button
                      @click="removeBrand(brand.id)"
                      class="p-2 text-red-600 hover:text-red-700"
                      :title="t('Remove')"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Special Offers Management -->
          <div class="bg-white rounded-xl shadow-luxury overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-display-en font-bold text-gray-900">
                  {{ t('Special Offers Management') }}
                </h2>
                <button
                  @click="showAddOfferModal = true"
                  class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  {{ t('Add Offer') }}
                </button>
              </div>
            </div>
            <div class="divide-y divide-gray-100">
              <div 
                v-for="offer in homepageData.activeOffers" 
                :key="offer.id"
                class="p-6 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-center gap-4">
                  <img
                    :src="offer.imageUrl"
                    :alt="offer.title"
                    class="w-16 h-16 object-cover rounded-lg"
                  />
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-900">
                      {{ offer.title }}
                    </h3>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ t('Old Price') }}: {{ offer.oldPrice }} {{ t('currencyLE') }}
                    </p>
                    <p class="text-sm text-emerald-600 mt-1">
                      {{ t('New Price') }}: {{ offer.newPrice }} {{ t('currencyLE') }}
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    <button
                      @click="editOffer(offer)"
                      class="p-2 text-blue-600 hover:text-blue-700"
                      :title="t('Edit')"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                      </svg>
                    </button>
                    <button
                      @click="removeOffer(offer.id)"
                      class="p-2 text-red-600 hover:text-red-700"
                      :title="t('Remove')"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Marquee Brands Management -->
          <div class="bg-white rounded-xl shadow-luxury overflow-hidden">
            <div class="p-6 border-b border-gray-200">
              <div class="flex items-center justify-between">
                <h2 class="text-lg font-display-en font-bold text-gray-900">
                  {{ t('Marquee Brands Management') }}
                </h2>
                <button
                  @click="showAddMarqueeModal = true"
                  class="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  {{ t('Add Brand') }}
                </button>
              </div>
            </div>
            <div class="p-6">
              <div class="flex flex-wrap gap-4">
                <div 
                  v-for="brand in homepageData.marqueeBrands" 
                  :key="brand.id"
                  class="relative group"
                >
                  <img
                    :src="brand.logo"
                    :alt="brand.name"
                    class="w-16 h-16 object-contain p-2 bg-white border border-gray-200 rounded-lg"
                  />
                  <button
                    @click="removeMarqueeBrand(brand.id)"
                    class="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Brand Modal -->
    <div v-if="showAddBrandModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-bold text-gray-900 mb-4">{{ t('Add New Brand') }}</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('Brand Name') }}</label>
            <input
              v-model="newBrand.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Tom Ford"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('Image URL') }}</label>
            <input
              v-model="newBrand.image"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('Signature Scent') }}</label>
            <input
              v-model="newBrand.signature"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Noir Extreme"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('Price') }} ({{ t('currencyLE') }})</label>
            <input
              v-model="newBrand.price"
              type="number"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="450"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('Slug') }}</label>
            <input
              v-model="newBrand.slug"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="tom-ford"
            />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="showAddBrandModal = false"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {{ t('Cancel') }}
          </button>
          <button
            @click="addNewBrand"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {{ editingBrand ? t('Update Brand') : t('Add Brand') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add Offer Modal -->
    <div v-if="showAddOfferModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-bold text-gray-900 mb-4">{{ t('Add New Offer') }}</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('Offer Title') }}</label>
            <input
              v-model="newOffer.title"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Coco Chanel"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('Image URL') }}</label>
            <input
              v-model="newOffer.imageUrl"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://example.com/offer.jpg"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('Subtitle') }}</label>
            <input
              v-model="newOffer.subtitle"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Iconic Eau De Parfum"
            />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('Old Price') }} ({{ t('currencyLE') }})</label>
              <input
                v-model="newOffer.oldPrice"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="1500"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('New Price') }} ({{ t('currencyLE') }})</label>
              <input
                v-model="newOffer.newPrice"
                type="number"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="150"
              />
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="showAddOfferModal = false"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {{ t('Cancel') }}
          </button>
          <button
            @click="addNewOffer"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {{ editingOffer ? t('Update Offer') : t('Add Offer') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Add Marquee Brand Modal -->
    <div v-if="showAddMarqueeModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-bold text-gray-900 mb-4">{{ t('Add Marquee Brand') }}</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('Brand Name') }}</label>
            <input
              v-model="newMarqueeBrand.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Tom Ford"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ t('Logo URL') }}</label>
            <input
              v-model="newMarqueeBrand.logo"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="https://example.com/logo.png"
            />
          </div>
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <button
            @click="showAddMarqueeModal = false"
            class="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            {{ t('Cancel') }}
          </button>
          <button
            @click="addNewMarqueeBrand"
            class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            {{ t('Add Brand') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { useHomepageStore } from '@/stores/homepage'
import AdminSidebar from '@/components/Admin/AdminSidebar.vue'

const languageStore = useLanguageStore()
const homepageStore = useHomepageStore()

const { t, formatDate } = languageStore

// Homepage data from store
const homepageData = reactive({
  heroBanner: {
    imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=1600&h=900&fit=crop&crop=center',
    title: 'Luxury Perfumes',
    subtitle: 'Premium Collection'
  },
  featuredBrands: [] as any[],
  activeOffers: [] as any[],
  marqueeBrands: [] as any[]
})

// Dark mode state
const isDarkMode = ref(false)

// Modal states
const showAddBrandModal = ref(false)
const showAddOfferModal = ref(false)
const showAddMarqueeModal = ref(false)
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
  newPrice: 0
})

const newMarqueeBrand = reactive({
  id: '',
  name: '',
  logo: ''
})

// Initialize data
onMounted(async () => {
  await loadHomepageData()
  
  // Load dark mode preference
  const savedDarkMode = localStorage.getItem('darkMode')
  if (savedDarkMode) {
    isDarkMode.value = savedDarkMode === 'true'
  }
})

// Load homepage data from store/backend
const loadHomepageData = async () => {
  try {
    // In a real app, this would come from an API
    // For now, we'll use sample data
    homepageData.featuredBrands = [
      {
        id: '1',
        name: 'Tom Ford',
        image: 'https://images.unsplash.com/photo-1590736966894-cb4c52f4c4a9?w=500&fit=crop',
        signature: 'Noir Extreme',
        price: 450,
        slug: 'tom-ford'
      },
      {
        id: '2',
        name: 'YSL',
        image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=500&fit=crop',
        signature: 'Black Opium',
        price: 380,
        slug: 'ysl'
      },
      {
        id: '3',
        name: 'Versace',
        image: 'https://images.unsplash.com/photo-1611077640180-0ca237d2553d?w=500&fit=crop',
        signature: 'Eros Flame',
        price: 520,
        slug: 'versace'
      },
      {
        id: '4',
        name: 'Chanel',
        image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500&fit=crop',
        signature: 'Coco Mademoiselle',
        price: 600,
        slug: 'chanel'
      },
      {
        id: '5',
        name: 'Dior',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&fit=crop',
        signature: 'Sauvage Elixir',
        price: 550,
        slug: 'dior'
      },
      {
        id: '6',
        name: 'Gucci',
        image: 'https://images.unsplash.com/photo-1592948046993-4c0a3eb79b4c?w=500&fit=crop',
        signature: 'Bloom',
        price: 480,
        slug: 'gucci'
      }
    ]

    homepageData.activeOffers = [
      {
        id: '1',
        title: 'Coco Chanel',
        imageUrl: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=500&h=700&fit=crop',
        subtitle: 'Iconic Eau De Parfum',
        oldPrice: 1500,
        newPrice: 150
      }
    ]

    homepageData.marqueeBrands = [
      {
        id: '1',
        name: 'Tom Ford',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Tom_Ford_logo.svg/800px-Tom_Ford_logo.svg.png'
      },
      {
        id: '2',
        name: 'YSL',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Yves_Saint_Laurent_logo.svg/800px-Yves_Saint_Laurent_logo.svg.png'
      },
      {
        id: '3',
        name: 'Versace',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Versace_logo.svg/800px-Versace_logo.svg.png'
      },
      {
        id: '4',
        name: 'Chanel',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Chanel_logo.svg/800px-Chanel_logo.svg.png'
      },
      {
        id: '5',
        name: 'Dior',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Christian_Dior_logo.svg/800px-Christian_Dior_logo.svg.png'
      },
      {
        id: '6',
        name: 'Gucci',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Gucci_logo.svg/800px-Gucci_logo.svg.png'
      }
    ]
  } catch (error) {
    console.error('Error loading homepage data:', error)
  }
}

// Hero Banner Methods
const updateHeroBanner = async () => {
  try {
    // In a real app, save to backend
    console.log('Updating hero banner:', homepageData.heroBanner)
    alert(t('Hero banner updated successfully!'))
  } catch (error) {
    console.error('Error updating hero banner:', error)
    alert(t('Failed to update hero banner'))
  }
}

// Brand Methods
const editBrand = (brand: any) => {
  Object.assign(newBrand, brand)
  editingBrand.value = true
  showAddBrandModal.value = true
}

const addNewBrand = async () => {
  try {
    if (editingBrand.value) {
      // Update existing brand
      const index = homepageData.featuredBrands.findIndex(b => b.id === newBrand.id)
      if (index !== -1) {
        homepageData.featuredBrands[index] = { ...newBrand }
      }
    } else {
      // Add new brand
      const newId = Date.now().toString()
      homepageData.featuredBrands.push({
        ...newBrand,
        id: newId
      })
    }
    
    // Save to backend in real app
    console.log('Saving brands:', homepageData.featuredBrands)
    
    // Reset form
    resetNewBrand()
    showAddBrandModal.value = false
    editingBrand.value = false
    
    alert(t('Brand saved successfully!'))
  } catch (error) {
    console.error('Error saving brand:', error)
    alert(t('Failed to save brand'))
  }
}

const removeBrand = (id: string) => {
  if (confirm(t('Are you sure you want to remove this brand?'))) {
    homepageData.featuredBrands = homepageData.featuredBrands.filter(b => b.id !== id)
    // Save to backend in real app
    alert(t('Brand removed successfully!'))
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
  showAddOfferModal.value = true
}

const addNewOffer = async () => {
  try {
    if (editingOffer.value) {
      // Update existing offer
      const index = homepageData.activeOffers.findIndex(o => o.id === newOffer.id)
      if (index !== -1) {
        homepageData.activeOffers[index] = { ...newOffer }
      }
    } else {
      // Add new offer
      const newId = Date.now().toString()
      homepageData.activeOffers.push({
        ...newOffer,
        id: newId
      })
    }
    
    // Save to backend in real app
    console.log('Saving offers:', homepageData.activeOffers)
    
    // Reset form
    resetNewOffer()
    showAddOfferModal.value = false
    editingOffer.value = false
    
    alert(t('Offer saved successfully!'))
  } catch (error) {
    console.error('Error saving offer:', error)
    alert(t('Failed to save offer'))
  }
}

const removeOffer = (id: string) => {
  if (confirm(t('Are you sure you want to remove this offer?'))) {
    homepageData.activeOffers = homepageData.activeOffers.filter(o => o.id !== id)
    // Save to backend in real app
    alert(t('Offer removed successfully!'))
  }
}

const resetNewOffer = () => {
  Object.assign(newOffer, {
    id: '',
    title: '',
    imageUrl: '',
    subtitle: '',
    oldPrice: 0,
    newPrice: 0
  })
}

// Marquee Brand Methods
const addNewMarqueeBrand = async () => {
  try {
    const newId = Date.now().toString()
    homepageData.marqueeBrands.push({
      ...newMarqueeBrand,
      id: newId
    })
    
    // Save to backend in real app
    console.log('Saving marquee brands:', homepageData.marqueeBrands)
    
    // Reset form
    resetNewMarqueeBrand()
    showAddMarqueeModal.value = false
    
    alert(t('Marquee brand added successfully!'))
  } catch (error) {
    console.error('Error adding marquee brand:', error)
    alert(t('Failed to add marquee brand'))
  }
}

const removeMarqueeBrand = (id: string) => {
  if (confirm(t('Are you sure you want to remove this marquee brand?'))) {
    homepageData.marqueeBrands = homepageData.marqueeBrands.filter(b => b.id !== id)
    // Save to backend in real app
    alert(t('Marquee brand removed successfully!'))
  }
}

const resetNewMarqueeBrand = () => {
  Object.assign(newMarqueeBrand, {
    id: '',
    name: '',
    logo: ''
  })
}

// Dark Mode Toggle
const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value
  localStorage.setItem('darkMode', isDarkMode.value.toString())
  
  // In a real app, you would update a global state or emit an event
  // For now, we'll just update the body class
  if (isDarkMode.value) {
    document.body.classList.add('dark-mode')
  } else {
    document.body.classList.remove('dark-mode')
  }
}

// Export data (for backup)
const exportHomepageData = () => {
  const dataStr = JSON.stringify(homepageData, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
  const exportFileDefaultName = 'homepage-data-backup.json'
  
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
  
  alert(t('Homepage data exported successfully!'))
}

// Import data (for restore)
const importHomepageData = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        Object.assign(homepageData, data)
        alert(t('Homepage data imported successfully!'))
      } catch (error) {
        alert(t('Invalid file format'))
      }
    }
    reader.readAsText(input.files[0])
  }
}
</script>

<style scoped>
.shadow-luxury {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.transition-colors {
  transition: all 0.2s ease-in-out;
}

/* Dark mode styles */
:global(.dark-mode) .bg-white {
  background-color: #1f2937;
  color: #f9fafb;
}

:global(.dark-mode) .bg-gray-50 {
  background-color: #111827;
}

:global(.dark-mode) .text-gray-900 {
  color: #f9fafb;
}

:global(.dark-mode) .text-gray-600,
:global(.dark-mode) .text-gray-500 {
  color: #d1d5db;
}

:global(.dark-mode) .border-gray-200 {
  border-color: #374151;
}

:global(.dark-mode) .divide-gray-100 > :not([hidden]) ~ :not([hidden]) {
  border-color: #374151;
}

:global(.dark-mode) .hover\:bg-gray-50:hover {
  background-color: #374151;
}
</style>