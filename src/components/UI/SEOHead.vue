<template>
  <!-- SEOHead is a head-management component - no visible output -->
</template>

<script setup lang="ts">
import { onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { storeToRefs } from 'pinia'
import { APP_NAME } from '@/utils/LuxuryConstants'

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

// Localized text helper
const getLocalized = (value: string | { en: string; ar: string } | undefined): string => {
  if (!value) return ''
  if (typeof value === 'string') return value
  return value[currentLanguage.value] || value.en || ''
}

// Full page title
const pageTitle = computed(() => {
  const baseTitle = getLocalized(props.title) || (route.meta.title as string) || APP_NAME
  return `${baseTitle} | Perfume Stock`
})

// Meta description
const pageDescription = computed(() => {
  return getLocalized(props.description) || (route.meta.description as string) || 
         'Experience the essence of luxury with Perfume Stock. Premium French perfumes, exotic Arabic oud, and exclusive niche fragrances.'
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

// Generic meta tag updater
const setMetaTag = (name: string, content: string, attr: 'name' | 'property' = 'name') => {
  if (!content) return

  let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute(attr, name)
    document.head.appendChild(meta)
  }
  meta.content = content
}

// Canonical link
const setCanonical = (href: string) => {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement
  if (!link) {
    link = document.createElement('link')
    link.rel = 'canonical'
    document.head.appendChild(link)
  }
  link.href = href
}

// Main update function
const updateSEO = () => {
  updateTitle()

  // Standard meta
  setMetaTag('description', pageDescription.value)
  if (props.keywords?.length) {
    setMetaTag('keywords', props.keywords.join(', '))
  }

  // Open Graph
  setMetaTag('og:title', pageTitle.value, 'property')
  setMetaTag('og:description', pageDescription.value, 'property')
  setMetaTag('og:image', pageImage.value, 'property')
  setMetaTag('og:url', pageUrl.value, 'property')
  setMetaTag('og:type', props.type, 'property')
  setMetaTag('og:site_name', 'Perfume Stock', 'property')

  // Twitter
  setMetaTag('twitter:card', 'summary_large_image')
  setMetaTag('twitter:title', pageTitle.value)
  setMetaTag('twitter:description', pageDescription.value)
  setMetaTag('twitter:image', pageImage.value)

  // Canonical
  setCanonical(pageUrl.value)
}

// Watchers
watch(currentLanguage, updateSEO)
watch(routePath, updateSEO)
watch(() => props.title, updateSEO)
watch(() => props.description, updateSEO)
watch(() => props.keywords, updateSEO)
watch(() => props.image, updateSEO)
watch(() => props.url, updateSEO)

// Initial update
onMounted(() => {
  // Small delay to ensure head is ready
  setTimeout(updateSEO, 50)
})
</script>