<template>
  <div id="vue-app" :class="[isRTL ? 'rtl' : 'ltr', appClasses]" class="min-h-screen-mobile bg-gradient-luxury">
    <!-- Skip to main content for accessibility -->
    <a href="#main-content" class="skip-to-content">
      {{ safeTranslate('skipToContent') }}
    </a>
    
    <!-- SEO Head Component -->
    <SEOHead />
    
    <!-- Header Navigation -->
    <LuxuryHeader />
    
    <!-- Main Content -->
    <main 
      id="main-content" 
      class="main-content"
      :style="mainContentStyle"
    >
      <router-view v-slot="{ Component, route }">
        <!-- Page Transitions -->
        <transition
          :name="route.meta.transition || 'fade'"
          mode="out-in"
          @before-enter="beforeEnter"
          @after-enter="afterEnter"
        >
          <component 
            :is="Component" 
            :key="route.path" 
          />
        </transition>
      </router-view>
    </main>
    
    <!-- Footer -->
    <LuxuryFooter />
    
    <!-- Global Components -->
    <LuxuryCartSidebar />
    <LuxurySearchModal />
    <LuxuryNotificationCenter />
   
    <!-- Loading Overlay -->
    <transition name="fade">
      <div
        v-if="globalLoading"
        class="luxury-loading-overlay fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center safe-top safe-bottom"
      >
        <div class="text-center">
          <div class="luxury-loading-spinner mb-4 md:mb-6"></div>
          <p class="text-gold-light text-lg md:text-xl font-['Cormorant_Garamond'] font-medium">
            {{ safeTranslate('loading') }}
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { useProductsStore } from '@/stores/products'
import { storeToRefs } from 'pinia'

// Luxury Components
import SEOHead from '@/components/UI/SEOHead.vue'
import LuxuryHeader from '@/components/Layout/LuxuryHeader.vue'
import LuxuryFooter from '@/components/Layout/LuxuryFooter.vue'
import LuxuryCartSidebar from '@/components/Cart/LuxuryCartSidebar.vue'
import LuxurySearchModal from '@/components/Search/SearchModal.vue'
import LuxuryNotificationCenter from '@/components/UI/LuxuryNotificationCenter.vue'

// Router
const router = useRouter()

// Stores - Initialize safely
const languageStore = useLanguageStore()
const cartStore = useCartStore()
const authStore = useAuthStore()
const productsStore = useProductsStore()

// State with safe defaults
const { currentLanguage, isRTL, t: translate } = languageStore
const { isTransitioning } = storeToRefs(languageStore)
const { globalLoading } = storeToRefs(productsStore)
const scrollY = ref(0)
const isMobile = ref(false)
const fontsLoaded = ref(false)
const prefersReducedMotion = ref(false)
const headerHeight = ref(64) // Default mobile height

// Performance optimizations
const animationFrameId = ref<number | null>(null)
const lastScrollTime = ref(0)
const SCROLL_THROTTLE_MS = 16 // ~60fps

// Computed properties
const appClasses = computed(() => ({
  'rtl': isRTL,
  'ltr': !isRTL,
  'scroll-locked': (globalLoading || isTransitioning?.value) || false,
  'mobile': isMobile.value,
  'desktop': !isMobile.value,
  'fonts-loaded': fontsLoaded.value,
  'reduced-motion': prefersReducedMotion.value
}))

const mainContentStyle = computed(() => ({
  paddingTop: `${headerHeight.value}px`,
  minHeight: `calc(100dvh - ${headerHeight.value}px)`
}))

// Translations with fallbacks
const appTranslations = {
  skipToContent: { en: 'Skip to main content', ar: 'تخطي إلى المحتوى الرئيسي' },
  loading: { en: 'Loading...', ar: 'جاري التحميل...' },
  offlineTitle: { en: 'Offline', ar: 'غير متصل' },
  offlineMessage: { en: 'Check your connection', ar: 'تحقق من اتصالك' },
  backOnline: { en: 'Back Online', ar: 'عدت للاتصال' },
  connectionRestored: { en: 'Connection restored', ar: 'تم استعادة الاتصال' },
  languageChanged: { en: 'Language Changed', ar: 'تم تغيير اللغة' },
  languageChangedMessage: { en: 'Language updated', ar: 'تم تحديث اللغة' }
}

