<!-- src/pages/Customer/AddressesPage.vue -->
<template>
  <div class="addresses-page min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-2xl sm:text-3xl font-bold font-['Cormorant_Garamond']">{{ t('savedAddresses') }}</h1>
        <p class="mt-2 text-primary-100">{{ t('manageYourAddresses') }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <!-- Sidebar (same as AccountPage) -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-lg shadow overflow-hidden sticky top-24">
            <!-- User Info -->
            <div class="p-6 bg-gradient-to-r from-gold-500 to-gold-600 text-white">
              <div class="flex items-center space-x-4">
                <div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <span class="text-2xl font-bold">{{ userInitials }}</span>
                </div>
                <div>
                  <h3 class="font-bold">{{ user?.displayName || t('customer') }}</h3>
                  <p class="text-sm text-white/80">{{ user?.email }}</p>
                </div>
              </div>
            </div>

            <!-- Navigation -->
            <nav class="p-4">
              <ul class="space-y-2">
                <li>
                  <router-link to="/account" class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                    </svg>
                    {{ t('dashboard') }}
                  </router-link>
                </li>
                <li>
                  <router-link to="/account/profile" class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    {{ t('profile') }}
                  </router-link>
                </li>
                <li>
                  <router-link to="/account/addresses" class="flex items-center px-4 py-3 rounded-lg bg-gold-50 text-gold-600">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                    {{ t('addresses') }}
                  </router-link>
                </li>
                <li>
                  <router-link to="/orders" class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
                    </svg>
                    {{ t('orders') }}
                  </router-link>
                </li>
                <li>
                  <router-link to="/wishlist" class="flex items-center px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                    {{ t('wishlist') }}
                  </router-link>
                </li>
                <li class="pt-4 mt-4 border-t border-gray-200">
                  <button @click="handleLogout" class="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg">
                    <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    {{ t('logout') }}
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <!-- Addresses Content -->
        <div class="lg:col-span-3">
          <div class="bg-white rounded-lg shadow overflow-hidden">
            <!-- Header -->
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
              <h2 class="text-lg font-medium text-gray-900">{{ t('yourAddresses') }}</h2>
              <button
                @click="showAddressForm = true"
                class="inline-flex items-center px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 text-sm font-medium"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                </svg>
                {{ t('addNewAddress') }}
              </button>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="p-12 text-center">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gold-500"></div>
              <p class="mt-2 text-sm text-gray-500">{{ t('loadingAddresses') }}</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="addresses.length === 0" class="p-12 text-center">
              <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <h3 class="mt-4 text-lg font-medium text-gray-900">{{ t('noAddressesYet') }}</h3>
              <p class="mt-1 text-gray-500">{{ t('addAddressDescription') }}</p>
              <div class="mt-6">
                <button
                  @click="showAddressForm = true"
                  class="inline-flex items-center px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600"
                >
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                  </svg>
                  {{ t('addYourFirstAddress') }}
                </button>
              </div>
            </div>

            <!-- Addresses Grid -->
            <div v-else class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  v-for="address in addresses"
                  :key="address.id"
                  class="border border-gray-200 rounded-lg p-6 relative hover:shadow-lg transition-shadow"
                >
                  <!-- Default Badge -->
                  <div v-if="address.isDefault" class="absolute top-4 right-4">
                    <span class="px-2 py-1 bg-gold-100 text-gold-700 text-xs font-medium rounded-full">
                      {{ t('default') }}
                    </span>
                  </div>

                  <!-- Address Content -->
                  <div class="pr-16">
                    <h3 class="font-medium text-gray-900">{{ address.name }}</h3>
                    <p class="text-sm text-gray-600 mt-2">{{ address.address }}</p>
                    <p class="text-sm text-gray-600">{{ address.city }}, {{ address.state }} {{ address.zip }}</p>
                    <p class="text-sm text-gray-600">{{ address.country }}</p>
                    <p class="text-sm text-gray-600 mt-2">{{ t('phone') }}: {{ address.phone }}</p>
                  </div>

                  <!-- Actions -->
                  <div class="mt-4 pt-4 border-t border-gray-100 flex justify-end space-x-3">
                    <button
                      v-if="!address.isDefault"
                      @click="setDefaultAddress(address.id)"
                      class="text-xs text-gray-500 hover:text-gold-600"
                    >
                      {{ t('setDefault') }}
                    </button>
                    <button
                      @click="editAddress(address)"
                      class="text-xs text-gray-500 hover:text-gold-600"
                    >
                      {{ t('edit') }}
                    </button>
                    <button
                      @click="deleteAddress(address.id)"
                      class="text-xs text-red-500 hover:text-red-600"
                    >
                      {{ t('delete') }}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Address Modal -->
    <div v-if="showAddressForm" class="fixed inset-0 overflow-y-auto z-50">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" @click="showAddressForm = false">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  {{ editingAddress ? t('editAddress') : t('addNewAddress') }}
                </h3>
                
                <form @submit.prevent="saveAddress" class="space-y-4">
                  <!-- Full Name -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      {{ t('fullName') }} *
                    </label>
                    <input
                      v-model="addressForm.name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <!-- Address Line -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      {{ t('addressLine') }} *
                    </label>
                    <input
                      v-model="addressForm.address"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <!-- City and State -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('city') }} *
                      </label>
                      <input
                        v-model="addressForm.city"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('state') }}
                      </label>
                      <input
                        v-model="addressForm.state"
                        type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                  </div>

                  <!-- Zip and Country -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('zipCode') }} *
                      </label>
                      <input
                        v-model="addressForm.zip"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        {{ t('country') }} *
                      </label>
                      <select
                        v-model="addressForm.country"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                      >
                        <option value="Egypt">{{ t('egypt') }}</option>
                        <option value="UAE">{{ t('uae') }}</option>
                        <option value="Saudi Arabia">{{ t('saudiArabia') }}</option>
                        <option value="Kuwait">{{ t('kuwait') }}</option>
                      </select>
                    </div>
                  </div>

                  <!-- Phone -->
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      {{ t('phoneNumber') }} *
                    </label>
                    <input
                      v-model="addressForm.phone"
                      type="tel"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gold-500"
                    />
                  </div>

                  <!-- Default Address Checkbox -->
                  <div class="flex items-center">
                    <input
                      v-model="addressForm.isDefault"
                      type="checkbox"
                      id="isDefault"
                      class="w-4 h-4 text-gold-500 border-gray-300 rounded focus:ring-gold-500"
                    />
                    <label for="isDefault" class="ml-2 text-sm text-gray-700">
                      {{ t('setAsDefaultAddress') }}
                    </label>
                  </div>

                  <!-- Form Actions -->
                  <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      :disabled="saving"
                      class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gold-500 text-base font-medium text-white hover:bg-gold-600 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      {{ saving ? t('saving') + '...' : t('save') }}
                    </button>
                    <button
                      type="button"
                      @click="showAddressForm = false"
                      class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
                    >
                      {{ t('cancel') }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import { showNotification } from '@/utils/notifications'
import { showConfirmation } from '@/utils/confirmation'

const router = useRouter()
const authStore = useAuthStore()
const { t } = useLanguageStore()

const { user, logout } = authStore

// State
const loading = ref(false)
const saving = ref(false)
const showAddressForm = ref(false)
const editingAddress = ref<any>(null)
const addresses = ref<any[]>([])

// Address form
const addressForm = reactive({
  name: '',
  address: '',
  city: '',
  state: '',
  zip: '',
  country: 'Egypt',
  phone: '',
  isDefault: false
})

// Computed
const userInitials = computed(() => {
  if (!user.value || !user.value.displayName) return 'U'
  return user.value.displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

// Methods
const loadAddresses = async () => {
  loading.value = true
  try {
    // Load addresses from your API/store
    // addresses.value = await authStore.getAddresses()
    
    // Mock data for demonstration
    addresses.value = [
      {
        id: '1',
        name: 'Ahmed Mohamed',
        address: '123 Nile Street, Apartment 4B',
        city: 'Cairo',
        state: 'Cairo',
        zip: '11511',
        country: 'Egypt',
        phone: '+20 100 123 4567',
        isDefault: true
      },
      {
        id: '2',
        name: 'Ahmed Mohamed',
        address: '45 Alexandria Road',
        city: 'Alexandria',
        state: 'Alexandria',
        zip: '21500',
        country: 'Egypt',
        phone: '+20 100 123 4567',
        isDefault: false
      }
    ]
  } catch (error) {
    console.error('Error loading addresses:', error)
  } finally {
    loading.value = false
  }
}

const saveAddress = async () => {
  saving.value = true
  try {
    // Save address to your API/store
    if (editingAddress.value) {
      // Update existing address
      showNotification.success(t('addressUpdated'))
    } else {
      // Add new address
      showNotification.success(t('addressAdded'))
    }
    
    showAddressForm.value = false
    resetForm()
    await loadAddresses()
  } catch (error) {
    showNotification.error(t('saveFailed'))
  } finally {
    saving.value = false
  }
}

const editAddress = (address: any) => {
  editingAddress.value = address
  Object.assign(addressForm, address)
  showAddressForm.value = true
}

const deleteAddress = async (addressId: string) => {
  const confirmed = await showConfirmation({
    title: t('deleteAddress'),
    message: t('confirmDeleteAddress'),
    confirmText: t('delete'),
    cancelText: t('cancel'),
    type: 'warning'
  })
  
  if (confirmed) {
    // Delete address
    addresses.value = addresses.value.filter(a => a.id !== addressId)
    showNotification.success(t('addressDeleted'))
  }
}

const setDefaultAddress = async (addressId: string) => {
  addresses.value = addresses.value.map(a => ({
    ...a,
    isDefault: a.id === addressId
  }))
  showNotification.success(t('defaultAddressUpdated'))
}

const resetForm = () => {
  editingAddress.value = null
  addressForm.name = ''
  addressForm.address = ''
  addressForm.city = ''
  addressForm.state = ''
  addressForm.zip = ''
  addressForm.country = 'Egypt'
  addressForm.phone = ''
  addressForm.isDefault = false
}

const handleLogout = async () => {
  try {
    await logout()
    router.push('/')
    showNotification.success(t('loggedOutSuccessfully'))
  } catch (error) {
    console.error('Logout error:', error)
    showNotification.error(t('logoutFailed'))
  }
}

onMounted(() => {
  loadAddresses()
})
</script>