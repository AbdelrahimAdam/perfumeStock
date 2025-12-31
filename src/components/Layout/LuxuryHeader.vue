<template>
  <header class="luxury-header" :class="{ 'scrolled': scrolled, 'rtl': isRTL }">
    <!-- Header Container -->
    <div class="luxury-header-container">
      <!-- Top Bar -->
      <div class="luxury-top-bar">
        <!-- Left: Logo -->
        <router-link to="/" class="luxury-logo-container">
          <div class="luxury-logo-icon">
            <div class="logo-inner">
              <div class="luxury-p-logo">P</div>
            </div>
          </div>
          <div class="luxury-logo-text">
            <h1 class="logo-title">{{ languageStore.t('brandName') }}</h1>
            <p class="logo-subtitle">{{ languageStore.t('luxuryFragrances') }}</p>
          </div>
        </router-link>
        
        <!-- Desktop Navigation -->
        <nav class="luxury-nav-desktop">
          <ul class="luxury-nav-list">
            <li class="luxury-nav-item">
              <router-link to="/" class="luxury-nav-link" active-class="active" exact>
                {{ languageStore.t('home') }}
              </router-link>
            </li>
            <li class="luxury-nav-item">
              <router-link to="/collections" class="luxury-nav-link" active-class="active">
                {{ languageStore.t('collections') }}
              </router-link>
            </li>
            <li class="luxury-nav-item">
              <router-link to="/brands" class="luxury-nav-link" active-class="active">
                {{ languageStore.t('brands') }}
              </router-link>
            </li>
            <li class="luxury-nav-item">
              <router-link to="/categories" class="luxury-nav-link" active-class="active">
                {{ languageStore.t('categories') }}
              </router-link>
            </li>
            <li class="luxury-nav-item">
              <router-link to="/gifts" class="luxury-nav-link" active-class="active">
                {{ languageStore.t('gifts') }}
              </router-link>
            </li>
            <li class="luxury-nav-item">
              <router-link to="/about" class="luxury-nav-link" active-class="active">
                {{ languageStore.t('about') }}
              </router-link>
            </li>
            <li class="luxury-nav-item">
              <router-link to="/contact" class="luxury-nav-link" active-class="active">
                {{ languageStore.t('contact') }}
              </router-link>
            </li>
          </ul>
        </nav>
        
        <!-- Right: Actions -->
        <div class="luxury-header-right">
          <!-- Desktop Toggles & Actions -->
          <div class="luxury-desktop-section">
            <!-- Language & Currency -->
            <div class="luxury-header-toggles">
              <LuxuryLanguageToggle />
              <LuxuryCurrencyToggle />
            </div>
            
            <!-- Actions -->
            <div class="luxury-header-actions">
              <!-- Search -->
              <button class="luxury-header-action" @click="toggleSearch" :aria-label="languageStore.t('search')">
                <svg class="luxury-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              
              <!-- User -->
              <button class="luxury-header-action" @click="toggleUserMenu" :aria-label="languageStore.t('account')">
                <svg class="luxury-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" 
                        stroke="currentColor" stroke-width="1.5"/>
                  <path d="M3 20C3 16.6863 5.68629 14 9 14H15C18.3137 14 21 16.6863 21 20V21H3V20Z" 
                        stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </button>
              
              <!-- Wishlist -->
              <button class="luxury-header-action" @click="toggleWishlist" :aria-label="languageStore.t('wishlist')">
                <svg class="luxury-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" 
                        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              
              <!-- Cart -->
              <LuxuryCartIcon />
            </div>
          </div>
          
          <!-- Mobile Menu Toggle -->
          <button class="luxury-mobile-toggle" @click="toggleMobileMenu" :class="{ 'open': mobileMenuOpen }" :aria-label="languageStore.t('menu')">
            <span class="mobile-toggle-line"></span>
            <span class="mobile-toggle-line"></span>
            <span class="mobile-toggle-line"></span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Mobile Menu Overlay -->
    <div v-if="mobileMenuOpen" class="luxury-mobile-overlay" @click="closeMobileMenu"></div>
    
    <!-- Mobile Menu -->
    <div class="luxury-mobile-menu" :class="{ 'open': mobileMenuOpen }">
      <div class="mobile-menu-container">
        <div class="mobile-menu-header">
          <div class="mobile-menu-logo">
            <div class="mobile-logo-icon">
              <div class="mobile-logo-inner">
                <div class="mobile-logo-p">P</div>
              </div>
            </div>
            <div class="mobile-logo-text">
              <h3 class="mobile-logo-title">{{ languageStore.t('brandName') }}</h3>
              <p class="mobile-logo-subtitle">{{ languageStore.t('luxuryFragrances') }}</p>
            </div>
          </div>
          <button class="mobile-menu-close" @click="closeMobileMenu" :aria-label="languageStore.t('close')">
            <svg class="luxury-icon" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="1.5" 
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div class="mobile-menu-content">
          <!-- Mobile Toggles -->
          <div class="mobile-toggles">
            <LuxuryLanguageToggle />
            <LuxuryCurrencyToggle />
          </div>
          
          <!-- Mobile Navigation -->
          <nav class="mobile-nav">
            <ul class="mobile-nav-list">
              <li class="mobile-nav-item">
                <router-link to="/" class="mobile-nav-link" @click="closeMobileMenu" exact>
                  {{ languageStore.t('home') }}
                </router-link>
              </li>
              <li class="mobile-nav-item">
                <router-link to="/collections" class="mobile-nav-link" @click="closeMobileMenu">
                  {{ languageStore.t('collections') }}
                </router-link>
              </li>
              <li class="mobile-nav-item">
                <router-link to="/brands" class="mobile-nav-link" @click="closeMobileMenu">
                  {{ languageStore.t('brands') }}
                </router-link>
              </li>
              <li class="mobile-nav-item">
                <router-link to="/categories" class="mobile-nav-link" @click="closeMobileMenu">
                  {{ languageStore.t('categories') }}
                </router-link>
              </li>
              <li class="mobile-nav-item">
                <router-link to="/gifts" class="mobile-nav-link" @click="closeMobileMenu">
                  {{ languageStore.t('gifts') }}
                </router-link>
              </li>
              <li class="mobile-nav-item">
                <router-link to="/about" class="mobile-nav-link" @click="closeMobileMenu">
                  {{ languageStore.t('about') }}
                </router-link>
              </li>
              <li class="mobile-nav-item">
                <router-link to="/contact" class="mobile-nav-link" @click="closeMobileMenu">
                  {{ languageStore.t('contact') }}
                </router-link>
              </li>
            </ul>
          </nav>
          
          <!-- Mobile Actions -->
          <div class="mobile-actions">
            <button class="mobile-action-btn" @click="handleMobileAction('search')">
              <svg class="mobile-action-icon" viewBox="0 0 24 24" fill="none">
                <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" 
                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ languageStore.t('search') }}</span>
            </button>
            
            <button class="mobile-action-btn" @click="handleMobileAction('user')">
              <svg class="mobile-action-icon" viewBox="0 0 24 24" fill="none">
                <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" 
                      stroke="currentColor" stroke-width="1.5"/>
                <path d="M3 20C3 16.6863 5.68629 14 9 14H15C18.3137 14 21 16.6863 21 20V21H3V20Z" 
                      stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <span>{{ languageStore.t('account') }}</span>
            </button>
            
            <button class="mobile-action-btn" @click="handleMobileAction('wishlist')">
              <svg class="mobile-action-icon" viewBox="0 0 24 24" fill="none">
                <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" 
                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ languageStore.t('wishlist') }}</span>
            </button>
            
            <button class="mobile-action-btn" @click="handleMobileAction('cart')">
              <svg class="mobile-action-icon" viewBox="0 0 24 24" fill="none">
                <path d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z" 
                      stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span>{{ languageStore.t('cart') }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- User Menu Dropdown -->
    <div v-if="userMenuOpen" class="luxury-dropdown user-dropdown" @click.stop>
      <div class="dropdown-content">
        <div v-if="isAuthenticated" class="dropdown-user">
          <div class="user-avatar">
            <span class="avatar-initials">{{ userInitials }}</span>
          </div>
          <div class="user-info">
            <h4 class="user-name">{{ user?.displayName }}</h4>
            <p class="user-email">{{ user?.email }}</p>
          </div>
        </div>
        
        <div class="dropdown-menu">
          <router-link v-if="!isAuthenticated" to="/login" class="dropdown-item" @click="userMenuOpen = false">
            <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none">
              <path d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" 
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ languageStore.t('login') }}</span>
          </router-link>
          
          <router-link v-if="isAuthenticated" to="/profile" class="dropdown-item" @click="userMenuOpen = false">
            <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none">
              <path d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z" 
                    stroke="currentColor" stroke-width="1.5"/>
              <path d="M6 20C6 16.6863 8.68629 14 12 14C15.3137 14 18 16.6863 18 20V21H6V20Z" 
                    stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <span>{{ languageStore.t('profile') }}</span>
          </router-link>
          
          <router-link v-if="isAuthenticated" to="/orders" class="dropdown-item" @click="userMenuOpen = false">
            <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5M12 12H15M12 16H15M9 12H9.01M9 16H9.01" 
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ languageStore.t('orders') }}</span>
          </router-link>
          
          <router-link v-if="isAdmin" to="/admin" class="dropdown-item" @click="userMenuOpen = false">
            <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none">
              <path d="M10.325 4.317C10.751 2.561 13.249 2.561 13.675 4.317C13.861 5.151 14.687 5.657 15.514 5.421C17.227 4.926 18.675 6.374 18.18 8.087C17.944 8.914 18.45 9.74 19.284 9.926C21.04 10.352 21.04 12.85 19.284 13.276C18.45 13.462 17.944 14.288 18.18 15.115C18.675 16.828 17.227 18.276 15.514 17.781C14.687 17.545 13.861 18.051 13.675 18.885C13.249 20.641 10.751 20.641 10.325 18.885C10.139 18.051 9.313 17.545 8.486 17.781C6.773 18.276 5.325 16.828 5.82 15.115C6.056 14.288 5.55 13.462 4.716 13.276C2.96 12.85 2.96 10.352 4.716 9.926C5.55 9.74 6.056 8.914 5.82 8.087C5.325 6.374 6.773 4.926 8.486 5.421C9.313 5.657 10.139 5.151 10.325 4.317Z" 
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" 
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ languageStore.t('adminPanel') }}</span>
          </router-link>
          
          <button v-if="isAuthenticated" @click="handleLogout" class="dropdown-item logout-btn">
            <svg class="dropdown-icon" viewBox="0 0 24 24" fill="none">
              <path d="M17 16L21 12M21 12L17 8M21 12H7M13 16C13 17.6569 11.6569 19 10 19H6C4.34315 19 3 17.6569 3 16V8C3 6.34315 4.34315 5 6 5H10C11.6569 5 13 6.34315 13 8" 
                    stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ languageStore.t('logout') }}</span>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Search Modal -->
    <div v-if="searchOpen" class="luxury-search-overlay" @click="searchOpen = false">
      <div class="search-modal" @click.stop>
        <div class="search-input-container">
          <input type="text" class="search-input" :placeholder="languageStore.t('search') + '...'" autofocus>
          <button class="search-close" @click="searchOpen = false">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" stroke-width="1.5" 
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useLanguageStore } from '@/stores/language'
import { useCartStore } from '@/stores/cart'
import LuxuryLanguageToggle from '@/components/UI/LuxuryLanguageToggle.vue'
import LuxuryCurrencyToggle from '@/components/UI/LuxuryCurrencyToggle.vue'
import LuxuryCartIcon from '@/components/Cart/LuxuryCartIcon.vue'

