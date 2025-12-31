import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CartItem, Product } from '@/types'
import { useLocalStorage } from '@vueuse/core'
import { showNotification } from '@/utils/notifications'

export const useCartStore = defineStore('cart', () => {
  // Luxury Cart State
  const items = useLocalStorage<CartItem[]>('luxury_perfume_cart', [])
  const isOpen = ref(false)
  const isLoading = ref(false)
  const lastAddedItem = ref<string | null>(null)

  // Luxury Getters
  const totalItems = computed(() => 
    items.value.reduce((sum, item) => sum + item.quantity, 0)
  )

  const subtotal = computed(() => 
    items.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  )

  const shipping = computed(() => 
    subtotal.value > 200 ? 0 : 15
  )

  const tax = computed(() => 
    subtotal.value * 0.08 // 8% tax for luxury goods
  )

  const total = computed(() => 
    subtotal.value + shipping.value + tax.value
  )

  const isEmpty = computed(() => 
    items.value.length === 0
  )

  const itemCount = computed(() => 
    items.value.reduce((count, item) => count + item.quantity, 0)
  )

  const luxuryItems = computed(() => 
    items.value.map(item => ({
      ...item,
      totalPrice: item.price * item.quantity
    }))
  )

  // Luxury Actions
  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = items.value.find(item => item.id === product.id)

    if (existingItem) {
      existingItem.quantity += quantity
      showNotification({
        title: 'Cart Updated',
        message: `Increased quantity of ${product.name.en} to ${existingItem.quantity}`,
        type: 'success'
      })
    } else {
      const newItem: CartItem = {
        id: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        size: product.size,
        concentration: product.concentration,
        brand: product.brand,
        quantity,
        addedAt: new Date().toISOString()
      }
      items.value.push(newItem)
      showNotification({
        title: 'Added to Cart',
        message: `${product.name.en} added to your luxury collection`,
        type: 'success'
      })
    }

    lastAddedItem.value = product.id
    openCart()
    
    // Trigger luxury animation
    triggerLuxuryEffect()
  }

  const removeFromCart = (id: string) => {
    const index = items.value.findIndex(item => item.id === id)
    if (index !== -1) {
      const item = items.value[index]
      items.value.splice(index, 1)
      showNotification({
        title: 'Removed from Cart',
        message: `${item.name.en} removed from your collection`,
        type: 'info'
      })
    }
  }

  const updateQuantity = (id: string, quantity: number) => {
    const item = items.value.find(item => item.id === id)
    if (item) {
      const oldQuantity = item.quantity
      item.quantity = Math.max(1, Math.min(quantity, 10)) // Limit to 10 per item
      
      if (oldQuantity !== item.quantity) {
        showNotification({
          title: 'Quantity Updated',
          message: `Changed quantity from ${oldQuantity} to ${item.quantity}`,
          type: 'info'
        })
      }
    }
  }

  const clearCart = async () => {
    const confirmed = await showConfirmation({
      title: 'Clear Cart',
      message: 'Are you sure you want to clear your entire cart?',
      confirmText: 'Clear All',
      cancelText: 'Keep Items',
      type: 'warning'
    })
    
    if (confirmed) {
      items.value = []
      showNotification({
        title: 'Cart Cleared',
        message: 'Your luxury cart has been cleared',
        type: 'success'
      })
    }
  }

  const openCart = () => {
    isOpen.value = true
    // Add body class to prevent scrolling
    document.body.classList.add('cart-open')
  }

  const closeCart = () => {
    isOpen.value = false
    // Remove body class
    document.body.classList.remove('cart-open')
  }

  const toggleCart = () => {
    if (isOpen.value) {
      closeCart()
    } else {
      openCart()
    }
  }

  // Luxury Helper Functions
  const triggerLuxuryEffect = () => {
    // Add a luxury animation effect
    const event = new CustomEvent('luxury-effect', {
      detail: { type: 'cart-add', itemId: lastAddedItem.value }
    })
    window.dispatchEvent(event)
  }

  const getItem = (id: string) => {
    return items.value.find(item => item.id === id)
  }

  const hasItem = (id: string) => {
    return items.value.some(item => item.id === id)
  }

  const getCartSummary = () => {
    return {
      totalItems: totalItems.value,
      subtotal: subtotal.value,
      shipping: shipping.value,
      tax: tax.value,
      total: total.value,
      items: luxuryItems.value
    }
  }

  const calculateSavings = () => {
    // Calculate any discounts or savings
    const discount = items.value.reduce((sum, item) => {
      return item.originalPrice ? sum + ((item.originalPrice - item.price) * item.quantity) : sum
    }, 0)
    
    return discount
  }

  // Initialize
  const initialize = () => {
    // Restore cart state
    const saved = localStorage.getItem('luxury_perfume_cart')
    if (saved) {
      try {
        items.value = JSON.parse(saved)
      } catch {
        items.value = []
      }
    }
  }

  return {
    // State
    items,
    isOpen,
    isLoading,
    lastAddedItem,

    // Getters
    totalItems,
    subtotal,
    shipping,
    tax,
    total,
    isEmpty,
    itemCount,
    luxuryItems,

    // Actions
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    getItem,
    hasItem,
    getCartSummary,
    calculateSavings,
    initialize
  }
})