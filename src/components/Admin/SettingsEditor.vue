<!-- src/components/Admin/SettingsEditor.vue -->
<template>
  <div class="settings-editor space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold text-gray-800">{{ t('Homepage Settings') }}</h2>
        <p class="text-gray-600">{{ t('Configure homepage appearance and behavior') }}</p>
      </div>
    </div>

    <!-- Settings Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Column - Appearance -->
      <div class="space-y-6">
        <!-- Theme Settings -->
        <div class="bg-white rounded-xl p-6 shadow border">
          <h3 class="font-medium text-gray-800 mb-4">{{ t('Theme Settings') }}</h3>
          
          <div class="space-y-4">
            <!-- Dark Mode -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">{{ t('Dark Mode') }}</p>
                <p class="text-sm text-gray-500">{{ t('Enable dark theme for homepage') }}</p>
              </div>
              <button
                @click="toggleDarkMode"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settingsData.isDarkMode ? 'bg-gold-500' : 'bg-gray-300'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    settingsData.isDarkMode ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>

            <!-- Default Language -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('Default Language') }}
              </label>
              <select
                v-model="settingsData.defaultLanguage"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                @change="emitUpdate"
              >
                <option value="ar">العربية (Arabic)</option>
                <option value="en">English</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">
                {{ t('Default language for homepage content') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Animation Settings -->
        <div class="bg-white rounded-xl p-6 shadow border">
          <h3 class="font-medium text-gray-800 mb-4">{{ t('Animation Settings') }}</h3>
          
          <div class="space-y-4">
            <!-- Enable Animations -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">{{ t('Enable Animations') }}</p>
                <p class="text-sm text-gray-500">{{ t('Show entrance animations') }}</p>
              </div>
              <button
                @click="toggleAnimations"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settingsData.enableAnimations ? 'bg-gold-500' : 'bg-gray-300'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    settingsData.enableAnimations ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>

            <!-- Marquee Speed -->
            <div v-if="settingsData.enableAnimations">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('Marquee Speed') }}
              </label>
              <div class="space-y-2">
                <input
                  v-model="settingsData.marqueeSpeed"
                  type="range"
                  min="10"
                  max="60"
                  step="5"
                  class="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  @input="emitUpdate"
                />
                <div class="flex justify-between text-xs text-gray-500">
                  <span>{{ t('Slow') }}</span>
                  <span>{{ t('Medium') }}</span>
                  <span>{{ t('Fast') }}</span>
                </div>
                <p class="text-xs text-gray-500 mt-1">
                  {{ t('Current speed:') }} {{ settingsData.marqueeSpeed }} {{ t('seconds per loop') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Content Settings -->
      <div class="space-y-6">
        <!-- Content Settings -->
        <div class="bg-white rounded-xl p-6 shadow border">
          <h3 class="font-medium text-gray-800 mb-4">{{ t('Content Settings') }}</h3>
          
          <div class="space-y-4">
            <!-- Featured Brands Count -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('Featured Brands Count') }}
              </label>
              <select
                v-model="settingsData.featuredBrandsCount"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                @change="emitUpdate"
              >
                <option value="3">3 {{ t('brands') }}</option>
                <option value="6">6 {{ t('brands') }}</option>
                <option value="9">9 {{ t('brands') }}</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">
                {{ t('Number of brands to display in featured section') }}
              </p>
            </div>

            <!-- Show Today's Offer -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">{{ t('Show Today\'s Offer') }}</p>
                <p class="text-sm text-gray-500">{{ t('Display special offer section') }}</p>
              </div>
              <button
                @click="toggleTodayOffer"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settingsData.showTodaysOffer ? 'bg-gold-500' : 'bg-gray-300'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    settingsData.showTodaysOffer ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>

            <!-- Show Marquee Brands -->
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">{{ t('Show Marquee Brands') }}</p>
                <p class="text-sm text-gray-500">{{ t('Display scrolling brand logos') }}</p>
              </div>
              <button
                @click="toggleMarqueeBrands"
                :class="[
                  'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                  settingsData.showMarqueeBrands ? 'bg-gold-500' : 'bg-gray-300'
                ]"
              >
                <span
                  :class="[
                    'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                    settingsData.showMarqueeBrands ? 'translate-x-6' : 'translate-x-1'
                  ]"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- SEO Settings -->
        <div class="bg-white rounded-xl p-6 shadow border">
          <h3 class="font-medium text-gray-800 mb-4">{{ t('SEO Settings') }}</h3>
          
          <div class="space-y-4">
            <!-- Meta Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('Meta Title') }}
              </label>
              <input
                v-model="settingsData.metaTitle"
                type="text"
                maxlength="60"
                placeholder="Luxury Perfumes | Premium Fragrances"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                @input="emitUpdate"
              />
              <div class="flex justify-between mt-1">
                <p class="text-xs text-gray-500">{{ t('Title for search engines') }}</p>
                <span class="text-xs text-gray-500">{{ settingsData.metaTitle.length }}/60</span>
              </div>
            </div>

            <!-- Meta Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('Meta Description') }}
              </label>
              <textarea
                v-model="settingsData.metaDescription"
                rows="3"
                maxlength="160"
                placeholder="Discover our exclusive collection of luxury perfumes..."
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                @input="emitUpdate"
              ></textarea>
              <div class="flex justify-between mt-1">
                <p class="text-xs text-gray-500">{{ t('Description for search engines') }}</p>
                <span class="text-xs text-gray-500">{{ settingsData.metaDescription.length }}/160</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Preview -->
        <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 class="font-medium text-gray-800 mb-4">{{ t('Settings Preview') }}</h3>
          
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">{{ t('Dark Mode') }}</span>
              <span class="text-sm font-medium" :class="settingsData.isDarkMode ? 'text-green-600' : 'text-gray-600'">
                {{ settingsData.isDarkMode ? t('Enabled') : t('Disabled') }}
              </span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">{{ t('Language') }}</span>
              <span class="text-sm font-medium text-gray-900">
                {{ settingsData.defaultLanguage === 'ar' ? 'العربية' : 'English' }}
              </span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">{{ t('Featured Brands') }}</span>
              <span class="text-sm font-medium text-gray-900">
                {{ settingsData.featuredBrandsCount }} {{ t('brands') }}
              </span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">{{ t('Today\'s Offer') }}</span>
              <span class="text-sm font-medium" :class="settingsData.showTodaysOffer ? 'text-green-600' : 'text-gray-600'">
                {{ settingsData.showTodaysOffer ? t('Visible') : t('Hidden') }}
              </span>
            </div>
            
            <div class="flex justify-between">
              <span class="text-sm text-gray-600">{{ t('Marquee Brands') }}</span>
              <span class="text-sm font-medium" :class="settingsData.showMarqueeBrands ? 'text-green-600' : 'text-gray-600'">
                {{ settingsData.showMarqueeBrands ? t('Visible') : t('Hidden') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reset Section -->
    <div class="bg-red-50 rounded-xl p-6 border border-red-200">
      <div class="flex items-start gap-3">
        <svg class="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <div class="flex-1">
          <h3 class="font-semibold text-red-800">{{ t('Reset Settings') }}</h3>
          <p class="text-red-700 mt-1">{{ t('Reset all settings to their default values. This action cannot be undone.') }}</p>
          <button
            @click="resetSettings"
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            {{ t('Reset to Defaults') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLanguageStore } from '@/stores/language'

const props = defineProps<{
  settings: {
    isDarkMode: boolean
    defaultLanguage: string
    enableAnimations?: boolean
    marqueeSpeed?: number
    featuredBrandsCount?: number
    showTodaysOffer?: boolean
    showMarqueeBrands?: boolean
    metaTitle?: string
    metaDescription?: string
  }
}>()

const emit = defineEmits<{
  update: [settings: any]
  'change-detected': []
}>()

const languageStore = useLanguageStore()
const { t } = languageStore

// Local data with defaults
const settingsData = ref({
  isDarkMode: props.settings.isDarkMode || false,
  defaultLanguage: props.settings.defaultLanguage || 'ar',
  enableAnimations: props.settings.enableAnimations !== false,
  marqueeSpeed: props.settings.marqueeSpeed || 30,
  featuredBrandsCount: props.settings.featuredBrandsCount || 6,
  showTodaysOffer: props.settings.showTodaysOffer !== false,
  showMarqueeBrands: props.settings.showMarqueeBrands !== false,
  metaTitle: props.settings.metaTitle || 'Luxury Perfumes | Premium Fragrances',
  metaDescription: props.settings.metaDescription || 'Discover our exclusive collection of luxury perfumes, Arabic oud, French perfumes, and niche fragrances. Free shipping on orders over 2000 EGP.'
})

// Methods
const emitUpdate = () => {
  emit('update', settingsData.value)
  emit('change-detected')
}

const toggleDarkMode = () => {
  settingsData.value.isDarkMode = !settingsData.value.isDarkMode
  emitUpdate()
}

const toggleAnimations = () => {
  settingsData.value.enableAnimations = !settingsData.value.enableAnimations
  emitUpdate()
}

const toggleTodayOffer = () => {
  settingsData.value.showTodaysOffer = !settingsData.value.showTodaysOffer
  emitUpdate()
}

const toggleMarqueeBrands = () => {
  settingsData.value.showMarqueeBrands = !settingsData.value.showMarqueeBrands
  emitUpdate()
}

const resetSettings = () => {
  if (confirm(t('Are you sure you want to reset all settings to defaults?'))) {
    settingsData.value = {
      isDarkMode: false,
      defaultLanguage: 'ar',
      enableAnimations: true,
      marqueeSpeed: 30,
      featuredBrandsCount: 6,
      showTodaysOffer: true,
      showMarqueeBrands: true,
      metaTitle: 'Luxury Perfumes | Premium Fragrances',
      metaDescription: 'Discover our exclusive collection of luxury perfumes, Arabic oud, French perfumes, and niche fragrances. Free shipping on orders over 2000 EGP.'
    }
    
    emitUpdate()
  }
}
</script>

<style scoped>
.settings-editor {
  min-height: 500px;
}

/* Custom range slider */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-track {
  background: #e5e7eb;
  height: 0.5rem;
  border-radius: 0.25rem;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 1.25rem;
  width: 1.25rem;
  background-color: #d4af37;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-top: -0.375rem;
}

input[type="range"]::-moz-range-track {
  background: #e5e7eb;
  height: 0.5rem;
  border-radius: 0.25rem;
}

input[type="range"]::-moz-range-thumb {
  height: 1.25rem;
  width: 1.25rem;
  background-color: #d4af37;
  border-radius: 50%;
  border: 2px solid #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>