const router = useRouter()
const authStore = useAuthStore()
const languageStore = useLanguageStore()
const cartStore = useCartStore()

const { user, isAuthenticated, isAdmin, logout } = authStore

// State
const scrolled = ref(false)
const mobileMenuOpen = ref(false)
const userMenuOpen = ref(false)
const searchOpen = ref(false)
const wishlistOpen = ref(false)

// Computed
const userInitials = computed(() => {
  if (!user.value) return ''
  return user.value.displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
})

const isRTL = computed(() => languageStore.currentLanguage === 'ar')

// Methods
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (mobileMenuOpen.value) {
    document.body.classList.add('no-scroll')
    userMenuOpen.value = false
    searchOpen.value = false
    wishlistOpen.value = false
  } else {
    document.body.classList.remove('no-scroll')
  }
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  document.body.classList.remove('no-scroll')
}

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value
  if (userMenuOpen.value) {
    mobileMenuOpen.value = false
    searchOpen.value = false
    wishlistOpen.value = false
  }
}

const toggleSearch = () => {
  searchOpen.value = !searchOpen.value
  if (searchOpen.value) {
    document.body.classList.add('no-scroll')
    mobileMenuOpen.value = false
    userMenuOpen.value = false
    wishlistOpen.value = false
  } else {
    document.body.classList.remove('no-scroll')
  }
}

