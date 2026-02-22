<!-- src/pages/Customer/ProfilePage.vue -->
<template>
  <div class="profile-page min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center min-h-screen">
      <div class="text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
        <p class="mt-4 text-gray-600">{{ t('loading') }}...</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex items-center justify-center min-h-screen p-4">
      <div class="text-center max-w-md">
        <svg class="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">{{ t('errorLoadingProfile') }}</h3>
        <p class="mt-2 text-gray-500">{{ error }}</p>
        <button 
          @click="loadUserData" 
          class="mt-6 px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
        >
          {{ t('tryAgain') }}
        </button>
      </div>
    </div>

    <!-- Not Logged In State -->
    <div v-else-if="!isAuthenticated" class="flex items-center justify-center min-h-screen p-4">
      <div class="text-center max-w-md">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">{{ t('notLoggedIn') }}</h3>
        <p class="mt-2 text-gray-500">{{ t('pleaseLoginToViewProfile') }}</p>
        <div class="mt-6">
          <router-link 
            to="/login" 
            class="inline-block px-6 py-3 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors"
          >
            {{ t('login') }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Content - Only show when authenticated and loaded -->
    <template v-else-if="customer">
      <!-- Header -->
      <div class="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-8 px-4 sm:py-10 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto">
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold font-['Cormorant_Garamond']">{{ t('profileSettings') }}</h1>
          <p class="mt-2 text-primary-100 text-sm sm:text-base">{{ t('managePersonalInfo') }}</p>
        </div>
      </div>

      <!-- Main Content -->
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10">
        <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
          <!-- Profile Header -->
          <div class="px-4 sm:px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 class="text-base sm:text-lg font-medium text-gray-900">{{ t('personalInformation') }}</h2>
          </div>

          <!-- Profile Form -->
          <form @submit.prevent="handleSubmit" class="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <!-- Avatar Section - Mobile Optimized -->
            <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <div class="flex justify-center sm:justify-start">
                <div class="relative">
                  <div class="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-gold-500 to-gold-600 rounded-full flex items-center justify-center text-white text-2xl sm:text-3xl font-bold">
                    {{ userInitials }}
                  </div>
                  <button
                    type="button"
                    @click="triggerFileUpload"
                    class="absolute bottom-0 right-0 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-gold-600 border border-gray-200 transition-colors"
                  >
                    <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                  </button>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleFileUpload"
                  />
                </div>
              </div>
              <div class="text-center sm:text-left">
                <h3 class="text-base sm:text-lg font-medium text-gray-900">{{ form.firstName }} {{ form.lastName }}</h3>
                <p class="text-xs sm:text-sm text-gray-500">{{ form.email }}</p>
              </div>
            </div>

            <!-- Name Fields - Stack on mobile, grid on desktop -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  {{ t('firstName') }} *
                </label>
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                  {{ t('lastName') }} *
                </label>
                <input
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                {{ t('email') }} *
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                disabled
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p class="mt-1 text-xs text-gray-500">{{ t('emailCannotBeChanged') }}</p>
            </div>

            <!-- Phone -->
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                {{ t('phone') }}
              </label>
              <input
                v-model="form.phone"
                type="tel"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                :placeholder="t('phonePlaceholder')"
              />
            </div>

            <!-- Date of Birth -->
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                {{ t('dateOfBirth') }}
              </label>
              <input
                v-model="form.dob"
                type="date"
                class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
              />
            </div>

            <!-- Newsletter Preferences -->
            <div class="border-t border-gray-200 pt-4 sm:pt-6">
              <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">{{ t('preferences') }}</h3>
              <div class="space-y-2 sm:space-y-3">
                <label class="flex items-center space-x-2 sm:space-x-3">
                  <input
                    v-model="form.newsletter"
                    type="checkbox"
                    class="w-4 h-4 sm:w-5 sm:h-5 text-gold-500 border-gray-300 rounded focus:ring-gold-500"
                  />
                  <span class="text-xs sm:text-sm text-gray-700">{{ t('subscribeNewsletter') }}</span>
                </label>
                <label class="flex items-center space-x-2 sm:space-x-3">
                  <input
                    v-model="form.smsNotifications"
                    type="checkbox"
                    class="w-4 h-4 sm:w-5 sm:h-5 text-gold-500 border-gray-300 rounded focus:ring-gold-500"
                  />
                  <span class="text-xs sm:text-sm text-gray-700">{{ t('smsNotifications') }}</span>
                </label>
              </div>
            </div>

            <!-- Change Password Section -->
            <div class="border-t border-gray-200 pt-4 sm:pt-6">
              <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">{{ t('changePassword') }}</h3>
              <div class="space-y-3 sm:space-y-4">
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    {{ t('currentPassword') }}
                  </label>
                  <input
                    v-model="passwordForm.current"
                    type="password"
                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    {{ t('newPassword') }}
                  </label>
                  <input
                    v-model="passwordForm.new"
                    type="password"
                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    {{ t('confirmNewPassword') }}
                  </label>
                  <input
                    v-model="passwordForm.confirm"
                    type="password"
                    class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                  />
                </div>
                <button
                  type="button"
                  @click="changePassword"
                  class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {{ t('updatePassword') }}
                </button>
              </div>
            </div>

            <!-- Form Actions - Stack on mobile, side by side on desktop -->
            <div class="border-t border-gray-200 pt-4 sm:pt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3">
              <button
                type="button"
                @click="resetForm"
                class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {{ t('cancel') }}
              </button>
              <button
                type="submit"
                :disabled="saving"
                class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-gold-500 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-gold-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="!saving">{{ t('saveChanges') }}</span>
                <span v-else class="flex items-center justify-center">
                  <svg class="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  {{ t('saving') }}...
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import { authNotification } from '@/utils/notifications'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useLanguageStore()

// State
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// Form state
const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  dob: '',
  newsletter: false,
  smsNotifications: false
})

