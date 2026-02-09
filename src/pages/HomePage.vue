<!-- src/pages/HomePage.vue - UPDATED TEMPLATE -->
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

    <!-- Hero Banner with Fixed Background -->
    <section class="hero-banner">
      <!-- Video-Style Banner Container -->
      <div class="banner-video-container">
        <!-- Background Image from Firebase -->
        <div class="hero-background" :style="{ backgroundImage: `url('${heroBanner.imageUrl || '/images/banner.jpg'}')` }"></div>
        
        <!-- Gradient Overlays -->
        <div class="gradient-overlay-top"></div>
        <div class="gradient-overlay-bottom"></div>
      </div>
      
      <!-- Content Overlay -->
      <div class="banner-container">
        <!-- Brand Identity -->
        <div class="banner-left">
          <div class="glass-card luxury-branding">
            <div class="app-identity">
              <h1 class="brand-name-large">P.NOTES</h1>
              <p class="app-subtitle">PERFUME STORE</p>
            </div>
            
            <!-- Mobile View -->
            <div class="mobile-simple-view">
              <button class="shop-now-button" @click="navigateToShop">
                <span class="button-icon">↗</span>
                <span class="button-text">{{ t('shopNow') }}</span>
              </button>
            </div>
            
            <!-- Desktop View -->
            <div class="desktop-full-view">
              <div class="premium-badge">
                <span>{{ t('luxury') }}</span>
                <span>{{ t('collection') }}</span>
              </div>
              <div class="decorative-lines">
                <div class="line-wrapper">
                  <div class="gold-line"></div>
                  <div class="diamond">◆</div>
                </div>
                <div class="line-wrapper">
                  <div class="gold-line"></div>
                  <div class="diamond">◆</div>
                </div>
                <div class="line-wrapper">
                  <div class="gold-line"></div>
                  <div class="diamond">◆</div>
                </div>
              </div>
              <button class="shop-now-button" @click="navigateToShop">
                <span class="button-icon">↗</span>
                <span class="button-text">{{ t('shopNow') }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Floating Brand Logos from Firebase - FIXED MARQUEE (No Blinking/Shaking) -->
      <div class="floating-brands">
        <div class="marquee-container">
          <div class="marquee-track" :class="{ 'rtl-animation': isRTL }">
            <template v-if="displayBrandsForMarquee.length > 0">
              <!-- Duplicate set for seamless loop without blinking -->
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

    <!-- Featured Brands & Offer Section -->
    <section class="main-content-section">
      <div class="content-container">
        <!-- SECTION HEADER WITH EXPLORE MORE LINK -->
        <div class="section-header">
          <h2 class="section-title">{{ t('featuredBrands') }}</h2>
          <div class="section-header-right">
            <router-link to="/brands" class="explore-more-link">
              <span>{{ t('exploreMoreBrands') }}</span>
              <span class="explore-icon">↗</span>
            </router-link>
          </div>
        </div>
        
        <!-- MAIN CONTENT LAYOUT - SAME STRUCTURE FOR ALL SCREENS -->
        <div class="main-content-layout">
          <!-- Featured Brands Grid (2 columns on mobile/tablet, 3 on desktop) -->
          <div class="featured-brands-section">
            <div v-if="displayBrands.length > 0" class="brands-grid">
              <router-link
                v-for="brand in displayBrands"
                :key="brand.id || brand.name"
                :to="`/brand/${brand.slug || brand.id || 'brand'}`"
                class="brand-card-link"
              >
                <div class="brand-card">
                  <!-- Brand Image - Full Card Coverage -->
                  <div class="brand-image-full">
                    <img 
                      :src="brand.image || '/images/default-brand.jpg'" 
                      :alt="brand.name || 'Brand'" 
                      loading="lazy"
                      class="brand-image"
                      @error="handleBrandImageError"
                    />
                    <!-- Gradient Overlay for Text Readability -->
                    <div class="image-gradient-overlay"></div>
                  </div>
                  
                  <!-- Brand Info Overlay on Image -->
                  <div class="brand-info-overlay">
                    <h3 class="brand-name">{{ brand.name || t('brandName') }}</h3>
                    <p class="brand-signature">{{ brand.signature || t('luxurySignature') }}</p>
                    <!-- Display Product Count Instead of Price -->
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
              <button @click="forceRefreshAllData" class="refresh-button">
                {{ t('refresh') }}
              </button>
            </div>
          </div>

          <!-- Today's Exclusive Offer from Homepage Store -->
          <aside class="offer-sidebar">
            <div v-if="activeOffers.length > 0 && activeOffers[0]" class="offer-card">
              <div class="offer-badge">{{ t('todaysExclusiveOffer') }}</div>
              <div class="offer-content">
                <!-- Offer Image - Full Card Coverage -->
                <div class="offer-image-full">
                  <img
                    :src="activeOffers[0].imageUrl || '/images/default-offer.jpg'"
                    :alt="activeOffers[0].title || t('exclusiveOffer')"
                    class="offer-image"
                    loading="lazy"
                    @error="handleOfferImageError"
                  />
                  <!-- Gradient Overlay for Text Readability -->
                  <div class="offer-gradient-overlay"></div>
                </div>
                
                <!-- Offer Details Overlay on Image -->
                <div class="offer-details-overlay">
                  <h3 class="offer-title">{{ activeOffers[0].title || t('specialOffer') }}</h3>
                  <p class="offer-subtitle">{{ activeOffers[0].subtitle || t('limitedTimeOffer') }}</p>
                  <div class="offer-pricing">
                    <span class="old-price">{{ formatPrice(activeOffers[0].oldPrice || 0) }} {{ t('currencyLE') }}</span>
                    <span class="new-price">{{ formatPrice(activeOffers[0].newPrice || 0) }} {{ t('currencyLE') }}</span>
                  </div>
                  <button class="buy-now-button" @click="navigateToOffer(activeOffers[0])">
                    <span class="button-text">{{ t('buyNow') }}</span>
                    <span class="button-icon">↗</span>
                  </button>
                </div>
              </div>
            </div>
            <div v-else class="no-offer-message">
              <p>{{ t('noOffersAvailable') }}</p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
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

// Development mode check
const isDevelopment = import.meta.env.DEV

// Homepage Store data - safely access nested properties
const homepageData = computed(() => homepageStore.homepageData || {})
const heroBanner = computed(() => homepageData.value.heroBanner || {})
const activeOffers = computed(() => homepageData.value.activeOffers || [])
const lastUpdatedFormatted = computed(() => {
  if (homepageData.value.lastUpdated) {
    return formatDate(homepageData.value.lastUpdated)
  }
  return 'Never'
})

// Data source for debugging
const dataSource = computed(() => {
  return homepageData.value.source || 'unknown'
})

// Dark mode from store
const isDarkMode = computed(() => homepageData.value.settings?.isDarkMode || false)

// RTL based on language
const isRTL = computed(() => {
  const currentLang = languageStore.currentLanguage;
  return currentLang === 'ar' || currentLang === 'fa' || currentLang === 'he';
})

// Brands from Brands Store
const activeBrands = computed(() => brandsStore.activeBrands || [])
const allBrands = computed(() => brandsStore.brands || [])

// Display brands (limit to 6 for grid - 2 columns on mobile)
const displayBrands = computed(() => {
  const brands = activeBrands.value.length > 0 ? activeBrands.value : allBrands.value
  return brands.slice(0, 6) // Show first 6 brands (2 rows × 3 columns on desktop)
})

// Brands for marquee (use active brands or all brands) - FIXED FOR SMOOTH ANIMATION
const displayBrandsForMarquee = computed(() => {
  const brands = activeBrands.value.length > 0 ? activeBrands.value : allBrands.value
  return brands.slice(0, 8) // Show first 8 brands for marquee
})

// Get actual product count from brand data
const getProductCount = (brand: Brand) => {
  if (!brand.id) return 0
  
  // Check if brand has productIds array
  if (Array.isArray(brand.productIds) && brand.productIds.length > 0) {
    return brand.productIds.length
  }
  
  // Check if brand has a productCount property
  if (brand.productCount !== undefined) return brand.productCount
  
  // Default to 0 if no product information
  return 0
}

// Store subscription references
let unsubscribeHomepageStore: (() => void) | null = null

// Watch for store updates
watch(() => homepageStore.homepageData, (newData) => {
  console.log('🏪 Homepage data updated:', {
    source: newData?.source,
    offers: newData?.activeOffers?.length || 0,
    lastUpdated: newData?.lastUpdated || 'Never'
  })
  
  // Apply dark mode if changed
  if (newData?.settings?.isDarkMode) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}, { deep: true })

// Watch for errors
watch(() => homepageStore.error, (error) => {
  if (error) {
    console.error('❌ Homepage store error:', error)
  }
})

watch(() => brandsStore.error, (error) => {
  if (error) {
    console.error('❌ Brands store error:', error)
  }
})

// Force refresh all data
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

// Clear cache and refresh
const clearCacheAndRefresh = async () => {
  console.log('🧹 Clearing cache and refreshing...')
  homepageStore.clearCache()
  await forceRefreshAllData()
}

// Check Firebase connection
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

// Navigation functions
const navigateToShop = () => {
  router.push('/shop')
}

const navigateToOffer = (offer: any) => {
  if (offer?.slug) {
    router.push(`/offer/${offer.slug}`)
  } else if (offer?.id) {
    router.push(`/offer/${offer.id}`)
  } else {
    router.push('/offers')
  }
}

// Format price
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-EG', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

// Image error handlers
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
  
  // Subscribe to homepage store updates
  unsubscribeHomepageStore = homepageStore.subscribeToUpdates((data) => {
    console.log('📡 Homepage store update notification:', {
      source: data.source,
      offers: data.activeOffers?.length,
      timestamp: data.lastUpdated
    })
  })
  
  // Load all data
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
    
    // Log brands for debugging with product counts
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
  
  // Intersection Observer for animations
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
  
  // Observe elements after a short delay to ensure they exist
  setTimeout(() => {
    document.querySelectorAll('.brand-card, .offer-card').forEach((el) => {
      observer.observe(el)
    })
  }, 100)
})

