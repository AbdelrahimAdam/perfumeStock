<template>
  <div class="min-h-screen bg-gray-50">
    <SEOHead 
      :title="t('Shopping Cart')"
      :description="t('Review your selected luxury perfumes')"
    />

    <div class="container mx-auto px-4 py-12">
      <h1 class="text-4xl font-display-en font-bold text-gray-900 mb-8">
        {{ t('Shopping Cart') }}
      </h1>

      <div v-if="cartStore.isEmpty" class="text-center py-20">
        <div class="w-32 h-32 mx-auto mb-6 text-gray-300">
          <svg class="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-4">
          {{ t('Your cart is empty') }}
        </h2>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          {{ t('Looks like you haven\'t added any perfumes to your cart yet. Start exploring our collection!') }}
        </p>
        <router-link 
          to="/category/best-sellers"
          class="inline-block px-8 py-3 bg-primary-500 text-white rounded-full 
                 font-bold hover:bg-primary-600 transition-colors"
        >
          {{ t('Shop Best Sellers') }}
        </router-link>
      </div>

      <div v-else class="grid lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-2xl shadow-luxury overflow-hidden">
            <!-- Header -->
            <div class="hidden md:grid grid-cols-12 gap-4 p-6 border-b bg-gray-50">
              <div class="col-span-6">
                <span class="text-sm font-medium text-gray-600">
                  {{ t('Product') }}
                </span>
              </div>
              <div class="col-span-2 text-center">
                <span class="text-sm font-medium text-gray-600">
                  {{ t('Price') }}
                </span>
              </div>
              <div class="col-span-2 text-center">
                <span class="text-sm font-medium text-gray-600">
                  {{ t('Quantity') }}
                </span>
              </div>
              <div class="col-span-2 text-center">
                <span class="text-sm font-medium text-gray-600">
                  {{ t('Total') }}
                </span>
              </div>
            </div>

            <!-- Cart Items -->
            <div class="divide-y divide-gray-100">
              <div 
                v-for="item in cartStore.items" 
                :key="item.id"
                class="p-6 hover:bg-gray-50 transition-colors"
              >
                <div class="flex items-start gap-6">
                  <!-- Product Image -->
                  <div class="flex-shrink-0">
                    <img
                      :src="item.imageUrl"
                      :alt="item.name[currentLanguage]"
                      class="w-24 h-24 object-cover rounded-xl"
                    />
                  </div>

                  <!-- Product Info -->
                  <div class="flex-1">
                    <div class="flex flex-col md:flex-row md:items-center gap-4">
                      <!-- Product Details -->
                      <div class="flex-1">
                        <h3 class="font-bold text-gray-900 mb-1">
                          {{ item.name[currentLanguage] }}
                        </h3>
                        <p class="text-sm text-gray-600 mb-2">{{ item.size }}</p>
                        
                        <!-- Mobile Price -->
                        <div class="md:hidden flex items-center justify-between mb-4">
                          <span class="text-lg font-bold text-primary-600">
                            ${{ (item.price * item.quantity).toFixed(2) }}
                          </span>
                          <button
                            @click="cartStore.removeFromCart(item.id)"
                            class="text-red-600 hover:text-red-800"
                          >
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                          </button>
                        </div>

                        <!-- Quantity Controls -->
                        <div class="flex items-center gap-4">
                          <div class="flex items-center gap-2">
                            <button
                              @click="updateQuantity(item.id, item.quantity - 1)"
                              :disabled="item.quantity <= 1"
                              class="w-8 h-8 rounded-full border border-gray-300 flex items-center 
                                     justify-center hover:border-primary-500 hover:text-primary-600 
                                     disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <span class="text-xl">-</span>
                            </button>
                            <span class="w-8 text-center font-bold">{{ item.quantity }}</span>
                            <button
                              @click="updateQuantity(item.id, item.quantity + 1)"
                              class="w-8 h-8 rounded-full border border-gray-300 flex items-center 
                                     justify-center hover:border-primary-500 hover:text-primary-600"
                            >
                              <span class="text-xl">+</span>
                            </button>
                          </div>
                          
                          <!-- Desktop Remove -->
                          <button
                            @click="cartStore.removeFromCart(item.id)"
                            class="hidden md:inline-flex items-center gap-1 text-red-600 
                                   hover:text-red-800 text-sm"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                            </svg>
                            {{ t('Remove') }}
                          </button>
                        </div>
                      </div>

                      <!-- Desktop Price & Total -->
                      <div class="hidden md:grid grid-cols-3 gap-4 items-center text-center">
                        <span class="text-lg font-bold text-gray-900">
                          ${{ item.price.toFixed(2) }}
                        </span>
                        <span class="text-lg font-bold text-gray-900">
                          {{ item.quantity }}
                        </span>
                        <span class="text-xl font-bold text-primary-600">
                          ${{ (item.price * item.quantity).toFixed(2) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions -->
            <div class="p-6 border-t bg-gray-50 flex flex-col sm:flex-row gap-4 justify-between">
              <router-link 
                to="/category/best-sellers"
                class="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg 
                       font-medium hover:border-primary-500 hover:text-primary-600 
                       transition-colors text-center"
              >
                {{ t('Continue Shopping') }}
              </router-link>
              <button
                @click="cartStore.clearCart"
                class="px-6 py-3 border-2 border-red-300 text-red-600 rounded-lg 
                       font-medium hover:border-red-500 hover:text-red-700 
                       transition-colors"
              >
                {{ t('Clear Cart') }}
              </button>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-2xl shadow-luxury p-6 sticky top-24">
            <h2 class="text-2xl font-display-en font-bold text-gray-900 mb-6">
              {{ t('Order Summary') }}
            </h2>

            <!-- Summary Details -->
            <div class="space-y-4 mb-6">
              <div class="flex justify-between">
                <span class="text-gray-600">{{ t('Subtotal') }}</span>
                <span class="font-bold">${{ cartStore.subtotal.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">{{ t('Shipping') }}</span>
                <span class="font-bold">
                  {{ cartStore.shipping === 0 ? t('FREE') : `$${cartStore.shipping.toFixed(2)}` }}
                </span>
              </div>
              <div v-if="cartStore.tax > 0" class="flex justify-between">
                <span class="text-gray-600">{{ t('Tax') }}</span>
                <span class="font-bold">${{ cartStore.tax.toFixed(2) }}</span>
              </div>
              <div class="pt-4 border-t">
                <div class="flex justify-between text-lg font-bold">
                  <span>{{ t('Total') }}</span>
                  <span class="text-primary-600">${{ cartStore.total.toFixed(2) }}</span>
                </div>
                <p class="text-sm text-gray-500 mt-1">
                  {{ t('Including VAT where applicable') }}
                </p>
              </div>
            </div>

            <!-- Free Shipping Progress -->
            <div v-if="cartStore.subtotal < 200" class="mb-6">
              <div class="text-sm text-gray-600 mb-2">
                {{ t('Add $') }}{{ (200 - cartStore.subtotal).toFixed(2) }} {{ t('more for free shipping!') }}
              </div>
              <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-primary-500 transition-all duration-500"
                  :style="{ width: `${(cartStore.subtotal / 200) * 100}%` }"
                />
              </div>
            </div>

            <!-- Checkout Button -->
            <button
              @click="proceedToCheckout"
              class="w-full bg-black text-white py-4 rounded-xl font-bold 
                     hover:bg-gray-900 transition-colors mb-4"
            >
              {{ t('Proceed to Checkout') }}
            </button>

            <!-- Payment Methods -->
            <div class="text-center">
              <p class="text-sm text-gray-600 mb-3">{{ t('Secure Payment') }}</p>
              <div class="flex justify-center gap-4">
                <span class="text-2xl">💳</span>
                <span class="text-2xl">🔒</span>
                <span class="text-2xl">🛡️</span>
              </div>
            </div>

            <!-- Guarantees -->
            <div class="mt-6 space-y-3">
              <div class="flex items-start gap-3" :class="{ 'flex-row-reverse': isRTL }">
                <svg class="w-5 h-5 text-primary-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-sm text-gray-600">
                  {{ t('30-day return policy') }}
                </span>
              </div>
              <div class="flex items-start gap-3" :class="{ 'flex-row-reverse': isRTL }">
                <svg class="w-5 h-5 text-primary-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-sm text-gray-600">
                  {{ t('Free shipping over $200') }}
                </span>
              </div>
              <div class="flex items-start gap-3" :class="{ 'flex-row-reverse': isRTL }">
                <svg class="w-5 h-5 text-primary-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                        d="M5 13l4 4L19 7"/>
                </svg>
                <span class="text-sm text-gray-600">
                  {{ t('Secure checkout') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLanguageStore } from '@/stores/language'
import { useCartStore } from '@/stores/cart'
import SEOHead from '@/components/UI/SEOHead.vue'

const languageStore = useLanguageStore()
const cartStore = useCartStore()

const { currentLanguage, isRTL, t } = languageStore

const updateQuantity = (id: string, quantity: number) => {
  if (quantity >= 1) {
    cartStore.updateQuantity(id, quantity)
  }
}

const proceedToCheckout = () => {
  // In a real app, this would redirect to checkout
  alert(t('Checkout functionality coming soon!'))
}
</script>