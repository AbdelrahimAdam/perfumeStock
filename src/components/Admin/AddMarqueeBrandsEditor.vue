<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Background overlay with blur effect -->
    <div 
      class="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300" 
      :class="{ 'opacity-0': !isVisible, 'opacity-100': isVisible }"
      @click="close"
    ></div>

    <div class="flex min-h-screen items-center justify-center p-2 sm:p-4">
      <!-- Modal panel with responsive sizing -->
      <div 
        class="relative w-full transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all duration-300"
        :class="{
          'opacity-0 scale-95': !isVisible,
          'opacity-100 scale-100': isVisible,
          'max-w-sm': isMobile,
          'max-w-md': !isMobile && windowWidth < 1024,
          'max-w-lg': windowWidth >= 1024
        }"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="modalTitleId"
        :aria-describedby="modalDescriptionId"
      >
        <!-- Modal header with gradient -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <h3 
                :id="modalTitleId" 
                class="text-xl font-bold text-gray-900 leading-tight sm:text-2xl"
              >
                {{ t('Add Marquee Brand') }}
              </h3>
              <p 
                :id="modalDescriptionId" 
                class="mt-1 text-sm text-gray-600 sm:text-base"
              >
                {{ t('Brands will scroll horizontally in the marquee section') }}
              </p>
            </div>
            <button
              type="button"
              @click="close"
              class="flex-shrink-0 rounded-full p-2 text-gray-400 hover:bg-white/50 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
              :disabled="loading"
              :aria-label="t('Close modal')"
            >
              <span class="sr-only">{{ t('Close') }}</span>
              <svg class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal content with responsive padding -->
        <div class="px-4 py-5 sm:p-6">
          <div class="space-y-4 sm:space-y-6">
            <!-- Brand Name - Full width on mobile, grid on desktop -->
            <div class="space-y-1.5">
              <label for="marquee-brand-name" class="block text-sm font-medium text-gray-700 sm:text-base">
                {{ t('Brand Name') }} <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <input
                  id="marquee-brand-name"
                  v-model="formData.name"
                  type="text"
                  :placeholder="t('e.g., Tom Ford')"
                  class="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 sm:text-base"
                  :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.name }"
                  required
                  autocomplete="off"
                  :aria-invalid="!!errors.name"
                  :aria-describedby="errors.name ? 'name-error' : undefined"
                />
              </div>
              <p v-if="errors.name" id="name-error" class="text-sm text-red-600 flex items-center gap-1">
                <svg class="h-4 w-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                </svg>
                {{ errors.name }}
              </p>
            </div>

            <!-- Logo URL with upload option -->
            <div class="space-y-3">
              <label class="block text-sm font-medium text-gray-700 sm:text-base">
                {{ t('Brand Logo') }} <span class="text-red-500">*</span>
              </label>
              
              <!-- Upload or URL option toggle -->
              <div class="flex border border-gray-200 rounded-lg overflow-hidden">
                <button
                  type="button"
                  @click="uploadMethod = 'url'"
                  :class="[
                    'flex-1 py-2 text-sm font-medium transition-all',
                    uploadMethod === 'url'
                      ? 'bg-blue-50 text-blue-600 border-r border-blue-100'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  ]"
                >
                  {{ t('Enter URL') }}
                </button>
                <button
                  type="button"
                  @click="uploadMethod = 'upload'"
                  :class="[
                    'flex-1 py-2 text-sm font-medium transition-all',
                    uploadMethod === 'upload'
                      ? 'bg-blue-50 text-blue-600 border-l border-blue-100'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  ]"
                >
                  {{ t('Upload') }}
                </button>
              </div>

              <!-- URL Input -->
              <div v-if="uploadMethod === 'url'" class="space-y-1.5">
                <div class="flex flex-col sm:flex-row gap-2">
                  <div class="flex-1 relative">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <input
                      v-model="formData.logo"
                      type="url"
                      placeholder="https://example.com/logo.png"
                      class="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 sm:text-base"
                      :class="{ 'border-red-300 focus:border-red-500 focus:ring-red-500': errors.logo }"
                      required
                      :aria-invalid="!!errors.logo"
                      :aria-describedby="errors.logo ? 'logo-error' : undefined"
                    />
                  </div>
                  <button
                    type="button"
                    @click="previewLogo(formData.logo)"
                    class="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {{ t('Preview') }}
                  </button>
                </div>
                <p v-if="errors.logo" id="logo-error" class="text-sm text-red-600">{{ errors.logo }}</p>
              </div>

              <!-- File Upload -->
              <div v-else class="space-y-1.5">
                <div 
                  @dragover.prevent="dragOver = true"
                  @dragleave="dragOver = false"
                  @drop.prevent="handleFileDrop"
                  class="relative rounded-lg border-2 border-dashed transition-colors"
                  :class="{
                    'border-blue-500 bg-blue-50': dragOver,
                    'border-gray-300 hover:border-gray-400': !dragOver
                  }"
                >
                  <input
                    type="file"
                    ref="fileInput"
                    @change="handleFileUpload"
                    accept="image/*"
                    class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    aria-label="Upload logo image"
                  />
                  <div class="flex flex-col items-center justify-center px-6 py-8 text-center">
                    <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p class="mt-2 text-sm text-gray-600">
                      <span class="font-medium text-blue-600">{{ t('Click to upload') }}</span>
                      {{ t('or drag and drop') }}
                    </p>
                    <p class="mt-1 text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
                <p v-if="uploadedFile" class="text-sm text-green-600 flex items-center gap-1">
                  <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  {{ uploadedFile.name }} ({{ formatFileSize(uploadedFile.size) }})
                </p>
              </div>

              <!-- Logo Preview -->
              <div v-if="logoPreview" class="mt-3">
                <p class="text-sm font-medium text-gray-700 mb-2">{{ t('Logo Preview') }}:</p>
                <div class="flex flex-col sm:flex-row items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div class="flex-shrink-0 h-20 w-40 sm:h-24 sm:w-48 flex items-center justify-center bg-white rounded border">
                    <img
                      :src="logoPreview"
                      :alt="t('Brand Logo Preview')"
                      class="max-h-full max-w-full object-contain p-2"
                      @error="handleLogoError"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-gray-600">
                      {{ t('Recommended: Transparent PNG, 200×100px') }}
                    </p>
                    <p class="mt-1 text-xs text-gray-500">
                      {{ t('Will be displayed at 30px height in marquee') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Grid layout for smaller fields on larger screens -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <!-- Brand Website -->
              <div class="space-y-1.5">
                <label for="marquee-brand-website" class="block text-sm font-medium text-gray-700">
                  {{ t('Website') }}
                </label>
                <div class="relative">
                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <input
                    id="marquee-brand-website"
                    v-model="formData.website"
                    type="url"
                    :placeholder="t('https://brand.com')"
                    class="block w-full rounded-lg border border-gray-300 pl-10 pr-3 py-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                  />
                </div>
              </div>

              <!-- Category -->
              <div class="space-y-1.5">
                <label for="marquee-brand-category" class="block text-sm font-medium text-gray-700">
                  {{ t('Category') }}
                </label>
                <div class="relative">
                  <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <select
                    id="marquee-brand-category"
                    v-model="formData.category"
                    class="block w-full appearance-none rounded-lg border border-gray-300 bg-white pl-10 pr-10 py-3 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
                  >
                    <option value="">{{ t('Select category') }}</option>
                    <option value="luxury">{{ t('Luxury') }}</option>
                    <option value="designer">{{ t('Designer') }}</option>
                    <option value="niche">{{ t('Niche') }}</option>
                    <option value="arabic">{{ t('Arabic') }}</option>
                    <option value="french">{{ t('French') }}</option>
                    <option value="international">{{ t('International') }}</option>
                  </select>
                  <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Display Order - Full width with visual indicator -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label for="marquee-brand-order" class="block text-sm font-medium text-gray-700">
                  {{ t('Display Order') }}
                </label>
                <span class="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                  #{{ formData.displayOrder }}
                </span>
              </div>
              <div class="space-y-2">
                <input
                  id="marquee-brand-order"
                  v-model.number="formData.displayOrder"
                  type="range"
                  min="1"
                  max="20"
                  class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div class="flex justify-between text-xs text-gray-500">
                  <span>{{ t('First') }}</span>
                  <span>{{ t('Last') }}</span>
                </div>
              </div>
              <p class="text-sm text-gray-600">
                {{ t('Lower numbers appear first in the marquee') }}
              </p>
            </div>

            <!-- Status with visual toggle -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700">
                {{ t('Status') }}
              </label>
              <div class="flex flex-col sm:flex-row sm:items-center gap-3">
                <!-- Toggle switch -->
                <button
                  type="button"
                  @click="formData.isActive = !formData.isActive"
                  :class="[
                    'relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    formData.isActive ? 'bg-blue-600' : 'bg-gray-300'
                  ]"
                  role="switch"
                  :aria-checked="formData.isActive"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                      formData.isActive ? 'translate-x-7' : 'translate-x-0'
                    ]"
                  />
                </button>
                
                <!-- Status labels -->
                <div class="flex items-center gap-4">
                  <div class="flex items-center gap-2">
                    <div class="h-3 w-3 rounded-full" :class="formData.isActive ? 'bg-green-500' : 'bg-gray-300'"></div>
                    <span class="text-sm font-medium" :class="formData.isActive ? 'text-green-700' : 'text-gray-500'">
                      {{ t('Active') }}
                    </span>
                  </div>
                  <div class="flex items-center gap-2">
                    <div class="h-3 w-3 rounded-full" :class="!formData.isActive ? 'bg-red-500' : 'bg-gray-300'"></div>
                    <span class="text-sm font-medium" :class="!formData.isActive ? 'text-red-700' : 'text-gray-500'">
                      {{ t('Inactive') }}
                    </span>
                  </div>
                </div>
              </div>
              <p class="text-sm text-gray-600">
                {{ t('Inactive brands will not appear in the marquee') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Modal footer with responsive layout -->
        <div class="bg-gray-50 px-4 py-4 sm:px-6 sm:py-5">
          <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3">
            <button
              type="button"
              @click="close"
              :disabled="loading"
              class="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all sm:mt-0 sm:w-auto"
              :class="{ 'opacity-50 cursor-not-allowed': loading }"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {{ t('Cancel') }}
            </button>
            <button
              type="button"
              @click="save"
              :disabled="loading"
              class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto"
              :class="{ 'opacity-50 cursor-not-allowed': loading }"
            >
              <template v-if="loading">
                <svg class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="font-medium">{{ t('Adding...') }}</span>
              </template>
              <template v-else>
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                <span class="font-medium">{{ t('Add Brand') }}</span>
              </template>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const { t } = languageStore

const emit = defineEmits<{
  close: []
  save: [data: any]
}>()

// Reactive state
const isVisible = ref(false)
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value < 640)
const uploadMethod = ref<'url' | 'upload'>('url')
const dragOver = ref(false)
const uploadedFile = ref<File | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Unique IDs for accessibility
const modalTitleId = `modal-title-${Date.now()}`
const modalDescriptionId = `modal-description-${Date.now()}`

// Form data
const formData = reactive({
  name: '',
  logo: '',
  website: '',
  category: '',
  displayOrder: 1,
  isActive: true
})

// Form state
const errors = reactive({
  name: '',
  logo: ''
})
const loading = ref(false)
const logoPreview = ref('')

// Methods
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const previewLogo = (url: string) => {
  if (url && isValidUrl(url)) {
    logoPreview.value = url
    // Store in form data if from URL method
    if (uploadMethod.value === 'url') {
      formData.logo = url
    }
  } else {
    alert(t('Please enter a valid logo URL'))
  }
}

const handleLogoError = () => {
  alert(t('Failed to load logo. Please check the URL or file.'))
  logoPreview.value = ''
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert(t('Please select an image file'))
      return
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert(t('Image must be less than 5MB'))
      return
    }
    
    uploadedFile.value = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      logoPreview.value = result
      // Store data URL in form data
      formData.logo = result
    }
    reader.readAsDataURL(file)
  }
}

