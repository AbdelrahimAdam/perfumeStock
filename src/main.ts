import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueFire } from 'vuefire'
import App from './App.vue'
import router from './router'
import { app } from './firebase/config'
import './assets/styles/main.css'

// Import vue-i18n
import { createI18n } from 'vue-i18n'

// Setup vue-i18n with basic language support
const i18n = createI18n({
  legacy: false, // Use composition API mode
  locale: 'en', // Default language
  messages: {
    en: {
      message: {
        hello: 'Hello World',
        adminLogin: 'Admin Login',
        emailAddress: 'Email Address',
        password: 'Password',
        signIn: 'Sign In',
        invalidCredentials: 'Invalid email or password',
        backToStore: 'Back to Store',
        accessRestricted: 'Access restricted to authorized personnel only.'
      },
    },
    ar: {
      message: {
        hello: 'مرحبًا بالعالم',
        adminLogin: 'تسجيل دخول المسؤول',
        emailAddress: 'البريد الإلكتروني',
        password: 'كلمة المرور',
        signIn: 'تسجيل الدخول',
        invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
        backToStore: 'العودة للمتجر',
        accessRestricted: 'الوصول مقصور على الأشخاص المصرح لهم فقط.'
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
vueApp.use(i18n)

// Mount app
vueApp.mount('#app')

// Log app info
console.log('🚀 Luxury Perfume Store v1.0.0')
console.log('🎨 Design: Luxury Minimalist')
console.log('🌐 Languages: English & Arabic')
console.log('🔥 Firebase: Connected')

// ⚠️ Spark plan limitation: Cannot initialize superadmin from frontend
// Superadmin creation should only be done via `create-superadmin.js` script locally
