<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Background overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" @click="close"></div>

    <div class="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <!-- Modal panel -->
      <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl">
        <!-- Modal header -->
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                  {{ editing ? t('Edit Brand') : t('Add New Brand') }}
                </h3>
                <div class="flex items-center gap-2">
                  <span class="text-xs px-2 py-1 rounded-full" 
                        :class="currentStep === 1 ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'">
                    Step 1: Brand Info
                  </span>
                  <span class="text-xs px-2 py-1 rounded-full"
                        :class="currentStep === 2 ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'">
                    Step 2: Add Products ({{ products.length }})
                  </span>
                </div>
              </div>
              
              <!-- Step Navigation -->
              <div class="mb-6">
                <div class="flex items-center">
                  <button
                    @click="currentStep = 1"
                    :class="currentStep === 1 ? 'text-primary-600 border-primary-600' : 'text-gray-500 border-gray-300'"
                    class="flex-1 py-2 text-sm font-medium border-b-2 transition-colors"
                  >
                    {{ t('Brand Information') }}
                  </button>
                  <button
                    @click="currentStep = 2"
                    :class="currentStep === 2 ? 'text-primary-600 border-primary-600' : 'text-gray-500 border-gray-300'"
                    :disabled="!formData.name"
                    class="flex-1 py-2 text-sm font-medium border-b-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ t('Add Products') }}
                    <span v-if="products.length > 0" class="ml-1 inline-flex items-center justify-center w-5 h-5 text-xs bg-primary-500 text-white rounded-full">
                      {{ products.length }}
                    </span>
                  </button>
                </div>
              </div>
            </div>
            <button
              type="button"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              @click="close"
            >
              <span class="sr-only">{{ t('Close') }}</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal content -->
        <div class="px-4 pb-3 sm:px-6">
          <!-- Step 1: Brand Information -->
          <div v-if="currentStep === 1" class="space-y-4">
            <!-- Brand Name -->
            <div>
              <label for="brand-name" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('Brand Name') }} *
              </label>
              <input
                id="brand-name"
                v-model="formData.name"
                type="text"
                :placeholder="t('e.g., Tom Ford')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-300': errors.name }"
                required
                @input="generateSlug"
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>

            <!-- Image URL -->
            <div>
              <label for="brand-image" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('Brand Logo/Image') }} *
              </label>
              <div class="flex gap-2 mb-2">
                <input
                  id="brand-image"
                  v-model="formData.image"
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  :class="{ 'border-red-300': errors.image }"
                  required
                />
                <button
                  type="button"
                  @click="previewImage(formData.image)"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {{ t('Preview') }}
                </button>
              </div>
              <p v-if="errors.image" class="mt-1 text-sm text-red-600">{{ errors.image }}</p>
              
              <!-- Image Preview -->
              <div v-if="imagePreview" class="mt-2">
                <p class="text-sm text-gray-600 mb-1">{{ t('Image Preview') }}:</p>
                <div class="relative h-32 w-32 border border-gray-300 rounded-md overflow-hidden">
                  <img
                    :src="imagePreview"
                    :alt="t('Brand Image Preview')"
                    class="h-full w-full object-cover"
                    @error="handleImageError"
                  />
                </div>
              </div>
            </div>

            <!-- Signature Scent -->
            <div>
              <label for="brand-signature" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('Signature Scent') }}
              </label>
              <input
                id="brand-signature"
                v-model="formData.signature"
                type="text"
                :placeholder="t('e.g., Noir Extreme')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>

            <!-- Slug -->
            <div>
              <label for="brand-slug" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('URL Slug') }} *
              </label>
              <div class="flex gap-2">
                <div class="flex-1 relative rounded-md shadow-sm">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span class="text-gray-500 sm:text-sm">/brand/</span>
                  </div>
                  <input
                    id="brand-slug"
                    v-model="formData.slug"
                    type="text"
                    :placeholder="t('tom-ford')"
                    class="w-full pl-20 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    :class="{ 'border-red-300': errors.slug }"
                    required
                  />
                </div>
                <button
                  type="button"
                  @click="generateSlug"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {{ t('Generate') }}
                </button>
              </div>
              <p v-if="errors.slug" class="mt-1 text-sm text-red-600">{{ errors.slug }}</p>
              <p class="mt-1 text-xs text-gray-500">
                {{ t('URL will be:') }} <span class="font-mono text-primary-600">/brand/{{ formData.slug || 'brand-slug' }}</span>
              </p>
            </div>

            <!-- Category -->
            <div>
              <label for="brand-category" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('Category') }} *
              </label>
              <select
                id="brand-category"
                v-model="formData.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-300': errors.category }"
                required
              >
                <option value="">{{ t('Select category') }}</option>
                <option value="luxury">{{ t('Luxury') }}</option>
                <option value="designer">{{ t('Designer') }}</option>
                <option value="niche">{{ t('Niche') }}</option>
                <option value="arabic">{{ t('Arabic') }}</option>
                <option value="french">{{ t('French') }}</option>
                <option value="mens-fragrances">{{ t("Men's Fragrances") }}</option>
                <option value="womens-fragrances">{{ t("Women's Fragrances") }}</option>
                <option value="unisex-fragrances">{{ t('Unisex Fragrances') }}</option>
              </select>
              <p v-if="errors.category" class="mt-1 text-sm text-red-600">{{ errors.category }}</p>
            </div>

            <!-- Description -->
            <div>
              <label for="brand-description" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('Description') }}
              </label>
              <textarea
                id="brand-description"
                v-model="formData.description"
                rows="3"
                :placeholder="t('Brief description about the brand...')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              ></textarea>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
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

          <!-- Step 2: Add Products -->
          <div v-else-if="currentStep === 2" class="space-y-4">
            <!-- Current Brand Info -->
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-lg overflow-hidden">
                  <img
                    :src="formData.image || '/images/brand-default.jpg'"
                    :alt="formData.name"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 class="font-medium text-gray-900">{{ formData.name }}</h4>
                  <p class="text-sm text-gray-600">/brand/{{ formData.slug }}</p>
                </div>
              </div>
            </div>

            <!-- Products List -->
            <div>
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-sm font-medium text-gray-900">
                  {{ t('Products for') }} {{ formData.name }}
                  <span class="text-gray-500">({{ products.length }})</span>
                </h4>
                <button
                  type="button"
                  @click="addNewProduct"
                  class="inline-flex items-center px-3 py-1.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                  </svg>
                  {{ t('Add Product') }}
                </button>
              </div>

              <!-- Products Grid -->
              <div class="max-h-[400px] overflow-y-auto space-y-3 pr-2">
                <!-- Empty State -->
                <div v-if="products.length === 0" class="text-center py-8 text-gray-500">
                  <svg class="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                  </svg>
                  <p class="text-sm">{{ t('No products added yet') }}</p>
                  <p class="text-xs mt-1">{{ t('Add at least one product to complete brand creation') }}</p>
                </div>

                <!-- Product Cards -->
                <div
                  v-for="(product, index) in products"
                  :key="index"
                  class="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                >
                  <div class="flex items-start gap-3">
                    <!-- Product Image -->
                    <div class="relative">
                      <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          v-if="product.imageUrl"
                          :src="product.imageUrl"
                          :alt="product.name.en"
                          class="w-full h-full object-cover"
                          @error="handleProductImageError(index)"
                        />
                        <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                          </svg>
                        </div>
                      </div>
                      <button
                        @click="uploadProductImage(index)"
                        class="absolute -top-1 -right-1 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-600 hover:text-primary-600 hover:border-primary-400 transition-colors"
                        :title="t('Change Image')"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                      </button>
                      <input
                        type="file"
                        :ref="el => setProductFileInputRef(el, index)"
                        @change="event => handleProductImageUpload(event, index)"
                        accept="image/*"
                        class="hidden"
                      />
                    </div>

                    <!-- Product Details -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between">
                        <div class="flex-1">
                          <input
                            v-model="product.name.en"
                            type="text"
                            :placeholder="t('Product Name (English)')"
                            class="w-full px-2 py-1 text-sm font-medium text-gray-900 border-0 bg-transparent focus:outline-none focus:ring-0"
                            :class="{ 'border-b border-red-300': productErrors[index]?.nameEn }"
                          />
                          <input
                            v-model="product.name.ar"
                            type="text"
                            :placeholder="t('Product Name (Arabic)')"
                            class="w-full px-2 py-1 text-sm text-gray-600 border-0 bg-transparent focus:outline-none focus:ring-0 rtl:text-right"
                            :class="{ 'border-b border-red-300': productErrors[index]?.nameAr }"
                          />
                        </div>
                        <button
                          @click="removeProduct(index)"
                          class="ml-2 p-1 text-gray-400 hover:text-red-600 transition-colors"
                          :title="t('Remove Product')"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>

                      <!-- Product Fields -->
                      <div class="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <label class="block text-xs text-gray-500 mb-1">{{ t('Price') }} ({{ t('currencyLE') }})</label>
                          <input
                            v-model.number="product.price"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="450"
                            class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                            :class="{ 'border-red-300': productErrors[index]?.price }"
                          />
                        </div>
                        <div>
                          <label class="block text-xs text-gray-500 mb-1">{{ t('Size') }}</label>
                          <select
                            v-model="product.size"
                            class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="50ml">50ml</option>
                            <option value="100ml">100ml</option>
                            <option value="150ml">150ml</option>
                            <option value="200ml">200ml</option>
                          </select>
                        </div>
                        <div>
                          <label class="block text-xs text-gray-500 mb-1">{{ t('Concentration') }}</label>
                          <select
                            v-model="product.concentration"
                            class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="Eau de Parfum">Eau de Parfum</option>
                            <option value="Eau de Toilette">Eau de Toilette</option>
                            <option value="Parfum">Parfum</option>
                            <option value="Cologne">Cologne</option>
                          </select>
                        </div>
                        <div>
                          <label class="block text-xs text-gray-500 mb-1">{{ t('In Stock') }}</label>
                          <select
                            v-model="product.inStock"
                            class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option :value="true">{{ t('Yes') }}</option>
                            <option :value="false">{{ t('No') }}</option>
                          </select>
                        </div>
                      </div>

                      <!-- Description -->
                      <div class="mt-2">
                        <label class="block text-xs text-gray-500 mb-1">{{ t('Description') }}</label>
                        <textarea
                          v-model="product.description.en"
                          rows="1"
                          :placeholder="t('Brief description (English)')"
                          class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 resize-none"
                        ></textarea>
                        <textarea
                          v-model="product.description.ar"
                          rows="1"
                          :placeholder="t('وصف مختصر (العربية)')"
                          class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-primary-500 focus:border-primary-500 resize-none rtl:text-right mt-1"
                        ></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Quick Add Products -->
              <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 class="text-sm font-medium text-blue-800 mb-2">{{ t('Quick Add Templates') }}</h4>
                <div class="flex flex-wrap gap-2">
                  <button
                    @click="addProductTemplate('noirExtreme')"
                    class="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Noir Extreme Template
                  </button>
                  <button
                    @click="addProductTemplate('ombreLeather')"
                    class="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Ombré Leather Template
                  </button>
                  <button
                    @click="addProductTemplate('tobaccoVanille')"
                    class="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Tobacco Vanille Template
                  </button>
                  <button
                    @click="addProductTemplate('oudWood')"
                    class="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    Oud Wood Template
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <!-- Next/Previous Buttons -->
          <div v-if="currentStep === 1" class="w-full sm:w-auto">
            <button
              type="button"
              @click="goToStep(2)"
              :disabled="!canProceedToProducts"
              class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ t('Next: Add Products') }}
              <svg class="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          
          <div v-else-if="currentStep === 2" class="w-full flex gap-2">
            <button
              type="button"
              @click="goToStep(1)"
              class="flex-1 justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              <svg class="mr-2 w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
              </svg>
              {{ t('Back to Brand Info') }}
            </button>
            <button
              type="button"
              @click="saveBrandAndProducts"
              :disabled="loading || products.length === 0"
              class="flex-1 justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <template v-if="loading">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ t('Saving...') }}
              </template>
              <template v-else>
                {{ editing ? t('Update Brand & Products') : t('Create Brand & Products') }}
                <span class="ml-1 text-xs bg-white/20 px-1.5 py-0.5 rounded">
                  {{ products.length }} {{ t('products') }}
                </span>
              </template>
            </button>
          </div>
          
          <!-- Cancel Button -->
          <button
            type="button"
            @click="close"
            :disabled="loading"
            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('Cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { useProductsStore } from '@/stores/products'
import { useBrandsStore } from '@/stores/brands'
import { useHomepageStore } from '@/stores/homepage'
import type { Brand, Product } from '@/types'

const languageStore = useLanguageStore()
const productsStore = useProductsStore()
const brandsStore = useBrandsStore()
const homepageStore = useHomepageStore()

const { t } = languageStore

const props = defineProps<{
  brand?: Brand
}>()

const emit = defineEmits<{
  close: []
  save: [data: { brand: Partial<Brand>, products: Partial<Product>[] }]
}>()

// Step management
const currentStep = ref(1)

// Form data
const formData = reactive({
  id: '',
  name: '',
  image: '',
  signature: '',
  price: 0,
  slug: '',
  category: '',
  description: '',
  isActive: true
})

// Products array
const products = ref<Partial<Product>[]>([])

// Form state
const errors = reactive({
  name: '',
  image: '',
  slug: '',
  category: ''
})

const productErrors = ref<any[]>([])
const loading = ref(false)
const imagePreview = ref('')
const productFileInputs = ref<(HTMLInputElement | null)[]>([])
const editing = computed(() => !!props.brand?.id)

// Product templates
const productTemplates = {
  noirExtreme: {
    name: { en: 'Noir Extreme', ar: 'نوار إكستريم' },
    description: { 
      en: 'A luxurious oriental fragrance with notes of vanilla, amber, and spices.', 
      ar: 'عطر شرقي فاخر بنغمات الفانيليا والعنبر والتوابل.' 
    },
    price: 450,
    size: '100ml',
    concentration: 'Eau de Parfum',
    inStock: true,
    imageUrl: ''
  },
  ombreLeather: {
    name: { en: 'Ombré Leather', ar: 'أومبير ليزر' },
    description: { 
      en: 'A sophisticated leather fragrance with floral and woody notes.', 
      ar: 'عطر جلد متطور بنغمات زهرية وخشبية.' 
    },
    price: 520,
    size: '100ml',
    concentration: 'Eau de Parfum',
    inStock: true,
    imageUrl: ''
  },
  tobaccoVanille: {
    name: { en: 'Tobacco Vanille', ar: 'تباكو فانيليا' },
    description: { 
      en: 'A warm, spicy fragrance with tobacco leaf and vanilla bean.', 
      ar: 'عطر دافئ وحار بأوراق التبغ وحبوب الفانيليا.' 
    },
    price: 580,
    size: '100ml',
    concentration: 'Eau de Parfum',
    inStock: true,
    imageUrl: ''
  },
  oudWood: {
    name: { en: 'Oud Wood', ar: 'عود وود' },
    description: { 
      en: 'A rich, woody fragrance with rare oud and exotic spices.', 
      ar: 'عطر خشبي غني بالعود النادر والتوابل الغريبة.' 
    },
    price: 650,
    size: '100ml',
    concentration: 'Eau de Parfum',
    inStock: true,
    imageUrl: ''
  }
}

// Check if can proceed to products step
const canProceedToProducts = computed(() => {
  return formData.name.trim() && formData.image.trim() && formData.slug.trim() && formData.category.trim()
})

// Initialize form with brand data if editing
onMounted(() => {
  if (props.brand) {
    Object.assign(formData, {
      id: props.brand.id || '',
      name: props.brand.name || '',
      image: props.brand.image || '',
      signature: props.brand.signature || '',
      price: props.brand.price || 0,
      slug: props.brand.slug || '',
      category: props.brand.category || '',
      description: props.brand.description || '',
      isActive: props.brand.isActive !== undefined ? props.brand.isActive : true
    })
    
    if (formData.image) {
      imagePreview.value = formData.image
    }
    
    // Load existing products for this brand if editing
    if (props.brand.slug) {
      loadExistingProducts(props.brand.slug)
    }
  } else {
    // Add one empty product by default for new brands
    addNewProduct()
  }
})

// Load existing products for this brand
const loadExistingProducts = async (brandSlug: string) => {
  try {
    const brandProducts = productsStore.getProductsByBrand(brandSlug)
    if (brandProducts.length > 0) {
      products.value = brandProducts.map(product => ({
        id: product.id,
        name: product.name,
        description: product.description || { en: '', ar: '' },
        price: product.price,
        size: product.size || '100ml',
        concentration: product.concentration || 'Eau de Parfum',
        imageUrl: product.imageUrl || '',
        inStock: product.inStock !== false,
        isBestSeller: product.isBestSeller || false,
        isFeatured: product.isFeatured || false,
        slug: product.slug || '',
        brand: product.brand || brandSlug
      }))
    }
  } catch (error) {
    console.error('Error loading existing products:', error)
  }
}

// Watch image URL for preview
watch(() => formData.image, (newUrl) => {
  if (newUrl && isValidUrl(newUrl)) {
    imagePreview.value = newUrl
  } else {
    imagePreview.value = ''
  }
})

// ========== CORE METHODS ==========

// Validation methods
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const previewImage = (url: string) => {
  if (url && isValidUrl(url)) {
    imagePreview.value = url
  } else {
    alert(t('Please enter a valid image URL'))
  }
}

const handleImageError = () => {
  alert(t('Failed to load image. Please check the URL.'))
  imagePreview.value = ''
}

const generateSlug = () => {
  if (!formData.name) return
  
  const slug = formData.name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
  
  formData.slug = slug
}

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  productErrors.value = []
  
  // Validate brand form
  if (!formData.name.trim()) {
    errors.name = t('Brand name is required')
    isValid = false
  }
  
  if (!formData.image.trim()) {
    errors.image = t('Image URL is required')
    isValid = false
  } else if (!isValidUrl(formData.image)) {
    errors.image = t('Please enter a valid URL')
    isValid = false
  }
  
  if (!formData.slug.trim()) {
    errors.slug = t('URL slug is required')
    isValid = false
  } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
    errors.slug = t('Slug can only contain lowercase letters, numbers, and hyphens')
    isValid = false
  }
  
  if (!formData.category.trim()) {
    errors.category = t('Category is required')
    isValid = false
  }
  
  // Validate products
  products.value.forEach((product, index) => {
    const productError: any = {}
    
    if (!product.name?.en?.trim()) {
      productError.nameEn = t('Product name (English) is required')
      isValid = false
    }
    
    if (!product.price || product.price <= 0) {
      productError.price = t('Price must be greater than 0')
      isValid = false
    }
    
    if (Object.keys(productError).length > 0) {
      productErrors.value[index] = productError
    }
  })
  
  return isValid
}

