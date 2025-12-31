// Luxury Types
export type Language = 'en' | 'ar'

export interface Translation {
  en: string
  ar: string
}

export interface Category {
  id: string
  en: string
  ar: string
  description: Translation
  image: string
  featured: boolean
}

export interface Product {
  id: string
  slug: string
  name: Translation
  brand: string
  description: Translation
  price: number
  originalPrice?: number
  size: string
  concentration: string
  notes: {
    top: string[]
    heart: string[]
    base: string[]
  }
  imageUrl: string
  images: string[]
  category: string
  isBestSeller: boolean
  inStock: boolean
  rating?: number
  reviewCount?: number
  createdAt?: {
    seconds: number
    nanoseconds: number
    toDate: () => Date
  }
  updatedAt?: {
    seconds: number
    nanoseconds: number
    toDate: () => Date
  }
  meta?: {
    weight?: string
    dimensions?: string
    ingredients?: string[]
    howToUse?: Translation
  }
}

export interface CartItem {
  id: string
  name: Translation
  imageUrl: string
  price: number
  size: string
  concentration?: string
  brand?: string
  quantity: number
  addedAt?: string
}

export interface AdminUser {
  uid: string
  email: string
  displayName: string
  photoURL?: string
  role: 'admin' | 'super-admin'
  lastLogin?: Date
}

export interface ProductFormData {
  name: Translation
  brand: string
  description: Translation
  price: number
  originalPrice?: number
  size: string
  concentration: string
  notes: {
    top: string[]
    heart: string[]
    base: string[]
  }
  imageUrl: string
  images: string[]
  category: string
  isBestSeller: boolean
  inStock: boolean
}

export interface FilterOptions {
  category?: string
  brand?: string
  minPrice?: number
  maxPrice?: number
  concentration?: string
  minRating?: number
  bestseller?: boolean
  newArrival?: boolean
  sortBy?: string
  searchTerm?: string
}

export interface Order {
  id: string
  userId?: string
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  shippingAddress: {
    fullName: string
    address: string
    city: string
    country: string
    postalCode: string
    phone: string
  }
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed'
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  productId: string
  userId: string
  userName: string
  rating: number
  comment: string
  createdAt: Date
  helpful?: number
}

export interface WishlistItem {
  id: string
  productId: string
  userId: string
  addedAt: Date
}

export interface NewsletterSubscriber {
  id: string
  email: string
  name?: string
  subscribedAt: Date
  preferences?: {
    newArrivals: boolean
    promotions: boolean
    tips: boolean
  }
}

// Luxury Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Luxury Form Types
export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  language: Language
}

export interface NewsletterFormData {
  email: string
  name?: string
  language: Language
  preferences?: {
    newArrivals: boolean
    promotions: boolean
    tips: boolean
  }
}

// Luxury UI Types
export interface LuxuryTheme {
  colors: {
    darkBg: string
    darkBrown: string
    gold: string
    goldLight: string
    goldDark: string
    lightBg: string
    cardBg: string
    red: string
  }
  typography: {
    serif: string
    sans: string
    arabic: string
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
  }
  shadows: {
    soft: string
    medium: string
    gold: string
    luxury: string
  }
}

// Export all types
export type {
  Language,
  Translation,
  Category,
  Product,
  CartItem,
  AdminUser,
  ProductFormData,
  FilterOptions,
  Order,
  Review,
  WishlistItem,
  NewsletterSubscriber,
  ApiResponse,
  PaginatedResponse,
  ContactFormData,
  NewsletterFormData,
  LuxuryTheme
}