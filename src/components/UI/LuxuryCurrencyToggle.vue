<template>
  <div class="luxury-currency-toggle" @click.stop>
    <button
      class="current-currency"
      :class="{ 'open': showCurrencies }"
      @click="toggleCurrencies"
      @blur="handleBlur"
      aria-label="Select currency"
      ref="currencyButton"
    >
      <span class="currency-symbol">{{ currentCurrency.symbol }}</span>
      <span class="currency-code">{{ currentCurrency.code }}</span>
      <svg class="chevron-icon" viewBox="0 0 24 24" fill="none">
        <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="1.5" 
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Currencies Dropdown -->
    <transition name="fade-slide">
      <div v-if="showCurrencies" 
           class="currencies-dropdown" 
           @mouseleave="scheduleClose"
           ref="dropdown"
      >
        <div class="dropdown-header">
          <span class="header-title">{{ $t('selectCurrency') }}</span>
          <button @click="closeCurrencies" class="close-dropdown" aria-label="Close currency selection">
            <svg class="close-icon" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1.5" 
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div class="currencies-list">
          <button
            v-for="currency in availableCurrencies"
            :key="currency.code"
            @click="selectCurrency(currency)"
            :class="['currency-option', { 'active': currentCurrency.code === currency.code }]"
            @mousedown.prevent
          >
            <span class="currency-symbol">{{ currency.symbol }}</span>
            <div class="currency-info">
              <span class="currency-code">{{ currency.code }}</span>
              <span class="currency-name">{{ currency.name }}</span>
            </div>
            <div v-if="currentCurrency.code === currency.code" class="selected-indicator">
              <svg class="check-icon" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" 
                      stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const showCurrencies = ref(false)
const currencyButton = ref<HTMLElement>()
const dropdown = ref<HTMLElement>()
let closeTimeout: number | null = null

// Available currencies
const availableCurrencies = [
  {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    rate: 1
  },
  {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    rate: 0.92
  },
  {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    rate: 0.79
  },
  {
    code: 'AED',
    symbol: 'د.إ',
    name: 'UAE Dirham',
    rate: 3.67
  },
  {
    code: 'SAR',
    symbol: 'ر.س',
    name: 'Saudi Riyal',
    rate: 3.75
  }
]

// Current currency from localStorage or default
const currentCurrency = ref(availableCurrencies[0])

// Methods
const toggleCurrencies = () => {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  showCurrencies.value = !showCurrencies.value
  
  if (showCurrencies.value) {
    nextTick(() => {
      dropdown.value?.focus()
    })
  }
}

const scheduleClose = () => {
  closeTimeout = window.setTimeout(() => {
    closeCurrencies()
  }, 100)
}

const handleBlur = (event: FocusEvent) => {
  // Don't close if clicking on dropdown
  if (dropdown.value?.contains(event.relatedTarget as Node)) {
    return
  }
  scheduleClose()
}

const closeCurrencies = () => {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  showCurrencies.value = false
  currencyButton.value?.focus()
}

const selectCurrency = (currency: typeof availableCurrencies[0]) => {
  currentCurrency.value = currency
  
  // Save preference
  localStorage.setItem('luxury_currency', currency.code)
  
  // Dispatch event for other components
  window.dispatchEvent(new CustomEvent('currency-changed', {
    detail: { currency: currency.code }
  }))
  
  // Show notification
  window.dispatchEvent(new CustomEvent('luxury-notification', {
    detail: {
      type: 'success',
      title: t('currencyChanged'),
      message: t('currencyChangedTo', { currency: currency.code }),
      duration: 3000
    }
  }))
  
  closeCurrencies()
}