// Safe translate function
const safeTranslate = (key: string | { [key: string]: string } | undefined) => {
  if (!key) return ''
  
  try {
    if (typeof key === 'string') {
      const translations = appTranslations[key as keyof typeof appTranslations]
      if (translations) {
        return translate(translations) || key
      }
      return translate({ en: key, ar: key }) || key
    }
    return translate(key)
  } catch (error) {
    console.warn('Translation error:', error)
    if (typeof key === 'string') {
      const translations = appTranslations[key as keyof typeof appTranslations]
      if (translations) return translations.en || key
      return key
    }
    return key.en || ''
  }
}

// Performance optimized scroll handler
const handleScroll = () => {
  const now = Date.now()
  if (now - lastScrollTime.value < SCROLL_THROTTLE_MS) return
  
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
  
  animationFrameId.value = requestAnimationFrame(() => {
    scrollY.value = window.scrollY
    const header = document.querySelector('.luxury-header')
    
    if (header) {
      if (scrollY.value > 50) {
        header.classList.add('scrolled', 'shadow-luxury-lg')
      } else {
        header.classList.remove('scrolled', 'shadow-luxury-lg')
      }
    }
    
    triggerScrollAnimations()
    lastScrollTime.value = now
  })
}

const triggerScrollAnimations = () => {
  const elements = document.querySelectorAll('.scroll-fade-in')
  const windowHeight = window.innerHeight
  
  elements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top
    if (elementTop < windowHeight - 100) {
      element.classList.add('visible')
    }
  })
}

// Fix gap issue by measuring header height
const updateHeaderHeight = () => {
  const header = document.querySelector('.luxury-header')
  if (header) {
    const height = header.clientHeight
    headerHeight.value = height
    document.documentElement.style.setProperty('--header-height', `${height}px`)
  }
}

// Methods
const beforeEnter = () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion.value ? 'auto' : 'smooth' })
}

const afterEnter = () => {
  triggerScrollAnimations()
}

const handleResize = () => {
  isMobile.value = window.innerWidth < 768
  updateHeaderHeight()
}

const handleOnlineStatus = () => {
  if (!navigator.onLine) {
    window.dispatchEvent(new CustomEvent('luxury-notification', {
      detail: {
        type: 'warning',
        title: safeTranslate('offlineTitle'),
        message: safeTranslate('offlineMessage'),
        duration: 3000,
        icon: '📡'
      }
    }))
  } else {
    window.dispatchEvent(new CustomEvent('luxury-notification', {
      detail: {
        type: 'success',
        title: safeTranslate('backOnline'),
        message: safeTranslate('connectionRestored'),
        duration: 2000,
        icon: '📶'
      }
    }))
  }
}

const updatePageTitle = () => {
  const routeTitle = router.currentRoute.value.meta.title as string | { [key: string]: string } | undefined
  const appName = safeTranslate({ en: 'Perfume Stock', ar: 'بيرفيوم ستوك' })
  
  if (routeTitle) {
    if (typeof routeTitle === 'object') {
      const title = safeTranslate(routeTitle)
      document.title = `${title} | ${appName}`
    } else {
      const title = safeTranslate(routeTitle)
      document.title = `${title} | ${appName}`
    }
  } else {
    document.title = appName
  }
}

