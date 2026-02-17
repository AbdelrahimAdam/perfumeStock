<template>
  <div 
    class="cart-item group"
    :class="{ 'rtl': isRTL }"
  >
    <!-- Glow Effect -->
    <div class="item-glow"></div>

    <!-- Product Image -->
    <div class="item-image-wrapper">
      <div class="item-image-container">
        <img
          :src="item.imageUrl"
          :alt="item.name[currentLanguage]"
          class="item-image"
          loading="lazy"
        />
        <div class="item-image-overlay"></div>
      </div>
      
      <!-- Quantity Badge -->
      <div class="item-quantity-badge">
        <span class="quantity-text">{{ item.quantity }}</span>
      </div>
    </div>

    <!-- Product Info -->
    <div class="item-info">
      <div class="item-header">
        <h4 class="item-name">{{ item.name[currentLanguage] }}</h4>
        <p class="item-specs">{{ item.size }} • {{ item.concentration || 'Eau de Parfum' }}</p>
      </div>
      
      <!-- Price & Quantity (Desktop) -->
      <div class="item-pricing desktop-only">
        <div class="price-info">
          <span class="total-price">{{ formatPrice(item.price * item.quantity) }}</span>
          <p class="unit-price">{{ $t('each') }}: {{ formatPrice(item.price) }}</p>
        </div>
        
        <!-- Quantity Controls (Desktop) -->
        <div class="quantity-controls desktop-only">
          <button
            @click="decreaseQuantity"
            :disabled="item.quantity <= 1"
            class="quantity-btn"
            :title="$t('decreaseQuantity')"
          >
            <span class="btn-text">−</span>
          </button>
          
          <span class="quantity-value">{{ item.quantity }}</span>
          
          <button
            @click="increaseQuantity"
            class="quantity-btn"
            :title="$t('increaseQuantity')"
          >
            <span class="btn-text">+</span>
          </button>
        </div>
      </div>

      <!-- Mobile Layout -->
      <div class="mobile-pricing mobile-only">
        <div class="mobile-price-row">
          <span class="mobile-label">{{ $t('total') }}:</span>
          <span class="mobile-total">{{ formatPrice(item.price * item.quantity) }}</span>
        </div>
        <div class="mobile-price-row">
          <span class="mobile-label">{{ $t('each') }}:</span>
          <span class="mobile-unit">{{ formatPrice(item.price) }}</span>
        </div>
        
        <!-- Quantity Controls (Mobile) -->
        <div class="mobile-quantity">
          <span class="mobile-label">{{ $t('quantity') }}:</span>
          <div class="quantity-controls">
            <button
              @click="decreaseQuantity"
              :disabled="item.quantity <= 1"
              class="quantity-btn"
              :title="$t('decreaseQuantity')"
            >
              <span class="btn-text">−</span>
            </button>
            
            <span class="quantity-value">{{ item.quantity }}</span>
            
            <button
              @click="increaseQuantity"
              class="quantity-btn"
              :title="$t('increaseQuantity')"
            >
              <span class="btn-text">+</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Remove Button -->
    <button
      @click="removeItem"
      class="item-remove-btn group/remove"
      :class="{ 'rtl': isRTL }"
      :aria-label="$t('removeItem')"
    >
      <svg class="remove-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M6 18L18 6M6 6l12 12"/>
      </svg>
      <!-- Tooltip -->
      <span class="remove-tooltip">{{ $t('remove') }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from '@/types'
import { useLanguageStore } from '@/stores/language'
import { showConfirmation } from '@/utils/notifications'

interface Props {
  item: CartItem
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update-quantity': [id: string, quantity: number]
  'remove': [id: string]
}>()

const languageStore = useLanguageStore()
const { currentLanguage, isRTL, t: $t } = languageStore

// Format price with Egyptian Pound
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price).replace('EGP', 'LE ')
}

const decreaseQuantity = () => {
  const newQuantity = props.item.quantity - 1
  if (newQuantity >= 1) {
    emit('update-quantity', props.item.id, newQuantity)
    showQuickNotification($t('quantityDecreased'))
  }
}

