<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Background overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="close"></div>

    <div class="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <!-- Modal panel -->
      <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
        <!-- Header -->
        <div class="bg-white px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900" id="modal-title">
                {{ editing ? t('Edit Product') : t('Add New Product') }}
              </h2>
              <p class="mt-1 text-sm text-gray-500">
                {{ t('Fill in the product details below') }}
              </p>
            </div>
            <button
              type="button"
              class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              @click="close"
            >
              <span class="sr-only">{{ t('Close') }}</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Form content -->
        <div class="px-6 py-4 max-h-[60vh] overflow-y-auto">
          <div class="space-y-6">
            <!-- Brand Selection Section -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                {{ t('Product Brand') }} *
              </label>
              
              <!-- Brand Selection Toggle -->
              <div class="mb-4">
                <div class="flex flex-wrap gap-4">
                  <button
                    type="button"
                    @click="brandSelectionMode = 'existing'"
                    :class="[
                      'px-4 py-2.5 text-sm font-medium rounded-lg transition-colors',
                      brandSelectionMode === 'existing' 
                        ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    ]"
                  >
                    {{ t('Select Existing Brand') }}
                  </button>
                  <button
                    type="button"
                    @click="brandSelectionMode = 'new'"
                    :class="[
                      'px-4 py-2.5 text-sm font-medium rounded-lg transition-colors',
                      brandSelectionMode === 'new' 
                        ? 'bg-primary-100 text-primary-700 border border-primary-300' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    ]"
                  >
                    {{ t('Create New Brand') }}
                  </button>
                </div>
              </div>

              <!-- Existing Brand Selection -->
              <div v-if="brandSelectionMode === 'existing'" class="space-y-4">
                <div class="relative">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ t('Select Brand') }} *
                  </label>
                  <div class="relative">
                    <input
                      v-model="brandSearchQuery"
                      type="text"
                      class="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      :placeholder="t('Search brands...')"
                      @input="onBrandSearch"
                    />
                    <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  
                  <!-- Loading state -->
                  <div v-if="brandsLoading" class="mt-2 text-center py-4">
                    <div class="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
                    <p class="text-sm text-gray-500 mt-2">{{ t('Loading brands...') }}</p>
                  </div>
                  
                  <!-- Brand List -->
                  <div v-else-if="filteredBrands.length > 0" class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto p-2 border border-gray-200 rounded-lg">
                    <div
                      v-for="brand in filteredBrands"
                      :key="brand.id"
                      @click="selectExistingBrand(brand)"
                      :class="[
                        'p-3 border rounded-lg cursor-pointer transition-all hover:border-primary-500 hover:bg-primary-50',
                        selectedBrandId === brand.id 
                          ? 'border-primary-500 bg-primary-50' 
                          : 'border-gray-200'
                      ]"
                    >
                      <div class="flex items-center gap-3">
                        <div class="w-10 h-10 flex-shrink-0">
                          <img 
                            :src="brand.image || '/images/placeholder-brand.jpg'" 
                            :alt="brand.name"
                            class="w-10 h-10 object-cover rounded-md"
                          />
                        </div>
                        <div class="flex-1 min-w-0">
                          <h4 class="text-sm font-medium text-gray-900 truncate">{{ brand.name }}</h4>
                          <p class="text-xs text-gray-500 truncate">{{ brand.category || t('Uncategorized') }}</p>
                        </div>
                        <svg 
                          v-if="selectedBrandId === brand.id" 
                          class="w-5 h-5 text-primary-600 flex-shrink-0" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  <!-- No brands found -->
                  <div v-else-if="!brandsLoading" class="mt-3 p-4 text-center border border-gray-200 rounded-lg">
                    <svg class="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <p class="mt-2 text-sm text-gray-600">
                      {{ t('No brands found. Try searching or create a new brand.') }}
                    </p>
                  </div>
                </div>
                
                <!-- Selected Brand Preview -->
                <div v-if="selectedBrand" class="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 flex-shrink-0">
                        <img 
                          :src="selectedBrand.image || '/images/placeholder-brand.jpg'" 
                          :alt="selectedBrand.name"
                          class="w-12 h-12 object-cover rounded-md"
                        />
                      </div>
                      <div>
                        <h4 class="text-sm font-medium text-gray-900">{{ selectedBrand.name }}</h4>
                        <p class="text-xs text-gray-500">{{ selectedBrand.category || t('Uncategorized') }}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      @click="clearBrandSelection"
                      class="text-sm text-red-600 hover:text-red-800"
                    >
                      {{ t('Change') }}
                    </button>
                  </div>
                </div>
              </div>

              <!-- New Brand Form -->
              <div v-else class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Brand Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ t('Brand Name') }} *
                    </label>
                    <input
                      v-model="newBrand.name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      :class="{ 'border-red-300': brandErrors.name }"
                      :placeholder="t('e.g., Tom Ford')"
                    />
                    <p v-if="brandErrors.name" class="mt-1 text-sm text-red-600">
                      {{ brandErrors.name }}
                    </p>
                  </div>
                  
                  <!-- Brand Slug -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ t('Brand Slug') }} *
                    </label>
                    <input
                      v-model="newBrand.slug"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      :class="{ 'border-red-300': brandErrors.slug }"
                      :placeholder="t('tom-ford')"
                    />
                    <p v-if="brandErrors.slug" class="mt-1 text-sm text-red-600">
                      {{ brandErrors.slug }}
                    </p>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <!-- Brand Category -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ t('Brand Category') }} *
                    </label>
                    <select
                      v-model="newBrand.category"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      :class="{ 'border-red-300': brandErrors.category }"
                    >
                      <option value="">{{ t('Select category') }}</option>
                      <option value="luxury">{{ t('Luxury') }}</option>
                      <option value="designer">{{ t('Designer') }}</option>
                      <option value="niche">{{ t('Niche') }}</option>
                      <option value="celebrity">{{ t('Celebrity') }}</option>
                      <option value="independent">{{ t('Independent') }}</option>
                    </select>
                    <p v-if="brandErrors.category" class="mt-1 text-sm text-red-600">
                      {{ brandErrors.category }}
                    </p>
                  </div>
                  
                  <!-- Brand Price -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ t('Brand Price Range') }}
                    </label>
                    <input
                      v-model.number="newBrand.price"
                      type="number"
                      min="0"
                      step="0.01"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      :placeholder="t('Average price')"
                    />
                  </div>
                </div>

                <!-- Brand Image -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ t('Brand Logo') }}
                    <span class="text-xs text-gray-500 ml-2">
                      {{ t('Optional') }}
                    </span>
                  </label>
                  <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <!-- Image upload area -->
                    <div 
                      @click="triggerBrandImageInput"
                      class="w-24 h-24 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-lg 
                             flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 
                             transition-colors bg-gray-50"
                    >
                      <div v-if="brandImagePreview" class="relative w-full h-full">
                        <img 
                          :src="brandImagePreview" 
                          :alt="t('Brand logo preview')" 
                          class="w-full h-full object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          @click.stop="removeBrandImage"
                          class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white 
                                 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <div v-else class="text-center p-3">
                        <svg class="w-6 h-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        <p class="mt-1 text-xs text-gray-600">{{ t('Upload Logo') }}</p>
                      </div>
                      <input
                        ref="brandImageInput"
                        type="file"
                        accept="image/*"
                        class="hidden"
                        @change="handleBrandImageUpload"
                      />
                    </div>
                    
                    <!-- Brand Description -->
                    <div class="flex-1">
                      <label class="block text-sm font-medium text-gray-700 mb-2">
                        {{ t('Brand Description') }}
                      </label>
                      <textarea
                        v-model="newBrand.description"
                        rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        :placeholder="t('Brief description about the brand')"
                      />
                    </div>
                  </div>
                </div>

                <!-- Brand Status -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ t('Brand Status') }}
                  </label>
                  <div class="flex items-center gap-4">
                    <label class="inline-flex items-center">
                      <input
                        v-model="newBrand.isActive"
                        type="radio"
                        :value="true"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span class="ml-2 text-sm text-gray-700">{{ t('Active') }}</span>
                    </label>
                    <label class="inline-flex items-center">
                      <input
                        v-model="newBrand.isActive"
                        type="radio"
                        :value="false"
                        class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <span class="ml-2 text-sm text-gray-700">{{ t('Inactive') }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Product Image -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                {{ t('Product Image') }} *
                <span class="text-xs text-gray-500 ml-2">
                  {{ t('Recommended: 800x800px, Max 5MB') }}
                </span>
              </label>
              <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6" :class="{ 'sm:flex-row-reverse': isRTL }">
                <!-- Image upload area -->
                <div 
                  @click="triggerFileInput"
                  class="w-40 h-40 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-lg 
                         flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 
                         transition-colors bg-gray-50"
                >
                  <div v-if="imagePreview" class="relative w-full h-full">
                    <img 
                      :src="imagePreview" 
                      :alt="t('Product preview')" 
                      class="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      @click.stop="removeImage"
                      class="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white 
                             rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div v-else class="text-center p-4">
                    <svg class="w-10 h-10 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                    <p class="mt-2 text-sm text-gray-600">{{ t('Upload Image') }}</p>
                    <p class="mt-1 text-xs text-gray-500">
                      {{ t('Click to upload') }}
                    </p>
                  </div>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleImageUpload"
                  />
                </div>
                
                <!-- Image tips -->
                <div class="flex-1">
                  <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 class="text-sm font-medium text-blue-800 mb-2">
                      {{ t('Image Requirements') }}
                    </h4>
                    <ul class="text-xs text-blue-700 space-y-1">
                      <li class="flex items-start gap-2">
                        <svg class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{{ t('Use high-quality product photos') }}</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <svg class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{{ t('Square format works best') }}</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <svg class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{{ t('White background recommended') }}</span>
                      </li>
                      <li class="flex items-start gap-2">
                        <svg class="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{{ t('Show the product clearly') }}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <p v-if="imageError" class="mt-2 text-sm text-red-600">{{ imageError }}</p>
            </div>

            <!-- Product Name -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('English Name') }} *
                </label>
                <input
                  v-model="formData.name.en"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  :class="{ 'border-red-300': errors.name?.en }"
                  :placeholder="t('Enter product name in English')"
                />
                <p v-if="errors.name?.en" class="mt-1 text-sm text-red-600">
                  {{ errors.name.en }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('Arabic Name') }} *
                </label>
                <input
                  v-model="formData.name.ar"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-right"
                  :class="{ 'border-red-300': errors.name?.ar }"
                  :placeholder="t('أدخل اسم المنتج بالعربية')"
                  dir="rtl"
                />
                <p v-if="errors.name?.ar" class="mt-1 text-sm text-red-600">
                  {{ errors.name.ar }}
                </p>
              </div>
            </div>

            <!-- Category & Price -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('Category') }} *
                </label>
                <select
                  v-model="formData.category"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  :class="{ 'border-red-300': errors.category }"
                >
                  <option value="">{{ t('Select a category') }}</option>
                  <option 
                    v-for="category in categories" 
                    :key="category.id" 
                    :value="category.id"
                  >
                    {{ category[currentLanguage] }}
                  </option>
                </select>
                <p v-if="errors.category" class="mt-1 text-sm text-red-600">
                  {{ errors.category }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('Price') }} ({{ t('currencyLE') }}) *
                </label>
                <div class="mt-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">EGP</span>
                  </div>
                  <input
                    v-model.number="formData.price"
                    type="number"
                    min="0"
                    step="0.01"
                    required
                    class="w-full pl-14 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    :class="{ 'border-red-300': errors.price }"
                    :placeholder="t('0.00')"
                  />
                </div>
                <p v-if="errors.price" class="mt-1 text-sm text-red-600">
                  {{ errors.price }}
                </p>
              </div>
            </div>

            <!-- Size & Concentration -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('Size') }} *
                </label>
                <select
                  v-model="formData.size"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  :class="{ 'border-red-300': errors.size }"
                >
                  <option value="">{{ t('Select size') }}</option>
                  <option value="10ml">10ml</option>
                  <option value="30ml">30ml</option>
                  <option value="50ml">50ml</option>
                  <option value="75ml">75ml</option>
                  <option value="100ml">100ml</option>
                  <option value="150ml">150ml</option>
                  <option value="200ml">200ml</option>
                </select>
                <p v-if="errors.size" class="mt-1 text-sm text-red-600">
                  {{ errors.size }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('Concentration') }} *
                </label>
                <select
                  v-model="formData.concentration"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  :class="{ 'border-red-300': errors.concentration }"
                >
                  <option value="">{{ t('Select concentration') }}</option>
                  <option value="EDT">{{ t('Eau de Toilette (EDT)') }}</option>
                  <option value="EDP">{{ t('Eau de Parfum (EDP)') }}</option>
                  <option value="Parfum">{{ t('Parfum') }}</option>
                  <option value="Extrait">{{ t('Extrait de Parfum') }}</option>
                  <option value="Cologne">{{ t('Cologne') }}</option>
                </select>
                <p v-if="errors.concentration" class="mt-1 text-sm text-red-600">
                  {{ errors.concentration }}
                </p>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                {{ t('Description') }} *
              </label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-xs text-gray-500 mb-2">
                    {{ t('English Description') }}
                  </label>
                  <textarea
                    v-model="formData.description.en"
                    rows="4"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    :class="{ 'border-red-300': errors.description?.en }"
                    :placeholder="t('Enter product description in English')"
                  />
                  <p v-if="errors.description?.en" class="mt-1 text-sm text-red-600">
                    {{ errors.description.en }}
                  </p>
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-2">
                    {{ t('Arabic Description') }}
                  </label>
                  <textarea
                    v-model="formData.description.ar"
                    rows="4"
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-right"
                    :class="{ 'border-red-300': errors.description?.ar }"
                    :placeholder="t('أدخل وصف المنتج بالعربية')"
                    dir="rtl"
                  />
                  <p v-if="errors.description?.ar" class="mt-1 text-sm text-red-600">
                    {{ errors.description.ar }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Fragrance Notes -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">
                {{ t('Fragrance Notes') }}
              </label>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs text-gray-600 mb-2">
                    {{ t('Top Notes') }}
                  </label>
                  <div class="space-y-2">
                    <div 
                      v-for="(note, index) in formData.notes.top" 
                      :key="`top-${index}`"
                      class="flex items-center gap-2"
                    >
                      <input
                        v-model="formData.notes.top[index]"
                        type="text"
                        class="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                        :placeholder="t('Note')"
                      />
                      <button
                        type="button"
                        @click="removeNote('top', index)"
                        class="p-1.5 text-red-600 hover:text-red-800"
                        :title="t('Remove note')"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                    <button
                      type="button"
                      @click="addNote('top')"
                      class="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      + {{ t('Add Top Note') }}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label class="block text-xs text-gray-600 mb-2">
                    {{ t('Heart Notes') }}
                  </label>
                  <div class="space-y-2">
                    <div 
                      v-for="(note, index) in formData.notes.heart" 
                      :key="`heart-${index}`"
                      class="flex items-center gap-2"
                    >
                      <input
                        v-model="formData.notes.heart[index]"
                        type="text"
                        class="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                        :placeholder="t('Note')"
                      />
                      <button
                        type="button"
                        @click="removeNote('heart', index)"
                        class="p-1.5 text-red-600 hover:text-red-800"
                        :title="t('Remove note')"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                    <button
                      type="button"
                      @click="addNote('heart')"
                      class="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      + {{ t('Add Heart Note') }}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label class="block text-xs text-gray-600 mb-2">
                    {{ t('Base Notes') }}
                  </label>
                  <div class="space-y-2">
                    <div 
                      v-for="(note, index) in formData.notes.base" 
                      :key="`base-${index}`"
                      class="flex items-center gap-2"
                    >
                      <input
                        v-model="formData.notes.base[index]"
                        type="text"
                        class="flex-1 px-3 py-2 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                        :placeholder="t('Note')"
                      />
                      <button
                        type="button"
                        @click="removeNote('base', index)"
                        class="p-1.5 text-red-600 hover:text-red-800"
                        :title="t('Remove note')"
                      >
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                      </button>
                    </div>
                    <button
                      type="button"
                      @click="addNote('base')"
                      class="text-xs text-primary-600 hover:text-primary-700 font-medium"
                    >
                      + {{ t('Add Base Note') }}
                    </button>
                  </div>
                </div>
              </div>
              <p v-if="errors.notes" class="mt-2 text-sm text-red-600">{{ errors.notes }}</p>
            </div>

            <!-- Additional Options -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('Stock Quantity') }}
                </label>
                <input
                  v-model.number="formData.stock"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  :placeholder="t('Leave empty for unlimited')"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('SKU') }}
                </label>
                <input
                  v-model="formData.sku"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  :placeholder="t('PROD-001')"
                />
              </div>
            </div>

            <!-- Flags -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex items-center gap-3">
                <input
                  v-model="formData.isBestSeller"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label class="text-sm font-medium text-gray-700">
                  {{ t('Mark as Best Seller') }}
                </label>
              </div>
              <div class="flex items-center gap-3">
                <input
                  v-model="formData.isNew"
                  type="checkbox"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label class="text-sm font-medium text-gray-700">
                  {{ t('Mark as New Arrival') }}
                </label>
              </div>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('Status') }}
              </label>
              <div class="flex items-center gap-4">
                <label class="inline-flex items-center">
                  <input
                    v-model="formData.isActive"
                    type="radio"
                    :value="true"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ t('Active') }}</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    v-model="formData.isActive"
                    type="radio"
                    :value="false"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ t('Inactive') }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 border-t border-gray-200 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            @click="save"
            :disabled="loading"
            class="inline-flex w-full justify-center rounded-md bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <template v-if="loading">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ t('Saving...') }}
            </template>
            <template v-else>
              {{ editing ? t('Update Product') : t('Add Product') }}
            </template>
          </button>
          <button
            type="button"
            @click="close"
            :disabled="loading"
            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('Cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { useProductsStore } from '@/stores/products'
import { useBrandsStore } from '@/stores/brands'
import type { Product, ProductFormData } from '@/types'

const languageStore = useLanguageStore()
const productsStore = useProductsStore()
const brandsStore = useBrandsStore()

const { currentLanguage, isRTL, t } = languageStore
const { categories } = productsStore

const props = defineProps<{
  product?: Product
  brand?: any // Optional brand prop if opening from brand page
}>()

const emit = defineEmits<{
  close: []
  save: [data: {
    productData: ProductFormData
    brandId?: string
    createNewBrand?: boolean
    newBrandData?: any
  }]
}>()

// Brand selection state
const brandSelectionMode = ref<'existing' | 'new'>('existing')
const brands = ref<any[]>([])
const brandsLoading = ref(false)
const brandSearchQuery = ref('')
const filteredBrands = ref<any[]>([])
const selectedBrandId = ref('')
const selectedBrand = ref<any>(null)

// New brand form
const newBrand = reactive({
  name: '',
  slug: '',
  category: '',
  description: '',
  image: '',
  signature: '',
  price: 0,
  isActive: true,
  imageFile: undefined as File | undefined,
})

const brandErrors = reactive<Record<string, string>>({})
const brandImageInput = ref<HTMLInputElement | null>(null)
const brandImagePreview = ref('')

// Form data
const formData = reactive<ProductFormData>({
  name: { en: '', ar: '' },
  slug: '',
  category: '',
  price: 0,
  size: '',
  concentration: '',
  description: { en: '', ar: '' },
  notes: { top: [''], heart: [''], base: [''] },
  imageUrl: '',
  imageFile: undefined,
  isBestSeller: false,
  isNew: false,
  isActive: true,
  stock: 0,
  sku: ''
})

// Form state
const errors = reactive<Record<string, any>>({})
const loading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const imagePreview = ref('')
const imageError = ref('')

// Computed
const editing = computed(() => !!props.product?.id)

// Initialize form
const initializeForm = async () => {
  if (props.product) {
    // Editing existing product
    Object.assign(formData, {
      ...props.product,
      imageFile: undefined
    })
    
    if (props.product.imageUrl) {
      imagePreview.value = props.product.imageUrl
    }
    
    // Ensure notes arrays exist
    if (!props.product.notes) {
      formData.notes = { top: [''], heart: [''], base: [''] }
    }
    
    // Set selected brand if editing
    if (props.product.brandId) {
      selectedBrandId.value = props.product.brandId
      await loadBrands()
      const foundBrand = brands.value.find(b => b.id === props.product!.brandId)
      if (foundBrand) {
        selectedBrand.value = foundBrand
        brandSelectionMode.value = 'existing'
      }
    }
  } else {
    // New product
    Object.assign(formData, {
      name: { en: '', ar: '' },
      slug: '',
      category: '',
      price: 0,
      size: '',
      concentration: '',
      description: { en: '', ar: '' },
      notes: { top: [''], heart: [''], base: [''] },
      imageUrl: '',
      imageFile: undefined,
      isBestSeller: false,
      isNew: false,
      isActive: true,
      stock: 0,
      sku: ''
    })
    imagePreview.value = ''
    imageError.value = ''
    
    // Reset brand selection
    selectedBrandId.value = ''
    selectedBrand.value = null
    newBrand.name = ''
    newBrand.slug = ''
    newBrand.category = ''
    newBrand.description = ''
    newBrand.image = ''
    newBrand.signature = ''
    newBrand.price = 0
    newBrand.imageFile = undefined
    newBrand.isActive = true
    brandImagePreview.value = ''
    
    // If brand prop is provided, select it
    if (props.brand) {
      selectedBrandId.value = props.brand.id
      selectedBrand.value = props.brand
      brandSelectionMode.value = 'existing'
    }
  }
  
  // Clear errors
  Object.keys(errors).forEach(key => delete errors[key])
  Object.keys(brandErrors).forEach(key => delete brandErrors[key])
}

// Load brands from brands store
const loadBrands = async () => {
  brandsLoading.value = true
  try {
    // Load brands from brands store
    if (brandsStore.brands.length === 0) {
      await brandsStore.loadBrands()
    }
    
    brands.value = brandsStore.brands.map(brand => ({
      id: brand.id,
      name: brand.name,
      slug: brand.slug,
      category: brand.category,
      image: brand.image || '/images/placeholder-brand.jpg',
      isActive: brand.isActive
    }))
    
    filteredBrands.value = brands.value
  } catch (error) {
    console.error('Error loading brands:', error)
  } finally {
    brandsLoading.value = false
  }
}

// Watch for product changes
watch(() => props.product, initializeForm, { immediate: true })

// Load brands on mount
onMounted(async () => {
  await loadBrands()
  
  // Keyboard event listener
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close()
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  // Remove event listener on unmount
  return () => {
    document.removeEventListener('keydown', handleKeydown)
  }
})

// Brand search
const onBrandSearch = () => {
  const query = brandSearchQuery.value.toLowerCase().trim()
  if (!query) {
    filteredBrands.value = brands.value
  } else {
    filteredBrands.value = brands.value.filter(brand => 
      brand.name.toLowerCase().includes(query) ||
      (brand.category && brand.category.toLowerCase().includes(query)) ||
      (brand.slug && brand.slug.toLowerCase().includes(query))
    )
  }
}

// Brand selection methods
const selectExistingBrand = (brand: any) => {
  selectedBrandId.value = brand.id
  selectedBrand.value = brand
}

const clearBrandSelection = () => {
  selectedBrandId.value = ''
  selectedBrand.value = null
  brandSearchQuery.value = ''
  filteredBrands.value = brands.value
}

// Generate slug for new brand
const generateBrandSlug = () => {
  if (!newBrand.name) return
  
  const slug = newBrand.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
  
  newBrand.slug = slug
}

// Watch brand name for slug generation
watch(() => newBrand.name, () => {
  if (brandSelectionMode.value === 'new') {
    generateBrandSlug()
  }
})

// Brand image methods
const triggerBrandImageInput = () => {
  brandImageInput.value?.click()
}

const handleBrandImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return
  
  // Validate image
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  const maxSize = 2 * 1024 * 1024 // 2MB for logos
  
  if (!validTypes.includes(file.type)) {
    alert(t('Please upload a JPEG, PNG, or WebP image'))
    return
  }
  
  if (file.size > maxSize) {
    alert(t('Logo size must be less than 2MB'))
    return
  }
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    brandImagePreview.value = e.target?.result as string
    newBrand.imageFile = file
  }
  reader.readAsDataURL(file)
}

