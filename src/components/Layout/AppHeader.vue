<template>
  <header class="luxury-header">
    <!-- Header Container -->
    <div class="header-container">
      <!-- Logo Section -->
      <div class="header-logo-section">
        <router-link to="/" class="logo-link" aria-label="Perfume Stock Home">
          <div class="logo-icon">
            <svg class="logo-symbol" viewBox="0 0 32 32" aria-hidden="true">
              <path d="M16 4 L20 8 L24 4 L28 8 L24 12 L20 8 L16 12 L12 8 Z" 
                    fill="#d4af37" fill-opacity="0.9" />
              <circle cx="16" cy="16" r="4" fill="#d4af37" />
            </svg>
          </div>
          <div class="logo-text">
            <span class="logo-primary">PERFUME</span>
            <span class="logo-secondary">STOCK</span>
          </div>
        </router-link>
      </div>

      <!-- Desktop Navigation -->
      <nav class="header-navigation" aria-label="Main Navigation">
        <ul class="nav-list">
          <li class="nav-item">
            <router-link to="/" class="nav-link" active-class="nav-link--active">
              <span class="nav-link-text">{{ t('nav.home') }}</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/brands" class="nav-link" active-class="nav-link--active">
              <span class="nav-link-text">{{ t('nav.brands') }}</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/collections" class="nav-link" active-class="nav-link--active">
              <span class="nav-link-text">{{ t('nav.collections') }}</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/women" class="nav-link" active-class="nav-link--active">
              <span class="nav-link-text">{{ t('nav.women') }}</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/men" class="nav-link" active-class="nav-link--active">
              <span class="nav-link-text">{{ t('nav.men') }}</span>
            </router-link>
          </li>
          <li class="nav-item">
            <router-link to="/offers" class="nav-link nav-link--highlight" active-class="nav-link--active">
              <span class="nav-link-text">{{ t('nav.offers') }}</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Header Actions -->
      <div class="header-actions">
        <!-- Language Selector -->
        <div class="action-group">
          <button
            @click="toggleLanguage"
            class="action-btn action-btn--language"
            :aria-label="t('aria.toggleLanguage')"
            :title="t('aria.toggleLanguage')"
          >
            <span class="action-btn__icon" aria-hidden="true">
              {{ currentLanguage === 'en' ? '🌐' : '🌍' }}
            </span>
            <span class="action-btn__text">{{ currentLanguage === 'en' ? 'EN' : 'AR' }}</span>
          </button>
        </div>

        <!-- Search -->
        <div class="action-group">
          <button
            @click="toggleSearch"
            class="action-btn action-btn--search"
            :aria-label="t('aria.search')"
            :title="t('aria.search')"
            :aria-expanded="searchOpen"
          >
            <svg class="action-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" 
                    stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </button>
        </div>

        <!-- Cart -->
        <div class="action-group">
          <button
            @click="openCart"
            class="action-btn action-btn--cart"
            :aria-label="t('aria.cart')"
            :title="t('aria.cart')"
            :data-count="cartTotal > 0 ? cartTotal : null"
          >
            <svg class="action-btn__icon" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" 
                    stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
            <span v-if="cartTotal > 0" class="cart-badge" aria-hidden="true">
              {{ cartTotal > 9 ? '9+' : cartTotal }}
            </span>
          </button>
        </div>

        <!-- Mobile Menu Toggle -->
        <div class="action-group action-group--mobile">
          <button
            @click="toggleMobileMenu"
            class="action-btn action-btn--menu"
            :aria-label="t('aria.menu')"
            :title="t('aria.menu')"
            :aria-expanded="mobileMenuOpen"
            :class="{ 'action-btn--menu-open': mobileMenuOpen }"
          >
            <span class="menu-icon" aria-hidden="true">
              <span class="menu-icon__line"></span>
              <span class="menu-icon__line"></span>
              <span class="menu-icon__line"></span>
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Search Modal -->
    <teleport to="body">
      <div v-if="searchOpen" class="search-modal" role="dialog" aria-modal="true" 
           :aria-label="t('aria.searchModal')">
        <div class="search-modal__backdrop" @click="closeSearch"></div>
        <div class="search-modal__content">
          <div class="search-modal__container">
            <form @submit.prevent="handleSearch" class="search-form" role="search">
              <div class="search-form__group">
                <input
                  ref="searchInput"
                  v-model="searchQuery"
                  type="search"
                  :placeholder="t('search.placeholder')"
                  class="search-form__input"
                  :class="{ 'search-form__input--rtl': currentLanguage === 'ar' }"
                  :aria-label="t('search.label')"
                  autocomplete="off"
                  autocorrect="off"
                  spellcheck="false"
                  enterkeyhint="search"
                />
                <button type="submit" class="search-form__submit" :aria-label="t('search.submit')">
                  <svg class="search-form__icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" 
                          stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </button>
                <button
                  type="button"
                  @click="closeSearch"
                  class="search-form__close"
                  :aria-label="t('search.close')"
                >
                  <svg class="search-form__close-icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" 
                          stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <div v-if="searchSuggestions.length > 0" class="search-suggestions">
                <div class="search-suggestions__title">{{ t('search.suggestions') }}</div>
                <ul class="search-suggestions__list">
                  <li v-for="suggestion in searchSuggestions" :key="suggestion.id">
                    <button @click="selectSuggestion(suggestion)" class="search-suggestion">
                      {{ suggestion.text }}
                    </button>
                  </li>
                </ul>
              </div>
            </form>
          </div>
        </div>
      </div>
    </teleport>

    <!-- Mobile Menu -->
    <teleport to="body">
      <div v-if="mobileMenuOpen" class="mobile-menu" role="dialog" aria-modal="true" 
           :aria-label="t('aria.mobileMenu')">
        <div class="mobile-menu__backdrop" @click="closeMobileMenu"></div>
        <div class="mobile-menu__content" :class="{ 'mobile-menu__content--rtl': currentLanguage === 'ar' }">
          <div class="mobile-menu__header">
            <div class="mobile-menu__logo">
              <router-link to="/" @click="closeMobileMenu" class="mobile-menu__logo-link">
                PERFUME STOCK
              </router-link>
            </div>
            <button
              @click="closeMobileMenu"
              class="mobile-menu__close"
              :aria-label="t('aria.closeMenu')"
            >
              <svg class="mobile-menu__close-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" 
                      stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <nav class="mobile-menu__nav" aria-label="Mobile Navigation">
            <ul class="mobile-menu__list">
              <li v-for="item in mobileMenuItems" :key="item.id" class="mobile-menu__item">
                <router-link
                  :to="item.to"
                  @click="closeMobileMenu"
                  class="mobile-menu__link"
                  active-class="mobile-menu__link--active"
                >
                  <span class="mobile-menu__link-icon" aria-hidden="true">{{ item.icon }}</span>
                  <span class="mobile-menu__link-text">{{ t(item.label) }}</span>
                  <svg v-if="item.badge" class="mobile-menu__link-badge" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="8" fill="#d4af37" />
                  </svg>
                </router-link>
              </li>
            </ul>
          </nav>
          <div class="mobile-menu__footer">
            <div class="mobile-menu__language">
              <button
                @click="toggleLanguage"
                class="mobile-menu__language-btn"
                :aria-label="t('aria.toggleLanguage')"
              >
                <span class="mobile-menu__language-icon" aria-hidden="true">
                  {{ currentLanguage === 'en' ? '🌐' : '🌍' }}
                </span>
                <span class="mobile-menu__language-text">
                  {{ currentLanguage === 'en' ? 'English' : 'العربية' }}
                </span>
              </button>
            </div>
            <div class="mobile-menu__contact">
              <a href="tel:+1234567890" class="mobile-menu__contact-link">
                {{ t('contact.phone') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'

// Router
const router = useRouter()
const route = useRoute()

// Stores
const languageStore = useLanguageStore()
const cartStore = useCartStore()

// State
const { currentLanguage, t } = languageStore
const { totalItems } = storeToRefs(cartStore)

// Reactive
const mobileMenuOpen = ref(false)
const searchOpen = ref(false)
const searchQuery = ref('')
const searchInput = ref<HTMLInputElement | null>(null)

// Computed
const cartTotal = computed(() => totalItems.value)
const isRTL = computed(() => currentLanguage === 'ar')

// Mobile menu items
const mobileMenuItems = computed(() => [
  { id: 1, to: '/', label: 'nav.home', icon: '🏠' },
  { id: 2, to: '/brands', label: 'nav.brands', icon: '🏷️' },
  { id: 3, to: '/collections', label: 'nav.collections', icon: '🎁' },
  { id: 4, to: '/women', label: 'nav.women', icon: '👩' },
  { id: 5, to: '/men', label: 'nav.men', icon: '👨' },
  { id: 6, to: '/offers', label: 'nav.offers', icon: '🔥', badge: true },
  { id: 7, to: '/about', label: 'nav.about', icon: 'ℹ️' },
  { id: 8, to: '/contact', label: 'nav.contact', icon: '📞' }
])

// Search suggestions
const searchSuggestions = computed(() => {
  if (!searchQuery.value.trim()) return []
  const suggestions = [
    { id: 1, text: 'Black Opium', route: '/product/black-opium' },
    { id: 2, text: 'Chanel No. 5', route: '/product/chanel-no5' },
    { id: 3, text: 'Tom Ford', route: '/brand/tom-ford' },
    { id: 4, text: 'Men\'s Collection', route: '/collection/mens' },
    { id: 5, text: 'Luxury Gift Sets', route: '/collection/gift-sets' }
  ]
  return suggestions.filter(s => 
    s.text.toLowerCase().includes(searchQuery.value.toLowerCase())
  ).slice(0, 5)
})

// Methods
const toggleLanguage = () => {
  const newLang = currentLanguage === 'en' ? 'ar' : 'en'
  languageStore.setLanguage(newLang)
}

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const toggleSearch = async () => {
  searchOpen.value = !searchOpen.value
  if (searchOpen.value) {
    await nextTick()
    searchInput.value?.focus()
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeSearch = () => {
  searchOpen.value = false
  document.body.style.overflow = ''
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ 
      path: '/search', 
      query: { q: searchQuery.value.trim() } 
    })
    closeSearch()
  }
}

const selectSuggestion = (suggestion: any) => {
  router.push(suggestion.route)
  closeSearch()
}

const openCart = () => {
  cartStore.openCart()
}

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    if (searchOpen.value) {
      closeSearch()
    } else if (mobileMenuOpen.value) {
      closeMobileMenu()
    }
  }
}