const toggleWishlist = () => {
  wishlistOpen.value = !wishlistOpen.value
  const event = new CustomEvent('toggle-wishlist', { detail: wishlistOpen.value })
  window.dispatchEvent(event)
}

const handleMobileAction = (action: string) => {
  closeMobileMenu()
  switch(action) {
    case 'search':
      toggleSearch()
      break
    case 'user':
      toggleUserMenu()
      break
    case 'wishlist':
      toggleWishlist()
      break
    case 'cart':
      cartStore.openCart()
      break
  }
}

const handleScroll = () => {
  scrolled.value = window.scrollY > 20
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-dropdown') && 
      !target.closest('.luxury-header-action[aria-label="Account"]')) {
    userMenuOpen.value = false
  }
}

const handleLogout = async () => {
  try {
    await logout()
    userMenuOpen.value = false
    router.push('/')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Close search on escape
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    if (searchOpen.value) {
      searchOpen.value = false
      document.body.classList.remove('no-scroll')
    }
    if (userMenuOpen.value) {
      userMenuOpen.value = false
    }
  }
}

// Update direction when language changes
const updateDirection = () => {
  const direction = isRTL.value ? 'rtl' : 'ltr'
  document.documentElement.dir = direction
  document.documentElement.lang = languageStore.currentLanguage
  
  if (isRTL.value) {
    document.body.classList.add('rtl')
  } else {
    document.body.classList.remove('rtl')
  }
}

