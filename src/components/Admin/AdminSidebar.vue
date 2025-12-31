<template>
  <aside class="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white z-40">
    <!-- Logo -->
    <div class="p-6 border-b border-gray-800">
      <div class="flex items-center space-x-3">
        <div class="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center">
          <svg class="w-6 h-6 text-black" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <div>
          <h2 class="text-lg font-display-en font-bold">Admin</h2>
          <p class="text-xs text-gray-400">Luxury Perfume Store</p>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="p-4 space-y-1">
      <router-link
        to="/admin"
        class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors"
        :class="[
          $route.path === '/admin'
            ? 'bg-primary-500 text-white'
            : 'text-gray-300 hover:bg-gray-800'
        ]"
        :style="{ direction: isRTL ? 'rtl' : 'ltr' }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
        </svg>
        <span>{{ currentLanguage === 'en' ? 'Dashboard' : 'لوحة التحكم' }}</span>
      </router-link>

      <router-link
        to="/admin/products"
        class="flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors"
        :class="[
          $route.path.startsWith('/admin/products')
            ? 'bg-primary-500 text-white'
            : 'text-gray-300 hover:bg-gray-800'
        ]"
        :style="{ direction: isRTL ? 'rtl' : 'ltr' }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>
        <span>{{ currentLanguage === 'en' ? 'Products' : 'المنتجات' }}</span>
      </router-link>

      <router-link
        to="#"
        class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 
               hover:bg-gray-800 transition-colors"
        :style="{ direction: isRTL ? 'rtl' : 'ltr' }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span>{{ currentLanguage === 'en' ? 'Orders' : 'الطلبات' }}</span>
      </router-link>

      <router-link
        to="#"
        class="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-400 
               hover:bg-gray-800 transition-colors"
        :style="{ direction: isRTL ? 'rtl' : 'ltr' }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
        </svg>
        <span>{{ currentLanguage === 'en' ? 'Customers' : 'العملاء' }}</span>
      </router-link>
    </nav>

    <!-- User Profile -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
      <div class="flex items-center space-x-3" :style="{ direction: isRTL ? 'rtl' : 'ltr' }">
        <div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
          <span class="text-sm font-bold">{{ userInitials }}</span>
        </div>
        <div class="flex-1">
          <p class="text-sm font-medium">{{ authStore.user?.email }}</p>
          <p class="text-xs text-gray-400">{{ currentLanguage === 'en' ? 'Admin' : 'مسؤول' }}</p>
        </div>
        <button
          @click="authStore.logout"
          class="p-2 text-gray-400 hover:text-white transition-colors"
          :title="currentLanguage === 'en' ? 'Logout' : 'تسجيل خروج'"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { useAuthStore } from '@/stores/auth'

const languageStore = useLanguageStore()
const authStore = useAuthStore()

const { currentLanguage, isRTL } = languageStore

const userInitials = computed(() => {
  const email = authStore.user?.email || ''
  return email.charAt(0).toUpperCase()
})
</script>