onUnmounted(() => {
  // Cleanup subscription
  if (unsubscribeHomepageStore) {
    unsubscribeHomepageStore()
  }
  
  // Clean up Firebase listener when component is destroyed
  homepageStore.stopListening()
})
</script>

<style scoped>
/* ============================================= */
/* LUXURIOUS WHITE & GOLD THEME WITH DARK MODE */
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
  --overlay-gradient: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: 'Georgia', 'Times New Roman', serif;
  overflow-x: hidden;
  scroll-behavior: smooth;
  min-height: 100vh;
  transition: all 0.3s ease;
}

/* Dark Mode Variables */
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
  --overlay-gradient: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.8) 100%);
}

/* App Identity */
.app-identity {
  text-align: center;
  margin-bottom: 1.5rem;
}

.app-subtitle {
  font-size: 0.7rem;
  color: #999999;
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-top: 0.3rem;
  font-weight: 400;
}

.luxury-perfume-homepage.dark-mode .app-subtitle {
  color: #aaaaaa;
}

/* Debug Panel */
.debug-panel {
  position: fixed;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-size: 12px;
  z-index: 9999;
  max-width: 300px;
  max-height: 300px;
  overflow: auto;
  backdrop-filter: blur(10px);
  border: 1px solid var(--gold-primary);
}

