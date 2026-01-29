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
        
        <!-- Save Button -->
        <button 
          @click="saveAllChanges"
          :disabled="isSaving || !hasChanges"
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
      <p class="text-sm text-blue-700 flex items-center gap-2">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        {{ t('Last updated:') }} {{ formatDateTime(lastUpdated) }}
      </p>
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
            <button
              @click="resetToDefaults"
              class="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full text-left flex items-center justify-between"
            >
              <div>
                <p class="font-medium">{{ t('Reset to Defaults') }}</p>
                <p class="text-sm opacity-90">{{ t('Restore all homepage content to factory defaults') }}</p>
              </div>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </button>

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

    <!-- Unsaved Changes Warning -->
    <div v-if="hasChanges && !isSaving" class="fixed bottom-4 right-4 bg-yellow-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-pulse">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
      </svg>
      <span>{{ t('You have unsaved changes') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useHomepageStore } from '@/stores/homepage'
import HeroBannerEditor from './HeroBannerEditor.vue'
import FeaturedBrandsEditor from './FeaturedBrandsEditor.vue'
import OffersEditor from './OffersEditor.vue'
import MarqueeBrandsEditor from './AddMarqueeBrandsEditor.vue'
import SettingsEditor from './SettingsEditor.vue'

// Icons for tabs
const icons = {
  hero: 'svg',
  brands: 'svg',
  offers: 'svg',
  marquee: 'svg',
  settings: 'svg',
  danger: 'svg'
}

const router = useRouter()
const languageStore = useLanguageStore()
const homepageStore = useHomepageStore()
const { t } = languageStore

// State
const activeTab = ref('hero')
const isSaving = ref(false)
const hasChanges = ref(false)
const lastUpdated = ref<Date | null>(null)
const statusMessage = ref('')
const statusType = ref<'success' | 'error'>('success')

// Tabs configuration
const tabs = [
  { 
    id: 'hero', 
    label: t('Hero Banner'),
    icon: icons.hero
  },
  { 
    id: 'brands', 
    label: t('Featured Brands'),
    icon: icons.brands
  },
  { 
    id: 'offers', 
    label: t('Special Offers'),
    icon: icons.offers
  },
  { 
    id: 'marquee', 
    label: t('Marquee Brands'),
    icon: icons.marquee
  },
  { 
    id: 'settings', 
    label: t('Settings'),
    icon: icons.settings
  },
  { 
    id: 'danger', 
    label: t('Danger Zone'),
    icon: icons.danger
  }
]

// Local copy of homepage data
const homepageData = reactive({
  heroBanner: { ...homepageStore.homepageData.heroBanner },
  featuredBrands: [...homepageStore.homepageData.featuredBrands],
  activeOffers: [...homepageStore.homepageData.activeOffers],
  marqueeBrands: [...homepageStore.homepageData.marqueeBrands],
  settings: { ...homepageStore.homepageData.settings }
})

// Initialize with store data
onMounted(async () => {
  await homepageStore.loadHomepageData()
  Object.assign(homepageData, homepageStore.homepageData)
  lastUpdated.value = new Date()
})

// Watch for changes from child components
const handleHeroBannerUpdate = (data: any) => {
  Object.assign(homepageData.heroBanner, data)
  handleChangeDetected()
}

const handleFeaturedBrandsUpdate = (brands: any[]) => {
  homepageData.featuredBrands = brands
  handleChangeDetected()
}

const handleActiveOffersUpdate = (offers: any[]) => {
  homepageData.activeOffers = offers
  handleChangeDetected()
}

const handleMarqueeBrandsUpdate = (brands: any[]) => {
  homepageData.marqueeBrands = brands
  handleChangeDetected()
}

const handleSettingsUpdate = (settings: any) => {
  Object.assign(homepageData.settings, settings)
  handleChangeDetected()
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
    minute: '2-digit'
  })
}

// Save all changes
const saveAllChanges = async () => {
  if (!hasChanges.value) return
  
  isSaving.value = true
  statusMessage.value = ''
  
  try {
    console.log('💾 Saving all homepage changes...')
    
    // Save all sections to Firebase
    const promises = [
      homepageStore.updateHeroBanner(homepageData.heroBanner),
      homepageStore.updateFeaturedBrands(homepageData.featuredBrands),
      homepageStore.updateActiveOffers(homepageData.activeOffers),
      homepageStore.updateMarqueeBrands(homepageData.marqueeBrands),
      homepageStore.updateSettings(homepageData.settings)
    ]
    
    console.log('📤 Sending updates to Firebase...')
    const results = await Promise.allSettled(promises)
    
    // Check results
    const failedUpdates: string[] = []
    results.forEach((result, index) => {
      if (result.status === 'rejected') {
        failedUpdates.push(`Update ${index + 1} failed`)
        console.error(`❌ Update ${index + 1} failed:`, result.reason)
      } else if (result.value === false) {
        failedUpdates.push(`Update ${index + 1} returned false`)
        console.error(`❌ Update ${index + 1} returned false`)
      }
    })
    
    if (failedUpdates.length === 0) {
      hasChanges.value = false
      lastUpdated.value = new Date()
      statusMessage.value = t('Homepage updated successfully!')
      statusType.value = 'success'
      console.log('✅ All updates saved successfully!')
      
      // Clear status message after 5 seconds
      setTimeout(() => {
        statusMessage.value = ''
      }, 5000)
    } else {
      throw new Error(`Some updates failed: ${failedUpdates.join(', ')}`)
    }
  } catch (error) {
    console.error('❌ Error saving homepage:', error)
    statusMessage.value = t('Failed to save changes. Please try again.')
    statusType.value = 'error'
    
    // Show error for 7 seconds
    setTimeout(() => {
      statusMessage.value = ''
    }, 7000)
  } finally {
    isSaving.value = false
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
      // Reload data from store
      Object.assign(homepageData, homepageStore.homepageData)
      hasChanges.value = false
      lastUpdated.value = new Date()
      statusMessage.value = t('Homepage reset to defaults successfully!')
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
    
    // Check if getDefaultData method exists
    if (typeof homepageStore.getDefaultData !== 'function') {
      throw new Error('getDefaultData method not found in store')
    }
    
    // Restore default images using the store's method
    const defaultData = homepageStore.getDefaultData()
    console.log('📋 Default data retrieved:', defaultData)
    
    homepageData.heroBanner.imageUrl = defaultData.heroBanner.imageUrl
    homepageData.featuredBrands = defaultData.featuredBrands.map(brand => ({
      ...brand,
      image: brand.image // Default image
    }))
    homepageData.activeOffers = defaultData.activeOffers.map(offer => ({
      ...offer,
      imageUrl: offer.imageUrl // Default image
    }))
    homepageData.marqueeBrands = defaultData.marqueeBrands.map(brand => ({
      ...brand,
      logo: brand.logo // Default logo
    }))
    
    hasChanges.value = true
    statusMessage.value = t('All images cleared. Click Save Changes to apply.')
    statusType.value = 'success'
    console.log('✅ Images cleared from local data')
    
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

// Auto-save warning
watch(hasChanges, (newVal) => {
  if (newVal) {
    console.log('⚠️ Unsaved changes detected')
  }
})
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
  50% { opacity: 0.8; }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Custom scrollbar */
.tab-content {
  max-height: calc(100vh - 300px);
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