// Watch for language changes
watch(() => languageStore.currentLanguage, () => {
  updateDirection()
})

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
  
  // Set initial direction
  updateDirection()
  
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
  document.body.classList.remove('no-scroll')
})
</script>

<style scoped>
/* ========== LUXURY HEADER STYLES ========== */
.luxury-header {
  background: linear-gradient(180deg, 
    rgba(10, 10, 10, 0.98) 0%, 
    rgba(26, 18, 11, 0.95) 100%);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(212, 175, 55, 0.15);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.luxury-header.scrolled {
  background: rgba(10, 10, 10, 0.98);
  border-bottom-color: rgba(212, 175, 55, 0.25);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
}

.luxury-header.rtl {
  direction: rtl;
}

.luxury-header-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 2rem;
}

@media (max-width: 768px) {
  .luxury-header-container {
    padding: 0 1rem;
  }
}

/* Top Bar */
.luxury-top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  gap: 2rem;
  position: relative;
}

@media (max-width: 768px) {
  .luxury-top-bar {
    padding: 0.875rem 0;
    gap: 1rem;
  }
}

/* Logo */
.luxury-logo-container {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  transition: transform 0.3s ease;
  flex-shrink: 0;
  min-width: 0;
  z-index: 1001;
}

.luxury-logo-container:hover {
  transform: scale(1.02);
}

.luxury-logo-icon {
  width: 48px;
  height: 48px;
  position: relative;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .luxury-logo-icon {
    width: 44px;
    height: 44px;
  }
}

@media (max-width: 480px) {
  .luxury-logo-icon {
    width: 40px;
    height: 40px;
  }
}

