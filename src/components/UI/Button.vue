<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center font-medium rounded-lg transition-all',
      'duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      sizeClasses,
      variantClasses,
      fullWidth ? 'w-full' : '',
      customClass
    ]"
    @click="$emit('click', $event)"
  >
    <!-- Loading Spinner -->
    <svg
      v-if="loading"
      class="animate-spin -ml-1 mr-2 h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        class="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="4"
      />
      <path
        class="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>

    <!-- Icon Before -->
    <component
      v-if="iconBefore"
      :is="iconBefore"
      class="w-4 h-4 mr-2"
      :class="{ 'ml-2 mr-0': isRTL && !loading }"
    />

    <!-- Slot Content -->
    <slot />

    <!-- Icon After -->
    <component
      v-if="iconAfter"
      :is="iconAfter"
      class="w-4 h-4 ml-2"
      :class="{ 'mr-2 ml-0': isRTL && !loading }"
    />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLanguageStore } from '@/stores/language'

interface Props {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  disabled?: boolean
  fullWidth?: boolean
  iconBefore?: any
  iconAfter?: any
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  fullWidth: false,
  customClass: ''
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const languageStore = useLanguageStore()
const { isRTL } = languageStore

// Size classes
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm'
    case 'lg':
      return 'px-6 py-3 text-base'
    case 'xl':
      return 'px-8 py-4 text-lg'
    default: // md
      return 'px-4 py-2 text-sm'
  }
})

// Variant classes
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500'
    case 'outline':
      return 'border-2 border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-500'
    case 'ghost':
      return 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500'
    case 'danger':
      return 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500'
    default: // primary
      return 'bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500'
  }
})
</script>