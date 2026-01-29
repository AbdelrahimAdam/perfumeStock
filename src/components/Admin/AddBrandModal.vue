<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Background overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" @click="close"></div>

    <div class="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <!-- Modal panel -->
      <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <!-- Modal header -->
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                {{ editing ? t('Edit Brand') : t('Add New Brand') }}
              </h3>
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
          <div class="space-y-4">
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
              />
              <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
            </div>

            <!-- Image URL -->
            <div>
              <label for="brand-image" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('Image URL') }} *
              </label>
              <div class="flex gap-2">
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
                <div class="relative h-40 w-40 border border-gray-300 rounded-md overflow-hidden">
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

            <!-- Price -->
            <div>
              <label for="brand-price" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('Price') }} ({{ t('currencyLE') }}) *
              </label>
              <div class="mt-1 relative rounded-md shadow-sm">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-gray-500 sm:text-sm">EGP</span>
                </div>
                <input
                  id="brand-price"
                  v-model.number="formData.price"
                  type="number"
                  min="0"
                  step="0.01"
                  :placeholder="t('450')"
                  class="w-full pl-14 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  :class="{ 'border-red-300': errors.price }"
                  required
                />
              </div>
              <p v-if="errors.price" class="mt-1 text-sm text-red-600">{{ errors.price }}</p>
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
                    @input="generateSlug"
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

            <!-- Category (if needed) -->
            <div>
              <label for="brand-category" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('Category') }}
              </label>
              <select
                id="brand-category"
                v-model="formData.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="">{{ t('Select category') }}</option>
                <option value="luxury">{{ t('Luxury') }}</option>
                <option value="designer">{{ t('Designer') }}</option>
                <option value="niche">{{ t('Niche') }}</option>
                <option value="arabic">{{ t('Arabic') }}</option>
                <option value="french">{{ t('French') }}</option>
              </select>
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
        </div>

        <!-- Modal footer -->
        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            @click="save"
            :disabled="loading"
            class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <template v-if="loading">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ t('Saving...') }}
            </template>
            <template v-else>
              {{ editing ? t('Update Brand') : t('Add Brand') }}
            </template>
          </button>
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

const languageStore = useLanguageStore()
const { t } = languageStore

const props = defineProps<{
  brand?: any
}>()

const emit = defineEmits<{
  close: []
  save: [data: any]
}>()

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

// Form state
const errors = reactive({
  name: '',
  image: '',
  price: '',
  slug: ''
})
const loading = ref(false)
const imagePreview = ref('')
const editing = computed(() => !!props.brand?.id)

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
  }
})

// Watch image URL for preview
watch(() => formData.image, (newUrl) => {
  if (newUrl && isValidUrl(newUrl)) {
    imagePreview.value = newUrl
  } else {
    imagePreview.value = ''
  }
})

// Methods
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
  
  // Validate name
  if (!formData.name.trim()) {
    errors.name = t('Brand name is required')
    isValid = false
  }
  
  // Validate image URL
  if (!formData.image.trim()) {
    errors.image = t('Image URL is required')
    isValid = false
  } else if (!isValidUrl(formData.image)) {
    errors.image = t('Please enter a valid URL')
    isValid = false
  }
  
  // Validate price
  if (formData.price <= 0) {
    errors.price = t('Price must be greater than 0')
    isValid = false
  }
  
  // Validate slug
  if (!formData.slug.trim()) {
    errors.slug = t('URL slug is required')
    isValid = false
  } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
    errors.slug = t('Slug can only contain lowercase letters, numbers, and hyphens')
    isValid = false
  }
  
  return isValid
}

const save = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Emit the form data
    emit('save', { ...formData })
    
    // Close modal
    emit('close')
  } catch (error) {
    console.error('Error saving brand:', error)
    alert(t('Failed to save brand. Please try again.'))
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
  
  .text-gray-700 {
    color: #d1d5db;
  }
  
  .border-gray-300 {
    border-color: #4b5563;
  }
  
  .bg-gray-50 {
    background-color: #374151;
  }
  
  .text-gray-500 {
    color: #9ca3af;
  }
  
  .ring-gray-300 {
    ring-color: #4b5563;
  }
  
  .hover\:bg-gray-50:hover {
    background-color: #4b5563;
  }
}
</style>