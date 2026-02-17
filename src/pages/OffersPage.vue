<!-- src/pages/OffersPage.vue -->
<template>
  <div class="offers-page" :class="{ 'dark-mode': isDarkMode }">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1 class="page-title">{{ t('specialOffers') || 'Special Offers' }}</h1>
        <p class="page-subtitle">{{ t('exclusiveDeals') || 'Exclusive deals on luxury perfumes' }}</p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>{{ t('loadingOffers') || 'Loading offers...' }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p class="error-message">{{ error }}</p>
        <button @click="loadOffers" class="retry-btn">{{ t('retry') || 'Retry' }}</button>
      </div>

      <!-- No Offers -->
      <div v-else-if="offers.length === 0" class="no-offers">
        <div class="no-offers-icon">🎁</div>
        <h2>{{ t('noOffersAvailable') || 'No Offers Available' }}</h2>
        <p>{{ t('checkBackLater') || 'Please check back later for new offers' }}</p>
        <router-link to="/shop" class="shop-link">{{ t('continueShopping') || 'Continue Shopping' }}</router-link>
      </div>

      <!-- Offers Grid -->
      <div v-else class="offers-grid">
        <div
          v-for="offer in offers"
          :key="offer.id"
          class="offer-card"
          @click="navigateToOffer(offer)"
        >
          <div class="offer-image-wrapper">
            <img
              :src="offer.imageUrl || '/images/default-offer.jpg'"
              :alt="offer.title"
              class="offer-image"
              @error="handleImageError"
            />
            <div class="offer-badge">{{ t('limited') || 'Limited' }}</div>
          </div>
          
          <div class="offer-content">
            <h3 class="offer-title">{{ offer.title }}</h3>
            <p class="offer-subtitle">{{ offer.subtitle }}</p>
            
            <div class="offer-pricing">
              <span class="old-price">{{ formatPrice(offer.oldPrice) }}</span>
              <span class="new-price">{{ formatPrice(offer.newPrice) }}</span>
            </div>
            
            <div class="offer-type" v-if="offer.offerType">
              {{ getOfferTypeLabel(offer.offerType) }}
            </div>
            
            <div class="offer-validity" v-if="offer.endDate">
              <span class="validity-icon">⏳</span>
              {{ t('validUntil') || 'Valid until' }}: {{ formatDate(offer.endDate) }}
            </div>
            
            <button class="view-offer-btn">
              {{ t('viewOffer') || 'View Offer' }} →
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useHomepageStore } from '@/stores/homepage'
import { useOffersStore } from '@/stores/offers'

const router = useRouter()
const languageStore = useLanguageStore()
const homepageStore = useHomepageStore()
const offersStore = useOffersStore()
const { t, formatDate } = languageStore

// =================== UTILITY FUNCTIONS ===================
const formatPrice = (price: number): string => {
  try {
    return new Intl.NumberFormat('en-EG', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price || 0)
  } catch (err) {
    return String(price || 0)
  }
}

// =================== STATE ===================
const isLoading = ref(false)
const error = ref<string | null>(null)

// =================== COMPUTED ===================
const isDarkMode = computed(() => homepageStore.homepageData?.settings?.isDarkMode || false)

const offers = computed(() => {
  // Try offers store first, then fallback to homepage
  if (offersStore.offers.length > 0) {
    return offersStore.offers
  }
  return homepageStore.homepageData?.activeOffers || []
})

// =================== METHODS ===================
const loadOffers = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    await Promise.all([
      homepageStore.loadHomepageData(),
      offersStore.loadOffers(true)
    ])
  } catch (err: any) {
    error.value = err.message || 'Failed to load offers'
  } finally {
    isLoading.value = false
  }
}

const navigateToOffer = (offer: any) => {
  if (!offer) return
  
  if (offer.slug) {
    router.push(`/offer/${offer.slug}`)
  } else if (offer.id) {
    router.push(`/offer/${offer.id}`)
  }
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/images/default-offer.jpg'
}

