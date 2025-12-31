import { createPinia } from 'pinia'
import { markRaw } from 'vue'
import type { Router } from 'vue-router'

// Pinia store with router plugin
export const pinia = createPinia()

export function setupStore(router: Router) {
  pinia.use(({ store }) => {
    store.router = markRaw(router)
  })
}

export * from './cart'
export * from './language'
export * from './products'
export * from './auth'