<template>
  <div
    :class="[
      'luxury-notification',
      'min-w-80 max-w-md rounded-xl shadow-2xl border overflow-hidden',
      'transform transition-all duration-300',
      'hover:scale-[1.02] hover:shadow-3xl',
      typeClass,
      { 'opacity-0 scale-95 pointer-events-none': isLeaving }
    ]"
    @mouseenter="pauseTimeout"
    @mouseleave="resumeTimeout"
  >
    <!-- Glow Effect -->
    <div class="absolute inset-0 bg-gradient-to-r opacity-5 blur-xl" :class="glowClass"></div>
    
    <!-- Content -->
    <div class="relative p-4 flex items-start space-x-3" :class="{ 'space-x-reverse': isRTL }">
      <!-- Icon -->
      <div class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" 
           :class="iconBgClass">
        <span class="text-lg">{{ notification.icon || getIcon(notification.type) }}</span>
      </div>
      
      <!-- Text -->
      <div class="flex-1 min-w-0">
        <h4 class="font-['Cormorant_Garamond'] font-bold text-lg mb-1" :class="titleClass">
          {{ notification.title }}
        </h4>
        <p class="text-sm opacity-90 line-clamp-3">
          {{ notification.message }}
        </p>
        
        <!-- Action Button -->
        <button
          v-if="notification.action"
          @click="handleAction"
          class="mt-3 px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
          :class="actionClass"
        >
          {{ notification.action.label }}
        </button>
      </div>
      
      <!-- Close Button -->
      <button
        @click="$emit('close')"
        class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center 
               hover:bg-white/10 transition-colors duration-200"
        aria-label="Close notification"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </div>
    
    <!-- Progress Bar -->
    <div v-if="notification.duration && notification.duration > 0" 
         class="h-1 overflow-hidden">
      <div
        ref="progressBar"
        class="h-full transition-all duration-linear"
        :class="progressBarClass"
        :style="{ transform: `translateX(${progress}%)` }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Notification } from '@/utils/notifications'
import { useLanguageStore } from '@/stores/language'

interface Props {
  notification: Notification
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

const languageStore = useLanguageStore()
const { isRTL } = languageStore

const progress = ref(0)
const isLeaving = ref(false)
const progressInterval = ref<NodeJS.Timeout>()
const isPaused = ref(false)

// Computed
const typeClass = computed(() => {
  const classes: Record<string, string> = {
    success: 'bg-emerald-50/90 backdrop-blur-sm border-emerald-200/30',
    error: 'bg-red-50/90 backdrop-blur-sm border-red-200/30',
    warning: 'bg-amber-50/90 backdrop-blur-sm border-amber-200/30',
    info: 'bg-blue-50/90 backdrop-blur-sm border-blue-200/30'
  }
  return classes[props.notification.type] || classes.info
})

const iconBgClass = computed(() => {
  const classes: Record<string, string> = {
    success: 'bg-emerald-500/20 text-emerald-600',
    error: 'bg-red-500/20 text-red-600',
    warning: 'bg-amber-500/20 text-amber-600',
    info: 'bg-blue-500/20 text-blue-600'
  }
  return classes[props.notification.type] || classes.info
})

const titleClass = computed(() => {
  const classes: Record<string, string> = {
    success: 'text-emerald-800',
    error: 'text-red-800',
    warning: 'text-amber-800',
    info: 'text-blue-800'
  }
  return classes[props.notification.type] || classes.info
})

const glowClass = computed(() => {
  const classes: Record<string, string> = {
    success: 'from-emerald-400 to-emerald-600',
    error: 'from-red-400 to-red-600',
    warning: 'from-amber-400 to-amber-600',
    info: 'from-blue-400 to-blue-600'
  }
  return classes[props.notification.type] || classes.info
})

const progressBarClass = computed(() => {
  const classes: Record<string, string> = {
    success: 'bg-emerald-500',
    error: 'bg-red-500',
    warning: 'bg-amber-500',
    info: 'bg-blue-500'
  }
  return classes[props.notification.type] || classes.info
})

const actionClass = computed(() => {
  const classes: Record<string, string> = {
    success: 'bg-emerald-500 text-white hover:bg-emerald-600',
    error: 'bg-red-500 text-white hover:bg-red-600',
    warning: 'bg-amber-500 text-white hover:bg-amber-600',
    info: 'bg-blue-500 text-white hover:bg-blue-600'
  }
  return classes[props.notification.type] || classes.info
})

// Methods
const getIcon = (type: string): string => {
  const icons: Record<string, string> = {
    success: '✨',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  return icons[type] || 'ℹ️'
}

const handleAction = () => {
  if (props.notification.action) {
    props.notification.action.onClick()
    emit('close')
  }
}

const startProgress = () => {
  if (!props.notification.duration || props.notification.duration <= 0) return

  const duration = props.notification.duration
  const interval = 50 // Update every 50ms for smooth animation
  const steps = duration / interval
  const step = 100 / steps

  progressInterval.value = setInterval(() => {
    if (!isPaused.value) {
      progress.value -= step
      if (progress.value <= -100) {
        clearInterval(progressInterval.value)
        closeNotification()
      }
    }
  }, interval)
}

const pauseTimeout = () => {
  isPaused.value = true
}

const resumeTimeout = () => {
  isPaused.value = false
}

const closeNotification = () => {
  isLeaving.value = true
  setTimeout(() => {
    emit('close')
  }, 300)
}

// Lifecycle
onMounted(() => {
  startProgress()
})

onUnmounted(() => {
  if (progressInterval.value) {
    clearInterval(progressInterval.value)
  }
})
</script>

<style scoped>
.duration-linear {
  animation-timing-function: linear !important;
}
</style>