<template>
  <footer class="luxury-footer" :class="{ 'rtl': isRTL }">
    <!-- Main Footer -->
    <div class="footer-main">
      <div class="footer-container">
        <!-- Top Section - Mobile First Grid -->
        <div class="footer-grid">
          <!-- Brand Column -->
          <div class="footer-brand">
            <router-link to="/" class="footer-logo">
              <!-- Luxurious "P" Letter -->
              <div class="footer-p-logo">
                <div class="footer-p-letter">P</div>
              </div>
              <div class="footer-logo-text">
                <h3 class="footer-logo-title">{{ $t('brandName') }}</h3>
                <p class="footer-logo-subtitle">{{ $t('luxuryFragrances') }}</p>
              </div>
            </router-link>
            
            <p class="footer-description">
              {{ $t('footerDescription') }}
            </p>
            
            <!-- Social Links -->
            <div class="footer-social">
              <a href="https://facebook.com" class="social-link" target="_blank" rel="noopener" aria-label="Facebook">
                <svg class="social-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" 
                        stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </a>
              <a href="https://instagram.com" class="social-link" target="_blank" rel="noopener" aria-label="Instagram">
                <svg class="social-icon" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" stroke-width="1.5"/>
                  <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.5"/>
                  <circle cx="18" cy="6" r="1" fill="currentColor"/>
                </svg>
              </a>
              <a href="https://twitter.com" class="social-link" target="_blank" rel="noopener" aria-label="Twitter">
                <svg class="social-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" 
                        stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </a>
              <a href="https://pinterest.com" class="social-link" target="_blank" rel="noopener" aria-label="Pinterest">
                <svg class="social-icon" viewBox="0 0 24 24" fill="none">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 21.5c-5.238 0-9.5-4.262-9.5-9.5S6.762 2.5 12 2.5s9.5 4.262 9.5 9.5-4.262 9.5-9.5 9.5zM9.5 8.5c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1zm7 0c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1zm-7 7c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1zm7 0c0 .552-.448 1-1 1s-1-.448-1-1 .448-1 1-1 1 .448 1 1z" 
                        stroke="currentColor" stroke-width="1.5"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Links Grid - 2 Columns on Mobile -->
          <div class="footer-links-grid">
            <!-- Column 1 -->
            <div class="links-column">
              <h4 class="links-column-title">{{ $t('quickLinks') }}</h4>
              <ul class="links-list">
                <li><router-link to="/" class="footer-link">{{ $t('home') }}</router-link></li>
                <li><router-link to="/collections" class="footer-link">{{ $t('collections') }}</router-link></li>
                <li><router-link to="/brands" class="footer-link">{{ $t('brands') }}</router-link></li>
                <li><router-link to="/categories" class="footer-link">{{ $t('categories') }}</router-link></li>
                <li><router-link to="/gifts" class="footer-link">{{ $t('gifts') }}</router-link></li>
              </ul>
            </div>

            <!-- Column 2 -->
            <div class="links-column">
              <h4 class="links-column-title">{{ $t('customerService') }}</h4>
              <ul class="links-list">
                <li><router-link to="/contact" class="footer-link">{{ $t('contactUs') }}</router-link></li>
                <li><router-link to="/shipping" class="footer-link">{{ $t('shippingInfo') }}</router-link></li>
                <li><router-link to="/returns" class="footer-link">{{ $t('returnsExchanges') }}</router-link></li>
                <li><router-link to="/faq" class="footer-link">{{ $t('faq') }}</router-link></li>
                <li><router-link to="/size-guide" class="footer-link">{{ $t('sizeGuide') }}</router-link></li>
              </ul>
            </div>

            <!-- Column 3 -->
            <div class="links-column">
              <h4 class="links-column-title">{{ $t('company') }}</h4>
              <ul class="links-list">
                <li><router-link to="/about" class="footer-link">{{ $t('aboutUs') }}</router-link></li>
                <li><router-link to="/careers" class="footer-link">{{ $t('careers') }}</router-link></li>
                <li><router-link to="/press" class="footer-link">{{ $t('press') }}</router-link></li>
                <li><router-link to="/stores" class="footer-link">{{ $t('storeLocator') }}</router-link></li>
                <li><router-link to="/blog" class="footer-link">{{ $t('blog') }}</router-link></li>
              </ul>
            </div>
          </div>

          <!-- Newsletter Section -->
          <div class="footer-newsletter">
            <h4 class="newsletter-title">{{ $t('stayUpdated') }}</h4>
            <p class="newsletter-description">
              {{ $t('newsletterDescription') }}
            </p>
            
            <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
              <div class="newsletter-input-group">
                <input
                  v-model="newsletterEmail"
                  type="email"
                  :placeholder="$t('yourEmail')"
                  class="newsletter-input"
                  required
                  aria-label="Email for newsletter subscription"
                />
                <button type="submit" class="newsletter-button" aria-label="Subscribe to newsletter">
                  <svg class="newsletter-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" 
                          stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
              <p class="newsletter-disclaimer">
                {{ $t('privacyDisclaimer') }}
              </p>
            </form>
          </div>
        </div>

        <!-- Divider -->
        <div class="footer-divider"></div>

        <!-- Bottom Section -->
        <div class="footer-bottom">
          <!-- Copyright -->
          <div class="footer-copyright">
            <p class="copyright-text">&copy; {{ currentYear }} {{ $t('brandName') }}. {{ $t('allRightsReserved') }}</p>
          </div>
          
          <!-- Payment Methods -->
          <div class="footer-payments">
            <div class="payment-icons">
              <span class="payment-icon">💳</span>
              <span class="payment-icon">🔒</span>
              <span class="payment-icon">🏦</span>
              <span class="payment-icon">📱</span>
            </div>
            <p class="payment-text">{{ $t('securePayment') }}</p>
          </div>
          
          <!-- Legal Links -->
          <div class="footer-legal">
            <router-link to="/privacy" class="legal-link">{{ $t('privacyPolicy') }}</router-link>
            <router-link to="/terms" class="legal-link">{{ $t('termsOfService') }}</router-link>
            <router-link to="/cookies" class="legal-link">{{ $t('cookiePolicy') }}</router-link>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Back to Top -->
    <button v-if="showBackToTop" @click="scrollToTop" class="back-to-top" :class="{ 'show': showBackToTop }" aria-label="Back to top">
      <svg class="back-to-top-icon" viewBox="0 0 24 24" fill="none">
        <path d="M12 19V5M5 12L12 5L19 12" 
              stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </footer>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useLanguageStore } from '@/stores/language'
