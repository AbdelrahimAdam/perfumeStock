<template>
  <div class="min-h-screen bg-white flex items-center justify-center px-4">
    <div class="text-center max-w-lg">
      <div class="w-32 h-32 mx-auto mb-8 text-primary-500">
        <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      
      <h1 class="text-6xl font-display-en font-bold text-gray-900 mb-4">404</h1>
      <h2 class="text-2xl font-bold text-gray-900 mb-4">
        {{ t('Page Not Found') }}
      </h2>
      <p class="text-gray-600 mb-8">
        {{ t('The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.') }}
      </p>
      
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <router-link
          to="/"
          class="px-6 py-3 bg-primary-500 text-white rounded-lg font-medium 
                 hover:bg-primary-600 transition-colors"
        >
          {{ t('Back to Home') }}
        </router-link>
        <router-link
          to="/category/best-sellers"
          class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg 
                 font-medium hover:border-primary-500 hover:text-primary-600 
                 transition-colors"
        >
          {{ t('Browse Products') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const { t } = languageStore
</script>