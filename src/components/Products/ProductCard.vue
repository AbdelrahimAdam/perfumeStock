<template>
  <div class="luxury-product-card">
    <!-- Full Image Container with Overlay Text -->
    <div class="product-image-container" @click="$emit('view-details')">
      <img 
        :src="product.imageUrl || '/placeholder-perfume.jpg'"
        :alt="product.name"
        class="product-image"
        loading="lazy"
      />
      
      <!-- Badges -->
      <div class="product-badges">
        <span v-if="product.isBestSeller" class="badge best-seller">
          {{ currentLanguage === 'en' ? 'BEST' : 'الأفضل' }}
        </span>
        <span v-if="isNewArrival" class="badge new-arrival">
          {{ currentLanguage === 'en' ? 'NEW' : 'جديد' }}
        </span>
      </div>
      
      <!-- Quick Action Button -->
      <button 
        @click.stop="$emit('add-to-cart')"
        class="quick-action-btn"
        :title="currentLanguage === 'en' ? 'Add to cart' : 'أضف إلى السلة'"
      >
        <svg class="cart-icon" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
        </svg>
      </button>
      
      <!-- Desktop Hover Overlay -->
      <div class="desktop-hover-overlay">
        <div class="hover-buttons-container">
          <button 
            @click.stop="$emit('view-details')"
            class="hover-btn view-product-btn"
          >
            <svg class="btn-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            {{ currentLanguage === 'en' ? 'View Product' : 'عرض المنتج' }}
          </button>
          <button 
            @click.stop="$emit('add-to-cart')"
            class="hover-btn add-to-cart-btn"
          >
            <svg class="btn-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            {{ currentLanguage === 'en' ? 'Add to Cart' : 'أضف إلى السلة' }}
          </button>
        </div>
      </div>
      
      <!-- Text Overlay - Always visible on bottom of image -->
      <div class="text-overlay">
        <div class="text-content">
          <div class="product-brand">{{ product.brand }}</div>
          <h3 class="product-name">{{ currentLanguage === 'en' ? product.name.en : product.name.ar }}</h3>
          <div class="product-price">
            <span class="current-price">{{ formatPrice(product.price) }} {{ currentLanguage === 'en' ? 'EGP' : 'ج.م' }}</span>
            <span v-if="product.originalPrice && product.originalPrice > product.price" 
                  class="original-price">{{ formatPrice(product.originalPrice) }} {{ currentLanguage === 'en' ? 'EGP' : 'ج.م' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'
import { useLanguageStore } from '@/stores/language'

interface Props {
  product: Product
}

const props = defineProps<Props>()
defineEmits<{
  'view-details': []
  'add-to-cart': []
}>()

const languageStore = useLanguageStore()
const { currentLanguage } = languageStore

// ✅ Robust computed for new arrival
const isNewArrival = computed(() => {
  const c = props.product?.createdAt
  if (!c) return false

  // Convert Firestore Timestamp or string/Date to JS Date
  const createdDate = typeof c?.toDate === 'function' ? c.toDate() : new Date(c)

  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)

  return createdDate > oneMonthAgo
})

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-EG').format(price)
}
</script>

<style scoped>
.luxury-product-card {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  position: relative;
  aspect-ratio: 3/4;
  cursor: pointer;
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.luxury-product-card:hover {
  transform: translateY(-2px);
  border-color: #d1d5db;
}

/* Full Image Container */
.product-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #f9fafb;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.luxury-product-card:hover .product-image {
  transform: scale(1.05);
}

/* Badges */
.product-badges {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  z-index: 3;
}

.badge {
  padding: 4px 8px;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  border-radius: 2px;
  backdrop-filter: blur(4px);
  line-height: 1;
}

.best-seller {
  background: rgba(212, 175, 55, 0.9);
  color: #000000;
}

.new-arrival {
  background: rgba(5, 150, 105, 0.9);
  color: #ffffff;
}

/* Quick Action Button (Small floating) */
.quick-action-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: #ffffff;
  color: #111827;
  border: 1px solid #e5e7eb;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
  transform: translateY(5px);
  z-index: 3;
  padding: 0;
}