// Language and direction switching
const updateLanguageDirection = () => {
  const html = document.documentElement
  
  // Update lang attribute
  html.setAttribute('lang', currentLanguage)
  
  // Update dir attribute
  if (isRTL) {
    html.setAttribute('dir', 'rtl')
    html.classList.add('rtl')
    html.classList.remove('ltr')
  } else {
    html.setAttribute('dir', 'ltr')
    html.classList.add('ltr')
    html.classList.remove('rtl')
  }
  
  // Update font family based on language
  if (currentLanguage === 'ar') {
    html.style.fontFamily = "'Noto Sans Arabic', 'Inter', system-ui, -apple-system, sans-serif"
  } else {
    html.style.fontFamily = "'Inter', system-ui, -apple-system, sans-serif"
  }
  
  // Update CSS variables for direction
  updateDirectionVariables()
}

const updateDirectionVariables = () => {
  const root = document.documentElement
  
  if (isRTL) {
    root.style.setProperty('--text-start', 'right')
    root.style.setProperty('--text-end', 'left')
    root.style.setProperty('--margin-start', 'margin-right')
    root.style.setProperty('--margin-end', 'margin-left')
    root.style.setProperty('--padding-start', 'padding-right')
    root.style.setProperty('--padding-end', 'padding-left')
    root.style.setProperty('--inset-start', 'right')
    root.style.setProperty('--inset-end', 'left')
  } else {
    root.style.setProperty('--text-start', 'left')
    root.style.setProperty('--text-end', 'right')
    root.style.setProperty('--margin-start', 'margin-left')
    root.style.setProperty('--margin-end', 'margin-right')
    root.style.setProperty('--padding-start', 'padding-left')
    root.style.setProperty('--padding-end', 'padding-right')
    root.style.setProperty('--inset-start', 'left')
    root.style.setProperty('--inset-end', 'right')
  }
}

const setupFontLoading = () => {
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      fontsLoaded.value = true
      document.body.classList.add('fonts-loaded')
    }).catch(() => {
      fontsLoaded.value = true
      document.body.classList.add('fonts-loaded')
    })
  } else {
    setTimeout(() => {
      fontsLoaded.value = true
      document.body.classList.add('fonts-loaded')
    }, 100)
  }
}

const setupReducedMotion = () => {
  prefersReducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
    prefersReducedMotion.value = e.matches
  })
}

// Lifecycle
onMounted(async () => {
  console.log('🛍️ Initializing Luxury Perfume Store...')
  
  // Mark body as loaded to hide preloader
  document.body.classList.add('loaded')
  
  // Setup reduced motion detection
  setupReducedMotion()
  
  // Update language direction immediately
  updateLanguageDirection()
  
  // Setup font loading
  setupFontLoading()
  
  // Add event listeners
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
  window.addEventListener('online', handleOnlineStatus)
  window.addEventListener('offline', handleOnlineStatus)
  
  // Initial calls
  handleResize()
  handleScroll()
  
  // Wait for next tick to ensure DOM is ready
  await nextTick()
  updateHeaderHeight()
  
  // Initialize stores
  try {
    languageStore.initialize?.()
    
    const results = await Promise.allSettled([
      authStore.checkAuth?.() || Promise.resolve(),
      productsStore.fetchProducts?.() || Promise.resolve(),
      cartStore.initialize?.() || Promise.resolve()
    ])
    
    console.log('✅ Stores initialized')
  } catch (error) {
    console.error('❌ Store initialization failed:', error)
  }
  
  // Add scrollbar styling
  document.documentElement.classList.add('luxury-scrollbar')
  
  // Final setup
  updatePageTitle()
  console.log('✨ Luxury Perfume Store is ready!')
})

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('online', handleOnlineStatus)
  window.removeEventListener('offline', handleOnlineStatus)
  
  // Clean up animation frame
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
  
  // Clean up classes
  document.body.classList.remove('loaded')
  document.documentElement.classList.remove('luxury-scrollbar')
})

// Watch for language changes
watch(() => languageStore.currentLanguage, (newLang) => {
  updateLanguageDirection()
  updatePageTitle()
  
  window.dispatchEvent(new CustomEvent('luxury-notification', {
    detail: {
      type: 'success',
      title: safeTranslate('languageChanged'),
      message: safeTranslate('languageChangedMessage'),
      duration: 2000,
      icon: newLang === 'ar' ? '🌙' : '🌍'
    }
  }))
})

