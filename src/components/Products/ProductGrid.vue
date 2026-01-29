<template>
  <div class="luxury-product-grid">
    <!-- Loading State -->
    <div v-if="loading" class="grid-loading">
      <div v-for="n in skeletonCount" :key="n" class="product-skeleton">
        <div class="skeleton-image"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
        <div class="skeleton-line shorter"></div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="grid-error">
      <div class="error-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h3 class="error-title">Something went wrong</h3>
      <p class="error-message">{{ error }}</p>
      <button @click="$emit('retry')" class="retry-btn">Try Again</button>
    </div>

    <!-- Empty State -->
    <div v-else-if="!products.length" class="grid-empty">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      <h3 class="empty-title">No products found</h3>
      <p class="empty-message">Try adjusting your search or filters</p>
    </div>

    <!-- Products Grid -->
    <div v-else class="products-grid">
      <LuxuryProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
        @view-details="$emit('view-product', product)"
        @add-to-cart="$emit('add-to-cart', product)"
      />
    </div>

    <!-- Load More -->
    <div v-if="showLoadMore && products.length > 0" class="load-more">
      <button
        @click="$emit('load-more')"
        :disabled="loadingMore"
        class="load-more-btn"
      >
        <span v-if="!loadingMore">Load More</span>
        <span v-else class="loading-spinner">
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" 
                    stroke-dasharray="31.4" stroke-dashoffset="25" />
          </svg>
          Loading...
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'
import type { Product } from '@/types'
import LuxuryProductCard from './ProductCard.vue'

interface Props {
  products: Product[]
  loading?: boolean
  loadingMore?: boolean
  error?: string | null
  showLoadMore?: boolean
  columns?: number
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loadingMore: false,
  error: null,
  showLoadMore: false,
  columns: 4
})

defineEmits<{
  'view-product': [product: Product]
  'add-to-cart': [product: Product]
  'load-more': []
  'retry': []
}>()

const skeletonCount = 8
</script>

<style scoped>
.luxury-product-grid {
  width: 100%;
}

.grid-loading {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.product-skeleton {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.skeleton-image {
  height: 200px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 10px;
  margin-bottom: 1rem;
}

.skeleton-line {
  height: 12px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

.skeleton-line.short {
  width: 70%;
}

.skeleton-line.shorter {
  width: 50%;
  margin-bottom: 1.5rem;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.grid-error,
.grid-empty {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.error-icon,
.empty-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  color: #666;
}

.error-icon svg,
.empty-icon svg {
  width: 100%;
  height: 100%;
}

.error-title,
.empty-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 600;
  color: #0a0a0a;
  margin-bottom: 0.5rem;
}

.error-message,
.empty-message {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #666;
  margin-bottom: 1.5rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.retry-btn {
  padding: 0.75rem 2rem;
  background: #d4af37;
  color: #0a0a0a;
  border: none;
  border-radius: 25px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-btn:hover {
  background: #c19b2a;
  transform: translateY(-2px);
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.load-more {
  text-align: center;
  margin-top: 4rem;
}

.load-more-btn {
  padding: 1rem 3rem;
  background: transparent;
  color: #d4af37;
  border: 2px solid #d4af37;
  border-radius: 30px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-btn:hover:not(:disabled) {
  background: #d4af37;
  color: #0a0a0a;
  transform: translateY(-2px);
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.loading-spinner svg {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Responsive */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .grid-loading {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .error-title,
  .empty-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .grid-loading {
    grid-template-columns: 1fr;
  }
}
</style>