.debug-panel summary {
  cursor: pointer;
  font-weight: bold;
  color: var(--gold-primary);
  padding: 5px;
}

.debug-info {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.debug-info div {
  margin: 5px 0;
  line-height: 1.4;
}

.debug-actions {
  margin-top: 10px;
  display: flex;
  gap: 5px;
}

.debug-actions button {
  flex: 1;
  padding: 6px 10px;
  background: var(--gold-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 11px;
  transition: opacity 0.2s;
}

.debug-actions button:hover {
  opacity: 0.9;
}

/* No data messages */
.no-data-message,
.no-offer-message,
.no-brands-message {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-secondary);
  font-style: italic;
}

.no-brands-message {
  padding: 20px;
  color: rgba(255, 255, 255, 0.8);
}

.refresh-button {
  margin-top: 15px;
  padding: 8px 16px;
  background: var(--gold-primary);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.refresh-button:hover {
  background: var(--gold-secondary);
  transform: translateY(-2px);
}

/* RTL Direction Support */
.luxury-perfume-homepage.rtl-direction {
  direction: rtl;
  text-align: right;
}

.luxury-perfume-homepage.rtl-direction .section-header,
.luxury-perfume-homepage.rtl-direction .brand-info-overlay,
.luxury-perfume-homepage.rtl-direction .offer-details-overlay {
  text-align: right;
}

.luxury-perfume-homepage.rtl-direction .premium-badge {
  flex-direction: row-reverse;
}

.luxury-perfume-homepage.rtl-direction .shop-now-button,
.luxury-perfume-homepage.rtl-direction .buy-now-button {
  flex-direction: row-reverse;
}

/* LTR Direction Support */
.luxury-perfume-homepage.ltr-direction {
  direction: ltr;
  text-align: left;
}

.luxury-perfume-homepage.ltr-direction .section-header,
.luxury-perfume-homepage.ltr-direction .brand-info-overlay,
.luxury-perfume-homepage.ltr-direction .offer-details-overlay {
  text-align: left;
}

.luxury-perfume-homepage.ltr-direction .premium-badge {
  flex-direction: row;
}

.luxury-perfume-homepage.ltr-direction .shop-now-button,
.luxury-perfume-homepage.ltr-direction .buy-now-button {
  flex-direction: row;
}

/* ========== LOADING SPINNER FIX ========== */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
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
  width: 80px;
  height: 80px;
}

.spinner-gold-ring {
  width: 100%;
  height: 100%;
  border: 4px solid rgba(212, 175, 55, 0.2);
  border-top: 4px solid var(--gold-primary);
  border-right: 4px solid var(--gold-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-glow {
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%);
  border-radius: 50%;
}

.spinner-diamond {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--gold-primary);
  font-size: 24px;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
  50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
}

/* ========== HERO BANNER WITH VIDEO-STYLE CONTAINER ========== */
.hero-banner {
  position: relative;
  height: 70vh;
  min-height: 600px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-top: 0;
  padding-top: 0;
}

/* Video-Style Container for Mobile */
.banner-video-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  overflow: hidden;
  border-radius: 0;
}

