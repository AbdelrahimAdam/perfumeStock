<!-- src/pages/Admin/OrdersPage.vue -->
<template>
  <div class="admin-orders-page">
    <!-- Header -->
    <div class="mb-8">
      <div class="flex items-center justify-between">
        <h1 class="text-2xl font-bold text-gray-900">{{ t('Orders Management') }}</h1>
        
        <!-- Export Button -->
        <button
          @click="exportOrders"
          :disabled="ordersStore.loading || ordersStore.orders.length === 0"
          class="px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 disabled:opacity-50 flex items-center gap-2"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          {{ t('Export CSV') }}
        </button>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">{{ t('Total Orders') }}</p>
            <p class="text-2xl font-bold">{{ ordersStore.orders.length }}</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">{{ t('Pending') }}</p>
            <p class="text-2xl font-bold">{{ ordersStore.pendingOrdersCount }}</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">{{ t('Delivered') }}</p>
            <p class="text-2xl font-bold">{{ ordersStore.completedOrdersCount }}</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">{{ t('Revenue') }}</p>
            <p class="text-2xl font-bold">EGP {{ formatCurrency(ordersStore.totalRevenue) }}</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow mb-6 p-4">
      <div class="flex flex-wrap gap-4">
        <!-- Status Filter -->
        <select
          v-model="statusFilter"
          class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
          @change="applyFilters"
        >
          <option value="">{{ t('All Statuses') }}</option>
          <option value="pending">{{ t('Pending') }}</option>
          <option value="processing">{{ t('Processing') }}</option>
          <option value="shipped">{{ t('Shipped') }}</option>
          <option value="delivered">{{ t('Delivered') }}</option>
          <option value="cancelled">{{ t('Cancelled') }}</option>
        </select>

        <!-- Search -->
        <div class="flex-1 relative">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('Search by order #, customer name, email...')"
            class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold-500"
            @input="debouncedSearch"
          />
          <svg class="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>

        <!-- Clear Filters -->
        <button
          v-if="hasActiveFilters"
          @click="clearFilters"
          class="px-4 py-2 text-gray-600 hover:text-gold-600"
        >
          {{ t('Clear Filters') }}
        </button>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <!-- Loading State -->
      <div v-if="ordersStore.loading && ordersStore.orders.length === 0" class="p-12 text-center">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
        <p class="mt-4 text-gray-600">{{ t('Loading orders...') }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="ordersStore.error" class="p-12 text-center">
        <div class="text-red-500 mb-4">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ t('Error Loading Orders') }}</h3>
        <p class="text-gray-600 mb-4">{{ ordersStore.error }}</p>
        <button
          @click="fetchOrders"
          class="px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600"
        >
          {{ t('Try Again') }}
        </button>
      </div>

      <!-- Orders Table -->
      <div v-else-if="filteredOrders.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('Order #') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('Customer') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('Date') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('Total') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('Status') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('Payment') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ t('Actions') }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="order in paginatedOrders" :key="order.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-medium text-gray-900">#{{ order.orderNumber }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ order.customer.name }}</div>
                <div class="text-sm text-gray-500">{{ order.customer.email }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(order.createdAt) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="text-sm font-bold text-gray-900">EGP {{ formatCurrency(order.total) }}</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClasses(order.status)" class="px-2 py-1 text-xs rounded-full">
                  {{ getStatusText(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getPaymentStatusClasses(order.paymentStatus)" class="px-2 py-1 text-xs rounded-full">
                  {{ order.paymentStatus }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right">
                <router-link
                  :to="`/admin/orders/${order.id}`"
                  class="text-gold-600 hover:text-gold-700 mr-3"
                  :title="t('View Details')"
                >
                  <svg class="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="p-12 text-center">
        <svg class="mx-auto w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">{{ t('No orders found') }}</h3>
        <p class="text-gray-500">
          {{ hasActiveFilters ? t('Try adjusting your filters') : t('No orders have been placed yet') }}
        </p>
      </div>

      <!-- Pagination -->
      <div v-if="filteredOrders.length > 0" class="px-6 py-4 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-700">
            {{ t('Showing') }} {{ startIndex + 1 }} {{ t('to') }} {{ endIndex }} {{ t('of') }} {{ filteredOrders.length }}
          </div>
          <div class="flex gap-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
            >
              {{ t('Previous') }}
            </button>
            <span class="px-3 py-1">{{ currentPage }} / {{ totalPages }}</span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border rounded disabled:opacity-50 hover:bg-gray-50"
            >
              {{ t('Next') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import { authNotification } from '@/utils/notifications'
import debounce from 'lodash/debounce'

const router = useRouter()
const ordersStore = useOrdersStore()
const authStore = useAuthStore()
const { t } = useLanguageStore()

// State
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const perPage = ref(10)

// Computed
const filteredOrders = computed(() => {
  let filtered = ordersStore.orders

  // Apply status filter
  if (statusFilter.value) {
    filtered = filtered.filter(order => order.status === statusFilter.value)
  }

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order =>
      order.orderNumber.toLowerCase().includes(query) ||
      order.customer.name.toLowerCase().includes(query) ||
      order.customer.email.toLowerCase().includes(query)
    )
  }

  return filtered
})

const hasActiveFilters = computed(() => searchQuery.value || statusFilter.value)

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / perPage.value))

const startIndex = computed(() => (currentPage.value - 1) * perPage.value)

const endIndex = computed(() => Math.min(startIndex.value + perPage.value, filteredOrders.value.length))

const paginatedOrders = computed(() =>
  filteredOrders.value.slice(startIndex.value, endIndex.value)
)

// Methods
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-EG').format(amount)
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClasses = (status: string) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getPaymentStatusClasses = (status: string) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  }
  return classes[status as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status: string) => {
  const texts = {
    pending: t('Pending'),
    processing: t('Processing'),
    shipped: t('Shipped'),
    delivered: t('Delivered'),
    cancelled: t('Cancelled')
  }
  return texts[status as keyof typeof texts] || status
}

const fetchOrders = async () => {
  if (!authStore.isAdmin) {
    router.push('/admin/login')
    return
  }
  
  // Admin can fetch all orders with all=true flag
  await ordersStore.fetchOrders({ all: true, limit: 50 })
}

const applyFilters = () => {
  currentPage.value = 1
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1
}, 300)

const clearFilters = () => {
  searchQuery.value = ''
  statusFilter.value = ''
  currentPage.value = 1
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const exportOrders = async () => {
  try {
    const headers = ['Order #', 'Customer Name', 'Email', 'Date', 'Total', 'Status', 'Payment Status']
    const csvData = filteredOrders.value.map(order => [
      order.orderNumber,
      order.customer.name,
      order.customer.email,
      formatDate(order.createdAt),
      `EGP ${order.total.toFixed(2)}`,
      order.status,
      order.paymentStatus
    ])

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)

    authNotification.loggedIn(t('Orders exported successfully'))
  } catch (err) {
    console.error('Error exporting orders:', err)
    authNotification.error(t('Failed to export orders'))
  }
}

// Watch for filter changes
watch([statusFilter], () => {
  applyFilters()
})

onMounted(() => {
  if (authStore.isAdmin) {
    fetchOrders()
  } else {
    router.push('/admin/login')
  }
})
</script>