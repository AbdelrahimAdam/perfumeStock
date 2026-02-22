<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <!-- SEO Head -->
    <SEOHead 
      :title="currentLanguage === 'en' ? 'Checkout | Secure Payment' : 'الدفع | دفع آمن'"
      :description="currentLanguage === 'en' 
        ? 'Complete your purchase securely with multiple payment options. All prices in EGP.' 
        : 'أكمل عملية الشراء بأمان مع خيارات دفع متعددة. جميع الأسعار بالجنيه المصري.'"
      type="website"
    />

    <!-- Loading State -->
    <div v-if="loading" class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4">
          <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-500"></div>
        </div>
        <p class="text-gray-600">{{ currentLanguage === 'en' ? 'Loading checkout...' : 'جاري تحميل الدفع...' }}</p>
      </div>
    </div>

    <!-- Empty Cart State -->
    <div v-else-if="isEmpty" class="min-h-screen flex items-center justify-center">
      <div class="text-center max-w-md px-4">
        <div class="w-24 h-24 mx-auto mb-6 text-gray-300">
          <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 class="text-2xl font-display-en font-bold text-gray-900 mb-3">
          {{ currentLanguage === 'en' ? 'Your cart is empty' : 'سلة التسوق فارغة' }}
        </h2>
        <p class="text-gray-600 mb-8">
          {{ currentLanguage === 'en' 
            ? 'Add some luxury perfumes to your cart before proceeding to checkout.' 
            : 'أضف بعض العطور الفاخرة إلى سلة التسوق قبل المتابعة إلى الدفع.' }}
        </p>
        <router-link 
          to="/shop" 
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg 
                 hover:bg-primary-600 transition-colors font-medium shadow-gold"
        >
          <span>{{ currentLanguage === 'en' ? 'Browse Perfumes' : 'تصفح العطور' }}</span>
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </router-link>
      </div>
    </div>

    <!-- Checkout Content -->
    <div v-else class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Breadcrumb -->
      <nav class="flex items-center text-sm text-gray-600 mb-8" 
           :class="{ 'flex-row-reverse': isRTL }">
        <router-link to="/" class="hover:text-primary-600 transition-colors">
          {{ currentLanguage === 'en' ? 'Home' : 'الرئيسية' }}
        </router-link>
        <span class="mx-3">/</span>
        <router-link to="/cart" class="hover:text-primary-600 transition-colors">
          {{ currentLanguage === 'en' ? 'Cart' : 'سلة التسوق' }}
        </router-link>
        <span class="mx-3">/</span>
        <span class="text-gray-900 font-medium">{{ currentLanguage === 'en' ? 'Checkout' : 'الدفع' }}</span>
      </nav>

      <!-- Progress Steps -->
      <div class="mb-12">
        <div class="flex items-center justify-between max-w-3xl mx-auto">
          <div class="flex flex-col items-center">
            <div class="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center mb-2">
              <span class="font-bold">1</span>
            </div>
            <span class="text-sm font-medium text-gray-900">{{ currentLanguage === 'en' ? 'Cart' : 'السلة' }}</span>
          </div>
          
          <div class="flex-1 h-1 bg-gray-200 mx-4">
            <div class="h-full bg-primary-500 rounded-full"></div>
          </div>
          
          <div class="flex flex-col items-center">
            <div class="w-10 h-10 rounded-full border-2 border-primary-500 bg-white text-primary-500 
                       flex items-center justify-center mb-2">
              <span class="font-bold">2</span>
            </div>
            <span class="text-sm font-medium text-gray-900">{{ currentLanguage === 'en' ? 'Details' : 'التفاصيل' }}</span>
          </div>
          
          <div class="flex-1 h-1 bg-gray-200 mx-4"></div>
          
          <div class="flex flex-col items-center">
            <div class="w-10 h-10 rounded-full border-2 border-gray-300 bg-white text-gray-400 
                       flex items-center justify-center mb-2">
              <span class="font-bold">3</span>
            </div>
            <span class="text-sm font-medium text-gray-400">{{ currentLanguage === 'en' ? 'Payment' : 'الدفع' }}</span>
          </div>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Left Column: Customer Information -->
        <div class="lg:col-span-2">
          <!-- Contact Information -->
          <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 class="text-2xl font-display-en font-bold text-gray-900 mb-6">
              {{ currentLanguage === 'en' ? 'Contact Information' : 'معلومات الاتصال' }}
            </h2>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ currentLanguage === 'en' ? 'Full Name' : 'الاسم الكامل' }} *
                </label>
                <input
                  type="text"
                  v-model="checkoutForm.fullName"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                         focus:ring-primary-500 focus:border-transparent transition-all"
                  :placeholder="currentLanguage === 'en' ? 'Enter your full name' : 'أدخل اسمك الكامل'"
                />
                <p v-if="errors.fullName" class="mt-2 text-sm text-red-600">{{ errors.fullName }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ currentLanguage === 'en' ? 'Email Address' : 'البريد الإلكتروني' }} *
                </label>
                <input
                  type="email"
                  v-model="checkoutForm.email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                         focus:ring-primary-500 focus:border-transparent transition-all"
                  :placeholder="currentLanguage === 'en' ? 'Enter your email' : 'أدخل بريدك الإلكتروني'"
                />
                <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ currentLanguage === 'en' ? 'Phone Number' : 'رقم الهاتف' }} *
                </label>
                <input
                  type="tel"
                  v-model="checkoutForm.phone"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                         focus:ring-primary-500 focus:border-transparent transition-all"
                  :placeholder="currentLanguage === 'en' ? 'Enter your phone number' : 'أدخل رقم هاتفك'"
                />
                <p v-if="errors.phone" class="mt-2 text-sm text-red-600">{{ errors.phone }}</p>
              </div>
            </div>
          </div>

          <!-- Shipping Address -->
          <div class="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 class="text-2xl font-display-en font-bold text-gray-900 mb-6">
              {{ currentLanguage === 'en' ? 'Shipping Address' : 'عنوان الشحن' }}
            </h2>
            
            <div class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ currentLanguage === 'en' ? 'Address' : 'العنوان' }} *
                </label>
                <input
                  type="text"
                  v-model="checkoutForm.address"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                         focus:ring-primary-500 focus:border-transparent transition-all"
                  :placeholder="currentLanguage === 'en' ? 'Street address, apartment, suite' : 'عنوان الشارع، شقة، جناح'"
                />
                <p v-if="errors.address" class="mt-2 text-sm text-red-600">{{ errors.address }}</p>
              </div>
              
              <div class="grid md:grid-cols-2 gap-6">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ currentLanguage === 'en' ? 'City' : 'المدينة' }} *
                  </label>
                  <input
                    type="text"
                    v-model="checkoutForm.city"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                           focus:ring-primary-500 focus:border-transparent transition-all"
                    :placeholder="currentLanguage === 'en' ? 'City' : 'المدينة'"
                  />
                  <p v-if="errors.city" class="mt-2 text-sm text-red-600">{{ errors.city }}</p>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ currentLanguage === 'en' ? 'Governorate' : 'المحافظة' }} *
                  </label>
                  <select
                    v-model="checkoutForm.governorate"
                    required
                    class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                           focus:ring-primary-500 focus:border-transparent transition-all bg-white"
                  >
                    <option value="">{{ currentLanguage === 'en' ? 'Select Governorate' : 'اختر المحافظة' }}</option>
                    <option value="Cairo">{{ currentLanguage === 'en' ? 'Cairo' : 'القاهرة' }}</option>
                    <option value="Giza">{{ currentLanguage === 'en' ? 'Giza' : 'الجيزة' }}</option>
                    <option value="Alexandria">{{ currentLanguage === 'en' ? 'Alexandria' : 'الإسكندرية' }}</option>
                    <option value="Qalyubia">{{ currentLanguage === 'en' ? 'Qalyubia' : 'القليوبية' }}</option>
                    <option value="Other">{{ currentLanguage === 'en' ? 'Other' : 'أخرى' }}</option>
                  </select>
                  <p v-if="errors.governorate" class="mt-2 text-sm text-red-600">{{ errors.governorate }}</p>
                </div>
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ currentLanguage === 'en' ? 'Additional Notes (Optional)' : 'ملاحظات إضافية (اختياري)' }}
                </label>
                <textarea
                  v-model="checkoutForm.notes"
                  rows="3"
                  class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 
                         focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                  :placeholder="currentLanguage === 'en' 
                    ? 'Special instructions, delivery preferences...' 
                    : 'تعليمات خاصة، تفضيلات التوصيل...'"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="bg-white rounded-2xl shadow-lg p-8">
            <h2 class="text-2xl font-display-en font-bold text-gray-900 mb-6">
              {{ currentLanguage === 'en' ? 'Payment Method' : 'طريقة الدفع' }}
            </h2>
            
            <div class="space-y-4">
              <label class="flex items-start p-4 border-2 border-gray-300 rounded-xl cursor-pointer 
                           hover:border-primary-500 transition-all group"
                     :class="{ 'border-primary-500 bg-primary-50': checkoutForm.paymentMethod === 'cash' }">
                <input
                  type="radio"
                  v-model="checkoutForm.paymentMethod"
                  value="cash_on_delivery"
                  class="h-5 w-5 text-primary-600 mt-1"
                />
                <div class="ml-4 flex-1">
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="text-lg font-medium text-gray-900 group-hover:text-primary-600">
                        {{ currentLanguage === 'en' ? 'Cash on Delivery' : 'الدفع عند الاستلام' }}
                      </span>
                      <p class="text-sm text-gray-600 mt-1">
                        {{ currentLanguage === 'en' 
                          ? 'Pay with cash when your order is delivered' 
                          : 'ادفع نقداً عند توصيل طلبك' }}
                      </p>
                    </div>
                    <span class="text-2xl">💰</span>
                  </div>
                  <div v-if="checkoutForm.paymentMethod === 'cash_on_delivery'" class="mt-4 p-4 bg-yellow-50 
                                                                          rounded-lg border border-yellow-100">
                    <p class="text-sm text-yellow-800">
                      {{ currentLanguage === 'en' 
                        ? 'Please have exact amount ready for delivery' 
                        : 'يرجى تجهيز المبلغ المحدد للتوصيل' }}
                    </p>
                  </div>
                </div>
              </label>
              
              <label class="flex items-start p-4 border-2 border-gray-300 rounded-xl cursor-pointer 
                           hover:border-primary-500 transition-all group"
                     :class="{ 'border-primary-500 bg-primary-50': checkoutForm.paymentMethod === 'bank' }">
                <input
                  type="radio"
                  v-model="checkoutForm.paymentMethod"
                  value="bank_transfer"
                  class="h-5 w-5 text-primary-600 mt-1"
                />
                <div class="ml-4 flex-1">
                  <div class="flex items-center justify-between">
                    <div>
                      <span class="text-lg font-medium text-gray-900 group-hover:text-primary-600">
                        {{ currentLanguage === 'en' ? 'Bank Transfer' : 'تحويل بنكي' }}
                      </span>
                      <p class="text-sm text-gray-600 mt-1">
                        {{ currentLanguage === 'en' 
                          ? 'Transfer payment to our bank account' 
                          : 'تحويل الدفع إلى حسابنا البنكي' }}
                      </p>
                    </div>
                    <span class="text-2xl">🏦</span>
                  </div>
                  <div v-if="checkoutForm.paymentMethod === 'bank_transfer'" class="mt-4 p-4 bg-blue-50 
                                                                          rounded-lg border border-blue-100">
                    <p class="text-sm text-blue-800 font-medium mb-2">
                      {{ currentLanguage === 'en' ? 'Bank Details:' : 'تفاصيل البنك:' }}
                    </p>
                    <div class="space-y-1 text-sm">
                      <p>{{ currentLanguage === 'en' ? 'Bank: National Bank of Egypt' : 'البنك: البنك الأهلي المصري' }}</p>
                      <p>{{ currentLanguage === 'en' ? 'Account: 123456789' : 'الحساب: 123456789' }}</p>
                      <p>{{ currentLanguage === 'en' ? 'IBAN: EG123456789012345678901' : 'الآيبان: EG123456789012345678901' }}</p>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Right Column: Order Summary Sidebar -->
        <div class="lg:col-span-1">
          <div class="sticky top-24">
            <!-- Order Summary Card -->
            <div class="bg-white rounded-2xl shadow-lg p-8 mb-6">
              <h3 class="text-2xl font-display-en font-bold text-gray-900 mb-6">
                {{ currentLanguage === 'en' ? 'Order Summary' : 'ملخص الطلب' }}
              </h3>
              
              <!-- Order Items -->
              <div class="space-y-4 mb-6 max-h-64 overflow-y-auto">
                <div
                  v-for="item in cartStore.luxuryItems"
                  :key="item.id"
                  class="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div class="relative">
                    <div class="w-16 h-16 rounded-lg overflow-hidden bg-gradient-to-br 
                                from-gray-50 to-gray-100 border border-gray-200">
                      <img
                        :src="item.imageUrl || '/images/default-product.jpg'"
                        :alt="item.name[currentLanguage]"
                        class="w-full h-full object-cover"
                        @error="handleImageError"
                      />
                    </div>
                    <div class="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 text-white 
                                rounded-full flex items-center justify-center text-xs font-bold">
                      {{ item.quantity }}
                    </div>
                  </div>
                  
                  <div class="flex-1 min-w-0">
                    <h4 class="text-sm font-medium text-gray-900 truncate">
                      {{ item.name[currentLanguage] }}
                    </h4>
                    <p class="text-xs text-gray-500">{{ item.size }} • {{ item.concentration }}</p>
                    <p class="text-xs text-gray-500">{{ item.brand }}</p>
                  </div>
                  
                  <div class="text-right">
                    <p class="text-sm font-bold text-primary-600">
                      {{ cartStore.formatPrice(item.price * item.quantity) }}
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Price Breakdown - Using cart store values -->
              <div class="space-y-3">
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ currentLanguage === 'en' ? 'Subtotal' : 'المجموع الفرعي' }}</span>
                  <span class="font-medium">{{ cartStore.formatPrice(cartStore.subtotal) }}</span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ currentLanguage === 'en' ? 'Shipping' : 'الشحن' }}</span>
                  <span class="font-medium" :class="{ 'text-green-600': cartStore.shipping === 0 }">
                    {{ cartStore.shipping === 0 
                      ? (currentLanguage === 'en' ? 'FREE' : 'مجاني') 
                      : cartStore.formatPrice(cartStore.shipping) }}
                  </span>
                </div>
                
                <div class="flex justify-between">
                  <span class="text-gray-600">{{ currentLanguage === 'en' ? 'Tax (14% VAT)' : 'الضريبة (14%)' }}</span>
                  <span class="font-medium">{{ cartStore.formatPrice(cartStore.tax) }}</span>
                </div>
                
                <!-- Savings (if any) -->
                <div v-if="savings > 0" class="flex justify-between text-green-600">
                  <span class="font-medium">{{ currentLanguage === 'en' ? 'You Save' : 'وفرت' }}</span>
                  <span class="font-bold">{{ cartStore.formatPrice(savings) }}</span>
                </div>
                
                <!-- Free Shipping Progress -->
                <div v-if="!cartStore.hasFreeShipping" class="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-600">{{ currentLanguage === 'en' ? 'Free shipping progress' : 'تقدم الشحن المجاني' }}</span>
                    <span class="font-medium text-primary-600">{{ cartStore.formatPrice(shippingProgress.remaining) }}</span>
                  </div>
                  <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      class="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-500"
                      :style="{ width: `${shippingProgress.percentage}%` }"
                    />
                  </div>
                  <p class="text-xs text-gray-500 mt-2">
                    {{ currentLanguage === 'en' 
                      ? `Add ${cartStore.formatPrice(shippingProgress.remaining)} more for free shipping` 
                      : `أضف ${cartStore.formatPrice(shippingProgress.remaining)} للحصول على شحن مجاني` }}
                  </p>
                </div>
                
                <div class="border-t border-gray-200 pt-4 mt-4">
                  <div class="flex justify-between">
                    <span class="text-lg font-bold text-gray-900">{{ currentLanguage === 'en' ? 'Total' : 'الإجمالي' }}</span>
                    <span class="text-2xl font-bold text-primary-600">{{ cartStore.formatPrice(cartStore.total) }}</span>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ currentLanguage === 'en' ? 'Including VAT' : 'شامل ضريبة القيمة المضافة' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Place Order Button -->
            <button
              @click="placeOrder"
              :disabled="!isFormValid || isProcessing"
              :class="[
                'w-full py-4 rounded-xl font-bold text-lg transition-all duration-300',
                'flex items-center justify-center gap-3',
                isFormValid && !isProcessing
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-gold hover:shadow-gold-lg hover:-translate-y-1'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              ]"
            >
              <template v-if="!isProcessing">
                <span>{{ currentLanguage === 'en' ? 'Place Order' : 'تأكيد الطلب' }}</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </template>
              <template v-else>
                <div class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{{ currentLanguage === 'en' ? 'Processing...' : 'جاري المعالجة...' }}</span>
              </template>
            </button>

            <!-- Security Badge -->
            <div class="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div class="flex items-center justify-center gap-3">
                <div class="text-2xl">🔒</div>
                <div>
                  <p class="text-sm font-medium text-gray-900">
                    {{ currentLanguage === 'en' ? 'Secure Checkout' : 'دفع آمن' }}
                  </p>
                  <p class="text-xs text-gray-600">
                    {{ currentLanguage === 'en' 
                      ? 'Your information is protected' 
                      : 'معلوماتك محمية' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Return Policy -->
            <div class="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div class="flex items-start gap-3">
                <div class="text-blue-500 mt-1">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-blue-800">
                    {{ currentLanguage === 'en' ? '14-Day Return Policy' : 'سياسة إرجاع 14 يوم' }}
                  </p>
                  <p class="text-xs text-blue-600 mt-1">
                    {{ currentLanguage === 'en' 
                      ? 'Unused items in original packaging' 
                      : 'منتجات غير مستخدمة في تغليفها الأصلي' }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguageStore } from '@/stores/language'
import { useCartStore } from '@/stores/cart'
import { useOrdersStore } from '@/stores/orders'
import { useAuthStore } from '@/stores/auth'
import SEOHead from '@/components/UI/SEOHead.vue'
import { authNotification } from '@/utils/notifications'

const router = useRouter()
const languageStore = useLanguageStore()
const cartStore = useCartStore()
const ordersStore = useOrdersStore()
const authStore = useAuthStore()

const { currentLanguage, isRTL, t } = languageStore

// State
const loading = ref(false)
const isProcessing = ref(false)

const checkoutForm = ref({
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  governorate: '',
  paymentMethod: 'cash_on_delivery',
  notes: ''
})

const errors = ref<Record<string, string>>({})

// Computed
const isEmpty = computed(() => cartStore.isEmpty)

const isFormValid = computed(() => {
  const { fullName, email, phone, address, city, governorate } = checkoutForm.value
  return (
    fullName.trim() !== '' &&
    email.trim() !== '' &&
    phone.trim() !== '' &&
    address.trim() !== '' &&
    city.trim() !== '' &&
    governorate.trim() !== ''
  )
})

// Get shipping progress from cart store
const shippingProgress = computed(() => cartStore.getFreeShippingProgress())
const savings = computed(() => cartStore.calculateSavings())

// Methods
const formatPrice = (price: number) => {
  return cartStore.formatPrice(price)
}

const handleImageError = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = '/images/default-product.jpg'
}

const validateForm = () => {
  errors.value = {}
  
  if (!checkoutForm.value.fullName.trim()) {
    errors.value.fullName = currentLanguage.value === 'en' ? 'Full name is required' : 'الاسم الكامل مطلوب'
  }
  
  if (!checkoutForm.value.email.trim()) {
    errors.value.email = currentLanguage.value === 'en' ? 'Email is required' : 'البريد الإلكتروني مطلوب'
  } else if (!/^\S+@\S+\.\S+$/.test(checkoutForm.value.email)) {
    errors.value.email = currentLanguage.value === 'en' ? 'Invalid email format' : 'صيغة البريد الإلكتروني غير صحيحة'
  }
  
  if (!checkoutForm.value.phone.trim()) {
    errors.value.phone = currentLanguage.value === 'en' ? 'Phone number is required' : 'رقم الهاتف مطلوب'
  } else if (!/^[+]?[\d\s\-()]+$/.test(checkoutForm.value.phone)) {
    errors.value.phone = currentLanguage.value === 'en' ? 'Invalid phone number' : 'رقم الهاتف غير صحيح'
  }
  
  if (!checkoutForm.value.address.trim()) {
    errors.value.address = currentLanguage.value === 'en' ? 'Address is required' : 'العنوان مطلوب'
  }
  
  if (!checkoutForm.value.city.trim()) {
    errors.value.city = currentLanguage.value === 'en' ? 'City is required' : 'المدينة مطلوبة'
  }
  
  if (!checkoutForm.value.governorate.trim()) {
    errors.value.governorate = currentLanguage.value === 'en' ? 'Governorate is required' : 'المحافظة مطلوبة'
  }
  
  return Object.keys(errors.value).length === 0
}

const placeOrder = async () => {
  if (!validateForm()) {
    authNotification.error(currentLanguage.value === 'en' 
      ? 'Please fix the errors in the form' 
      : 'يرجى تصحيح الأخطاء في النموذج')
    return
  }

  isProcessing.value = true

  try {
    // Prepare shipping address
    const shippingAddress = {
      name: checkoutForm.value.fullName,
      email: checkoutForm.value.email,
      phone: checkoutForm.value.phone,
      address: checkoutForm.value.address,
      city: checkoutForm.value.city,
      country: 'Egypt'
    }

    // Create order using orders store
    const order = await ordersStore.createOrder(
      shippingAddress,
      checkoutForm.value.paymentMethod,
      checkoutForm.value.notes
    )

    if (order) {
      // Show success notification
      authNotification.loggedIn(currentLanguage.value === 'en'
        ? `Order #${order.orderNumber} placed successfully!`
        : `تم تأكيد الطلب رقم #${order.orderNumber} بنجاح!`)
      
      // Redirect to order confirmation page
      router.push(`/order-confirmation/${order.id}`)
    } else {
      throw new Error('Failed to create order')
    }
  } catch (error: any) {
    console.error('Checkout error:', error)
    authNotification.error(currentLanguage.value === 'en'
      ? error.message || 'Failed to process your order. Please try again.'
      : 'فشل معالجة طلبك. يرجى المحاولة مرة أخرى.')
  } finally {
    isProcessing.value = false
  }
}

// On mounted
onMounted(() => {
  loading.value = true
  
  // Restore cart from localStorage
  cartStore.restoreCart()
  
  setTimeout(() => {
    // If cart is empty, redirect to cart page
    if (cartStore.items.length === 0) {
      router.push('/cart')
    }
    loading.value = false
  }, 500)
})
</script>

<style scoped>
/* Custom scrollbar for order items */
.max-h-64::-webkit-scrollbar {
  width: 6px;
}

.max-h-64::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.max-h-64::-webkit-scrollbar-thumb {
  background: #d4af37;
  border-radius: 3px;
}

.max-h-64::-webkit-scrollbar-thumb:hover {
  background: #b8941f;
}

/* Animations */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Responsive */
@media (max-width: 768px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Print styles */
@media print {
  .no-print {
    display: none !important;
  }
  
  .container {
    max-width: 100% !important;
  }
  
  button {
    display: none !important;
  }
}
</style>