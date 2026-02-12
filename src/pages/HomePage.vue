<!-- src/pages/HomePage.vue - CLEAN BANNER, JUST SHOP NOW BUTTON -->
<template>
  <div class="luxury-perfume-homepage" :class="{ 'dark-mode': isDarkMode, 'rtl-direction': isRTL, 'ltr-direction': !isRTL }">
    <!-- Loading Spinner -->
    <div v-if="homepageStore.isLoading || brandsStore.isLoading" class="loading-overlay">
      <div class="luxury-spinner">
        <div class="spinner-gold-ring"></div>
        <div class="spinner-glow"></div>
        <div class="spinner-diamond">◆</div>
      </div>
    </div>

    <!-- Debug Panel (Development Only) -->
    <div v-if="isDevelopment" class="debug-panel">
      <details>
        <summary>📊 Store Debug</summary>
        <div class="debug-info">
          <div><strong>Status:</strong> {{ homepageStore.isLoading ? 'Loading...' : 'Ready' }}</div>
          <div><strong>Brands Store Status:</strong> {{ brandsStore.isLoading ? 'Loading...' : 'Ready' }}</div>
          <div><strong>Error:</strong> {{ homepageStore.error || 'None' }}</div>
          <div><strong>Brands Error:</strong> {{ brandsStore.error || 'None' }}</div>
          <div><strong>Source:</strong> {{ dataSource }}</div>
          <div><strong>Display Brands:</strong> {{ displayBrands.length }}</div>
          <div><strong>Active Brands:</strong> {{ activeBrands.length }}</div>
          <div><strong>All Brands:</strong> {{ allBrands.length }}</div>
          <div><strong>Offers:</strong> {{ activeOffers.length }}</div>
          <div><strong>Marquee:</strong> {{ displayBrandsForMarquee.length }}</div>
          <div><strong>Last Firebase Update:</strong> {{ lastUpdatedFormatted }}</div>
          <div class="debug-actions">
            <button @click="forceRefreshAllData">🔄 Refresh All</button>
            <button @click="clearCacheAndRefresh">🧹 Clear Cache</button>
            <button @click="checkFirebaseConnection">🔗 Check Firebase</button>
          </div>
        </div>
      </details>
    </div>

    <!-- Hero Banner - Clean, Minimal, Half Height -->
    <section class="hero-banner">
      <div class="banner-video-container">
        <div class="hero-background" :style="{ backgroundImage: `url('${heroBanner.imageUrl || '/images/banner.jpg'}')` }"></div>
        <div class="gradient-overlay"></div>
      </div>
      
      <div class="banner-container">
        <!-- Only Shop Now Button - No Card, No Text, No Logo, No Decorations -->
        <button class="shop-now-button" @click="navigateToShop">
          <span class="button-icon">↗</span>
          <span class="button-text">{{ t('shopNow') }}</span>
        </button>
      </div>
      
      <!-- Floating Brand Logos - Fixed Marquee -->
      <div class="floating-brands">
        <div class="marquee-container">
          <div class="marquee-track" :class="{ 'rtl-animation': isRTL }">
            <template v-if="displayBrandsForMarquee.length > 0">
              <template v-for="set in 2" :key="'set-' + set">
                <div 
                  v-for="brand in displayBrandsForMarquee" 
                  :key="`${brand.id || brand.name}-${set}`"
                  class="brand-item"
                >
                  <router-link
                    :to="`/brand/${brand.slug || brand.id || 'brand'}`"
                    class="brand-link"
                  >
                    <img 
                      :src="brand.image || brand.logo || '/images/default-logo.png'" 
                      :alt="brand.name || 'Brand'" 
                      class="brand-logo" 
                      @error="handleImageError"
                      loading="lazy"
                    />
                  </router-link>
                </div>
              </template>
            </template>
            <div v-else class="no-brands-message">
              <span>{{ t('loadingBrands') }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content - Compact Mobile First -->
    <section class="main-content-section">
      <div class="content-container">
        <!-- MOBILE LAYOUT - COMPACT, NO WASTED SPACE -->
        <div class="mobile-content-layout">
          <!-- Section Header - Minimal -->
          <div class="section-header">
            <h2 class="section-title">{{ t('featuredBrands') }}</h2>
            <div class="section-header-right">
              <router-link to="/brands" class="explore-more-link">
                <span>{{ t('exploreMore') }}</span>
                <span class="explore-icon">↗</span>
              </router-link>
            </div>
          </div>
          
          <!-- Main Content Layout - 3 Column Grid -->
          <div class="main-content-layout">
            <!-- Featured Brands - 2 Columns -->
            <div class="featured-brands-section">
              <div v-if="displayBrands.length > 0" class="brands-grid">
                <router-link
                  v-for="brand in displayBrands"
                  :key="brand.id || brand.name"
                  :to="`/brand/${brand.slug || brand.id || 'brand'}`"
                  class="brand-card-link"
                >
                  <div class="brand-card">
                    <div class="brand-image-full">
                      <img 
                        :src="brand.image || '/images/default-brand.jpg'" 
                        :alt="brand.name || 'Brand'" 
                        loading="lazy"
                        class="brand-image"
                        @error="handleBrandImageError"
                      />
                      <div class="image-gradient-overlay"></div>
                    </div>
                    <div class="brand-info-overlay">
                      <h3 class="brand-name">{{ brand.name || t('brandName') }}</h3>
                      <p class="brand-signature">{{ brand.signature || t('luxurySignature') }}</p>
                      <div class="product-count">
                        <span class="count-number">{{ getProductCount(brand) }}</span>
                        <span class="count-label">{{ t('products') }}</span>
                      </div>
                    </div>
                  </div>
                </router-link>
              </div>
              <div v-else class="no-data-message">
                <p>{{ t('noBrandsAvailable') }}</p>
              </div>
            </div>

            <!-- Today's Offer - 1 Column -->
            <aside class="offer-sidebar">
              <div v-if="activeOffers.length > 0 && activeOffers[0]" class="offer-card">
                <div class="offer-badge">{{ t('offer') }}</div>
                <div class="offer-content">
                  <div class="offer-image-full">
                    <img
                      :src="activeOffers[0].imageUrl || '/images/default-offer.jpg'"
                      :alt="activeOffers[0].title || t('exclusiveOffer')"
                      class="offer-image"
                      loading="lazy"
                      @error="handleOfferImageError"
                    />
                    <div class="offer-gradient-overlay"></div>
                  </div>
                  <div class="offer-details-overlay">
                    <h3 class="offer-title">{{ activeOffers[0].title || t('specialOffer') }}</h3>
                    <p class="offer-subtitle">{{ activeOffers[0].subtitle || t('limitedTime') }}</p>
                    <div class="offer-pricing">
                      <span class="old-price">{{ formatPrice(activeOffers[0].oldPrice || 0) }}</span>
                      <span class="new-price">{{ formatPrice(activeOffers[0].newPrice || 0) }}</span>
                    </div>
                    <button class="buy-now-button" @click="navigateToOffer(activeOffers[0])">
                      <span class="button-text">{{ t('buyNow') }}</span>
                      <span class="button-icon">↗</span>
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="no-offer-message">
                <p>{{ t('noOffers') }}</p>
              </div>
            </aside>
          </div>
        </div>

        <!-- DESKTOP LAYOUT - COMPACT -->
        <div class="desktop-content-layout">
          <!-- Featured Brands -->
          <div class="featured-brands">
            <div class="section-header">
              <h2 class="section-title">{{ t('featuredBrands') }}</h2>
              <router-link to="/brands" class="view-more-brands">
                <span>{{ t('exploreMore') }}</span>
                <span class="explore-icon">↗</span>
              </router-link>
            </div>
            
            <div v-if="displayBrands.length > 0" class="brands-grid">
              <router-link
                v-for="brand in displayBrands"
                :key="brand.id || brand.name"
                :to="`/brand/${brand.slug || brand.id || 'brand'}`"
                class="brand-card-link"
              >
                <div class="brand-card">
                  <div class="brand-image-wrapper">
                    <img 
                      :src="brand.image || '/images/default-brand.jpg'" 
                      :alt="brand.name || 'Brand'" 
                      loading="lazy"
                      class="brand-image"
                      @error="handleBrandImageError"
                    />
                  </div>
                  <div class="brand-info">
                    <h3 class="brand-name">{{ brand.name || t('brandName') }}</h3>
                    <p class="brand-signature">{{ brand.signature || t('luxurySignature') }}</p>
                    <p class="brand-price">{{ getProductCount(brand) }} {{ t('products') }}</p>
                  </div>
                </div>
              </router-link>
            </div>
            <div v-else class="no-data-message">
              <p>{{ t('noBrandsAvailable') }}</p>
            </div>
          </div>

          <!-- Today's Offer -->
          <aside class="offer-sidebar">
            <div v-if="activeOffers.length > 0 && activeOffers[0]" class="offer-card">
              <div class="offer-badge">{{ t('exclusive') }}</div>
              <div class="offer-content">
                <div class="offer-image-wrapper">
                  <img
                    :src="activeOffers[0].imageUrl || '/images/default-offer.jpg'"
                    :alt="activeOffers[0].title || t('exclusiveOffer')"
                    class="offer-bottle"
                    loading="lazy"
                    @error="handleOfferImageError"
                  />
                </div>
                <div class="offer-details">
                  <h3 class="offer-title">{{ activeOffers[0].title || t('specialOffer') }}</h3>
                  <p class="offer-subtitle">{{ activeOffers[0].subtitle || t('limitedTime') }}</p>
                  <div class="offer-pricing">
                    <span class="old-price">{{ formatPrice(activeOffers[0].oldPrice || 0) }}</span>
                    <span class="new-price">{{ formatPrice(activeOffers[0].newPrice || 0) }}</span>
                  </div>
                  <button class="buy-now-button" @click="navigateToOffer(activeOffers[0])">
                    <span class="button-text">{{ t('buyNow') }}</span>
                    <span class="button-icon">↗</span>
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="no-offer-message">
              <p>{{ t('noOffers') }}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
// [Script section remains exactly the same as original - no logic changes]
import { ref, onMounted, computed, watch, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useHomepageStore } from '@/stores/homepage'
import { useBrandsStore } from '@/stores/brands'
import type { Brand } from '@/types'

const router = useRouter()
const languageStore = useLanguageStore()
const homepageStore = useHomepageStore()
const brandsStore = useBrandsStore()
const { t, formatDate } = languageStore

const isDevelopment = import.meta.env.DEV

const homepageData = computed(() => homepageStore.homepageData || {})
const heroBanner = computed(() => homepageData.value.heroBanner || {})
const activeOffers = computed(() => homepageData.value.activeOffers || [])
const lastUpdatedFormatted = computed(() => {
  if (homepageData.value.lastUpdated) {
    return formatDate(homepageData.value.lastUpdated)
  }
  return 'Never'
})

const dataSource = computed(() => homepageData.value.source || 'unknown')
const isDarkMode = computed(() => homepageData.value.settings?.isDarkMode || false)

const isRTL = computed(() => {
  const currentLang = languageStore.currentLanguage;
  return currentLang === 'ar' || currentLang === 'fa' || currentLang === 'he';
})

const activeBrands = computed(() => brandsStore.activeBrands || [])
const allBrands = computed(() => brandsStore.brands || [])

const displayBrands = computed(() => {
  const brands = activeBrands.value.length > 0 ? activeBrands.value : allBrands.value
  return brands.slice(0, 6)
})

const displayBrandsForMarquee = computed(() => {
  const brands = activeBrands.value.length > 0 ? activeBrands.value : allBrands.value
  return brands.slice(0, 8)
})

const getProductCount = (brand: Brand) => {
  if (!brand.id) return 0
  if (Array.isArray(brand.productIds) && brand.productIds.length > 0) {
    return brand.productIds.length
  }
  if (brand.productCount !== undefined) return brand.productCount
  return 0
}

let unsubscribeHomepageStore: (() => void) | null = null

watch(() => homepageStore.homepageData, (newData) => {
  console.log('🏪 Homepage data updated:', {
    source: newData?.source,
    offers: newData?.activeOffers?.length || 0,
    lastUpdated: newData?.lastUpdated || 'Never'
  })
  
  if (newData?.settings?.isDarkMode) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}, { deep: true })

watch(() => homepageStore.error, (error) => {
  if (error) console.error('❌ Homepage store error:', error)
})

watch(() => brandsStore.error, (error) => {
  if (error) console.error('❌ Brands store error:', error)
})

const forceRefreshAllData = async () => {
  console.log('🔄 Force refreshing all data...')
  try {
    await Promise.all([
      homepageStore.forceRefresh(),
      brandsStore.loadBrands()
    ])
    console.log('✅ All data force refreshed')
  } catch (error: any) {
    console.error('❌ Error refreshing data:', error.message)
  }
}

const clearCacheAndRefresh = async () => {
  console.log('🧹 Clearing cache and refreshing...')
  homepageStore.clearCache()
  await forceRefreshAllData()
}

const checkFirebaseConnection = async () => {
  console.log('🔗 Checking Firebase connection...')
  try {
    const connection = await homepageStore.checkConnection()
    console.log('✅ Firebase connection:', connection)
    
    alert(`Firebase Status:
Connected: ${connection.connected ? 'Yes' : 'No'}
Last Update: ${connection.lastUpdate || 'Never'}
Homepage Listening: ${homepageStore.isListening ? 'Yes' : 'No'}
Homepage Error: ${homepageStore.error || 'None'}
Brands Count: ${allBrands.value.length}
Active Brands: ${activeBrands.value.length}
Brands Error: ${brandsStore.error || 'None'}`)
  } catch (error) {
    console.error('❌ Connection check failed:', error)
    alert('Connection check failed. Check console for details.')
  }
}

const navigateToShop = () => router.push('/shop')
const navigateToOffer = (offer: any) => {
  if (offer?.slug) router.push(`/offer/${offer.slug}`)
  else if (offer?.id) router.push(`/offer/${offer.id}`)
  else router.push('/offers')
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-EG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/default-logo.png'
}

const handleBrandImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/default-brand.jpg'
}

const handleOfferImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = '/images/default-offer.jpg'
}

onMounted(async () => {
  console.log('🏠 HomePage.vue mounted - Initializing...')
  document.documentElement.style.scrollBehavior = 'smooth'
  
  unsubscribeHomepageStore = homepageStore.subscribeToUpdates((data) => {
    console.log('📡 Homepage store update notification:', {
      source: data.source,
      offers: data.activeOffers?.length,
      timestamp: data.lastUpdated
    })
  })
  
  try {
    console.log('📥 Loading homepage data...')
    await Promise.all([
      homepageStore.loadHomepageData(),
      brandsStore.initialize()
    ])
    
    console.log('✅ All data loaded:', {
      source: dataSource.value,
      allBrands: allBrands.value.length,
      activeBrands: activeBrands.value.length,
      displayBrands: displayBrands.value.length,
      offers: activeOffers.value.length,
      darkMode: isDarkMode.value,
      brandsStoreError: brandsStore.error
    })
    
    console.log('📋 Available brands:', allBrands.value.map(b => ({
      id: b.id,
      name: b.name,
      slug: b.slug,
      productIds: b.productIds?.length || 0,
      productCount: getProductCount(b),
      image: b.image ? 'Has image' : 'No image',
      isActive: b.isActive
    })))
    
  } catch (err: any) {
    console.error('❌ Could not load homepage data:', err.message)
  }
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view')
        }
      })
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  )
  
  setTimeout(() => {
    document.querySelectorAll('.brand-card, .offer-card').forEach((el) => {
      observer.observe(el)
    })
  }, 100)
})

