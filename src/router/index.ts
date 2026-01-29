import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { 
  authGuard, 
  guestGuard, 
  adminGuard,
  superAdminGuard,
  seoGuard 
} from './guards'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Debug navigation
router.beforeEach((to, from, next) => {
  console.log('📍 Navigation:', {
    from: from.path,
    to: to.path,
    name: to.name,
    requiresAuth: to.meta.requiresAuth,
    requiresAdmin: to.meta.requiresAdmin,
    requiresSuperAdmin: to.meta.requiresSuperAdmin
  })
  
  // Apply SEO guard
  seoGuard(to, from, () => {
    // Check route requirements and apply appropriate guard
    if (to.meta.requiresSuperAdmin) {
      superAdminGuard(to, from, next)
    } else if (to.meta.requiresAdmin) {
      adminGuard(to, from, next)
    } else if (to.meta.requiresAuth) {
      authGuard(to, from, next)
    } else if (to.name === 'admin-login') {
      guestGuard(to, from, next)
    } else {
      next()
    }
  })
})

router.afterEach((to, from) => {
  console.log('✅ Navigation completed to:', to.path)
  console.log('📊 Current route state:', {
    isAuthenticated: useAuthStore().isAuthenticated,
    user: useAuthStore().user,
    role: useAuthStore().user?.role
  })
})

// Handle navigation errors
router.onError((error, to, from) => {
  console.error('🚨 Router error:', error)
  console.error('Failed navigation:', { to: to.path, from: from.path })
  
  // Redirect to home on navigation error
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    window.location.href = '/'
  }
})

export default router

// Export auth store for use in components
import { useAuthStore } from '@/stores/auth'
export { useAuthStore }