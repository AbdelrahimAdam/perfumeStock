<template>
  <div class="group relative flex items-center p-6 bg-[#0a0a0a] rounded-2xl 
              border border-[#d4af37]/10 hover:border-[#d4af37]/30 
              transition-all duration-500 hover:shadow-gold-lg"
       :class="{ 'space-x-reverse': isRTL }">
    
    <!-- Glow Effect -->
    <div class="absolute inset-0 bg-gradient-to-r from-[#d4af37]/5 to-transparent 
                opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity 
                duration-500"></div>

    <!-- Product Image -->
    <div class="relative flex-shrink-0">
      <div class="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br 
                  from-[#1a120b] to-[#0a0a0a] border border-[#d4af37]/10 
                  group-hover:border-[#d4af37]/30 transition-all duration-500">
        <img
          :src="item.imageUrl"
          :alt="item.name[currentLanguage]"
          class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <!-- Quantity Badge -->
      <div class="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-[#d4af37] to-[#b8941f] 
                  rounded-full flex items-center justify-center shadow-gold-lg">
        <span class="text-xs font-bold text-[#0a0a0a]">{{ item.quantity }}</span>
      </div>
    </div>

    <!-- Product Info -->
    <div class="flex-1 ml-6" :class="{ 'mr-6 ml-0': isRTL }">
      <div class="mb-3">
        <h4 class="font-['Cormorant_Garamond'] font-bold text-[#f4e7c1] 
                   text-lg line-clamp-1 group-hover:text-[#d4af37] 
                   transition-colors duration-300">
          {{ item.name[currentLanguage] }}
        </h4>
        <p class="text-sm text-[#f4e7c1]/60">{{ item.size }} • {{ item.concentration || 'Eau de Parfum' }}</p>
      </div>
      
      <!-- Price & Quantity -->
      <div class="flex items-center justify-between">
        <div class="space-y-1">
          <span class="text-2xl font-bold text-[#d4af37]">
            ${{ (item.price * item.quantity).toFixed(2) }}
          </span>
          <p class="text-xs text-[#f4e7c1]/40">
            {{ $t('each') }}: ${{ item.price.toFixed(2) }}
          </p>
        </div>
        
        <!-- Quantity Controls -->
        <div class="flex items-center space-x-2" :class="{ 'space-x-reverse': isRTL }">
          <button
            @click="decreaseQuantity"
            :disabled="item.quantity <= 1"
            class="w-10 h-10 rounded-full border border-[#d4af37]/20 
                   flex items-center justify-center text-[#f4e7c1] 
                   hover:border-[#d4af37] hover:text-[#d4af37] 
                   hover:bg-[#d4af37]/10 disabled:opacity-30 
                   disabled:cursor-not-allowed transition-all duration-300"
            :title="$t('decreaseQuantity')"
          >
            <span class="text-xl font-bold">-</span>
          </button>
          
          <span class="w-8 text-center font-bold text-[#f4e7c1]">{{ item.quantity }}</span>
          
          <button
            @click="increaseQuantity"
            class="w-10 h-10 rounded-full border border-[#d4af37]/20 
                   flex items-center justify-center text-[#f4e7c1] 
                   hover:border-[#d4af37] hover:text-[#d4af37] 
                   hover:bg-[#d4af37]/10 transition-all duration-300"
            :title="$t('increaseQuantity')"
          >
            <span class="text-xl font-bold">+</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Remove Button -->
    <button
      @click="removeItem"
      class="absolute top-4 right-4 p-2 text-[#f4e7c1]/40 hover:text-red-400 
             transition-all duration-300 hover:scale-110 group/remove"
      :class="{ 'right-auto left-4': isRTL }"
      :aria-label="$t('removeItem')"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M6 18L18 6M6 6l12 12"/>
      </svg>
      <!-- Tooltip -->
      <div class="absolute top-full right-0 mt-2 px-3 py-1 bg-[#0a0a0a] 
                  border border-red-400/20 rounded-lg opacity-0 
                  invisible group-hover/remove:opacity-100 
                  group-hover/remove:visible transition-all duration-300 
                  whitespace-nowrap text-sm text-red-400 z-50"
           :class="{ 'right-auto left-0': isRTL }">
        {{ $t('remove') }}
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CartItem } from '@/types'
import { useLanguageStore } from '@/stores/language'
import { showConfirmation } from '@/utils/notifications'

interface Props {
  item: CartItem
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update-quantity': [id: string, quantity: number]
  'remove': [id: string]
}>()

const languageStore = useLanguageStore()
const { currentLanguage, isRTL, t: $t } = languageStore

const decreaseQuantity = () => {
  const newQuantity = props.item.quantity - 1
  if (newQuantity >= 1) {
    emit('update-quantity', props.item.id, newQuantity)
    showQuickNotification($t('quantityDecreased'))
  }
}

const increaseQuantity = () => {
  const newQuantity = props.item.quantity + 1
  emit('update-quantity', props.item.id, newQuantity)
  showQuickNotification($t('quantityIncreased'))
}

const removeItem = async () => {
  const confirmed = await showConfirmation({
    title: $t('removeItemConfirm'),
    message: $t('removeItemMessage'),
    confirmText: $t('remove'),
    cancelText: $t('keep')
  })
  
  if (confirmed) {
    emit('remove', props.item.id)
    showQuickNotification($t('itemRemoved'))
  }
}

const showQuickNotification = (message: string) => {
  // Small visual feedback
  const event = new CustomEvent('show-quick-toast', {
    detail: { message, type: 'info', duration: 1500 }
  })
  window.dispatchEvent(event)
}
</script>