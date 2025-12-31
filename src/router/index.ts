import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { authGuard, guestGuard } from './guards'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Global guards
router.beforeEach((to, from, next) => {
  // Auth guard
  if (to.meta.requiresAuth) {
    return authGuard(to, from, next)
  }

  // Guest guard
  if (to.meta.requiresGuest) {
    return guestGuard(to, from, next)
  }

  next()
})

// Global after each hook
router.afterEach((to) => {
  // Update page title
  const title = to.meta.title || 'Luxury Perfume Store'
  document.title = typeof title === 'string' ? title : title.en
  
  // Track page view for analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: to.path
    })
  }
})

export default router