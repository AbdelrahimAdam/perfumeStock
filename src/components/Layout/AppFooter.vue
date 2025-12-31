<template>
  <footer class="luxury-footer">
    <!-- Decorative Top Border -->
    <div class="footer-border"></div>
    
    <!-- Main Footer Content -->
    <div class="footer-content">
      <!-- Logo & Brand Section -->
      <div class="footer-section footer-section--brand">
        <div class="footer-logo">
          <router-link to="/" class="footer-logo__link" aria-label="Perfume Stock Home">
            <svg class="footer-logo__icon" viewBox="0 0 48 48" aria-hidden="true">
              <defs>
                <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#d4af37;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#b8941f;stop-opacity:1" />
                </linearGradient>
              </defs>
              <path d="M24 6 L30 12 L36 6 L42 12 L36 18 L30 12 L24 18 L18 12 Z" 
                    fill="url(#logo-gradient)" />
              <circle cx="24" cy="24" r="6" fill="#ffffff" opacity="0.9" />
            </svg>
            <div class="footer-logo__text">
              <span class="footer-logo__name">PERFUME</span>
              <span class="footer-logo__sublogo">STOCK</span>
            </div>
          </router-link>
        </div>
        
        <p class="footer-brand__description">
          {{ t('footer.description') }}
        </p>
        
        <!-- Social Links -->
        <div class="footer-social">
          <p class="footer-social__title">{{ t('footer.followUs') }}</p>
          <div class="footer-social__links">
            <a 
              v-for="social in socialLinks" 
              :key="social.id"
              :href="social.url"
              :aria-label="social.label"
              class="footer-social__link"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span class="footer-social__icon" v-html="social.icon"></span>
              <span class="footer-social__label">{{ social.label }}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Quick Links -->
      <div class="footer-section">
        <h3 class="footer-section__title">
          <span class="footer-section__title-text">{{ t('nav.quickLinks') }}</span>
          <span class="footer-section__title-decoration"></span>
        </h3>
        <nav class="footer-nav" aria-label="Quick Links">
          <ul class="footer-nav__list">
            <li v-for="link in quickLinks" :key="link.id" class="footer-nav__item">
              <router-link 
                :to="link.to"
                class="footer-nav__link"
                :aria-label="t(link.label)"
              >
                <span class="footer-nav__link-icon" v-html="link.icon"></span>
                <span class="footer-nav__link-text">{{ t(link.label) }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Customer Support -->
      <div class="footer-section">
        <h3 class="footer-section__title">
          <span class="footer-section__title-text">{{ t('footer.support') }}</span>
          <span class="footer-section__title-decoration"></span>
        </h3>
        <nav class="footer-nav" aria-label="Customer Support">
          <ul class="footer-nav__list">
            <li v-for="support in supportLinks" :key="support.id" class="footer-nav__item">
              <router-link 
                :to="support.to"
                class="footer-nav__link"
                :aria-label="t(support.label)"
              >
                <span class="footer-nav__link-icon" v-html="support.icon"></span>
                <span class="footer-nav__link-text">{{ t(support.label) }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
        
        <!-- Contact Info -->
        <div class="footer-contact">
          <div class="footer-contact__item">
            <span class="footer-contact__icon">📧</span>
            <a href="mailto:info@perfumestock.com" class="footer-contact__link">
              info@perfumestock.com
            </a>
          </div>
          <div class="footer-contact__item">
            <span class="footer-contact__icon">📱</span>
            <a href="tel:+1234567890" class="footer-contact__link">
              +1 (234) 567-890
            </a>
          </div>
        </div>
      </div>

      <!-- Newsletter -->
      <div class="footer-section footer-section--newsletter">
        <h3 class="footer-section__title">
          <span class="footer-section__title-text">{{ t('footer.newsletter') }}</span>
          <span class="footer-section__title-decoration"></span>
        </h3>
        
        <p class="footer-newsletter__description">
          {{ t('footer.newsletterDesc') }}
        </p>
        
        <form @submit.prevent="subscribeNewsletter" class="footer-newsletter__form">
          <div class="footer-newsletter__group">
            <input
              v-model="email"
              type="email"
              :placeholder="t('footer.emailPlaceholder')"
              class="footer-newsletter__input"
              :class="{ 'footer-newsletter__input--rtl': isRTL }"
              :aria-label="t('footer.emailLabel')"
              required
              autocomplete="email"
            />
            <button 
              type="submit" 
              class="footer-newsletter__submit"
              :aria-label="t('footer.subscribe')"
              :disabled="isSubmitting"
            >
              <span v-if="!isSubmitting" class="footer-newsletter__submit-text">
                {{ t('footer.subscribe') }}
              </span>
              <span v-else class="footer-newsletter__submit-text">
                {{ t('footer.subscribing') }}
              </span>
              <svg 
                v-if="isSubmitting" 
                class="footer-newsletter__spinner" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" 
                        fill="none" stroke-dasharray="31.4" stroke-dashoffset="0">
                  <animateTransform attributeName="transform" type="rotate" 
                                    from="0 12 12" to="360 12 12" dur="1s" repeatCount="indefinite"/>
                </circle>
              </svg>
            </button>
          </div>
          <div v-if="subscriptionSuccess" class="footer-newsletter__success">
            {{ t('footer.subscriptionSuccess') }}
          </div>
          <div v-if="subscriptionError" class="footer-newsletter__error">
            {{ subscriptionError }}
          </div>
        </form>
        
        <!-- Payment Methods -->
        <div class="footer-payments">
          <p class="footer-payments__title">{{ t('footer.paymentMethods') }}</p>
          <div class="footer-payments__methods">
            <span class="footer-payments__method" aria-label="Visa">💳</span>
            <span class="footer-payments__method" aria-label="Mastercard">💳</span>
            <span class="footer-payments__method" aria-label="Apple Pay">📱</span>
            <span class="footer-payments__method" aria-label="PayPal">🔗</span>
            <span class="footer-payments__method" aria-label="Secure Payment">🛡️</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Footer -->
    <div class="footer-bottom">
      <div class="footer-bottom__container">
        <!-- Copyright -->
        <div class="footer-bottom__copyright">
          <p class="footer-bottom__text">
            © {{ new Date().getFullYear() }} Perfume Stock. {{ t('footer.rightsReserved') }}
          </p>
          <p class="footer-bottom__text footer-bottom__text--small">
            {{ t('footer.companyInfo') }}
          </p>
        </div>

        <!-- Legal Links -->
        <nav class="footer-bottom__legal" aria-label="Legal Links">
          <ul class="footer-bottom__legal-list">
            <li v-for="legal in legalLinks" :key="legal.id" class="footer-bottom__legal-item">
              <router-link 
                :to="legal.to"
                class="footer-bottom__legal-link"
                :aria-label="t(legal.label)"
              >
                {{ t(legal.label) }}
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- Back to Top -->
        <button
          @click="scrollToTop"
          class="footer-bottom__back-to-top"
          :aria-label="t('footer.backToTop')"
          :title="t('footer.backToTop')"
        >
          <svg class="footer-bottom__back-to-top-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" 
                  stroke-width="2" d="M5 15l7-7 7 7"/>
          </svg>
        </button>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { useRouter } from 'vue-router'

// Router
const router = useRouter()

// Stores
const languageStore = useLanguageStore()

// State
const { currentLanguage, isRTL, t } = languageStore
const email = ref('')
const isSubmitting = ref(false)
const subscriptionSuccess = ref(false)
const subscriptionError = ref('')
const showBackToTop = ref(false)

// Data
const socialLinks = computed(() => [
  {
    id: 1,
    name: 'instagram',
    label: 'Instagram',
    url: 'https://instagram.com/perfumestock',
    icon: '📸'
  },
  {
    id: 2,
    name: 'facebook',
    label: 'Facebook',
    url: 'https://facebook.com/perfumestock',
    icon: '📘'
  },
  {
    id: 3,
    name: 'twitter',
    label: 'Twitter',
    url: 'https://twitter.com/perfumestock',
    icon: '🐦'
  },
  {
    id: 4,
    name: 'pinterest',
    label: 'Pinterest',
    url: 'https://pinterest.com/perfumestock',
    icon: '📌'
  }
])

const quickLinks = computed(() => [
  { id: 1, to: '/', label: 'nav.home', icon: '🏠' },
  { id: 2, to: '/brands', label: 'nav.brands', icon: '🏷️' },
  { id: 3, to: '/collections', label: 'nav.collections', icon: '🎁' },
  { id: 4, to: '/new-arrivals', label: 'nav.newArrivals', icon: '🆕' },
  { id: 5, to: '/best-sellers', label: 'nav.bestSellers', icon: '🔥' },
  { id: 6, to: '/gifts', label: 'nav.gifts', icon: '🎀' }
])

const supportLinks = computed(() => [
  { id: 1, to: '/contact', label: 'footer.contactUs', icon: '📞' },
  { id: 2, to: '/faq', label: 'footer.faq', icon: '❓' },
  { id: 3, to: '/shipping', label: 'footer.shipping', icon: '🚚' },
  { id: 4, to: '/returns', label: 'footer.returns', icon: '↩️' },
  { id: 5, to: '/size-guide', label: 'footer.sizeGuide', icon: '📏' },
  { id: 6, to: '/track-order', label: 'footer.trackOrder', icon: '📍' }
])

const legalLinks = computed(() => [
  { id: 1, to: '/privacy', label: 'footer.privacy' },
  { id: 2, to: '/terms', label: 'footer.terms' },
  { id: 3, to: '/cookies', label: 'footer.cookies' },
  { id: 4, to: '/accessibility', label: 'footer.accessibility' }
])

// Methods
const subscribeNewsletter = async () => {
  if (!email.value.trim()) return
  
  isSubmitting.value = true
  subscriptionError.value = ''
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // In production, replace with actual API call
    // await api.subscribeToNewsletter(email.value)
    
    subscriptionSuccess.value = true
    email.value = ''
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      subscriptionSuccess.value = false
    }, 5000)
  } catch (error) {
    subscriptionError.value = t('footer.subscriptionError')
  } finally {
    isSubmitting.value = false
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 500
}