// ========== PRODUCT MANAGEMENT METHODS ==========

const addNewProduct = () => {
  const newProduct: Partial<Product> = {
    id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: { en: '', ar: '' },
    description: { en: '', ar: '' },
    price: 0,
    size: '100ml',
    concentration: 'Eau de Parfum',
    imageUrl: '',
    inStock: true,
    isBestSeller: false,
    isFeatured: false,
    brand: formData.slug || '',
    category: formData.category || ''
  }
  
  products.value.push(newProduct)
  productFileInputs.value.push(null)
}

const addProductTemplate = (templateName: keyof typeof productTemplates) => {
  const template = productTemplates[templateName]
  const newProduct: Partial<Product> = {
    id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: { ...template.name },
    description: { ...template.description },
    price: template.price,
    size: template.size,
    concentration: template.concentration,
    imageUrl: template.imageUrl,
    inStock: template.inStock,
    isBestSeller: false,
    isFeatured: false,
    brand: formData.slug || '',
    category: formData.category || ''
  }
  
  products.value.push(newProduct)
  productFileInputs.value.push(null)
}

const removeProduct = (index: number) => {
  if (products.value.length <= 1) {
    alert(t('At least one product is required'))
    return
  }
  
  if (!confirm(t('Are you sure you want to remove this product?'))) return
  
  products.value.splice(index, 1)
  productFileInputs.value.splice(index, 1)
  productErrors.value.splice(index, 1)
}

