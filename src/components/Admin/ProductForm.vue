<template>
  <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b">
        <h2 class="text-2xl font-display-en font-bold">
          {{ isEditing ? t('Edit Product') : t('Add New Product') }}
        </h2>
        <button
          @click="$emit('close')"
          class="p-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="overflow-y-auto max-h-[calc(90vh-80px)]">
        <div class="p-6 space-y-6">
          <!-- Image Upload -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('Product Image') }}
            </label>
            <div class="flex items-center space-x-6" :class="{ 'space-x-reverse': isRTL }">
              <div 
                @click="triggerFileInput"
                class="w-40 h-40 border-2 border-dashed border-gray-300 rounded-2xl 
                       flex items-center justify-center cursor-pointer hover:border-primary-500 
                       transition-colors"
              >
                <div v-if="imagePreview" class="relative w-full h-full">
                  <img 
                    :src="imagePreview" 
                    alt="Product preview" 
                    class="w-full h-full object-cover rounded-2xl"
                  />
                  <button
                    type="button"
                    @click.stop="removeImage"
                    class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white 
                           rounded-full flex items-center justify-center"
                    :class="{ 'right-auto left-2': isRTL }"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                            d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <div v-else class="text-center p-4">
                  <svg class="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <p class="mt-2 text-sm text-gray-500">{{ t('Upload Image') }}</p>
                </div>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleImageUpload"
                />
              </div>
              <div class="flex-1">
                <p class="text-sm text-gray-500">
                  {{ t('Upload a high-quality product image. Recommended size: 800x800px. Max size: 5MB.') }}
                </p>
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
                v-model="form.name.en"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-primary-500 focus:border-primary-500"
                :placeholder="t('Enter product name in English')"
              />
              <p v-if="errors.name?.en" class="mt-2 text-sm text-red-600">
                {{ errors.name.en }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('Arabic Name') }} *
              </label>
              <input
                v-model="form.name.ar"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-primary-500 focus:border-primary-500 text-right"
                :placeholder="t('أدخل اسم المنتج بالعربية')"
                dir="rtl"
              />
              <p v-if="errors.name?.ar" class="mt-2 text-sm text-red-600">
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
                v-model="form.category"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-primary-500 focus:border-primary-500"
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
              <p v-if="errors.category" class="mt-2 text-sm text-red-600">
                {{ errors.category }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('Price') }} ($) *
              </label>
              <input
                v-model="form.price"
                type="number"
                min="0"
                step="0.01"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-primary-500 focus:border-primary-500"
                :placeholder="t('0.00')"
              />
              <p v-if="errors.price" class="mt-2 text-sm text-red-600">
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
                v-model="form.size"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">{{ t('Select size') }}</option>
                <option value="30ml">30ml</option>
                <option value="50ml">50ml</option>
                <option value="100ml">100ml</option>
                <option value="200ml">200ml</option>
                <option value="500ml">500ml</option>
              </select>
              <p v-if="errors.size" class="mt-2 text-sm text-red-600">
                {{ errors.size }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('Concentration') }} *
              </label>
              <select
                v-model="form.concentration"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">{{ t('Select concentration') }}</option>
                <option value="EDT">Eau de Toilette (EDT)</option>
                <option value="EDP">Eau de Parfum (EDP)</option>
                <option value="Parfum">Parfum</option>
                <option value="Extrait">Extrait de Parfum</option>
              </select>
              <p v-if="errors.concentration" class="mt-2 text-sm text-red-600">
                {{ errors.concentration }}
              </p>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('Description') }} *
            </label>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-xs text-gray-500 mb-1">
                  {{ t('English Description') }}
                </label>
                <textarea
                  v-model="form.description.en"
                  rows="4"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                         focus:ring-primary-500 focus:border-primary-500"
                  :placeholder="t('Enter product description in English')"
                />
                <p v-if="errors.description?.en" class="mt-2 text-sm text-red-600">
                  {{ errors.description.en }}
                </p>
              </div>
              <div>
                <label class="block text-xs text-gray-500 mb-1">
                  {{ t('Arabic Description') }}
                </label>
                <textarea
                  v-model="form.description.ar"
                  rows="4"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                         focus:ring-primary-500 focus:border-primary-500 text-right"
                  :placeholder="t('أدخل وصف المنتج بالعربية')"
                  dir="rtl"
                />
                <p v-if="errors.description?.ar" class="mt-2 text-sm text-red-600">
                  {{ errors.description.ar }}
                </p>
              </div>
            </div>
          </div>

          <!-- Fragrance Notes -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-4">
              {{ t('Fragrance Notes') }} *
            </label>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm text-gray-600 mb-2">
                  {{ t('Top Notes') }}
                </label>
                <div class="space-y-2">
                  <div 
                    v-for="(note, index) in form.notes.top" 
                    :key="index"
                    class="flex items-center space-x-2" 
                    :class="{ 'space-x-reverse': isRTL }"
                  >
                    <input
                      v-model="form.notes.top[index]"
                      type="text"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      :placeholder="t('Note')"
                    />
                    <button
                      type="button"
                      @click="removeNote('top', index)"
                      class="p-2 text-red-600 hover:text-red-800"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    @click="addNote('top')"
                    class="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + {{ t('Add Top Note') }}
                  </button>
                </div>
              </div>
              
              <div>
                <label class="block text-sm text-gray-600 mb-2">
                  {{ t('Heart Notes') }}
                </label>
                <div class="space-y-2">
                  <div 
                    v-for="(note, index) in form.notes.heart" 
                    :key="index"
                    class="flex items-center space-x-2" 
                    :class="{ 'space-x-reverse': isRTL }"
                  >
                    <input
                      v-model="form.notes.heart[index]"
                      type="text"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      :placeholder="t('Note')"
                    />
                    <button
                      type="button"
                      @click="removeNote('heart', index)"
                      class="p-2 text-red-600 hover:text-red-800"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    @click="addNote('heart')"
                    class="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + {{ t('Add Heart Note') }}
                  </button>
                </div>
              </div>
              
              <div>
                <label class="block text-sm text-gray-600 mb-2">
                  {{ t('Base Notes') }}
                </label>
                <div class="space-y-2">
                  <div 
                    v-for="(note, index) in form.notes.base" 
                    :key="index"
                    class="flex items-center space-x-2" 
                    :class="{ 'space-x-reverse': isRTL }"
                  >
                    <input
                      v-model="form.notes.base[index]"
                      type="text"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                      :placeholder="t('Note')"
                    />
                    <button
                      type="button"
                      @click="removeNote('base', index)"
                      class="p-2 text-red-600 hover:text-red-800"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                              d="M6 18L18 6M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>
                  <button
                    type="button"
                    @click="addNote('base')"
                    class="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + {{ t('Add Base Note') }}
                  </button>
                </div>
              </div>
            </div>
            <p v-if="errors.notes" class="mt-2 text-sm text-red-600">{{ errors.notes }}</p>
          </div>

          <!-- Best Seller Toggle -->
          <div>
            <label class="flex items-center space-x-3 cursor-pointer" 
                   :class="{ 'space-x-reverse': isRTL }">
              <input
                v-model="form.isBestSeller"
                type="checkbox"
                class="w-5 h-5 text-primary-600 rounded focus:ring-primary-500"
              />
              <span class="text-sm font-medium text-gray-700">
                {{ t('Mark as Best Seller') }}
              </span>
            </label>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-6 border-t bg-gray-50 flex justify-end space-x-3" 
             :class="{ 'space-x-reverse': isRTL }">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg 
                   hover:bg-gray-100 transition-colors"
          >
            {{ t('Cancel') }}
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium 
                   hover:bg-primary-600 transition-colors disabled:opacity-50 
                   disabled:cursor-not-allowed"
          >
            <span v-if="!loading">
              {{ isEditing ? t('Update Product') : t('Add Product') }}
            </span>
            <span v-else class="flex items-center space-x-2" 
                  :class="{ 'space-x-reverse': isRTL }">
              <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span>{{ t('Saving...') }}</span>
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Product, ProductFormData } from '@/types'
import { useLanguageStore } from '@/stores/language'
import { useProductsStore } from '@/stores/products'

