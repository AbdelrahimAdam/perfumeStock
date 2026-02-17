<template>
  <div class="luxury-language-toggle" @click.stop>
    <button
      class="current-language"
      :class="{ 'open': showLanguages }"
      @click="toggleLanguages"
      :aria-label="t('selectLanguage')"
      ref="languageButton"
    >
      <span class="language-flag">{{ currentLanguageObj.flag }}</span>
      <span class="language-code">{{ currentLanguageObj.code.toUpperCase() }}</span>
      <svg class="chevron-icon" viewBox="0 0 24 24" fill="none">
        <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="1.5" 
              stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Languages Dropdown -->
    <transition name="fade-slide">
      <div v-if="showLanguages" 
           class="languages-dropdown" 
           @mouseleave="startCloseTimer"
           @mouseenter="cancelCloseTimer"
           ref="dropdown"
      >
        <div class="dropdown-header">
          <span class="header-title">{{ t('selectLanguage') }}</span>
          <button @click="closeLanguages" class="close-dropdown" :aria-label="t('close')">
            <svg class="close-icon" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="1.5" 
                    stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div class="languages-list">
          <button
            v-for="lang in availableLanguages"
            :key="lang.code"
            @click="selectLanguage(lang)"
            @mousedown.prevent
            :class="['language-option', { 'active': currentLanguage === lang.code }]"
          >
            <span class="language-flag">{{ lang.flag }}</span>
            <div class="language-info">
              <span class="language-name">{{ lang.name }}</span>
              <span class="language-native">{{ lang.native }}</span>
            </div>
            <div v-if="currentLanguage === lang.code" class="selected-indicator">
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
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const { t, currentLanguage, setLanguage, initialize } = languageStore

// State
const showLanguages = ref(false)
const languageButton = ref<HTMLElement | null>(null)
const dropdown = ref<HTMLElement | null>(null)
const closeTimer = ref<number | null>(null)

// Available languages - only English and Arabic
const availableLanguages = computed(() => [
  {
    code: 'en',
    name: 'English',
    native: 'English',
    flag: '🇺🇸',
    direction: 'ltr'
  },
  {
    code: 'ar',
    name: 'Arabic',
    native: 'العربية',
    flag: '🇸🇦',
    direction: 'rtl'
  }
])

// Current language object
const currentLanguageObj = computed(() => 
  availableLanguages.value.find(lang => lang.code === currentLanguage.value) || availableLanguages.value[0]
)

// Clear close timer
const cancelCloseTimer = () => {
  if (closeTimer.value !== null) {
    clearTimeout(closeTimer.value)
    closeTimer.value = null
  }
}

// Start close timer
const startCloseTimer = () => {
  cancelCloseTimer() // Clear any existing timer
  closeTimer.value = window.setTimeout(() => {
    closeLanguages()
    closeTimer.value = null
  }, 100)
}

// Toggle languages dropdown
const toggleLanguages = () => {
  cancelCloseTimer()
  showLanguages.value = !showLanguages.value
}

// Close languages dropdown
const closeLanguages = () => {
  cancelCloseTimer()
  showLanguages.value = false
}

// Select language
const selectLanguage = async (language: typeof availableLanguages.value[0]) => {
  try {
    await setLanguage(language.code)
    closeLanguages()
  } catch (error) {
    console.error('Failed to change language:', error)
  }
}

// Handle click outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as Node
  
  if (showLanguages.value && 
      languageButton.value && 
      dropdown.value && 
      !languageButton.value.contains(target) && 
      !dropdown.value.contains(target)) {
    closeLanguages()
  }
}

// Handle escape key
const handleEscapeKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showLanguages.value) {
    closeLanguages()
    languageButton.value?.focus()
  }
}

// Lifecycle
onMounted(() => {
  // Initialize language store
  initialize()
  
  // Add event listeners
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscapeKey)
})

onUnmounted(() => {
  // Clean up timer
  cancelCloseTimer()
  
  // Remove event listeners
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscapeKey)
})

// Watch for language changes to update direction
watch(() => currentLanguage.value, (newLang) => {
  document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = newLang
}, { immediate: true })
</script>

<style scoped>
.luxury-language-toggle {
  position: relative;
  display: inline-block;
}

.current-language {
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

.current-language:hover {
  background: rgba(212, 175, 55, 0.15);
  border-color: #d4af37;
  color: #d4af37;
}

.current-language.open {
  background: rgba(212, 175, 55, 0.15);
  border-color: #d4af37;
}

.language-flag {
  font-size: 1.125rem;
}

.language-code {
  flex: 1;
  text-align: left;
}

.chevron-icon {
  width: 16px;
  height: 16px;
  stroke: currentColor;
  transition: transform 0.3s ease;
}

.current-language.open .chevron-icon {
  transform: rotate(180deg);
}

/* Languages Dropdown */
.languages-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 280px;
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

.languages-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 0.5rem;
}

.languages-list::-webkit-scrollbar {
  width: 6px;
}

.languages-list::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.languages-list::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.3);
  border-radius: 3px;
}

.languages-list::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.5);
}

.language-option {
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

.language-option::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.language-option:hover {
  background: rgba(212, 175, 55, 0.05);
  border-color: rgba(212, 175, 55, 0.2);
  transform: translateX(4px);
}

.language-option:hover::before {
  opacity: 1;
}

.language-option.active {
  background: rgba(212, 175, 55, 0.1);
  border-color: rgba(212, 175, 55, 0.3);
}

.language-flag {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.language-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.language-name {
  font-family: 'Inter', sans-serif;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #f4e7c1;
}

.language-native {
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
  .languages-dropdown {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100vw - 2rem);
    max-width: 320px;
    max-height: calc(100vh - 4rem);
  }
  
  .current-language {
    min-width: 70px;
    padding: 0.5rem 0.75rem;
  }
}

@media (max-width: 480px) {
  .current-language .language-code {
    display: none;
  }
  
  .current-language {
    min-width: 50px;
    padding: 0.5rem;
    justify-content: center;
  }
}
</style>