import type { Language, Product, Category } from '@/types'

/**
 * Format price with currency symbol
 */
export const formatPrice = (price: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Generate SEO-friendly URL
 */
export const generateSeoUrl = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Debounce function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Throttle function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Get localized text based on language
 */
export const getLocalizedText = (
  obj: { en: string; ar: string } | string,
  language: Language
): string => {
  if (typeof obj === 'string') return obj
  return obj[language] || obj.en || ''
}

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (originalPrice: number, salePrice: number): number => {
  if (originalPrice <= salePrice) return 0
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

/**
 * Format date
 */
export const formatDate = (date: Date | string, language: Language = 'en'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj)
}

/**
 * Validate email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Scroll to top smoothly
 */
export const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

/**
 * Get image dimensions
 */
export const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = reject
    img.src = url
  })
}

/**
 * Create query string from object
 */
export const toQueryString = (params: Record<string, any>): string => {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, String(value))
    }
  })
  return query.toString()
}

/**
 * Parse query string to object
 */
export const fromQueryString = (queryString: string): Record<string, string> => {
  const params = new URLSearchParams(queryString)
  const result: Record<string, string> = {}
  params.forEach((value, key) => {
    result[key] = value
  })
  return result
}

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Calculate cart totals
 */
export interface CartTotals {
  subtotal: number
  shipping: number
  tax: number
  total: number
}

export const calculateCartTotals = (
  items: Array<{ price: number; quantity: number }>,
  shippingRate: number = 20,
  taxRate: number = 0.05
): CartTotals => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 200 ? 0 : shippingRate
  const tax = subtotal * taxRate
  const total = subtotal + shipping + tax

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    shipping: Math.round(shipping * 100) / 100,
    tax: Math.round(tax * 100) / 100,
    total: Math.round(total * 100) / 100
  }
}

/**
 * Group by category
 */
export const groupByCategory = (products: Product[]): Record<string, Product[]> => {
  return products.reduce((groups, product) => {
    const category = product.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(product)
    return groups
  }, {} as Record<string, Product[]>)
}

/**
 * Get random items from array
 */
export const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}