onUnmounted(() => {
  if (unsubscribeHomepageStore) unsubscribeHomepageStore()
  homepageStore.stopListening()
})
</script>

<style scoped>
/* ============================================= */
/* CLEAN, MINIMAL BANNER - HALF HEIGHT, JUST SHOP NOW BUTTON */
/* ============================================= */

.luxury-perfume-homepage {
  --bg-primary: linear-gradient(135deg, #ffffff 0%, #f8f5f0 100%);
  --bg-secondary: #ffffff;
  --text-primary: #1a120b;
  --text-secondary: rgba(26, 18, 11, 0.7);
  --text-tertiary: rgba(26, 18, 11, 0.5);
  --gold-primary: #d4af37;
  --gold-secondary: #c9a42e;
  --gold-tertiary: #b8941f;
  --gold-glow: rgba(212, 175, 55, 0.8);
  --border-color: rgba(212, 175, 55, 0.15);
  --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1);
  --glass-bg: rgba(255, 255, 255, 0.12);
  --glass-border: rgba(212, 175, 55, 0.25);
  --offer-badge: linear-gradient(to right, #c41e3a, #e63946);
  --overlay-gradient: linear-gradient(to bottom, transparent 60%, rgba(0, 0, 0, 0.95));
  
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Georgia', 'Times New Roman', serif;
  overflow-x: hidden;
  min-height: 100vh;
  transition: all 0.3s ease;
}

/* Dark Mode */
.luxury-perfume-homepage.dark-mode {
  --bg-primary: linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%);
  --bg-secondary: #1a1a1a;
  --text-primary: #f5f5f5;
  --text-secondary: rgba(245, 245, 245, 0.8);
  --text-tertiary: rgba(245, 245, 245, 0.6);
  --gold-primary: #f0d475;
  --gold-secondary: #e6c158;
  --gold-tertiary: #d4af37;
  --gold-glow: rgba(240, 212, 117, 0.9);
  --border-color: rgba(212, 175, 55, 0.25);
  --card-shadow: 0 4px 12px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.3);
  --glass-bg: rgba(26, 26, 26, 0.3);
  --glass-border: rgba(212, 175, 55, 0.4);
  --offer-badge: linear-gradient(to right, #e63946, #ff6b6b);
}

