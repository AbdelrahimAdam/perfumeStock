import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Auth guard for protected routes
export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  console.log('🛡️ Auth guard triggered for:', to.path)
  console.log('🔍 Current auth state:', {
    isAuthenticated: authStore.isAuthenticated,
    isAdmin: authStore.isAdmin,
    isSuperAdmin: authStore.isSuperAdmin,
    user: authStore.user
  })

  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    console.log('🔐 Not authenticated, checking auth...')
    await authStore.checkAuth()
  }

  const userHasAccess = authStore.isAuthenticated && authStore.isAdmin
  
  console.log('✅ Access check result:', {
    userHasAccess,
    isAuthenticated: authStore.isAuthenticated,
    isAdmin: authStore.isAdmin,
    isSuperAdmin: authStore.isSuperAdmin
  })

  if (userHasAccess) {
    console.log('🎉 Access granted, proceeding to:', to.path)
    next()
  } else {
    console.log('🚫 Access denied, redirecting to login')
    // Redirect to login with return URL
    next({
      name: 'admin-login',
      query: { 
        redirect: to.fullPath,
        error: 'access_denied'
      }
    })
  }
}

// Guest guard for login/register pages
export const guestGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  console.log('🛡️ Guest guard triggered for:', to.path)
  
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    await authStore.checkAuth()
  }

  if (authStore.isAuthenticated && authStore.isAdmin) {
    console.log('✅ Already logged in as admin, redirecting to dashboard')
    // Already logged in, redirect to admin dashboard
    next({ name: 'admin-dashboard' })
  } else {
    console.log('👤 Not logged in or not admin, allowing access to login')
    next()
  }
}

// Admin-only guard (requires admin role)
export const adminGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  console.log('🛡️ Admin guard triggered for:', to.path)
  
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    await authStore.checkAuth()
  }

  if (authStore.isAuthenticated && authStore.isAdmin) {
    console.log('✅ Admin access granted')
    next()
  } else {
    console.log('🚫 Admin access denied')
    next({
      name: 'admin-login',
      query: { 
        redirect: to.fullPath,
        error: 'admin_required'
      }
    })
  }
}

// Super-admin-only guard (requires super-admin role)
export const superAdminGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  console.log('🛡️ SuperAdmin guard triggered for:', to.path)
  
  // Check if user is authenticated
  if (!authStore.isAuthenticated) {
    await authStore.checkAuth()
  }

  if (authStore.isAuthenticated && authStore.isSuperAdmin) {
    console.log('✅ SuperAdmin access granted')
    next()
  } else {
    console.log('🚫 SuperAdmin access denied')
    next({
      name: 'admin-login',
      query: { 
        redirect: to.fullPath,
        error: 'superadmin_required'
      }
    })
  }
}

// SEO guard to update meta tags
export const seoGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  // Update meta tags based on route
  updateMetaTags(to)
  next()
}

// Helper function to update meta tags
const updateMetaTags = (to: RouteLocationNormalized) => {
  const meta = to.meta
  const title = getLocalizedTitle(meta)
  const description = getLocalizedDescription(meta)

  // Update document title
  document.title = title

  // Update meta description
  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.setAttribute('name', 'description')
    document.head.appendChild(metaDescription)
  }
  metaDescription.setAttribute('content', description)

  // Update Open Graph tags
  updateOgTag('og:title', title)
  updateOgTag('og:description', description)
  updateOgTag('og:url', window.location.href)
}

// Helper to update Open Graph tags
const updateOgTag = (property: string, content: string) => {
  let tag = document.querySelector(`meta[property="${property}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

// Helper to get localized title
const getLocalizedTitle = (meta: any): string => {
  const title = meta?.title
  if (!title) return 'Luxury Perfume Store'

  if (typeof title === 'string') return title
  
  // Get browser language or default to English
  const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en'
  return title[browserLang] || title.en || 'Luxury Perfume Store'
}

// Helper to get localized description
const getLocalizedDescription = (meta: any): string => {
  const description = meta?.description
  if (!description) return 'Luxury perfume store with exclusive fragrances collection'

  if (typeof description === 'string') return description
  
  // Get browser language or default to English
  const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en'
  return description[browserLang] || description.en || 'Luxury perfume store with exclusive fragrances collection'
}