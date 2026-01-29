<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <!-- Background overlay -->
    <div class="fixed inset-0 bg-black bg-opacity-75 transition-opacity" @click="close"></div>

    <div class="flex min-h-screen items-end justify-center p-4 text-center sm:items-center sm:p-0">
      <!-- Modal panel -->
      <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
        <!-- Modal header -->
        <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h3 class="text-lg font-semibold leading-6 text-gray-900" id="modal-title">
                {{ t('Add New Admin User') }}
              </h3>
              <p class="mt-1 text-sm text-gray-500">
                {{ t('Create a new administrator account') }}
              </p>
            </div>
            <button
              type="button"
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              @click="close"
            >
              <span class="sr-only">{{ t('Close') }}</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Modal content -->
        <div class="px-4 pb-3 sm:px-6">
          <div class="space-y-4">
            <!-- Display Name -->
            <div>
              <label for="admin-name" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('Display Name') }} *
              </label>
              <input
                id="admin-name"
                v-model="formData.displayName"
                type="text"
                :placeholder="t('e.g., Admin User')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-300': errors.displayName }"
                required
              />
              <p v-if="errors.displayName" class="mt-1 text-sm text-red-600">{{ errors.displayName }}</p>
            </div>

            <!-- Email Address -->
            <div>
              <label for="admin-email" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('Email Address') }} *
              </label>
              <input
                id="admin-email"
                v-model="formData.email"
                type="email"
                :placeholder="t('admin@luxuryperfumes.com')"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-300': errors.email }"
                required
              />
              <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
            </div>

            <!-- Role -->
            <div>
              <label for="admin-role" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('Role') }} *
              </label>
              <select
                id="admin-role"
                v-model="formData.role"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                :class="{ 'border-red-300': errors.role }"
                required
              >
                <option value="">{{ t('Select role') }}</option>
                <option value="admin">{{ t('Admin') }}</option>
                <option value="super-admin">{{ t('Super Admin') }}</option>
              </select>
              <p v-if="errors.role" class="mt-1 text-sm text-red-600">{{ errors.role }}</p>
              <p class="mt-1 text-xs text-gray-500">
                <span class="font-medium">{{ t('Admin') }}:</span> {{ t('Can manage products, orders, and content') }}<br>
                <span class="font-medium">{{ t('Super Admin') }}:</span> {{ t('Full system access including user management') }}
              </p>
            </div>

            <!-- Password -->
            <div>
              <label for="admin-password" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('Password') }} *
              </label>
              <div class="relative">
                <input
                  id="admin-password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  :placeholder="t('Minimum 8 characters')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  :class="{ 'border-red-300': errors.password }"
                  required
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  <svg v-else class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
            </div>

            <!-- Confirm Password -->
            <div>
              <label for="admin-confirm-password" class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('Confirm Password') }} *
              </label>
              <div class="relative">
                <input
                  id="admin-confirm-password"
                  v-model="formData.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  :placeholder="t('Confirm your password')"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  :class="{ 'border-red-300': errors.confirmPassword }"
                  required
                />
                <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <svg v-if="showConfirmPassword" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                  <svg v-else class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </button>
              </div>
              <p v-if="errors.confirmPassword" class="mt-1 text-sm text-red-600">{{ errors.confirmPassword }}</p>
            </div>

            <!-- Password Strength Indicator -->
            <div v-if="formData.password">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-gray-700">{{ t('Password Strength') }}:</span>
                <span :class="passwordStrengthClass" class="text-xs font-semibold">
                  {{ passwordStrengthLabel }}
                </span>
              </div>
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  :class="passwordStrengthBarClass"
                  class="h-full transition-all duration-500"
                  :style="{ width: passwordStrength + '%' }"
                ></div>
              </div>
              <ul class="mt-2 text-xs text-gray-500 space-y-1">
                <li :class="{ 'text-emerald-600': formData.password.length >= 8 }">
                  ✓ {{ t('At least 8 characters') }}
                </li>
                <li :class="{ 'text-emerald-600': hasUppercase }">
                  ✓ {{ t('Contains uppercase letter') }}
                </li>
                <li :class="{ 'text-emerald-600': hasLowercase }">
                  ✓ {{ t('Contains lowercase letter') }}
                </li>
                <li :class="{ 'text-emerald-600': hasNumber }">
                  ✓ {{ t('Contains number') }}
                </li>
                <li :class="{ 'text-emerald-600': hasSpecialChar }">
                  ✓ {{ t('Contains special character') }}
                </li>
              </ul>
            </div>

            <!-- Permissions -->
            <div v-if="formData.role === 'admin'">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('Permissions') }}
              </label>
              <div class="space-y-2">
                <label class="inline-flex items-center">
                  <input
                    v-model="formData.permissions"
                    type="checkbox"
                    value="manage_products"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ t('Manage Products') }}</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    v-model="formData.permissions"
                    type="checkbox"
                    value="manage_orders"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ t('Manage Orders') }}</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    v-model="formData.permissions"
                    type="checkbox"
                    value="manage_content"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ t('Manage Content') }}</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    v-model="formData.permissions"
                    type="checkbox"
                    value="view_reports"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ t('View Reports') }}</span>
                </label>
              </div>
            </div>

            <!-- Status -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                {{ t('Status') }}
              </label>
              <div class="flex items-center gap-4">
                <label class="inline-flex items-center">
                  <input
                    v-model="formData.isActive"
                    type="radio"
                    :value="true"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ t('Active') }}</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    v-model="formData.isActive"
                    type="radio"
                    :value="false"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-700">{{ t('Inactive') }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal footer -->
        <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
          <button
            type="button"
            @click="save"
            :disabled="loading"
            class="inline-flex w-full justify-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 sm:ml-3 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <template v-if="loading">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ t('Creating...') }}
            </template>
            <template v-else>
              {{ t('Create Admin') }}
            </template>
          </button>
          <button
            type="button"
            @click="close"
            :disabled="loading"
            class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ t('Cancel') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const { t } = languageStore

