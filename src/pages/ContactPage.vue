<template>
  <div class="min-h-screen bg-white">
    <SEOHead 
      :title="t('Contact Us')"
      :description="t('Get in touch with our luxury perfume experts')"
    />

    <!-- Hero -->
    <div class="bg-gradient-to-br from-gray-900 to-black text-white py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-5xl font-display-en font-bold mb-6">
          {{ t('Contact Us') }}
        </h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">
          {{ t('We\'re here to help you find your perfect scent. Get in touch with our experts.') }}
        </p>
      </div>
    </div>

    <!-- Contact Content -->
    <div class="container mx-auto px-4 py-20">
      <div class="grid lg:grid-cols-2 gap-12">
        <!-- Contact Information -->
        <div>
          <h2 class="text-3xl font-display-en font-bold text-gray-900 mb-8">
            {{ t('Get in Touch') }}
          </h2>
          
          <!-- Contact Details -->
          <div class="space-y-8">
            <div class="flex items-start gap-4" :class="{ 'flex-row-reverse': isRTL }">
              <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M3 8l7.89-3.55a2 2 0 012.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">{{ t('Email') }}</h3>
                <p class="text-gray-600">contact@parfum.com</p>
                <p class="text-sm text-gray-500 mt-1">{{ t('We\'ll respond within 24 hours') }}</p>
              </div>
            </div>

            <div class="flex items-start gap-4" :class="{ 'flex-row-reverse': isRTL }">
              <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">{{ t('Phone') }}</h3>
                <p class="text-gray-600">+1 (555) 123-4567</p>
                <p class="text-sm text-gray-500 mt-1">{{ t('Mon - Fri, 9am - 6pm EST') }}</p>
              </div>
            </div>

            <div class="flex items-start gap-4" :class="{ 'flex-row-reverse': isRTL }">
              <div class="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="font-bold text-gray-900 mb-1">{{ t('Address') }}</h3>
                <p class="text-gray-600">
                  {{ currentLanguage === 'en' 
                     ? '123 Luxury Avenue, Fragrance District, Paris, France' 
                     : '123 شارع الأناقة، حي العطور، باريس، فرنسا' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Business Hours -->
          <div class="mt-12 p-6 bg-gray-50 rounded-2xl">
            <h3 class="font-bold text-gray-900 mb-4">{{ t('Business Hours') }}</h3>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">{{ t('Monday - Friday') }}</span>
                <span class="font-medium">9:00 AM - 6:00 PM</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ t('Saturday') }}</span>
                <span class="font-medium">10:00 AM - 4:00 PM</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ t('Sunday') }}</span>
                <span class="font-medium">{{ t('Closed') }}</span>
              </div>
            </div>
          </div>

          <!-- Social Media -->
          <div class="mt-12">
            <h3 class="font-bold text-gray-900 mb-4">{{ t('Follow Us') }}</h3>
            <div class="flex gap-4">
              <a href="#" class="w-10 h-10 rounded-full border border-gray-300 flex items-center 
                                 justify-center text-gray-600 hover:border-primary-500 
                                 hover:text-primary-600 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="w-10 h-10 rounded-full border border-gray-300 flex items-center 
                                 justify-center text-gray-600 hover:border-primary-500 
                                 hover:text-primary-600 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12c0-3.405 2.762-6.162 6.162-6.162s6.162 2.757 6.162 6.162-2.758 6.162-6.162 6.162-6.162-2.757-6.162-6.162zm6.162 4.5c-2.481 0-4.5-2.019-4.5-4.5s2.019-4.5 4.5-4.5 4.5 2.019 4.5 4.5-2.019 4.5-4.5 4.5zm4.965-8.203c0 .795-.645 1.44-1.44 1.44s-1.44-.645-1.44-1.44.645-1.44 1.44-1.44 1.44.645 1.44 1.44z"/>
                </svg>
              </a>
              <a href="#" class="w-10 h-10 rounded-full border border-gray-300 flex items-center 
                                 justify-center text-gray-600 hover:border-primary-500 
                                 hover:text-primary-600 transition-colors">
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="bg-gray-50 rounded-2xl p-8">
          <h2 class="text-3xl font-display-en font-bold text-gray-900 mb-6">
            {{ t('Send us a Message') }}
          </h2>
          
          <form @submit.prevent="submitForm" class="space-y-6">
            <div class="grid md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('First Name') }} *
                </label>
                <input
                  v-model="form.firstName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                         focus:ring-primary-500 focus:border-primary-500"
                  :placeholder="t('Enter your first name')"
                />
                <p v-if="errors.firstName" class="mt-2 text-sm text-red-600">
                  {{ errors.firstName }}
                </p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ t('Last Name') }} *
                </label>
                <input
                  v-model="form.lastName"
                  type="text"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                         focus:ring-primary-500 focus:border-primary-500"
                  :placeholder="t('Enter your last name')"
                />
                <p v-if="errors.lastName" class="mt-2 text-sm text-red-600">
                  {{ errors.lastName }}
                </p>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('Email') }} *
              </label>
              <input
                v-model="form.email"
                type="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-primary-500 focus:border-primary-500"
                :placeholder="t('Enter your email address')"
              />
              <p v-if="errors.email" class="mt-2 text-sm text-red-600">
                {{ errors.email }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('Subject') }} *
              </label>
              <select
                v-model="form.subject"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">{{ t('Select a subject') }}</option>
                <option value="general">{{ t('General Inquiry') }}</option>
                <option value="product">{{ t('Product Information') }}</option>
                <option value="order">{{ t('Order Support') }}</option>
                <option value="wholesale">{{ t('Wholesale Inquiry') }}</option>
                <option value="other">{{ t('Other') }}</option>
              </select>
              <p v-if="errors.subject" class="mt-2 text-sm text-red-600">
                {{ errors.subject }}
              </p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ t('Message') }} *
              </label>
              <textarea
                v-model="form.message"
                rows="6"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-primary-500 focus:border-primary-500"
                :placeholder="t('Enter your message here...')"
              />
              <p v-if="errors.message" class="mt-2 text-sm text-red-600">
                {{ errors.message }}
              </p>
            </div>

            <div>
              <label class="flex items-start gap-3 cursor-pointer">
                <input
                  v-model="form.newsletter"
                  type="checkbox"
                  class="w-5 h-5 text-primary-600 rounded focus:ring-primary-500 mt-0.5"
                />
                <span class="text-sm text-gray-600">
                  {{ t('Subscribe to our newsletter for exclusive offers and updates') }}
                </span>
              </label>
            </div>

            <button
              type="submit"
              :disabled="submitting"
              class="w-full bg-primary-500 text-white py-4 rounded-lg font-bold 
                     hover:bg-primary-600 transition-colors disabled:opacity-50 
                     disabled:cursor-not-allowed"
            >
              <span v-if="!submitting">{{ t('Send Message') }}</span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                {{ t('Sending...') }}
              </span>
            </button>

            <p v-if="submitSuccess" class="text-green-600 text-center">
              {{ t('Thank you! Your message has been sent. We\'ll get back to you soon.') }}
            </p>
            <p v-if="submitError" class="text-red-600 text-center">
              {{ submitError }}
            </p>
          </form>
        </div>
      </div>
    </div>

    <!-- FAQ Section -->
    <div class="bg-gray-50 py-20">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-display-en font-bold text-gray-900 text-center mb-12">
          {{ t('Frequently Asked Questions') }}
        </h2>
        
        <div class="max-w-3xl mx-auto space-y-4">
          <div 
            v-for="(faq, index) in faqs" 
            :key="index"
            class="bg-white rounded-xl shadow-luxury overflow-hidden"
          >
            <button
              @click="toggleFAQ(index)"
              class="w-full flex items-center justify-between p-6 text-left"
              :class="{ 'space-x-reverse': isRTL }"
            >
              <span class="font-bold text-gray-900">{{ faq.question[currentLanguage] }}</span>
              <svg 
                class="w-5 h-5 text-gray-500 transition-transform duration-200"
                :class="{ 'rotate-180': openFAQ === index }"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M19 9l-7 7-7-7"/>
              </svg>
            </button>
            <div 
              v-if="openFAQ === index"
              class="px-6 pb-6 text-gray-600"
            >
              {{ faq.answer[currentLanguage] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useLanguageStore } from '@/stores/language'
import SEOHead from '@/components/UI/SEOHead.vue'

const languageStore = useLanguageStore()
const { currentLanguage, isRTL, t } = languageStore

// Form state
const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  subject: '',
  message: '',
  newsletter: false
})

