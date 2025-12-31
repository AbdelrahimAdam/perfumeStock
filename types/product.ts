import type { Product, ProductFormData, Category } from './index'

export type ProductSize = '30ml' | '50ml' | '100ml' | '200ml' | '500ml'
export type Concentration = 'EDT' | 'EDP' | 'Parfum' | 'Extrait'

export const CONCENTRATIONS: Record<Concentration, string> = {
  'EDT': 'Eau de Toilette',
  'EDP': 'Eau de Parfum',
  'Parfum': 'Parfum',
  'Extrait': 'Extrait de Parfum'
}

export const SIZES: ProductSize[] = ['30ml', '50ml', '100ml', '200ml', '500ml']

export const NOTES_CATEGORIES = {
  top: 'Top Notes',
  heart: 'Heart Notes',
  base: 'Base Notes'
}

export const NOTES_LIST = [
  'Bergamot', 'Lemon', 'Orange', 'Grapefruit', 'Lime',
  'Lavender', 'Rose', 'Jasmine', 'Lily', 'Violet',
  'Sandalwood', 'Cedar', 'Oud', 'Patchouli', 'Vetiver',
  'Vanilla', 'Amber', 'Musk', 'Tonka Bean', 'Leather'
]

export interface ProductVariant {
  size: ProductSize
  price: number
  sku: string
}

export interface ProductInventory {
  productId: string
  variants: ProductVariant[]
  stock: number
}

export const validateProductData = (data: Partial<ProductFormData>): string[] => {
  const errors: string[] = []

  if (!data.name?.en?.trim()) errors.push('English name is required')
  if (!data.name?.ar?.trim()) errors.push('Arabic name is required')
  if (!data.slug?.trim()) errors.push('Slug is required')
  if (!data.category?.trim()) errors.push('Category is required')
  if (!data.price || data.price < 0) errors.push('Valid price is required')
  if (!data.size?.trim()) errors.push('Size is required')
  if (!data.concentration?.trim()) errors.push('Concentration is required')
  if (!data.description?.en?.trim()) errors.push('English description is required')
  if (!data.description?.ar?.trim()) errors.push('Arabic description is required')
  if (!data.imageUrl?.trim()) errors.push('Image URL is required')

  return errors
}

export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}