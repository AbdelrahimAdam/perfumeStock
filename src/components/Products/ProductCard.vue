<template>
  <div class="luxury-product-card">
    <div class="product-image-container">
      <img 
        :src="product.imageUrl" 
        :alt="product.name"
        class="product-image"
        loading="lazy"
      />
      
      <!-- Overlay Actions -->
      <div class="product-overlay">
        <div class="overlay-content">
          <button 
            @click="$emit('view-details')"
            class="overlay-btn quick-view-btn"
          >
            Quick View
          </button>
          <button 
            @click="$emit('add-to-cart')"
            class="overlay-btn add-to-cart-btn"
          >
            Add to Cart
          </button>
        </div>
      </div>
      
      <!-- Badges -->
      <div class="product-badges">
        <span v-if="product.isBestSeller" class="badge best-seller">BEST SELLER</span>
        <span v-if="isNewArrival" class="badge new-arrival">NEW</span>
        <span v-if="product.discount" class="badge discount">-{{ product.discount }}%</span>
      </div>
    </div>

    <div class="product-info">
      <!-- Brand -->
      <div class="product-brand">{{ product.brand }}</div>
      
      <!-- Name -->
      <h3 class="product-name">{{ product.name }}</h3>
      
      <!-- Description -->
      <p class="product-description">{{ product.description }}</p>
      
      <!-- Price -->
      <div class="product-price">
        <span class="current-price">${{ product.price }}</span>
        <span v-if="product.originalPrice" class="original-price">${{ product.originalPrice }}</span>
      </div>
      
      <!-- Rating -->
      <div class="product-rating">
        <div class="stars">
          <span v-for="n in 5" :key="n" class="star" :class="{ filled: n <= Math.round(product.rating) }">
            ★
          </span>
        </div>
        <span class="rating-count">({{ product.reviewCount }})</span>
      </div>
      
      <!-- Quick Add -->
      <button 
        @click="$emit('add-to-cart')"
        class="quick-add-btn"
      >
        Add to Cart
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@/types'

interface Props {
  product: Product
}

const props = defineProps<Props>()
defineEmits<{
  'view-details': []
  'add-to-cart': []
}>()

const isNewArrival = computed(() => {
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  return props.product.createdAt?.toDate() > oneMonthAgo
})
</script>

<style scoped>
.luxury-product-card {
  background: #ffffff;
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
}

.luxury-product-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.product-image-container {
  position: relative;
  height: 300px;
  overflow: hidden;
  background: linear-gradient(135deg, #f9f7f3 0%, #f0eee9 100%);
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 2rem;
  transition: transform 0.6s ease;
}

.luxury-product-card:hover .product-image {
  transform: scale(1.05);
}

.product-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(10, 10, 10, 0.7) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 2rem;
}

.luxury-product-card:hover .product-overlay {
  opacity: 1;
}

.overlay-content {
  display: flex;
  gap: 0.5rem;
  transform: translateY(20px);
  transition: transform 0.3s ease;
}

.luxury-product-card:hover .overlay-content {
  transform: translateY(0);
}

.overlay-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-view-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #0a0a0a;
}

.quick-view-btn:hover {
  background: white;
  transform: translateY(-2px);
}

.add-to-cart-btn {
  background: #d4af37;
  color: #0a0a0a;
}

.add-to-cart-btn:hover {
  background: #c19b2a;
  transform: translateY(-2px);
}

.product-badges {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.best-seller {
  background: #d4af37;
  color: #0a0a0a;
}

.new-arrival {
  background: #10b981;
  color: white;
}

.discount {
  background: #ef4444;
  color: white;
}

.product-info {
  padding: 1.5rem;
}

.product-brand {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
}

.product-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: #0a0a0a;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.product-description {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #666;
  line-height: 1.5;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.current-price {
  font-family: 'Inter', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0a0a0a;
}

.original-price {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.stars {
  display: flex;
  gap: 0.1rem;
}

.star {
  color: #ddd;
  font-size: 0.9rem;
}

.star.filled {
  color: #d4af37;
}

.rating-count {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #666;
}

.quick-add-btn {
  width: 100%;
  padding: 0.75rem;
  background: #0a0a0a;
  color: #d4af37;
  border: none;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.quick-add-btn:hover {
  background: #d4af37;
  color: #0a0a0a;
  transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
  .product-image-container {
    height: 250px;
  }
  
  .product-name {
    font-size: 1.3rem;
  }
  
  .overlay-content {
    flex-direction: column;
    width: 80%;
  }
  
  .overlay-btn {
    width: 100%;
  }
}
</style>