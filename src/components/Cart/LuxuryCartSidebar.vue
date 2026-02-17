<template>
  <!-- Overlay -->
  <transition name="fade">
    <div
      v-if="isOpen"
      class="sidebar-overlay"
      @click="closeCart"
    />
  </transition>

  <!-- Sidebar -->
  <transition name="slide">
    <div
      v-if="isOpen"
      class="cart-sidebar"
      :class="{ 'rtl': isRTL }"
    >
      <div class="sidebar-container">
        <!-- Header -->
        <div class="sidebar-header">
          <div class="header-left">
            <div class="header-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              <span v-if="totalItems > 0" class="header-badge">{{ totalItems }}</span>
            </div>
            <div>
              <h2 class="sidebar-title">{{ $t('yourCart') }}</h2>
              <p class="sidebar-subtitle">{{ $t('cartItemsCount', { count: itemCount }) }}</p>
            </div>
          </div>
          <button @click="closeCart" class="close-btn" aria-label="Close cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                    d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Empty State -->
        <div v-if="isEmpty" class="empty-state">
          <div class="empty-icon-wrapper">
            <svg class="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <h3 class="empty-title">{{ $t('cartEmpty') }}</h3>
          <p class="empty-message">{{ $t('cartEmptyMessage') }}</p>
          <button @click="continueShopping" class="empty-action">
            {{ $t('continueShopping') }}
          </button>
        </div>

        <!-- Cart Items -->
        <div v-else class="cart-content">
          <div class="cart-items">
            <LuxuryCartItem
              v-for="item in luxuryItems"
              :key="item.id"
              :item="item"
              @update-quantity="updateQuantity"
              @remove="removeFromCart"
            />
          </div>

          <!-- Free Shipping Progress -->
          <div v-if="subtotal < freeShippingThreshold" class="shipping-progress">
            <div class="progress-header">
              <span class="progress-label">{{ $t('freeShippingProgress') }}</span>
              <span class="progress-amount">{{ formatPrice(freeShippingThreshold - subtotal) }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: `${(subtotal / freeShippingThreshold) * 100}%` }"></div>
            </div>
            <div class="progress-footer">
              <span>$0</span>
              <span>${{ freeShippingThreshold }}</span>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="!isEmpty" class="sidebar-footer">
          <!-- Summary Cards -->
          <div class="summary-grid">
            <div class="summary-card">
              <span class="card-label">{{ $t('subtotal') }}</span>
              <span class="card-value">{{ formatPrice(subtotal) }}</span>
            </div>
            <div class="summary-card">
              <span class="card-label">{{ $t('shipping') }}</span>
              <span class="card-value" :class="{ 'free': shipping === 0 }">
                {{ shipping === 0 ? $t('free') : formatPrice(shipping) }}
              </span>
            </div>
            <div v-if="tax > 0" class="summary-card">
              <span class="card-label">{{ $t('tax') }}</span>
              <span class="card-value">{{ formatPrice(tax) }}</span>
            </div>
            <div class="summary-card total">
              <span class="card-label">{{ $t('total') }}</span>
              <span class="card-value total-value">{{ formatPrice(total) }}</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-grid">
            <button @click="proceedToCheckout" class="checkout-btn" :disabled="isProcessing">
              <span v-if="!isProcessing">{{ $t('proceedToCheckout') }}</span>
              <span v-else class="loader"></span>
            </button>
            
            <button @click="continueShopping" class="continue-btn">
              {{ $t('continueShopping') }}
            </button>
            
            <button @click="clearCartDialog" class="clear-btn">
              {{ $t('clearCart') }}
            </button>
          </div>

          <!-- Secure Payment Badge -->
          <div class="secure-badge">
            <span class="secure-icon">🔒</span>
            <span class="secure-text">{{ $t('secureCheckout') }}</span>
            <div class="payment-icons">
              <span>💳</span>
              <span>📱</span>
              <span>💰</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>
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

const itemCount = computed(() => items?.length || 0)
const luxuryItems = computed(() =>
  (items || []).map(item => ({
    ...item,
    totalPrice: (item.price || 0) * (item.quantity || 1)
  }))
)

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price).replace('EGP', 'LE ')
}

const continueShopping = () => {
  closeCart()
  router.push('/collections')
}

const proceedToCheckout = async () => {
  isProcessing.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 800))
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
    await clearCart()
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
  if (event.key === 'Escape' && isOpen?.value) {
    closeCart()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}

/* Mobile-First Styles */
.sidebar-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  z-index: 2000;
  -webkit-backdrop-filter: blur(4px);
}

.cart-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 420px;
  background: #0a0a0a;
  border-left: 1px solid rgba(212, 175, 55, 0.15);
  z-index: 2001;
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.5);
}

.cart-sidebar.rtl {
  right: auto;
  left: 0;
  border-left: none;
  border-right: 1px solid rgba(212, 175, 55, 0.15);
}

.sidebar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* Header */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  background: rgba(10, 10, 10, 0.98);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 10;
}

@media (min-width: 480px) {
  .sidebar-header {
    padding: 1.25rem 1.5rem;
  }
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  position: relative;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 50%;
}

