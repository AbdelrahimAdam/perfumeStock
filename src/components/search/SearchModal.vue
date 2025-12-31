<template>
  <!-- Overlay -->
  <transition name="fade">
    <div
      v-if="isOpen"
      class="luxury-search-overlay fixed inset-0 z-[3000]"
      @click="closeSearch"
    />
  </transition>

  <!-- Modal -->
  <div
    class="luxury-search-modal fixed inset-0 z-[3001] pointer-events-none"
    :class="{ 'open': isOpen }"
  >
    <div class="search-modal-container" @click.stop>
      <!-- Header -->
      <div class="search-modal-header">
        <div class="search-header-content">
          <!-- Search Input -->
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              :placeholder="$t('searchPlaceholder')"
              class="search-input"
              @input="handleSearch"
              @keyup.enter="performSearch"
              @keyup.esc="closeSearch"
            />
            
            <button v-if="searchQuery" @click="clearSearch" class="clear-search-btn" aria-label="Clear search">
              <svg class="clear-icon" viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="1.5" 
                      stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </div>
          
          <!-- Close Button -->
          <button @click="closeSearch" class="search-close-btn" aria-label="Close search">
            <svg class="close-icon" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="1.5" 
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <!-- Search Tabs -->
        <div class="search-tabs">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['search-tab', { 'active': activeTab === tab.id }]"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="search-modal-content">
        <!-- Loading State -->
        <div v-if="isLoading" class="search-loading">
          <div class="loading-spinner"></div>
          <p class="loading-text">{{ $t('searching') }}</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="searchQuery && searchResults.length === 0" class="search-empty">
          <div class="empty-icon">🔍</div>
          <h3 class="empty-title">{{ $t('noResults') }}</h3>
          <p class="empty-message">{{ $t('noResultsMessage') }}</p>
          <div class="empty-suggestions">
            <span class="suggestion-title">{{ $t('trySearchingFor') }}:</span>
            <div class="suggestion-tags">
              <button
                v-for="suggestion in searchSuggestions"
                :key="suggestion"
                @click="searchQuery = suggestion; performSearch()"
                class="suggestion-tag"
              >
                {{ suggestion }}
              </button>
            </div>
          </div>
        </div>

        <!-- Recent Searches -->
        <div v-else-if="!searchQuery && recentSearches.length > 0" class="search-recent">
          <div class="recent-header">
            <h3 class="recent-title">{{ $t('recentSearches') }}</h3>
            <button @click="clearRecentSearches" class="clear-recent-btn">
              {{ $t('clearAll') }}
            </button>
          </div>
          <div class="recent-list">
            <button
              v-for="search in recentSearches"
              :key="search"
              @click="searchQuery = search; performSearch()"
              class="recent-item"
            >
              <svg class="recent-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 19V12M12 5V8M12 8L8 4M12 8L16 4" 
                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="recent-text">{{ search }}</span>
            </button>
          </div>
        </div>

        <!-- Popular Searches -->
        <div v-else-if="!searchQuery" class="search-popular">
          <h3 class="popular-title">{{ $t('popularSearches') }}</h3>
          <div class="popular-list">
            <button
              v-for="popular in popularSearches"
              :key="popular"
              @click="searchQuery = popular; performSearch()"
              class="popular-item"
            >
              {{ popular }}
            </button>
          </div>
        </div>

        <!-- Search Results -->
        <div v-else class="search-results">
          <!-- Products Results -->
          <div v-if="activeTab === 'products' && productResults.length > 0" class="results-section">
            <h3 class="results-title">{{ $t('products') }} ({{ productResults.length }})</h3>
            <div class="products-grid">
              <div
                v-for="product in productResults"
                :key="product.id"
                class="product-card"
                @click="viewProduct(product)"
              >
                <div class="product-image">
                  <img :src="product.imageUrl" :alt="product.name" loading="lazy" />
                </div>
                <div class="product-info">
                  <h4 class="product-name">{{ product.name }}</h4>
                  <p class="product-brand">{{ product.brand }}</p>
                  <p class="product-price">${{ product.price.toFixed(2) }}</p>
                </div>
              </div>
            </div>
            <button v-if="productResults.length > 6" @click="viewAllProducts" class="view-all-btn">
              {{ $t('viewAllProducts') }}
            </button>
          </div>

          <!-- Categories Results -->
          <div v-if="activeTab === 'categories' && categoryResults.length > 0" class="results-section">
            <h3 class="results-title">{{ $t('categories') }} ({{ categoryResults.length }})</h3>
            <div class="categories-list">
              <router-link
                v-for="category in categoryResults"
                :key="category.id"
                :to="`/category/${category.id}`"
                class="category-item"
                @click="closeSearch"
              >
                <div class="category-icon">🏷️</div>
                <div class="category-info">
                  <h4 class="category-name">{{ category.name }}</h4>
                  <p class="category-count">{{ category.count }} {{ $t('products') }}</p>
                </div>
                <svg class="arrow-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="1.5" 
                        stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </router-link>
            </div>
          </div>

          <!-- Brands Results -->
          <div v-if="activeTab === 'brands' && brandResults.length > 0" class="results-section">
            <h3 class="results-title">{{ $t('brands') }} ({{ brandResults.length }})</h3>
            <div class="brands-grid">
              <router-link
                v-for="brand in brandResults"
                :key="brand.id"
                :to="`/brand/${brand.id}`"
                class="brand-card"
                @click="closeSearch"
              >
                <div class="brand-logo">
                  <img :src="brand.logo" :alt="brand.name" loading="lazy" />
                </div>
                <span class="brand-name">{{ brand.name }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useProductsStore } from '@/stores/products'
