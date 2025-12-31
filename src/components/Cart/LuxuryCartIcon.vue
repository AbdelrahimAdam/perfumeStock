<template>
  <button
    @click="toggleCart"
    class="relative group p-2"
    :aria-label="$t('shoppingCart')"
  >
    <!-- Icon Container -->
    <div class="relative w-10 h-10 flex items-center justify-center 
                rounded-full border border-[#d4af37]/20 
                group-hover:border-[#d4af37]/40 group-hover:bg-[#d4af37]/5 
                transition-all duration-300">
      <svg class="w-5 h-5 text-[#f4e7c1] group-hover:text-[#d4af37] 
                  transition-colors duration-300" 
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
      </svg>
      
      <!-- Item Count Badge -->
      <span
        v-if="totalItems > 0"
        class="absolute -top-1 -right-1 bg-gradient-to-br from-[#d4af37] to-[#b8941f] 
               text-[#0a0a0a] text-xs font-bold rounded-full w-5 h-5 
               flex items-center justify-center shadow-gold-lg 
               animate-pulse-gentle group-hover:scale-110 transition-transform"
      >
        {{ totalItems > 99 ? '99+' : totalItems }}
      </span>
      
      <!-- Cart Pulse Effect -->
      <div v-if="totalItems > 0" 
           class="absolute inset-0 rounded-full border border-[#d4af37]/30 
                  animate-ping opacity-0 group-hover:opacity-100"></div>
    </div>
    
    <!-- Tooltip -->
    <div class="absolute top-full right-0 mt-2 px-3 py-2 bg-[#0a0a0a] border 
                border-[#d4af37]/20 rounded-lg shadow-luxury-lg opacity-0 
                invisible group-hover:opacity-100 group-hover:visible 
                transition-all duration-300 whitespace-nowrap text-sm 
                text-[#f4e7c1] z-50"
         :class="{ 'right-auto left-0': isRTL }">
      {{ $t('viewCart') }}
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { useLanguageStore } from '@/stores/language'

const cartStore = useCartStore()
const languageStore = useLanguageStore()

const { isRTL, t: $t } = languageStore

const totalItems = computed(() => cartStore.totalItems)

const toggleCart = () => {
  cartStore.toggleCart()
  
  // Add haptic feedback on mobile
  if ('vibrate' in navigator) {
    navigator.vibrate?.(10)
  }
}
</script>

<style scoped>
@keyframes pulse-gentle {
  0%, 100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

.animate-pulse-gentle {
  animation: pulse-gentle 2s ease-in-out infinite;
}

.animate-ping {
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
</style>