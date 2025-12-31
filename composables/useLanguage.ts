import { ref, computed, onMounted, watch } from 'vue'
import { useLocalStorage } from '@vueuse/core'
import type { Language } from '@/types'

export const useLanguage = () => {
  // Current language state
  const currentLanguage = useLocalStorage<Language>('luxury_perfume_language', 'en')
  const isRTL = computed(() => currentLanguage.value === 'ar')

  // Font families based on language
  const fontFamily = computed(() => {
    return isRTL.value 
      ? "'IBM Plex Arabic', 'Cairo', system-ui, sans-serif"
      : "'Inter', 'Playfair Display', system-ui, sans-serif"
  })

  // Text direction
  const direction = computed(() => 
    isRTL.value ? 'rtl' : 'ltr'
  )

  // Set language
  const setLanguage = (lang: Language) => {
    currentLanguage.value = lang
    updateDocumentAttributes()
  }

  // Toggle language
  const toggleLanguage = () => {
    setLanguage(currentLanguage.value === 'en' ? 'ar' : 'en')
  }

  // Update HTML document attributes
  const updateDocumentAttributes = () => {
    document.documentElement.lang = currentLanguage.value
    document.documentElement.dir = direction.value
    document.body.style.fontFamily = fontFamily.value
  }

  // Initialize
  const initialize = () => {
    // Detect browser language
    const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en'
    
    // Use saved language or browser language
    if (!currentLanguage.value) {
      currentLanguage.value = browserLang
    }
    
    updateDocumentAttributes()
  }

  // Get localized text
  const t = (text: { en: string; ar: string } | string): string => {
    if (typeof text === 'string') return text
    return text[currentLanguage.value] || text.en || ''
  }

  // Format date based on language
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return new Intl.DateTimeFormat(currentLanguage.value === 'en' ? 'en-US' : 'ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj)
  }

  // Format number based on language
  const formatNumber = (number: number) => {
    return new Intl.NumberFormat(currentLanguage.value === 'en' ? 'en-US' : 'ar-SA').format(number)
  }

  // Watch for language changes
  watch(currentLanguage, () => {
    updateDocumentAttributes()
  })

  // Initialize on mount
  onMounted(initialize)

  return {
    // State
    currentLanguage,
    isRTL,
    fontFamily,
    direction,

    // Actions
    setLanguage,
    toggleLanguage,
    t,
    formatDate,
    formatNumber,
    initialize
  }
}

// Language switcher composable for components
export const useLanguageSwitcher = () => {
  const language = useLanguage()

  const languageOptions = [
    { value: 'en', label: 'English', flag: '🇺🇸' },
    { value: 'ar', label: 'العربية', flag: '🇸🇦' }
  ]

  const currentLanguageOption = computed(() => 
    languageOptions.find(option => option.value === language.currentLanguage.value)
  )

  return {
    ...language,
    languageOptions,
    currentLanguageOption
  }
}