import type { Product } from '@/types'

const router = useRouter()
const languageStore = useLanguageStore()
const productsStore = useProductsStore()

const { t: $t } = languageStore

// State
const isOpen = ref(false)
const searchQuery = ref('')
const activeTab = ref('products')
const isLoading = ref(false)
const searchResults = ref<any[]>([])
const recentSearches = ref<string[]>([])
const searchInput = ref<HTMLInputElement>()

// Computed
const productResults = computed(() => 
  searchResults.value.filter(r => r.type === 'product')
)

const categoryResults = computed(() => 
  searchResults.value.filter(r => r.type === 'category')
)

const brandResults = computed(() => 
  searchResults.value.filter(r => r.type === 'brand')
)

// Data
const tabs = [
  { id: 'products', label: $t('products') },
  { id: 'categories', label: $t('categories') },
  { id: 'brands', label: $t('brands') }
]

const searchSuggestions = [
  'Chanel No 5',
  'Tom Ford Oud',
  'YSL Black Opium',
  'Arabic Oud',
  'Floral Perfumes',
  'Summer Fragrances'
]

const popularSearches = [
  'Dior Sauvage',
  'Versace Eros',
  'Gucci Bloom',
  'Armani Code',
  'Prada Luna Rossa',
  'Creed Aventus'
]

// Methods
const openSearch = () => {
  isOpen.value = true
  document.body.classList.add('no-scroll')
  
  nextTick(() => {
    searchInput.value?.focus()
    loadRecentSearches()
  })
}

const closeSearch = () => {
  isOpen.value = false
  document.body.classList.remove('no-scroll')
  searchQuery.value = ''
  searchResults.value = []
}

const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  searchInput.value?.focus()
}

const handleSearch = debounce(() => {
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    return
  }
  
  performSearch()
}, 300)

