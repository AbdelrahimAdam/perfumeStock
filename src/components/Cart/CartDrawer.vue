<!-- src/components/Cart/LuxuryCartDrawer.vue -->
<template>
  <!-- Overlay -->
  <transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-all duration-500"
      @click="closeCart"
    />
  </transition>

  <!-- Drawer -->
  <transition
    :enter-active-class="enterClass"
    :leave-active-class="leaveClass"
  >
    <div
      v-if="isOpen"
      :class="[
        'fixed top-0 h-full w-full sm:w-[400px] md:w-[480px] bg-gradient-to-b from-[#0a0a0a] to-[#141414] z-[101]',
        'shadow-[-10px_0_50px_rgba(212,175,55,0.15)] border-l border-[#d4af37]/20',
        'flex flex-col',
        positionClass
      ]"
      :style="{ direction: isRTL ? 'rtl' : 'ltr' }"
    >
      <!-- Header -->
      <div class="flex items-center justify-between p-6 sm:p-8 border-b border-[#d4af37]/10 bg-gradient-to-r from-[#0a0a0a] to-[#1a120b]">
        <div class="flex items-center gap-3" :class="{ 'flex-row-reverse': isRTL }">
          <div class="relative">
            <div class="absolute inset-0 bg-gradient-to-br from-[#d4af37] to-[#b8941f] rounded-full blur-sm opacity-50"></div>
            <div class="relative w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8941f] 
                        flex items-center justify-center shadow-gold-lg">
              <svg class="w-5 h-5 text-[#0a0a0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <!-- Item count badge -->
            <div v-if="itemCount > 0" class="absolute -top-1 -right-1 min-w-[20px] h-5 
                        bg-[#d4af37] text-[#0a0a0a] text-xs font-bold rounded-full 
                        flex items-center justify-center px-1 border-2 border-[#0a0a0a]">
              {{ itemCount }}
            </div>
          </div>
          <div>
            <h2 class="text-xl sm:text-2xl font-['Cormorant_Garamond'] font-bold text-[#f4e7c1]">
              {{ $t('yourCart') }}
            </h2>
            <p v-if="!isEmpty" class="text-xs text-[#d4af37]/60 mt-0.5">
              {{ itemCount }} {{ itemCount === 1 ? $t('item') : $t('items') }}
            </p>
          </div>
        </div>
        
        <button
          @click="closeCart"
          class="p-2 sm:p-3 text-[#f4e7c1]/60 hover:text-[#d4af37] transition-all duration-300 
                 hover:rotate-90 rounded-full hover:bg-[#d4af37]/10 group"
          aria-label="Close cart"
        >
          <svg class="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" 
               fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                  d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Content area with conditional rendering -->
      <template v-if="isEmpty">
        <!-- Empty State -->
        <transition name="fade-scale">
          <div class="flex-1 flex flex-col items-center justify-center p-6 sm:p-8">
            <div class="relative w-24 h-24 sm:w-32 sm:h-32 mb-6 sm:mb-8">
              <div class="absolute inset-0 bg-gradient-to-br from-[#d4af37]/20 to-transparent 
                          rounded-full animate-pulse"></div>
              <div class="relative w-full h-full flex items-center justify-center">
                <svg class="w-16 h-16 sm:w-20 sm:h-20 text-[#d4af37]/30" fill="none" 
                     stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5" 
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
            </div>
            
            <p class="text-[#f4e7c1] text-lg sm:text-xl text-center mb-4 sm:mb-6 
                      font-['Cormorant_Garamond'] font-medium">
              {{ $t('cartEmpty') }}
            </p>
            
            <p class="text-[#d4af37]/60 text-sm text-center mb-6 sm:mb-8 max-w-[250px]">
              {{ $t('cartEmptyDescription') || 'Discover our luxury collection and add items to your cart' }}
            </p>
            
            <button
              @click="continueShopping"
              class="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r 
                     from-[#d4af37] to-[#b8941f] text-[#0a0a0a] rounded-xl 
                     font-bold shadow-gold-lg hover:shadow-gold-xl 
                     transition-all duration-300 hover:-translate-y-1 
                     active:scale-95 text-sm sm:text-base"
            >
              {{ $t('continueShopping') }}
            </button>
          </div>
        </transition>
      </template>

      <template v-else>
        <!-- Cart Items -->
        <div class="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#d4af37] 
                    scrollbar-track-[#1a120b]">
          <div class="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
            <transition-group name="slide-fade">
              <LuxuryCartItem
                v-for="item in enrichedItems"
                :key="item.id"
                :item="item"
                @update-quantity="updateQuantity"
                @remove="removeFromCart"
              />
            </transition-group>
          </div>
        </div>

        <!-- Footer -->
        <transition name="slide-up">
          <div class="border-t border-[#d4af37]/10 bg-gradient-to-t 
                      from-[#0a0a0a] to-[#141414] p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
            
            <!-- Free Shipping Progress - Mobile Optimized -->
            <div v-if="subtotal < 200" class="space-y-2">
              <div class="flex justify-between items-center text-xs sm:text-sm">
                <span class="text-[#d4af37]/70">{{ $t('freeShippingProgress') }}</span>
                <span class="font-bold text-[#d4af37] bg-[#d4af37]/10 px-2 py-1 rounded-full">
                  {{ formatCurrency(200 - subtotal) }}
                </span>
              </div>
              <div class="h-2 bg-[#1a120b] rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-[#d4af37] to-[#b8941f] 
                         transition-all duration-700 relative"
                  :style="{ width: `${Math.min((subtotal / 200) * 100, 100)}%` }"
                >
                  <div class="absolute inset-0 bg-white/20 animate-pulse"></div>
                </div>
              </div>
            </div>

            <!-- Summary Cards - Mobile Optimized -->
            <div class="space-y-3 sm:space-y-4">
              <div class="flex justify-between items-center py-2 border-b border-[#f4e7c1]/10">
                <span class="text-sm sm:text-base text-[#f4e7c1]/70">{{ $t('subtotal') }}</span>
                <span class="font-semibold text-[#f4e7c1]">{{ formatCurrency(subtotal) }}</span>
              </div>
              
              <div class="flex justify-between items-center py-2 border-b border-[#f4e7c1]/10">
                <span class="text-sm sm:text-base text-[#f4e7c1]/70">{{ $t('shipping') }}</span>
                <span class="font-semibold" :class="shipping === 0 ? 'text-[#10b981]' : 'text-[#f4e7c1]'">
                  {{ shipping === 0 ? $t('free') : formatCurrency(shipping) }}
                </span>
              </div>
              
              <div v-if="tax > 0" class="flex justify-between items-center py-2 border-b border-[#f4e7c1]/10">
                <span class="text-sm sm:text-base text-[#f4e7c1]/70">{{ $t('tax') }}</span>
                <span class="font-semibold text-[#f4e7c1]">{{ formatCurrency(tax) }}</span>
              </div>
              
              <!-- Out of Stock Warning -->
              <div v-if="hasOutOfStockItems" class="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p class="text-xs text-red-400 flex items-center gap-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                  </svg>
                  {{ $t('someItemsOutOfStock') }}
                </p>
              </div>
              
              <div class="flex justify-between items-center pt-2 sm:pt-4">
                <span class="text-base sm:text-lg font-['Cormorant_Garamond'] font-bold text-[#d4af37]">
                  {{ $t('total') }}
                </span>
                <span class="text-xl sm:text-2xl font-bold text-[#d4af37]">
                  {{ formatCurrency(total) }}
                </span>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="pt-2 sm:pt-4 space-y-3">
              <button
                @click="checkout"
                :disabled="hasOutOfStockItems"
                class="w-full py-3 sm:py-4 bg-gradient-to-r from-[#d4af37] to-[#b8941f] 
                       text-[#0a0a0a] rounded-xl font-bold shadow-gold-lg 
                       hover:shadow-gold-xl transition-all duration-300 
                       hover:-translate-y-1 active:scale-95 text-sm sm:text-base
                       flex items-center justify-center gap-2 group
                       disabled:opacity-50 disabled:cursor-not-allowed 
                       disabled:hover:translate-y-0 disabled:hover:shadow-gold-lg"
              >
                <span>{{ $t('proceedToCheckout') }}</span>
                <svg class="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                </svg>
              </button>
              
              <button
                @click="continueShopping"
                class="w-full py-3 sm:py-4 border-2 border-[#d4af37]/30 text-[#f4e7c1] 
                       rounded-xl font-bold hover:border-[#d4af37] hover:text-[#d4af37] 
                       transition-all duration-300 hover:-translate-y-1 
                       active:scale-95 text-sm sm:text-base"
              >
                {{ $t('continueShopping') }}
              </button>
            </div>
          </div>
        </transition>
      </template>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useProductsStore } from '@/stores/products'
import { useLanguageStore } from '@/stores/language'
import LuxuryCartItem from './LuxuryCartItem.vue'
import { showNotification } from '@/utils/notifications'

const router = useRouter()
const cartStore = useCartStore()
const productsStore = useProductsStore()
const languageStore = useLanguageStore()

const { currentLanguage, isRTL, t: $t } = languageStore

const {
  items,
  isOpen,
  isEmpty,
  subtotal,
  shipping,
  tax,
  total,
  closeCart,
  updateQuantity,
  removeFromCart
} = cartStore

// Computed
const itemCount = computed(() => items.value.length)

// Enrich cart items with full product data from products store
const enrichedItems = computed(() => {
  return items.value.map(cartItem => {
    // Find the full product data from products store
    const fullProduct = productsStore.products.find(p => p.id === cartItem.id) || 
                       productsStore.featuredProducts.find(p => p.id === cartItem.id) ||
                       productsStore.bestSellerProducts.find(p => p.id === cartItem.id)
    
    if (fullProduct) {
      // Merge cart item quantity with full product data
      return {
        ...fullProduct,
        quantity: cartItem.quantity,
        // Use current price from products store (in case of price changes)
        price: fullProduct.price,
        originalPrice: fullProduct.originalPrice,
        // Update stock status
        inStock: fullProduct.inStock,
        stockQuantity: fullProduct.stockQuantity
      }
    }
    
    // Fallback to cart item if product not found in store
    return cartItem
  })
})

// Check if any items are out of stock
const hasOutOfStockItems = computed(() => {
  return enrichedItems.value.some(item => !item.inStock || item.stockQuantity === 0)
})

// Format currency using the products store's price formatting
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat(currentLanguage.value === 'ar' ? 'ar-EG' : 'en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value).replace('EGP', 'LE ')
}

// Position based on RTL
const positionClass = computed(() => {
  return isRTL.value ? 'left-0' : 'right-0'
})

// Transition classes based on RTL
const enterClass = computed(() => {
  return isRTL.value 
    ? 'transition transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] -translate-x-full'
    : 'transition transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] translate-x-full'
})

const leaveClass = computed(() => {
  return isRTL.value
    ? 'transition transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] translate-x-0'
    : 'transition transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] -translate-x-0'
})

const checkout = () => {
  if (hasOutOfStockItems.value) {
    showNotification({
      title: $t('cannotCheckout'),
      message: $t('removeOutOfStockItems'),
      type: 'error'
    })
    return
  }
  
  showNotification({
    title: $t('checkoutStarted'),
    message: $t('checkoutProcessing'),
    type: 'success'
  })
  closeCart()
  router.push('/checkout')
}

const continueShopping = () => {
  closeCart()
  showNotification({
    title: $t('continueShopping'),
    message: $t('keepShopping'),
    type: 'info'
  })
}
</script>

<style scoped>
/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}

.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-fade-move {
  transition: transform 0.3s ease;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Custom scrollbar */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #1a120b;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #b8941f;
}

/* Mobile optimizations */
@media (max-width: 640px) {
  .shadow-gold-lg {
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
  }
  
  .shadow-gold-xl {
    box-shadow: 0 8px 24px rgba(212, 175, 55, 0.3);
  }
}

/* RTL Support */
:deep(.rtl) {
  .space-x-reverse > :not([hidden]) ~ :not([hidden]) {
    --tw-space-x-reverse: 1;
  }
}

/* Loading animation for progress bar */
@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-pulse {
  animation: shimmer 2s infinite;
}

/* Ensure proper stacking on mobile */
@media (max-width: 640px) {
  .fixed {
    position: fixed;
  }
  
  .inset-0 {
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
</style>