@media (max-width: 767px) {
  .banner-video-container {
    height: 280px;
    min-height: 280px;
    border-radius: 0;
    box-shadow: none;
  }
  
  .hero-banner {
    height: 320px;
    min-height: 320px;
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .banner-video-container {
    height: 400px;
    min-height: 400px;
  }
  
  .hero-banner {
    height: 450px;
    min-height: 450px;
  }
}

@media (min-width: 1024px) {
  .banner-video-container {
    height: 100%;
    border-radius: 0;
  }
}

/* Optimized Background Image - USING FIREBASE DATA */
.hero-background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  image-rendering: crisp-edges;
  z-index: 1;
}

.hero-background::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.1));
  z-index: 1;
}

.luxury-perfume-homepage.dark-mode .hero-background::before {
  background: linear-gradient(45deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.3));
}

@media (max-width: 767px) {
  .hero-background {
    background-attachment: scroll;
    background-position: center 30%;
  }
}

/* Gradient Overlays for Better Contrast */
.gradient-overlay-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.4), transparent);
  z-index: 2;
}

.gradient-overlay-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
  z-index: 2;
}

.luxury-perfume-homepage.dark-mode .gradient-overlay-top,
.luxury-perfume-homepage.dark-mode .gradient-overlay-bottom {
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), transparent);
}

/* Content Container */
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

@media (min-width: 992px) {
  .banner-container {
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    padding: 2rem 3rem;
    gap: 3rem;
  }
}

/* ========== GLASS CARD WITH MOBILE SIMPLIFICATION ========== */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: 1px solid var(--glass-border);
  border-radius: 28px;
  padding: 1.5rem 1.8rem;
  box-shadow:
    0 25px 60px rgba(212, 175, 55, 0.25),
    0 0 50px rgba(255, 255, 255, 0.5) inset,
    0 10px 35px rgba(0, 0, 0, 0.2);
  max-width: 420px;
  width: fit-content;
  min-width: 280px;
  text-align: center;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
}

.luxury-perfume-homepage.dark-mode .glass-card {
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.4),
    0 0 30px rgba(255, 255, 255, 0.1) inset,
    0 10px 35px rgba(0, 0, 0, 0.3);
}

