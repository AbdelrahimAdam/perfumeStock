import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueFire } from 'vuefire'
import App from './App.vue'
import router from './router'
import { app } from './firebase/config'
import './assets/styles/main.css'

// Import vue-i18n
import { createI18n } from 'vue-i18n'

// Setup vue-i18n with basic language support (you can add more translations as needed)
const i18n = createI18n({
  legacy: false, // Use composition API mode
  locale: 'en', // Default language
  messages: {
    en: {
      message: {
        hello: 'Hello World',
      },
    },
    ar: {
      message: {
        hello: 'مرحبًا بالعالم',
      },
    },
  },
})

// Create app
const vueApp = createApp(App)
const pinia = createPinia()

// Use plugins
vueApp.use(pinia)
vueApp.use(router)
vueApp.use(VueFire, { firebaseApp: app })
vueApp.use(i18n) // Add vue-i18n to the app

// Mount app
vueApp.mount('#app')

// Log app info
console.log('🚀 Luxury Perfume Store v1.0.0')
console.log('🎨 Design: Luxury Minimalist')
console.log('🌐 Languages: English & Arabic')
console.log('🔥 Firebase: Connected')
