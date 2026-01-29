<template>
  <div class="min-h-screen bg-white">
    <!-- SEO Head -->
    <SEOHead 
      title="About Us | Luxury Perfume Store"
      description="Learn about our passion for luxury perfumes and commitment to quality. Authentic products with prices in EGP."
      type="website"
    />

    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-primary-900 to-primary-800 text-white overflow-hidden">
      <div class="absolute inset-0 bg-black/30"></div>
      <div class="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div class="max-w-3xl" :class="{ 'text-right': isRTL }">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-display-en font-bold mb-6">
            {{ currentLanguage === 'en' ? 'Our Story' : 'قصتنا' }}
          </h1>
          <p class="text-lg md:text-xl text-gray-300 mb-8">
            {{ currentLanguage === 'en' 
               ? 'Crafting unforgettable olfactory experiences with authentic luxury perfumes since 2010.' 
               : 'نصنع تجارب شمية لا تنسى بعطور فاخرة أصلية منذ عام 2010.' }}
          </p>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center text-sm text-gray-600 mb-8" 
           :class="{ 'flex-row-reverse': isRTL }">
        <router-link to="/" class="hover:text-primary-600 transition-colors">
          {{ currentLanguage === 'en' ? 'Home' : 'الرئيسية' }}
        </router-link>
        <span class="mx-3">/</span>
        <span class="text-gray-900 font-medium">{{ currentLanguage === 'en' ? 'About Us' : 'من نحن' }}</span>
      </nav>

      <!-- Mission & Vision -->
      <div class="grid md:grid-cols-2 gap-12 mb-16">
        <div :class="{ 'text-right': isRTL }">
          <div class="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
            <span class="text-primary-600 text-2xl">🎯</span>
          </div>
          <h3 class="text-2xl font-display-en font-bold text-gray-900 mb-4">
            {{ currentLanguage === 'en' ? 'Our Mission' : 'مهمتنا' }}
          </h3>
          <p class="text-gray-700 leading-relaxed">
            {{ currentLanguage === 'en' 
               ? 'To provide authentic luxury perfumes that tell a story and create memorable experiences. We believe every scent should be an expression of personality and style.' 
               : 'توفير عطور فاخرة أصلية تروي قصة وتخلق تجارب لا تنسى. نؤمن بأن كل رائحة يجب أن تكون تعبيراً عن الشخصية والأسلوب.' }}
          </p>
        </div>

        <div :class="{ 'text-right': isRTL }">
          <div class="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
            <span class="text-primary-600 text-2xl">👁️</span>
          </div>
          <h3 class="text-2xl font-display-en font-bold text-gray-900 mb-4">
            {{ currentLanguage === 'en' ? 'Our Vision' : 'رؤيتنا' }}
          </h3>
          <p class="text-gray-700 leading-relaxed">
            {{ currentLanguage === 'en' 
               ? 'To become the leading destination for luxury perfumes in Egypt and the Middle East, known for authenticity, quality, and exceptional customer experience.' 
               : 'أن نكون الوجهة الرائدة للعطور الفاخرة في مصر والشرق الأوسط، معروفين بالأصالة، الجودة، وتجربة العملاء الاستثنائية.' }}
          </p>
        </div>
      </div>

      <!-- Values -->
      <div class="mb-16">
        <h2 class="text-3xl font-display-en font-bold text-gray-900 mb-8 text-center">
          {{ currentLanguage === 'en' ? 'Our Values' : 'قيمنا' }}
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
            <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-primary-600 text-3xl">✓</span>
            </div>
            <h4 class="text-xl font-display-en font-bold text-gray-900 mb-3">
              {{ currentLanguage === 'en' ? 'Authenticity' : 'الأصالة' }}
            </h4>
            <p class="text-gray-700">
              {{ currentLanguage === 'en' 
                 ? 'Every product is 100% authentic and sourced directly from authorized distributors.' 
                 : 'كل منتج أصلي 100% ومستورد مباشرة من الموزعين المعتمدين.' }}
            </p>
          </div>

          <div class="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
            <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-primary-600 text-3xl">⭐</span>
            </div>
            <h4 class="text-xl font-display-en font-bold text-gray-900 mb-3">
              {{ currentLanguage === 'en' ? 'Quality' : 'الجودة' }}
            </h4>
            <p class="text-gray-700">
              {{ currentLanguage === 'en' 
                 ? 'We only carry premium quality perfumes from the world\'s most prestigious brands.' 
                 : 'نحمل فقط عطوراً عالية الجودة من أشهر الماركات العالمية.' }}
            </p>
          </div>

          <div class="bg-gray-50 rounded-2xl p-8 text-center hover:shadow-lg transition-shadow">
            <div class="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-primary-600 text-3xl">🤝</span>
            </div>
            <h4 class="text-xl font-display-en font-bold text-gray-900 mb-3">
              {{ currentLanguage === 'en' ? 'Trust' : 'الثقة' }}
            </h4>
            <p class="text-gray-700">
              {{ currentLanguage === 'en' 
                 ? 'Building lasting relationships with our customers through transparency and reliability.' 
                 : 'بناء علاقات دائمة مع عملائنا من خلال الشفافية والموثوقية.' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Why Choose Us -->
      <div class="bg-gradient-to-r from-primary-50 to-primary-100 rounded-2xl p-8 md:p-12 mb-16">
        <h2 class="text-3xl font-display-en font-bold text-gray-900 mb-8 text-center">
          {{ currentLanguage === 'en' ? 'Why Choose Us' : 'لماذا تختارنا' }}
        </h2>
        <div class="grid md:grid-cols-2 gap-8">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-white text-xl">🚚</span>
            </div>
            <div>
              <h4 class="text-xl font-display-en font-bold text-gray-900 mb-2">
                {{ currentLanguage === 'en' ? 'Free Shipping' : 'شحن مجاني' }}
              </h4>
              <p class="text-gray-700">
                {{ currentLanguage === 'en' 
                   ? 'Free delivery on all orders above 2000 EGP across Egypt.' 
                   : 'توصيل مجاني لجميع الطلبات فوق 2000 جنيه في جميع أنحاء مصر.' }}
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-white text-xl">💯</span>
            </div>
            <div>
              <h4 class="text-xl font-display-en font-bold text-gray-900 mb-2">
                {{ currentLanguage === 'en' ? '100% Authentic' : '100% أصلية' }}
              </h4>
              <p class="text-gray-700">
                {{ currentLanguage === 'en' 
                   ? 'Guaranteed authentic products with verification certificates.' 
                   : 'منتجات أصلية مضمونة مع شهادات التحقق.' }}
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-white text-xl">🔄</span>
            </div>
            <div>
              <h4 class="text-xl font-display-en font-bold text-gray-900 mb-2">
                {{ currentLanguage === 'en' ? 'Easy Returns' : 'إرجاع سهل' }}
              </h4>
              <p class="text-gray-700">
                {{ currentLanguage === 'en' 
                   ? '30-day return policy for unused products in original packaging.' 
                   : 'سياسة إرجاع لمدة 30 يوم للمنتجات غير المستخدمة في تغليفها الأصلي.' }}
              </p>
            </div>
          </div>

          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span class="text-white text-xl">🎁</span>
            </div>
            <div>
              <h4 class="text-xl font-display-en font-bold text-gray-900 mb-2">
                {{ currentLanguage === 'en' ? 'Gift Service' : 'خدمة الهدايا' }}
              </h4>
              <p class="text-gray-700">
                {{ currentLanguage === 'en' 
                   ? 'Free gift wrapping and personalized cards with every order.' 
                   : 'تغليف هدايا مجاني وبطاقات شخصية مع كل طلب.' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact CTA -->
      <div class="text-center py-12">
        <h3 class="text-2xl font-display-en font-bold text-gray-900 mb-4">
          {{ currentLanguage === 'en' ? 'Ready to Find Your Signature Scent?' : 'مستعد لاكتشاف رائحتك المميزة؟' }}
        </h3>
        <p class="text-gray-700 mb-8 max-w-2xl mx-auto">
          {{ currentLanguage === 'en' 
             ? 'Our fragrance experts are here to help you choose the perfect perfume for any occasion.' 
             : 'خبراء العطور لدينا هنا لمساعدتك في اختيار العطر المثالي لأي مناسبة.' }}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link 
            to="/shop" 
            class="px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 
                   transition-colors duration-200 font-medium"
          >
            {{ currentLanguage === 'en' ? 'Shop Now' : 'تسوق الآن' }}
          </router-link>
          <router-link 
            to="/contact" 
            class="px-8 py-3 border-2 border-primary-500 text-primary-500 rounded-lg 
                   hover:bg-primary-50 transition-colors duration-200 font-medium"
          >
            {{ currentLanguage === 'en' ? 'Contact Us' : 'اتصل بنا' }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useLanguageStore } from '@/stores/language'
import SEOHead from '@/components/UI/SEOHead.vue'

const languageStore = useLanguageStore()

const { currentLanguage, isRTL } = languageStore
</script>

<style scoped>
/* Additional custom styles if needed */
</style>