.glass-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.08));
  pointer-events: none;
}

.luxury-perfume-homepage.dark-mode .glass-card::before {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.02));
}

/* Mobile Simplified View */
.mobile-simple-view {
  display: none;
}

/* Desktop Full View */
.desktop-full-view {
  display: block;
}

@media (max-width: 767px) {
  .glass-card {
    background: transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    border: none;
    box-shadow: none;
    padding: 0.5rem;
    min-width: auto;
    max-width: 100%;
    width: 100%;
  }
  
  .glass-card::before {
    display: none;
  }
  
  .mobile-simple-view {
    display: block;
  }
  
  .desktop-full-view {
    display: none;
  }
}

/* Brand Name */
.brand-name-large {
  font-size: 2.8rem;
  letter-spacing: 4px;
  margin: 0 0 0.3rem 0;
  line-height: 1.1;
  color: #ffffff !important;
  font-weight: 700;
  text-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.6),
    0 4px 16px rgba(0, 0, 0, 0.5);
}

.luxury-perfume-homepage.dark-mode .brand-name-large {
  color: #ffffff !important;
  text-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.8),
    0 4px 16px rgba(0, 0, 0, 0.6);
}

@media (max-width: 767px) {
  .brand-name-large {
    font-size: 2.2rem;
    letter-spacing: 3px;
    margin-bottom: 0.5rem;
    color: #ffffff !important;
    text-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.6),
      0 4px 16px rgba(0, 0, 0, 0.5);
  }
}

@media (min-width: 1024px) {
  .brand-name-large {
    font-size: 3.2rem;
    letter-spacing: 5px;
  }
}

/* Premium Badge */
.premium-badge {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.6rem 1.5rem;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  margin-bottom: 1.5rem;
  backdrop-filter: blur(10px);
}

.luxury-perfume-homepage.dark-mode .premium-badge {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.premium-badge span {
  font-size: 0.9rem;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  color: #ffffff !important;
  font-weight: 600;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
}

/* Decorative Lines & Diamonds */
.decorative-lines {
  margin: 1.5rem 0;
}

.line-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.8rem 0;
}

.gold-line {
  width: 90px;
  height: 2px;
  background: linear-gradient(90deg, transparent, var(--gold-primary), transparent);
  box-shadow: 0 0 15px var(--gold-glow);
}

.diamond {
  color: var(--gold-primary);
  font-size: 1.2rem;
  margin: 0 1rem;
  text-shadow: 0 0 20px var(--gold-glow);
  animation: twinkle 2s infinite;
}

@keyframes twinkle {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

/* ========== SHOP NOW BUTTON ========== */
.shop-now-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  background: linear-gradient(135deg, var(--gold-primary) 0%, var(--gold-secondary) 30%, var(--gold-tertiary) 100%);
  color: #ffffff !important;
  border: none;
  padding: 0.9rem 2.2rem;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 30px;
  box-shadow: 
    0 8px 25px rgba(212, 175, 55, 0.4),
    0 0 15px rgba(255, 255, 255, 0.3) inset;
  margin-top: 1rem;
  position: relative;
  overflow: hidden;
  min-width: 200px;
}

.luxury-perfume-homepage.dark-mode .shop-now-button {
  box-shadow: 
    0 8px 25px rgba(212, 175, 55, 0.6),
    0 0 15px rgba(255, 255, 255, 0.2) inset;
}

.shop-now-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: 0.5s;
}

.shop-now-button:hover::before {
  left: 100%;
}

.shop-now-button:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 
    0 15px 35px rgba(212, 175, 55, 0.5),
    0 0 20px rgba(255, 255, 255, 0.4) inset;
  background: linear-gradient(135deg, #e6c158 0%, var(--gold-primary) 30%, var(--gold-secondary) 100%);
}

@media (max-width: 767px) {
  .shop-now-button {
    padding: 0.9rem 2rem;
    font-size: 0.85rem;
    letter-spacing: 2px;
    min-width: 180px;
    margin-top: 0;
  }
}

.button-icon {
  font-size: 1.1rem;
  font-weight: bold;
}