import { showNotification } from '@/utils/notifications'

const languageStore = useLanguageStore()
const { t: $t, currentLanguage } = languageStore

// State
const newsletterEmail = ref('')
const showBackToTop = ref(false)

// Computed
const currentYear = computed(() => new Date().getFullYear())
const isRTL = computed(() => currentLanguage === 'ar')

// Methods
const subscribeNewsletter = async () => {
  if (!newsletterEmail.value) return
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    showNotification({
      type: 'success',
      title: $t('newsletterSuccess'),
      message: $t('newsletterSuccessMessage'),
      duration: 5000
    })
    
    newsletterEmail.value = ''
  } catch (error) {
    showNotification({
      type: 'error',
      title: $t('newsletterError'),
      message: $t('newsletterErrorMessage'),
      duration: 5000
    })
  }
}

const handleScroll = () => {
  showBackToTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
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
/* ===== MOBILE-FIRST FOOTER STYLES (ORIGINAL DARK/GOLD COLORS) ===== */
.luxury-footer {
  background: linear-gradient(180deg, #0a0a0a 0%, #1a120b 100%);
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  margin-top: auto;
  width: 100%;
  direction: ltr;
}

.luxury-footer.rtl {
  direction: rtl;
}

.footer-main {
  padding: 2rem 1rem;
}

@media (min-width: 768px) {
  .footer-main {
    padding: 3rem 1.5rem;
  }
}

@media (min-width: 1024px) {
  .footer-main {
    padding: 4rem 2rem;
  }
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Footer Grid - Mobile First */
.footer-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .footer-grid {
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
  }
}

@media (min-width: 1024px) {
  .footer-grid {
    grid-template-columns: 1fr 2fr 1fr;
    gap: 4rem;
  }
}

/* Brand Column */
.footer-brand {
  order: 1;
}

.footer-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  margin-bottom: 1.5rem;
}

.luxury-footer.rtl .footer-logo {
  flex-direction: row;
}

.footer-p-logo {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(212, 175, 55, 0.2);
  animation: logo-glow 3s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes logo-glow {
  0%, 100% { box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }
  50% { box-shadow: 0 0 30px rgba(212, 175, 55, 0.5); }
}

@media (min-width: 768px) {
  .footer-p-logo {
    width: 60px;
    height: 60px;
    border-radius: 12px;
  }
}

.footer-p-letter {
  font-family: 'Cormorant Garamond', serif;
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1;
}

@media (min-width: 768px) {
  .footer-p-letter {
    font-size: 2.25rem;
  }
}

.footer-logo-text {
  display: flex;
  flex-direction: column;
}

.footer-logo-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #d4af37;
  margin: 0 0 0.25rem 0;
  line-height: 1.2;
  text-align: left;
}

.luxury-footer.rtl .footer-logo-title {
  text-align: right;
}

@media (min-width: 768px) {
  .footer-logo-title {
    font-size: 1.8rem;
  }
}

.footer-logo-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  color: #f4e7c1;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin: 0;
  line-height: 1.2;
  text-align: left;
}

