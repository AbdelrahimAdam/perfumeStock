<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 rounded-full 
                    bg-gradient-gold shadow-gold-lg mb-4">
          <svg class="w-8 h-8 text-black" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" 
                  stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="text-3xl font-display-en font-bold text-gray-900">
          Parfum<span class="text-primary-500">.</span>
        </h1>
        <p class="text-gray-600 mt-2">Admin Dashboard</p>
      </div>

      <!-- Login Form -->
      <div class="bg-white rounded-2xl shadow-luxury-xl p-8">
        <h2 class="text-2xl font-display-en font-bold text-gray-900 mb-6">
          {{ t('Admin Login') }}
        </h2>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('Email Address') }}
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                     focus:ring-primary-500 focus:border-primary-500"
              :placeholder="t('admin@example.com')"
              :disabled="loading"
            />
          </div>

          <!-- Password -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-gray-700">
                {{ t('Password') }}
              </label>
              <!-- Forgot Password Link (if implemented) -->
            </div>
            <input
              v-model="form.password"
              type="password"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                     focus:ring-primary-500 focus:border-primary-500"
              :placeholder="t('Enter your password')"
              :disabled="loading"
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p class="text-sm text-red-700">{{ error }}</p>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary-500 text-white py-3 rounded-lg font-bold 
                   hover:bg-primary-600 transition-colors disabled:opacity-50 
                   disabled:cursor-not-allowed"
          >
            <span v-if="!loading">{{ t('Sign In') }}</span>
            <span v-else class="flex items-center justify-center gap-2">
              <svg class="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" 
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              {{ t('Signing in...') }}
            </span>
          </button>

          <!-- Security Notice -->
          <div class="text-center pt-6 border-t border-gray-100">
            <p class="text-xs text-gray-500">
              {{ t('Access restricted to authorized personnel only.') }}
            </p>
          </div>
        </form>
      </div>

      <!-- Back to Store -->
      <div class="text-center mt-8">
        <router-link 
          to="/"
          class="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 
                 transition-colors"
          :class="{ 'flex-row-reverse': isRTL }"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          <span>{{ t('Back to Store') }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const languageStore = useLanguageStore()
const authStore = useAuthStore()

const { isRTL, t } = languageStore

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    await authStore.login(form.value.email, form.value.password)
    router.push('/admin')
  } catch (err: any) {
    error.value = err.message || t('Invalid email or password')
  } finally {
    loading.value = false
  }
}
</script>