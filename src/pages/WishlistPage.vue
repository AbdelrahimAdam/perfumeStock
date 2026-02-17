<!-- src/pages/WishlistPage.vue -->
<template>
  <div class="wishlist-page" :class="{ 'rtl': isRTL }">
    <SEOHead 
      :title="t('My Wishlist')"
      :description="t('Save your favorite perfumes for later')"
    />

    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">{{ t('My Wishlist') }}</h1>
        <p class="page-subtitle">{{ t('Save your favorite perfumes for later') }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="wishlistStore.isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>{{ t('Loading your wishlist...') }}</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="wishlistStore.items.length === 0" class="empty-wishlist">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
          </svg>
        </div>
        <h2>{{ t('Your wishlist is empty') }}</h2>
        <p>{{ t('Add perfumes you love to your wishlist') }}</p>
        <div class="empty-actions">
          <router-link to="/shop" class="shop-link primary">
            {{ t('Browse Perfumes') }}
          </router-link>
        </div>
      </div>

      <!-- Wishlist Content -->
      <div v-else class="wishlist-content">
        <!-- Wishlist Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">{{ t('Total Items') }}</span>
            <span class="stat-value">{{ wishlistStore.totalItems }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">{{ t('Total Value') }}</span>
            <span class="stat-value price">{{ formatPrice(wishlistStore.totalValue) }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">{{ t('In Stock') }}</span>
            <span class="stat-value in-stock">{{ wishlistStore.inStockCount }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">{{ t('Low Stock') }}</span>
            <span class="stat-value low-stock">{{ wishlistStore.lowStockCount }}</span>
          </div>
        </div>

        <!-- Action Bar -->
        <div class="action-bar">
          <div class="action-left">
            <div class="select-all">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  v-model="selectAll"
                  @change="toggleSelectAll"
                  class="checkbox"
                />
                <span>{{ t('Select All') }}</span>
              </label>
            </div>

            <div v-if="wishlistStore.selectedItems.length > 0" class="selected-actions">
              <span class="selected-count">
                {{ wishlistStore.selectedItems.length }} {{ t('selected') }}
              </span>
              <button
                @click="moveSelectedToCart"
                class="action-btn primary"
                :disabled="cartStore.isLoading"
              >
                {{ t('Add to Cart') }}
              </button>
              <button
                @click="removeSelected"
                class="action-btn danger"
              >
                {{ t('Remove') }}
              </button>
            </div>
          </div>

          <div class="sort-options">
            <label class="sort-label">{{ t('Sort by:') }}</label>
            <select
              v-model="sortBy"
              class="sort-select"
            >
              <option value="dateAdded">{{ t('Date Added') }}</option>
              <option value="priceLow">{{ t('Price: Low to High') }}</option>
              <option value="priceHigh">{{ t('Price: High to Low') }}</option>
              <option value="name">{{ t('Name A-Z') }}</option>
              <option value="brand">{{ t('Brand') }}</option>
            </select>
          </div>
        </div>

        <!-- Wishlist Grid -->
        <div class="wishlist-grid">
          <div
            v-for="item in sortedItems"
            :key="item.id"
            class="wishlist-card"
          >
            <!-- Product Image -->
            <div class="card-image">
              <router-link :to="`/product/${item.slug}`">
                <img
                  :src="item.imageUrl"
                  :alt="item.name[currentLanguage]"
                  class="product-image"
                  loading="lazy"
                  @error="handleImageError"
                />
              </router-link>
              
              <!-- Remove Button -->
              <button
                @click="wishlistStore.removeFromWishlist(item.id)"
                class="remove-btn"
                :title="t('Remove from wishlist')"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>

              <!-- Stock Status -->
              <div v-if="item.stockStatus" class="stock-badge" :class="item.stockStatus">
                {{ getStockText(item.stockStatus) }}
              </div>

              <!-- Select Checkbox -->
              <div class="select-checkbox">
                <input
                  type="checkbox"
                  :id="`select-${item.id}`"
                  v-model="wishlistStore.selectedItems"
                  :value="item.id"
                  class="checkbox"
                />
              </div>
            </div>

            <!-- Product Info -->
            <div class="card-content">
              <div class="card-header">
                <div>
                  <router-link 
                    :to="`/product/${item.slug}`"
                    class="product-name"
                  >
                    {{ item.name[currentLanguage] }}
                  </router-link>
                  <p class="product-brand">{{ item.brand }}</p>
                  <p class="product-specs">{{ item.size }} • {{ item.concentration }}</p>
                </div>
                
                <button
                  @click="toggleNotes(item.id)"
                  class="info-btn"
                  :title="t('View notes')"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </button>
              </div>

              <!-- Price -->
              <div class="price-section">
                <div>
                  <span class="current-price">{{ formatPrice(item.price) }}</span>
                  <span v-if="item.originalPrice && item.originalPrice > item.price" class="original-price">
                    {{ formatPrice(item.originalPrice) }}
                  </span>
                </div>
                
                <!-- Add to Cart Button -->
                <button
                  @click="addToCart(item)"
                  :disabled="item.stockStatus === 'out_of_stock' || cartStore.isLoading"
                  class="add-to-cart-btn"
                  :class="{ 'disabled': item.stockStatus === 'out_of_stock' }"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  <span v-if="!cartStore.isLoading">{{ t('Add to Cart') }}</span>
                  <span v-else class="loader-sm"></span>
                </button>
              </div>

              <!-- Fragrance Notes (Collapsible) -->
              <div v-if="expandedItems.includes(item.id)" class="notes-section">
                <h4>{{ t('Fragrance Notes') }}</h4>
                <div class="notes-list">
                  <div v-if="item.notes?.top?.length" class="note-group">
                    <span class="note-label">{{ t('Top') }}:</span>
                    <span>{{ item.notes.top.join(', ') }}</span>
                  </div>
                  <div v-if="item.notes?.heart?.length" class="note-group">
                    <span class="note-label">{{ t('Heart') }}:</span>
                    <span>{{ item.notes.heart.join(', ') }}</span>
                  </div>
                  <div v-if="item.notes?.base?.length" class="note-group">
                    <span class="note-label">{{ t('Base') }}:</span>
                    <span>{{ item.notes.base.join(', ') }}</span>
                  </div>
                </div>
              </div>

              <!-- Date Added -->
              <div class="date-added">
                {{ t('Added on') }} {{ formatDate(item.dateAdded) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Share Wishlist -->
        <div class="share-section">
          <div class="share-content">
            <h3>{{ t('Share Your Wishlist') }}</h3>
            <p>{{ t('Let friends and family know what you love') }}</p>
          </div>
          <div class="share-actions">
            <button
              @click="shareWishlist"
              class="share-btn primary"
              :disabled="!authStore.isAuthenticated"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
              </svg>
              {{ t('Share') }}
            </button>
            <button
              @click="printWishlist"
              class="share-btn secondary"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
              </svg>
              {{ t('Print') }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Share Modal -->
    <div v-if="showShareModal" class="modal-overlay" @click="showShareModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ t('Share Wishlist') }}</h2>
          <button @click="showShareModal = false" class="modal-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <!-- Share Link -->
          <div class="share-link-section">
            <label>{{ t('Shareable Link') }}</label>
            <div class="link-input-group">
              <input
                type="text"
                readonly
                :value="shareableLink"
                class="link-input"
              />
              <button
                @click="copyLink"
                class="copy-btn"
              >
                {{ copied ? t('Copied!') : t('Copy') }}
              </button>
            </div>
            <p class="link-hint">{{ t('Anyone with this link can view your wishlist') }}</p>
          </div>

          <!-- Privacy Settings -->
          <div class="privacy-section">
            <h4>{{ t('Privacy Settings') }}</h4>
            <p>{{ t('Control who can see your wishlist') }}</p>
            <select
              v-model="privacySetting"
              @change="updatePrivacy"
              class="privacy-select"
            >
              <option value="private">{{ t('Private (Only Me)') }}</option>
              <option value="shared">{{ t('Shared with Link') }}</option>
              <option value="public">{{ t('Public') }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { useWishlistStore } from '@/stores/wishlist'
import { useProductsStore } from '@/stores/products'
import SEOHead from '@/components/UI/SEOHead.vue'
import { showNotification } from '@/utils/notifications'

const router = useRouter()
const languageStore = useLanguageStore()
const authStore = useAuthStore()
const cartStore = useCartStore()
const wishlistStore = useWishlistStore()
const productsStore = useProductsStore()

const { currentLanguage, isRTL, t } = languageStore

// Local state
const expandedItems = ref<string[]>([])
const selectAll = ref(false)
const sortBy = ref('dateAdded')
const showShareModal = ref(false)
const shareableLink = ref('')
const privacySetting = ref(wishlistStore.privacySetting)
const copied = ref(false)
let copyTimeout: NodeJS.Timeout | null = null

// Computed
const sortedItems = computed(() => {
  const items = [...wishlistStore.items]
  
  switch (sortBy.value) {
    case 'priceLow':
      return items.sort((a, b) => a.price - b.price)
    case 'priceHigh':
      return items.sort((a, b) => b.price - a.price)
    case 'name':
      return items.sort((a, b) => a.name[currentLanguage.value].localeCompare(b.name[currentLanguage.value]))
    case 'brand':
      return items.sort((a, b) => a.brand.localeCompare(b.brand))
    case 'dateAdded':
    default:
      return items.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime())
  }
})

// Methods
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-EG', {
    style: 'currency',
    currency: 'EGP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price).replace('EGP', 'LE ')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString(currentLanguage.value === 'ar' ? 'ar-EG' : 'en-EG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/images/default-product.jpg'
}

const getStockText = (status: string) => {
  const texts: Record<string, string> = {
    in_stock: t('In Stock'),
    low_stock: t('Low Stock'),
    out_of_stock: t('Out of Stock')
  }
  return texts[status] || status
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    wishlistStore.selectedItems = wishlistStore.items.map(item => item.id)
  } else {
    wishlistStore.selectedItems = []
  }
}

const toggleNotes = (itemId: string) => {
  const index = expandedItems.value.indexOf(itemId)
  if (index > -1) {
    expandedItems.value.splice(index, 1)
  } else {
    expandedItems.value.push(itemId)
  }
}

const addToCart = (item: any) => {
  if (item.stockStatus === 'out_of_stock') return

  // Fetch full product details from products store
  const fullProduct = productsStore.products.find(p => p.id === item.id)
  
  if (fullProduct) {
    cartStore.addToCart(fullProduct, 1)
    
    showNotification({
      title: t('Added to Cart'),
      message: `${item.name[currentLanguage.value]} ${t('added to cart')}`,
      type: 'success'
    })
  }
}

const moveSelectedToCart = () => {
  wishlistStore.selectedItems.forEach(itemId => {
    const item = wishlistStore.items.find(i => i.id === itemId)
    if (item && item.stockStatus !== 'out_of_stock') {
      addToCart(item)
    }
  })
  
  // Clear selection after moving
  wishlistStore.selectedItems = []
  selectAll.value = false
  
  showNotification({
    title: t('Items Added'),
    message: t('Selected items added to cart'),
    type: 'success'
  })
}

const removeSelected = () => {
  wishlistStore.removeSelected()
  selectAll.value = false
  
  showNotification({
    title: t('Items Removed'),
    message: t('Selected items removed from wishlist'),
    type: 'success'
  })
}

const shareWishlist = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login?redirect=/wishlist')
    return
  }
  
  try {
    shareableLink.value = await wishlistStore.generateShareableLink(authStore.user?.id || '')
    showShareModal.value = true
  } catch (error) {
    console.error('Error generating shareable link:', error)
    showNotification({
      title: t('Error'),
      message: t('Failed to generate shareable link'),
      type: 'error'
    })
  }
}

const printWishlist = () => {
  window.print()
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(shareableLink.value)
    copied.value = true
    
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => {
      copied.value = false
    }, 2000)
    
    showNotification({
      title: t('Copied!'),
      message: t('Link copied to clipboard'),
      type: 'success'
    })
  } catch (err) {
    console.error('Failed to copy link:', err)
    showNotification({
      title: t('Error'),
      message: t('Failed to copy link'),
      type: 'error'
    })
  }
}

const updatePrivacy = async () => {
  try {
    await wishlistStore.updatePrivacySetting(privacySetting.value as any)
    showNotification({
      title: t('Privacy Updated'),
      message: t('Your wishlist privacy settings have been updated'),
      type: 'success'
    })
  } catch (error) {
    console.error('Error updating privacy:', error)
    showNotification({
      title: t('Error'),
      message: t('Failed to update privacy settings'),
      type: 'error'
    })
  }
}

// Watch for changes in selected items
watch(() => wishlistStore.selectedItems, (newVal) => {
  selectAll.value = newVal.length === wishlistStore.items.length && wishlistStore.items.length > 0
}, { deep: true })

// Lifecycle
onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login?redirect=/wishlist')
    return
  }
  
  try {
    // Load wishlist from Firebase
    await wishlistStore.loadWishlist()
    
    // Load products if needed for stock status updates
    if (productsStore.products.length === 0) {
      await productsStore.fetchProducts()
    }
    
    // Update stock status based on current product data
    await wishlistStore.updateStockStatus()
  } catch (error) {
    console.error('Error loading wishlist:', error)
    showNotification({
      title: t('Error'),
      message: t('Failed to load wishlist'),
      type: 'error'
    })
  }
})