const handleFileDrop = (event: DragEvent) => {
  dragOver.value = false
  const files = event.dataTransfer?.files
  if (files && files[0]) {
    const file = files[0]
    uploadedFile.value = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      logoPreview.value = result
      formData.logo = result
    }
    reader.readAsDataURL(file)
  }
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
  } else if (formData.name.length > 50) {
    errors.name = t('Brand name must be less than 50 characters')
    isValid = false
  }
  
  // Validate logo
  if (uploadMethod.value === 'url') {
    if (!formData.logo.trim()) {
      errors.logo = t('Logo URL is required')
      isValid = false
    } else if (!isValidUrl(formData.logo)) {
      errors.logo = t('Please enter a valid URL')
      isValid = false
    }
  } else {
    if (!formData.logo) {
      errors.logo = t('Please upload a logo image')
      isValid = false
    }
  }
  
  return isValid
}

const save = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Generate a unique ID
    const brandData = {
      ...formData,
      id: Date.now().toString(),
      slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      createdAt: new Date().toISOString(),
      method: uploadMethod.value,
      fileInfo: uploadedFile.value ? {
        name: uploadedFile.value.name,
        size: uploadedFile.value.size,
        type: uploadedFile.value.type
      } : null
    }
    
    // Emit the form data
    emit('save', brandData)
    
    // Close modal
    close()
  } catch (error) {
    console.error('Error saving marquee brand:', error)
    alert(t('Failed to save brand. Please try again.'))
  } finally {
    loading.value = false
  }
}

