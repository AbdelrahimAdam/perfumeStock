<!-- src/pages/TrackOrderPage.vue -->
<template>
  <div class="track-order-page min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ t('Track Your Order') }}</h1>
        <p class="mt-2 text-gray-600">{{ t('Enter your order number and email to track your package') }}</p>
      </div>

      <!-- Tracking Form -->
      <div class="bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <form @submit.prevent="trackOrder" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('Order Number') }} *
            </label>
            <input
              v-model="form.orderNumber"
              type="text"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              :placeholder="t('e.g., ORD-240215-1234-5678')"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ t('Email Address') }} *
            </label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500"
              :placeholder="t('Enter your email')"
            />
          </div>

          <button
            type="submit"
            :disabled="tracking"
            class="w-full py-3 px-4 bg-gold-500 text-white rounded-lg hover:bg-gold-600 disabled:opacity-50 font-medium"
          >
            {{ tracking ? t('Tracking...') : t('Track Order') }}
          </button>
        </form>
      </div>

      <!-- Tracking Result -->
      <div v-if="trackedOrder" class="mt-8 bg-white rounded-lg shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">{{ t('Order Status') }}</h2>
            <span :class="[
              'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
              getStatusColor(trackedOrder.status)
            ]">
              {{ getStatusText(trackedOrder.status) }}
            </span>
          </div>
          <p class="text-sm text-gray-500 mt-1">{{ t('Order') }} #{{ trackedOrder.orderNumber }}</p>
        </div>

        <!-- Progress Tracker -->
        <div class="px-6 py-6 border-b border-gray-200">
          <div class="relative">
            <!-- Progress Bar -->
            <div class="absolute top-5 left-0 w-full h-1 bg-gray-200">
              <div 
                class="h-full bg-gold-500 transition-all duration-500"
                :style="{ width: getProgressWidth() }"
              ></div>
            </div>

            <!-- Steps -->
            <div class="relative flex justify-between">
              <div v-for="(step, index) in trackingSteps" :key="step.status" 
                   class="text-center" :style="{ width: `${100 / trackingSteps.length}%` }">
                <div :class="[
                  'w-10 h-10 mx-auto rounded-full flex items-center justify-center relative z-10',
                  isStepCompleted(step.status) ? 'bg-gold-500 text-white' : 'bg-gray-200 text-gray-500'
                ]">
                  <svg v-if="isStepCompleted(step.status)" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span v-else class="text-sm font-medium">{{ index + 1 }}</span>
                </div>
                <p class="mt-2 text-xs font-medium" :class="isStepCompleted(step.status) ? 'text-gold-600' : 'text-gray-500'">
                  {{ step.label }}
                </p>
                <p v-if="isStepCompleted(step.status) && step.date" class="text-xs text-gray-400 mt-1">
                  {{ formatDate(step.date) }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Tracking Details -->
        <div class="px-6 py-6 space-y-4">
          <div v-if="trackedOrder.trackingNumber" class="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
            <div>
              <p class="text-sm font-medium text-blue-800">{{ t('Tracking Number') }}</p>
              <p class="text-sm text-blue-600 mt-1">{{ trackedOrder.trackingNumber }}</p>
            </div>
            <button
              @click="copyTrackingNumber"
              class="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              {{ copied ? t('Copied!') : t('Copy') }}
            </button>
          </div>

          <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <div>
              <p class="text-sm font-medium text-gray-700">{{ t('Estimated Delivery') }}</p>
              <p class="text-sm text-gray-600 mt-1">{{ getEstimatedDelivery() }}</p>
            </div>
            <router-link
              :to="`/orders/${trackedOrder.id}`"
              class="text-sm text-gold-600 hover:text-gold-700 font-medium"
            >
              {{ t('View Details') }} →
            </router-link>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-if="error" class="mt-8 bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <svg class="mx-auto h-8 w-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <p class="mt-2 text-sm text-red-600">{{ error }}</p>
      </div>

      <!-- Help Text -->
      <div class="mt-8 text-center text-sm text-gray-500">
        <p>{{ t('Having trouble tracking your order?') }}</p>
        <router-link to="/contact" class="text-gold-600 hover:text-gold-700 font-medium">
          {{ t('Contact Support') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useOrdersStore } from '@/stores/orders'
import { useLanguageStore } from '@/stores/language'
import { showNotification } from '@/utils/notifications'

const route = useRoute()
const ordersStore = useOrdersStore()
const { t } = useLanguageStore()

const form = reactive({
  orderNumber: route.params.trackingNumber || '',
  email: ''
})

const tracking = ref(false)
const trackedOrder = ref<any>(null)
const error = ref<string | null>(null)
const copied = ref(false)

const trackingSteps = [
  { status: 'pending', label: t('Order Placed'), date: null },
  { status: 'processing', label: t('Processing'), date: null },
  { status: 'shipped', label: t('Shipped'), date: null },
  { status: 'delivered', label: t('Delivered'), date: null }
]

const isStepCompleted = (status: string) => {
  if (!trackedOrder.value) return false
  
  const statusOrder = ['pending', 'processing', 'shipped', 'delivered']
  const currentIndex = statusOrder.indexOf(trackedOrder.value.status)
  const stepIndex = statusOrder.indexOf(status)
  
  return stepIndex <= currentIndex
}

const getProgressWidth = () => {
  if (!trackedOrder.value) return '0%'
  
  const statusOrder = ['pending', 'processing', 'shipped', 'delivered']
  const currentIndex = statusOrder.indexOf(trackedOrder.value.status)
  
  return `${(currentIndex / (statusOrder.length - 1)) * 100}%`
}

const getEstimatedDelivery = () => {
  if (!trackedOrder.value) return t('Not available')
  
  if (trackedOrder.value.status === 'delivered') {
    return t('Delivered')
  }
  
  // Calculate estimated delivery (7-10 days from order date)
  const orderDate = new Date(trackedOrder.value.createdAt)
  const estimated = new Date(orderDate.setDate(orderDate.getDate() + 10))
  
  return estimated.toLocaleDateString('en-EG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
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

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const trackOrder = async () => {
  tracking.value = true
  error.value = null
  
  try {
    const order = await ordersStore.fetchOrderByNumber(form.orderNumber, form.email)
    
    if (order) {
      trackedOrder.value = order
      
      // Update step dates
      trackingSteps[0].date = order.createdAt
      if (order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered') {
        trackingSteps[1].date = order.updatedAt
      }
      if (order.status === 'shipped' || order.status === 'delivered') {
        trackingSteps[2].date = order.shippedAt || order.updatedAt
      }
      if (order.status === 'delivered') {
        trackingSteps[3].date = order.deliveredAt || order.updatedAt
      }
    } else {
      error.value = t('Order not found. Please check your order number and email.')
    }
  } catch (err) {
    error.value = t('Failed to track order. Please try again.')
  } finally {
    tracking.value = false
  }
}

const copyTrackingNumber = () => {
  if (trackedOrder.value?.trackingNumber) {
    navigator.clipboard.writeText(trackedOrder.value.trackingNumber)
    copied.value = true
    showNotification.success(t('Tracking number copied!'))
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}
</script>