// Lifecycle
onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* ========== MOBILE-FIRST FOOTER STYLES ========== */

.luxury-footer {
  background: linear-gradient(
    180deg,
    rgba(10, 10, 10, 0.98) 0%,
    rgba(15, 15, 20, 0.98) 100%
  );
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  position: relative;
  overflow: hidden;
}

/* Decorative Border */
.footer-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(212, 175, 55, 0.4),
    transparent
  );
}

/* Main Footer Content */
.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 3rem 1rem 2rem;
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
}

@media (min-width: 768px) {
  .footer-content {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
    padding: 3rem 1.5rem 2rem;
  }
}

@media (min-width: 1024px) {
  .footer-content {
    grid-template-columns: repeat(4, 1fr);
    gap: 3rem;
    padding: 4rem 2rem 3rem;
  }
}

/* Footer Section */
.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-section--brand {
  grid-column: 1;
}

@media (min-width: 768px) {
  .footer-section--brand {
    grid-column: span 2;
  }
}

@media (min-width: 1024px) {
  .footer-section--brand {
    grid-column: 1;
  }
}

.footer-section--newsletter {
  grid-column: 1;
}

@media (min-width: 768px) {
  .footer-section--newsletter {
    grid-column: span 2;
  }
}

@media (min-width: 1024px) {
  .footer-section--newsletter {
    grid-column: 4;
  }
}