/* ========== FLOATING BRANDS - FIXED MARQUEE (NO BLINKING/SHAKING) ========== */
.floating-brands {
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  z-index: 5;
  overflow: hidden;
  pointer-events: auto;
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  mask-image: linear-gradient(
    to right,
    transparent,
    black 10%,
    black 90%,
    transparent
  );
}

@media (max-width: 767px) {
  .floating-brands {
    bottom: 20px;
    height: 50px;
    mask-image: linear-gradient(
      to right,
      transparent,
      black 5%,
      black 95%,
      transparent
    );
  }
}

@media (min-width: 768px) and (max-width: 1023px) {
  .floating-brands {
    bottom: 50px;
  }
}

@media (min-width: 1024px) {
  .floating-brands {
    bottom: 70px;
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
  gap: 4rem;
  padding: 0.5rem 0;
  align-items: center;
  width: max-content;
  will-change: transform;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  animation: marquee-ltr 30s linear infinite;
  animation-play-state: running;
}

.marquee-track.rtl-animation {
  animation: marquee-rtl 30s linear infinite;
}

/* Fix for smooth animation without blinking */
@keyframes marquee-ltr {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

@keyframes marquee-rtl {
  0% {
    transform: translateX(-50%);
  }
  100% {
    transform: translateX(0);
  }
}

/* Brand Item Container */
.brand-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Brand Link Wrapper */
.brand-link {
  text-decoration: none;
  display: block;
  transition: all 0.3s ease;
  padding: 0 1rem;
}

.brand-link:hover {
  transform: translateY(-3px);
}

/* Brand Logo */
.brand-logo {
  height: 35px;
  width: auto;
  max-width: 140px;
  object-fit: contain;
  object-position: center;
  opacity: 0.9;
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.luxury-perfume-homepage.dark-mode .brand-logo {
  filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.5)) 
          brightness(1.1) 
          contrast(1.1);
  opacity: 0.95;
}

.brand-link:hover .brand-logo {
  opacity: 1;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.4)) 
          brightness(1.15);
  transform: scale(1.1);
}

/* Responsive logo sizes */
@media (max-width: 767px) {
  .brand-logo {
    height: 25px;
    max-width: 100px;
  }
  
  .marquee-track {
    gap: 2.5rem;
  }
}

@media (min-width: 1024px) {
  .brand-logo {
    height: 40px;
    max-width: 160px;
  }
}

/* For RTL languages, we need to handle the marquee differently */
.luxury-perfume-homepage.rtl-direction .floating-brands {
  direction: rtl;
}

.luxury-perfume-homepage.rtl-direction .marquee-container {
  text-align: right;
}

/* ========== MAIN CONTENT SECTION ========== */
.main-content-section {
  margin-top: 0;
  padding-top: 2rem;
  background: var(--bg-primary);
  padding: 2rem 1rem;
}

@media (min-width: 640px) {
  .main-content-section {
    padding: 3rem 1.5rem 5rem;
  }
}

@media (min-width: 1024px) {
  .main-content-section {
    padding: 4rem 2rem 6rem;
  }
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* ========== SECTION HEADER WITH EXPLORE MORE ========== */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

@media (min-width: 1024px) {
  .section-header {
    margin-bottom: 2.5rem;
  }
}

.section-title {
  font-size: 1.8rem;
  font-weight: 400;
  color: var(--text-primary);
  letter-spacing: 2px;
  margin: 0;
}

@media (min-width: 768px) {
  .section-title {
    font-size: 2rem;
    letter-spacing: 3px;
  }
}

@media (min-width: 1024px) {
  .section-title {
    font-size: 2.5rem;
  }
}

.section-header-right {
  display: flex;
  align-items: center;
}

.explore-more-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gold-primary);
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.explore-more-link:hover {
  background: rgba(212, 175, 55, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
}

.luxury-perfume-homepage.dark-mode .explore-more-link {
  background: rgba(212, 175, 55, 0.15);
}

.explore-icon {
  font-size: 0.9rem;
  font-weight: bold;
}

/* ========== MAIN CONTENT LAYOUT - 3 COLUMNS ON MOBILE ========== */
.main-content-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .main-content-layout {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    align-items: start;
  }
}

@media (min-width: 1024px) {
  .main-content-layout {
    gap: 2rem;
  }
}

