import type { RouteRecordRaw } from 'vue-router'
import type { Language } from '@/types'

export const routes: Array<RouteRecordRaw> = [
  // ========== PUBLIC ROUTES (NO LOGIN REQUIRED) ==========
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/HomePage.vue'),
    meta: {
      title: {
        en: 'Luxury Perfumes | Premium Fragrances Collection',
        ar: 'عطور فاخرة | مجموعة العطور المميزة'
      },
      description: {
        en: 'Discover our exclusive collection of luxury perfumes, Arabic oud, French perfumes, and niche fragrances. Free shipping on orders over 2000 EGP.',
        ar: 'اكتشف مجموعتنا الحصرية من العطور الفاخرة، العود العربي، العطور الفرنسية، والعبوات النيش. شحن مجاني للطلبات فوق 2000 جنيه مصري.'
      },
      requiresAuth: false,
      layout: 'default'
    }
  },

  {
    path: '/shop',
    name: 'shop',
    component: () => import('@/pages/ShopPage.vue'),
    meta: {
      title: {
        en: 'Shop All Perfumes | Luxury Fragrance Store',
        ar: 'تسوق جميع العطور | متجر العطور الفاخرة'
      },
      description: {
        en: 'Browse our complete collection of luxury perfumes from all brands and categories. Prices in EGP.',
        ar: 'تصفح مجموعتنا الكاملة من العطور الفاخرة من جميع الماركات والفئات. الأسعار بالجنيه المصري.'
      },
      requiresAuth: false,
      layout: 'default'
    }
  },

  {
    path: '/category/:slug',
    name: 'category',
    component: () => import('@/pages/CategoryPage.vue'),
    props: true,
    meta: {
      title: {
        en: 'Perfume Collection | Luxury Fragrances',
        ar: 'مجموعة العطور | عطور فاخرة'
      },
      description: {
        en: 'Browse our curated collection of luxury perfumes by category. Find your perfect scent.',
        ar: 'تصفح مجموعتنا المختارة من العطور الفاخرة حسب الفئة. ابحث عن عطرك المثالي.'
      },
      requiresAuth: false,
      layout: 'default'
    }
  },

  {
    path: '/brands',
    name: 'brands',
    component: () => import('@/pages/BrandsPage.vue'),
    meta: {
      title: {
        en: 'Brands | Luxury Perfume Collections',
        ar: 'الماركات | مجموعات العطور الفاخرة'
      },
      description: {
        en: 'Explore our luxury perfume collections from premium brands worldwide. All prices in EGP.',
        ar: 'استكشف مجموعات العطور الفاخرة من الماركات العالمية المميزة. جميع الأسعار بالجنيه المصري.'
      },
      requiresAuth: false,
      layout: 'default'
    }
  },

  {
    path: '/brand/:slug',
    name: 'brand',
    component: () => import('@/pages/BrandPage.vue'),
    props: true,
    meta: {
      title: {
        en: 'Brand Collection | Luxury Perfumes',
        ar: 'مجموعة العلامة التجارية | عطور فاخرة'
      },
      description: {
        en: 'Discover our curated collection of luxury perfumes from this premium brand.',
        ar: 'اكتشف مجموعتنا المختارة من العطور الفاخرة من هذه العلامة التجارية المميزة.'
      },
      requiresAuth: false,
      layout: 'default'
    }
  },

  {
    path: '/collections',
    name: 'collections',
    component: () => import('@/pages/CollectionsPage.vue'),
    meta: {
      title: {
        en: 'Collections | Curated Perfume Sets',
        ar: 'المجموعات | مجموعات عطور مختارة'
      },
      description: {
        en: 'Discover our specially curated perfume collections and gift sets. Perfect gifts in EGP.',
        ar: 'اكتشف مجموعات العطور المختارة خصيصاً ومجموعات الهدايا. هدايا مثالية بالجنيه المصري.'
      },
      requiresAuth: false,
      layout: 'default'
    }
  },

  {
    path: '/product/:slug',
    name: 'product',
    component: () => import('@/pages/ProductPage.vue'),
    props: true,
    meta: {
      title: {
        en: 'Luxury Perfume | Premium Fragrance',
        ar: 'عطر فاخر | عبور مميز'
      },
      description: {
        en: 'Discover this luxury perfume with premium ingredients and exquisite craftsmanship. Price in EGP.',
        ar: 'اكتشف هذا العطر الفاخر مع مكونات مميزة وحرفية رائعة. السعر بالجنيه المصري.'
      },
      requiresAuth: false,
      layout: 'default'
    }
  },

  // ===== OFFER ROUTES =====
  {
    path: '/offers',
    name: 'offers',
    component: () => import('@/pages/OfferPage.vue'), // Fixed: now points to OffersPage, not OfferPage
    meta: {
      title: {
        en: 'Special Offers | Luxury Perfume Deals',
        ar: 'عروض خاصة | تخفيضات العطور الفاخرة'
      },
      description: {
        en: 'Check out our latest exclusive offers and discounts on luxury perfumes. Limited time deals.',
        ar: 'اطلع على أحدث عروضنا الحصرية وتخفيضات العطور الفاخرة. عروض لفترة محدودة.'
      },
      requiresAuth: false,
      layout: 'default'
    }
  },
  {
    path: '/offer/:slug',
    name: 'offer',
    component: () => import('@/pages/OfferPage.vue'),
    props: true,
    meta: {
      title: {
        en: 'Special Offer | Luxury Perfume',
        ar: 'عرض خاص | عطر فاخر'
      },
      description: {
        en: 'Discover this exclusive offer on luxury perfume. Limited time discount.',
        ar: 'اكتشف هذا العرض الحصري على العطور الفاخرة. خصم لفترة محدودة.'
      },
      requiresAuth: false,
      layout: 'default'
    }
  },
  // ===== END OFFER ROUTES =====

  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/pages/CartPage.vue'),
    meta: {
      title: {
        en: 'Shopping Cart | Your Luxury Selections',
        ar: 'سلة التسوق | اختياراتك الفاخرة'
      },
      description: {
        en: 'Review your selected luxury perfumes and proceed to checkout. Prices in EGP.',
        ar: 'راجع عطورك الفاخرة المختارة وتابع إلى الدفع. الأسعار بالجنيه المصري.'
      },
      requiresAuth: false,
      layout: 'default'
    }
  },

  {
    path: '/checkout',
    name: 'checkout',
    component: () => import('@/pages/CheckoutPage.vue'),
    meta: {
      title: {
        en: 'Checkout | Secure Payment',
        ar: 'الدفع | دفع آمن'
      },
      description: {
        en: 'Complete your purchase securely with multiple payment options. All prices in EGP.',
        ar: 'أكمل عملية الشراء بأمان مع خيارات دفع متعددة. جميع الأسعار بالجنيه المصري.'
      },
      requiresAuth: false,
      layout: 'default'
    }
  },

  {
    path: '/contact',
    name: 'contact',
    component: () => import('@/pages/ContactPage.vue'),
    meta: {
      title: {
        en: 'Contact Us | Luxury Perfume Store',
        ar: 'اتصل بنا | متجر العطور الفاخرة'
      },
      description: {
        en: 'Get in touch with our luxury perfume experts. We\'re here to help you find your perfect scent.',
        ar: 'تواصل مع خبراء العطور الفاخرة. نحن هنا لمساعدتك في العثور على عطرك المثالي.'
      },
      requiresAuth: false,
      layout: 'default'
    }
  },

  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/AboutPage.vue'),
    meta: {
      title: {
        en: 'About Us | Luxury Perfume Store',
        ar: 'من نحن | متجر العطور الفاخرة'
      },
      description: {
        en: 'Learn about our passion for luxury perfumes and commitment to quality.',
        ar: 'تعرف على شغفنا بالعطور الفاخرة والتزامنا بالجودة.'
      },
      requiresAuth: false,
      layout: 'default'
    }
  },

  {
    path: '/orders',
    name: 'orders',
    component: () => import('@/pages/OrdersPage.vue'),
    meta: {
      title: {
        en: 'My Orders | Luxury Perfume Store',
        ar: 'طلباتي | متجر العطور الفاخرة'
      },
      requiresAuth: true,
      layout: 'default'
    }
  },

  {
    path: '/wishlist',
    name: 'wishlist',
    component: () => import('@/pages/WishlistPage.vue'),
    meta: {
      title: {
        en: 'My Wishlist | Luxury Perfume Store',
        ar: 'قائمة رغباتي | متجر العطور الفاخرة'
      },
      requiresAuth: true,
      layout: 'default'
    }
  },

  // ========== ADMIN ROUTES (ADMIN ONLY) ==========
  // Admin Login (No auth required)
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/pages/Admin/LoginPage.vue'),
    meta: {
      title: {
        en: 'Admin Login | Luxury Perfume Store',
        ar: 'تسجيل دخول المسؤول | متجر العطور الفاخرة'
      },
      requiresAuth: false,
      requiresAdmin: false,
      layout: 'admin-login'
    }
  },

  // ========== ADMIN DASHBOARD ROUTES ==========
  // Admin Dashboard
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('@/pages/Admin/DashboardPage.vue'),
    meta: {
      title: {
        en: 'Admin Dashboard | Luxury Perfume Store',
        ar: 'لوحة تحكم المسؤول | متجر العطور الفاخرة'
      },
      requiresAuth: true,
      requiresAdmin: true,
      layout: 'admin'
    }
  },
  
  {
    path: '/admin/dashboard',
    redirect: { name: 'admin-dashboard' }
  },

  // ========== PRODUCTS MANAGEMENT ROUTES ==========
  {
    path: '/admin/products',
    name: 'admin-products',
    component: () => import('@/pages/Admin/ProductsPage.vue'),
    meta: {
      title: {
        en: 'Manage Products | Admin Dashboard',
        ar: 'إدارة المنتجات | لوحة تحكم المسؤول'
      },
      requiresAuth: true,
      requiresAdmin: true,
      layout: 'admin'
    }
  },
  
  {
    path: '/admin/products/new',
    name: 'admin-product-new',
    component: () => import('@/pages/Admin/ProductFormPage.vue'),
    meta: {
      title: {
        en: 'Add New Product | Admin Dashboard',
        ar: 'إضافة منتج جديد | لوحة تحكم المسؤول'
      },
      requiresAuth: true,
      requiresAdmin: true,
      layout: 'admin'
    }
  },
  
  {
    path: '/admin/products/edit/:id',
    name: 'admin-product-edit',
    component: () => import('@/pages/Admin/ProductFormPage.vue'),
    props: true,
    meta: {
      title: {
        en: 'Edit Product | Admin Dashboard',
        ar: 'تعديل المنتج | لوحة تحكم المسؤول'
      },
      requiresAuth: true,
      requiresAdmin: true,
      layout: 'admin'
    }
  },

  // ========== ORDERS MANAGEMENT ROUTES ==========
  {
    path: '/admin/orders',
    name: 'admin-orders',
    component: () => import('@/pages/Admin/OrdersPage.vue'),
    meta: {
      title: {
        en: 'Manage Orders | Admin Dashboard',
        ar: 'إدارة الطلبات | لوحة تحكم المسؤول'
      },
      requiresAuth: true,
      requiresAdmin: true,
      layout: 'admin'
    }
  },

  // ========== CUSTOMERS MANAGEMENT ROUTES ==========
  {
    path: '/admin/customers',
    name: 'admin-customers',
    component: () => import('@/pages/Admin/CustomersPage.vue'),
    meta: {
      title: {
        en: 'Manage Customers | Admin Dashboard',
        ar: 'إدارة العملاء | لوحة تحكم المسؤول'
      },
      requiresAuth: true,
      requiresAdmin: true,
      layout: 'admin'
    }
  },

  // ========== BRANDS MANAGEMENT ROUTES ==========
  {
    path: '/admin/brands',
    name: 'admin-brands',
    component: () => import('@/pages/Admin/BrandsPage.vue'),
    meta: {
      title: {
        en: 'Manage Brands | Admin Dashboard',
        ar: 'إدارة الماركات | لوحة تحكم المسؤول'
      },
      requiresAuth: true,
      requiresAdmin: true,
      layout: 'admin'
    }
  },
  
  {
    path: '/admin/brands/new',
    name: 'admin-brand-new',
    component: () => import('@/pages/Admin/BrandFormPage.vue'),
    meta: {
      title: {
        en: 'Add New Brand | Admin Dashboard',
        ar: 'إضافة ماركة جديدة | لوحة تحكم المسؤول'
      },
      requiresAuth: true,
      requiresAdmin: true,
      layout: 'admin'
    }
  },
  
  {
    path: '/admin/brands/edit/:id',
    name: 'admin-brand-edit',
    component: () => import('@/pages/Admin/BrandFormPage.vue'),
    props: true,
    meta: {
      title: {
        en: 'Edit Brand | Admin Dashboard',
        ar: 'تعديل الماركة | لوحة تحكم المسؤول'
      },
      requiresAuth: true,
      requiresAdmin: true,
      layout: 'admin'
    }
  },

  // ========== ADMIN PROFILE ROUTES ==========
  {
    path: '/admin/profile',
    name: 'admin-profile',
    component: () => import('@/pages/Admin/ProfilePage.vue'),
    meta: {
      title: {
        en: 'Admin Profile | Luxury Perfume Store',
        ar: 'ملف المسؤول | متجر العطور الفاخرة'
      },
      requiresAuth: true,
      requiresAdmin: true,
      layout: 'admin'
    }
  },

  // ========== SETTINGS ROUTES (ADMIN ONLY) ==========
  {
    path: '/admin/settings',
    name: 'admin-settings',
    component: () => import('@/pages/Admin/SettingsPage.vue'),
    meta: {
      title: {
        en: 'Settings | Admin Dashboard',
        ar: 'الإعدادات | لوحة تحكم المسؤول'
      },
      requiresAuth: true,
      requiresAdmin: true,
      layout: 'admin'
    }
  },

  // ========== HOMEPAGE MANAGEMENT ROUTES (SUPER ADMIN ONLY) ==========
  {
    path: '/admin/homepage',
    name: 'admin-homepage',
    component: () => import('@/components/Admin/HomepageManagement.vue'),
    meta: {
      title: {
        en: 'Homepage Management | Admin Dashboard',
        ar: 'إدارة الصفحة الرئيسية | لوحة تحكم المسؤول'
      },
      description: {
        en: 'Manage homepage content including hero banner, featured brands, special offers, and settings.',
        ar: 'إدارة محتوى الصفحة الرئيسية بما في ذلك البانر الرئيسي، العلامات التجارية المميزة، العروض الخاصة، والإعدادات.'
      },
      requiresAuth: true,
      requiresAdmin: true,
      requiresSuperAdmin: true,
      layout: 'admin'
    }
  },

  {
    path: '/admin/homepage/preview',
    name: 'admin-homepage-preview',
    component: () => import('@/pages/Admin/HomepagePreviewPage.vue'),
    meta: {
      title: {
        en: 'Homepage Preview | Admin Dashboard',
        ar: 'معاينة الصفحة الرئيسية | لوحة تحكم المسؤول'
      },
      requiresAuth: true,
      requiresAdmin: true,
      requiresSuperAdmin: true,
      layout: 'admin-preview'
    }
  },

  // ========== ADMIN USERS MANAGEMENT ROUTES (SUPER ADMIN ONLY) ==========
  {
    path: '/admin/admins',
    name: 'admin-admins',
    component: () => import('@/pages/Admin/AdminsPage.vue'),
    meta: {
      title: {
        en: 'Manage Admins | Admin Dashboard',
        ar: 'إدارة المسؤولين | لوحة تحكم المسؤول'
      },
      requiresAuth: true,
      requiresAdmin: true,
      requiresSuperAdmin: true,
      layout: 'admin'
    }
  },

  // ========== SUPER ADMIN ROUTES ==========
  {
    path: '/admin/superadmin',
    name: 'admin-superadmin',
    component: () => import('@/pages/Admin/SuperAdminPage.vue'),
    meta: {
      title: {
        en: 'Super Admin Panel | Admin Dashboard',
        ar: 'لوحة المشرف العام | لوحة تحكم المسؤول'
      },
      requiresAuth: true,
      requiresAdmin: true,
      requiresSuperAdmin: true,
      layout: 'admin'
    }
  },

  // ========== 404 CATCH-ALL ROUTE ==========
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: {
      title: {
        en: 'Page Not Found | Luxury Perfume Store',
        ar: 'الصفحة غير موجودة | متجر العطور الفاخرة'
      },
      layout: 'default'
    }
  }
]

// Helper function to get localized title
export const getLocalizedTitle = (routeMeta: any, language: Language = 'en'): string => {
  const title = routeMeta?.title
  if (!title) return 'Luxury Perfume Store'
  
  if (typeof title === 'string') return title
  return title[language] || title.en || 'Luxury Perfume Store'
}