/* ===== DEBUG PANEL ===== */
.debug-panel {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 8px;
  border-radius: 4px;
  font-size: 11px;
  z-index: 9999;
  max-width: 280px;
  max-height: 280px;
  overflow: auto;
}

.debug-panel summary {
  cursor: pointer;
  font-weight: bold;
  color: var(--gold-primary);
  padding: 4px;
}

.debug-info {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.debug-info div {
  margin: 4px 0;
  line-height: 1.3;
}

.debug-actions {
  margin-top: 8px;
  display: flex;
  gap: 4px;
}

.debug-actions button {
  flex: 1;
  padding: 5px 8px;
  background: var(--gold-primary);
  color: white;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 10px;
}

/* ===== NO ROUNDED EDGES ===== */
.banner-video-container,
.shop-now-button,
.brand-card,
.offer-card,
.buy-now-button,
.explore-more-link,
.view-more-brands,
.product-count,
.debug-panel {
  border-radius: 0 !important;
}

/* ===== LOADING SPINNER ===== */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.luxury-perfume-homepage.dark-mode .loading-overlay {
  background: rgba(15, 15, 15, 0.95);
}

.luxury-spinner {
  position: relative;
  width: 60px;
  height: 60px;
}

.spinner-gold-ring {
  width: 100%;
  height: 100%;
  border: 3px solid rgba(212, 175, 55, 0.2);
  border-top: 3px solid var(--gold-primary);
  border-right: 3px solid var(--gold-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-glow {
  position: absolute;
  inset: -8px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%);
  border-radius: 50%;
}

.spinner-diamond {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--gold-primary);
  font-size: 20px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes pulse { 
  0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
}

/* ===== HERO BANNER - CLEAN, MINIMAL, HALF HEIGHT ===== */
.hero-banner {
  position: relative;
  height: 180px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@media (min-width: 768px) {
  .hero-banner {
    height: 220px;
    min-height: 220px;
  }
}

@media (min-width: 1024px) {
  .hero-banner {
    height: 260px;
    min-height: 260px;
  }
}

.banner-video-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  z-index: 1;
}

.hero-background::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
  z-index: 1;
}

/* Single gradient overlay - cleaner */
.gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.2) 50%, rgba(0, 0, 0, 0.4) 100%);
  z-index: 2;
}

