<!-- src/components/Admin/HomepageManagement.vue -->
<template>
  <div class="homepage-management p-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ t('Homepage Management') }}</h1>
        <p class="text-gray-600">{{ t('Manage all homepage sections and content') }}</p>
      </div>
      
      <div class="flex items-center gap-3">
        <!-- Preview Button -->
        <router-link
          to="/admin/homepage/preview"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          {{ t('Preview') }}
        </router-link>
        
        <!-- Refresh Store Data -->
        <button 
          @click="refreshStoreData"
          :disabled="isLoading"
          class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
        >
          <svg v-if="isLoading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
          </svg>
          {{ t('Refresh Data') }}
        </button>
        
        <!-- Save Button -->
        <button 
          @click="saveAllChanges"
          :disabled="isSaving || !hasChanges || isLoading"
          class="px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 disabled:opacity-50 flex items-center gap-2"
        >
          <svg v-if="isSaving" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
          <span>{{ isSaving ? t('Saving...') : t('Save Changes') }}</span>
        </button>
      </div>
    </div>

    <!-- Status Bar -->
    <div v-if="statusMessage" class="mb-6 p-4 rounded-lg" :class="statusType === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'">
      <div class="flex items-center gap-2">
        <svg v-if="statusType === 'success'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <p>{{ statusMessage }}</p>
      </div>
    </div>

    <!-- Last Updated -->
    <div v-if="lastUpdated" class="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div class="flex items-center justify-between">
        <p class="text-sm text-blue-700 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          {{ t('Last updated:') }} {{ formatDateTime(lastUpdated) }}
        </p>
        
        <!-- Sync Status -->
        <div class="text-sm flex items-center gap-2" :class="homepageStore.isListening ? 'text-green-600' : 'text-yellow-600'">
          <div class="w-2 h-2 rounded-full" :class="homepageStore.isListening ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'"></div>
          <span>{{ homepageStore.isListening ? t('Live Sync Active') : t('Offline Mode') }}</span>
        </div>
      </div>
    </div>

    <!-- Data Overview Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white p-4 rounded-lg shadow border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">{{ t('Featured Brands') }}</p>
            <p class="text-2xl font-bold text-gray-800">{{ homepageData.featuredBrands?.length || 0 }}</p>
          </div>
          <div class="p-2 bg-gold-50 rounded-lg">
            <svg class="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">{{ t('Active Offers') }}</p>
            <p class="text-2xl font-bold text-gray-800">{{ homepageData.activeOffers?.length || 0 }}</p>
          </div>
          <div class="p-2 bg-red-50 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">{{ t('Marquee Brands') }}</p>
            <p class="text-2xl font-bold text-gray-800">{{ homepageData.marqueeBrands?.length || 0 }}</p>
          </div>
          <div class="p-2 bg-blue-50 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
        </div>
      </div>
      
      <div class="bg-white p-4 rounded-lg shadow border">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-500">{{ t('Dark Mode') }}</p>
            <p class="text-2xl font-bold text-gray-800">{{ homepageData.settings?.isDarkMode ? t('ON') : t('OFF') }}</p>
          </div>
          <div class="p-2 bg-purple-50 rounded-lg">
            <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="mb-8">
      <nav class="flex flex-wrap gap-2 border-b">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-2 font-medium text-sm rounded-t-lg border-b-2 transition-colors',
            activeTab === tab.id
              ? 'border-gold-500 text-gold-700 bg-gold-50'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          <div class="flex items-center gap-2">
            <component :is="tab.icon" class="w-4 h-4" />
            {{ tab.label }}
          </div>
        </button>
      </nav>
    </div>

    <!-- Tab Content -->
    <div class="tab-content bg-white rounded-xl shadow border p-6">
      <!-- Hero Banner Tab -->
      <div v-if="activeTab === 'hero'" class="space-y-6">
        <HeroBannerEditor
          :hero-banner="homepageData.heroBanner"
          @update="handleHeroBannerUpdate"
          @change-detected="handleChangeDetected"
        />
      </div>

      <!-- Featured Brands Tab -->
      <div v-if="activeTab === 'brands'" class="space-y-6">
        <FeaturedBrandsEditor
          :brands="homepageData.featuredBrands"
          @update="handleFeaturedBrandsUpdate"
          @change-detected="handleChangeDetected"
        />
      </div>

      <!-- Offers Tab -->
      <div v-if="activeTab === 'offers'" class="space-y-6">
        <OffersEditor
          :offers="homepageData.activeOffers"
          @update="handleActiveOffersUpdate"
          @change-detected="handleChangeDetected"
        />
      </div>

      <!-- Marquee Brands Tab -->
      <div v-if="activeTab === 'marquee'" class="space-y-6">
        <MarqueeBrandsEditor
          :brands="homepageData.marqueeBrands"
          @update="handleMarqueeBrandsUpdate"
          @change-detected="handleChangeDetected"
        />
      </div>

      <!-- Settings Tab -->
      <div v-if="activeTab === 'settings'" class="space-y-6">
        <SettingsEditor
          :settings="homepageData.settings"
          @update="handleSettingsUpdate"
          @change-detected="handleChangeDetected"
        />
      </div>

      <!-- Danger Zone Tab -->
      <div v-if="activeTab === 'danger'" class="space-y-6">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6">
          <div class="flex items-start gap-3 mb-4">
            <svg class="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            <div>
              <h3 class="text-lg font-semibold text-red-800">{{ t('Danger Zone') }}</h3>
              <p class="text-red-700 mt-1">{{ t('These actions are irreversible. Use with caution.') }}</p>
            </div>
          </div>

          <div class="space-y-4">
            <!-- Sync with Brand Store -->
            <button
              @click="syncWithBrandStore"
              :disabled="isSyncingBrands"
              class="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full text-left flex items-center justify-between disabled:opacity-50"
            >
              <div>
                <p class="font-medium">{{ t('Sync with Brand Store') }}</p>
                <p class="text-sm opacity-90">{{ t('Update homepage with latest brand store data') }}</p>
              </div>
              <svg v-if="isSyncingBrands" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>

            <!-- Reset to Brand Store -->
            <button
              @click="resetToBrandStoreData"
              :disabled="isSyncingBrands"
              class="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 w-full text-left flex items-center justify-between disabled:opacity-50"
            >
              <div>
                <p class="font-medium">{{ t('Reset to Brand Store Data') }}</p>
                <p class="text-sm opacity-90">{{ t('Remove customizations and use brand store data') }}</p>
              </div>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </button>

            <!-- Reset to Defaults -->
            <button
              @click="resetToDefaults"
              class="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full text-left flex items-center justify-between"
            >
              <div>
                <p class="font-medium">{{ t('Reset to Factory Defaults') }}</p>
                <p class="text-sm opacity-90">{{ t('Restore all homepage content to factory defaults') }}</p>
              </div>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>

            <!-- Clear All Images -->
            <button
              @click="clearAllImages"
              class="px-4 py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 w-full text-left flex items-center justify-between"
            >
              <div>
                <p class="font-medium">{{ t('Clear All Images') }}</p>
                <p class="text-sm opacity-90">{{ t('Remove all uploaded images and restore defaults') }}</p>
              </div>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Debug Panel (Development Only) -->
    <div v-if="isDevelopment" class="mt-8 p-4 bg-gray-900 text-white rounded-lg">
      <details>
        <summary class="cursor-pointer font-mono text-sm">🛠️ Debug Information</summary>
        <div class="mt-3 space-y-2 text-xs font-mono">
          <div><strong>Store Loaded:</strong> {{ !homepageStore.isLoading }}</div>
          <div><strong>Has Changes:</strong> {{ hasChanges }}</div>
          <div><strong>Last Updated:</strong> {{ lastUpdated }}</div>
          <div><strong>Listening:</strong> {{ homepageStore.isListening }}</div>
          <div><strong>Error:</strong> {{ homepageStore.error || 'None' }}</div>
          <div><strong>Hero Banner Image:</strong> {{ homepageData.heroBanner?.imageUrl?.substring(0, 50) }}...</div>
          <div class="mt-4">
            <button @click="debugCurrentState" class="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">
              Log Current State
            </button>
            <button @click="forceRefresh" class="ml-2 px-3 py-1 bg-gray-700 rounded hover:bg-gray-600">
              Force Refresh
            </button>
          </div>
        </div>
      </details>
    </div>

    <!-- Unsaved Changes Warning -->
    <div v-if="hasChanges && !isSaving" class="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-pulse z-50">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
      </svg>
      <span>{{ t('You have unsaved changes') }}</span>
      <button @click="saveAllChanges" class="ml-2 px-3 py-1 bg-yellow-600 rounded hover:bg-yellow-700 text-sm">
        {{ t('Save Now') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { useHomepageStore } from '@/stores/homepage'
import HeroBannerEditor from './HeroBannerEditor.vue'
import FeaturedBrandsEditor from './FeaturedBrandsEditor.vue'
import OffersEditor from './OffersEditor.vue'
import MarqueeBrandsEditor from './AddMarqueeBrandsEditor.vue'
import SettingsEditor from './SettingsEditor.vue'

// Tab Icons - UPDATED TO HEROICONS V2 FORMAT
import {
  PhotoIcon as PhotographIcon,           // Changed: PhotographIcon → PhotoIcon
  Squares2X2Icon as CollectionIcon,      // Changed: CollectionIcon → Squares2X2Icon
  TagIcon,
  ArrowRightCircleIcon as ArrowCircleRightIcon, // Changed: ArrowCircleRightIcon → ArrowRightCircleIcon
  Cog6ToothIcon as CogIcon,              // Changed: CogIcon → Cog6ToothIcon
  ExclamationTriangleIcon as ExclamationCircleIcon // Changed: ExclamationCircleIcon → ExclamationTriangleIcon
} from '@heroicons/vue/24/outline' // Changed: '@heroicons/vue/outline' → '@heroicons/vue/24/outline'

const languageStore = useLanguageStore()
const homepageStore = useHomepageStore()
const { t } = languageStore

// Development mode check
const isDevelopment = import.meta.env.DEV

// State
const activeTab = ref('hero')
const isSaving = ref(false)
const isSyncingBrands = ref(false)
const hasChanges = ref(false)
const lastUpdated = ref<Date | null>(null)
const statusMessage = ref('')
const statusType = ref<'success' | 'error'>('success')

// Remove local copy - USE STORE DIRECTLY
const homepageData = computed(() => homepageStore.homepageData || {})
const isLoading = computed(() => homepageStore.isLoading)

// Tabs configuration
const tabs = [
  { id: 'hero', label: t('Hero Banner'), icon: PhotographIcon },
  { id: 'brands', label: t('Featured Brands'), icon: CollectionIcon },
  { id: 'offers', label: t('Special Offers'), icon: TagIcon },
  { id: 'marquee', label: t('Marquee Brands'), icon: ArrowCircleRightIcon },
  { id: 'settings', label: t('Settings'), icon: CogIcon },
  { id: 'danger', label: t('Danger Zone'), icon: ExclamationCircleIcon }
]

// Initialize with store data
onMounted(async () => {
  console.log('🏠 HomepageManagement mounted - Loading data...')
  
  try {
    // Clear any old cache first
    homepageStore.clearCache()
    
    // Load homepage data from store
    await homepageStore.loadHomepageData()
    
    console.log('📊 Homepage data loaded:', {
      brands: homepageData.value.featuredBrands?.length || 0,
      offers: homepageData.value.activeOffers?.length || 0,
      marquee: homepageData.value.marqueeBrands?.length || 0,
      lastUpdated: homepageData.value.lastUpdated || 'Never'
    })
    
    lastUpdated.value = homepageData.value.lastUpdated ? new Date(homepageData.value.lastUpdated) : new Date()
    
    // Apply dark mode from settings
    if (homepageData.value.settings?.isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    
    statusMessage.value = t('✅ Homepage data loaded successfully!')
    statusType.value = 'success'
    
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
    
  } catch (error: any) {
    console.error('❌ Error loading homepage data:', error)
    statusMessage.value = t('❌ Failed to load homepage data: ') + error.message
    statusType.value = 'error'
    
    setTimeout(() => {
      statusMessage.value = ''
    }, 5000)
  }
})

// Handle updates from child components - UPDATED VERSION
const handleHeroBannerUpdate = (data: any) => {
  hasChanges.value = true
  console.log('🔄 Hero banner update received:', {
    title: data.title,
    subtitle: data.subtitle,
    hasImage: !!data.imageUrl,
    imageType: data.imageUrl?.startsWith('data:image/') ? 'base64' : 'url'
  })
  
  // IMPORTANT: Make sure we're updating the store properly
  if (homepageStore.homepageData) {
    homepageStore.homepageData.heroBanner = {
      ...homepageStore.homepageData.heroBanner,
      imageUrl: data.imageUrl || homepageStore.homepageData.heroBanner.imageUrl,
      title: data.title || homepageStore.homepageData.heroBanner.title,
      subtitle: data.subtitle || homepageStore.homepageData.heroBanner.subtitle
    }
  }
  
  statusMessage.value = t('Hero banner updated locally. Click Save to apply.')
  statusType.value = 'success'
  
  setTimeout(() => {
    if (statusMessage.value.includes('locally')) {
      statusMessage.value = ''
    }
  }, 3000)
}

const handleFeaturedBrandsUpdate = (brands: any[]) => {
  hasChanges.value = true
  console.log('🔄 Featured brands update received:', brands.length, 'brands')
  
  // Update store directly
  homepageStore.homepageData.featuredBrands = brands
  
  statusMessage.value = t('Featured brands updated locally. Click Save to apply.')
  statusType.value = 'success'
  
  setTimeout(() => {
    if (statusMessage.value.includes('locally')) {
      statusMessage.value = ''
    }
  }, 3000)
}

const handleActiveOffersUpdate = (offers: any[]) => {
  hasChanges.value = true
  console.log('🔄 Active offers update received:', offers.length, 'offers')
  
  // Update store directly
  homepageStore.homepageData.activeOffers = offers
  
  statusMessage.value = t('Offers updated locally. Click Save to apply.')
  statusType.value = 'success'
  
  setTimeout(() => {
    if (statusMessage.value.includes('locally')) {
      statusMessage.value = ''
    }
  }, 3000)
}

const handleMarqueeBrandsUpdate = (brands: any[]) => {
  hasChanges.value = true
  console.log('🔄 Marquee brands update received:', brands.length, 'brands')
  
  // Update store directly
  homepageStore.homepageData.marqueeBrands = brands
  
  statusMessage.value = t('Marquee brands updated locally. Click Save to apply.')
  statusType.value = 'success'
  
  setTimeout(() => {
    if (statusMessage.value.includes('locally')) {
      statusMessage.value = ''
    }
  }, 3000)
}

const handleSettingsUpdate = (settings: any) => {
  hasChanges.value = true
  console.log('🔄 Settings update received:', settings)
  
  // Update store directly
  homepageStore.homepageData.settings = {
    ...homepageStore.homepageData.settings,
    ...settings
  }
  
  // Apply dark mode immediately
  if (settings.isDarkMode !== undefined) {
    if (settings.isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  statusMessage.value = t('Settings updated locally. Click Save to apply.')
  statusType.value = 'success'
  
  setTimeout(() => {
    if (statusMessage.value.includes('locally')) {
      statusMessage.value = ''
    }
  }, 3000)
}

const handleChangeDetected = () => {
  hasChanges.value = true
}

// Format date time
const formatDateTime = (date: Date) => {
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// Refresh store data
const refreshStoreData = async () => {
  try {
    console.log('🔄 Refreshing store data...')
    await homepageStore.forceRefresh()
    
    lastUpdated.value = homepageData.value.lastUpdated ? new Date(homepageData.value.lastUpdated) : new Date()
    statusMessage.value = t('✅ Data refreshed from Firebase!')
    statusType.value = 'success'
    
    setTimeout(() => {
      statusMessage.value = ''
    }, 3000)
  } catch (error: any) {
    console.error('❌ Error refreshing data:', error)
    statusMessage.value = t('❌ Failed to refresh data: ') + error.message
    statusType.value = 'error'
  }
}

// Force refresh helper
const forceRefresh = async () => {
  try {
    await homepageStore.forceRefresh()
    console.log('✅ Forced refresh completed')
  } catch (error) {
    console.error('❌ Force refresh failed:', error)
  }
}

// Save all changes - UPDATED VERSION
const saveAllChanges = async () => {
  if (!hasChanges.value || isSaving.value) return
  
  isSaving.value = true
  statusMessage.value = t('💾 Saving changes to Firebase...')
  statusType.value = 'success'
  
  try {
    console.log('💾 SAVING ALL HOMEPAGE CHANGES TO FIREBASE...')
    
    // Get current data from store
    const currentData = {
      heroBanner: homepageStore.homepageData?.heroBanner || homepageData.value.heroBanner,
      featuredBrands: homepageStore.homepageData?.featuredBrands || homepageData.value.featuredBrands,
      activeOffers: homepageStore.homepageData?.activeOffers || homepageData.value.activeOffers,
      marqueeBrands: homepageStore.homepageData?.marqueeBrands || homepageData.value.marqueeBrands,
      settings: homepageStore.homepageData?.settings || homepageData.value.settings
    }
    
    console.log('📊 Saving data:', {
      heroBanner: currentData.heroBanner,
      brandsCount: currentData.featuredBrands?.length,
      offersCount: currentData.activeOffers?.length,
      marqueeCount: currentData.marqueeBrands?.length,
      imageType: currentData.heroBanner?.imageUrl?.startsWith('data:image/') ? 'base64' : 'url'
    })
    
    // Save all sections to Firebase
    const updatePromises = [
      homepageStore.updateHeroBanner(currentData.heroBanner),
      homepageStore.updateFeaturedBrands(currentData.featuredBrands),
      homepageStore.updateActiveOffers(currentData.activeOffers),
      homepageStore.updateMarqueeBrands(currentData.marqueeBrands),
      homepageStore.updateSettings(currentData.settings)
    ]
    
    console.log('📤 Sending updates to Firebase...')
    const results = await Promise.allSettled(updatePromises)
    
    // Check results
    const allSucceeded = results.every(result => 
      result.status === 'fulfilled' && result.value === true
    )
    
    if (allSucceeded) {
      hasChanges.value = false
      lastUpdated.value = new Date()
      statusMessage.value = t('✅ Homepage updated successfully! Changes should appear on homepage immediately.')
      statusType.value = 'success'
      console.log('🎉 ALL UPDATES SAVED SUCCESSFULLY!')
      
      // Clear cache to force refresh
      homepageStore.clearCache()
      
      // Force refresh the homepage data
      setTimeout(async () => {
        await homepageStore.forceRefresh()
        console.log('🔄 Homepage data refreshed after save')
      }, 1000)
      
      // Clear status message after 5 seconds
      setTimeout(() => {
        statusMessage.value = ''
      }, 5000)
    } else {
      const failedUpdates = results
        .map((result, index) => result.status === 'rejected' ? 
          ['Hero Banner', 'Featured Brands', 'Active Offers', 'Marquee Brands', 'Settings'][index] : null)
        .filter(Boolean)
      
      throw new Error(`Some updates failed: ${failedUpdates.join(', ')}`)
    }
  } catch (error: any) {
    console.error('🔥 ERROR SAVING HOMEPAGE:', error)
    statusMessage.value = t('❌ Failed to save changes: ') + error.message
    statusType.value = 'error'
    
    // Provide more specific error messages
    if (error.message.includes('permission')) {
      statusMessage.value = t('⚠️ Permission denied! Please check your admin permissions.')
    } else if (error.message.includes('not-found')) {
      statusMessage.value = t('⚠️ Firebase document not found! Please initialize homepage first.')
    } else if (error.message.includes('network')) {
      statusMessage.value = t('⚠️ Network error! Please check your internet connection.')
    }
    
    // Show error for 7 seconds
    setTimeout(() => {
      statusMessage.value = ''
    }, 7000)
  } finally {
    isSaving.value = false
  }
}

// Sync with brand store
const syncWithBrandStore = async () => {
  if (!confirm(t('This will update homepage data with the latest from the brand store. Continue?'))) {
    return
  }
  
  isSyncingBrands.value = true
  statusMessage.value = t('🔄 Syncing with brand store...')
  statusType.value = 'success'
  
  try {
    console.log('🔄 Syncing with brand store...')
    
    if (typeof (homepageStore as any).syncBrandStoreData === 'function') {
      await (homepageStore as any).syncBrandStoreData()
      hasChanges.value = true
      statusMessage.value = t('✅ Synced with brand store! Click Save to apply changes.')
      console.log('✅ Brand store sync completed')
    } else {
      statusMessage.value = t('⚠️ Brand store sync not available in current store.')
      statusType.value = 'error'
    }
  } catch (error: any) {
    console.error('❌ Error syncing with brand store:', error)
    statusMessage.value = t('❌ Failed to sync with brand store: ') + error.message
    statusType.value = 'error'
  } finally {
    isSyncingBrands.value = false
    
    setTimeout(() => {
      statusMessage.value = ''
    }, 5000)
  }
}

// Reset to brand store data
const resetToBrandStoreData = async () => {
  if (!confirm(t('This will remove all customizations and use brand store data instead. Continue?'))) {
    return
  }
  
  try {
    if (typeof (homepageStore as any).resetToBrandStoreData === 'function') {
      await (homepageStore as any).resetToBrandStoreData()
      hasChanges.value = false
      lastUpdated.value = new Date()
      statusMessage.value = t('✅ Reset to brand store data!')
      statusType.value = 'success'
      console.log('✅ Reset to brand store data')
      
      setTimeout(() => {
        statusMessage.value = ''
      }, 5000)
    } else {
      statusMessage.value = t('⚠️ Reset to brand store not available.')
      statusType.value = 'error'
    }
  } catch (error: any) {
    console.error('❌ Error resetting to brand store:', error)
    statusMessage.value = t('❌ Failed to reset: ') + error.message
    statusType.value = 'error'
  }
}

// Reset to defaults
const resetToDefaults = async () => {
  if (!confirm(t('Are you sure you want to reset all homepage content to defaults? This action cannot be undone.'))) {
    return
  }
  
  try {
    isSaving.value = true
    console.log('🔄 Resetting to defaults...')
    
    const success = await homepageStore.resetToLocalDefaults()
    
    if (success) {
      hasChanges.value = false
      lastUpdated.value = new Date()
      statusMessage.value = t('✅ Homepage reset to defaults!')
      statusType.value = 'success'
      console.log('✅ Reset to defaults successful!')
      
      setTimeout(() => {
        statusMessage.value = ''
      }, 5000)
    } else {
      throw new Error('Reset operation failed')
    }
  } catch (error) {
    console.error('❌ Error resetting to defaults:', error)
    statusMessage.value = t('Failed to reset homepage.')
    statusType.value = 'error'
  } finally {
    isSaving.value = false
  }
}

// Clear all images
const clearAllImages = async () => {
  if (!confirm(t('WARNING: This will remove all custom images and restore default images. This action cannot be undone. Are you sure?'))) {
    return
  }
  
  try {
    isSaving.value = true
    console.log('🗑️ Clearing all images...')
    
    if (typeof homepageStore.getDefaultData !== 'function') {
      throw new Error('getDefaultData method not found in store')
    }
    
    const defaultData = homepageStore.getDefaultData()
    
    homepageStore.homepageData.heroBanner.imageUrl = defaultData.heroBanner.imageUrl
    homepageStore.homepageData.featuredBrands = defaultData.featuredBrands.map((brand: any, index: number) => ({
      ...brand,
      image: defaultData.featuredBrands[index]?.image || '/images/placeholder-brand.jpg'
    }))
    homepageStore.homepageData.activeOffers = defaultData.activeOffers.map((offer: any, index: number) => ({
      ...offer,
      imageUrl: defaultData.activeOffers[index]?.imageUrl || '/images/placeholder-offer.jpg'
    }))
    homepageStore.homepageData.marqueeBrands = defaultData.marqueeBrands.map((brand: any, index: number) => ({
      ...brand,
      logo: defaultData.marqueeBrands[index]?.logo || '/images/placeholder-logo.png'
    }))
    
    hasChanges.value = true
    statusMessage.value = t('✅ All images cleared. Click Save Changes to apply.')
    statusType.value = 'success'
    console.log('✅ Images cleared from store')
    
    setTimeout(() => {
      statusMessage.value = ''
    }, 5000)
  } catch (error: any) {
    console.error('❌ Error clearing images:', error)
    statusMessage.value = t('Failed to clear images: ') + error.message
    statusType.value = 'error'
  } finally {
    isSaving.value = false
  }
}

// Add debug helper
const debugCurrentState = () => {
  console.log('🔍 DEBUG: Current store state:', {
    store: homepageStore.homepageData,
    hasChanges: hasChanges.value,
    lastUpdated: lastUpdated.value,
    isLoading: homepageStore.isLoading,
    error: homepageStore.error,
    isListening: homepageStore.isListening
  })
}

// Export for debugging
if (import.meta.env.DEV) {
  (window as any).debugHomepage = debugCurrentState
}
</script>

<style scoped>
.homepage-management {
  min-height: calc(100vh - 80px);
}

.tab-content {
  min-height: 500px;
}

/* Animation for unsaved changes warning */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Custom scrollbar */
.tab-content {
  max-height: calc(100vh - 400px);
  overflow-y: auto;
}

.tab-content::-webkit-scrollbar {
  width: 8px;
}

.tab-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.tab-content::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 4px;
}

.tab-content::-webkit-scrollbar-thumb:hover {
  background: #b8941f;
}
</style>