const errors = ref<Record<string, string>>({})
const submitting = ref(false)
const submitSuccess = ref(false)
const submitError = ref('')

// FAQ state
const openFAQ = ref<number | null>(0)

// FAQ data
const faqs = ref([
  {
    question: {
      en: 'What is your shipping policy?',
      ar: 'ما هي سياسة الشحن الخاصة بكم؟'
    },
    answer: {
      en: 'We offer free shipping on all orders over $200. Standard shipping takes 5-7 business days, while express shipping (2-3 business days) is available for an additional fee.',
      ar: 'نقدم شحن مجاني لجميع الطلبات التي تزيد عن 200 دولار. الشحن القياسي يستغرق من 5 إلى 7 أيام عمل، بينما يتوفر الشحن السريع (من 2 إلى 3 أيام عمل) مقابل رسوم إضافية.'
    }
  },
  {
    question: {
      en: 'What is your return policy?',
      ar: 'ما هي سياسة الإرجاع الخاصة بكم؟'
    },
    answer: {
      en: 'We offer a 30-day return policy for unopened and unused products. Please contact our customer service team to initiate a return.',
      ar: 'نقدم سياسة إرجاع لمدة 30 يوم للمنتجات غير المفتوحة وغير المستخدمة. يرجى الاتصال بفريق خدمة العملاء لبدء عملية الإرجاع.'
    }
  },
  {
    question: {
      en: 'Do you offer international shipping?',
      ar: 'هل تقدمون شحن دولي؟'
    },
    answer: {
      en: 'Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by destination.',
      ar: 'نعم، نقوم بالشحن إلى أكثر من 50 دولة حول العالم. تختلف تكاليف الشحن وأوقات التسليم حسب الوجهة.'
    }
  },
  {
    question: {
      en: 'How can I track my order?',
      ar: 'كيف يمكنني تتبع طلبي؟'
    },
    answer: {
      en: 'Once your order ships, you will receive a tracking number via email. You can use this number to track your order on our website or the carrier\'s website.',
      ar: 'بمجرد شحن طلبك، سوف تتلقى رقم تتبع عبر البريد الإلكتروني. يمكنك استخدام هذا الرقم لتتبع طلبك على موقعنا الإلكتروني أو موقع شركة الشحن.'
    }
  }
])

// Methods
const toggleFAQ = (index: number) => {
  openFAQ.value = openFAQ.value === index ? null : index
}

const validateForm = (): boolean => {
  errors.value = {}

  if (!form.value.firstName.trim()) {
    errors.value.firstName = t('First name is required')
  }

  if (!form.value.lastName.trim()) {
    errors.value.lastName = t('Last name is required')
  }

  if (!form.value.email.trim()) {
    errors.value.email = t('Email is required')
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = t('Please enter a valid email')
  }

  if (!form.value.subject) {
    errors.value.subject = t('Subject is required')
  }

  if (!form.value.message.trim()) {
    errors.value.message = t('Message is required')
  } else if (form.value.message.trim().length < 10) {
    errors.value.message = t('Message must be at least 10 characters')
  }

  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  if (!validateForm()) return

  submitting.value = true
  submitError.value = ''

  try {
    // In a real app, this would send the form data to a server
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
    
    submitSuccess.value = true
    
    // Reset form
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      subject: '',
      message: '',
      newsletter: false
    }
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      submitSuccess.value = false
    }, 5000)
  } catch (error) {
    submitError.value = t('Failed to send message. Please try again.')
  } finally {
    submitting.value = false
  }
}
</script>