const emit = defineEmits<{
  close: []
  save: [data: any]
}>()

// Form data
const formData = reactive({
  displayName: '',
  email: '',
  role: '',
  password: '',
  confirmPassword: '',
  permissions: [] as string[],
  isActive: true
})

// Form state
const errors = reactive({
  displayName: '',
  email: '',
  role: '',
  password: '',
  confirmPassword: ''
})
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// Password strength calculation
const passwordStrength = computed(() => {
  const password = formData.password
  if (!password) return 0
  
  let score = 0
  
  // Length check
  if (password.length >= 8) score += 20
  if (password.length >= 12) score += 10
  
  // Character variety
  if (hasUppercase.value) score += 20
  if (hasLowercase.value) score += 20
  if (hasNumber.value) score += 20
  if (hasSpecialChar.value) score += 20
  
  return Math.min(score, 100)
})

const hasUppercase = computed(() => /[A-Z]/.test(formData.password))
const hasLowercase = computed(() => /[a-z]/.test(formData.password))
const hasNumber = computed(() => /[0-9]/.test(formData.password))
const hasSpecialChar = computed(() => /[^A-Za-z0-9]/.test(formData.password))

const passwordStrengthLabel = computed(() => {
  const score = passwordStrength.value
  if (score >= 80) return t('Strong')
  if (score >= 60) return t('Good')
  if (score >= 40) return t('Fair')
  if (score >= 20) return t('Weak')
  return t('Very Weak')
})

const passwordStrengthClass = computed(() => {
  const score = passwordStrength.value
  if (score >= 80) return 'text-emerald-600'
  if (score >= 60) return 'text-blue-600'
  if (score >= 40) return 'text-yellow-600'
  if (score >= 20) return 'text-orange-600'
  return 'text-red-600'
})

const passwordStrengthBarClass = computed(() => {
  const score = passwordStrength.value
  if (score >= 80) return 'bg-emerald-500'
  if (score >= 60) return 'bg-blue-500'
  if (score >= 40) return 'bg-yellow-500'
  if (score >= 20) return 'bg-orange-500'
  return 'bg-red-500'
})

// Methods
const validateForm = () => {
  let isValid = true
  
  // Reset errors
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })
  
  // Validate display name
  if (!formData.displayName.trim()) {
    errors.displayName = t('Display name is required')
    isValid = false
  }
  
  // Validate email
  if (!formData.email.trim()) {
    errors.email = t('Email is required')
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = t('Please enter a valid email address')
    isValid = false
  }
  
  // Validate role
  if (!formData.role) {
    errors.role = t('Please select a role')
    isValid = false
  }
  
  // Validate password
  if (!formData.password) {
    errors.password = t('Password is required')
    isValid = false
  } else if (formData.password.length < 8) {
    errors.password = t('Password must be at least 8 characters')
    isValid = false
  }
  
  // Validate confirm password
  if (!formData.confirmPassword) {
    errors.confirmPassword = t('Please confirm your password')
    isValid = false
  } else if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = t('Passwords do not match')
    isValid = false
  }
  
  return isValid
}

const save = async () => {
  if (!validateForm()) return
  
  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Prepare data for API
    const adminData = {
      displayName: formData.displayName.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role,
      password: formData.password,
      permissions: formData.role === 'super-admin' ? ['all'] : formData.permissions,
      isActive: formData.isActive,
      createdAt: new Date().toISOString()
    }
    
    // Emit the form data
    emit('save', adminData)
    
    // Close modal
    emit('close')
  } catch (error) {
    console.error('Error creating admin:', error)
    alert(t('Failed to create admin user. Please try again.'))
  } finally {
    loading.value = false
  }
}

const close = () => {
  if (loading.value) return
  emit('close')
}

// Keyboard event listener
onMounted(() => {
  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      close()
    }
  }
  
  document.addEventListener('keydown', handleKeydown)
  
  // Remove event listener on unmount
  return () => {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
/* Custom scrollbar for modal */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Focus styles */
:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Password strength bar animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.bg-emerald-500 {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .bg-white {
    background-color: #1f2937;
  }
  
  .text-gray-900 {
    color: #f9fafb;
  }
  
  .text-gray-500 {
    color: #9ca3af;
  }
  
  .text-gray-700 {
    color: #d1d5db;
  }
  
  .border-gray-300 {
    border-color: #4b5563;
  }
  
  .bg-gray-50 {
    background-color: #374151;
  }
  
  .bg-gray-200 {
    background-color: #4b5563;
  }
  
  .ring-gray-300 {
    ring-color: #4b5563;
  }
  
  .hover\:bg-gray-50:hover {
    background-color: #4b5563;
  }
  
  .text-emerald-600 {
    color: #10b981;
  }
  
  .text-blue-600 {
    color: #3b82f6;
  }
  
  .text-yellow-600 {
    color: #f59e0b;
  }
  
  .text-orange-600 {
    color: #f97316;
  }
  
  .text-red-600 {
    color: #ef4444;
  }
}
</style>