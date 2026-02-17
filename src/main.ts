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
  '/admin/login'
]

const isPublicPath = (path: string): boolean => {
  return PUBLIC_PATHS.some(publicPath => 
    path === publicPath || path.startsWith(publicPath + '/')
  )
}

// Setup vue-i18n with basic language support
const i18n = createI18n({
  legacy: false, // Use composition API mode
  locale: 'en', // Default language
  messages: {
    en: {
      // General translations
      hello: 'Hello World',
      adminLogin: 'Admin Login',
      emailAddress: 'Email Address',
      password: 'Password',
      signIn: 'Sign In',
      invalidCredentials: 'Invalid email or password',
      backToStore: 'Back to Store',
      accessRestricted: 'Access restricted to authorized personnel only.',
      
      // Brand translations
      brandTomFord: 'Tom Ford',
      brandChanel: 'Chanel',
      brandDior: 'Dior',
      brandGucci: 'Gucci',
      brandYvesSaintLaurent: 'Yves Saint Laurent',
      
      // Product translations
      noirExtreme: 'Noir Extreme',
      sauvage: 'Sauvage',
      cocoMademoiselle: 'Coco Mademoiselle',
      
      // Brand descriptions
      tomFordDescription: 'Luxury fragrances from Tom Ford Private Blend collection',
      chanelDescription: 'Iconic French perfumes from the House of Chanel',
      diorDescription: 'French luxury fashion house known for sophisticated fragrances',
      
      // UI translations
      products: 'Products',
      priceRange: 'Price Range',
      brandId: 'Brand ID',
      editBrandInAdmin: 'Edit Brand in Admin',
      addProductToBrand: 'Add Product to Brand',
      brandCollection: 'Brand Collection',
      exploreCollection: 'Explore our collection of {brand} luxury perfumes',
      allConcentrations: 'All Concentrations',
      inStockOnly: 'In Stock Only',
      export: 'Export',
      refresh: 'Refresh',
      loadMoreProducts: 'Load More Products',
      loading: 'Loading...',
      noProductsFound: 'No Products Found',
      noProductsAvailable: 'There are no products available for this brand yet.',
      browseAllBrands: 'Browse All Brands',
      addFirstProduct: 'Add First Product',
      exploreOtherBrands: 'Explore Other Luxury Brands',
      home: 'Home',
      luxuryPerfumes: 'Luxury Perfumes',
      urlSlug: 'URL Slug',
      category: 'Category',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      deactivate: 'Deactivate',
      activate: 'Activate',
      hideDetails: 'Hide Details',
      showBrandDetails: 'Show Brand Details',
      newestFirst: 'Newest First',
      priceLowToHigh: 'Price: Low to High',
      priceHighToLow: 'Price: High to Low',
      name: 'Name',
      highestRated: 'Highest Rated',
      backToHome: 'Back to Home',
      brandNotFound: 'Brand not found',
      failedToLoadBrand: 'Failed to load brand',
      
      // Auth translations
      brands: 'Brands',
      viewAllBrands: 'View All Brands',
      theBrandYouAreLookingForDoesNotExist: 'The brand you are looking for does not exist.',
      loggedInAs: 'Logged in as',
      adminPanel: 'Admin Panel',
      logout: 'Logout'
    },
    ar: {
      // General translations
      hello: 'مرحبًا بالعالم',
      adminLogin: 'تسجيل دخول المسؤول',
      emailAddress: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      signIn: 'تسجيل الدخول',
      invalidCredentials: 'البريد الإلكتروني أو كلمة المرور غير صحيحة',
      backToStore: 'العودة للمتجر',
      accessRestricted: 'الوصول مقصور على الأشخاص المصرح لهم فقط.',
      
      // Brand translations
      brandTomFord: 'توم فورد',
      brandChanel: 'شانيل',
      brandDior: 'ديور',
      brandGucci: 'غوتشي',
      brandYvesSaintLaurent: 'ايف سان لوران',
      
      // Product translations
      noirExtreme: 'نوار إكستريم',
      sauvage: 'سافاج',
      cocoMademoiselle: 'كوكو مادموزيل',
      
      // Brand descriptions
      tomFordDescription: 'عطور فاخرة من مجموعة توم فورد الخاصة',
      chanelDescription: 'عطور فرنسية أيقونية من دار شانيل',
      diorDescription: 'دار أزياء فاخرة فرنسية معروفة بعطورها المتطورة',
      
      // UI translations
      products: 'المنتجات',
      priceRange: 'نطاق السعر',
      brandId: 'معرّف الماركة',
      editBrandInAdmin: 'تحرير الماركة في لوحة التحكم',
      addProductToBrand: 'إضافة منتج إلى الماركة',
      brandCollection: 'مجموعة الماركة',
      exploreCollection: 'استكشف مجموعتنا من عطور {brand} الفاخرة',
      allConcentrations: 'جميع التركيزات',
      inStockOnly: 'المتوفر فقط',
      export: 'تصدير',
      refresh: 'تحديث',
      loadMoreProducts: 'تحميل المزيد من المنتجات',
      loading: 'جاري التحميل...',
      noProductsFound: 'لم يتم العثور على منتجات',
      noProductsAvailable: 'لا توجد منتجات متاحة لهذه الماركة بعد.',
      browseAllBrands: 'تصفح جميع الماركات',
      addFirstProduct: 'إضافة المنتج الأول',
      exploreOtherBrands: 'استكشاف ماركات فاخرة أخرى',
      home: 'الرئيسية',
      luxuryPerfumes: 'عطور فاخرة',
      urlSlug: 'رابط URL',
      category: 'الفئة',
      status: 'الحالة',
      active: 'نشط',
      inactive: 'غير نشط',
      deactivate: 'تعطيل',
      activate: 'تفعيل',
      hideDetails: 'إخفاء التفاصيل',
      showBrandDetails: 'عرض تفاصيل الماركة',
      newestFirst: 'الأحدث أولاً',
      priceLowToHigh: 'السعر: من الأقل إلى الأعلى',
      priceHighToLow: 'السعر: من الأعلى إلى الأقل',
      name: 'الاسم',
      highestRated: 'الأعلى تقييماً',
      backToHome: 'العودة إلى الرئيسية',
      brandNotFound: 'لم يتم العثور على الماركة',
      failedToLoadBrand: 'فشل تحميل الماركة',
      
      // Auth translations
      brands: 'الماركات',
      viewAllBrands: 'عرض جميع الماركات',
      theBrandYouAreLookingForDoesNotExist: 'الماركة التي تبحث عنها غير موجودة.',
      loggedInAs: 'تم تسجيل الدخول كـ',
      adminPanel: 'لوحة التحكم',
      logout: 'تسجيل الخروج'
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
    // Check if language store has initialize method
    if (typeof languageStore.initialize === 'function') {
      await languageStore.initialize()
    } else if (typeof languageStore.loadLanguage === 'function') {
      await languageStore.loadLanguage()
    } else {
      console.log('ℹ️ Language store initialization not required')
    }
    
    // Only check auth on protected pages
    if (!isPublic) {
      console.log('🔐 Protected page - checking authentication...')
      await authStore.checkAuth()
    } else {
      console.log('🌍 Public page - skipping authentication')
      // Clear any existing auth state on public pages
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
    // Restore cart from localStorage (always do this)
    cartStore.restoreCart()
    
    // Log initialization status
    console.log('✅ All stores initialized successfully')
    console.log('📊 Store Status:')
    console.log(`  👤 Auth: ${authStore.isAuthenticated ? `Logged in (${authStore.user?.email})` : 'Guest'}`)
    console.log(`  👑 Admin: ${authStore.isAdmin ? 'Yes' : 'No'}`)
    console.log(`  👑 Super Admin: ${authStore.isSuperAdmin ? 'Yes' : 'No'}`)
    console.log(`  📁 Brands: ${brandsStore.brands?.length || 0}`)
    console.log(`  📦 Products: ${productsStore.products?.length || 0}`)
    
    // Safe access to homepage data
    const homepageData = homepageStore.homepageData || {}
    const featuredBrands = homepageData.featuredBrands || []
    const activeOffers = homepageData.activeOffers || []
    const marqueeBrands = homepageData.marqueeBrands || []
    
    console.log(`  ⭐ Featured Brands: ${featuredBrands.length}`)
    console.log(`  🎯 Active Offers: ${activeOffers.length}`)
    console.log(`  🏁 Marquee Brands: ${marqueeBrands.length}`)
    console.log(`  🛒 Cart Items: ${cartStore.cartItems?.length || 0}`)
    console.log(`  🌐 Language: ${languageStore.currentLanguage}`)
    console.log(`  📱 RTL: ${languageStore.isRTL ? 'Yes' : 'No'}`)
    
    // Check if we need sample data (only in development)
    if (import.meta.env.DEV) {
      const brandsCount = brandsStore.brands?.length || 0
      const productsCount = productsStore.products?.length || 0
      
      if (brandsCount === 0 || productsCount === 0) {
        console.log('\n📝 DATABASE STATUS:')
        console.log('⚠️  Database appears empty or incomplete')
        console.log('💡 To initialize sample data:')
        console.log('1. Open browser console (F12)')
        console.log('2. Run: initializeSampleData()')
        console.log('3. Wait for success message')
        console.log('4. Refresh the page')
        
        try {
          // Make initialization function available globally
          const { initializeSampleData } = await import('@/firebase/init')
          ;(window as any).initializeSampleData = initializeSampleData
          console.log('✅ Sample data function is now available in console')
        } catch (error) {
          console.log('⚠️  Could not load sample data function')
        }
      } else {
        console.log('\n✅ Database already populated:')
        console.log(`   Brands: ${brandsCount}`)
        console.log(`   Products: ${productsCount}`)
      }
    }
    
    // Auto-initialize sample data only on protected pages in development
    if (!isPublic && import.meta.env.DEV && (brandsStore.brands?.length || 0) === 0) {
      console.log('\n🔄 Attempting to auto-initialize sample data...')
      try {
        const { initializeSampleData } = await import('@/firebase/init')
        await initializeSampleData()
        console.log('✅ Sample data initialized successfully!')
        console.log('🔄 Refreshing stores...')
        
        // Refresh stores after initialization
        await Promise.all([
          brandsStore.initialize(),
          productsStore.initialize(),
          homepageStore.loadHomepageData()
        ])
        
        console.log('🎉 Ready to use!')
      } catch (error) {
        console.log('⚠️  Auto-initialization failed. Please run initializeSampleData() manually from console.')
      }
    }
    
  } catch (error) {
    console.error('❌ Error initializing stores:', error)
    
    // Try to recover by initializing stores individually (but only on protected pages)
    try {
      console.log('🔄 Attempting recovery initialization...')
      
      const currentPath = window.location.pathname
      const isPublic = isPublicPath(currentPath)
      
      const { useAuthStore } = await import('@/stores/auth')
      const { useBrandsStore } = await import('@/stores/brands')
      const { useProductsStore } = await import('@/stores/products')
      
      const authStore = useAuthStore()
      const brandsStore = useBrandsStore()
      const productsStore = useProductsStore()
      
      // Only try to recover auth on protected pages
      if (!isPublic) {
        try {
          await authStore.checkAuth()
          console.log('✅ Auth store recovered')
        } catch (e) {
          console.log('⚠️  Auth store recovery failed, continuing as guest')
        }
      } else {
        console.log('🌍 Public page - skipping auth recovery')
      }
      
      // Try to initialize brands
      try {
        await brandsStore.initialize()
        console.log('✅ Brands store recovered')
      } catch (e) {
        console.log('⚠️  Brands store recovery failed')
      }
      
      // Try to initialize products
      try {
        await productsStore.initialize()
        console.log('✅ Products store recovered')
      } catch (e) {
        console.log('⚠️  Products store recovery failed')
      }
      
    } catch (recoveryError) {
      console.error('❌ Recovery also failed:', recoveryError)
    }
  }
}, 1000)

// Add global error handler for better debugging
window.addEventListener('error', function(event) {
  console.error('🌍 Global error:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  })
})

// Add unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(event) {
  console.error('🌍 Unhandled promise rejection:', event.reason)
})

// Make sure components are loaded correctly
vueApp.config.errorHandler = (err, instance, info) => {
  console.error('🧩 Vue error handler:', {
    error: err,
    component: instance?.$options?.name || 'Unknown',
    lifecycleHook: info
  })
}

// Performance monitoring (development only)
if (import.meta.env.DEV) {
  console.log('🔧 Development mode enabled')
  
  // Expose stores to window for debugging (only on protected pages)
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
        
        console.log('🔍 Stores exposed to window.stores for debugging')
      }
    } catch (error) {
      // Silently fail - this is just for debugging
    }
  }, 2000)
}

// ⚠️ Spark plan limitation: Cannot initialize superadmin from frontend
// Superadmin creation should only be done via `create-superadmin.js` script locally