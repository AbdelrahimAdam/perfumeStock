<!-- src/pages/OrdersPage.vue -->
<template>
  <div class="orders-page min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-8 px-4 sm:px-6 lg:px-8 sticky top-0 z-10 shadow-lg">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl sm:text-3xl font-bold font-['Cormorant_Garamond']">{{ t('My Orders') }}</h1>
            <p class="mt-2 text-primary-100 text-sm sm:text-base">{{ t('Track and manage your perfume orders') }}</p>
          </div>
          
          <!-- Search Bar - Desktop -->
          <div class="hidden sm:block relative">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('Search orders...')"
              class="w-64 px-4 py-2 pr-10 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-gold-500"
              @keyup.enter="handleSearch"
            />
            <svg class="absolute right-3 top-2.5 h-5 w-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Authentication Check -->
      <div v-if="!authStore.isAuthenticated" class="text-center py-12 bg-white rounded-lg shadow">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">{{ t('Please Sign In') }}</h3>
        <p class="mt-1 text-gray-500">{{ t('Sign in to view your order history') }}</p>
        <div class="mt-6">
          <router-link
            to="/auth"
            class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold-500 hover:bg-gold-600 transition-colors"
          >
            {{ t('Sign In') }}
          </router-link>
        </div>
      </div>

      <!-- Authenticated Content -->
      <template v-else>
        <!-- Search Bar - Mobile -->
        <div class="sm:hidden mb-4">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('Search orders...')"
              class="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gold-500"
              @keyup.enter="handleSearch"
            />
            <button 
              @click="handleSearch"
              class="absolute right-2 top-2.5 p-1 text-gray-400 hover:text-gold-500"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="ordersStore.loading && ordersStore.orders.length === 0" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
          <p class="mt-4 text-gray-600">{{ t('Loading your orders...') }}</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="ordersStore.orders.length === 0" class="text-center py-12 bg-white rounded-lg shadow">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">{{ t('No orders yet') }}</h3>
          <p class="mt-1 text-gray-500">{{ t('Start shopping to see your orders here') }}</p>
          <div class="mt-6">
            <router-link
              to="/shop"
              class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold-500 hover:bg-gold-600 transition-colors"
            >
              <svg class="mr-2 -ml-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              {{ t('Start Shopping') }}
            </router-link>
          </div>
        </div>

        <!-- Orders List -->
        <div v-else class="space-y-6">
          <!-- Filter Tabs - Mobile Scrollable -->
          <div class="border-b border-gray-200 overflow-x-auto scrollbar-hide">
            <nav class="-mb-px flex space-x-8 min-w-max px-1">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
                  activeTab === tab.id
                    ? 'border-gold-500 text-gold-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                {{ tab.label }}
                <span
                  v-if="tab.count > 0"
                  :class="[
                    'ml-2 rounded-full py-0.5 px-2 text-xs font-medium',
                    activeTab === tab.id ? 'bg-gold-100 text-gold-800' : 'bg-gray-100 text-gray-800'
                  ]"
                >
                  {{ tab.count }}
                </span>
              </button>
            </nav>
          </div>

          <!-- Orders Grid -->
          <div class="grid grid-cols-1 gap-4 sm:gap-6">
            <OrderCard
              v-for="order in paginatedOrders"
              :key="order.id"
              :order="order"
              @view="viewOrder"
              @reorder="handleReorder"
              @cancel="handleCancelOrder"
              @download-invoice="downloadInvoice"
            />
          </div>

          <!-- Load More -->
          <div v-if="ordersStore.hasMore" class="text-center pt-4">
            <button
              @click="loadMore"
              :disabled="ordersStore.loading"
              class="px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors"
            >
              <span v-if="ordersStore.loading" class="inline-flex items-center">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-gold-500 mr-2"></div>
                {{ t('Loading...') }}
              </span>
              <span v-else>{{ t('Load More Orders') }}</span>
            </button>
          </div>

          <!-- Pagination (Optional - if you prefer pagination over infinite scroll) -->
          <Pagination
            v-if="filteredOrders.length > perPage && !useInfiniteScroll"
            :current-page="currentPage"
            :total-pages="totalPages"
            :per-page="perPage"
            :total-items="filteredOrders.length"
            @page-change="handlePageChange"
          />
        </div>
      </template>
    </div>

    <!-- Order Details Modal -->
    <OrderDetailsModal
      v-if="selectedOrder"
      :order="selectedOrder"
      @close="selectedOrder = null"
      @reorder="handleReorder"
      @cancel="handleCancelOrder"
      @download-invoice="downloadInvoice"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useAuthStore } from '@/stores/auth'