/* ========== FEATURED BRANDS SECTION - 2 COLUMNS ========== */
.featured-brands-section {
  grid-column: span 2;
}

/* Brands Grid - 2 columns on mobile/tablet, 3 on desktop */
.brands-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

@media (min-width: 1024px) {
  .brands-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }
}

/* Brand Card - Full Image with Overlay */
.brand-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.brand-card {
  position: relative;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: var(--card-shadow);
  height: 250px;
  opacity: 0;
  transform: translateY(10px);
}

.luxury-perfume-homepage.dark-mode .brand-card {
  box-shadow: var(--card-shadow);
}

.brand-card.in-view {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.4s ease;
}

@media (min-width: 768px) {
  .brand-card {
    height: 280px;
    border-radius: 20px;
  }
  
  .brand-card:hover {
    border-color: rgba(212, 175, 55, 0.4);
    transform: translateY(-8px);
    box-shadow:
      0 20px 40px rgba(212, 175, 55, 0.15),
      0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  .luxury-perfume-homepage.dark-mode .brand-card:hover {
    box-shadow:
      0 20px 40px rgba(212, 175, 55, 0.25),
      0 8px 16px rgba(0, 0, 0, 0.3);
  }
}

@media (min-width: 1024px) {
  .brand-card {
    height: 300px;
  }
}

/* Brand Image Full Coverage */
.brand-image-full {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: var(--bg-secondary);
}

.brand-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 768px) {
  .brand-card:hover .brand-image {
    transform: scale(1.08);
  }
}

/* Gradient Overlay for Text Readability */
.image-gradient-overlay {
  position: absolute;
  inset: 0;
  background: var(--overlay-gradient);
  pointer-events: none;
}

/* Brand Info Overlay */
.brand-info-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.2rem;
  z-index: 2;
  pointer-events: none;
}

@media (min-width: 768px) {
  .brand-info-overlay {
    padding: 1.5rem;
  }
}