// Close menu on route change
watch(
  () => route.path,
  () => {
    closeMobileMenu()
    closeSearch()
  }
)

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* ========== BASE HEADER STYLES ========== */
.luxury-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(212, 175, 55, 0.15);
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.luxury-header.scrolled {
  background: rgba(10, 10, 10, 0.98);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

/* Header Container */
.header-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 1rem;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
}

/* ========== LOGO SECTION ========== */
.header-logo-section {
  flex: 0 0 auto;
}

.logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.logo-link:hover {
  opacity: 0.9;
}

.logo-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-symbol {
  width: 32px;
  height: 32px;
  filter: drop-shadow(0 2px 4px rgba(212, 175, 55, 0.3));
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo-primary {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 1px;
}

.logo-secondary {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.875rem;
  font-weight: 400;
  color: #d4af37;
  letter-spacing: 2px;
  text-transform: uppercase;
}

/* ========== DESKTOP NAVIGATION ========== */
.header-navigation {
  flex: 1 1 auto;
  display: none;
}

@media (min-width: 1024px) {
  .header-navigation {
    display: block;
  }
}

.nav-list {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgba(244, 231, 193, 0.8);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 8px;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-link:hover::before {
  transform: scaleX(1);
  transform-origin: left;
}

.nav-link:hover,
.nav-link:focus-visible {
  color: #ffffff;
  transform: translateY(-1px);
}

.nav-link--active {
  color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
}

.nav-link--active::before {
  transform: scaleX(1);
}

.nav-link--active:hover {
  background: rgba(212, 175, 55, 0.15);
}

.nav-link--highlight {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.2), rgba(255, 215, 0, 0.1));
  border: 1px solid rgba(212, 175, 55, 0.3);
}