.logo-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.4);
  border: 1px solid rgba(212, 175, 55, 0.3);
  animation: logo-glow 3s ease-in-out infinite;
}

@keyframes logo-glow {
  0%, 100% { 
    box-shadow: 0 0 30px rgba(212, 175, 55, 0.3),
                0 0 60px rgba(212, 175, 55, 0.1);
  }
  50% { 
    box-shadow: 0 0 50px rgba(212, 175, 55, 0.5),
                0 0 100px rgba(212, 175, 55, 0.2);
  }
}

.luxury-p-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

@media (max-width: 768px) {
  .luxury-p-logo {
    font-size: 1.75rem;
  }
}

@media (max-width: 480px) {
  .luxury-p-logo {
    font-size: 1.5rem;
  }
}

.luxury-logo-text {
  text-align: left;
  min-width: 0;
  overflow: hidden;
}

.luxury-header.rtl .luxury-logo-text {
  text-align: right;
}

.logo-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #d4af37;
  margin: 0;
  letter-spacing: 0.5px;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .logo-title {
    font-size: 1.25rem;
  }
}

@media (max-width: 640px) {
  .logo-title {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .logo-title {
    font-size: 1rem;
  }
}

.logo-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #f4e7c1;
  margin: 0.25rem 0 0 0;
  letter-spacing: 2px;
  text-transform: uppercase;
  opacity: 0.9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 768px) {
  .logo-subtitle {
    font-size: 0.65rem;
    letter-spacing: 1.5px;
  }
}

@media (max-width: 640px) {
  .logo-subtitle {
    font-size: 0.6rem;
    letter-spacing: 1px;
  }
}

@media (max-width: 480px) {
  .logo-subtitle {
    display: none;
  }
}

/* Desktop Navigation */
.luxury-nav-desktop {
  display: none;
}

@media (min-width: 1024px) {
  .luxury-nav-desktop {
    display: block;
    flex: 1;
  }
}

.luxury-nav-list {
  display: flex;
  justify-content: center;
  gap: 3rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

@media (min-width: 1280px) {
  .luxury-nav-list {
    gap: 4rem;
  }
}

@media (max-width: 1279px) and (min-width: 1024px) {
  .luxury-nav-list {
    gap: 2rem;
  }
}

.luxury-nav-item {
  position: relative;
}

.luxury-nav-link {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  color: #f4e7c1;
  text-decoration: none;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0.5rem 0;
  position: relative;
  transition: all 0.3s ease;
  opacity: 0.9;
}

.luxury-nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background: linear-gradient(90deg, #d4af37, #b8941f);
  transition: width 0.3s ease;
}

.luxury-header.rtl .luxury-nav-link::after {
  left: auto;
  right: 0;
}

.luxury-nav-link:hover::after,
.luxury-nav-link.active::after {
  width: 100%;
}

.luxury-nav-link:hover,
.luxury-nav-link.active {
  color: #d4af37;
  opacity: 1;
}

/* Header Right Actions */
.luxury-header-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .luxury-header-right {
    gap: 0.5rem;
  }
}

.luxury-desktop-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 1023px) {
  .luxury-desktop-section {
    display: none;
  }
}

.luxury-header-toggles {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.luxury-header-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Header Actions */
.luxury-header-action {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 12px;
  color: #f4e7c1;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .luxury-header-action {
    width: 40px;
    height: 40px;
  }
}

.luxury-header-action:hover {
  background: rgba(212, 175, 55, 0.15);
  border-color: #d4af37;
  color: #d4af37;
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(212, 175, 55, 0.2);
}

.luxury-icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (max-width: 768px) {
  .luxury-icon {
    width: 18px;
    height: 18px;
  }
}

/* Mobile Toggle */
.luxury-mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  margin-left: 0.5rem;
  flex-shrink: 0;
  z-index: 1001;
}

.luxury-header.rtl .luxury-mobile-toggle {
  margin-left: 0;
  margin-right: 0.5rem;
}

@media (max-width: 1023px) {
  .luxury-mobile-toggle {
    display: flex;
  }
}

.mobile-toggle-line {
  width: 24px;
  height: 2px;
  background: #f4e7c1;
  transition: all 0.3s ease;
  border-radius: 1px;
}

