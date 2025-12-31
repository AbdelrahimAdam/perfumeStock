import * as yup from 'yup'

// Product validation schema
export const productSchema = yup.object().shape({
  name: yup.object().shape({
    en: yup.string().required('English name is required').min(2, 'Name must be at least 2 characters'),
    ar: yup.string().required('Arabic name is required').min(2, 'Name must be at least 2 characters')
  }),
  slug: yup.string()
    .required('Slug is required')
    .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-friendly'),
  category: yup.string().required('Category is required'),
  price: yup.number()
    .required('Price is required')
    .positive('Price must be positive')
    .min(1, 'Price must be at least $1')
    .max(10000, 'Price cannot exceed $10,000'),
  size: yup.string().required('Size is required'),
  concentration: yup.string().required('Concentration is required'),
  description: yup.object().shape({
    en: yup.string().required('English description is required').min(10, 'Description must be at least 10 characters'),
    ar: yup.string().required('Arabic description is required').min(10, 'Description must be at least 10 characters')
  }),
  notes: yup.object().shape({
    top: yup.array().of(yup.string()).min(1, 'At least one top note is required'),
    heart: yup.array().of(yup.string()).min(1, 'At least one heart note is required'),
    base: yup.array().of(yup.string()).min(1, 'At least one base note is required')
  }),
  imageUrl: yup.string().url('Must be a valid URL').required('Image URL is required'),
  isBestSeller: yup.boolean().default(false)
})

// Admin login validation schema
export const loginSchema = yup.object().shape({
  email: yup.string()
    .required('Email is required')
    .email('Must be a valid email'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
})

// Contact form validation schema
export const contactSchema = yup.object().shape({
  name: yup.string()
    .required('Name is required')
    .min(2, 'Name must be at least 2 characters'),
  email: yup.string()
    .required('Email is required')
    .email('Must be a valid email'),
  subject: yup.string()
    .required('Subject is required')
    .min(5, 'Subject must be at least 5 characters'),
  message: yup.string()
    .required('Message is required')
    .min(20, 'Message must be at least 20 characters')
    .max(1000, 'Message cannot exceed 1000 characters')
})

// Newsletter subscription schema
export const newsletterSchema = yup.object().shape({
  email: yup.string()
    .required('Email is required')
    .email('Must be a valid email')
})

// Image validation
export const validateImage = (file: File): string[] => {
  const errors: string[] = []
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (!validTypes.includes(file.type)) {
    errors.push('Image must be JPEG, PNG, or WebP format')
  }

  if (file.size > maxSize) {
    errors.push('Image size must be less than 5MB')
  }

  return errors
}

// Price range validation
export const priceRangeSchema = yup.object().shape({
  min: yup.number().min(0, 'Minimum price must be at least 0'),
  max: yup.number().when('min', (min, schema) => {
    return schema.min(min || 0, 'Maximum price must be greater than minimum price')
  })
})

// Filter validation
export const filterSchema = yup.object().shape({
  category: yup.string().optional(),
  minPrice: yup.number().min(0).optional(),
  maxPrice: yup.number().min(0).optional(),
  concentration: yup.string().optional(),
  sortBy: yup.string().oneOf(['newest', 'price-low', 'price-high', 'popular']).optional()
})

// Validate URL
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Validate phone number
export const phoneSchema = yup.string()
  .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone number')
  .optional()

// Validate postal code
export const postalCodeSchema = yup.string()
  .matches(/^\d{5}(-\d{4})?$/, 'Invalid postal code')
  .optional()

// Password strength validator
export const validatePasswordStrength = (password: string): {
  valid: boolean
  score: number
  feedback: string[]
} => {
  const feedback: string[] = []
  let score = 0

  // Length check
  if (password.length >= 8) score += 1
  else feedback.push('Password must be at least 8 characters')

  // Lowercase check
  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Password must contain lowercase letters')

  // Uppercase check
  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Password must contain uppercase letters')

  // Number check
  if (/\d/.test(password)) score += 1
  else feedback.push('Password must contain numbers')

  // Special character check
  if (/[^A-Za-z0-9]/.test(password)) score += 1
  else feedback.push('Password must contain special characters')

  return {
    valid: score >= 4,
    score,
    feedback
  }
}

// Credit card validation
export const creditCardSchema = yup.object().shape({
  number: yup.string()
    .required('Card number is required')
    .matches(/^\d{16}$/, 'Card number must be 16 digits'),
  expiry: yup.string()
    .required('Expiry date is required')
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Must be in MM/YY format'),
  cvv: yup.string()
    .required('CVV is required')
    .matches(/^\d{3,4}$/, 'CVV must be 3 or 4 digits'),
  name: yup.string()
    .required('Name on card is required')
    .min(2, 'Name must be at least 2 characters')
})