onUnmounted(() => {
  if (copyTimeout) clearTimeout(copyTimeout)
})
</script>

<style scoped>
.wishlist-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff 0%, #f8f5f0 100%);
  padding: 2rem 1rem;
  padding-top: calc(80px + 2rem);
}

.wishlist-page.rtl {
  direction: rtl;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 400;
  color: #1a120b;
  letter-spacing: 2px;
  font-family: 'Georgia', 'Times New Roman', serif;
  margin-bottom: 0.5rem;
  position: relative;
  display: inline-block;
}

.page-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: linear-gradient(90deg, #ec4899, #db2777);
}

.page-subtitle {
  color: rgba(26, 18, 11, 0.7);
  font-size: 1.1rem;
  margin-top: 1rem;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(236, 72, 153, 0.2);
  border-top-color: #ec4899;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loader-sm {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

/* Empty State */
.empty-wishlist {
  text-align: center;
  padding: 4rem 2rem;
  background: #ffffff;
  border: 1px solid rgba(236, 72, 153, 0.15);
  max-width: 500px;
  margin: 2rem auto;
}

.empty-icon {
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  color: rgba(236, 72, 153, 0.3);
}

.empty-wishlist h2 {
  font-size: 1.8rem;
  font-weight: 400;
  color: #1a120b;
  margin-bottom: 1rem;
}

.empty-wishlist p {
  color: rgba(26, 18, 11, 0.7);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.empty-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.shop-link {
  display: inline-block;
  padding: 1rem 2rem;
  font-weight: 600;
  letter-spacing: 1px;
  transition: all 0.3s;
  text-decoration: none;
  text-transform: uppercase;
}

.shop-link.primary {
  background: #ec4899;
  color: white;
  border: 1px solid #ec4899;
}

.shop-link.primary:hover {
  background: #db2777;
  border-color: #db2777;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(236, 72, 153, 0.3);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-card {
  background: #ffffff;
  border: 1px solid rgba(236, 72, 153, 0.15);
  padding: 1.5rem;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.85rem;
  color: rgba(26, 18, 11, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
}

.stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 600;
  color: #1a120b;
}

.stat-value.price {
  color: #ec4899;
}

.stat-value.in-stock {
  color: #10b981;
}

.stat-value.low-stock {
  color: #f59e0b;
}

/* Action Bar */
.action-bar {
  background: #ffffff;
  border: 1px solid rgba(236, 72, 153, 0.15);
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.action-left {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.select-all {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: rgba(26, 18, 11, 0.7);
  font-size: 0.95rem;
}

.checkbox {
  width: 18px;
  height: 18px;
  accent-color: #ec4899;
}

.selected-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.selected-count {
  font-size: 0.9rem;
  color: rgba(26, 18, 11, 0.6);
}

.action-btn {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-btn.primary {
  background: #ec4899;
  color: white;
}

.action-btn.primary:hover:not(:disabled) {
  background: #db2777;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.action-btn.danger {
  background: #ef4444;
  color: white;
}

.action-btn.danger:hover {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-label {
  font-size: 0.85rem;
  color: rgba(26, 18, 11, 0.6);
}

.sort-select {
  padding: 0.5rem 2rem 0.5rem 0.5rem;
  border: 1px solid rgba(236, 72, 153, 0.2);
  background: white;
  font-size: 0.85rem;
  color: #1a120b;
  cursor: pointer;
}

/* Wishlist Grid */
.wishlist-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.wishlist-card {
  background: #ffffff;
  border: 1px solid rgba(236, 72, 153, 0.15);
  transition: all 0.3s;
  overflow: hidden;
}

.wishlist-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(236, 72, 153, 0.15);
}

.card-image {
  position: relative;
  aspect-ratio: 1;
  overflow: hidden;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.wishlist-card:hover .product-image {
  transform: scale(1.05);
}

.remove-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  color: #ef4444;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.remove-btn:hover {
  background: #ef4444;
  color: white;
  transform: scale(1.1);
}

.remove-btn svg {
  width: 18px;
  height: 18px;
}

.stock-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-radius: 4px;
}

.stock-badge.in_stock {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.stock-badge.low_stock {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.stock-badge.out_of_stock {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.select-checkbox {
  position: absolute;
  top: 1rem;
  left: 4rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-content {
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1a120b;
  text-decoration: none;
  display: block;
  margin-bottom: 0.25rem;
}

.product-name:hover {
  color: #ec4899;
}

.product-brand {
  font-size: 0.85rem;
  color: rgba(26, 18, 11, 0.6);
  margin-bottom: 0.25rem;
}

.product-specs {
  font-size: 0.8rem;
  color: rgba(26, 18, 11, 0.5);
}

.info-btn {
  background: none;
  border: none;
  color: rgba(26, 18, 11, 0.4);
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s;
}

.info-btn:hover {
  color: #ec4899;
}

.info-btn svg {
  width: 20px;
  height: 20px;
}

.price-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.current-price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ec4899;
}

.original-price {
  font-size: 0.85rem;
  color: rgba(26, 18, 11, 0.4);
  text-decoration: line-through;
  margin-left: 0.5rem;
}

.add-to-cart-btn {
  background: #ec4899;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.add-to-cart-btn:hover:not(.disabled) {
  background: #db2777;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.add-to-cart-btn.disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

.add-to-cart-btn svg {
  width: 16px;
  height: 16px;
}

/* Notes Section */
.notes-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(236, 72, 153, 0.1);
}

.notes-section h4 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a120b;
  margin-bottom: 0.75rem;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.note-group {
  font-size: 0.8rem;
  color: rgba(26, 18, 11, 0.7);
}

.note-label {
  font-weight: 600;
  color: #ec4899;
  margin-right: 0.5rem;
}

.rtl .note-label {
  margin-right: 0;
  margin-left: 0.5rem;
}

/* Date Added */
.date-added {
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(236, 72, 153, 0.1);
  font-size: 0.7rem;
  color: rgba(26, 18, 11, 0.4);
  text-align: right;
}

.rtl .date-added {
  text-align: left;
}

/* Share Section */
.share-section {
  background: #ffffff;
  border: 1px solid rgba(236, 72, 153, 0.15);
  padding: 2rem;
  margin-top: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.share-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a120b;
  margin-bottom: 0.5rem;
}

.share-content p {
  color: rgba(26, 18, 11, 0.6);
  font-size: 0.9rem;
}

.share-actions {
  display: flex;
  gap: 1rem;
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
  font-weight: 500;
}

.share-btn.primary {
  background: #ec4899;
  color: white;
}

.share-btn.primary:hover:not(:disabled) {
  background: #db2777;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.share-btn.secondary {
  background: white;
  color: #1a120b;
  border: 1px solid rgba(236, 72, 153, 0.3);
}

.share-btn.secondary:hover {
  border-color: #ec4899;
  color: #ec4899;
  transform: translateY(-2px);
}

.share-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.share-btn svg {
  width: 18px;
  height: 18px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: #ffffff;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(236, 72, 153, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(236, 72, 153, 0.1);
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a120b;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: rgba(26, 18, 11, 0.4);
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s;
}

.modal-close:hover {
  color: #ec4899;
  transform: rotate(90deg);
}

.modal-close svg {
  width: 20px;
  height: 20px;
}

.modal-body {
  padding: 1.5rem;
}

/* Share Link Section */
.share-link-section {
  margin-bottom: 2rem;
}

.share-link-section label {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #1a120b;
  margin-bottom: 0.5rem;
}

.link-input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.link-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid rgba(236, 72, 153, 0.2);
  font-size: 0.85rem;
  color: #1a120b;
  background: rgba(236, 72, 153, 0.05);
}

.copy-btn {
  padding: 0.75rem 1.5rem;
  background: #ec4899;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.copy-btn:hover {
  background: #db2777;
}

.link-hint {
  font-size: 0.75rem;
  color: rgba(26, 18, 11, 0.5);
}

/* Privacy Section */
.privacy-section {
  border-top: 1px solid rgba(236, 72, 153, 0.1);
  padding-top: 1.5rem;
}

.privacy-section h4 {
  font-size: 1rem;
  font-weight: 600;
  color: #1a120b;
  margin-bottom: 0.25rem;
}

.privacy-section p {
  font-size: 0.8rem;
  color: rgba(26, 18, 11, 0.6);
  margin-bottom: 1rem;
}

.privacy-select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(236, 72, 153, 0.2);
  font-size: 0.9rem;
  color: #1a120b;
  background: white;
  cursor: pointer;
}

/* Responsive */
@media (max-width: 768px) {
  .wishlist-page {
    padding: 1rem;
    padding-top: calc(60px + 1rem);
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .wishlist-grid {
    grid-template-columns: 1fr;
  }
  
  .share-section {
    flex-direction: column;
    text-align: center;
  }
  
  .action-bar {
    flex-direction: column;
    align-items: stretch;
  }
  
  .action-left {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .selected-actions {
    flex-wrap: wrap;
  }
  
  .sort-options {
    justify-content: space-between;
  }
  
  .modal-content {
    width: 95%;
    margin: 1rem;
  }
}

@media (max-width: 480px) {
  .empty-icon {
    width: 80px;
    height: 80px;
  }
  
  .empty-wishlist h2 {
    font-size: 1.5rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-value {
    font-size: 1.5rem;
  }
}

/* RTL Support */
.rtl .select-checkbox {
  left: auto;
  right: 4rem;
}

.rtl .stock-badge {
  left: auto;
  right: 1rem;
}

.rtl .remove-btn {
  right: auto;
  left: 1rem;
}

.rtl .action-btn svg,
.rtl .share-btn svg {
  margin-left: 0.5rem;
  margin-right: 0;
}

/* Print Styles */
@media print {
  .action-bar,
  .share-section,
  .remove-btn,
  .select-checkbox,
  .add-to-cart-btn,
  .info-btn {
    display: none !important;
  }
  
  .wishlist-page {
    background: white;
    padding: 1rem;
  }
  
  .wishlist-card {
    break-inside: avoid;
    page-break-inside: avoid;
    border: 1px solid #ddd;
  }
}
</style>