const increaseQuantity = () => {
  const newQuantity = props.item.quantity + 1
  emit('update-quantity', props.item.id, newQuantity)
  showQuickNotification($t('quantityIncreased'))
}

const removeItem = async () => {
  const confirmed = await showConfirmation({
    title: $t('removeItemConfirm'),
    message: $t('removeItemMessage'),
    confirmText: $t('remove'),
    cancelText: $t('keep')
  })
  
  if (confirmed) {
    emit('remove', props.item.id)
    showQuickNotification($t('itemRemoved'))
  }
}

const showQuickNotification = (message: string) => {
  const event = new CustomEvent('show-quick-toast', {
    detail: { message, type: 'info', duration: 1500 }
  })
  window.dispatchEvent(event)
}
</script>

<style scoped>
/* Mobile-First Cart Item Styles */
.cart-item {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background: #0a0a0a;
  border: 1px solid rgba(212, 175, 55, 0.1);
  transition: all 0.5s ease;
  margin-bottom: 1rem;
  overflow: hidden;
}

@media (min-width: 640px) {
  .cart-item {
    flex-direction: row;
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
}

.cart-item:hover {
  border-color: rgba(212, 175, 55, 0.3);
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.15);
}

/* RTL Support */
.cart-item.rtl {
  direction: rtl;
}

/* Glow Effect */
.item-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(212, 175, 55, 0.05), transparent);
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.cart-item:hover .item-glow {
  opacity: 1;
}

/* Product Image */
.item-image-wrapper {
  position: relative;
  flex-shrink: 0;
  margin-bottom: 1rem;
}

@media (min-width: 640px) {
  .item-image-wrapper {
    margin-bottom: 0;
    margin-right: 1.5rem;
  }
  
  .rtl .item-image-wrapper {
    margin-right: 0;
    margin-left: 1.5rem;
  }
}

.item-image-container {
  width: 100%;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  background: linear-gradient(135deg, #1a120b, #0a0a0a);
  border: 1px solid rgba(212, 175, 55, 0.1);
  transition: all 0.5s ease;
}

@media (min-width: 640px) {
  .item-image-container {
    width: 100px;
    height: 100px;
  }
}

.cart-item:hover .item-image-container {
  border-color: rgba(212, 175, 55, 0.3);
}

.item-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.cart-item:hover .item-image {
  transform: scale(1.1);
}

.item-image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.3), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
  pointer-events: none;
}

.cart-item:hover .item-image-overlay {
  opacity: 1;
}

/* Quantity Badge */
.item-quantity-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #d4af37, #b8941f);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.rtl .item-quantity-badge {
  right: auto;
  left: -8px;
}

@media (min-width: 640px) {
  .item-quantity-badge {
    top: -10px;
    right: -10px;
    width: 36px;
    height: 36px;
  }
  
  .rtl .item-quantity-badge {
    right: auto;
    left: -10px;
  }
}

.quantity-text {
  font-size: 0.75rem;
  font-weight: 700;
  color: #0a0a0a;
}

@media (min-width: 640px) {
  .quantity-text {
    font-size: 0.875rem;
  }
}

/* Product Info */
.item-info {
  flex: 1;
  min-width: 0;
}

.item-header {
  margin-bottom: 1rem;
}

@media (min-width: 640px) {
  .item-header {
    margin-bottom: 1.25rem;
  }
}

.item-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #f4e7c1;
  margin-bottom: 0.25rem;
  line-height: 1.3;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@media (min-width: 640px) {
  .item-name {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
  }
}

.cart-item:hover .item-name {
  color: #d4af37;
  transition: color 0.3s;
}

.item-specs {
  font-size: 0.8rem;
  color: rgba(244, 231, 193, 0.5);
  margin: 0;
}

@media (min-width: 640px) {
  .item-specs {
    font-size: 0.875rem;
  }
}