const removeBrandImage = () => {
  brandImagePreview.value = ''
  newBrand.imageFile = undefined
  if (brandImageInput.value) {
    brandImageInput.value.value = ''
  }
}

// Product image methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return
  
  // Validate image
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  const maxSize = 5 * 1024 * 1024 // 5MB
  
  if (!validTypes.includes(file.type)) {
    imageError.value = t('Please upload a JPEG, PNG, or WebP image')
    return
  }
  
  if (file.size > maxSize) {
    imageError.value = t('Image size must be less than 5MB')
    return
  }
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
    formData.imageFile = file
    imageError.value = ''
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  imagePreview.value = ''
  formData.imageUrl = ''
  formData.imageFile = undefined
  imageError.value = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const addNote = (type: 'top' | 'heart' | 'base') => {
  formData.notes[type].push('')
}

const removeNote = (type: 'top' | 'heart' | 'base', index: number) => {
  formData.notes[type].splice(index, 1)
}

// Validation
const validateBrand = (): boolean => {
  let isValid = true
  
  // Reset errors
  Object.keys(brandErrors).forEach(key => delete brandErrors[key])
  
  if (brandSelectionMode.value === 'existing') {
    if (!selectedBrandId.value) {
      brandErrors.selection = t('Please select a brand')
      isValid = false
    }
  } else {
    if (!newBrand.name.trim()) {
      brandErrors.name = t('Brand name is required')
      isValid = false
    }
    
    if (!newBrand.slug.trim()) {
      brandErrors.slug = t('Brand slug is required')
      isValid = false
    }
    
    if (!newBrand.category) {
      brandErrors.category = t('Brand category is required')
      isValid = false
    }
  }
  
  return isValid
}