// Password form
const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

// Computed - Safe access with null checks
const customer = computed(() => authStore.customer)
const isAuthenticated = computed(() => authStore.isAuthenticated)

const userInitials = computed(() => {
  const displayName = customer.value?.displayName
  if (!displayName) return 'U'
  return displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Methods
const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    // Since authNotification.info doesn't exist, use loggedIn as a fallback
    authNotification.loggedIn(t('uploadingImage'))
    
    try {
      // Use the auth store method to upload photo
      await authStore.uploadProfilePhoto(file)
    } catch (error) {
      console.error('Photo upload error:', error)
      authNotification.error(t('uploadFailed'))
    }
  }
}

const handleSubmit = async () => {
  if (!customer.value) return
  
  saving.value = true
  try {
    // Use the auth store method to update profile
    await authStore.updateCustomerProfile({
      displayName: `${form.firstName} ${form.lastName}`,
      phone: form.phone,
      newsletter: form.newsletter,
      smsNotifications: form.smsNotifications,
      dob: form.dob
    })
    
    authNotification.loggedIn(t('profileUpdated'))
  } catch (error) {
    console.error('Profile update error:', error)
    authNotification.error(t('updateFailed'))
  } finally {
    saving.value = false
  }
}

const changePassword = async () => {
  if (passwordForm.new !== passwordForm.confirm) {
    authNotification.error(t('passwordsDoNotMatch'))
    return
  }
  
  if (passwordForm.new.length < 6) {
    authNotification.error(t('passwordTooShort'))
    return
  }
  
  try {
    // Use the auth store method to change password
    await authStore.changeCustomerPassword(passwordForm.current, passwordForm.new)
    
    // Clear password form
    passwordForm.current = ''
    passwordForm.new = ''
    passwordForm.confirm = ''
  } catch (error: any) {
    console.error('Password update error:', error)
    // Error is already handled in the store
  }
}

const resetForm = () => {
  // Reset form to original values from customer data
  if (customer.value) {
    const nameParts = customer.value.displayName?.split(' ') || ['', '']
    form.firstName = nameParts[0] || ''
    form.lastName = nameParts.slice(1).join(' ') || ''
    form.email = customer.value.email || ''
    form.phone = customer.value.phone || ''
    form.newsletter = customer.value.newsletter || false
    
    const extendedCustomer = customer.value as any
    form.smsNotifications = extendedCustomer.smsNotifications || false
    form.dob = extendedCustomer.dob || ''
  }
  
  // Clear password form
  passwordForm.current = ''
  passwordForm.new = ''
  passwordForm.confirm = ''
  
  // Use loggedIn instead of info
  authNotification.loggedIn(t('formReset'))
}

const loadUserData = () => {
  if (!authStore.isAuthenticated || !customer.value) {
    loading.value = false
    return
  }

  loading.value = true
  error.value = null
  
  try {
    const nameParts = customer.value.displayName?.split(' ') || ['', '']
    form.firstName = nameParts[0] || ''
    form.lastName = nameParts.slice(1).join(' ') || ''
    form.email = customer.value.email || ''
    form.phone = customer.value.phone || ''
    form.newsletter = customer.value.newsletter || false
    // Load other preferences if they exist
    const extendedCustomer = customer.value as any
    form.smsNotifications = extendedCustomer.smsNotifications || false
    form.dob = extendedCustomer.dob || ''
  } catch (err) {
    console.error('Error loading user data:', err)
    error.value = t('failedToLoadProfile')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadUserData()
})
</script>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Better touch targets for mobile */
@media (max-width: 640px) {
  button, 
  input,
  .rounded-lg {
    min-height: 44px; /* Better touch target */
  }
  
  /* Improve spacing */
  .space-y-4 > :not([hidden]) ~ :not([hidden]) {
    margin-top: 1rem;
  }
}

/* Loading spinner animation */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Focus styles for better accessibility */
input:focus-visible,
button:focus-visible {
  outline: 2px solid #d4af37;
  outline-offset: 2px;
}

/* Disabled state */
button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b8941f;
}
</style>