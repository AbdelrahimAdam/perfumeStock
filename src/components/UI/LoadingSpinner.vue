<template>
  <div :class="[
    'flex items-center justify-center',
    sizeClasses,
    customClass
  ]">
    <div :class="[
      'animate-spin rounded-full border-2 border-gray-200',
      variantClasses
    ]" :style="{ 
      borderTopColor: color || 'currentColor',
      width: spinnerSize,
      height: spinnerSize
    }" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'primary' | 'secondary' | 'light' | 'dark'
  color?: string
  customClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'primary',
  customClass: ''
})

// Size mapping
const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

const spinnerSizeMap = {
  sm: '1rem',
  md: '2rem',
  lg: '3rem',
  xl: '4rem'
}

// Variant classes
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'secondary':
      return 'border-gray-300'
    case 'light':
      return 'border-gray-100'
    case 'dark':
      return 'border-gray-800'
    default: // primary
      return 'border-primary-200'
  }
})

// Size classes
const sizeClasses = computed(() => sizeMap[props.size])

// Spinner size
const spinnerSize = computed(() => spinnerSizeMap[props.size])
</script>