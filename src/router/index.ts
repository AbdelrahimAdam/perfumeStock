import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { seoGuard } from './guards'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// Apply SEO guard first
router.beforeEach(seoGuard)

// Main authentication & admin guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  console.log('📍 Navigation:', {
    from: from.path,
    to: to.path,
    name: to.name,
    requiresAuth: to.meta.requiresAuth,
    requiresAdmin: to.meta.requiresAdmin,
    requiresSuperAdmin: to.meta.requiresSuperAdmin
  })

  // Ensure authentication is up-to-date
  if (!authStore.isAuthenticated) {
    await authStore.checkAuth()
  }

  console.log('🔍 Auth state after check:', {
    isAuthenticated: authStore.isAuthenticated,
    isAdmin: authStore.isAdmin,
    isSuperAdmin: authStore.isSuperAdmin,
    user: authStore.user
  })

  // 1️⃣ Guest-only pages (like login)
  if (to.name === 'admin-login') {
    if (authStore.isAuthenticated && authStore.isSuperAdmin) {
      console.log('✅ Already logged in as super-admin, redirecting to dashboard')
      return next({ name: 'admin-dashboard' })
    }
    return next()
  }

  // 2️⃣ Super-admin routes
  if (to.meta.requiresSuperAdmin) {
    console.log('🌟 Checking super admin access...')
    if (!authStore.isAuthenticated || !authStore.isSuperAdmin) {
      console.log('🚫 Super admin access denied')
      return next({
        name: 'admin-login',
        query: { redirect: to.fullPath, error: 'superadmin_required' }
      })
    }
    return next()
  }

  // 3️⃣ Admin routes (optional if you only have super-admin)
  if (to.meta.requiresAdmin) {
    console.log('👑 Checking admin access...')
    if (!authStore.isAuthenticated || !authStore.isSuperAdmin) {
      console.log('🚫 Admin access denied')
      return next({
        name: 'admin-login',
        query: { redirect: to.fullPath, error: 'admin_required' }
      })
    }
    return next()
  }

  // 4️⃣ Authenticated routes
  if (to.meta.requiresAuth) {
    console.log('🔐 Checking authentication...')
    if (!authStore.isAuthenticated) {
      console.log('🚫 Authentication required')
      return next({
        name: 'admin-login',
        query: { redirect: to.fullPath }
      })
    }
    return next()
  }

  // 5️⃣ Public routes
  return next()
})

router.afterEach((to, from) => {
  const authStore = useAuthStore()
  console.log('✅ Navigation completed to:', to.path)
  console.log('📊 Current route state:', {
    isAuthenticated: authStore.isAuthenticated,
    isSuperAdmin: authStore.isSuperAdmin,
    user: authStore.user,
    role: authStore.user?.role
  })
})

// Handle navigation errors
router.onError((error, to, from) => {
  console.error('🚨 Router error:', error)
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    window.location.href = '/'
  }
})

export default router
export { useAuthStore }