.banner-container {
  position: relative;
  z-index: 4;
  flex: 1;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

/* ===== REMOVED ALL GLASS CARD STYLES ===== */
/* .glass-card, .brand-name-large, .app-subtitle, .premium-badge, 
   .decorative-lines, .line-wrapper, .gold-line, .diamond, 
   .mobile-simple-view, .desktop-full-view - ALL REMOVED */

/* ===== SHOP NOW BUTTON - CLEAN, CENTERED ===== */
.shop-now-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: linear-gradient(135deg, var(--gold-primary) 0%, var(--gold-tertiary) 100%);
  color: #ffffff !important;
  border: none;
  padding: 0.85rem 2.2rem;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
  min-width: 180px;
  position: relative;
  overflow: hidden;
}

.shop-now-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: 0.5s;
}

.shop-now-button:hover::before {
  left: 100%;
}

.shop-now-button:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 12px 30px rgba(212, 175, 55, 0.5);
  background: linear-gradient(135deg, #e6c158 0%, var(--gold-primary) 100%);
}

@media (max-width: 767px) {
  .shop-now-button {
    padding: 0.75rem 1.8rem;
    font-size: 0.85rem;
    min-width: 160px;
  }
}

.button-icon {
  font-size: 1.1rem;
  font-weight: bold;
}