.luxury-product-card:hover .quick-action-btn {
  opacity: 1;
  transform: translateY(0);
}

.quick-action-btn:hover {
  background: #111827;
  color: #ffffff;
  border-color: #111827;
  transform: scale(1.1);
}

.quick-action-btn .cart-icon {
  width: 14px;
  height: 14px;
}

/* Desktop Hover Overlay - Covers image */
.desktop-hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
  z-index: 2;
}

.luxury-product-card:hover .desktop-hover-overlay {
  opacity: 1;
  pointer-events: auto;
}

.hover-buttons-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 70%;
  max-width: 140px;
}

.hover-btn {
  padding: 8px 12px;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  pointer-events: auto;
  width: 100%;
  line-height: 1.2;
  min-height: 32px;
}

.view-product-btn {
  background: #ffffff;
  color: #111827;
  border: 1px solid #ffffff;
}

.view-product-btn:hover {
  background: transparent;
  color: #ffffff;
  border-color: #ffffff;
  transform: translateY(-1px);
}

.add-to-cart-btn {
  background: #111827;
  color: #ffffff;
  border: 1px solid #111827;
}

.add-to-cart-btn:hover {
  background: #374151;
  border-color: #374151;
  transform: translateY(-1px);
}

.btn-icon {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
}

/* Text Overlay - Always visible on bottom of image */
.text-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, 
    rgba(0, 0, 0, 0.85) 0%, 
    rgba(0, 0, 0, 0.7) 40%, 
    rgba(0, 0, 0, 0.4) 70%, 
    transparent 100%);
  color: #ffffff;
  padding: 16px 12px 12px 12px;
  z-index: 1;
  pointer-events: none;
}

.text-content {
  pointer-events: none;
}

