import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { SEOData, Language } from '@/types'
import { useLanguage } from './useLanguage'
import { SEO_DEFAULTS, APP_NAME } from '@/utils/constants'

export const useSEO = (customData?: Partial<SEOData>) => {
  const route = useRoute()
  const { currentLanguage } = useLanguage()

  // Default SEO data
  const defaultData: SEOData = {
    ...SEO_DEFAULTS,
    title: APP_NAME,
    url: window.location.href
  }

  // Current SEO data
  const seoData = ref<SEOData>({ ...defaultData, ...customData })

  // Update meta tags
  const updateMetaTags = () => {
    const { title, description, keywords, image, url, type } = seoData.value

    // Update document title
    document.title = title

    // Update meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords?.join(', '))

    // Open Graph tags
    updateMetaTag('og:title', title, 'property')
    updateMetaTag('og:description', description, 'property')
    updateMetaTag('og:image', image, 'property')
    updateMetaTag('og:url', url, 'property')
    updateMetaTag('og:type', type, 'property')

    // Twitter tags
    updateMetaTag('twitter:title', title)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', image)
    updateMetaTag('twitter:card', 'summary_large_image')

    // Canonical URL
    updateLinkTag('canonical', url)
  }

  // Helper to update meta tag
  const updateMetaTag = (name: string, content?: string, attr: string = 'name') => {
    if (!content) return

    let element = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement
    if (!element) {
      element = document.createElement('meta')
      element.setAttribute(attr, name)
      document.head.appendChild(element)
    }
    element.setAttribute('content', content)
  }

  // Helper to update link tag
  const updateLinkTag = (rel: string, href?: string) => {
    if (!href) return

    let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement
    if (!element) {
      element = document.createElement('link')
      element.setAttribute('rel', rel)
      document.head.appendChild(element)
    }
    element.setAttribute('href', href)
  }

  // Set SEO data
  const setSEO = (data: Partial<SEOData>) => {
    seoData.value = { ...seoData.value, ...data }
    updateMetaTags()
  }

  // Generate SEO data for product
  const generateProductSEO = (product: any, language: Language = 'en') => {
    const title = `${product.name[language]} | ${APP_NAME}`
    const description = product.description[language].substring(0, 160)
    const image = product.imageUrl

    return {
      title,
      description,
      image,
      type: 'product' as const,
      keywords: [
        product.name[language],
        product.category,
        'perfume',
        'fragrance',
        'luxury'
      ]
    }
  }

  // Generate SEO data for category
  const generateCategorySEO = (category: any, language: Language = 'en') => {
    const title = `${category[language]} | ${APP_NAME}`
    const description = `Browse our collection of ${category[language].toLowerCase()}. ${APP_NAME} offers luxury fragrances for every occasion.`

    return {
      title,
      description,
      type: 'website' as const,
      keywords: [
        category[language],
        'perfume',
        'fragrance',
        'collection',
        'luxury'
      ]
    }
  }

  // Watch for route changes
  watch(
    () => route.path,
    () => {
      // Update URL when route changes
      seoData.value.url = window.location.href
      updateMetaTags()
    }
  )

  // Watch for language changes
  watch(currentLanguage, () => {
    // You might want to update SEO based on language
    updateMetaTags()
  })

  // Initialize
  const initialize = () => {
    updateMetaTags()
  }

  return {
    seoData,
    setSEO,
    generateProductSEO,
    generateCategorySEO,
    updateMetaTags,
    initialize
  }
}

// SEO Head composable for Vue components
export const useSEOHead = () => {
  const seo = useSEO()

  const Head = {
    title: (title: string) => {
      seo.setSEO({ title })
      return Head
    },
    description: (description: string) => {
      seo.setSEO({ description })
      return Head
    },
    image: (image: string) => {
      seo.setSEO({ image })
      return Head
    },
    keywords: (keywords: string[]) => {
      seo.setSEO({ keywords })
      return Head
    },
    url: (url: string) => {
      seo.setSEO({ url })
      return Head
    },
    type: (type: 'website' | 'article' | 'product') => {
      seo.setSEO({ type })
      return Head
    }
  }

  return Head
}