// Initialize
onMounted(() => {
  // Load saved currency preference
  const savedCurrency = localStorage.getItem('luxury_currency')
  if (savedCurrency) {
    const saved = availableCurrencies.find(c => c.code === savedCurrency)
    if (saved) {
      currentCurrency.value = saved
    }
  }
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (event) => {
    if (showCurrencies.value && 
        !currencyButton.value?.contains(event.target as Node) && 
        !dropdown.value?.contains(event.target as Node)) {
      closeCurrencies()
    }
  })
})

// Close dropdown on escape key
const handleEscapeKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showCurrencies.value) {
    closeCurrencies()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscapeKey)
})

// Cleanup
onUnmounted(() => {
  window.removeEventListener('keydown', handleEscapeKey)
  if (closeTimeout) {
    clearTimeout(closeTimeout)
  }
  document.removeEventListener('click', () => {})
})
</script>

<style scoped>
.luxury-currency-toggle {
  position: relative;
  display: inline-block;
}

.current-currency {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 8px;
  color: #f4e7c1;
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 80px;
}

.current-currency:hover {
  background: rgba(212, 175, 55, 0.15);
  border-color: #d4af37;
  color: #d4af37;
}

.current-currency.open {
  background: rgba(212, 175, 55, 0.15);
  border-color: #d4af37;
}

.currency-symbol {
  font-size: 1.125rem;
  font-weight: 600;
}

.currency-code {
  flex: 1;
  text-align: left;
}

.chevron-icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  transition: transform 0.3s ease;
}

.current-currency.open .chevron-icon {
  transform: rotate(180deg);
}

/* Currencies Dropdown */
.currencies-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 200px;
  background: linear-gradient(180deg, #0a0a0a 0%, #1a120b 100%);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 16px;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(212, 175, 55, 0.05);
  z-index: 1005;
  overflow: hidden;
  backdrop-filter: blur(20px);
}

.dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(212, 175, 55, 0.1);
  background: rgba(10, 10, 10, 0.95);
}

.header-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.125rem;
  font-weight: 500;
  color: #f4e7c1;
  letter-spacing: 0.05em;
}

.close-dropdown {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.1);
  border-radius: 8px;
  color: #a89c7c;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-dropdown:hover {
  background: rgba(212, 175, 55, 0.1);
  border-color: #d4af37;
  color: #d4af37;
  transform: rotate(90deg);
}

.close-icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
}

.currencies-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
}

.currencies-list::-webkit-scrollbar {
  width: 6px;
}

.currencies-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.currencies-list::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.3);
  border-radius: 3px;
}

.currencies-list::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.5);
}

.currency-option {
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;
  padding: 0.875rem 1rem;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 12px;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.currency-option::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.currency-option:hover {
  background: rgba(212, 175, 55, 0.05);
  border-color: rgba(212, 175, 55, 0.2);
  transform: translateX(4px);
}

.currency-option:hover::before {
  opacity: 1;
}

.currency-option.active {
  background: rgba(212, 175, 55, 0.1);
  border-color: rgba(212, 175, 55, 0.3);
}

.currency-symbol {
  font-size: 1.5rem;
  font-weight: 600;
  flex-shrink: 0;
  min-width: 30px;
}

.currency-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.currency-code {
  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #f4e7c1;
}

.currency-name {
  font-family: 'Inter', sans-serif;
  font-size: 0.8125rem;
  color: #a89c7c;
  font-weight: 300;
}

.selected-indicator {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 50%;
  color: #d4af37;
  flex-shrink: 0;
}

.check-icon {
  width: 12px;
  height: 12px;
  stroke: currentColor;
  stroke-width: 2;
}

/* Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .currencies-dropdown {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100vw - 2rem);
    max-width: 320px;
    max-height: calc(100vh - 4rem);
  }
  
  .current-currency {
    min-width: 70px;
    padding: 0.5rem 0.75rem;
  }
}

@media (max-width: 480px) {
  .current-currency .currency-code {
    display: none;
  }
  
  .current-currency {
    min-width: 50px;
    padding: 0.5rem;
    justify-content: center;
  }
}
</style>