const getOfferTypeLabel = (type: string): string => {
  const types: Record<string, string> = {
    percentage: t('percentageDiscount') || '% Off',
    fixed: t('fixedAmount') || 'Fixed Amount',
    bundle: t('bundleOffer') || 'Bundle',
    'free-shipping': t('freeShipping') || 'Free Shipping',
    'buy-one-get-one': t('buyOneGetOne') || 'BOGO'
  }
  return types[type] || type
}

// =================== LIFECYCLE ===================
onMounted(() => {
  loadOffers()
})
</script>

<style scoped>
.offers-page {
  min-height: 100vh;
  background: var(--bg-primary, #f8f5f0);
  padding: 3rem 1rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 400;
  color: var(--text-primary, #1a120b);
  letter-spacing: 2px;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary, rgba(26,18,11,0.7));
  font-style: italic;
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
  border: 3px solid rgba(212, 175, 55, 0.2);
  border-top-color: #d4af37;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Error State */
.error-state {
  text-align: center;
  padding: 3rem;
}

.error-message {
  color: #e53e3e;
  margin-bottom: 1rem;
}

.retry-btn {
  background: #d4af37;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
}

/* No Offers */
.no-offers {
  text-align: center;
  padding: 4rem 2rem;
  background: var(--bg-secondary, #ffffff);
  border: 1px solid var(--border-color, rgba(212,175,55,0.15));
}

.no-offers-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.no-offers h2 {
  font-size: 1.8rem;
  font-weight: 400;
  color: var(--text-primary, #1a120b);
  margin-bottom: 0.5rem;
}

.no-offers p {
  color: var(--text-secondary, rgba(26,18,11,0.7));
  margin-bottom: 2rem;
}

.shop-link {
  display: inline-block;
  background: #d4af37;
  color: white;
  text-decoration: none;
  padding: 0.75rem 2rem;
  transition: background 0.3s;
}

.shop-link:hover {
  background: #b8941f;
}

/* Offers Grid */
.offers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.offer-card {
  background: var(--bg-secondary, #ffffff);
  border: 1px solid var(--border-color, rgba(212,175,55,0.15));
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
}

.offer-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 30px rgba(212,175,55,0.15);
}

.offer-image-wrapper {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.offer-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.offer-card:hover .offer-image {
  transform: scale(1.05);
}

.offer-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: linear-gradient(135deg, #c41e3a, #e63946);
  color: white;
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
}

.offer-content {
  padding: 1.5rem;
}

.offer-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-primary, #1a120b);
  margin-bottom: 0.25rem;
}

.offer-subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary, rgba(26,18,11,0.7));
  margin-bottom: 1rem;
  font-style: italic;
}

.offer-pricing {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.old-price {
  font-size: 1rem;
  color: var(--text-tertiary, rgba(26,18,11,0.5));
  text-decoration: line-through;
}

.new-price {
  font-size: 1.5rem;
  color: #d4af37;
  font-weight: 700;
}

.offer-type {
  display: inline-block;
  background: var(--gold-primary, #d4af37);
  color: white;
  padding: 0.2rem 0.6rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

.offer-validity {
  font-size: 0.85rem;
  color: var(--text-secondary, rgba(26,18,11,0.6));
  display: flex;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 1rem;
}

.validity-icon {
  font-size: 1rem;
}

.view-offer-btn {
  width: 100%;
  background: transparent;
  color: #d4af37;
  border: 1px solid #d4af37;
  padding: 0.6rem;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
}

.view-offer-btn:hover {
  background: #d4af37;
  color: white;
}

/* Dark Mode */
.dark-mode .offer-card {
  background: #1a1a1a;
}

.dark-mode .offer-title,
.dark-mode .no-offers h2 {
  color: #f5f5f5;
}

.dark-mode .offer-subtitle {
  color: rgba(245,245,245,0.7);
}

.dark-mode .old-price {
  color: rgba(245,245,245,0.5);
}

/* Responsive */
@media (max-width: 768px) {
  .offers-grid {
    grid-template-columns: 1fr;
  }
  
  .page-title {
    font-size: 2rem;
  }
}
</style>