const performSearch = async () => {
  if (!searchQuery.value.trim()) return
  
  isLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Search products
    const products = productsStore.searchProducts(searchQuery.value)
    const productResults = products.map(p => ({
      ...p,
      type: 'product'
    }))
    
    // Mock categories and brands for demo
    const categoryResults = [
      { id: 'floral', name: 'Floral', count: 12, type: 'category' },
      { id: 'woody', name: 'Woody', count: 8, type: 'category' },
      { id: 'fresh', name: 'Fresh', count: 15, type: 'category' }
    ].filter(c => 
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    
    const brandResults = [
      { id: 'chanel', name: 'Chanel', logo: '/images/brands/chanel.png', type: 'brand' },
      { id: 'dior', name: 'Dior', logo: '/images/brands/dior.png', type: 'brand' },
      { id: 'gucci', name: 'Gucci', logo: '/images/brands/gucci.png', type: 'brand' }
    ].filter(b => 
      b.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
    
    searchResults.value = [...productResults, ...categoryResults, ...brandResults]
    
    // Save to recent searches
    saveToRecentSearches(searchQuery.value)
    
  } catch (error) {
    console.error('Search failed:', error)
  } finally {
    isLoading.value = false
  }
}

const viewProduct = (product: Product) => {
  closeSearch()
  router.push(`/product/${product.slug}`)
}

const viewAllProducts = () => {
  closeSearch()
  router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
}

const loadRecentSearches = () => {
  const saved = localStorage.getItem('luxury_recent_searches')
  if (saved) {
    recentSearches.value = JSON.parse(saved)
  }
}

const saveToRecentSearches = (query: string) => {
  const cleanedQuery = query.trim()
  if (!cleanedQuery) return
  
  // Remove if already exists
  const index = recentSearches.value.indexOf(cleanedQuery)
  if (index > -1) {
    recentSearches.value.splice(index, 1)
  }
  
  // Add to beginning
  recentSearches.value.unshift(cleanedQuery)
  
  // Keep only last 10 searches
  if (recentSearches.value.length > 10) {
    recentSearches.value = recentSearches.value.slice(0, 10)
  }
  
  // Save to localStorage
  localStorage.setItem('luxury_recent_searches', JSON.stringify(recentSearches.value))
}

const clearRecentSearches = () => {
  recentSearches.value = []
  localStorage.removeItem('luxury_recent_searches')
}

// Debounce function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Event Listeners
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isOpen.value) {
    closeSearch()
  }
  
  if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
    event.preventDefault()
    if (isOpen.value) {
      closeSearch()
    } else {
      openSearch()
    }
  }
}

const handleOpenSearch = (event: CustomEvent) => {
  if (event.detail) {
    openSearch()
  } else {
    closeSearch()
  }
}

// Lifecycle
onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('toggle-search', handleOpenSearch as EventListener)
  
  // Load recent searches
  loadRecentSearches()
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('toggle-search', handleOpenSearch as EventListener)
})

// Expose open/close methods to parent
defineExpose({
  openSearch,
  closeSearch
})
</script>

<style scoped>
/* ========== LUXURY SEARCH MODAL STYLES ========== */

/* Overlay */
.luxury-search-overlay {
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(10px);
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Modal */
.luxury-search-modal {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10vh;
  opacity: 0;
  transform: translateY(-30px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.luxury-search-modal.open {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.search-modal-container {
  width: 90%;
  max-width: 900px;
  max-height: 80vh;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a120b 100%);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 24px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(212, 175, 55, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  overflow: hidden;
  position: relative;
}

.search-modal-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, 
    transparent, 
    rgba(212, 175, 55, 0.3), 
    transparent
  );
}

/* Header */
.search-modal-header {
  padding: 2rem 2rem 1rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  background: linear-gradient(180deg, rgba(10, 10, 10, 0.98) 0%, rgba(10, 10, 10, 0.95) 100%);
  backdrop-filter: blur(10px);
}

.search-header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 1.25rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  stroke: #f4e7c1;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.search-input {
  width: 100%;
  padding: 1.25rem 3.5rem 1.25rem 3rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 16px;
  color: #f4e7c1;
  font-family: 'Inter', sans-serif;
  font-size: 1.125rem;
  font-weight: 400;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.02em;
}

.search-input::placeholder {
  color: #a89c7c;
  font-weight: 300;
}

.search-input:focus {
  outline: none;
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.03);
  box-shadow: 
    0 0 0 3px rgba(212, 175, 55, 0.1),
    inset 0 1px 2px rgba(0, 0, 0, 0.2);
}

.clear-search-btn {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 8px;
  color: #f4e7c1;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.clear-search-btn:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
  color: #d4af37;
  transform: translateY(-50%) scale(1.1);
}

.clear-icon {
  width: 14px;
  height: 14px;
  stroke: currentColor;
  stroke-width: 2;
}

.search-close-btn {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 12px;
  color: #f4e7c1;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.search-close-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.search-close-btn:hover {
  background: rgba(212, 175, 55, 0.15);
  border-color: #d4af37;
  color: #d4af37;
  transform: rotate(90deg);
}