interface Props {
  product?: Product | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  saved: []
  close: []
}>()

const languageStore = useLanguageStore()
const productsStore = useProductsStore()

const { currentLanguage, isRTL } = languageStore
const { categories } = productsStore

// Form state
const form = ref<ProductFormData>({
  name: { en: '', ar: '' },
  slug: '',
  category: '',
  price: 0,
  size: '',
  concentration: '',
  description: { en: '', ar: '' },
  notes: { top: [''], heart: [''], base: [''] },
  imageUrl: '',
  isBestSeller: false,
  imageFile: undefined
})

const fileInput = ref<HTMLInputElement | null>(null)
const imagePreview = ref<string>('')
const imageError = ref<string>('')
const loading = ref(false)
const errors = ref<Record<string, any>>({})

// Computed
const isEditing = computed(() => !!props.product)

// Initialize form with product data
const initializeForm = () => {
  if (props.product) {
    const { id, createdAt, updatedAt, ...productData } = props.product
    form.value = { ...productData, imageFile: undefined }
    imagePreview.value = productData.imageUrl
  }
}

// Watch for product changes
watch(() => props.product, initializeForm, { immediate: true })

// Helper function for translation
const t = (key: string): string => {
  const translations: Record<string, { en: string; ar: string }> = {
    'Edit Product': { en: 'Edit Product', ar: 'تعديل المنتج' },
    'Add New Product': { en: 'Add New Product', ar: 'إضافة منتج جديد' },
    'Product Image': { en: 'Product Image', ar: 'صورة المنتج' },
    'Upload Image': { en: 'Upload Image', ar: 'رفع صورة' },
    'English Name': { en: 'English Name', ar: 'الاسم بالإنجليزية' },
    'Arabic Name': { en: 'Arabic Name', ar: 'الاسم بالعربية' },
    'Category': { en: 'Category', ar: 'الفئة' },
    'Price': { en: 'Price', ar: 'السعر' },
    'Size': { en: 'Size', ar: 'الحجم' },
    'Concentration': { en: 'Concentration', ar: 'التركيز' },
    'Description': { en: 'Description', ar: 'الوصف' },
    'Fragrance Notes': { en: 'Fragrance Notes', ar: 'ملاحظات العطر' },
    'Top Notes': { en: 'Top Notes', ar: 'الرأس' },
    'Heart Notes': { en: 'Heart Notes', ar: 'القلب' },
    'Base Notes': { en: 'Base Notes', ar: 'القاعدة' },
    'Mark as Best Seller': { en: 'Mark as Best Seller', ar: 'تعيين كأكثر مبيعاً' },
    'Cancel': { en: 'Cancel', ar: 'إلغاء' },
    'Update Product': { en: 'Update Product', ar: 'تحديث المنتج' },
    'Add Product': { en: 'Add Product', ar: 'إضافة المنتج' },
    'Saving...': { en: 'Saving...', ar: 'جاري الحفظ...' }
  }
  
  return translations[key]?.[currentLanguage.value] || key
}