.nav-link--highlight:hover {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.3), rgba(255, 215, 0, 0.2));
  border-color: rgba(212, 175, 55, 0.5);
}

.nav-link-text {
  position: relative;
  z-index: 1;
}

/* ========== HEADER ACTIONS ========== */
.header-actions {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-group {
  position: relative;
}

.action-group--mobile {
  display: block;
}

@media (min-width: 1024px) {
  .action-group--mobile {
    display: none;
  }
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(244, 231, 193, 0.8);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.action-btn:hover,
.action-btn:focus-visible {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(212, 175, 55, 0.3);
  color: #ffffff;
  transform: translateY(-1px);
}

.action-btn:active {
  transform: translateY(0);
}

.action-btn--language {
  width: auto;
  padding: 0 1rem;
  gap: 0.5rem;
}

.action-btn__icon {
  width: 20px;
  height: 20px;
}

.action-btn__text {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: currentColor;
}

/* Cart Badge */
.cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 4px;
  background: linear-gradient(135deg, #d4af37, #b8941f);
  color: #000000;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #0a0a0a;
  box-shadow: 0 2px 8px rgba(212, 175, 55, 0.3);
  animation: badge-pulse 2s infinite;
}

@keyframes badge-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

/* Mobile Menu Toggle */
.action-btn--menu {
  border: none;
  background: transparent;
}

.menu-icon {
  display: flex;
  flex-direction: column;
  gap: 4px;
  width: 24px;
  height: 24px;
  position: relative;
}

.menu-icon__line {
  width: 100%;
  height: 2px;
  background: currentColor;
  border-radius: 1px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}

.action-btn--menu-open .menu-icon__line:nth-child(1) {
  transform: translateY(8px) rotate(45deg);
}

.action-btn--menu-open .menu-icon__line:nth-child(2) {
  opacity: 0;
  transform: scaleX(0);
}

.action-btn--menu-open .menu-icon__line:nth-child(3) {
  transform: translateY(-8px) rotate(-45deg);
}

/* ========== SEARCH MODAL ========== */
.search-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 100px;
}

.search-modal__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: fade-in 0.3s ease-out;
}

