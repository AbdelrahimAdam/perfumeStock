import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueFire } from 'vuefire'
import App from './App.vue'
import router from './router'
import { app } from './firebase/config'
import './assets/styles/main.css'

// Import vue-i18n
import { createI18n } from 'vue-i18n'

// List of public paths that don't need authentication
const PUBLIC_PATHS = [
  '/',
  '/shop',
  '/offers',
  '/offer',
  '/brands',
  '/brand',
  '/cart',
  '/checkout',
  '/contact',
  '/about',
  '/collections',
  '/product',
  '/category',
  '/wishlist',
  '/admin/login'
]

const isPublicPath = (path: string): boolean => {
  return PUBLIC_PATHS.some(publicPath => 
    path === publicPath || path.startsWith(publicPath + '/')
  )
}

// Setup vue-i18n with minimal required translations
const i18n = createI18n({
  legacy: false,
  locale: 'en',
  messages: {
    en: {
      // Auth
      adminLogin: 'Admin Login',
      emailAddress: 'Email Address',
      password: 'Password',
      signIn: 'Sign In',
      invalidCredentials: 'Invalid email or password',
      backToStore: 'Back to Store',
      accessRestricted: 'Access restricted to authorized personnel only.',
      loggedInAs: 'Logged in as',
      adminPanel: 'Admin Panel',
      logout: 'Logout',
      
      // Navigation
      home: 'Home',
      shop: 'Shop',
      brands: 'Brands',
      mens: "Men's Collection",
      womens: "Women's Collection",
      about: 'About Us',
      contact: 'Contact',
      
      // UI
      search: 'Search',
      account: 'Account',
      wishlist: 'Wishlist',
      cart: 'Cart',
      menu: 'Menu',
      close: 'Close',
      profile: 'Profile',
      orders: 'Orders',
      
      // Common
      products: 'Products',
      category: 'Category',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      loading: 'Loading...',
      loadMore: 'Load More',
      noProductsFound: 'No Products Found',
      
      // Brand
      brandCollection: 'Brand Collection',
      exploreCollection: 'Explore our collection of {brand} luxury perfumes',
      brandNotFound: 'Brand not found',
      viewAllBrands: 'View All Brands',
      browseAllBrands: 'Browse All Brands',
      exploreOtherBrands: 'Explore Other Luxury Brands',
      addFirstProduct: 'Add First Product',
      
      // Product
      priceRange: 'Price Range',
      inStockOnly: 'In Stock Only',
      newestFirst: 'Newest First',
      priceLowToHigh: 'Price: Low to High',
      priceHighToLow: 'Price: High to Low',
      name: 'Name',
      highestRated: 'Highest Rated',
      
      // Store
      export: 'Export',
      refresh: 'Refresh',
      loadMoreProducts: 'Load More Products',
      noProductsAvailable: 'There are no products available for this brand yet.',
      theBrandYouAreLookingForDoesNotExist: 'The brand you are looking for does not exist.'
    },
    ar: {
      // Auth
      adminLogin: 'تسجيل دخول المسؤول',
      emailAddress: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      signIn: 'تسجيل الدخول',
      invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      backToStore: 'العودة للمتجر',
      accessRestricted: 'الوصول مقصور على الأشخاص المصرح لهم فقط.',
      loggedInAs: 'تم تسجيل الدخول كـ',
      adminPanel: 'لوحة التحكم',
      logout: 'تسجيل الخروج',
      
      // Navigation
      home: 'الرئيسية',
      shop: 'المتجر',
      brands: 'الماركات',
      mens: 'رجالي',
      womens: 'نسائي',
      about: 'من نحن',
      contact: 'اتصل بنا',
      
      // UI
      search: 'بحث',
      account: 'حسابي',
      wishlist: 'المفضلة',
      cart: 'السلة',
      menu: 'القائمة',
      close: 'إغلاق',
      profile: 'الملف الشخصي',
      orders: 'الطلبات',
      
      // Common
      products: 'المنتجات',
      category: 'الفئة',
      status: 'الحالة',
      active: 'نشط',
      inactive: 'غير نشط',
      loading: 'جاري التحميل...',
      loadMore: 'تحميل المزيد',
      noProductsFound: 'لم يتم العثور على منتجات',
      
      // Brand
      brandCollection: 'مجموعة الماركة',
      exploreCollection: 'استكشف مجموعتنا من عطور {brand} الفاخرة',
      brandNotFound: 'لم يتم العثور على الماركة',
      viewAllBrands: 'عرض جميع الماركات',
      browseAllBrands: 'تصفح جميع الماركات',
      exploreOtherBrands: 'استكشاف ماركات فاخرة أخرى',
      addFirstProduct: 'إضافة المنتج الأول',
      
      // Product
      priceRange: 'نطاق السعر',
      inStockOnly: 'المتوفر فقط',
      newestFirst: 'الأحدث أولاً',
      priceLowToHigh: 'السعر: من الأقل إلى الأعلى',
      priceHighToLow: 'السعر: من الأعلى إلى الأقل',
      name: 'الاسم',
      highestRated: 'الأعلى تقييماً',
      
      // Store
      export: 'تصدير',
      refresh: 'تحديث',
      loadMoreProducts: 'تحميل المزيد من المنتجات',
      noProductsAvailable: 'لا توجد منتجات متاحة لهذه الماركة بعد.',
      theBrandYouAreLookingForDoesNotExist: 'الماركة التي تبحث عنها غير موجودة.'
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
console.log('🌐 Languages: English & Arabic')
console.log('🔥 Firebase: Connected')

// Initialize stores after app is mounted
setTimeout(async () => {
  try {
    console.log('🏪 Starting store initialization...')
    
    // Check if current page is public
    const currentPath = window.location.pathname
    const isPublic = isPublicPath(currentPath)
    
    console.log(`📍 Current path: ${currentPath} (${isPublic ? 'Public' : 'Protected'})`)
    
    // Import stores - Use dynamic imports to avoid circular dependencies
    const { useAuthStore } = await import('@/stores/auth')
    const { useBrandsStore } = await import('@/stores/brands')
    const { useProductsStore } = await import('@/stores/products')
    const { useHomepageStore } = await import('@/stores/homepage')
    const { useCartStore } = await import('@/stores/cart')
    const { useLanguageStore } = await import('@/stores/language')
    
    // Get stores
    const authStore = useAuthStore()
    const brandsStore = useBrandsStore()
    const productsStore = useProductsStore()
    const homepageStore = useHomepageStore()
    const cartStore = useCartStore()
    const languageStore = useLanguageStore()
    
    console.log('🔄 Initializing language store...')
    if (typeof languageStore.initialize === 'function') {
      await languageStore.initialize()
    } else if (typeof languageStore.loadLanguage === 'function') {
      await languageStore.loadLanguage()
    }
    
    // Only check auth on protected pages
    if (!isPublic) {
      console.log('🔐 Protected page - checking authentication...')
      await authStore.checkAuth()
    } else {
      console.log('🌍 Public page - skipping authentication')
      authStore.resetAuthState?.()
    }
    
    console.log('📊 Initializing data stores...')
    // Initialize data stores in parallel
    await Promise.all([
      brandsStore.initialize(),
      productsStore.initialize(),
      homepageStore.loadHomepageData()
    ])
    
    console.log('🛒 Restoring cart...')
    cartStore.restoreCart()
    
    // Log initialization status (simplified)
    console.log('✅ All stores initialized successfully')
    console.log(`  👤 Auth: ${authStore.isAuthenticated ? 'Logged in' : 'Guest'}`)
    console.log(`  📁 Brands: ${brandsStore.brands?.length || 0}`)
    console.log(`  📦 Products: ${productsStore.products?.length || 0}`)
    console.log(`  🛒 Cart Items: ${cartStore.cartItems?.length || 0}`)
    console.log(`  🌐 Language: ${languageStore.currentLanguage}`)
    
    // Check if we need sample data (only in development)
    if (import.meta.env.DEV) {
      const brandsCount = brandsStore.brands?.length || 0
      const productsCount = productsStore.products?.length || 0
      
      if (brandsCount === 0 || productsCount === 0) {
        console.log('\n⚠️  Database appears empty')
        console.log('💡 Run initializeSampleData() in console')
        
        try {
          const { initializeSampleData } = await import('@/firebase/init')
          ;(window as any).initializeSampleData = initializeSampleData
        } catch (error) {
          console.log('⚠️  Could not load sample data function')
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error initializing stores:', error)
    
    // Try recovery
    try {
      console.log('🔄 Attempting recovery...')
      const currentPath = window.location.pathname
      const isPublic = isPublicPath(currentPath)
      
      const { useAuthStore } = await import('@/stores/auth')
      const { useBrandsStore } = await import('@/stores/brands')
      const { useProductsStore } = await import('@/stores/products')
      
      const authStore = useAuthStore()
      const brandsStore = useBrandsStore()
      const productsStore = useProductsStore()
      
      if (!isPublic) {
        try {
          await authStore.checkAuth()
        } catch (e) {
          console.log('⚠️  Auth recovery failed')
        }
      }
      
      await Promise.all([
        brandsStore.initialize().catch(() => {}),
        productsStore.initialize().catch(() => {})
      ])
      
    } catch (recoveryError) {
      console.error('❌ Recovery failed')
    }
  }
}, 1000)

// Global error handlers
window.addEventListener('error', (event) => {
  console.error('🌍 Global error:', event.message)
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('🌍 Unhandled promise rejection')
})

vueApp.config.errorHandler = (err) => {
  console.error('🧩 Vue error:', err)
}

// Development mode
if (import.meta.env.DEV) {
  console.log('🔧 Development mode enabled')
  
  // Expose stores for debugging on protected pages
  setTimeout(async () => {
    try {
      const currentPath = window.location.pathname
      const isPublic = isPublicPath(currentPath)
      
      if (!isPublic) {
        const { useAuthStore } = await import('@/stores/auth')
        const { useBrandsStore } = await import('@/stores/brands')
        const { useProductsStore } = await import('@/stores/products')
        
        ;(window as any).stores = {
          auth: useAuthStore(),
          brands: useBrandsStore(),
          products: useProductsStore()
        }
      }
    } catch (error) {
      // Silently fail
    }
  }, 2000)
}