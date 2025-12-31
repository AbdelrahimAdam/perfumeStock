export type Language = 'en' | 'ar'

export interface Product {
  id: string
  name: {
    en: string
    ar: string
  }
  slug: string
  category: string
  price: number
  size: string
  concentration: string
  description: {
    en: string
    ar: string
  }
  notes: {
    top: string[]
    heart: string[]
    base: string[]
  }
  imageUrl: string
  isBestSeller: boolean
  createdAt: any
  updatedAt: any
}

export interface ProductFormData extends Omit<Product, 'id' | 'createdAt' | 'updatedAt'> {
  imageFile?: File
}

export interface CartItem {
  id: string
  name: {
    en: string
    ar: string
  }
  imageUrl: string
  price: number
  size: string
  quantity: number
}

export interface Category {
  id: string
  en: string
  ar: string
  image?: string
  description?: {
    en: string
    ar: string
  }
}

export interface SEOData {
  title: string
  description: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
}

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export interface AdminUser {
  uid: string
  email: string | null
  role: 'admin'
  createdAt?: Date
}

export interface FilterOptions {
  category?: string
  minPrice?: number
  maxPrice?: number
  concentration?: string
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'popular'
}

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}