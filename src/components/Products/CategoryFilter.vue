<template>
  <div class="space-y-6">
    <!-- Categories -->
    <div>
      <h3 class="text-lg font-display-en font-bold mb-4">
        {{ currentLanguage === 'en' ? 'Categories' : 'الفئات' }}
      </h3>
      <div class="space-y-2">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="updateFilter('category', category.id)"
          :class="[
            'w-full text-left px-4 py-3 rounded-lg transition-all duration-200',
            filters.category === category.id
              ? 'bg-primary-500 text-white shadow-gold'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          ]"
          :style="{ direction: isRTL ? 'rtl' : 'ltr' }"
        >
          <div class="flex items-center justify-between">
            <span>{{ category[currentLanguage] }}</span>
            <span v-if="categoryCounts[category.id]" class="text-sm opacity-75">
              {{ categoryCounts[category.id] }}
            </span>
          </div>
        </button>
      </div>
    </div>

    <!-- Price Range -->
    <div>
      <h3 class="text-lg font-display-en font-bold mb-4">
        {{ currentLanguage === 'en' ? 'Price Range' : 'نطاق السعر' }}
      </h3>
      <div class="space-y-2">
        <button
          v-for="range in priceRanges"
          :key="range.label"
          @click="updatePriceRange(range)"
          :class="[
            'w-full text-left px-4 py-3 rounded-lg transition-all duration-200',
            isPriceRangeSelected(range)
              ? 'bg-primary-500 text-white shadow-gold'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          ]"
        >
          {{ range.label }}
        </button>
      </div>
    </div>

    <!-- Concentration -->
    <div>
      <h3 class="text-lg font-display-en font-bold mb-4">
        {{ currentLanguage === 'en' ? 'Concentration' : 'التركيز' }}
      </h3>
      <div class="space-y-2">
        <button
          v-for="concentration in concentrations"
          :key="concentration.value"
          @click="updateFilter('concentration', concentration.value)"
          :class="[
            'w-full text-left px-4 py-3 rounded-lg transition-all duration-200',
            filters.concentration === concentration.value
              ? 'bg-primary-500 text-white shadow-gold'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          ]"
        >
          {{ concentration.label[currentLanguage] }}
        </button>
      </div>
    </div>

    <!-- Sort By -->
    <div>
      <h3 class="text-lg font-display-en font-bold mb-4">
        {{ currentLanguage === 'en' ? 'Sort By' : 'ترتيب حسب' }}
      </h3>
      <div class="space-y-2">
        <button
          v-for="option in sortOptions"
          :key="option.value"
          @click="updateFilter('sortBy', option.value)"
          :class="[
            'w-full text-left px-4 py-3 rounded-lg transition-all duration-200',
            filters.sortBy === option.value
              ? 'bg-primary-500 text-white shadow-gold'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
          ]"
        >
          {{ option.label[currentLanguage] }}
        </button>
      </div>
    </div>

    <!-- Clear Filters -->
    <div>
      <button
        @click="clearFilters"
        class="w-full px-4 py-3 text-gray-600 hover:text-primary-600 
               border border-gray-300 rounded-lg hover:border-primary-500 
               transition-all duration-200"
      >
        {{ currentLanguage === 'en' ? 'Clear All Filters' : 'مسح جميع الفلاتر' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { FilterOptions } from '@/types'
import { useLanguageStore } from '@/stores/language'
import { useProductsStore } from '@/stores/products'
import { PRICE_RANGES, SORT_OPTIONS } from '@/utils/constants'

interface Props {
  filters: FilterOptions
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:filters': [filters: FilterOptions]
}>()

const languageStore = useLanguageStore()
const productsStore = useProductsStore()

const { currentLanguage, isRTL } = languageStore
const { categories, products } = productsStore

// Concentrations
const concentrations = [
  { value: 'EDT', label: { en: 'Eau de Toilette', ar: 'أو دي تواليت' } },
  { value: 'EDP', label: { en: 'Eau de Parfum', ar: 'أو دي بارفيوم' } },
  { value: 'Parfum', label: { en: 'Parfum', ar: 'بارفيوم' } },
  { value: 'Extrait', label: { en: 'Extrait de Parfum', ar: 'إكسترا دي بارفيوم' } }
]

// Price ranges
const priceRanges = PRICE_RANGES

// Sort options
const sortOptions = SORT_OPTIONS

// Category counts
const categoryCounts = computed(() => {
  const counts: Record<string, number> = {}
  products.forEach(product => {
    counts[product.category] = (counts[product.category] || 0) + 1
  })
  return counts
})

// Methods
const updateFilter = (key: keyof FilterOptions, value: any) => {
  const newFilters = { ...props.filters }
  
  if (newFilters[key] === value) {
    delete newFilters[key]
  } else {
    newFilters[key] = value
  }
  
  emit('update:filters', newFilters)
}

const updatePriceRange = (range: typeof priceRanges[0]) => {
  const newFilters = { ...props.filters }
  
  if (isPriceRangeSelected(range)) {
    delete newFilters.minPrice
    delete newFilters.maxPrice
  } else {
    newFilters.minPrice = range.min
    newFilters.maxPrice = range.max === Infinity ? undefined : range.max
  }
  
  emit('update:filters', newFilters)
}

const clearFilters = () => {
  emit('update:filters', {})
}

const isPriceRangeSelected = (range: typeof priceRanges[0]) => {
  return (
    props.filters.minPrice === range.min &&
    (props.filters.maxPrice === range.max || 
     (range.max === Infinity && props.filters.maxPrice === undefined))
  )
}
</script>