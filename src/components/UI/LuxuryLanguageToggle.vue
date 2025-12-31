<template>
  <div class="luxury-language-toggle" @click.stop>
    <button
      class="current-language"
      :class="{ 'open': showLanguages }"
      @click="toggleLanguages"
      @blur="handleBlur"
      aria-label="Select language"
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
           @mouseleave="scheduleClose"
           ref="dropdown"
      >
        <div class="dropdown-header">
          <span class="header-title">{{ t('selectLanguage') }}</span>
          <button @click="closeLanguages" class="close-dropdown" aria-label="Close language selection">
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
            :class="['language-option', { 'active': currentLanguage === lang.code }]"
            @mousedown.prevent
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
        
        <div class="dropdown-footer">
          <div class="auto-detect">
            <input
              id="auto-detect"
              type="checkbox"
              v-model="autoDetect"
              @change="toggleAutoDetect"
            />
            <label for="auto-detect">{{ t('autoDetectLanguage') }}</label>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()
const { t, currentLanguage, availableLanguages, setLanguage, initialize } = languageStore

const showLanguages = ref(false)
const languageButton = ref<HTMLElement>()
const dropdown = ref<HTMLElement>()
let closeTimeout: number | null = null

const autoDetect = ref(true)

// Computed
const currentLanguageObj = computed(() => {
  return availableLanguages.find(lang => lang.code === currentLanguage.value) || availableLanguages[0]
})

// Methods
const toggleLanguages = () => {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  showLanguages.value = !showLanguages.value
  
  if (showLanguages.value) {
    nextTick(() => {
      dropdown.value?.focus()
    })
  }
}

const scheduleClose = () => {
  closeTimeout = window.setTimeout(() => {
    closeLanguages()
  }, 100)
}

const handleBlur = (event: FocusEvent) => {
  // Don't close if clicking on dropdown
  if (dropdown.value?.contains(event.relatedTarget as Node)) {
    return
  }
  scheduleClose()
}

const closeLanguages = () => {
  if (closeTimeout) {
    clearTimeout(closeTimeout)
    closeTimeout = null
  }
  showLanguages.value = false
  languageButton.value?.focus()
}

const selectLanguage = async (language: typeof availableLanguages[0]) => {
  try {
    await setLanguage(language.code)
    closeLanguages()
  } catch (error) {
    console.error('Failed to change language:', error)
  }
}

const toggleAutoDetect = () => {
  if (autoDetect.value) {
    // Try to detect browser language
    const browserLang = navigator.language.split('-')[0]
    const detectedLang = availableLanguages.find(lang => lang.code === browserLang)
    
    if (detectedLang && detectedLang.code !== currentLanguage.value) {
      selectLanguage(detectedLang)
    }
  }
}

// Initialize
onMounted(() => {
  // Initialize language store
  initialize()
  
  // Load auto-detect preference
  const savedAutoDetect = localStorage.getItem('luxury_auto_detect_language')
  if (savedAutoDetect !== null) {
    autoDetect.value = savedAutoDetect === 'true'
  }
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (event) => {
    if (showLanguages.value && 
        !languageButton.value?.contains(event.target as Node) && 
        !dropdown.value?.contains(event.target as Node)) {
      closeLanguages()
    }
  })
})

// Close dropdown on escape key
const handleEscapeKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && showLanguages.value) {
    closeLanguages()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscapeKey)
})

// Save auto-detect preference when changed
onUnmounted(() => {
  window.removeEventListener('keydown', handleEscapeKey)
  if (closeTimeout) {
    clearTimeout(closeTimeout)
  }
  document.removeEventListener('click', () => {})
  
  // Save auto-detect preference
  localStorage.setItem('luxury_auto_detect_language', autoDetect.value.toString())
})
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

.dropdown-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(212, 175, 55, 0.1);
  background: rgba(10, 10, 10, 0.95);
}

.auto-detect {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.auto-detect input[type="checkbox"] {
  width: 18px;
  height: 18px;
  appearance: none;
  background: rgba(212, 175, 55, 0.05);
  border: 1.5px solid rgba(212, 175, 55, 0.3);
  border-radius: 4px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.auto-detect input[type="checkbox"]:checked {
  background: #d4af37;
  border-color: #d4af37;
}

.auto-detect input[type="checkbox"]:checked::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 5px;
  width: 5px;
  height: 9px;
  border: solid #0a0a0a;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.auto-detect label {
  font-family: 'Inter', sans-serif;
  font-size: 0.8125rem;
  color: #a89c7c;
  cursor: pointer;
  user-select: none;
  transition: color 0.3s ease;
}

.auto-detect:hover label {
  color: #f4e7c1;
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