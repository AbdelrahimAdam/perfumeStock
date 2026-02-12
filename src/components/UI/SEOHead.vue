<template>
  <!-- SEOHead is a head-management component - no visible output -->
</template>

<script setup lang="ts">
import { onMounted, watch, computed, onUnmounted } from 'vue' // ✅ Added onUnmounted
import { useRoute } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { storeToRefs } from 'pinia'
import { APP_NAME } from '@/utils/luxuryConstants'

interface Props {
  title?: string | { en: string; ar: string }
  description?: string | { en: string; ar: string }
  keywords?: string[]
  image?: string
  type?: 'website' | 'article' | 'product'
  url?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'website',
  url: '',
  image: '/images/og-luxury-perfumes.jpg',
})

const route = useRoute()
const languageStore = useLanguageStore()
const { currentLanguage } = storeToRefs(languageStore)

// Computed route path for reactivity
const routePath = computed(() => route.path)

// Type-safe localized text helper
type Language = 'en' | 'ar'

const getLocalized = (value: string | { en: string; ar: string } | undefined): string => {
  if (!value) return ''
  if (typeof value === 'string') return value
  
  const lang = currentLanguage.value as Language
  return value[lang] || value.en || ''
}

// Full page title - Updated to P.NOTES
const pageTitle = computed(() => {
  const baseTitle = getLocalized(props.title) || (route.meta.title as string) || APP_NAME
  return `${baseTitle} | P.NOTES` // ✅ Changed from "Perfume Stock" to "P.NOTES"
})

// Meta description - Updated to P.NOTES
const pageDescription = computed(() => {
  return getLocalized(props.description) || (route.meta.description as string) || 
         'Discover P.NOTES - A curated collection of the world\'s most exquisite luxury fragrances, niche perfumes, and exclusive aromatic experiences.'
})

// Final URL
const pageUrl = computed(() => {
  return props.url || window.location.href
})

// Open Graph / Twitter image
const pageImage = computed(() => {
  return props.image || '/images/og-luxury-perfumes.jpg'
})

// Update document title
const updateTitle = () => {
  document.title = pageTitle.value
}

// Better type safety for meta tags
const setMetaTag = (name: string, content: string, attr: 'name' | 'property' = 'name'): void => {
  if (!content) return

  let meta = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`)
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attr, name)
    document.head.appendChild(meta)
  }
  meta.content = content
}

// Better type safety for canonical link
const setCanonical = (href: string): void => {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = href
}

// Remove duplicate meta tags before adding new ones
const cleanupDuplicateMetaTags = (): void => {
  // Remove any duplicate Open Graph tags that might cause issues
  const ogTags = document.querySelectorAll('meta[property^="og:"]')
  const seen = new Set<string>()
  
  ogTags.forEach(tag => {
    const property = tag.getAttribute('property')
    if (property && seen.has(property)) {
      tag.remove()
    } else if (property) {
      seen.add(property)
    }
  })
}

// Main update function
const updateSEO = (): void => {
  updateTitle()
  cleanupDuplicateMetaTags()

  // Standard meta
  setMetaTag('description', pageDescription.value)
  if (props.keywords?.length) {
    setMetaTag('keywords', props.keywords.join(', '))
  }

  // Open Graph - Updated to P.NOTES
  setMetaTag('og:title', pageTitle.value, 'property')
  setMetaTag('og:description', pageDescription.value, 'property')
  setMetaTag('og:image', pageImage.value, 'property')
  setMetaTag('og:url', pageUrl.value, 'property')
  setMetaTag('og:type', props.type, 'property')
  setMetaTag('og:site_name', 'P.NOTES', 'property') // ✅ Changed from "Perfume Stock" to "P.NOTES"

  // Twitter - Updated to P.NOTES
  setMetaTag('twitter:card', 'summary_large_image')
  setMetaTag('twitter:title', pageTitle.value)
  setMetaTag('twitter:description', pageDescription.value)
  setMetaTag('twitter:image', pageImage.value)
  setMetaTag('twitter:site', '@pnotes')
  setMetaTag('twitter:creator', '@pnotes')

  // Canonical
  setCanonical(pageUrl.value)
}

// Proper watchers with cleanup
const stopLanguageWatcher = watch(currentLanguage, updateSEO)
const stopRouteWatcher = watch(routePath, updateSEO)
const stopTitleWatcher = watch(() => props.title, updateSEO)
const stopDescriptionWatcher = watch(() => props.description, updateSEO)
const stopKeywordsWatcher = watch(() => props.keywords, updateSEO, { deep: false })
const stopImageWatcher = watch(() => props.image, updateSEO)
const stopUrlWatcher = watch(() => props.url, updateSEO)

// Initial update
onMounted(() => {
  // Small delay to ensure head is ready
  setTimeout(updateSEO, 50)
})

// ✅ FIXED: Cleanup on unmount - now properly imported
onUnmounted(() => {
  stopLanguageWatcher()
  stopRouteWatcher()
  stopTitleWatcher()
  stopDescriptionWatcher()
  stopKeywordsWatcher()
  stopImageWatcher()
  stopUrlWatcher()
})
</script>