/* ===== MARQUEE - POSITIONED AT BOTTOM ===== */
.floating-brands {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  z-index: 5;
  overflow: hidden;
  width: 100%;
  height: 45px;
  display: flex;
  align-items: center;
  mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

@media (min-width: 768px) {
  .floating-brands {
    bottom: 25px;
    height: 50px;
  }
}

.marquee-container {
  position: absolute;
  left: 0;
  right: 0;
  overflow: hidden;
  width: 100%;
}

.marquee-track {
  display: flex;
  gap: 3rem;
  padding: 0.4rem 0;
  align-items: center;
  width: max-content;
  will-change: transform;
  animation: marquee-ltr 30s linear infinite;
}

.marquee-track.rtl-animation {
  animation: marquee-rtl 30s linear infinite;
}

@keyframes marquee-ltr {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

@keyframes marquee-rtl {
  0% { transform: translateX(-50%); }
  100% { transform: translateX(0); }
}

.brand-logo {
  height: 25px;
  width: auto;
  max-width: 100px;
  object-fit: contain;
  opacity: 0.9;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

@media (min-width: 768px) {
  .brand-logo { height: 30px; max-width: 120px; }
}

/* ===== MAIN CONTENT - COMPACT ===== */
.main-content-section {
  padding: 1.5rem 1rem;
  background: var(--bg-primary);
}

@media (min-width: 640px) {
  .main-content-section { padding: 2rem 1.5rem; }
}

@media (min-width: 1024px) {
  .main-content-section { padding: 3rem 2rem; }
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* ===== MOBILE LAYOUT - COMPACT ===== */
.mobile-content-layout {
  display: block;
}

@media (min-width: 1024px) {
  .mobile-content-layout { display: none; }
}

/* Section Header - Minimal */
.mobile-content-layout .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  gap: 0.75rem;
}

.mobile-content-layout .section-title {
  font-size: 1.6rem;
  font-weight: 400;
  background: linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 1.5px;
  margin: 0;
}

.mobile-content-layout .explore-more-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.8rem;
  letter-spacing: 0.8px;
  padding: 0.4rem 0.8rem;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

/* Main Content Layout - 3 Column Grid */
.mobile-content-layout .main-content-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  align-items: start;
}

.mobile-content-layout .featured-brands-section {
  grid-column: span 2;
  width: 100%;
}

.mobile-content-layout .offer-sidebar {
  grid-column: 3;
  width: 100%;
  height: 100%;
}

/* Brands Grid - 2 Columns */
.mobile-content-layout .brands-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

/* Brand Card - NO ROUNDED EDGES */
.mobile-content-layout .brand-card-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.mobile-content-layout .brand-card {
  display: block;
  width: 100%;
  position: relative;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  overflow: hidden;
  aspect-ratio: 3/4;
}

.mobile-content-layout .brand-image-full {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.mobile-content-layout .brand-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  transition: transform 0.4s ease;
}

.mobile-content-layout .brand-card:hover .brand-image {
  transform: scale(1.05);
}

.mobile-content-layout .image-gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
  pointer-events: none;
}

.mobile-content-layout .brand-info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0.75rem;
  z-index: 2;
}

