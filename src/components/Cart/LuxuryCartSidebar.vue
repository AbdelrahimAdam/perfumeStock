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
    <!-- Sidebar Container -->
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
        <!-- Scrollable Container -->
        <div class="cart-items-scroll">
          <!-- Items List -->
          <div class="cart-items-list">
            <LuxuryCartItem
              v-for="item in luxuryItems"
              :key="item.id"
              :item="item"
              @update-quantity="updateQuantity"
              @remove="removeFromCart"
            />
          </div>
          
          <!-- Free Shipping Progress -->
          <div v-if="subtotal < freeShippingThreshold" class="free-shipping-progress">
            <div class="progress-text">
              <span>{{ $t('freeShippingProgress', { amount: freeShippingThreshold - subtotal }) }}</span>
              <span class="progress-amount">${{ (freeShippingThreshold - subtotal).toFixed(2) }}</span>
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
        <!-- Summary -->
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

        <!-- Actions -->
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

        <!-- Secure Payment Info -->
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
// FIX: Added missing watch import
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
  clearCart,
  getCartSummary
} = cartStore

// State
const isProcessing = ref(false)
const freeShippingThreshold = 200

// Computed
const itemCount = computed(() => items.length)
const luxuryItems = computed(() => items.map(item => ({
  ...item,
  totalPrice: item.price * item.quantity
})))

// Methods
const continueShopping = () => {
  closeCart()
  router.push('/collections')
}

const proceedToCheckout = async () => {
  isProcessing.value = true
  
  try {
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    closeCart()
    router.push('/checkout')
    
    showNotification({
      type: 'success',
      title: $t('checkoutStarted'),
      message: $t('checkoutProcessing'),
      duration: 3000
    })
  } catch (error) {
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

// FIX: Watch for cart changes - corrected syntax
watch(() => items.length, (newLength) => {
  if (newLength === 0 && isOpen.value) {
    setTimeout(() => {
      closeCart()
    }, 2000)
  }
})

// Watch for cart open state changes
watch(() => isOpen.value, (newValue) => {
  if (newValue) {
    // Prevent body scroll when cart is open
    document.body.style.overflow = 'hidden'
  } else {
    // Restore body scroll
    document.body.style.overflow = ''
  }
})

// Cleanup on component unmount
onUnmounted(() => {
  document.body.style.overflow = ''
})

// Keyboard navigation
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeCart()
  }
}

// Set up keyboard listener
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* ========== LUXURY CART SIDEBAR STYLES ========== */

/* Overlay */
.luxury-cart-overlay {
  background: rgba(10, 10, 10, 0.8);
  backdrop-filter: blur(5px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Sidebar */
.luxury-cart-sidebar {
  width: 100%;
  max-width: 480px;
  height: 100vh;
  box-shadow: -10px 0 50px rgba(0, 0, 0, 0.5);
}

.luxury-cart-container {
  height: 100%;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a120b 100%);
  border-left: 1px solid rgba(212, 175, 55, 0.1);
  display: flex;
  flex-direction: column;
}

/* Header */
.luxury-cart-header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  background: rgba(10, 10, 10, 0.95);
}

.cart-header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.cart-title-wrapper {
  flex: 1;
}

.cart-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 0.75rem;
}

.cart-icon {
  width: 32px;
  height: 32px;
  stroke: #d4af37;
}

.cart-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 20px;
  height: 20px;
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  border-radius: 50%;
  color: #0a0a0a;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.8rem;
  font-weight: 600;
  color: #f4e7c1;
  margin: 0 0 0.25rem 0;
}

.cart-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #f4e7c1;
  opacity: 0.7;
  margin: 0;
}

.cart-close-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 10px;
  color: #f4e7c1;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cart-close-btn:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
  color: #d4af37;
  transform: rotate(90deg);
}

.close-icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
}

/* Empty State */
.luxury-cart-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
}

.empty-cart-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
  opacity: 0.3;
}

.empty-icon {
  width: 100%;
  height: 100%;
  stroke: #f4e7c1;
}

.empty-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #f4e7c1;
  margin: 0 0 0.5rem 0;
}

.empty-message {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #f4e7c1;
  opacity: 0.7;
  margin: 0 0 2rem 0;
  max-width: 300px;
}

