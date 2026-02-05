import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Auth guard for protected routes (requires authentication)
export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  console.log('🛡️ Auth guard triggered for:', to.path)
  console.log('🔍 Current auth state:', {
    isAuthenticated: authStore.isAuthenticated.value,
    isSuperAdmin: authStore.isSuperAdmin.value,
    user: authStore.user
  })

  // Check authentication status
  if (!authStore.isAuthenticated.value) {
    console.log('🔐 Not authenticated, checking auth...')
    await authStore.checkAuth()
  }

  // If still not authenticated, redirect to login
  if (!authStore.isAuthenticated.value) {
    console.log('🚫 Not authenticated, redirecting to login')
    next({
      name: 'admin-login',
      query: {
        redirect: to.fullPath,
        error: 'authentication_required'
      }
    })
    return
  }

  // Check if route requires admin access
  if (to.meta.requiresAdmin && !authStore.isAdmin.value && !authStore.isSuperAdmin.value) {
    console.log('🚫 Admin access required but user is not admin')
    next({
      name: 'admin-login',
      query: {
        redirect: to.fullPath,
        error: 'admin_access_required'
      }
    })
    return
  }

  // Check if route requires super admin access
  if (to.meta.requiresSuperAdmin && !authStore.isSuperAdmin.value) {
    console.log('🚫 Super admin access required but user is not super admin')
    next({
      name: 'admin-dashboard',
      query: {
        error: 'superadmin_required'
      }
    })
    return
  }

  console.log('✅ Access granted, proceeding to:', to.path)
  next()
}

// Guest guard for login page (prevent access if already logged in)
export const guestGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  console.log('🛡️ Guest guard triggered for:', to.path)
  
  // Check current authentication status
  if (!authStore.isAuthenticated.value) {
    await authStore.checkAuth()
  }

  // If already authenticated as admin or super admin, redirect to dashboard
  if (authStore.isAuthenticated.value && (authStore.isAdmin.value || authStore.isSuperAdmin.value)) {
    console.log('✅ Already logged in as admin, redirecting to dashboard')
    next({ name: 'admin-dashboard' })
  } else {
    console.log('👤 Not logged in or not admin, allowing access to login')
    next()
  }
}

// Admin guard (super-admin only) - kept for backward compatibility
export const adminGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const authStore = useAuthStore()

  console.log('🛡️ Admin guard triggered for:', to.path)
  
  if (!authStore.isAuthenticated.value) {
    await authStore.checkAuth()
  }

  if (authStore.isAuthenticated.value && authStore.isSuperAdmin.value) {
    console.log('✅ Super-admin access granted')
    next()
  } else {
    console.log('🚫 Super-admin access denied')
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
  updateMetaTags(to)
  next()
}

// Helper functions for meta tags
const updateMetaTags = (to: RouteLocationNormalized) => {
  const meta = to.meta
  const title = getLocalizedTitle(meta)
  const description = getLocalizedDescription(meta)

  document.title = title

  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.setAttribute('name', 'description')
    document.head.appendChild(metaDescription)
  }
  metaDescription.setAttribute('content', description)

  updateOgTag('og:title', title)
  updateOgTag('og:description', description)
  updateOgTag('og:url', window.location.href)
}

const updateOgTag = (property: string, content: string) => {
  let tag = document.querySelector(`meta[property="${property}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

const getLocalizedTitle = (meta: any): string => {
  const title = meta?.title
  if (!title) return 'Luxury Perfume Store'
  if (typeof title === 'string') return title
  const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en'
  return title[browserLang] || title.en || 'Luxury Perfume Store'
}

const getLocalizedDescription = (meta: any): string => {
  const description = meta?.description
  if (!description) return 'Luxury perfume store with exclusive fragrances collection'
  if (typeof description === 'string') return description
  const browserLang = navigator.language.startsWith('ar') ? 'ar' : 'en'
  return description[browserLang] || description.en || 'Luxury perfume store with exclusive fragrances collection'
}