.mobile-content-layout .brand-name {
  font-size: 0.85rem;
  color: #ffffff;
  letter-spacing: 0.8px;
  margin: 0 0 0.2rem 0;
  font-weight: 600;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.mobile-content-layout .brand-signature {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.4rem 0;
  font-style: italic;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.mobile-content-layout .product-count {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(4px);
  padding: 0.2rem 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.mobile-content-layout .count-number {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--gold-primary);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.mobile-content-layout .count-label {
  font-size: 0.55rem;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

/* Mobile Offer Card - NO ROUNDED EDGES */
.mobile-content-layout .offer-card {
  background: var(--bg-secondary);
  border: 2px solid var(--gold-primary);
  overflow: hidden;
  height: 100%;
  min-height: 380px;
  position: relative;
  width: 100%;
}

.mobile-content-layout .offer-badge {
  background: var(--offer-badge);
  color: #ffffff;
  text-align: center;
  padding: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3;
}

.mobile-content-layout .offer-image-full {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.mobile-content-layout .offer-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.mobile-content-layout .offer-gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, 
    transparent 0%, 
    rgba(0, 0, 0, 0.4) 50%, 
    rgba(0, 0, 0, 0.9) 100%);
  pointer-events: none;
}

.mobile-content-layout .offer-details-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  z-index: 2;
  text-align: center;
}

.mobile-content-layout .offer-title {
  font-size: 1.1rem;
  color: #ffffff;
  letter-spacing: 1px;
  margin: 0 0 0.2rem 0;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.mobile-content-layout .offer-subtitle {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.6rem;
  font-style: italic;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.mobile-content-layout .offer-pricing {
  margin: 0.6rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
}

.mobile-content-layout .old-price {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: line-through;
}

.mobile-content-layout .new-price {
  font-size: 1.3rem;
  color: var(--gold-primary);
  font-weight: 800;
  text-shadow: 0 2px 8px rgba(212, 175, 55, 0.5);
}

.mobile-content-layout .buy-now-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  background: linear-gradient(135deg, var(--gold-primary) 0%, var(--gold-tertiary) 100%);
  color: #ffffff;
  border: none;
  padding: 0.6rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  width: 100%;
}

/* ===== MOBILE SPACING OPTIMIZATION ===== */
@media (max-width: 767px) {
  .mobile-content-layout .main-content-layout { gap: 0.625rem; }
  .mobile-content-layout .brands-grid { gap: 0.625rem; }
  .mobile-content-layout .brand-card { aspect-ratio: 3/4; }
  .mobile-content-layout .offer-card { min-height: 340px; }
  .mobile-content-layout .brand-name { font-size: 0.8rem; }
  .mobile-content-layout .brand-signature { font-size: 0.6rem; }
  .mobile-content-layout .brand-info-overlay { padding: 0.6rem; }
}

@media (max-width: 640px) {
  .mobile-content-layout .brands-grid { gap: 0.5rem; }
  .mobile-content-layout .brand-card { min-height: 160px; }
  .mobile-content-layout .brand-name { font-size: 0.75rem; }
  .mobile-content-layout .offer-card { min-height: 320px; }
}

@media (max-width: 480px) {
  .mobile-content-layout .main-content-layout { gap: 0.5rem; }
  .mobile-content-layout .brands-grid { gap: 0.5rem; }
  .mobile-content-layout .brand-card { min-height: 140px; }
  .mobile-content-layout .brand-name { font-size: 0.7rem; letter-spacing: 0.6px; }
  .mobile-content-layout .brand-signature { font-size: 0.55rem; }
  .mobile-content-layout .brand-info-overlay { padding: 0.5rem; }
  .mobile-content-layout .offer-card { min-height: 300px; }
}

@media (max-width: 360px) {
  .mobile-content-layout .brands-grid { gap: 0.375rem; }
  .mobile-content-layout .brand-card { min-height: 120px; }
  .mobile-content-layout .brand-name { font-size: 0.65rem; }
  .mobile-content-layout .brand-signature { font-size: 0.5rem; }
  .mobile-content-layout .offer-card { min-height: 280px; }
}

/* ===== DESKTOP LAYOUT - COMPACT ===== */
.desktop-content-layout {
  display: none;
}

@media (min-width: 1024px) {
  .desktop-content-layout {
    display: flex;
    flex-direction: row;
    gap: 3rem;
  }
}

.desktop-content-layout .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.desktop-content-layout .section-title {
  font-size: 2rem;
  font-weight: 400;
  color: var(--text-primary);
  letter-spacing: 2px;
  margin: 0;
}

.desktop-content-layout .view-more-brands {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #D4AF37 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 1px;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.desktop-content-layout .featured-brands {
  flex: 1;
}

.desktop-content-layout .brands-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* Desktop Brand Cards - NO ROUNDED EDGES */
.desktop-content-layout .brand-card-link {
  text-decoration: none;
  color: inherit;
}

.desktop-content-layout .brand-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.desktop-content-layout .brand-card:hover {
  border-color: var(--gold-primary);
  transform: translateY(-4px);
  box-shadow: 0 15px 30px rgba(212, 175, 55, 0.15);
}

.desktop-content-layout .brand-image-wrapper {
  width: 100%;
  aspect-ratio: 3/4;
  overflow: hidden;
}

.desktop-content-layout .brand-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.desktop-content-layout .brand-card:hover .brand-image {
  transform: scale(1.08);
}

.desktop-content-layout .brand-info {
  padding: 1rem;
  text-align: center;
  background: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
}

.desktop-content-layout .brand-name {
  font-size: 1rem;
  color: var(--text-primary);
  letter-spacing: 1.2px;
  margin: 0 0 0.3rem 0;
  font-weight: 600;
  text-transform: uppercase;
}

.desktop-content-layout .brand-signature {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
  font-style: italic;
}

.desktop-content-layout .brand-price {
  font-size: 0.8rem;
  color: var(--gold-primary);
  font-weight: 600;
}

/* Desktop Offer Card - NO ROUNDED EDGES */
.desktop-content-layout .offer-sidebar {
  width: 100%;
  max-width: 360px;
  align-self: start;
  position: sticky;
  top: 100px;
}

.desktop-content-layout .offer-card {
  background: var(--bg-secondary);
  border: 2px solid var(--gold-primary);
  overflow: hidden;
  box-shadow: 0 15px 30px rgba(212, 175, 55, 0.15);
}

.desktop-content-layout .offer-badge {
  background: var(--offer-badge);
  color: #ffffff;
  text-align: center;
  padding: 0.75rem;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.desktop-content-layout .offer-image-wrapper {
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f5f0 0%, #ffffff 100%);
  text-align: center;
}

.luxury-perfume-homepage.dark-mode .desktop-content-layout .offer-image-wrapper {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
}

.desktop-content-layout .offer-bottle {
  max-height: 200px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.1));
}

.desktop-content-layout .offer-details {
  padding: 1.5rem;
  text-align: center;
}

.desktop-content-layout .offer-title {
  font-size: 1.6rem;
  color: var(--text-primary);
  letter-spacing: 1.5px;
  margin: 0 0 0.3rem 0;
  font-weight: 600;
}

.desktop-content-layout .offer-subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 1rem;
  font-style: italic;
}

.desktop-content-layout .offer-pricing {
  margin: 1.2rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.2rem;
}

.desktop-content-layout .old-price {
  font-size: 1.1rem;
  color: var(--text-tertiary);
  text-decoration: line-through;
}

.desktop-content-layout .new-price {
  font-size: 2rem;
  color: var(--gold-primary);
  font-weight: 800;
}

.desktop-content-layout .buy-now-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  background: linear-gradient(135deg, var(--gold-primary) 0%, var(--gold-tertiary) 100%);
  color: #ffffff;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
  width: 100%;
}