// Watch for RTL changes
watch(() => isRTL, () => {
  updateLanguageDirection()
})

// Watch route changes
router.afterEach((to) => {
  updatePageTitle()
  
  // Close mobile menu if open
  const mobileMenu = document.querySelector('.mobile-menu')
  if (mobileMenu?.classList.contains('open')) {
    mobileMenu.classList.remove('open')
  }
  
  // Close cart if open
  if (cartStore.isOpen) {
    cartStore.closeCart()
  }
})
</script>

<style>
/* ========== GLOBAL STYLES ========== */
/* CSS Variables */
:root {
  --header-height: 64px;
  --safe-area-inset-top: env(safe-area-inset-top, 0px);
  --safe-area-inset-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-inset-left: env(safe-area-inset-left, 0px);
  --safe-area-inset-right: env(safe-area-inset-right, 0px);
  
  /* Theme colors */
  --color-bg-light: #ffffff;
  --color-bg-light-secondary: #f8f5f0;
  --color-text-dark: #1a120b;
  --color-text-dark-secondary: rgba(26, 18, 11, 0.7);
  --color-gold: #d4af37;
  --color-gold-light: #f4e7c1;
  --color-gold-dark: #b8941f;
  --color-red: #c41e3a;
  
  /* Direction variables */
  --text-start: left;
  --text-end: right;
  --margin-start: margin-left;
  --margin-end: margin-right;
  --padding-start: padding-left;
  --padding-end: padding-right;
  --inset-start: left;
  --inset-end: right;
}

/* App container - FIXED GAP ISSUE */
#vue-app {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
               'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  min-height: 100vh;
  min-height: 100dvh;
  min-height: -webkit-fill-available;
  background: linear-gradient(135deg, #ffffff 0%, #f8f5f0 100%);
  color: var(--color-text-dark);
  overflow-x: hidden;
}

/* Font loading states */
body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

body.fonts-loaded #vue-app {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
               'Helvetica Neue', Arial, sans-serif;
}

/* Typography */
body {
  font-size: 14px;
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  text-size-adjust: 100%;
}

@media (min-width: 768px) {
  body {
    font-size: 16px;
    line-height: 1.6;
  }
}

/* Luxury Typography with RTL support */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Cormorant Garamond', 'Times New Roman', Times, serif;
  font-weight: 600;
  letter-spacing: 0.3px;
  color: var(--color-text-dark);
  line-height: 1.2;
  text-align: var(--text-start);
}

h1 {
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  margin-bottom: 1rem;
}

h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  margin-bottom: 0.875rem;
}

h3 {
  font-size: clamp(1.25rem, 3.5vw, 1.75rem);
  margin-bottom: 0.75rem;
}

/* Luxury Loading Spinner */
.luxury-loading-spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto;
  border: 2px solid rgba(212, 175, 55, 0.2);
  border-top: 2px solid #d4af37;
  border-radius: 50%;
  animation: luxury-spin 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  will-change: transform;
}

@keyframes luxury-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (min-width: 768px) {
  .luxury-loading-spinner {
    width: 60px;
    height: 60px;
    border-width: 3px;
  }
}

/* ========== PAGE TRANSITIONS ========== */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
  will-change: opacity;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* ========== LUXURY SCROLLBAR ========== */
.luxury-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #d4af37 rgba(248, 245, 240, 0.5);
}

.luxury-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.luxury-scrollbar::-webkit-scrollbar-track {
  background: rgba(248, 245, 240, 0.5);
  border-radius: 3px;
}

.luxury-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #d4af37 0%, #b8941f 100%);
  border-radius: 3px;
}

@media (min-width: 768px) {
  .luxury-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
}

/* ========== RTL/LTR DIRECTION UTILITIES ========== */
/* Direction classes */
.rtl {
  direction: rtl;
  text-align: var(--text-start);
}

