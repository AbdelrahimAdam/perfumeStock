<!-- src/pages/ForgotPasswordPage.vue -->
<template>
  <div class="forgot-password-page min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md mx-auto">
      <!-- Logo & Branding -->
      <div class="text-center mb-8">
        <router-link to="/" class="inline-block">
          <div class="flex items-center justify-center gap-3 mb-4">
            <div class="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center shadow-gold-lg">
              <span class="text-white font-bold text-2xl">P</span>
            </div>
            <div class="text-left">
              <h1 class="text-2xl font-bold text-gray-900">P.NOTES</h1>
              <p class="text-sm text-gray-500">PERFUME STORE</p>
            </div>
          </div>
        </router-link>
        <h2 class="text-3xl font-bold text-gray-900 mb-2">{{ t('resetPassword') }}</h2>
        <p class="text-gray-600">{{ t('forgotPasswordInstructions') }}</p>
      </div>

      <!-- Success Message -->
      <div v-if="success" class="bg-green-50 border border-green-200 rounded-2xl p-6 mb-6 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('emailSent') }}</h3>
        <p class="text-sm text-gray-600 mb-4">{{ success }}</p>
        <router-link 
          to="/login" 
          class="inline-flex items-center text-gold-600 hover:text-gold-700 font-medium"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          {{ t('backToLogin') }}
        </router-link>
      </div>

      <!-- Forgot Password Form -->
      <div v-else class="bg-white rounded-2xl shadow-xl p-8">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Email Field -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('emailAddress') }} *
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                :class="{ 'border-red-500': errors.email }"
                :placeholder="t('emailPlaceholder')"
                @input="clearError('email')"
              />
            </div>
            <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <p class="text-sm text-red-600">{{ error }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-xl font-bold shadow-gold-lg hover:shadow-gold-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">{{ t('sendResetLink') }}</span>
            <div v-else class="flex items-center justify-center">
              <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span class="ml-2">{{ t('sending') }}...</span>
            </div>
          </button>

          <!-- Back to Login Link -->
          <div class="text-center mt-4">
            <router-link 
              to="/login" 
              class="text-sm text-gold-600 hover:text-gold-700 font-medium inline-flex items-center"
            >
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              {{ t('backToLogin') }}
            </router-link>
          </div>
        </form>
      </div>

      <!-- Help Section -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500">
          {{ t('needHelp') }}
          <router-link to="/contact" class="text-gold-600 hover:text-gold-700 font-medium">
            {{ t('contactSupport') }}
          </router-link>
        </p>
      </div>

      <!-- Security Note -->
      <div class="mt-6 text-center">
        <div class="inline-flex items-center px-4 py-2 bg-gray-100 rounded-full">
          <svg class="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          <span class="text-xs text-gray-600">{{ t('secureReset') }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import { showNotification } from '@/utils/notifications'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useLanguageStore()

// State
const loading = ref(false)
const error = ref('')
const success = ref('')

// Form state
const form = reactive({
  email: ''
})

// Errors
const errors = reactive({
  email: ''
})

// Methods
const validateForm = (): boolean => {
  let isValid = true
  errors.email = ''

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email) {
    errors.email = t('emailRequired')
    isValid = false
  } else if (!emailRegex.test(form.email)) {
    errors.email = t('invalidEmail')
    isValid = false
  }

  return isValid
}

const clearError = (field: string) => {
  if (field === 'email') errors.email = ''
  error.value = ''
}

const handleSubmit = async () => {
  if (!validateForm()) return

  loading.value = true
  error.value = ''

  try {
    // Call the reset password function from auth store
    await authStore.resetPassword(form.email)
    
    // Show success message
    success.value = t('resetEmailSent', { email: form.email })
    
    // Clear form
    form.email = ''
    
    // Show notification
    showNotification.success(t('resetLinkSent'))
    
  } catch (err: any) {
    console.error('Password reset error:', err)
    
    // Handle specific Firebase errors
    switch (err.code) {
      case 'auth/user-not-found':
        error.value = t('emailNotFound')
        break
      case 'auth/too-many-requests':
        error.value = t('tooManyAttempts')
        break
      case 'auth/invalid-email':
        error.value = t('invalidEmail')
        break
      default:
        error.value = t('resetFailed')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.forgot-password-page {
  animation: slideIn 0.5s ease-out;
}

/* Gradient shadows */
.shadow-gold-lg {
  box-shadow: 0 10px 25px -5px rgba(212, 175, 55, 0.3);
}

.shadow-gold-xl {
  box-shadow: 0 20px 40px -10px rgba(212, 175, 55, 0.4);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .forgot-password-page {
    padding-top: 2rem;
    padding-bottom: 2rem;
  }
  
  .bg-white {
    padding: 1.5rem;
  }
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Input focus styles */
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

/* Success animation */
.bg-green-50 {
  animation: slideIn 0.5s ease-out;
}
</style>