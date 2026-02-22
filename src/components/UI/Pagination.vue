<!-- src/components/UI/Pagination.vue -->
<template>
  <div class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
    <!-- Mobile view -->
    <div class="flex flex-1 justify-between sm:hidden">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ t('Previous') }}
      </button>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ t('Next') }}
      </button>
    </div>

    <!-- Desktop view -->
    <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
      <div>
        <p class="text-sm text-gray-700">
          {{ t('Showing') }}
          <span class="font-medium">{{ startItem }}</span>
          {{ t('to') }}
          <span class="font-medium">{{ endItem }}</span>
          {{ t('of') }}
          <span class="font-medium">{{ totalItems }}</span>
          {{ t('results') }}
        </p>
      </div>
      
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <!-- Previous button -->
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">{{ t('Previous') }}</span>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>

          <!-- Page numbers -->
          <template v-for="page in displayedPages" :key="page">
            <!-- Ellipsis -->
            <span
              v-if="page === '...'"
              class="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700"
            >
              ...
            </span>

            <!-- Page button -->
            <button
              v-else
              @click="goToPage(page)"
              :class="[
                'relative inline-flex items-center border px-4 py-2 text-sm font-medium',
                currentPage === page
                  ? 'z-10 border-gold-500 bg-gold-50 text-gold-600'
                  : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
              ]"
            >
              {{ page }}
            </button>
          </template>

          <!-- Next button -->
          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span class="sr-only">{{ t('Next') }}</span>
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </nav>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLanguageStore } from '@/stores/language'

const props = defineProps<{
  currentPage: number
  totalPages: number
  perPage: number
  totalItems: number
}>()

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const { t } = useLanguageStore()

// Computed
const startItem = computed(() => {
  return (props.currentPage - 1) * props.perPage + 1
})

const endItem = computed(() => {
  return Math.min(props.currentPage * props.perPage, props.totalItems)
})

const displayedPages = computed(() => {
  const delta = 2 // Number of pages to show on each side of current page
  const range: (number | string)[] = []
  const rangeWithDots: (number | string)[] = []
  let l: number

  for (let i = 1; i <= props.totalPages; i++) {
    if (
      i === 1 ||
      i === props.totalPages ||
      (i >= props.currentPage - delta && i <= props.currentPage + delta)
    ) {
      range.push(i)
    }
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1)
      } else if (i - l !== 1) {
        rangeWithDots.push('...')
      }
    }
    rangeWithDots.push(i)
    l = i as number
  })

  return rangeWithDots
})

// Methods
const prevPage = () => {
  if (props.currentPage > 1) {
    emit('page-change', props.currentPage - 1)
  }
}

const nextPage = () => {
  if (props.currentPage < props.totalPages) {
    emit('page-change', props.currentPage + 1)
  }
}

const goToPage = (page: number) => {
  if (page !== props.currentPage) {
    emit('page-change', page)
  }
}
</script>