.luxury-footer.rtl .footer-logo-subtitle {
  text-align: right;
}

@media (min-width: 768px) {
  .footer-logo-subtitle {
    font-size: 0.9rem;
  }
}

.footer-description {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #f4e7c1;
  opacity: 0.8;
  margin-bottom: 1.5rem;
  text-align: left;
}

.luxury-footer.rtl .footer-description {
  text-align: right;
}

@media (min-width: 768px) {
  .footer-description {
    font-size: 0.95rem;
  }
}

/* Social Links */
.footer-social {
  display: flex;
  gap: 0.75rem;
}

.social-link {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 8px;
  color: #f4e7c1;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.social-link:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
  color: #d4af37;
  transform: translateY(-2px);
}

.social-icon {
  width: 20px;
  height: 20px;
}

@media (min-width: 768px) {
  .social-link {
    width: 44px;
    height: 44px;
  }
  
  .social-icon {
    width: 22px;
    height: 22px;
  }
}

/* Links Grid - 2 Columns on Mobile */
.footer-links-grid {
  order: 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .footer-links-grid {
    order: 1;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }
}

.links-column {
  text-align: left;
}

.luxury-footer.rtl .links-column {
  text-align: right;
}

.links-column-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #d4af37;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

@media (min-width: 768px) {
  .links-column-title {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }
}

.links-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.links-list li {
  margin-bottom: 0.5rem;
}

@media (min-width: 768px) {
  .links-list li {
    margin-bottom: 0.75rem;
  }
}

.footer-link {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: #f4e7c1;
  opacity: 0.8;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
  line-height: 1.4;
}

.footer-link:hover {
  color: #d4af37;
  opacity: 1;
  transform: translateX(4px);
}

.luxury-footer.rtl .footer-link:hover {
  transform: translateX(-4px);
}

@media (min-width: 768px) {
  .footer-link {
    font-size: 0.95rem;
  }
}

/* Newsletter Section */
.footer-newsletter {
  order: 3;
}

@media (min-width: 768px) {
  .footer-newsletter {
    order: 2;
  }
}

.newsletter-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: #d4af37;
  margin: 0 0 1rem 0;
  line-height: 1.2;
  text-align: left;
}

.luxury-footer.rtl .newsletter-title {
  text-align: right;
}

@media (min-width: 768px) {
  .newsletter-title {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }
}