import { useOrdersStore } from '@/stores/orders'
import { useCartStore } from '@/stores/cart'
import OrderCard from '@/components/Orders/OrderCard.vue'
import OrderDetailsModal from '@/components/Orders/OrderDetailsModal.vue'
import Pagination from '@/components/UI/Pagination.vue'
import { showNotification } from '@/utils/notifications'
import { showConfirmation } from '@/utils/confirmation'
import debounce from 'lodash/debounce'

const router = useRouter()
const languageStore = useLanguageStore()
const authStore = useAuthStore()
const ordersStore = useOrdersStore()
const cartStore = useCartStore()

const { t } = languageStore

// State
const selectedOrder = ref<any>(null)
const activeTab = ref('all')
const currentPage = ref(1)
const perPage = ref(5)
const searchQuery = ref('')
const useInfiniteScroll = ref(true) // Toggle between infinite scroll and pagination

// Tabs configuration
const tabs = computed(() => [
  { id: 'all', label: t('All Orders'), count: ordersStore.orders.length },
  { id: 'pending', label: t('Pending'), count: ordersStore.pendingOrdersCount },
  { id: 'processing', label: t('Processing'), count: ordersStore.orders.filter(o => o.status === 'processing').length },
  { id: 'shipped', label: t('Shipped'), count: ordersStore.orders.filter(o => o.status === 'shipped').length },
  { id: 'delivered', label: t('Delivered'), count: ordersStore.completedOrdersCount },
  { id: 'cancelled', label: t('Cancelled'), count: ordersStore.orders.filter(o => o.status === 'cancelled').length }
])

// Computed
const filteredOrders = computed(() => {
  let filtered = ordersStore.orders
  
  // Apply status filter
  if (activeTab.value !== 'all') {
    filtered = filtered.filter(order => order.status === activeTab.value)
  }
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(order => 
      order.orderNumber.toLowerCase().includes(query) ||
      order.customer.name.toLowerCase().includes(query) ||
      order.items.some(item => item.name.toLowerCase().includes(query))
    )
  }
  
  return filtered
})

const paginatedOrders = computed(() => {
  if (useInfiniteScroll.value) {
    return filteredOrders.value
  }
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredOrders.value.slice(start, end)
})

const totalPages = computed(() => 
  Math.ceil(filteredOrders.value.length / perPage.value)
)

// Methods
const viewOrder = (order: any) => {
  selectedOrder.value = order
}

const handleReorder = async (order: any) => {
  const success = await ordersStore.reorder(order.id)
  if (success) {
    router.push('/cart')
  }
}

const handleCancelOrder = async (order: any) => {
  const confirmed = await showConfirmation({
    title: t('Cancel Order'),
    message: t('Are you sure you want to cancel this order?'),
    confirmText: t('Yes, Cancel'),
    cancelText: t('No, Keep'),
    type: 'warning'
  })
  
  if (confirmed) {
    await ordersStore.cancelOrder(order.id)
  }
}

const downloadInvoice = (orderId: string) => {
  ordersStore.downloadInvoice(orderId)
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const loadMore = async () => {
  await ordersStore.loadMore()
}

// Search with debounce
const handleSearch = debounce(() => {
  if (searchQuery.value.length >= 2 || searchQuery.value.length === 0) {
    // Reset and fetch with search
    ordersStore.clearOrders()
    ordersStore.fetchOrders({ 
      userId: authStore.user?.uid,
      status: activeTab.value !== 'all' ? activeTab.value as any : undefined
    })
  }
}, 300)

// Watch for tab changes
watch(activeTab, () => {
  currentPage.value = 1
  ordersStore.clearOrders()
  ordersStore.fetchOrders({ 
    userId: authStore.user?.uid,
    status: activeTab.value !== 'all' ? activeTab.value as any : undefined
  })
})

// Load orders on mount
onMounted(async () => {
  if (authStore.isAuthenticated) {
    await ordersStore.fetchOrders({ userId: authStore.user?.uid })
    await ordersStore.getOrderStats() // Load stats for dashboard if needed
  }
})
</script>

<style scoped>
.orders-page {
  min-height: calc(100vh - 200px);
}

/* Hide scrollbar for Chrome, Safari and Opera */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .border-b {
    position: sticky;
    top: 64px;
    background: white;
    z-index: 5;
  }
}

/* Loading animation */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>