.luxury-mobile-toggle.open .mobile-toggle-line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.luxury-mobile-toggle.open .mobile-toggle-line:nth-child(2) {
  opacity: 0;
}

.luxury-mobile-toggle.open .mobile-toggle-line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

/* Mobile Overlay */
.luxury-mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1001;
}

/* Mobile Menu */
.luxury-mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 100%;
  max-width: 400px;
  height: 100vh;
  background: linear-gradient(180deg, 
    rgba(10, 10, 10, 0.98) 0%, 
    rgba(26, 18, 11, 0.95) 100%);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(212, 175, 55, 0.15);
  z-index: 1002;
  transition: right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
}

.luxury-header.rtl .luxury-mobile-menu {
  right: auto;
  left: -100%;
  border-left: none;
  border-right: 1px solid rgba(212, 175, 55, 0.15);
}

.luxury-mobile-menu.open {
  right: 0;
}

.luxury-header.rtl .luxury-mobile-menu.open {
  left: 0;
  right: auto;
}

@media (max-width: 400px) {
  .luxury-mobile-menu {
    max-width: 100%;
  }
}

.mobile-menu-container {
  height: 100%;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
}

@media (max-width: 480px) {
  .mobile-menu-container {
    padding: 1.5rem 1rem;
  }
}

.mobile-menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  flex-shrink: 0;
}

.mobile-menu-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mobile-logo-icon {
  width: 48px;
  height: 48px;
  position: relative;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .mobile-logo-icon {
    width: 40px;
    height: 40px;
  }
}

.mobile-logo-inner {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 30px rgba(212, 175, 55, 0.3);
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.mobile-logo-p {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

@media (max-width: 480px) {
  .mobile-logo-p {
    font-size: 1.5rem;
  }
}

.mobile-logo-text {
  text-align: left;
  min-width: 0;
}

.luxury-header.rtl .mobile-logo-text {
  text-align: right;
}

.mobile-logo-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #d4af37;
  margin: 0;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 480px) {
  .mobile-logo-title {
    font-size: 1.1rem;
  }
}

.mobile-logo-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  color: #f4e7c1;
  margin: 0.25rem 0 0 0;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  opacity: 0.9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@media (max-width: 480px) {
  .mobile-logo-subtitle {
    font-size: 0.6rem;
    letter-spacing: 1px;
  }
}

.mobile-menu-close {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 12px;
  color: #f4e7c1;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .mobile-menu-close {
    width: 40px;
    height: 40px;
  }
}

.mobile-menu-close:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
  color: #d4af37;
  transform: rotate(90deg);
}

.mobile-menu-content {
  flex: 1;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.mobile-toggles {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 2rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

/* Mobile Navigation */
.mobile-nav {
  flex: 1;
  margin-bottom: 2rem;
}

.mobile-nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.mobile-nav-item {
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
}

.mobile-nav-link {
  display: block;
  padding: 1.25rem 0;
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  font-weight: 500;
  color: #f4e7c1;
  text-decoration: none;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.9;
}

@media (max-width: 480px) {
  .mobile-nav-link {
    padding: 1rem 0;
    font-size: 1rem;
  }
}

.mobile-nav-link:hover {
  color: #d4af37;
  opacity: 1;
  padding-left: 0.5rem;
}

.luxury-header.rtl .mobile-nav-link:hover {
  padding-left: 0;
  padding-right: 0.5rem;
}

.mobile-nav-link.router-link-active {
  color: #d4af37;
}

/* Mobile Actions */
.mobile-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
}

@media (max-width: 480px) {
  .mobile-actions {
    gap: 0.75rem;
  }
}

.mobile-action-btn {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 12px;
  color: #f4e7c1;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  width: 100%;
  text-align: left;
}

.luxury-header.rtl .mobile-action-btn {
  text-align: right;
}

@media (max-width: 480px) {
  .mobile-action-btn {
    padding: 0.875rem 1.25rem;
    font-size: 0.95rem;
  }
}

.mobile-action-btn:hover {
  background: rgba(212, 175, 55, 0.15);
  border-color: #d4af37;
  color: #d4af37;
  transform: translateX(4px);
}

.luxury-header.rtl .mobile-action-btn:hover {
  transform: translateX(-4px);
}

.mobile-action-icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  flex-shrink: 0;
}