/* Section Titles */
.footer-section__title {
  margin-bottom: 1.5rem;
  position: relative;
}

.footer-section__title-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 1px;
  display: block;
  margin-bottom: 0.5rem;
}

.footer-section__title-decoration {
  display: block;
  width: 40px;
  height: 2px;
  background: linear-gradient(90deg, #d4af37, transparent);
  border-radius: 1px;
}

/* Logo Section */
.footer-logo {
  margin-bottom: 1.5rem;
}

.footer-logo__link {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
}

.footer-logo__icon {
  width: 48px;
  height: 48px;
  filter: drop-shadow(0 2px 8px rgba(212, 175, 55, 0.3));
}

.footer-logo__text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.footer-logo__name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 1px;
}

.footer-logo__sublogo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.875rem;
  font-weight: 400;
  color: #d4af37;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.footer-brand__description {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  line-height: 1.6;
  color: rgba(244, 231, 193, 0.7);
  margin-bottom: 1.5rem;
}

/* Social Links */
.footer-social {
  margin-top: auto;
}

.footer-social__title {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(244, 231, 193, 0.8);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-social__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.footer-social__link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(244, 231, 193, 0.8);
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.footer-social__link:hover,
.footer-social__link:focus-visible {
  background: rgba(212, 175, 55, 0.1);
  border-color: rgba(212, 175, 55, 0.3);
  color: #ffffff;
  transform: translateY(-2px);
}

.footer-social__icon {
  font-size: 1.25rem;
}

.footer-social__label {
  display: none;
}

@media (min-width: 768px) {
  .footer-social__label {
    display: inline;
  }
}

/* Navigation */
.footer-nav {
  flex: 1;
}

.footer-nav__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-nav__item {
  position: relative;
}

.footer-nav__link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  color: rgba(244, 231, 193, 0.7);
  text-decoration: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  transition: all 0.3s ease;
  border-radius: 4px;
}

.footer-nav__link:hover,
.footer-nav__link:focus-visible {
  color: #ffffff;
  background: rgba(212, 175, 55, 0.05);
  padding-left: 1rem;
}

.footer-nav__link-icon {
  font-size: 1rem;
  opacity: 0.7;
}

.footer-nav__link-text {
  flex: 1;
}

/* Contact Info */
.footer-contact {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
}

.footer-contact__item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.footer-contact__item:last-child {
  margin-bottom: 0;
}

.footer-contact__icon {
  font-size: 1.25rem;
  color: #d4af37;
  flex-shrink: 0;
}