.search-modal__content {
  position: relative;
  width: 100%;
  max-width: 800px;
  padding: 0 1rem;
  animation: slide-down 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-modal__container {
  background: rgba(20, 20, 30, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.search-form {
  position: relative;
}

.search-form__group {
  position: relative;
  display: flex;
  align-items: center;
}

.search-form__input {
  flex: 1;
  width: 100%;
  padding: 1.25rem 4rem 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 1.125rem;
  font-weight: 400;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-form__input--rtl {
  padding: 1.25rem 1.5rem 1.25rem 4rem;
}

.search-form__input::placeholder {
  color: rgba(244, 231, 193, 0.5);
}

.search-form__input:focus {
  outline: none;
  border-color: #d4af37;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1),
              0 10px 30px rgba(212, 175, 55, 0.2);
}

.search-form__submit {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  color: #d4af37;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

.search-form__submit:hover {
  color: #ffffff;
  transform: scale(1.1);
}

.search-form__close {
  position: absolute;
  right: 4rem;
  background: none;
  border: none;
  color: rgba(244, 231, 193, 0.6);
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.3s ease;
}

.search-form__close:hover {
  color: #ffffff;
}

.search-form__icon,
.search-form__close-icon {
  width: 24px;
  height: 24px;
}

.search-suggestions {
  margin-top: 1.5rem;
  animation: fade-in-up 0.3s ease-out 0.1s both;
}

.search-suggestions__title {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(244, 231, 193, 0.7);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.75rem;
}

.search-suggestions__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-suggestion {
  width: 100%;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: rgba(244, 231, 193, 0.8);
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-suggestion:hover,
.search-suggestion:focus-visible {
  background: rgba(212, 175, 55, 0.1);
  border-color: rgba(212, 175, 55, 0.3);
  color: #ffffff;
  transform: translateX(4px);
}

/* ========== MOBILE MENU ========== */
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1500;
}

.mobile-menu__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  animation: fade-in 0.3s ease-out;
}

.mobile-menu__content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 320px;
  background: rgba(10, 10, 10, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-left: 1px solid rgba(212, 175, 55, 0.2);
  display: flex;
  flex-direction: column;
  animation: slide-in-right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu__content--rtl {
  right: auto;
  left: 0;
  border-left: none;
  border-right: 1px solid rgba(212, 175, 55, 0.2);
  animation: slide-in-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu__header {
  padding: 1.5rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-menu__logo {
  flex: 1;
}

.mobile-menu__logo-link {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #d4af37;
  text-decoration: none;
  letter-spacing: 1px;
}

.mobile-menu__close {
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(244, 231, 193, 0.8);
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-menu__close:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(212, 175, 55, 0.3);
  color: #ffffff;
}

.mobile-menu__close-icon {
  width: 20px;
  height: 20px;
}

.mobile-menu__nav {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.mobile-menu__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-menu__item {
  position: relative;
}

.mobile-menu__link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  color: rgba(244, 231, 193, 0.8);
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-menu__link:hover,
.mobile-menu__link:focus-visible {
  background: rgba(212, 175, 55, 0.1);
  border-color: rgba(212, 175, 55, 0.3);
  color: #ffffff;
  transform: translateX(-4px);
}

.mobile-menu__link--active {
  background: rgba(212, 175, 55, 0.15);
  border-color: rgba(212, 175, 55, 0.4);
  color: #ffffff;
}

.mobile-menu__link--active .mobile-menu__link-icon {
  transform: scale(1.2);
}

.mobile-menu__link-icon {
  font-size: 1.25rem;
  transition: transform 0.3s ease;
}

.mobile-menu__link-text {
  flex: 1;
}

.mobile-menu__link-badge {
  width: 16px;
  height: 16px;
}

.mobile-menu__footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.mobile-menu__language {
  width: 100%;
}

.mobile-menu__language-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 8px;
  color: #d4af37;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mobile-menu__language-btn:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: rgba(212, 175, 55, 0.4);
  transform: translateY(-1px);
}

.mobile-menu__language-icon {
  font-size: 1.25rem;
}

.mobile-menu__contact {
  text-align: center;
}

.mobile-menu__contact-link {
  color: rgba(244, 231, 193, 0.7);
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  transition: color 0.3s ease;
}

.mobile-menu__contact-link:hover {
  color: #d4af37;
}

/* ========== ANIMATIONS ========== */
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== RESPONSIVE DESIGN ========== */
@media (max-width: 1023px) {
  .header-container {
    height: 64px;
    padding: 0 1rem;
  }
  
  .logo-primary {
    font-size: 1.125rem;
  }
  
  .logo-secondary {
    font-size: 0.75rem;
  }
  
  .action-btn {
    width: 36px;
    height: 36px;
  }
  
  .action-btn--language {
    padding: 0 0.75rem;
  }
  
  .cart-badge {
    min-width: 18px;
    height: 18px;
    font-size: 0.7rem;
  }
}

@media (max-width: 640px) {
  .header-container {
    gap: 1rem;
  }
  
  .logo-link {
    gap: 0.5rem;
  }
  
  .logo-icon {
    width: 36px;
    height: 36px;
  }
  
  .logo-symbol {
    width: 28px;
    height: 28px;
  }
  
  .header-actions {
    gap: 0.5rem;
  }
  
  .search-modal__content {
    padding: 0 0.75rem;
  }
  
  .search-modal__container {
    padding: 1.5rem;
  }
  
  .search-form__input {
    font-size: 1rem;
    padding: 1rem 3.5rem 1rem 1.25rem;
  }
  
  .search-form__input--rtl {
    padding: 1rem 1.25rem 1rem 3.5rem;
  }
  
  .mobile-menu__content {
    width: 280px;
  }
}

@media (max-width: 480px) {
  .logo-text {
    display: none;
  }
  
  .logo-icon {
    width: 32px;
    height: 32px;
  }
  
  .logo-symbol {
    width: 24px;
    height: 24px;
  }
  
  .action-btn--language .action-btn__text {
    display: none;
  }
  
  .search-modal {
    padding-top: 80px;
  }
}

/* ========== ACCESSIBILITY ========== */
@media (prefers-reduced-motion: reduce) {
  .luxury-header,
  .nav-link,
  .action-btn,
  .search-form__input,
  .mobile-menu__link,
  .mobile-menu__language-btn {
    transition: none;
  }
  
  .search-modal__backdrop,
  .search-modal__content,
  .mobile-menu__backdrop,
  .mobile-menu__content,
  .search-suggestions {
    animation: none;
  }
  
  .cart-badge {
    animation: none;
  }
}

/* Focus styles for keyboard navigation */
:focus-visible {
  outline: 2px solid #d4af37;
  outline-offset: 2px;
  border-radius: 4px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .luxury-header {
    background: #000000;
    border-bottom: 2px solid #d4af37;
  }
  
  .nav-link {
    color: #ffffff;
  }
  
  .nav-link--active {
    color: #ffff00;
    background: #000000;
  }
  
  .action-btn {
    border: 2px solid #ffffff;
  }
}

/* Print styles */
@media print {
  .luxury-header {
    display: none;
  }
}
</style>