/* User Dropdown */
.luxury-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 2rem;
  min-width: 280px;
  background: rgba(10, 10, 10, 0.98);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(212, 175, 55, 0.1);
  z-index: 1003;
  overflow: hidden;
  opacity: 0;
  transform: translateY(-10px);
  animation: dropdownSlide 0.3s ease forwards;
}

.luxury-header.rtl .luxury-dropdown {
  right: auto;
  left: 2rem;
}

@keyframes dropdownSlide {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .luxury-dropdown {
    right: 1rem;
    min-width: 260px;
  }
  
  .luxury-header.rtl .luxury-dropdown {
    left: 1rem;
    right: auto;
  }
}

@media (max-width: 480px) {
  .luxury-dropdown {
    right: 0.5rem;
    min-width: calc(100vw - 1rem);
    max-width: 280px;
  }
  
  .luxury-header.rtl .luxury-dropdown {
    left: 0.5rem;
    right: auto;
  }
}

.dropdown-content {
  padding: 1.5rem;
}

.dropdown-user {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  margin-bottom: 1rem;
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  color: #0a0a0a;
  font-size: 1rem;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.user-info {
  flex: 1;
}

.user-name {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: #f4e7c1;
  margin: 0 0 0.25rem 0;
}

.user-email {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #f4e7c1;
  opacity: 0.7;
  margin: 0;
}

.dropdown-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-radius: 8px;
  color: #f4e7c1;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
}

.dropdown-item:hover {
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
  padding-left: 1.25rem;
}

.luxury-header.rtl .dropdown-item:hover {
  padding-left: 1rem;
  padding-right: 1.25rem;
}

.dropdown-icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.logout-btn {
  margin-top: 0.5rem;
  color: #ef4444;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* Search Overlay */
.luxury-search-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  z-index: 1004;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 120px;
}

.search-modal {
  background: linear-gradient(180deg, 
    rgba(10, 10, 10, 0.98) 0%, 
    rgba(26, 18, 11, 0.95) 100%);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

.search-input-container {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 1rem 1.5rem;
  background: rgba(212, 175, 55, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 12px;
  color: #f4e7c1;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
  text-align: left;
}

.luxury-header.rtl .search-input {
  text-align: right;
}

.search-input:focus {
  outline: none;
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
}

.search-close {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #a89c7c;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;
}

.luxury-header.rtl .search-close {
  right: auto;
  left: 1rem;
}

.search-close:hover {
  color: #d4af37;
}

.search-icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
}

/* No Scroll */
.no-scroll {
  overflow: hidden;
}

/* Currency Toggle Styles */
:deep(.luxury-currency-toggle) {
  position: relative;
}

:deep(.luxury-currency-toggle .luxury-dropdown-btn) {
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.15);
  color: #f4e7c1;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  min-width: 80px;
  transition: all 0.3s ease;
}

:deep(.luxury-currency-toggle .luxury-dropdown-btn:hover) {
  background: rgba(212, 175, 55, 0.15);
  border-color: #d4af37;
  color: #d4af37;
}

:deep(.luxury-currency-toggle .luxury-dropdown-menu) {
  background: rgba(10, 10, 10, 0.98);
  border: 1px solid rgba(212, 175, 55, 0.2);
  backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  min-width: 120px;
  z-index: 1005 !important;
}

:deep(.luxury-currency-toggle .luxury-dropdown-item) {
  color: #f4e7c1;
  padding: 0.75rem 1rem;
  font-size: 0.875rem;
  transition: all 0.3s ease;
}

:deep(.luxury-currency-toggle .luxury-dropdown-item:hover) {
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
}

/* Language Toggle Styles */
:deep(.luxury-language-toggle) {
  position: relative;
}

:deep(.luxury-language-toggle .languages-dropdown) {
  z-index: 1005 !important;
}
</style>