.brand-name {
  font-size: 1rem;
  color: #ffffff;
  letter-spacing: 1.5px;
  margin: 0 0 0.4rem 0;
  font-weight: 600;
  text-transform: uppercase;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

@media (min-width: 768px) {
  .brand-name {
    font-size: 1.1rem;
    letter-spacing: 2px;
  }
}

.brand-signature {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 0.8rem 0;
  font-style: italic;
  line-height: 1.3;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

@media (min-width: 768px) {
  .brand-signature {
    font-size: 0.85rem;
  }
}

/* Product Count Display */
.product-count {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  pointer-events: none;
}

.count-number {
  font-size: 1rem;
  font-weight: 700;
  color: var(--gold-primary);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.count-label {
  font-size: 0.7rem;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* ========== OFFER SIDEBAR - 1 COLUMN ========== */
.offer-sidebar {
  grid-column: span 1;
}

@media (min-width: 768px) {
  .offer-sidebar {
    grid-column: span 1;
  }
}

/* Offer Card - Full Image Dominant */
.offer-card {
  background: var(--bg-secondary);
  border: 2px solid var(--gold-primary);
  border-radius: 20px;
  overflow: hidden;
  box-shadow:
    0 10px 25px rgba(212, 175, 55, 0.15),
    0 5px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(10px);
  height: 450px;
  position: relative;
}

.luxury-perfume-homepage.dark-mode .offer-card {
  box-shadow:
    0 10px 25px rgba(212, 175, 55, 0.25),
    0 5px 15px rgba(0, 0, 0, 0.2);
}

.offer-card.in-view {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.4s ease 0.1s;
}

@media (min-width: 768px) {
  .offer-card {
    border-radius: 24px;
    height: 500px;
    box-shadow:
      0 15px 35px rgba(212, 175, 55, 0.15),
      0 5px 15px rgba(0, 0, 0, 0.08);
  }
  
  .luxury-perfume-homepage.dark-mode .offer-card {
    box-shadow:
      0 15px 35px rgba(212, 175, 55, 0.25),
      0 5px 15px rgba(0, 0, 0, 0.2);
  }
}

@media (min-width: 1024px) {
  .offer-card {
    height: 550px;
  }
}

/* Offer Badge */
.offer-badge {
  background: var(--offer-badge);
  color: #ffffff;
  text-align: center;
  padding: 0.7rem;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  line-height: 1.2;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3;
}

@media (min-width: 768px) {
  .offer-badge {
    padding: 1rem;
    font-size: 0.9rem;
    letter-spacing: 2px;
  }
}

/* Offer Content */
.offer-content {
  position: relative;
  height: 100%;
}

/* Offer Image Full Coverage */
.offer-image-full {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(135deg, #f8f5f0 0%, #ffffff 100%);
}

.luxury-perfume-homepage.dark-mode .offer-image-full {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
}

.offer-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter: brightness(0.95);
}

.luxury-perfume-homepage.dark-mode .offer-image {
  filter: brightness(0.85);
}

/* Offer Gradient Overlay */
.offer-gradient-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, 
    transparent 0%, 
    rgba(0, 0, 0, 0.3) 40%, 
    rgba(0, 0, 0, 0.7) 100%);
  pointer-events: none;
}

/* Offer Details Overlay */
.offer-details-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  z-index: 2;
  text-align: center;
}

@media (min-width: 768px) {
  .offer-details-overlay {
    padding: 2rem;
  }
}

.offer-title {
  font-size: 1.4rem;
  color: #ffffff;
  letter-spacing: 1.5px;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
  line-height: 1.2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

@media (min-width: 768px) {
  .offer-title {
    font-size: 1.6rem;
    letter-spacing: 2px;
  }
}

@media (min-width: 1024px) {
  .offer-title {
    font-size: 1.8rem;
  }
}

.offer-subtitle {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
  font-style: italic;
  line-height: 1.3;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

@media (min-width: 768px) {
  .offer-subtitle {
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }
}

.offer-pricing {
  margin: 1rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

@media (min-width: 768px) {
  .offer-pricing {
    margin: 1.5rem 0;
    gap: 1.5rem;
  }
}

.old-price {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: line-through;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

@media (min-width: 768px) {
  .old-price {
    font-size: 1.2rem;
  }
}

.new-price {
  font-size: 1.8rem;
  color: var(--gold-primary);
  font-weight: 800;
  text-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(212, 175, 55, 0.5);
  line-height: 1;
}

@media (min-width: 768px) {
  .new-price {
    font-size: 2rem;
  }
}

/* Buy Now Button */
.buy-now-button {
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
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  width: 100%;
  pointer-events: auto;
}

.buy-now-button:active {
  transform: scale(0.98);
  background: linear-gradient(135deg, #e6c158 0%, var(--gold-primary) 100%);
}

@media (min-width: 768px) {
  .buy-now-button {
    padding: 1rem 2rem;
    font-size: 1rem;
    border-radius: 16px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
  }
  
  .buy-now-button:hover {
    background: linear-gradient(135deg, #e6c158 0%, var(--gold-primary) 100%);
    transform: translateY(-3px) scale(1.02);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
  }
}

/* ========== PERFORMANCE & ACCESSIBILITY ========== */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  .marquee-track { animation: none; }
  .brand-card, .offer-card { opacity: 1; transform: none; }
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .brand-image, .offer-image { image-rendering: crisp-edges; }
}

@media (max-width: 767px) and (orientation: landscape) {
  .banner-video-container { height: 220px; min-height: 220px; }
  .hero-banner { height: 260px; min-height: 260px; }
  .brand-card { height: 220px; }
  .offer-card { height: 400px; }
}

@media print {
  .hero-banner, .floating-brands, .shop-now-button, .buy-now-button { display: none; }
  .main-content-section { padding: 1rem; }
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  .luxury-perfume-homepage {
    --text-primary: #000000;
    --gold-primary: #b8860b;
  }
  
  .luxury-perfume-homepage.dark-mode {
    --text-primary: #ffffff;
    --gold-primary: #ffd700;
  }
  
  .brand-name-large,
  .section-title,
  .offer-title,
  .brand-name {
    font-weight: 900;
  }
}

/* Reduce Transparency for Accessibility */
@media (prefers-reduced-transparency: reduce) {
  .glass-card {
    background: var(--bg-secondary);
    backdrop-filter: none;
  }
  .image-gradient-overlay,
  .offer-gradient-overlay {
    background: rgba(0, 0, 0, 0.7);
  }
}
</style>