.search-close-btn:hover::before {
  opacity: 1;
}

.close-icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  stroke-width: 1.5;
}

/* Search Tabs */
.search-tabs {
  display: flex;
  gap: 0.75rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  border: 1px solid rgba(212, 175, 55, 0.1);
}

.search-tab {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  color: #a89c7c;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.search-tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.search-tab:hover {
  color: #f4e7c1;
  background: rgba(212, 175, 55, 0.05);
  border-color: rgba(212, 175, 55, 0.2);
}

.search-tab:hover::before {
  opacity: 1;
}

.search-tab.active {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
  border-color: rgba(212, 175, 55, 0.3);
  color: #d4af37;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.1);
}

/* Content */
.search-modal-content {
  max-height: calc(80vh - 160px);
  overflow-y: auto;
  padding: 2rem;
}

.search-modal-content::-webkit-scrollbar {
  width: 6px;
}

.search-modal-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.search-modal-content::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.3);
  border-radius: 3px;
}

.search-modal-content::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.5);
}

/* Loading State */
.search-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid rgba(212, 175, 55, 0.1);
  border-top: 3px solid #d4af37;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1.5rem;
  position: relative;
}

.loading-spinner::after {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border: 3px solid transparent;
  border-top: 3px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  animation: spin 2s linear infinite reverse;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-family: 'Inter', sans-serif;
  color: #f4e7c1;
  font-size: 0.875rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 0;
  opacity: 0.7;
}

/* Empty State */
.search-empty {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.2;
  filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.3));
}

.empty-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.75rem;
  font-weight: 300;
  color: #f4e7c1;
  margin: 0 0 0.75rem 0;
  letter-spacing: 0.05em;
}

.empty-message {
  font-family: 'Inter', sans-serif;
  color: #a89c7c;
  font-size: 0.95rem;
  font-weight: 300;
  line-height: 1.6;
  margin: 0 0 3rem 0;
  opacity: 0.8;
}

.empty-suggestions {
  text-align: center;
  max-width: 500px;
  margin: 0 auto;
}

.suggestion-title {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #d4af37;
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.suggestion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.suggestion-tag {
  padding: 0.75rem 1.5rem;
  background: rgba(212, 175, 55, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 50px;
  color: #a89c7c;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.suggestion-tag::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.suggestion-tag:hover {
  background: rgba(212, 175, 55, 0.1);
  border-color: #d4af37;
  color: #d4af37;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.1);
}

.suggestion-tag:hover::before {
  opacity: 1;
}

/* Recent Searches */
.search-recent {
  padding: 1rem;
}

.recent-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.recent-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: #f4e7c1;
  margin: 0;
  letter-spacing: 0.05em;
}

.clear-recent-btn {
  padding: 0.5rem 1rem;
  background: rgba(212, 175, 55, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 6px;
  color: #a89c7c;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-recent-btn:hover {
  background: rgba(212, 175, 55, 0.1);
  border-color: #d4af37;
  color: #d4af37;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid transparent;
  border-radius: 12px;
  color: #a89c7c;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
}

.recent-item:hover {
  background: rgba(212, 175, 55, 0.05);
  border-color: rgba(212, 175, 55, 0.2);
  color: #f4e7c1;
  transform: translateX(4px);
}

.recent-icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  opacity: 0.7;
  flex-shrink: 0;
}

.recent-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Popular Searches */
.search-popular {
  padding: 2rem;
}

.popular-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 400;
  color: #f4e7c1;
  margin: 0 0 1.5rem 0;
  text-align: center;
  letter-spacing: 0.05em;
}

.popular-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.popular-item {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.05), rgba(212, 175, 55, 0.02));
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 12px;
  color: #a89c7c;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.popular-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.popular-item:hover {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
  border-color: #d4af37;
  color: #d4af37;
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(212, 175, 55, 0.1);
}

.popular-item:hover::before {
  opacity: 1;
}

/* Search Results */
.search-results {
  animation: fadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.results-section {
  margin-bottom: 2.5rem;
}

.results-section:last-child {
  margin-bottom: 0;
}

.results-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: #f4e7c1;
  margin: 0 0 1.5rem 0;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  letter-spacing: 0.05em;
}