.desktop-content-layout .buy-now-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 25px rgba(212, 175, 55, 0.4);
}

/* ===== NO DATA MESSAGES ===== */
.no-data-message,
.no-offer-message,
.no-brands-message {
  text-align: center;
  padding: 2rem 1rem;
  color: var(--text-secondary);
  font-style: italic;
  font-size: 0.9rem;
}

/* ===== RTL SUPPORT ===== */
.luxury-perfume-homepage.rtl-direction {
  direction: rtl;
  text-align: right;
}

.luxury-perfume-homepage.rtl-direction .section-header {
  flex-direction: row-reverse;
}

.luxury-perfume-homepage.rtl-direction .explore-more-link,
.luxury-perfume-homepage.rtl-direction .view-more-brands,
.luxury-perfume-homepage.rtl-direction .shop-now-button,
.luxury-perfume-homepage.rtl-direction .buy-now-button {
  flex-direction: row-reverse;
}

/* ===== PERFORMANCE & ACCESSIBILITY ===== */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  .marquee-track { animation: none; }
}

@media (max-width: 767px) and (orientation: landscape) {
  .hero-banner { height: 160px; min-height: 160px; }
}

@media print {
  .hero-banner, .floating-brands, .shop-now-button, .buy-now-button { display: none; }
}
</style>