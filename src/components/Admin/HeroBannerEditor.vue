<!-- src/components/Admin/HeroBannerEditor.vue -->
<template>
  <div class="hero-banner-editor space-y-6">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-semibold text-gray-800">Hero Banner</h2>
      <button
        @click="previewBanner"
        class="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
      >
        Preview
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Image Upload -->
      <div class="space-y-4">
        <label class="block text-sm font-medium text-gray-700">
          Banner Image
        </label>
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            type="file"
            ref="fileInput"
            @change="handleImageUpload"
            accept="image/*"
            class="hidden"
          />
          <div v-if="localData.imageUrl" class="mb-4">
            <img 
              :src="localData.imageUrl" 
              alt="Banner preview" 
              class="max-h-48 mx-auto rounded"
            />
          </div>
          <button
            @click="$refs.fileInput.click()"
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
          >
            {{ localData.imageUrl ? 'Change Image' : 'Upload Image' }}
          </button>
          <p class="mt-2 text-sm text-gray-500">
            Recommended: 1920x1080px, JPG or PNG
          </p>
        </div>
      </div>

      <!-- Text Content -->
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            v-model="localData.title"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
            placeholder="Enter banner title"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Subtitle
          </label>
          <input
            v-model="localData.subtitle"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
            placeholder="Enter banner subtitle"
          />
        </div>

        <!-- Preview -->
        <div class="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Live Preview</h3>
          <div class="text-center">
            <h3 class="text-2xl font-bold text-gray-800">{{ localData.title }}</h3>
            <p class="text-gray-600 mt-2">{{ localData.subtitle }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useHomepageStore } from '@/stores/homepage'

const props = defineProps<{
  heroBanner: {
    imageUrl: string
    title: string
    subtitle: string
  }
}>()

const emit = defineEmits<{
  update: [data: any]
}>()

const homepageStore = useHomepageStore()
const localData = ref({ ...props.heroBanner })

// Watch for changes and emit updates
watch(localData, (newValue) => {
  emit('update', newValue)
}, { deep: true })

const handleImageUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (!input.files || !input.files[0]) return

  const file = input.files[0]
  
  try {
    // Upload to Firebase Storage
    const downloadURL = await homepageStore.uploadImage(file, 'hero-banner')
    localData.value.imageUrl = downloadURL
  } catch (error) {
    console.error('Error uploading image:', error)
    alert('Failed to upload image. Please try again.')
  }
}

const previewBanner = () => {
  // Open banner preview in new tab
  const previewUrl = `/preview/hero-banner?title=${encodeURIComponent(localData.value.title)}&subtitle=${encodeURIComponent(localData.value.subtitle)}&image=${encodeURIComponent(localData.value.imageUrl)}`
  window.open(previewUrl, '_blank')
}
</script>