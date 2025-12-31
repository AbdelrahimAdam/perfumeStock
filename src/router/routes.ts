import type { RouteRecordRaw } from 'vue-router'
import type { Language } from '@/types'

export const routes: Array<RouteRecordRaw> = [
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
        en: 'Discover our exclusive collection of luxury perfumes, Arabic oud, French perfumes, and niche fragrances. Free shipping on orders over $200.',
        ar: 'اكتشف مجموعتنا الحصرية من العطور الفاخرة، العود العربي، العطور الفرنسية، والعبوات النيش. شحن مجاني للطلبات فوق 200 دولار.'
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
        en: 'Discover this luxury perfume with premium ingredients and exquisite craftsmanship.',
        ar: 'اكتشف هذا العطر الفاخر مع مكونات مميزة وحرفية رائعة.'
      },
      requiresAuth: false,
      layout: 'default'
    }
  },
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
        en: 'Review your selected luxury perfumes and proceed to checkout.',
        ar: 'راجع عطورك الفاخرة المختارة وتابع إلى الدفع.'
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
  // Admin Routes
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('@/pages/Admin/LoginPage.vue'),
    meta: {
      title: {
        en: 'Admin Login | Luxury Perfume Store',
        ar: 'تسجيل دخول المسؤول | متجر العطور الفاخرة'
      },
      requiresGuest: true,
      layout: 'admin'
    }
  },
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
      layout: 'admin'
    }
  },
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
      layout: 'admin'
    }
  },
  // 404 Catch-all route
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