.newsletter-description {
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  line-height: 1.6;
  color: #f4e7c1;
  opacity: 0.8;
  margin-bottom: 1.5rem;
  text-align: left;
}

.luxury-footer.rtl .newsletter-description {
  text-align: right;
}

@media (min-width: 768px) {
  .newsletter-description {
    font-size: 0.95rem;
  }
}

.newsletter-form {
  margin-bottom: 1.5rem;
}

.newsletter-input-group {
  position: relative;
  margin-bottom: 1rem;
}

.newsletter-input {
  width: 100%;
  padding: 0.75rem 3rem 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 8px;
  color: #f4e7c1;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  text-align: left;
}

.luxury-footer.rtl .newsletter-input {
  padding: 0.75rem 1rem 0.75rem 3rem;
  text-align: right;
}

.newsletter-input:focus {
  outline: none;
  border-color: #d4af37;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.newsletter-button {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 6px;
  color: #f4e7c1;
  cursor: pointer;
  transition: all 0.3s ease;
}

.luxury-footer.rtl .newsletter-button {
  right: auto;
  left: 0.5rem;
}

.newsletter-button:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
  color: #d4af37;
}

.newsletter-icon {
  width: 18px;
  height: 18px;
  stroke: currentColor;
}

.newsletter-disclaimer {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: #f4e7c1;
  opacity: 0.6;
  margin: 0;
  line-height: 1.4;
  text-align: left;
}

.luxury-footer.rtl .newsletter-disclaimer {
  text-align: right;
}

@media (min-width: 768px) {
  .newsletter-disclaimer {
    font-size: 0.8rem;
  }
}

/* Divider */
.footer-divider {
  height: 1px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(212, 175, 55, 0.3) 50%, 
    transparent 100%);
  margin: 1.5rem 0;
}

@media (min-width: 768px) {
  .footer-divider {
    margin: 2rem 0;
  }
}

/* Bottom Section */
.footer-bottom {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: center;
}

@media (min-width: 768px) {
  .footer-bottom {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
  
  .luxury-footer.rtl .footer-bottom {
    flex-direction: row-reverse;
  }
}

.footer-copyright {
  order: 2;
}

@media (min-width: 768px) {
  .footer-copyright {
    order: 1;
  }
}

.copyright-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #f4e7c1;
  opacity: 0.7;
  margin: 0;
  line-height: 1.4;
}

.footer-payments {
  order: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .footer-payments {
    order: 2;
    flex-direction: row;
    gap: 1rem;
  }
}

.payment-icons {
  display: flex;
  gap: 0.5rem;
}

.payment-text {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #f4e7c1;
  opacity: 0.7;
  margin: 0;
  line-height: 1.4;
}

.footer-legal {
  order: 3;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
}

@media (min-width: 768px) {
  .footer-legal {
    order: 3;
    gap: 2rem;
  }
}

.legal-link {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: #f4e7c1;
  opacity: 0.7;
  text-decoration: none;
  transition: all 0.3s ease;
  line-height: 1.4;
}

.legal-link:hover {
  color: #d4af37;
  opacity: 1;
}

/* Back to Top */
.back-to-top {
  position: fixed;
  bottom: 1.5rem;
  right: 1rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 50%;
  color: #f4e7c1;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 999;
  opacity: 0;
  transform: translateY(20px);
}

.luxury-footer.rtl .back-to-top {
  right: auto;
  left: 1rem;
}

.back-to-top:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
  color: #d4af37;
  transform: translateY(-2px);
}

.back-to-top.show {
  opacity: 1;
  transform: translateY(0);
}

.back-to-top-icon {
  width: 20px;
  height: 20px;
  stroke: currentColor;
}

@media (min-width: 768px) {
  .back-to-top {
    bottom: 2rem;
    right: 2rem;
    width: 50px;
    height: 50px;
  }
  
  .luxury-footer.rtl .back-to-top {
    left: 2rem;
    right: auto;
  }
  
  .back-to-top-icon {
    width: 24px;
    height: 24px;
  }
}
</style>