.footer-contact__link {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  color: rgba(244, 231, 193, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-contact__link:hover,
.footer-contact__link:focus-visible {
  color: #d4af37;
}

/* Newsletter */
.footer-newsletter__description {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  line-height: 1.6;
  color: rgba(244, 231, 193, 0.7);
  margin-bottom: 1.5rem;
}

.footer-newsletter__form {
  margin-bottom: 2rem;
}

.footer-newsletter__group {
  position: relative;
  margin-bottom: 0.75rem;
}

.footer-newsletter__input {
  width: 100%;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.footer-newsletter__input--rtl {
  text-align: right;
}

.footer-newsletter__input::placeholder {
  color: rgba(244, 231, 193, 0.5);
}

.footer-newsletter__input:focus {
  outline: none;
  border-color: #d4af37;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.footer-newsletter__submit {
  width: 100%;
  margin-top: 0.75rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #d4af37, #b8941f);
  border: none;
  border-radius: 8px;
  color: #000000;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.footer-newsletter__submit:hover:not(:disabled),
.footer-newsletter__submit:focus-visible:not(:disabled) {
  background: linear-gradient(135deg, #b8941f, #d4af37);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.footer-newsletter__submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.footer-newsletter__submit-text {
  position: relative;
  z-index: 1;
}

.footer-newsletter__spinner {
  width: 20px;
  height: 20px;
  color: currentColor;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.footer-newsletter__success,
.footer-newsletter__error {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 0.75rem;
}

.footer-newsletter__success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  color: rgba(34, 197, 94, 0.9);
}

.footer-newsletter__error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: rgba(239, 68, 68, 0.9);
}

/* Payment Methods */
.footer-payments {
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  padding-top: 1.5rem;
}

.footer-payments__title {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(244, 231, 193, 0.8);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.footer-payments__methods {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.footer-payments__method {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.footer-payments__method:hover {
  background: rgba(212, 175, 55, 0.1);
  border-color: rgba(212, 175, 55, 0.3);
  transform: translateY(-2px);
}

/* Bottom Footer */
.footer-bottom {
  background: rgba(5, 5, 5, 0.98);
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  padding: 1.5rem 1rem;
}

.footer-bottom__container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .footer-bottom__container {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.footer-bottom__copyright {
  text-align: center;
  order: 2;
}

@media (min-width: 768px) {
  .footer-bottom__copyright {
    text-align: left;
    order: 1;
  }
}

.footer-bottom__text {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: rgba(244, 231, 193, 0.6);
  margin: 0;
  line-height: 1.5;
}

.footer-bottom__text--small {
  font-size: 0.6875rem;
  color: rgba(244, 231, 193, 0.4);
  margin-top: 0.25rem;
}

/* Legal Links */
.footer-bottom__legal {
  order: 1;
}

@media (min-width: 768px) {
  .footer-bottom__legal {
    order: 2;
  }
}

.footer-bottom__legal-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

@media (min-width: 768px) {
  .footer-bottom__legal-list {
    justify-content: flex-end;
  }
}

.footer-bottom__legal-item {
  position: relative;
}

.footer-bottom__legal-link {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: rgba(244, 231, 193, 0.6);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-bottom__legal-link:hover,
.footer-bottom__legal-link:focus-visible {
  color: #d4af37;
}

.footer-bottom__legal-link::after {
  content: '•';
  position: absolute;
  right: -0.75rem;
  color: rgba(244, 231, 193, 0.3);
}

.footer-bottom__legal-item:last-child .footer-bottom__legal-link::after {
  display: none;
}

/* Back to Top */
.footer-bottom__back-to-top {
  position: fixed;
  bottom: 1.5rem;
  right: 1rem;
  width: 44px;
  height: 44px;
  background: rgba(212, 175, 55, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  color: #000000;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: translateY(10px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
}

.footer-bottom__back-to-top.show {
  opacity: 1;
  transform: translateY(0);
}

.footer-bottom__back-to-top:hover {
  background: #d4af37;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.footer-bottom__back-to-top-icon {
  width: 20px;
  height: 20px;
}

/* RTL Support */
:global(.rtl) .footer-nav__link:hover,
:global(.rtl) .footer-nav__link:focus-visible {
  padding-left: 0.5rem;
  padding-right: 1rem;
}

:global(.rtl) .footer-bottom__back-to-top {
  right: auto;
  left: 1rem;
}

/* Accessibility */
@media (prefers-reduced-motion: reduce) {
  .footer-nav__link,
  .footer-social__link,
  .footer-newsletter__input,
  .footer-newsletter__submit,
  .footer-bottom__back-to-top {
    transition: none;
  }
  
  .footer-bottom__back-to-top {
    animation: none;
  }
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .luxury-footer {
    background: #000000;
    border-top: 2px solid #d4af37;
  }
  
  .footer-nav__link {
    color: #ffffff;
  }
  
  .footer-nav__link:hover {
    color: #ffff00;
    background: transparent;
  }
  
  .footer-bottom__legal-link {
    color: #ffffff;
  }
}

/* Print Styles */
@media print {
  .luxury-footer {
    display: none;
  }
}
</style>