/* Products Grid */
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.product-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.product-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.05), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-card:hover {
  transform: translateY(-4px);
  border-color: rgba(212, 175, 55, 0.3);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(212, 175, 55, 0.1);
}

.product-card:hover::before {
  opacity: 1;
}

.product-image {
  width: 100%;
  height: 140px;
  overflow: hidden;
  position: relative;
}

.product-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.3));
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.product-card:hover .product-image img {
  transform: scale(1.05);
}

.product-info {
  padding: 1.25rem;
  background: rgba(10, 10, 10, 0.8);
}

.product-name {
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  color: #f4e7c1;
  margin: 0 0 0.25rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-brand {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 300;
  color: #a89c7c;
  margin: 0 0 0.75rem 0;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.product-price {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.25rem;
  font-weight: 400;
  color: #d4af37;
  margin: 0;
}

.view-all-btn {
  display: block;
  width: 100%;
  padding: 1rem;
  background: rgba(212, 175, 55, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  color: #a89c7c;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.view-all-btn:hover {
  background: rgba(212, 175, 55, 0.1);
  border-color: #d4af37;
  color: #d4af37;
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(212, 175, 55, 0.1);
}

/* Categories List */
.categories-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.category-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.05), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.category-item:hover {
  background: rgba(212, 175, 55, 0.05);
  border-color: rgba(212, 175, 55, 0.3);
  transform: translateX(8px);
}

.category-item:hover::before {
  opacity: 1;
}

.category-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
}

.category-name {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #f4e7c1;
  margin: 0 0 0.25rem 0;
}

.category-count {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 300;
  color: #a89c7c;
  margin: 0;
  letter-spacing: 0.05em;
}

.arrow-icon {
  width: 20px;
  height: 20px;
  stroke: #a89c7c;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.category-item:hover .arrow-icon {
  stroke: #d4af37;
  opacity: 1;
  transform: translateX(4px);
}

/* Brands Grid */
.brands-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1.5rem;
}

.brand-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.brand-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.05), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.brand-card:hover {
  transform: translateY(-4px);
  border-color: rgba(212, 175, 55, 0.3);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(212, 175, 55, 0.1);
}

.brand-card:hover::before {
  opacity: 1;
}

.brand-logo {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 12px;
  padding: 0.75rem;
}

.brand-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  filter: brightness(0.9) contrast(1.1);
  transition: filter 0.3s ease;
}

.brand-card:hover .brand-logo img {
  filter: brightness(1) contrast(1.2);
}

.brand-name {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  color: #a89c7c;
  text-align: center;
  transition: color 0.3s ease;
}

.brand-card:hover .brand-name {
  color: #d4af37;
}

/* Responsive Design */
@media (max-width: 768px) {
  .luxury-search-modal {
    padding-top: 5vh;
  }
  
  .search-modal-container {
    width: 95%;
    max-height: 90vh;
    border-radius: 20px;
  }
  
  .search-modal-header {
    padding: 1.5rem 1.5rem 1rem;
  }
  
  .search-header-content {
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  .search-input {
    padding: 1rem 3rem 1rem 2.75rem;
    font-size: 1rem;
  }
  
  .search-close-btn {
    width: 44px;
    height: 44px;
  }
  
  .search-tabs {
    gap: 0.5rem;
    padding: 0.25rem;
  }
  
  .search-tab {
    padding: 0.625rem 1rem;
    font-size: 0.8rem;
  }
  
  .search-modal-content {
    padding: 1.5rem;
    max-height: calc(90vh - 140px);
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 1rem;
  }
  
  .brands-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .search-modal-header {
    padding: 1.25rem 1.25rem 0.75rem;
  }
  
  .search-header-content {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .search-input-wrapper {
    width: 100%;
  }
  
  .search-close-btn {
    align-self: flex-end;
  }
  
  .search-tabs {
    overflow-x: auto;
    padding: 0.25rem;
  }
  
  .search-tab {
    white-space: nowrap;
    flex: none;
  }
  
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .brands-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Global No Scroll Class */
:global(.no-scroll) {
  overflow: hidden;
}
</style>