const validateForm = (): boolean => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => delete errors[key])
  
  // Validate brand
  if (!validateBrand()) {
    isValid = false
  }
  
  // Validate name
  if (!formData.name.en?.trim()) {
    errors.name = { ...errors.name, en: t('English name is required') }
    isValid = false
  }
  
  if (!formData.name.ar?.trim()) {
    errors.name = { ...errors.name, ar: t('Arabic name is required') }
    isValid = false
  }
  
  // Validate image
  if (!imagePreview.value && !formData.imageUrl) {
    errors.image = t('Product image is required')
    isValid = false
  }
  
  // Validate category
  if (!formData.category) {
    errors.category = t('Category is required')
    isValid = false
  }
  
  // Validate price
  if (!formData.price || formData.price <= 0) {
    errors.price = t('Valid price is required')
    isValid = false
  }
  
  // Validate size
  if (!formData.size) {
    errors.size = t('Size is required')
    isValid = false
  }
  
  // Validate concentration
  if (!formData.concentration) {
    errors.concentration = t('Concentration is required')
    isValid = false
  }
  
  // Validate description
  if (!formData.description.en?.trim()) {
    errors.description = { ...errors.description, en: t('English description is required') }
    isValid = false
  }
  
  if (!formData.description.ar?.trim()) {
    errors.description = { ...errors.description, ar: t('Arabic description is required') }
    isValid = false
  }
  
  return isValid
}