const setProductFileInputRef = (el: HTMLInputElement | null, index: number) => {
  productFileInputs.value[index] = el
}

const uploadProductImage = (index: number) => {
  const input = productFileInputs.value[index]
  if (input) {
    input.click()
  }
}

const handleProductImageUpload = async (event: Event, index: number) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) return

  const file = input.files[0]
  
  // Validate file size (5MB max)
  if (file.size > 5 * 1024 * 1024) {
    alert(t('Image must be less than 5MB'))
    return
  }
  
  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert(t('Please select an image file (JPG, PNG, etc.)'))
    return
  }
  
  try {
    // Convert to base64 for preview
    const reader = new FileReader()
    reader.onload = (e) => {
      products.value[index].imageUrl = e.target?.result as string
    }
    reader.readAsDataURL(file)
    
    // Reset the file input
    input.value = ''
    
  } catch (error: any) {
    console.error('Error uploading product image:', error)
    alert(t('Failed to upload image: ') + (error.message || 'Unknown error'))
  }
}

const handleProductImageError = (index: number) => {
  products.value[index].imageUrl = ''
}

// ========== NAVIGATION METHODS ==========

const goToStep = (step: number) => {
  if (step === 2 && !canProceedToProducts.value) {
    alert(t('Please complete all required brand information first'))
    return
  }
  currentStep.value = step
}