.header-icon svg {
  width: 24px;
  height: 24px;
  color: #d4af37;
}

.header-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  background: #d4af37;
  color: #0a0a0a;
  font-size: 12px;
  font-weight: 700;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.rtl .header-badge {
  right: auto;
  left: -4px;
}

.sidebar-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #d4af37;
  margin: 0 0 0.25rem 0;
}

@media (min-width: 480px) {
  .sidebar-title {
    font-size: 1.5rem;
  }
}

.sidebar-subtitle {
  font-size: 0.8rem;
  color: rgba(244, 231, 193, 0.5);
  margin: 0;
}

.close-btn {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 50%;
  color: #f4e7c1;
  cursor: pointer;
  transition: all 0.3s;
  padding: 0;
}

.close-btn:hover {
  background: rgba(212, 175, 55, 0.15);
  border-color: #d4af37;
  color: #d4af37;
  transform: rotate(90deg);
}

.close-btn svg {
  width: 20px;
  height: 20px;
}

/* Empty State */
.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  text-align: center;
}

.empty-icon-wrapper {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.05);
  border-radius: 50%;
  margin-bottom: 2rem;
}

.empty-icon {
  width: 60px;
  height: 60px;
  color: rgba(212, 175, 55, 0.3);
}

.empty-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #f4e7c1;
  margin-bottom: 0.75rem;
}

.empty-message {
  color: rgba(244, 231, 193, 0.6);
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 2rem;
  max-width: 280px;
}

.empty-action {
  background: #d4af37;
  color: #0a0a0a;
  border: none;
  padding: 1rem 2rem;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s;
  width: 100%;
  max-width: 280px;
  min-height: 48px;
}

.empty-action:hover {
  background: #b8941f;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}

/* Cart Content */
.cart-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

@media (min-width: 480px) {
  .cart-content {
    padding: 1.5rem;
  }
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

/* Shipping Progress */
.shipping-progress {
  background: rgba(212, 175, 55, 0.05);
  padding: 1rem;
  border-radius: 12px;
  margin-top: 1rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.progress-label {
  color: rgba(244, 231, 193, 0.8);
}

.progress-amount {
  color: #d4af37;
  font-weight: 600;
}

.progress-bar {
  height: 4px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4af37, #b8941f);
  transition: width 0.3s ease;
}

.progress-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: rgba(244, 231, 193, 0.4);
}

/* Footer */
.sidebar-footer {
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  padding: 1rem;
  background: rgba(10, 10, 10, 0.98);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

@media (min-width: 480px) {
  .sidebar-footer {
    padding: 1.5rem;
  }
}

/* Summary Grid */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.summary-card {
  background: rgba(212, 175, 55, 0.05);
  padding: 0.75rem;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.summary-card.total {
  grid-column: span 2;
  background: rgba(212, 175, 55, 0.1);
}

.card-label {
  font-size: 0.75rem;
  color: rgba(244, 231, 193, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.card-value {
  font-size: 1rem;
  font-weight: 600;
  color: #f4e7c1;
}

.card-value.free {
  color: #10b981;
}

.total-value {
  font-size: 1.25rem;
  color: #d4af37;
}

/* Action Grid */
.action-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.checkout-btn,
.continue-btn,
.clear-btn {
  width: 100%;
  padding: 1rem;
  font-weight: 600;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  min-height: 48px;
  border-radius: 10px;
}

.checkout-btn {
  background: #d4af37;
  color: #0a0a0a;
}

.checkout-btn:hover:not(:disabled) {
  background: #b8941f;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
}

.checkout-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.continue-btn {
  background: transparent;
  color: #f4e7c1;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.continue-btn:hover {
  border-color: #d4af37;
  color: #d4af37;
}

.clear-btn {
  background: transparent;
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.clear-btn:hover {
  border-color: #ef4444;
  color: #ef4444;
}

/* Loader */
.loader {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(10, 10, 10, 0.3);
  border-top-color: #0a0a0a;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Secure Badge */
.secure-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  flex-wrap: wrap;
}

.secure-icon {
  font-size: 1.1rem;
}

.secure-text {
  font-size: 0.85rem;
  color: rgba(244, 231, 193, 0.6);
}

.payment-icons {
  display: flex;
  gap: 0.5rem;
}

.payment-icons span {
  font-size: 1rem;
}

/* Scrollbar */
.cart-content::-webkit-scrollbar {
  width: 4px;
}

.cart-content::-webkit-scrollbar-track {
  background: rgba(212, 175, 55, 0.05);
}

.cart-content::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 2px;
}

/* Touch Optimizations */
@media (max-width: 768px) {
  .checkout-btn,
  .continue-btn,
  .clear-btn,
  .empty-action {
    min-height: 52px;
  }
  
  .close-btn {
    width: 48px;
    height: 48px;
  }
  
  .close-btn svg {
    width: 22px;
    height: 22px;
  }
  
  .header-icon {
    width: 52px;
    height: 52px;
  }
  
  .header-icon svg {
    width: 26px;
    height: 26px;
  }
}

/* Active States */
.checkout-btn:active,
.continue-btn:active,
.clear-btn:active {
  transform: scale(0.98);
}
</style>