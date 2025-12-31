<template>
  <!-- Overlay -->
  <div
    class="fixed inset-0 bg-black/70 backdrop-blur-sm z-[2000] transition-opacity duration-300"
    @click="handleCancel"
  />

  <!-- Modal -->
  <div
    class="fixed inset-0 z-[2001] flex items-center justify-center p-4 pointer-events-none"
  >
    <div
      class="luxury-confirmation bg-[#0a0a0a] border border-[#d4af37]/30 rounded-2xl 
             shadow-2xl max-w-md w-full pointer-events-auto transform 
             transition-all duration-300 scale-100"
      :class="{
        'scale-95 opacity-0': !isVisible
      }"
      @click.stop
    >
      <!-- Glow Effect -->
      <div class="absolute inset-0 bg-gradient-to-br from-[#d4af37]/5 to-transparent 
                  rounded-2xl blur-xl"></div>

      <!-- Content -->
      <div class="relative p-8">
        <!-- Icon -->
        <div 
          class="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
          :class="iconBgClass"
        >
          <span class="text-2xl">{{ icon }}</span>
        </div>

        <!-- Title -->
        <h3 class="text-2xl font-['Cormorant_Garamond'] font-bold text-center 
                   text-[#f4e7c1] mb-3">
          {{ data.options.title }}
        </h3>

        <!-- Message -->
        <p class="text-[#f4e7c1]/80 text-center mb-8 leading-relaxed">
          {{ data.options.message }}
        </p>

        <!-- Actions -->
        <div class="flex space-x-4" :class="{ 'space-x-reverse': isRTL }">
          <!-- Cancel Button -->
          <button
            @click="handleCancel"
            class="flex-1 py-3 px-6 border-2 border-[#d4af37]/30 text-[#f4e7c1] 
                   rounded-xl font-bold hover:border-[#d4af37] 
                   hover:text-[#d4af37] transition-all duration-300 
                   active:scale-95"
          >
            {{ data.options.cancelText || (isRTL ? 'إلغاء' : 'Cancel') }}
          </button>

          <!-- Confirm Button -->
          <button
            @click="handleConfirm"
            class="flex-1 py-3 px-6 bg-gradient-to-r from-[#d4af37] to-[#b8941f] 
                   text-[#0a0a0a] rounded-xl font-bold shadow-gold-lg 
                   hover:shadow-gold-xl transition-all duration-300 
                   hover:-translate-y-1 active:scale-95"
            :class="confirmButtonClass"
          >
            {{ data.options.confirmText || (isRTL ? 'تأكيد' : 'Confirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { ConfirmationOptions } from '@/utils/notifications'
import { useLanguageStore } from '@/stores/language'

interface Props {
  data: {
    options: ConfirmationOptions
    onConfirm: () => void
    onCancel: () => void
  }
}

const props = defineProps<Props>()
const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const languageStore = useLanguageStore()
const { isRTL } = languageStore

const isVisible = ref(false)

// Computed
const icon = computed(() => {
  const icons: Record<string, string> = {
    success: '✨',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  return icons[props.data.options.type || 'info']
})

const iconBgClass = computed(() => {
  const classes: Record<string, string> = {
    success: 'bg-emerald-500/20 text-emerald-400',
    error: 'bg-red-500/20 text-red-400',
    warning: 'bg-amber-500/20 text-amber-400',
    info: 'bg-blue-500/20 text-blue-400'
  }
  return classes[props.data.options.type || 'info']
})

const confirmButtonClass = computed(() => {
  const classes: Record<string, string> = {
    success: 'from-emerald-500 to-emerald-600',
    error: 'from-red-500 to-red-600',
    warning: 'from-amber-500 to-amber-600',
    info: 'from-blue-500 to-blue-600'
  }
  return classes[props.data.options.type || 'info'] || ''
})

// Methods
const handleConfirm = () => {
  props.data.onConfirm()
  emit('confirm')
  closeModal()
}

const handleCancel = () => {
  props.data.onCancel()
  emit('cancel')
  closeModal()
}

const closeModal = () => {
  isVisible.value = false
  setTimeout(() => {
    // Emit close to parent
    emit('cancel')
  }, 300)
}

// Handle Escape key
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleCancel()
  }
}

// Lifecycle
onMounted(() => {
  // Show modal with animation
  setTimeout(() => {
    isVisible.value = true
  }, 10)

  // Add event listener
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.luxury-confirmation {
  background: linear-gradient(135deg, 
    rgba(10, 10, 10, 0.95) 0%, 
    rgba(26, 18, 11, 0.95) 100%);
  backdrop-filter: blur(20px);
}
</style>