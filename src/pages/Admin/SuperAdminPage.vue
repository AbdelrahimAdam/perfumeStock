<!-- src/pages/Admin/SuperAdminPage.vue -->
<template>
  <div class="super-admin-page p-6">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-2">{{ t('Super Admin Panel') }}</h1>
      <p class="text-gray-600">{{ t('Advanced system management and configuration') }}</p>
    </div>

    <!-- Warning Banner -->
    <div class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div class="flex items-start gap-3">
        <svg class="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z"/>
        </svg>
        <div>
          <h3 class="font-medium text-red-800">{{ t('Restricted Access') }}</h3>
          <p class="text-sm text-red-700 mt-1">
            {{ t('This section contains sensitive system configurations. Only authorized super admins should access these features.') }}
          </p>
        </div>
      </div>
    </div>

    <!-- System Overview -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- System Status -->
      <div class="bg-white rounded-xl p-6 shadow border">
        <h2 class="text-lg font-semibold mb-4">{{ t('System Status') }}</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-600">{{ t('Database') }}</span>
            <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {{ t('Online') }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">{{ t('Storage') }}</span>
            <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {{ t('68% Used') }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">{{ t('API Services') }}</span>
            <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              {{ t('All Running') }}
            </span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">{{ t('Last Backup') }}</span>
            <span class="text-sm">{{ formatDate('2024-01-15 03:00') }}</span>
          </div>
        </div>
      </div>

      <!-- User Management -->
      <div class="bg-white rounded-xl p-6 shadow border">
        <h2 class="text-lg font-semibold mb-4">{{ t('User Management') }}</h2>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-600">{{ t('Total Admins') }}</span>
            <span class="font-semibold">5</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">{{ t('Super Admins') }}</span>
            <span class="font-semibold">2</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-gray-600">{{ t('Active Sessions') }}</span>
            <span class="font-semibold">3</span>
          </div>
          <div class="pt-4">
            <button @click="manageAdmins" class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
              {{ t('Manage Admin Users') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Advanced Features Grid -->
    <div class="mb-8">
      <h2 class="text-lg font-semibold mb-4">{{ t('Advanced Features') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button 
          @click="openDatabaseTools"
          class="bg-white p-6 rounded-xl shadow border hover:shadow-md transition-shadow text-left"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="p-3 bg-blue-100 rounded-lg">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"/>
              </svg>
            </div>
          </div>
          <h3 class="font-semibold mb-2">{{ t('Database Tools') }}</h3>
          <p class="text-sm text-gray-600">{{ t('Manage database backups, indexes, and exports') }}</p>
        </button>

        <button 
          @click="openSystemLogs"
          class="bg-white p-6 rounded-xl shadow border hover:shadow-md transition-shadow text-left"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="p-3 bg-gray-100 rounded-lg">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
          </div>
          <h3 class="font-semibold mb-2">{{ t('System Logs') }}</h3>
          <p class="text-sm text-gray-600">{{ t('View application and error logs') }}</p>
        </button>

        <button 
          @click="openConfiguration"
          class="bg-white p-6 rounded-xl shadow border hover:shadow-md transition-shadow text-left"
        >
          <div class="flex items-center gap-3 mb-3">
            <div class="p-3 bg-yellow-100 rounded-lg">
              <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
          </div>
          <h3 class="font-semibold mb-2">{{ t('System Configuration') }}</h3>
          <p class="text-sm text-gray-600">{{ t('Configure application settings and features') }}</p>
        </button>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="bg-white rounded-xl p-6 shadow border mb-8">
      <h2 class="text-lg font-semibold mb-4">{{ t('Quick Actions') }}</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <button 
          @click="clearCache"
          class="px-4 py-3 border rounded-lg hover:bg-gray-50 text-left"
        >
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            <span>{{ t('Clear Cache') }}</span>
          </div>
        </button>

        <button 
          @click="runBackup"
          class="px-4 py-3 border rounded-lg hover:bg-gray-50 text-left"
        >
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span>{{ t('Run Backup') }}</span>
          </div>
        </button>

        <button 
          @click="viewAnalytics"
          class="px-4 py-3 border rounded-lg hover:bg-gray-50 text-left"
        >
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            <span>{{ t('View Analytics') }}</span>
          </div>
        </button>

        <button 
          @click="systemDiagnostics"
          class="px-4 py-3 border rounded-lg hover:bg-gray-50 text-left"
        >
          <div class="flex items-center gap-3">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span>{{ t('System Diagnostics') }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="bg-red-50 border border-red-200 rounded-xl p-6">
      <h2 class="text-lg font-semibold text-red-800 mb-4">{{ t('Danger Zone') }}</h2>
      <p class="text-red-700 mb-4">{{ t('These actions are irreversible and may affect the entire system.') }}</p>
      <div class="space-y-4">
        <button 
          @click="resetSystem"
          class="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 w-full md:w-auto"
        >
          {{ t('Reset System to Defaults') }}
        </button>
        <button 
          @click="purgeData"
          class="px-6 py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 w-full md:w-auto"
        >
          {{ t('Purge All Test Data') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const { t } = languageStore

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString()
}

const manageAdmins = () => {
  alert('Admin management feature coming soon')
}

const openDatabaseTools = () => {
  alert('Database tools feature coming soon')
}

const openSystemLogs = () => {
  alert('System logs feature coming soon')
}

const openConfiguration = () => {
  alert('System configuration feature coming soon')
}

const clearCache = () => {
  if (confirm(t('Are you sure you want to clear all cache?'))) {
    alert('Cache cleared successfully')
  }
}

const runBackup = () => {
  alert('Backup initiated. You will receive an email when completed.')
}

const viewAnalytics = () => {
  alert('Analytics feature coming soon')
}

const systemDiagnostics = () => {
  alert('Running system diagnostics...')
}

const resetSystem = () => {
  if (confirm(t('WARNING: This will reset all system configurations to defaults. Are you absolutely sure?'))) {
    alert('System reset initiated')
  }
}

const purgeData = () => {
  if (confirm(t('WARNING: This will permanently delete all test data. This action cannot be undone. Are you sure?'))) {
    alert('Test data purge initiated')
  }
}
</script>

<style scoped>
.super-admin-page {
  min-height: calc(100vh - 80px);
}
</style>