const close = () => {
  if (loading.value) return
  isVisible.value = false
  setTimeout(() => {
    emit('close')
  }, 300) // Match transition duration
}

// Window resize handler
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

// Keyboard event listener
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    close()
  }
}

// Lifecycle
onMounted(() => {
  // Show modal with animation
  setTimeout(() => {
    isVisible.value = true
  }, 10)
  
  // Add event listeners
  window.addEventListener('resize', handleResize)
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  // Remove event listeners
  window.removeEventListener('resize', handleResize)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Custom slider styles */
.slider {
  -webkit-appearance: none;
  appearance: none;
  height: 6px;
  border-radius: 3px;
  background: linear-gradient(to right, #e5e7eb 0%, #e5e7eb 100%);
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.slider::-webkit-slider-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 0.2s ease;
}

.slider::-moz-range-thumb:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Custom scrollbar for the modal */
@media (min-width: 640px) {
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
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .bg-white {
    background-color: #1f2937;
  }
  
  .bg-gray-50 {
    background-color: #111827;
  }
  
  .text-gray-900 {
    color: #f9fafb;
  }
  
  .text-gray-700 {
    color: #d1d5db;
  }
  
  .text-gray-600 {
    color: #9ca3af;
  }
  
  .text-gray-500 {
    color: #6b7280;
  }
  
  .border-gray-300 {
    border-color: #4b5563;
  }
  
  .border-gray-200 {
    border-color: #374151;
  }
  
  .bg-gradient-to-r.from-blue-50.to-indigo-50 {
    background: linear-gradient(to right, #1e3a8a, #312e81);
  }
  
  .bg-gray-100 {
    background-color: #374151;
  }
  
  .bg-gray-200 {
    background-color: #4b5563;
  }
  
  .bg-blue-100 {
    background-color: #1e40af;
  }
  
  .text-blue-800 {
    color: #93c5fd;
  }
  
  .ring-gray-300 {
    --tw-ring-color: #4b5563;
  }
  
  .hover\:bg-gray-50:hover {
    background-color: #374151;
  }
  
  .slider {
    background: linear-gradient(to right, #4b5563 0%, #4b5563 100%);
  }
  
  .slider::-webkit-slider-thumb {
    background: #60a5fa;
  }
  
  .slider::-moz-range-thumb {
    background: #60a5fa;
  }
}

/* Print styles */
@media print {
  .fixed {
    position: absolute;
  }
  
  .bg-black\/75 {
    background: none;
  }
  
  .shadow-2xl {
    box-shadow: none;
  }
  
  button {
    display: none;
  }
}
</style>