.empty-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  border: none;
  border-radius: 25px;
  color: #0a0a0a;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.empty-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3);
}

.arrow-icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
}

/* Cart Items */
.luxury-cart-items {
  flex: 1;
  overflow: hidden;
}

.cart-items-scroll {
  height: 100%;
  overflow-y: auto;
  padding: 1.5rem;
}

.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

/* Free Shipping Progress */
.free-shipping-progress {
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.progress-text {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #f4e7c1;
}

.progress-amount {
  font-weight: 600;
  color: #d4af37;
}

.progress-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4af37 0%, #b8941f 100%);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.progress-labels {
  display: flex;
  justify-content: space-between;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #f4e7c1;
  opacity: 0.7;
}

/* Cart Footer */
.luxury-cart-footer {
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  background: rgba(10, 10, 10, 0.95);
  padding: 1.5rem;
}

.cart-summary {
  margin-bottom: 1.5rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.summary-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #f4e7c1;
  opacity: 0.8;
}

.summary-value {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #f4e7c1;
  font-weight: 500;
}

.shipping-value {
  color: #10b981;
  font-weight: 600;
}

.summary-divider {
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(212, 175, 55, 0.3) 50%, 
    transparent 100%);
  margin: 1rem 0;
}

.total-row {
  margin-bottom: 0;
}

.total-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.2rem;
  font-weight: 600;
  color: #d4af37;
}

.total-value {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #d4af37;
}

/* Cart Actions */
.cart-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.checkout-btn {
  padding: 1rem;
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  border: none;
  border-radius: 12px;
  color: #0a0a0a;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 48px;
}

.checkout-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(212, 175, 55, 0.4);
}

.checkout-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.processing-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(10, 10, 10, 0.3);
  border-top: 2px solid #0a0a0a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.continue-btn {
  padding: 1rem;
  background: transparent;
  border: 2px solid rgba(212, 175, 55, 0.3);
  border-radius: 12px;
  color: #f4e7c1;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.continue-btn:hover {
  border-color: #d4af37;
  color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
}

.clear-btn {
  padding: 0.75rem;
  background: transparent;
  border: none;
  color: #f4e7c1;
  opacity: 0.7;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  color: #ef4444;
  opacity: 1;
}

/* Secure Payment */
.secure-payment {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
}

.secure-icon {
  font-size: 1.2rem;
}

.secure-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #f4e7c1;
  opacity: 0.7;
  margin: 0;
}

.payment-methods {
  display: flex;
  gap: 0.25rem;
}

.payment-icon {
  font-size: 1rem;
  opacity: 0.7;
}

/* Scrollbar */
.cart-items-scroll::-webkit-scrollbar {
  width: 6px;
}

.cart-items-scroll::-webkit-scrollbar-track {
  background: rgba(212, 175, 55, 0.05);
  border-radius: 3px;
}

.cart-items-scroll::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #d4af37 0%, #b8941f 100%);
  border-radius: 3px;
}

.cart-items-scroll::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #b8941f 0%, #d4af37 100%);
}

/* Responsive */
@media (max-width: 768px) {
  .luxury-cart-sidebar {
    max-width: 100%;
  }
  
  .luxury-cart-header {
    padding: 1rem;
  }
  
  .cart-title {
    font-size: 1.5rem;
  }
  
  .cart-items-scroll {
    padding: 1rem;
  }
  
  .luxury-cart-footer {
    padding: 1rem;
  }
  
  .cart-badge {
    width: 18px;
    height: 18px;
    font-size: 0.6rem;
    top: -6px;
    right: -6px;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .luxury-cart-container {
    background: linear-gradient(180deg, #0a0a0a 0%, #0f0a03 100%);
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .cart-close-btn,
  .empty-action-btn,
  .checkout-btn,
  .continue-btn {
    border-width: 2px;
  }
  
  .cart-badge {
    border: 1px solid #0a0a0a;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .luxury-cart-sidebar,
  .cart-close-btn,
  .empty-action-btn,
  .checkout-btn,
  .continue-btn,
  .clear-btn {
    transition: none;
  }
  
  .processing-spinner {
    animation: none;
  }
}
</style>