/* Desktop Pricing */
.item-pricing {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.total-price {
  font-size: 1.5rem;
  font-weight: 700;
  color: #d4af37;
  line-height: 1.2;
}

@media (min-width: 640px) {
  .total-price {
    font-size: 1.75rem;
  }
}

.unit-price {
  font-size: 0.75rem;
  color: rgba(244, 231, 193, 0.4);
  margin: 0;
}

@media (min-width: 640px) {
  .unit-price {
    font-size: 0.8rem;
  }
}

/* Quantity Controls */
.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(212, 175, 55, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 9999px;
  padding: 0.25rem;
}

.quantity-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #f4e7c1;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 50%;
  font-size: 0;
}

@media (min-width: 640px) {
  .quantity-btn {
    width: 40px;
    height: 40px;
  }
}

.quantity-btn:hover:not(:disabled) {
  background: rgba(212, 175, 55, 0.15);
  color: #d4af37;
  transform: scale(1.05);
}

.quantity-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.quantity-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.btn-text {
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1;
}

@media (min-width: 640px) {
  .btn-text {
    font-size: 1.4rem;
  }
}

.quantity-value {
  min-width: 30px;
  text-align: center;
  font-weight: 600;
  color: #f4e7c1;
  font-size: 1rem;
}

@media (min-width: 640px) {
  .quantity-value {
    font-size: 1.1rem;
    min-width: 35px;
  }
}

/* Mobile Pricing */
.mobile-pricing {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.mobile-price-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
}

.mobile-label {
  color: rgba(244, 231, 193, 0.6);
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.mobile-total {
  font-size: 1.2rem;
  font-weight: 700;
  color: #d4af37;
}

.mobile-unit {
  color: rgba(244, 231, 193, 0.5);
  font-size: 0.9rem;
}

.mobile-quantity {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
}

/* Remove Button */
.item-remove-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem;
  background: none;
  border: none;
  color: rgba(244, 231, 193, 0.3);
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.rtl .item-remove-btn {
  right: auto;
  left: 1rem;
}

@media (min-width: 640px) {
  .item-remove-btn {
    top: 1.5rem;
    right: 1.5rem;
  }
  
  .rtl .item-remove-btn {
    right: auto;
    left: 1.5rem;
  }
}

.item-remove-btn:hover {
  color: #ef4444;
  transform: scale(1.1);
  background: rgba(239, 68, 68, 0.1);
}

.item-remove-btn:active {
  transform: scale(0.95);
}

.remove-icon {
  width: 16px;
  height: 16px;
}

@media (min-width: 640px) {
  .remove-icon {
    width: 18px;
    height: 18px;
  }
}

/* Remove Tooltip */
.remove-tooltip {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  padding: 0.25rem 0.75rem;
  background: #0a0a0a;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 0.5rem;
  font-size: 0.75rem;
  color: #ef4444;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s;
  pointer-events: none;
  z-index: 20;
}

.rtl .remove-tooltip {
  right: auto;
  left: 0;
}

.group\/remove:hover .remove-tooltip {
  opacity: 1;
  visibility: visible;
  transform: translateY(0.25rem);
}

/* Utility Classes */
.desktop-only {
  display: none;
}

.mobile-only {
  display: block;
}

@media (min-width: 640px) {
  .desktop-only {
    display: flex;
  }
  
  .mobile-only {
    display: none;
  }
}

/* Touch Optimizations */
@media (max-width: 639px) {
  .quantity-btn {
    width: 44px;
    height: 44px;
  }
  
  .btn-text {
    font-size: 1.5rem;
  }
  
  .item-remove-btn {
    padding: 0.75rem;
  }
  
  .remove-icon {
    width: 20px;
    height: 20px;
  }
}

/* Dark Mode Support */
.dark-mode .cart-item {
  background: #1a1a1a;
}

.dark-mode .item-image-container {
  background: linear-gradient(135deg, #2a2a2a, #1a1a1a);
}

/* Egyptian Pound Symbol */
.total-price::before,
.mobile-total::before,
.mobile-unit::before,
.unit-price::before {
  content: 'LE ';
  font-weight: inherit;
}
</style>