const save = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    // Generate slug from English name if not provided
    if (!formData.slug && formData.name.en) {
      formData.slug = formData.name.en
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim()
    }
    
    // Prepare product data
    const productData = { ...formData }
    
    if (brandSelectionMode.value === 'existing') {
      // Use existing brand
      emit('save', { 
        productData,
        brandId: selectedBrandId.value,
        createNewBrand: false
      })
    } else {
      // Create new brand with this product
      // Generate brand slug if not already generated
      if (!newBrand.slug) {
        generateBrandSlug()
      }
      
      const brandData = {
        name: newBrand.name,
        slug: newBrand.slug,
        category: newBrand.category,
        description: newBrand.description,
        image: newBrand.image,
        signature: newBrand.signature,
        price: newBrand.price || 0,
        isActive: newBrand.isActive,
        imageFile: newBrand.imageFile
      }
      
      emit('save', { 
        productData,
        createNewBrand: true,
        newBrandData: brandData
      })
    }
    
    // Close modal
    emit('close')
  } catch (error) {
    console.error('Error saving product:', error)
    alert(t('Failed to save product. Please try again.'))
  } finally {
    loading.value = false
  }
}

const close = () => {
  if (loading.value) return
  emit('close')
}
</script>

<style scoped>
/* Custom scrollbar for modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Focus styles */
:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .bg-white {
    background-color: #1f2937;
  }
  
  .text-gray-900 {
    color: #f9fafb;
  }
  
  .text-gray-500 {
    color: #9ca3af;
  }
  
  .border-gray-300 {
    border-color: #4b5563;
  }
  
  .bg-gray-50 {
    background-color: #374151;
  }
  
  .bg-blue-50 {
    background-color: #1e3a8a;
  }
  
  .border-blue-200 {
    border-color: #1e40af;
  }
  
  .text-blue-800 {
    color: #bfdbfe;
  }
  
  .text-blue-700 {
    color: #93c5fd;
  }
  
  .text-blue-600 {
    color: #60a5fa;
  }
  
  .ring-gray-300 {
    ring-color: #4b5563;
  }
  
  .hover\:bg-gray-50:hover {
    background-color: #4b5563;
  }
}
</style>