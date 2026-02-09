<template>
  <div class="luxury-product-grid">
    <!-- Loading State -->
    <div v-if="loading" class="grid-loading">
      <div v-for="n in skeletonCount" :key="n" class="product-skeleton">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
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
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.product-skeleton {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  aspect-ratio: 3/4;
  position: relative;
}

.skeleton-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #f9fafb 25%, #f3f4f6 50%, #f9fafb 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  padding: 12px;
}

.skeleton-line {
  height: 10px;
  background: linear-gradient(90deg, #f9fafb 25%, #f3f4f6 50%, #f9fafb 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 6px;
  border-radius: 2px;
}

.skeleton-line.short {
  width: 60%;
  margin-bottom: 0;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

.grid-error,
.grid-empty {
  text-align: center;
  padding: 48px 24px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 2px;
}

.error-icon,
.empty-icon {
  width: 48px;
  height: 48px;
  margin: 0 auto 16px;
  color: #6b7280;
}

.error-icon svg,
.empty-icon svg {
  width: 100%;
  height: 100%;
}

.error-title,
.empty-title {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
}

.error-message,
.empty-message {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
  max-width: 320px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.5;
}

.retry-btn {
  padding: 8px 20px;
  background: #111827;
  color: #ffffff;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 2px;
  transition: background-color 0.2s ease;
}

.retry-btn:hover {
  background: #374151;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 16px;
}

.load-more {
  text-align: center;
  margin-top: 40px;
}

.load-more-btn {
  padding: 10px 28px;
  background: transparent;
  color: #111827;
  border: 1px solid #d1d5db;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s ease;
}

.load-more-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #111827;
}

.load-more-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-spinner svg {
  width: 14px;
  height: 14px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Desktop */
@media (min-width: 1280px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .grid-loading {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
  }
}

/* Tablet */
@media (max-width: 1024px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }
  
  .grid-loading {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 16px;
  }
}

/* Mobile - 3 cards per row */
@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  
  .grid-loading {
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  
  .error-title,
  .empty-title {
    font-size: 16px;
  }
}

/* Small Mobile */
@media (max-width: 640px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  .grid-loading {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  
  .product-skeleton {
    aspect-ratio: 2/3;
  }
  
  .skeleton-content {
    padding: 10px;
  }
  
  .skeleton-line {
    height: 8px;
  }
}

/* Very Small Mobile */
@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  
  .grid-loading {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  
  .grid-error,
  .grid-empty {
    padding: 32px 20px;
  }
  
  .error-icon,
  .empty-icon {
    width: 40px;
    height: 40px;
  }
}

/* Extra Small - Still 3 cards but minimal */
@media (max-width: 360px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
  
  .grid-loading {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
}
</style>