.product-brand {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.product-name {
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0 6px 0;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 8px;
}

.current-price {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
}

.original-price {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: line-through;
  white-space: nowrap;
}

/* Desktop */
@media (min-width: 1025px) {
  .text-overlay {
    padding: 20px 14px 14px 14px;
  }
  
  .product-brand {
    font-size: 11px;
  }
  
  .product-name {
    font-size: 14px;
  }
  
  .current-price {
    font-size: 16px;
  }
  
  .original-price {
    font-size: 12px;
  }
  
  .badge {
    font-size: 10px;
    padding: 5px 9px;
  }
  
  .hover-btn {
    font-size: 12px;
    padding: 9px 14px;
    min-height: 34px;
  }
  
  .btn-icon {
    width: 14px;
    height: 14px;
  }
  
  .quick-action-btn {
    width: 30px;
    height: 30px;
  }
  
  .quick-action-btn .cart-icon {
    width: 15px;
    height: 15px;
  }
}

/* Tablet */
@media (max-width: 1024px) {
  .luxury-product-card {
    aspect-ratio: 2/3;
  }
  
  .text-overlay {
    padding: 14px 10px 10px 10px;
  }
  
  .product-brand {
    font-size: 9px;
  }
  
  .product-name {
    font-size: 12px;
  }
  
  .current-price {
    font-size: 14px;
  }
  
  .original-price {
    font-size: 10px;
  }
  
  .badge {
    font-size: 9px;
    padding: 4px 7px;
  }
  
  .desktop-hover-overlay {
    display: none;
  }
}

/* Mobile - 3 cards per row */
@media (max-width: 768px) {
  .luxury-product-card {
    aspect-ratio: 2/3;
  }
  
  .text-overlay {
    padding: 12px 8px 8px 8px;
  }
  
  .product-brand {
    font-size: 8px;
    letter-spacing: 0.3px;
    margin-bottom: 3px;
  }
  
  .product-name {
    font-size: 11px;
    margin-bottom: 5px;
  }
  
  .current-price {
    font-size: 13px;
  }
  
  .original-price {
    font-size: 9px;
  }
  
  .product-price {
    gap: 6px;
  }
  
  .badge {
    font-size: 8px;
    padding: 3px 6px;
    top: 6px;
    left: 6px;
  }
  
  .quick-action-btn {
    width: 26px;
    height: 26px;
    bottom: 8px;
    right: 8px;
  }
  
  .quick-action-btn .cart-icon {
    width: 13px;
    height: 13px;
  }
  
  .desktop-hover-overlay {
    display: none;
  }
}

/* Small Mobile */
@media (max-width: 640px) {
  .luxury-product-card {
    aspect-ratio: 2/3;
  }
  
  .text-overlay {
    padding: 10px 6px 6px 6px;
  }
  
  .product-brand {
    font-size: 7px;
    margin-bottom: 2px;
  }
  
  .product-name {
    font-size: 10px;
    margin-bottom: 4px;
  }
  
  .current-price {
    font-size: 12px;
  }
  
  .original-price {
    font-size: 8px;
  }
  
  .product-price {
    gap: 5px;
  }
  
  .badge {
    font-size: 7px;
    padding: 3px 5px;
    top: 5px;
    left: 5px;
  }
  
  .quick-action-btn {
    width: 24px;
    height: 24px;
    bottom: 6px;
    right: 6px;
  }
  
  .quick-action-btn .cart-icon {
    width: 12px;
    height: 12px;
  }
}

/* Very Small Mobile */
@media (max-width: 480px) {
  .luxury-product-card {
    aspect-ratio: 2/3;
  }
  
  .text-overlay {
    padding: 8px 5px 5px 5px;
    background: linear-gradient(to top, 
      rgba(0, 0, 0, 0.9) 0%, 
      rgba(0, 0, 0, 0.75) 40%, 
      rgba(0, 0, 0, 0.5) 70%, 
      transparent 100%);
  }
  
  .product-brand {
    font-size: 6px;
  }
  
  .product-name {
    font-size: 9px;
    margin-bottom: 3px;
  }
  
  .current-price {
    font-size: 11px;
  }
  
  .original-price {
    font-size: 7px;
  }
  
  .badge {
    font-size: 6px;
    padding: 2px 4px;
    top: 4px;
    left: 4px;
  }
  
  .quick-action-btn {
    width: 22px;
    height: 22px;
    bottom: 4px;
    right: 4px;
  }
  
  .quick-action-btn .cart-icon {
    width: 11px;
    height: 11px;
  }
}

/* Extra Small - Still 3 cards */
@media (max-width: 360px) {
  .text-overlay {
    padding: 6px 4px 4px 4px;
  }
  
  .product-brand {
    font-size: 5px;
  }
  
  .product-name {
    font-size: 8px;
    margin-bottom: 2px;
  }
  
  .current-price {
    font-size: 10px;
  }
  
  .original-price {
    font-size: 6px;
  }
  
  .badge {
    font-size: 5px;
    padding: 1px 3px;
    top: 3px;
    left: 3px;
  }
  
  .quick-action-btn {
    width: 20px;
    height: 20px;
    bottom: 3px;
    right: 3px;
  }
  
  .quick-action-btn .cart-icon {
    width: 10px;
    height: 10px;
  }
}

/* RTL Support */
[dir="rtl"] .product-badges {
  left: auto;
  right: 10px;
}

[dir="rtl"] .quick-action-btn {
  left: 10px;
  right: auto;
}

[dir="rtl"] .text-content {
  text-align: right;
}

[dir="rtl"] .product-price {
  flex-direction: row-reverse;
}

[dir="rtl"] .hover-buttons-container {
  direction: rtl;
}

[dir="rtl"] .hover-btn {
  flex-direction: row-reverse;
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .luxury-product-card:hover {
    transform: none;
    border-color: #e5e7eb;
  }
  
  .luxury-product-card:active {
    border-color: #d1d5db;
  }
  
  .desktop-hover-overlay {
    display: none;
  }
  
  .quick-action-btn {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Hide desktop hover on tablets and mobiles */
@media (max-width: 1024px) {
  .desktop-hover-overlay {
    display: none;
  }
}
</style>