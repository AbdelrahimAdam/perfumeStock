<template>
  <!-- Overlay -->
  <transition name="fade">
    <div
      v-if="isOpen"
      class="luxury-cart-overlay fixed inset-0 z-[2000] transition-all duration-500"
      @click="closeCart"
    />
  </transition>

  <!-- Sidebar -->
  <div
    class="luxury-cart-sidebar fixed top-0 right-0 h-full z-[2001] transform transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]"
    :class="{
      'translate-x-0': isOpen,
      'translate-x-full': !isOpen
    }"
    :style="{ direction: isRTL ? 'rtl' : 'ltr' }"
  >
    <div class="luxury-cart-container">
      <!-- Header -->
      <div class="luxury-cart-header">
        <div class="cart-header-content">
          <div class="cart-title-wrapper">
            <div class="cart-icon-wrapper">
              <svg class="cart-icon" viewBox="0 0 24 24" fill="none">
                <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" 
                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 6H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10" 
                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <div v-if="totalItems > 0" class="cart-badge">{{ totalItems }}</div>
            </div>
            <h2 class="cart-title">{{ $t('yourCart') }}</h2>
            <p class="cart-subtitle">{{ $t('cartItemsCount', { count: itemCount }) }}</p>
          </div>
          
          <button @click="closeCart" class="cart-close-btn" aria-label="Close cart">
            <svg class="close-icon" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1.5" 
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="isEmpty" class="luxury-cart-empty">
        <div class="empty-cart-icon">
          <svg class="empty-icon" viewBox="0 0 24 24" fill="none">
            <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" 
                  stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M3 6H21" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h3 class="empty-title">{{ $t('cartEmpty') }}</h3>
        <p class="empty-message">{{ $t('cartEmptyMessage') }}</p>
        <button @click="continueShopping" class="empty-action-btn">
          {{ $t('continueShopping') }}
          <svg class="arrow-icon" viewBox="0 0 24 24" fill="none">
            <path d="M5 12H19M12 5L19 12L12 19" stroke="currentColor" stroke-width="1.5" 
                  stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <!-- Cart Items -->
      <div v-else class="luxury-cart-items">
        <div class="cart-items-scroll">
          <div class="cart-items-list">
            <LuxuryCartItem
              v-for="item in luxuryItems || []"
              :key="item?.id || Math.random()"
              :item="item"
              @update-quantity="updateQuantity"
              @remove="removeFromCart"
            />
          </div>

          <div v-if="subtotal < freeShippingThreshold" class="free-shipping-progress">
            <div class="progress-text">
              <span>{{ $t('freeShippingProgress', { amount: Math.max(freeShippingThreshold - subtotal, 0) }) }}</span>
              <span class="progress-amount">${{ Math.max(freeShippingThreshold - subtotal, 0).toFixed(2) }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${(subtotal / freeShippingThreshold) * 100}%` }"></div>
            </div>
            <div class="progress-labels">
              <span>$0</span>
              <span>${{ freeShippingThreshold }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart Footer -->
      <div v-if="!isEmpty" class="luxury-cart-footer">
        <div class="cart-summary">
          <div class="summary-row">
            <span class="summary-label">{{ $t('subtotal') }}</span>
            <span class="summary-value">${{ subtotal.toFixed(2) }}</span>
          </div>
          
          <div class="summary-row">
            <span class="summary-label">{{ $t('shipping') }}</span>
            <span class="summary-value shipping-value">
              {{ shipping === 0 ? $t('free') : `$${shipping.toFixed(2)}` }}
            </span>
          </div>
          
          <div v-if="tax > 0" class="summary-row">
            <span class="summary-label">{{ $t('tax') }}</span>
            <span class="summary-value">${{ tax.toFixed(2) }}</span>
          </div>
          
          <div class="summary-divider"></div>
          
          <div class="summary-row total-row">
            <span class="total-label">{{ $t('total') }}</span>
            <span class="total-value">${{ total.toFixed(2) }}</span>
          </div>
        </div>

        <div class="cart-actions">
          <button @click="proceedToCheckout" class="checkout-btn" :disabled="isProcessing">
            <span v-if="!isProcessing">{{ $t('proceedToCheckout') }}</span>
            <span v-else class="processing-spinner"></span>
          </button>
          
          <button @click="continueShopping" class="continue-btn">
            {{ $t('continueShopping') }}
          </button>
          
          <button @click="clearCartDialog" class="clear-btn">
            {{ $t('clearCart') }}
          </button>
        </div>

        <div class="secure-payment">
          <div class="secure-icon">🔒</div>
          <p class="secure-text">{{ $t('secureCheckout') }}</p>
          <div class="payment-methods">
            <span class="payment-icon">💳</span>
            <span class="payment-icon">📱</span>
            <span class="payment-icon">💰</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useLanguageStore } from '@/stores/language'
import { showNotification, showConfirmation } from '@/utils/notifications'
import LuxuryCartItem from './LuxuryCartItem.vue'

const router = useRouter()
const cartStore = useCartStore()
const languageStore = useLanguageStore()

const { isRTL, t: $t } = languageStore

const {
  items,
  isOpen,
  isEmpty,
  totalItems,
  subtotal,
  shipping,
  tax,
  total,
  closeCart,
  updateQuantity,
  removeFromCart,
  clearCart
} = cartStore

const isProcessing = ref(false)
const freeShippingThreshold = 200

const itemCount = computed(() => (items?.length || 0))
const luxuryItems = computed(() =>
  (items || []).map(item => ({ ...item, totalPrice: (item.price || 0) * (item.quantity || 1) }))
)

const continueShopping = () => {
  closeCart()
  router.push('/collections')
}

const proceedToCheckout = async () => {
  isProcessing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    closeCart()
    router.push('/checkout')
    showNotification({
      type: 'success',
      title: $t('checkoutStarted'),
      message: $t('checkoutProcessing'),
      duration: 3000
    })
  } catch {
    showNotification({
      type: 'error',
      title: $t('checkoutError'),
      message: $t('checkoutErrorMessage'),
      duration: 5000
    })
  } finally {
    isProcessing.value = false
  }
}

const clearCartDialog = async () => {
  const confirmed = await showConfirmation({
    title: $t('clearCartConfirm'),
    message: $t('clearCartMessage'),
    confirmText: $t('clear'),
    cancelText: $t('keepItems'),
    type: 'warning'
  })
  if (confirmed) {
    clearCart()
    showNotification({
      type: 'success',
      title: $t('cartCleared'),
      message: $t('cartClearedMessage'),
      duration: 3000
    })
  }
}

watch(() => items?.length || 0, (newLength) => {
  if (newLength === 0 && isOpen?.value) {
    setTimeout(() => closeCart(), 2000)
  }
})

watch(() => isOpen?.value, (newValue) => {
  document.body.style.overflow = newValue ? 'hidden' : ''
})

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen?.value) closeCart()
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>