// ========== SAVE METHODS ==========

const saveBrandAndProducts = async () => {
  if (!validateForm()) return
  
  if (products.value.length === 0) {
    alert(t('Please add at least one product'))
    return
  }
  
  loading.value = true
  
  try {
    // Prepare brand data - MUST MATCH THE TYPE EXPECTED BY BRANDS STORE
    const brandData: Partial<Brand> = {
      name: formData.name,
      slug: formData.slug,
      image: formData.image,
      signature: formData.signature || '',
      price: formData.price || 0,
      category: formData.category,
      description: formData.description || '',
      isActive: formData.isActive !== false
    }
    
    // Prepare products data - MUST MATCH THE TYPE EXPECTED BY BRANDS STORE
    const productsData: Partial<Product>[] = products.value.map(product => ({
      name: product.name || { en: '', ar: '' },
      description: product.description || { en: '', ar: '' },
      price: Number(product.price) || 0,
      size: product.size || '100ml',
      concentration: product.concentration || 'Eau de Parfum',
      imageUrl: product.imageUrl || '',
      inStock: product.inStock !== false,
      isBestSeller: product.isBestSeller || false,
      isFeatured: product.isFeatured || false,
      brand: formData.slug, // Link product to brand slug
      category: formData.category, // Inherit category from brand
      slug: product.slug || (typeof product.name === 'object' ? 
            product.name.en?.toLowerCase().replace(/\s+/g, '-') : 
            product.name?.toLowerCase().replace(/\s+/g, '-') || '')
    }))
    
    console.log('💾 Saving brand and products:', {
      brand: brandData,
      products: productsData
    })
    
    let result: string | null = null
    
    if (editing.value && formData.id) {
      // Update existing brand
      const success = await brandsStore.updateBrand(formData.id, brandData)
      if (success) {
        result = formData.id
        // Note: Updating products for existing brand is complex
        // For now, we'll just show a message
        alert('Brand updated successfully! Product updates are not yet implemented.')
      }
    } else {
      // Create new brand with products
      result = await brandsStore.addBrandWithProducts(brandData, productsData)
    }
    
    if (result) {
      // Refresh homepage data to include new brand
      await homepageStore.loadHomepageData()
      
      // Refresh products store
      await productsStore.fetchProducts()
      
      // Show success message
      alert(t('Brand and products saved successfully!'))
      
      // Emit save event with properly typed data
      emit('save', {
        brand: brandData,
        products: productsData
      })
      
      // Close modal
      emit('close')
    } else {
      throw new Error('Failed to save brand')
    }
    
  } catch (error: any) {
    console.error('❌ Error saving brand and products:', error)
    alert(t('Failed to save: ') + (error.message || 'Unknown error'))
  } finally {
    loading.value = false
  }
}

const close = () => {
  if (loading.value) return
  emit('close')
}

// Keyboard event listener
onMounted(() => {
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
</script>

<style scoped>
/* Custom scrollbar for modal and product list */
.overflow-y-auto::-webkit-scrollbar,
.max-h-\[400px\]::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track,
.max-h-\[400px\]::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb,
.max-h-\[400px\]::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover,
.max-h-\[400px\]::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Focus styles */
:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Smooth transitions */
button, input, select, textarea {
  transition: all 0.2s ease;
}

/* Product card hover effect */
.border-gray-200:hover {
  border-color: #9ca3af;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Step indicator animation */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.bg-primary-100 {
  animation: pulse 2s infinite;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .sm\:max-w-4xl {
    max-width: 95%;
  }
  
  .grid-cols-2 {
    grid-template-columns: 1fr;
  }
}
</style>