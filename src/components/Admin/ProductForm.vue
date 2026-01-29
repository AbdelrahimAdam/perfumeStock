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
import type { Product, ProductFormData } from '@/types'

const languageStore = useLanguageStore()
const productsStore = useProductsStore()

const { currentLanguage, isRTL, t } = languageStore
const { categories } = productsStore

const props = defineProps<{
  product?: Product
}>()

const emit = defineEmits<{
  close: []
  save: [data: ProductFormData]
}>()

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
const initializeForm = () => {
  if (props.product) {
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
  } else {
    // Reset form
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
  }
  
  // Clear errors
  Object.keys(errors).forEach(key => delete errors[key])
}

// Watch for product changes
watch(() => props.product, initializeForm, { immediate: true })

// Methods
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

const validateForm = (): boolean => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => delete errors[key])
  
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
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Emit the form data
    emit('save', { ...formData })
    
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