.ltr {
  direction: ltr;
  text-align: var(--text-start);
}

/* Logical property utilities */
.text-start {
  text-align: var(--text-start) !important;
}

.text-end {
  text-align: var(--text-end) !important;
}

.margin-start-auto {
  margin-inline-start: auto !important;
}

.margin-end-auto {
  margin-inline-end: auto !important;
}

/* ========== ACCESSIBILITY ========== */
.skip-to-content {
  position: absolute;
  top: -40px;
  inset-inline-start: 0;
  background: #d4af37;
  color: #ffffff;
  padding: 8px 12px;
  text-decoration: none;
  font-weight: 600;
  border-radius: 0 0 4px 0;
  z-index: 10000;
  transition: top 0.2s ease;
  font-size: 14px;
}

.skip-to-content:focus {
  top: var(--safe-area-inset-top, 0);
  outline: 2px solid #ffffff;
  outline-offset: -2px;
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.01ms !important;
  }
  
  .luxury-loading-spinner {
    animation: none !important;
  }
}

/* Dark Mode Support */
@media (prefers-color-scheme: dark) {
  #vue-app {
    background: linear-gradient(135deg, #1a120b 0%, #0a0a0a 100%);
    color: #f4e7c1;
  }
  
  h1, h2, h3, h4, h5, h6 {
    color: #f4e7c1;
  }
}

/* ========== UTILITY CLASSES ========== */
/* Mobile Viewport Height Fix */
.min-h-screen-mobile {
  min-height: 100vh;
  min-height: 100dvh;
  min-height: -webkit-fill-available;
}

/* Safe area utilities */
.safe-bottom {
  padding-bottom: var(--safe-area-inset-bottom);
}

.safe-top {
  padding-top: var(--safe-area-inset-top);
}

/* Stacking Context */
.fixed {
  position: fixed;
}

.absolute {
  position: absolute;
}

.relative {
  position: relative;
}

.z-10 { z-index: 10; }
.z-20 { z-index: 20; }
.z-30 { z-index: 30; }
.z-40 { z-index: 40; }
.z-50 { z-index: 50; }
.z-[100] { z-index: 100; }

/* Content visibility for performance */
.content-visibility-auto {
  content-visibility: auto;
  contain-intrinsic-size: 0 300px;
}

@media (min-width: 768px) {
  .content-visibility-auto {
    contain-intrinsic-size: 0 500px;
  }
}
</style>

<style scoped>
/* ========== APP-SPECIFIC STYLES ========== */
/* Main Content Area - FIXED GAP ISSUE */
.main-content {
  min-height: calc(100dvh - var(--header-height));
  position: relative;
  padding-top: var(--header-height);
  margin: 0;
}

/* Luxury Loading Overlay */
.luxury-loading-overlay {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 245, 240, 0.95) 100%);
  backdrop-filter: blur(4px);
}

/* Safe area support */
.LuxuryCartSidebar,
.LuxurySearchModal,
.LuxuryNotificationCenter,
.luxury-loading-overlay {
  padding-top: var(--safe-area-inset-top);
  padding-bottom: var(--safe-area-inset-bottom);
  padding-left: var(--safe-area-inset-left);
  padding-right: var(--safe-area-inset-right);
}

/* Container utilities */
.luxury-container {
  width: 100%;
  max-width: min(1400px, 95vw);
  margin-inline: auto;
  padding-inline: 1rem;
}

@media (min-width: 640px) {
  .luxury-container {
    padding-inline: 1.5rem;
  }
}

@media (min-width: 768px) {
  .luxury-container {
    padding-inline: 2rem;
  }
}

@media (min-width: 1024px) {
  .luxury-container {
    padding-inline: 2.5rem;
  }
}

/* Color Utilities */
.text-gold-light {
  color: #f4e7c1;
}

.bg-gradient-luxury {
  background: linear-gradient(135deg, #ffffff 0%, #f8f5f0 100%);
}
</style>