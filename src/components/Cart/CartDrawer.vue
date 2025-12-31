<template>
  <!-- Overlay -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] transition-all duration-500"
    @click="closeCart"
  />

  <!-- Drawer -->
  <div
    :class="[
      'fixed top-0 right-0 h-full w-full max-w-lg bg-[#0a0a0a] z-[101] shadow-[0_0_50px_rgba(212,175,55,0.2)]',
      'transform transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]',
      'border-l border-[#d4af37]/20',
      isOpen ? 'translate-x-0' : 'translate-x-full'
    ]"
    :style="{ direction: isRTL ? 'rtl' : 'ltr' }"
  >
    <!-- Header -->
    <div class="flex items-center justify-between p-8 border-b border-[#d4af37]/10">
      <div class="flex items-center space-x-3" :class="{ 'space-x-reverse': isRTL }">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#d4af37] to-[#b8941f] 
                    flex items-center justify-center shadow-gold-lg">
          <svg class="w-5 h-5 text-[#0a0a0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <h2 class="text-2xl font-['Cormorant_Garamond'] font-bold text-[#f4e7c1]">
          {{ $t('yourCart') }}
        </h2>
      </div>
      <button
        @click="closeCart"
        class="p-3 text-[#f4e7c1]/60 hover:text-[#d4af37] transition-all duration-300 
               hover:rotate-90 rounded-full hover:bg-[#d4af37]/10"
        aria-label="Close cart"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="isEmpty" class="flex flex-col items-center justify-center h-[calc(100vh-200px)] p-8">
      <div class="relative w-32 h-32 mb-8">
        <div class="absolute inset-0 bg-gradient-to-br from-[#d4af37]/20 to-transparent 
                    rounded-full blur-xl"></div>
        <div class="relative w-full h-full flex items-center justify-center">
          <svg class="w-20 h-20 text-[#d4af37]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="0.5" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
      </div>
      <p class="text-[#f4e7c1]/80 text-xl mb-6 text-center font-['Cormorant_Garamond'] font-medium">
        {{ $t('cartEmpty') }}
      </p>
      <button
        @click="continueShopping"
        class="px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#b8941f] text-[#0a0a0a] 
               rounded-full font-bold shadow-gold-lg hover:shadow-gold-xl 
               transition-all duration-300 hover:-translate-y-1"
      >
        {{ $t('continueShopping') }}
      </button>
    </div>

    <!-- Cart Items -->
    <div v-else class="flex-1 overflow-y-auto">
      <div class="p-8 space-y-6">
        <LuxuryCartItem
          v-for="item in items"
          :key="item.id"
          :item="item"
          @update-quantity="updateQuantity"
          @remove="removeFromCart"
        />
      </div>
    </div>

    <!-- Footer -->
    <div v-if="!isEmpty" class="border-t border-[#d4af37]/10 p-8 space-y-6">
      <!-- Summary -->
      <div class="space-y-4">
        <div class="flex justify-between items-center py-2 border-b border-[#f4e7c1]/10">
          <span class="text-[#f4e7c1]/80">{{ $t('subtotal') }}</span>
          <span class="font-bold text-[#f4e7c1] text-lg">${{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between items-center py-2 border-b border-[#f4e7c1]/10">
          <span class="text-[#f4e7c1]/80">{{ $t('shipping') }}</span>
          <span class="font-bold text-[#d4af37]">{{ shipping === 0 ? $t('free') : `$${shipping.toFixed(2)}` }}</span>
        </div>
        <div v-if="tax > 0" class="flex justify-between items-center py-2 border-b border-[#f4e7c1]/10">
          <span class="text-[#f4e7c1]/80">{{ $t('tax') }}</span>
          <span class="font-bold text-[#f4e7c1]">${{ tax.toFixed(2) }}</span>
        </div>
        <div class="flex justify-between items-center pt-4">
          <span class="text-xl font-['Cormorant_Garamond'] font-bold text-[#d4af37]">{{ $t('total') }}</span>
          <span class="text-2xl font-bold text-[#d4af37]">${{ total.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Free Shipping Progress -->
      <div v-if="subtotal < 200" class="pt-6">
        <div class="text-sm text-[#d4af37]/80 mb-3 flex justify-between">
          <span>{{ $t('freeShippingProgress') }}</span>
          <span class="font-bold">${{ (200 - subtotal).toFixed(2) }}</span>
        </div>
        <div class="h-2 bg-[#1a120b] rounded-full overflow-hidden">
          <div 
            class="h-full bg-gradient-to-r from-[#d4af37] to-[#b8941f] transition-all duration-700"
            :style="{ width: `${Math.min((subtotal / 200) * 100, 100)}%` }"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="pt-6 space-y-4">
        <button
          @click="checkout"
          class="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#b8941f] 
                 text-[#0a0a0a] rounded-xl font-bold shadow-gold-lg 
                 hover:shadow-gold-xl transition-all duration-300 
                 hover:-translate-y-1 active:scale-95"
        >
          {{ $t('proceedToCheckout') }}
        </button>
        <button
          @click="continueShopping"
          class="w-full py-4 border-2 border-[#d4af37]/30 text-[#f4e7c1] 
                 rounded-xl font-bold hover:border-[#d4af37] 
                 hover:text-[#d4af37] transition-all duration-300"
        >
          {{ $t('continueShopping') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useLanguageStore } from '@/stores/language'
import LuxuryCartItem from './LuxuryCartItem.vue'
import { showNotification } from '@/utils/notifications'

const cartStore = useCartStore()
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

const checkout = () => {
  showNotification({
    title: $t('checkoutStarted'),
    message: $t('checkoutProcessing'),
    type: 'success'
  })
  closeCart()
  // Navigate to checkout page
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
/* Custom scrollbar for cart */
::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #1a120b;
}

::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 2px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b8941f;
}
</style>