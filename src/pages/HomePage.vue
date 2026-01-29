<!-- src/pages/HomePage.vue - FULLY UPDATED WITH STORE INTEGRATION -->
<template>
  <div class="luxury-perfume-homepage" :class="{ 'dark-mode': isDarkMode, 'rtl-direction': isRTL, 'ltr-direction': !isRTL }">
    <!-- Loading Spinner -->
    <div v-if="homepageStore.isLoading" class="loading-overlay">
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
          <div><strong>Error:</strong> {{ homepageStore.error || 'None' }}</div>
          <div><strong>Brands:</strong> {{ featuredBrands.length }}</div>
          <div><strong>Offers:</strong> {{ activeOffers.length }}</div>
          <div><strong>Listening:</strong> {{ homepageStore.isListening ? 'Yes' : 'No' }}</div>
          <div><strong>Last Update:</strong> {{ homepageStore.homepageData.lastUpdated ? formatDate(homepageStore.homepageData.lastUpdated) : 'Never' }}</div>
          <div class="debug-actions">
            <button @click="forceRefreshStoreData">🔄 Refresh</button>
            <button @click="homepageStore.clearCache()">🧹 Clear Cache</button>
          </div>
        </div>
      </details>
    </div>

    <!-- Hero Banner with Fixed Background -->
    <section class="hero-banner">
      <!-- Video-Style Banner Container -->
      <div class="banner-video-container">
        <!-- Background Image from store -->
        <div class="hero-background" :style="{ backgroundImage: `url('${heroBanner.imageUrl}')` }"></div>
        
        <!-- Gradient Overlays -->
        <div class="gradient-overlay-top"></div>
        <div class="gradient-overlay-bottom"></div>
      </div>
      
      <!-- Content Overlay -->
      <div class="banner-container">
        <!-- Brand Identity -->
        <div class="banner-left">
          <div class="glass-card luxury-branding">
            <h1 class="brand-name-large">{{ heroBanner.title || t('brandName') }}</h1>
            
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
      
      <!-- Floating Brand Logos from store -->
      <div class="floating-brands">
        <div class="marquee-track">
          <template v-if="marqueeBrands.length > 0">
            <router-link
              v-for="brand in marqueeBrands"
              :key="brand.id"
              :to="`/brand/${brand.slug}`"
              class="brand-link"
            >
              <img :src="brand.logo" :alt="brand.name" class="brand-logo" @error="handleImageError($event, brand)" />
            </router-link>
            <!-- Duplicate for seamless loop -->
            <router-link
              v-for="brand in marqueeBrands"
              :key="'dup-' + brand.id"
              :to="`/brand/${brand.slug}`"
              class="brand-link"
            >
              <img :src="brand.logo" :alt="brand.name" class="brand-logo" @error="handleImageError($event, brand)" />
            </router-link>
          </template>
          <div v-else class="no-brands-message">
            <span>{{ t('loadingBrands') }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Brands & Offer Section -->
    <section class="main-content-section">
      <div class="content-container">
        <!-- MOBILE LAYOUT -->
        <div class="mobile-content-layout">
          <div class="section-header">
            <h2 class="section-title">{{ t('featuredBrands') }}</h2>
            <p class="section-subtitle">{{ t('luxuryCollections') }}</p>
          </div>
          
          <div class="mobile-grid-container">
            <!-- Left side: Brands Grid -->
            <div class="mobile-brands-section">
              <div v-if="featuredBrands.length > 0" class="brands-grid-mobile">
                <router-link
                  v-for="brand in featuredBrands"
                  :key="brand.id"
                  :to="`/brand/${brand.slug}`"
                  class="brand-card-link-mobile"
                >
                  <div class="brand-card-mobile">
                    <div class="brand-image-wrapper-mobile">
                      <img 
                        :src="brand.image" 
                        :alt="brand.name" 
                        loading="lazy" 
                        @error="handleImageError($event, brand)"
                      />
                      <div class="brand-overlay-mobile"></div>
                    </div>
                    <div class="brand-info-mobile">
                      <h3 class="brand-name-mobile">{{ brand.name }}</h3>
                      <p class="brand-signature-mobile">{{ brand.signature }}</p>
                      <p class="brand-price-mobile">{{ brand.price }} {{ t('currencyLE') }}</p>
                    </div>
                  </div>
                </router-link>
              </div>
              <div v-else class="no-data-message">
                <p>{{ t('noBrandsAvailable') }}</p>
                <button @click="forceRefreshStoreData" class="refresh-button">
                  {{ t('refresh') }}
                </button>
              </div>
            </div>
            
            <!-- Right side: Today's Offer from store -->
            <div class="mobile-offer-section">
              <div v-if="activeOffers.length > 0" class="offer-card-mobile">
                <div class="offer-badge-mobile">{{ t('todaysExclusiveOffer') }}</div>
                <div class="offer-content-mobile">
                  <div class="offer-image-wrapper-mobile">
                    <img
                      :src="activeOffers[0].imageUrl"
                      :alt="activeOffers[0].title"
                      class="offer-bottle-mobile"
                      loading="lazy"
                      @error="handleImageError($event, activeOffers[0])"
                    />
                  </div>
                  <div class="offer-details-mobile">
                    <h3 class="offer-title-mobile">{{ activeOffers[0].title }}</h3>
                    <p class="offer-subtitle-mobile">{{ activeOffers[0].subtitle }}</p>
                    <div class="offer-pricing-mobile">
                      <span class="old-price-mobile">{{ activeOffers[0].oldPrice }} {{ t('currencyLE') }}</span>
                      <span class="new-price-mobile">{{ activeOffers[0].newPrice }} {{ t('currencyLE') }}</span>
                    </div>
                    <button class="buy-now-button-mobile" @click="navigateToOffer(activeOffers[0])">
                      <span class="button-text">{{ t('buyNow') }}</span>
                    </button>
                  </div>
                </div>
              </div>
              <div v-else class="no-offer-message">
                <p>{{ t('noOffersAvailable') }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- DESKTOP LAYOUT -->
        <div class="desktop-content-layout">
          <!-- Featured Brands Grid from store -->
          <div class="featured-brands">
            <div class="section-header">
              <h2 class="section-title">{{ t('featuredBrands') }}</h2>
              <p class="section-subtitle">{{ t('luxuryCollections') }}</p>
            </div>
            <div v-if="featuredBrands.length > 0" class="brands-grid">
              <router-link
                v-for="brand in featuredBrands"
                :key="brand.id"
                :to="`/brand/${brand.slug}`"
                class="brand-card-link"
              >
                <div class="brand-card">
                  <div class="brand-image-wrapper">
                    <img 
                      :src="brand.image" 
                      :alt="brand.name" 
                      loading="lazy"
                      @error="handleImageError($event, brand)"
                    />
                    <div class="brand-overlay"></div>
                    <div class="brand-glow"></div>
                    <div class="gold-sparkles"></div>
                  </div>
                  <div class="brand-info">
                    <h3 class="brand-name">{{ brand.name }}</h3>
                    <p class="brand-signature">{{ brand.signature }}</p>
                    <p class="brand-price">{{ brand.price }} {{ t('currencyLE') }}</p>
                  </div>
                </div>
              </router-link>
            </div>
            <div v-else class="no-data-message">
              <p>{{ t('noBrandsAvailable') }}</p>
              <button @click="forceRefreshStoreData" class="refresh-button">
                {{ t('refresh') }}
              </button>
            </div>
          </div>

          <!-- Today's Exclusive Offer from store -->
          <aside class="offer-sidebar">
            <div v-if="activeOffers.length > 0" class="offer-card">
              <div class="offer-badge">{{ t('todaysExclusiveOffer') }}</div>
              <div class="offer-content">
                <div class="offer-image-wrapper">
                  <img
                    :src="activeOffers[0].imageUrl"
                    :alt="activeOffers[0].title"
                    class="offer-bottle"
                    loading="lazy"
                    @error="handleImageError($event, activeOffers[0])"
                  />
                  <div class="offer-glow"></div>
                </div>
                <div class="offer-details">
                  <h3 class="offer-title">{{ activeOffers[0].title }}</h3>
                  <p class="offer-subtitle">{{ activeOffers[0].subtitle }}</p>
                  <div class="offer-pricing">
                    <span class="old-price">{{ activeOffers[0].oldPrice }} {{ t('currencyLE') }}</span>
                    <span class="new-price">{{ activeOffers[0].newPrice }} {{ t('currencyLE') }}</span>
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

const router = useRouter()
const languageStore = useLanguageStore()
const homepageStore = useHomepageStore()
const { t, formatDate } = languageStore

// Development mode check
const isDevelopment = import.meta.env.DEV

// Store data - directly from homepage store (reactive)
const heroBanner = computed(() => homepageStore.homepageData.heroBanner)
const featuredBrands = computed(() => homepageStore.homepageData.featuredBrands || [])
const activeOffers = computed(() => homepageStore.homepageData.activeOffers || [])
const marqueeBrands = computed(() => homepageStore.homepageData.marqueeBrands || [])

// Dark mode from store
const isDarkMode = computed(() => homepageStore.homepageData.settings?.isDarkMode || false)

// RTL based on language
const isRTL = computed(() => {
  const currentLang = languageStore.currentLanguage;
  return currentLang === 'ar' || currentLang === 'fa' || currentLang === 'he';
})

// Debug info
const debugInfo = ref({
  storeLoaded: false,
  lastUpdate: ''
})

// Watch for store updates
watch(() => homepageStore.homepageData, (newData) => {
  console.log('🏪 Homepage data updated:', {
    brands: newData.featuredBrands?.length || 0,
    offers: newData.activeOffers?.length || 0,
    lastUpdated: newData.lastUpdated || 'Never'
  })
  
  debugInfo.value = {
    storeLoaded: true,
    lastUpdate: newData.lastUpdated || 'Never'
  }
  
  // Apply dark mode if changed
  if (newData.settings?.isDarkMode) {
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

// Force refresh function
const forceRefreshStoreData = async () => {
  console.log('🔄 Force refreshing homepage data...')
  try {
    await homepageStore.forceRefresh()
    console.log('✅ Store data force refreshed')
  } catch (error: any) {
    console.error('❌ Error refreshing store:', error.message)
  }
}

// Handle image loading errors
const handleImageError = (event: Event, item: any) => {
  const img = event.target as HTMLImageElement
  console.warn(`⚠️ Image failed to load: ${img.src}`)
  
  // Set a fallback image
  if (item && 'image' in item) {
    img.src = '/images/placeholder-brand.jpg'
  } else if (item && 'imageUrl' in item) {
    img.src = '/images/placeholder-offer.jpg'
  } else if (item && 'logo' in item) {
    img.src = '/images/placeholder-logo.png'
  }
}

// Navigation functions
const navigateToShop = () => {
  router.push('/shop')
}

const navigateToOffer = (offer: any) => {
  if (offer?.slug) {
    router.push(`/offer/${offer.slug}`)
  } else {
    router.push('/offers')
  }
}

onMounted(async () => {
  console.log('🏠 HomePage.vue mounted - Initializing...')
  document.documentElement.style.scrollBehavior = 'smooth'
  
  // Clear any old cache first
  homepageStore.clearCache()
  
  // Load homepage data from store
  try {
    console.log('📥 Loading homepage data from Firebase...')
    await homepageStore.loadHomepageData()
    
    console.log('✅ Homepage data loaded:', {
      brands: featuredBrands.value.length,
      offers: activeOffers.value.length,
      marquee: marqueeBrands.value.length,
      darkMode: isDarkMode.value
    })
    
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
    document.querySelectorAll('.brand-card, .offer-card, .brand-card-mobile, .offer-card-mobile').forEach((el) => {
      observer.observe(el)
    })
  }, 100)
})

onUnmounted(() => {
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
  --overlay-gradient: linear-gradient(to bottom, transparent 60%, rgba(255, 255, 255, 0.95));
  
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
  --overlay-gradient: linear-gradient(to bottom, transparent 40%, rgba(26, 26, 26, 0.95));
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

/* Brand price display */
.brand-price,
.brand-price-mobile {
  color: var(--gold-primary);
  font-weight: 600;
  font-size: 0.9rem;
  margin-top: 5px;
}

.brand-price-mobile {
  font-size: 0.75rem;
}

/* RTL Direction Support */
.luxury-perfume-homepage.rtl-direction {
  direction: rtl;
  text-align: right;
}

.luxury-perfume-homepage.rtl-direction .section-header,
.luxury-perfume-homepage.rtl-direction .brand-info,
.luxury-perfume-homepage.rtl-direction .offer-details,
.luxury-perfume-homepage.rtl-direction .brand-info-mobile,
.luxury-perfume-homepage.rtl-direction .offer-details-mobile {
  text-align: right;
}

.luxury-perfume-homepage.rtl-direction .premium-badge {
  flex-direction: row-reverse;
}

.luxury-perfume-homepage.rtl-direction .shop-now-button,
.luxury-perfume-homepage.rtl-direction .buy-now-button,
.luxury-perfume-homepage.rtl-direction .buy-now-button-mobile {
  flex-direction: row-reverse;
}

.luxury-perfume-homepage.rtl-direction .marquee-track {
  animation-direction: reverse;
}

/* LTR Direction Support */
.luxury-perfume-homepage.ltr-direction {
  direction: ltr;
  text-align: left;
}

.luxury-perfume-homepage.ltr-direction .section-header,
.luxury-perfume-homepage.ltr-direction .brand-info,
.luxury-perfume-homepage.ltr-direction .offer-details,
.luxury-perfume-homepage.ltr-direction .brand-info-mobile,
.luxury-perfume-homepage.ltr-direction .offer-details-mobile {
  text-align: left;
}

.luxury-perfume-homepage.ltr-direction .premium-badge {
  flex-direction: row;
}

.luxury-perfume-homepage.ltr-direction .shop-now-button,
.luxury-perfume-homepage.ltr-direction .buy-now-button,
.luxury-perfume-homepage.ltr-direction .buy-now-button-mobile {
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

/* Optimized Background Image - USING LOCAL IMAGE */
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
  font-size: 2.2rem;
  letter-spacing: 3px;
  margin: 0 0 1.5rem 0;
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
    font-size: 1.8rem;
    letter-spacing: 2px;
    margin-bottom: 1rem;
    color: #ffffff !important;
    text-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.6),
      0 4px 16px rgba(0, 0, 0, 0.5);
  }
}

@media (min-width: 1024px) {
  .brand-name-large {
    font-size: 3rem;
    letter-spacing: 4px;
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

/* ========== FLOATING BRANDS - UPDATED TO START FROM BEGINNING ========== */
.floating-brands {
  position: absolute;
  bottom: 40px;
  left: 0;
  right: 0;
  z-index: 5;
  overflow: hidden;
  pointer-events: auto;
  width: 100%;
}

@media (max-width: 767px) {
  .floating-brands {
    bottom: 20px;
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

.marquee-track {
  display: flex;
  gap: 4rem;
  animation: marquee 30s linear infinite;
  will-change: transform;
  padding: 0.5rem 0;
  align-items: center;
  width: max-content;
}

/* Brand Link Wrapper */
.brand-link {
  text-decoration: none;
  display: block;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.brand-link:hover {
  transform: translateY(-3px);
}

/* Brand Logo */
.brand-logo {
  height: 30px;
  width: auto;
  max-width: 120px;
  object-fit: contain;
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
}

@media (min-width: 1024px) {
  .brand-logo {
    height: 35px;
    max-width: 150px;
  }
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-33.33%); }
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

/* ========== MOBILE LAYOUT (ONLY FOR MOBILE) ========== */
.mobile-content-layout {
  display: block;
}

@media (min-width: 1024px) {
  .mobile-content-layout {
    display: none;
  }
}

/* Mobile Section Header */
.mobile-content-layout .section-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.mobile-content-layout .section-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--text-primary);
  letter-spacing: 2px;
  margin: 0 0 0.5rem 0;
}

.mobile-content-layout .section-subtitle {
  font-size: 0.8rem;
  color: var(--gold-primary);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 500;
}

/* Mobile Grid Container - 2×3 Grid + Offer Side by Side */
.mobile-grid-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (min-width: 480px) {
  .mobile-grid-container {
    flex-direction: row;
    gap: 1rem;
    align-items: stretch;
  }
}

/* Mobile Brands Section - Left side */
.mobile-brands-section {
  flex: 1;
  min-width: 0;
}

/* Mobile Brands Grid - 2×3 Layout (All 6 brands) */
.brands-grid-mobile {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .brands-grid-mobile {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Mobile Brand Cards - Compact */
.brand-card-link-mobile {
  text-decoration: none;
  color: inherit;
  display: block;
}

.brand-card-mobile {
  position: relative;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.04);
  height: 100%;
  display: flex;
  flex-direction: column;
  opacity: 0;
  transform: translateY(10px);
}

.luxury-perfume-homepage.dark-mode .brand-card-mobile {
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
}

.brand-card-mobile.in-view {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.4s ease;
}

.brand-card-mobile:active {
  transform: scale(0.98);
}

/* Mobile Brand Image */
.brand-image-wrapper-mobile {
  position: relative;
  height: 100px;
  overflow: hidden;
  flex-shrink: 0;
}

.brand-image-wrapper-mobile img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-overlay-mobile {
  position: absolute;
  inset: 0;
  background: var(--overlay-gradient);
}

/* Mobile Brand Info */
.brand-info-mobile {
  padding: 0.6rem;
  text-align: center;
  background: var(--bg-secondary);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand-name-mobile {
  font-size: 0.7rem;
  color: var(--text-primary);
  letter-spacing: 0.8px;
  margin: 0 0 0.2rem 0;
  font-weight: 600;
  text-transform: uppercase;
  line-height: 1.1;
}

.brand-signature-mobile {
  font-size: 0.65rem;
  color: var(--text-secondary);
  margin: 0;
  font-style: italic;
  line-height: 1.2;
}

/* Mobile Offer Section - Right side */
.mobile-offer-section {
  flex: 1;
  min-width: 0;
}

@media (min-width: 480px) {
  .mobile-offer-section {
    max-width: 180px;
  }
}

@media (min-width: 640px) {
  .mobile-offer-section {
    max-width: 200px;
  }
}

/* Mobile Offer Card */
.offer-card-mobile {
  background: var(--bg-secondary);
  border: 2px solid var(--gold-primary);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.15);
  transition: all 0.3s ease;
  height: 100%;
  opacity: 0;
  transform: translateY(10px);
}

.luxury-perfume-homepage.dark-mode .offer-card-mobile {
  box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
}

.offer-card-mobile.in-view {
  opacity: 1;
  transform: translateY(0);
  transition: all 0.4s ease 0.1s;
}

/* Mobile Offer Badge - Fixed font consistency */
.offer-badge-mobile {
  background: linear-gradient(to right, var(--gold-tertiary), var(--gold-primary));
  color: #ffffff;
  text-align: center;
  padding: 0.5rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  line-height: 1.2;
}

/* Mobile Offer Content */
.offer-content-mobile {
  display: flex;
  flex-direction: column;
  height: calc(100% - 36px);
}

.offer-image-wrapper-mobile {
  padding: 0.8rem;
  background: linear-gradient(135deg, #f9f7f2 0%, #ffffff 100%);
  text-align: center;
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.luxury-perfume-homepage.dark-mode .offer-image-wrapper-mobile {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
}

.offer-bottle-mobile {
  max-height: 120px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.1));
}

.luxury-perfume-homepage.dark-mode .offer-bottle-mobile {
  filter: drop-shadow(0 5px 10px rgba(0, 0, 0, 0.3));
}

/* Mobile Offer Details - Fixed font consistency */
.offer-details-mobile {
  padding: 0.8rem;
  text-align: center;
  background: var(--bg-secondary);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.offer-title-mobile {
  font-size: 0.9rem;
  color: var(--text-primary);
  letter-spacing: 1px;
  margin: 0 0 0.3rem 0;
  font-weight: 600;
  line-height: 1.1;
}

.offer-subtitle-mobile {
  font-size: 0.7rem;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
  font-style: italic;
  line-height: 1.2;
}

.offer-pricing-mobile {
  margin: 0.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  align-items: center;
}

.old-price-mobile {
  font-size: 0.7rem;
  color: var(--text-tertiary);
  text-decoration: line-through;
}

.new-price-mobile {
  font-size: 1.1rem;
  color: var(--gold-primary);
  font-weight: 800;
  line-height: 1;
}

/* Mobile Buy Now Button */
.buy-now-button-mobile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--gold-primary) 0%, var(--gold-secondary) 100%);
  color: #ffffff;
  border: none;
  padding: 0.6rem 0.8rem;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  box-shadow: 0 3px 8px rgba(212, 175, 55, 0.3);
  width: 100%;
  margin-top: 0.5rem;
}

.buy-now-button-mobile:active {
  transform: scale(0.95);
  background: linear-gradient(135deg, #e6c158 0%, var(--gold-primary) 100%);
}

/* ========== DESKTOP LAYOUT (ORIGINAL - UNCHANGED) ========== */
.desktop-content-layout {
  display: none;
}

@media (min-width: 1024px) {
  .desktop-content-layout {
    display: flex;
    flex-direction: row;
    gap: 4rem;
  }
}

/* Desktop Section Header */
.desktop-content-layout .section-header {
  text-align: center;
  margin-bottom: 2rem;
}

@media (min-width: 1024px) {
  .desktop-content-layout .section-header {
    text-align: left;
    margin-bottom: 2.5rem;
  }
}

.desktop-content-layout .section-title {
  font-size: 2rem;
  font-weight: 400;
  color: var(--text-primary);
  letter-spacing: 2px;
  margin: 0 0 0.5rem 0;
}

@media (min-width: 640px) {
  .desktop-content-layout .section-title {
    font-size: 2.2rem;
    letter-spacing: 3px;
  }
}

@media (min-width: 1024px) {
  .desktop-content-layout .section-title {
    font-size: 2.5rem;
  }
}

.desktop-content-layout .section-subtitle {
  font-size: 0.9rem;
  color: var(--gold-primary);
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 500;
}

@media (min-width: 640px) {
  .desktop-content-layout .section-subtitle {
    font-size: 1rem;
    letter-spacing: 2px;
  }
}

/* Desktop Featured Brands */
.featured-brands {
  flex: 1;
}

/* Desktop Brands Grid */
.brands-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* Desktop Brand Cards */
.brand-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.brand-card {
  position: relative;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateY(20px);
  box-shadow: var(--card-shadow);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.brand-card.in-view {
  opacity: 1;
  transform: translateY(0);
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

/* Desktop Brand Image */
.brand-image-wrapper {
  position: relative;
  height: 180px;
  overflow: hidden;
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .brand-image-wrapper {
    height: 220px;
  }
}

@media (min-width: 1024px) {
  .brand-image-wrapper {
    height: 250px;
  }
}

.brand-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.brand-card:hover .brand-image-wrapper img {
  transform: scale(1.08);
}

.brand-overlay {
  position: absolute;
  inset: 0;
  background: var(--overlay-gradient);
}

.brand-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.4s ease;
}

.brand-card:hover .brand-glow {
  opacity: 1;
}

.gold-sparkles {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 20% 30%, rgba(255, 215, 0, 0.4) 0%, transparent 5%),
    radial-gradient(circle at 80% 70%, rgba(212, 175, 55, 0.4) 0%, transparent 5%);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
}

.brand-card:hover .gold-sparkles {
  opacity: 0.6;
}

/* Desktop Brand Info */
.brand-info {
  padding: 1.2rem;
  text-align: center;
  background: var(--bg-secondary);
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

@media (min-width: 640px) {
  .brand-info {
    padding: 1.5rem;
  }
}

.brand-name {
  font-size: 0.95rem;
  color: var(--text-primary);
  letter-spacing: 1.5px;
  margin: 0 0 0.4rem 0;
  font-weight: 600;
  text-transform: uppercase;
}

@media (min-width: 640px) {
  .brand-name {
    font-size: 1.1rem;
  }
}

.brand-signature {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0 0 0.8rem 0;
  font-style: italic;
  line-height: 1.3;
}

@media (min-width: 640px) {
  .brand-signature {
    font-size: 0.9rem;
  }
}

/* Desktop Offer Card */
.offer-sidebar {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

@media (min-width: 1024px) {
  .offer-sidebar {
    max-width: 380px;
    align-self: start;
    position: sticky;
    top: 120px;
  }
}

.offer-card {
  background: var(--bg-secondary);
  border: 2px solid var(--gold-primary);
  border-radius: 24px;
  overflow: hidden;
  box-shadow:
    0 15px 35px rgba(212, 175, 55, 0.15),
    0 5px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateY(20px);
}

.luxury-perfume-homepage.dark-mode .offer-card {
  box-shadow:
    0 15px 35px rgba(212, 175, 55, 0.25),
    0 5px 15px rgba(0, 0, 0, 0.2);
}

.offer-card.in-view {
  opacity: 1;
  transform: translateY(0);
}

.offer-badge {
  background: var(--offer-badge);
  color: #ffffff;
  text-align: center;
  padding: 0.8rem;
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
}

@media (min-width: 640px) {
  .offer-badge {
    padding: 1rem;
    font-size: 1rem;
  }
}

.offer-content {
  display: flex;
  flex-direction: column;
}

.offer-image-wrapper {
  padding: 1.5rem;
  background: linear-gradient(135deg, #f8f5f0 0%, #ffffff 100%);
  text-align: center;
  position: relative;
}

.luxury-perfume-homepage.dark-mode .offer-image-wrapper {
  background: linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%);
}

.offer-bottle {
  max-height: 220px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.1));
}

.luxury-perfume-homepage.dark-mode .offer-bottle {
  filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.3));
}

@media (min-width: 640px) {
  .offer-bottle {
    max-height: 250px;
  }
}

.offer-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(212, 175, 55, 0.2) 0%, transparent 70%);
  opacity: 0.5;
}

.offer-details {
  padding: 1.5rem;
  text-align: center;
  background: var(--bg-secondary);
}

@media (min-width: 640px) {
  .offer-details {
    padding: 2rem;
  }
}

.offer-title {
  font-size: 1.8rem;
  color: var(--text-primary);
  letter-spacing: 2px;
  margin: 0 0 0.5rem 0;
  font-weight: 600;
}

@media (min-width: 640px) {
  .offer-title {
    font-size: 2rem;
  }
}

.offer-subtitle {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-style: italic;
}

@media (min-width: 640px) {
  .offer-subtitle {
    font-size: 1rem;
  }
}

.offer-pricing {
  margin: 1.5rem 0;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
}

.old-price {
  font-size: 1.2rem;
  color: var(--text-tertiary);
  text-decoration: line-through;
}

@media (min-width: 640px) {
  .old-price {
    font-size: 1.4rem;
  }
}

.new-price {
  font-size: 2.2rem;
  color: var(--gold-primary);
  font-weight: 800;
  text-shadow: 0 4px 8px rgba(212, 175, 55, 0.3);
}

@media (min-width: 640px) {
  .new-price {
    font-size: 2.5rem;
  }
}

.buy-now-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  background: linear-gradient(135deg, var(--gold-primary) 0%, var(--gold-tertiary) 100%);
  color: #ffffff;
  border: none;
  padding: 0.9rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 2px;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(212, 175, 55, 0.3);
  margin-top: 1rem;
}

.buy-now-button:hover {
  background: linear-gradient(135deg, #e6c158 0%, var(--gold-primary) 100%);
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 15px 30px rgba(212, 175, 55, 0.4);
}

@media (min-width: 640px) {
  .buy-now-button {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
}

/* ========== PERFORMANCE & ACCESSIBILITY ========== */
@media (prefers-reduced-motion: reduce) {
  * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  .marquee-track { animation: none; }
  .brand-card, .offer-card, .brand-card-mobile, .offer-card-mobile { opacity: 1; transform: none; }
}

@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .brand-image-wrapper img, .offer-bottle { image-rendering: crisp-edges; }
}

@media (max-width: 767px) and (orientation: landscape) {
  .banner-video-container { height: 220px; min-height: 220px; }
  .hero-banner { height: 260px; min-height: 260px; }
  .brand-image-wrapper { height: 160px; }
}

@media print {
  .hero-banner, .brands-marquee, .shop-now-button, .buy-now-button { display: none; }
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
  .brand-name,
  .brand-name-mobile,
  .offer-title-mobile {
    font-weight: 900;
  }
}

/* Reduce Transparency for Accessibility */
@media (prefers-reduced-transparency: reduce) {
  .glass-card {
    background: var(--bg-secondary);
    backdrop-filter: none;
  }
}
</style>