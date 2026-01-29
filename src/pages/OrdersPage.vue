<!-- src/pages/OrdersPage.vue -->
<template>
  <div class="orders-page">
    <!-- Header -->
    <div class="bg-gradient-to-r from-primary-900 to-primary-700 text-white py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-2xl sm:text-3xl font-bold">{{ t('My Orders') }}</h1>
        <p class="mt-2 text-primary-100">{{ t('Track and manage your perfume orders') }}</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500"></div>
        <p class="mt-4 text-gray-600">{{ t('Loading your orders...') }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="orders.length === 0" class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900">{{ t('No orders yet') }}</h3>
        <p class="mt-1 text-gray-500">{{ t('Start shopping to see your orders here') }}</p>
        <div class="mt-6">
          <router-link
            to="/shop"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold-500 hover:bg-gold-600"
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
        <!-- Filter Tabs -->
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
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
        <div class="grid grid-cols-1 gap-6">
          <div
            v-for="order in filteredOrders"
            :key="order.id"
            class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
          >
            <!-- Order Header -->
            <div class="px-6 py-4 border-b border-gray-200">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <h3 class="text-lg font-medium text-gray-900">
                    {{ t('Order') }} #{{ order.orderNumber }}
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ t('Placed on') }} {{ formatDate(order.createdAt) }}
                  </p>
                </div>
                <div class="mt-3 sm:mt-0">
                  <span :class="[
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                    getStatusColor(order.status)
                  ]">
                    {{ getStatusText(order.status) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Order Items -->
            <div class="px-6 py-4">
              <div class="space-y-4">
                <div
                  v-for="item in order.items.slice(0, 2)"
                  :key="item.id"
                  class="flex items-center"
                >
                  <div class="flex-shrink-0 w-16 h-16">
                    <img
                      :src="item.image"
                      :alt="item.name"
                      class="w-full h-full object-cover rounded"
                    />
                  </div>
                  <div class="ml-4 flex-1">
                    <h4 class="text-sm font-medium text-gray-900">{{ item.name }}</h4>
                    <p class="text-sm text-gray-500">{{ item.variant }}</p>
                    <div class="mt-1 flex items-center">
                      <span class="text-sm text-gray-900">{{ formatCurrency(item.price) }} EGP</span>
                      <span class="mx-2 text-gray-300">•</span>
                      <span class="text-sm text-gray-500">{{ t('Qty:') }} {{ item.quantity }}</span>
                    </div>
                  </div>
                </div>

                <!-- Show more items indicator -->
                <div v-if="order.items.length > 2" class="pt-2 border-t">
                  <p class="text-sm text-gray-500">
                    +{{ order.items.length - 2 }} {{ t('more items') }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Order Footer -->
            <div class="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between">
                <div>
                  <p class="text-sm text-gray-500">{{ t('Total Amount') }}</p>
                  <p class="text-lg font-semibold text-gray-900">{{ formatCurrency(order.total) }} EGP</p>
                </div>
                <div class="mt-4 sm:mt-0 flex space-x-3">
                  <button
                    @click="viewOrder(order.id)"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                    {{ t('View Details') }}
                  </button>
                  <button
                    v-if="order.status === 'delivered'"
                    @click="reorder(order.id)"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold-500 hover:bg-gold-600"
                  >
                    <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    {{ t('Reorder') }}
                  </button>
                  <button
                    v-if="order.status === 'processing' || order.status === 'pending'"
                    @click="cancelOrder(order.id)"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    <svg class="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                    {{ t('Cancel') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredOrders.length > 0" class="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6">
          <div class="flex flex-1 justify-between sm:hidden">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {{ t('Previous') }}
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage * perPage >= filteredOrders.length"
              class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              {{ t('Next') }}
            </button>
          </div>
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                {{ t('Showing') }}
                <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span>
                {{ t('to') }}
                <span class="font-medium">{{ Math.min(currentPage * perPage, filteredOrders.length) }}</span>
                {{ t('of') }}
                <span class="font-medium">{{ filteredOrders.length }}</span>
                {{ t('results') }}
              </p>
            </div>
            <div>
              <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  @click="prevPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span class="sr-only">{{ t('Previous') }}</span>
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                  </svg>
                </button>
                <button
                  v-for="page in totalPages"
                  :key="page"
                  @click="currentPage = page"
                  :class="[
                    'relative inline-flex items-center border px-4 py-2 text-sm font-medium',
                    currentPage === page
                      ? 'z-10 border-gold-500 bg-gold-50 text-gold-600'
                      : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span class="sr-only">{{ t('Next') }}</span>
                  <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Order Details Modal -->
    <div v-if="selectedOrder" class="fixed inset-0 overflow-hidden z-50">
      <div class="absolute inset-0 overflow-hidden">
        <div class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="selectedOrder = null"></div>
        <div class="fixed inset-y-0 right-0 pl-10 max-w-full flex">
          <div class="relative w-screen max-w-2xl">
            <div class="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
              <!-- Header -->
              <div class="px-4 py-6 bg-gray-50 sm:px-6">
                <div class="flex items-start justify-between">
                  <h2 class="text-lg font-medium text-gray-900">
                    {{ t('Order Details') }} #{{ selectedOrder.orderNumber }}
                  </h2>
                  <button
                    @click="selectedOrder = null"
                    class="ml-3 h-7 w-7 rounded-full bg-white text-gray-400 hover:text-gray-500"
                  >
                    <span class="sr-only">{{ t('Close panel') }}</span>
                    <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Order Details -->
              <div class="flex-1">
                <!-- Order Summary -->
                <div class="px-4 py-5 sm:p-6">
                  <div class="space-y-6">
                    <!-- Status -->
                    <div>
                      <h3 class="text-lg leading-6 font-medium text-gray-900">{{ t('Order Status') }}</h3>
                      <div class="mt-2">
                        <span :class="[
                          'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                          getStatusColor(selectedOrder.status)
                        ]">
                          {{ getStatusText(selectedOrder.status) }}
                        </span>
                      </div>
                    </div>

                    <!-- Items -->
                    <div>
                      <h3 class="text-lg leading-6 font-medium text-gray-900">{{ t('Items Ordered') }}</h3>
                      <div class="mt-4 border-t border-gray-200 pt-4">
                        <div v-for="item in selectedOrder.items" :key="item.id" class="py-4 flex items-center">
                          <div class="flex-shrink-0 w-16 h-16">
                            <img :src="item.image" :alt="item.name" class="w-full h-full object-cover rounded">
                          </div>
                          <div class="ml-4 flex-1">
                            <h4 class="text-sm font-medium text-gray-900">{{ item.name }}</h4>
                            <p class="text-sm text-gray-500">{{ item.variant }}</p>
                            <div class="mt-1 flex justify-between">
                              <p class="text-sm text-gray-900">{{ formatCurrency(item.price) }} EGP × {{ item.quantity }}</p>
                              <p class="text-sm font-medium text-gray-900">{{ formatCurrency(item.price * item.quantity) }} EGP</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Shipping Address -->
                    <div v-if="selectedOrder.shippingAddress">
                      <h3 class="text-lg leading-6 font-medium text-gray-900">{{ t('Shipping Address') }}</h3>
                      <div class="mt-2">
                        <p class="text-sm text-gray-900">{{ selectedOrder.shippingAddress.name }}</p>
                        <p class="text-sm text-gray-500">{{ selectedOrder.shippingAddress.address }}</p>
                        <p class="text-sm text-gray-500">{{ selectedOrder.shippingAddress.city }}, {{ selectedOrder.shippingAddress.country }}</p>
                        <p class="text-sm text-gray-500">{{ selectedOrder.shippingAddress.phone }}</p>
                      </div>
                    </div>

                    <!-- Payment -->
                    <div>
                      <h3 class="text-lg leading-6 font-medium text-gray-900">{{ t('Payment Information') }}</h3>
                      <div class="mt-4 border-t border-gray-200 pt-4">
                        <div class="space-y-2">
                          <div class="flex justify-between">
                            <span class="text-sm text-gray-500">{{ t('Subtotal') }}</span>
                            <span class="text-sm text-gray-900">{{ formatCurrency(selectedOrder.subtotal) }} EGP</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-sm text-gray-500">{{ t('Shipping') }}</span>
                            <span class="text-sm text-gray-900">{{ formatCurrency(selectedOrder.shipping) }} EGP</span>
                          </div>
                          <div class="flex justify-between">
                            <span class="text-sm text-gray-500">{{ t('Tax') }}</span>
                            <span class="text-sm text-gray-900">{{ formatCurrency(selectedOrder.tax) }} EGP</span>
                          </div>
                          <div class="flex justify-between border-t border-gray-200 pt-2">
                            <span class="text-base font-medium text-gray-900">{{ t('Total') }}</span>
                            <span class="text-base font-medium text-gray-900">{{ formatCurrency(selectedOrder.total) }} EGP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <button
                  @click="downloadInvoice(selectedOrder.id)"
                  class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gold-500 hover:bg-gold-600"
                >
                  {{ t('Download Invoice') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { useAuthStore } from '@/stores/auth'

const languageStore = useLanguageStore()
const authStore = useAuthStore()
const { t } = languageStore

// State
const isLoading = ref(true)
const orders = ref<any[]>([])
const selectedOrder = ref<any>(null)
const activeTab = ref('all')
const currentPage = ref(1)
const perPage = ref(5)

// Tabs configuration
const tabs = computed(() => [
  { id: 'all', label: t('All Orders'), count: orders.value.length },
  { id: 'pending', label: t('Pending'), count: orders.value.filter(o => o.status === 'pending').length },
  { id: 'processing', label: t('Processing'), count: orders.value.filter(o => o.status === 'processing').length },
  { id: 'shipped', label: t('Shipped'), count: orders.value.filter(o => o.status === 'shipped').length },
  { id: 'delivered', label: t('Delivered'), count: orders.value.filter(o => o.status === 'delivered').length },
  { id: 'cancelled', label: t('Cancelled'), count: orders.value.filter(o => o.status === 'cancelled').length }
])

// Computed
const filteredOrders = computed(() => {
  let filtered = orders.value
  
  if (activeTab.value !== 'all') {
    filtered = filtered.filter(order => order.status === activeTab.value)
  }
  
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filtered.slice(start, end)
})

const totalPages = computed(() => {
  const total = activeTab.value === 'all' 
    ? orders.value.length 
    : orders.value.filter(o => o.status === activeTab.value).length
  return Math.ceil(total / perPage.value)
})

// Methods
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-EG').format(amount)
}

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    pending: t('Pending'),
    processing: t('Processing'),
    shipped: t('Shipped'),
    delivered: t('Delivered'),
    cancelled: t('Cancelled')
  }
  return texts[status] || status
}

const viewOrder = (orderId: string) => {
  selectedOrder.value = orders.value.find(o => o.id === orderId)
}

const reorder = (orderId: string) => {
  const order = orders.value.find(o => o.id === orderId)
  if (order) {
    // In production: Add items to cart
    alert(`${t('Items from order')} #${order.orderNumber} ${t('added to cart')}`)
  }
}

const cancelOrder = (orderId: string) => {
  if (confirm(t('Are you sure you want to cancel this order?'))) {
    const orderIndex = orders.value.findIndex(o => o.id === orderId)
    if (orderIndex !== -1) {
      orders.value[orderIndex].status = 'cancelled'
      // In production: Call API to cancel order
    }
  }
}

const downloadInvoice = (orderId: string) => {
  alert(`${t('Downloading invoice for order')} #${orderId}`)
  // In production: Generate and download PDF invoice
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

const loadOrders = async () => {
  isLoading.value = true
  try {
    // In production: Fetch orders from Firebase
    // Mock data for demonstration
    orders.value = [
      {
        id: 'ORD001',
        orderNumber: '2024-001',
        createdAt: '2024-01-15',
        status: 'delivered',
        items: [
          { id: '1', name: 'Tom Ford Noir Extreme', variant: '100ml Eau de Parfum', price: 450, quantity: 1, image: '/images/GURLAND.png' },
          { id: '2', name: 'YSL Black Opium', variant: '90ml Eau de Parfum', price: 380, quantity: 2, image: '/images/santlaurent.jpg' }
        ],
        subtotal: 1210,
        shipping: 50,
        tax: 242,
        total: 1502,
        shippingAddress: {
          name: 'Ahmed Mohamed',
          address: '123 Nile Street, Apt 4B',
          city: 'Cairo',
          country: 'Egypt',
          phone: '+20 100 123 4567'
        }
      },
      {
        id: 'ORD002',
        orderNumber: '2024-002',
        createdAt: '2024-01-10',
        status: 'processing',
        items: [
          { id: '3', name: 'Chanel Coco Mademoiselle', variant: '50ml Eau de Parfum', price: 600, quantity: 1, image: '/images/chanceshaneal.jpeg' }
        ],
        subtotal: 600,
        shipping: 50,
        tax: 120,
        total: 770,
        shippingAddress: {
          name: 'Ahmed Mohamed',
          address: '123 Nile Street, Apt 4B',
          city: 'Cairo',
          country: 'Egypt',
          phone: '+20 100 123 4567'
        }
      },
      {
        id: 'ORD003',
        orderNumber: '2024-003',
        createdAt: '2024-01-05',
        status: 'shipped',
        items: [
          { id: '4', name: 'Versace Eros Flame', variant: '100ml Eau de Toilette', price: 520, quantity: 1, image: '/images/versacee.jpg' },
          { id: '5', name: 'Dior Sauvage Elixir', variant: '60ml Eau de Parfum', price: 550, quantity: 1, image: '/images/DIOUR.jpg' }
        ],
        subtotal: 1070,
        shipping: 0,
        tax: 214,
        total: 1284,
        shippingAddress: {
          name: 'Ahmed Mohamed',
          address: '123 Nile Street, Apt 4B',
          city: 'Cairo',
          country: 'Egypt',
          phone: '+20 100 123 4567'
        }
      },
      {
        id: 'ORD004',
        orderNumber: '2024-004',
        createdAt: '2024-01-01',
        status: 'pending',
        items: [
          { id: '6', name: 'Gucci Bloom', variant: '100ml Eau de Parfum', price: 480, quantity: 1, image: '/images/GUCCI.jpg' }
        ],
        subtotal: 480,
        shipping: 30,
        tax: 96,
        total: 606,
        shippingAddress: {
          name: 'Ahmed Mohamed',
          address: '123 Nile Street, Apt 4B',
          city: 'Cairo',
          country: 'Egypt',
          phone: '+20 100 123 4567'
        }
      },
      {
        id: 'ORD005',
        orderNumber: '2023-125',
        createdAt: '2023-12-20',
        status: 'cancelled',
        items: [
          { id: '7', name: 'Armani Si', variant: '50ml Eau de Parfum', price: 420, quantity: 1, image: '/images/default-product.jpg' }
        ],
        subtotal: 420,
        shipping: 30,
        tax: 84,
        total: 534,
        shippingAddress: {
          name: 'Ahmed Mohamed',
          address: '123 Nile Street, Apt 4B',
          city: 'Cairo',
          country: 'Egypt',
          phone: '+20 100 123 4567'
        }
      }
    ]
  } catch (error) {
    console.error('Error loading orders:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    loadOrders()
  }
})
</script>

<style scoped>
.orders-page {
  min-height: calc(100vh - 200px);
}

/* Custom scrollbar for modal */
.overflow-y-scroll::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-scroll::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 4px;
}

.overflow-y-scroll::-webkit-scrollbar-thumb:hover {
  background: #b8941f;
}

/* Animation for modal */
.fixed {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>