// Methods
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleImageUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  
  if (!file) return
  
  // Validate image
  const validTypes = ['image/jpeg', 'image/png', 'image/webp']
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
    form.value.imageFile = file
    imageError.value = ''
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  imagePreview.value = ''
  form.value.imageUrl = ''
  form.value.imageFile = undefined
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const addNote = (type: 'top' | 'heart' | 'base') => {
  form.value.notes[type].push('')
}

const removeNote = (type: 'top' | 'heart' | 'base', index: number) => {
  form.value.notes[type].splice(index, 1)
}

const validateForm = (): boolean => {
  errors.value = {}
  
  // Validate required fields
  if (!form.value.name.en.trim()) {
    errors.value.name = { en: t('English name is required') }
  }
  
  if (!form.value.name.ar.trim()) {
    errors.value.name = { ...errors.value.name, ar: t('Arabic name is required') }
  }
  
  if (!form.value.category) {
    errors.value.category = t('Category is required')
  }
  
  if (!form.value.price || form.value.price <= 0) {
    errors.value.price = t('Valid price is required')
  }
  
  if (!form.value.size) {
    errors.value.size = t('Size is required')
  }
  
  if (!form.value.concentration) {
    errors.value.concentration = t('Concentration is required')
  }
  
  if (!form.value.description.en.trim()) {
    errors.value.description = { en: t('English description is required') }
  }
  
  if (!form.value.description.ar.trim()) {
    errors.value.description = { ...errors.value.description, ar: t('Arabic description is required') }
  }
  
  // Validate notes
  const hasNotes = form.value.notes.top.some(n => n.trim()) || 
                   form.value.notes.heart.some(n => n.trim()) || 
                   form.value.notes.base.some(n => n.trim())
  
  if (!hasNotes) {
    errors.value.notes = t('At least one fragrance note is required')
  }
  
  // Validate image
  if (!imagePreview.value && !form.value.imageUrl) {
    errors.value.image = t('Product image is required')
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    if (isEditing.value && props.product) {
      await productsStore.editProduct(props.product.id, form.value)
    } else {
      await productsStore.addProduct(form.value)
    }
    
    emit('saved')
    emit('close')
  } catch (error) {
    console.error('Error saving product:', error)
  } finally {
    loading.value = false
  }
}
</script>