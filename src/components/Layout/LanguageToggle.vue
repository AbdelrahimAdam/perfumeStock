<template>
  <div class="luxury-language-toggle">
    <button
      @click="toggleLanguage"
      class="language-toggle-btn"
      :aria-label="currentLanguage === 'en' ? 'Switch to Arabic' : 'التبديل إلى الإنجليزية'"
      :class="{ 'rtl': currentLanguage === 'ar' }"
    >
      <span class="language-flag">{{ currentFlag }}</span>
      <span class="language-text">{{ currentLanguage === 'en' ? 'EN' : 'AR' }}</span>
      <div class="language-indicator" :class="{ 'active': currentLanguage === 'ar' }">
        <span class="indicator-dot"></span>
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLanguageStore } from '@/stores/language'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'

const languageStore = useLanguageStore()
const { currentLanguage } = storeToRefs(languageStore)

// Language data
const languages = {
  en: {
    code: 'en',
    name: 'English',
    flag: '🇺🇸',
    direction: 'ltr'
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    flag: '🇸🇦',
    direction: 'rtl'
  }
}

const currentFlag = computed(() => languages[currentLanguage.value].flag)

const toggleLanguage = () => {
  const newLang = currentLanguage.value === 'en' ? 'ar' : 'en'
  const newLangData = languages[newLang]
  
  // Switch language
  languageStore.setLanguage(newLang)
  
  // Update document direction
  document.documentElement.dir = newLangData.direction
  document.documentElement.lang = newLangData.code
  
  // Update body class for RTL styling
  if (newLangData.direction === 'rtl') {
    document.body.classList.add('rtl')
  } else {
    document.body.classList.remove('rtl')
  }
  
  // Dispatch event for other components
  const event = new CustomEvent('language-changed', {
    detail: { 
      language: newLangData.code, 
      direction: newLangData.direction,
      name: newLangData.name 
    }
  })
  window.dispatchEvent(event)
}

// Initialize on mount
import { onMounted } from 'vue'
onMounted(() => {
  const langData = languages[currentLanguage.value]
  document.documentElement.dir = langData.direction
  document.documentElement.lang = langData.code
  
  if (langData.direction === 'rtl') {
    document.body.classList.add('rtl')
  }
})
</script>

<style scoped>
.luxury-language-toggle {
  position: relative;
}

.language-toggle-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  background: rgba(212, 175, 55, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 25px;
  color: #f4e7c1;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(5px);
  min-width: 100px;
}

.language-toggle-btn:hover {
  background: rgba(212, 175, 55, 0.2);
  border-color: #d4af37;
  transform: translateY(-1px);
}

.language-toggle-btn.rtl {
  flex-direction: row-reverse;
}

.language-flag {
  font-size: 1.2rem;
  line-height: 1;
}

.language-text {
  letter-spacing: 1px;
  font-weight: 600;
}

.language-indicator {
  width: 40px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 15px;
  position: relative;
  transition: all 0.3s ease;
  margin-left: auto;
}

.language-toggle-btn.rtl .language-indicator {
  margin-left: 0;
  margin-right: auto;
}

.language-indicator.active {
  background: rgba(212, 175, 55, 0.3);
}

.indicator-dot {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 14px;
  height: 14px;
  background: #d4af37;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.language-indicator.active .indicator-dot {
  left: 22px;
}

@media (max-width: 768px) {
  .language-toggle-btn {
    padding: 0.4rem 0.75rem;
    font-size: 0.8rem;
    min-width: 90px;
  }
  
  .language-indicator {
    width: 32px;
    height: 16px;
  }
  
  .indicator-dot {
    width: 12px;
    height: 12px;
  }
  
  .language-indicator.active .indicator-dot {
    left: 18px;
  }
}

/* RTL specific adjustments */
:global(.rtl) .language-toggle-btn {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

:global(.rtl) .language-text {
  letter-spacing: 0;
}
</style>