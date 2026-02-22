// src/stores/orders.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  getDoc, 
  doc, 
  updateDoc, 
  addDoc, 
  deleteDoc,
  serverTimestamp,
  Timestamp,
  limit,
  startAfter,
  QueryDocumentSnapshot,
  DocumentData,
  writeBatch,
  runTransaction
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import { useAuthStore } from './auth'
import { useCartStore } from './cart'
import { useProductsStore } from './products'
import { authNotification } from '@/utils/notifications'
import type { Order, OrderStatus, OrderItem, ShippingAddress } from '@/types'

export interface FirestoreOrder extends Omit<Order, 'id' | 'createdAt' | 'updatedAt' | 'shippedAt' | 'deliveredAt' | 'cancelledAt'> {
  createdAt: Timestamp
  updatedAt: Timestamp
  shippedAt?: Timestamp | null
  deliveredAt?: Timestamp | null
  cancelledAt?: Timestamp | null
}

export const useOrdersStore = defineStore('orders', () => {
  // Other stores
  const authStore = useAuthStore()
  const cartStore = useCartStore()
  const productsStore = useProductsStore()

  // State
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastVisible = ref<QueryDocumentSnapshot<DocumentData> | null>(null)
  const hasMore = ref(true)
  const statsLoading = ref(false)
  const orderStats = ref<{
    totalOrders: number
    pending: number
    processing: number
    shipped: number
    delivered: number
    cancelled: number
    totalRevenue: number
    averageOrderValue: number
  } | null>(null)

  // Getters
  const pendingOrdersCount = computed(() => {
    return orders.value.filter(order => order.status === 'pending').length
  })

  const completedOrdersCount = computed(() => {
    return orders.value.filter(order => order.status === 'delivered').length
  })

  const totalRevenue = computed(() => {
    return orders.value
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.total, 0)
  })

  const activeOrders = computed(() => {
    return orders.value.filter(order => 
      ['pending', 'processing', 'shipped'].includes(order.status)
    )
  })

  const averageOrderValue = computed(() => {
    const deliveredOrders = orders.value.filter(o => o.status === 'delivered')
    if (deliveredOrders.length === 0) return 0
    const total = deliveredOrders.reduce((sum, o) => sum + o.total, 0)
    return total / deliveredOrders.length
  })

  // Helper Functions
  const generateOrderNumber = (): string => {
    const date = new Date()
    const year = date.getFullYear().toString().slice(-2)
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const timestamp = Date.now().toString().slice(-4)
    return `ORD-${year}${month}${day}-${random}-${timestamp}`
  }

  const generateGuestId = (): string => {
    return `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }

  const convertTimestampsToDates = (firestoreOrder: FirestoreOrder & { id: string }): Order => {
    return {
      ...firestoreOrder,
      createdAt: firestoreOrder.createdAt?.toDate() || new Date(),
      updatedAt: firestoreOrder.updatedAt?.toDate() || new Date(),
      shippedAt: firestoreOrder.shippedAt?.toDate() || null,
      deliveredAt: firestoreOrder.deliveredAt?.toDate() || null,
      cancelledAt: firestoreOrder.cancelledAt?.toDate() || null
    }
  }

  // Get current user ID safely (works for both admin and customer)
  const getCurrentUserId = (): string | null => {
    if (!authStore.isAuthenticated) {
      return null
    }
    
    // Check admin user first
    if (authStore.user?.id) {
      return authStore.user.id
    }
    
    // Then check customer
    if (authStore.customer?.id) {
      return authStore.customer.id
    }
    
    return null
  }

  // Get current user email safely
  const getCurrentUserEmail = (): string | null => {
    if (!authStore.isAuthenticated) {
      return null
    }
    
    // Check admin user first
    if (authStore.user?.email) {
      return authStore.user.email
    }
    
    // Then check customer
    if (authStore.customer?.email) {
      return authStore.customer.email
    }
    
    return null
  }

  // Actions
  const fetchOrders = async (options?: {
    limit?: number
    status?: OrderStatus
    startAfterDoc?: QueryDocumentSnapshot<DocumentData>
    userId?: string
    guestId?: string
    email?: string
    all?: boolean // For admin to fetch all orders
  }) => {
    if (loading.value) return []
    
    loading.value = true
    error.value = null
    
    try {
      const ordersCollection = collection(db, 'orders')
      let constraints: any[] = [orderBy('createdAt', 'desc')]
      
      // ADMIN: If all flag is true and user is admin, fetch all orders
      if (options?.all && authStore.isAdmin) {
        // Admin can see all orders - no user filter
        console.log('Admin fetching all orders')
      } 
      // CUSTOMER: If userId is provided and matches current user, filter by userId
      else if (options?.userId) {
        // Verify that the requested userId matches the current user
        const currentUserId = getCurrentUserId()
        if (options.userId !== currentUserId) {
          console.warn('User ID mismatch - returning empty array')
          loading.value = false
          return []
        }
        constraints.push(where('userId', '==', options.userId))
      }
      // CUSTOMER: If current user is a customer, filter by their ID
      else if (authStore.isCustomer) {
        const currentUserId = getCurrentUserId()
        if (currentUserId) {
          constraints.push(where('userId', '==', currentUserId))
        } else {
          console.warn('Customer has no ID - returning empty array')
          loading.value = false
          return []
        }
      }
      // GUEST: Handle guest orders
      else if (options?.guestId) {
        constraints.push(where('guestId', '==', options.guestId))
      } else if (options?.email) {
        constraints.push(where('customer.email', '==', options.email))
      } else {
        // If no filter is provided and user is not authenticated and not admin, return empty
        if (!authStore.isAdmin) {
          console.log('No valid filter for unauthenticated user')
          loading.value = false
          return []
        }
      }
      
      // Apply additional status filter if provided
      if (options?.status) {
        constraints.push(where('status', '==', options.status))
      }
      
      // Apply pagination
      if (options?.limit) {
        constraints.push(limit(options.limit))
      } else {
        constraints.push(limit(20))
      }
      
      if (options?.startAfterDoc) {
        constraints.push(startAfter(options.startAfterDoc))
      }
      
      const q = query(ordersCollection, ...constraints)
      const querySnapshot = await getDocs(q)
      
      // Update pagination state
      lastVisible.value = querySnapshot.docs[querySnapshot.docs.length - 1] || null
      hasMore.value = querySnapshot.docs.length === (options?.limit || 20)
      
      const fetchedOrders: Order[] = querySnapshot.docs.map(doc => {
        const data = doc.data() as FirestoreOrder
        return convertTimestampsToDates({ id: doc.id, ...data })
      })
      
      // If starting after a doc, append results; otherwise replace
      if (options?.startAfterDoc) {
        orders.value = [...orders.value, ...fetchedOrders]
      } else {
        orders.value = fetchedOrders
      }
      
      return fetchedOrders
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch orders'
      console.error('Error fetching orders:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchOrderById = async (orderId: string) => {
    loading.value = true
    error.value = null
    
    try {
      const orderDoc = doc(db, 'orders', orderId)
      const docSnapshot = await getDoc(orderDoc)
      
      if (docSnapshot.exists()) {
        const data = docSnapshot.data() as FirestoreOrder
        const currentUserId = getCurrentUserId()
        
        // SECURITY CHECK:
        // Admin can view any order
        if (authStore.isAdmin) {
          currentOrder.value = convertTimestampsToDates({ id: docSnapshot.id, ...data })
          return currentOrder.value
        }
        
        // Customer can only view their own orders
        if (currentUserId && data.userId && data.userId === currentUserId) {
          currentOrder.value = convertTimestampsToDates({ id: docSnapshot.id, ...data })
          return currentOrder.value
        }
        
        // GUEST CHECK: Check if this is a guest order and if the user has the guest ID in localStorage
        if (data.guestId) {
          // Get guest identifiers from localStorage
          const guestId = localStorage.getItem('guest_order_id')
          const guestEmail = localStorage.getItem('last_order_email')
          const guestOrderNumber = localStorage.getItem('last_order_number')
          
          // Case 1: Direct guest ID match
          if (guestId && data.guestId === guestId) {
            console.log('Guest order accessed via guest ID match')
            currentOrder.value = convertTimestampsToDates({ id: docSnapshot.id, ...data })
            
            // Update localStorage with any missing information
            if (!guestEmail && data.customer?.email) {
              localStorage.setItem('last_order_email', data.customer.email)
            }
            if (!guestOrderNumber && data.orderNumber) {
              localStorage.setItem('last_order_number', data.orderNumber)
            }
            
            return currentOrder.value
          }
          
          // Case 2: Email match (for security)
          if (guestEmail && data.customer?.email === guestEmail) {
            console.log('Guest order accessed via email match')
            currentOrder.value = convertTimestampsToDates({ id: docSnapshot.id, ...data })
            
            // Update localStorage with guest ID if missing
            if (!guestId && data.guestId) {
              localStorage.setItem('guest_order_id', data.guestId)
            }
            if (!guestOrderNumber && data.orderNumber) {
              localStorage.setItem('last_order_number', data.orderNumber)
            }
            
            return currentOrder.value
          }
          
          // Case 3: Order number match (from URL or localStorage)
          if (guestOrderNumber && data.orderNumber === guestOrderNumber) {
            // Also verify that the email matches for security
            if (data.customer?.email && data.customer.email === guestEmail) {
              console.log('Guest order accessed via order number + email match')
              currentOrder.value = convertTimestampsToDates({ id: docSnapshot.id, ...data })
              
              // Update localStorage with guest ID if missing
              if (!guestId && data.guestId) {
                localStorage.setItem('guest_order_id', data.guestId)
              }
              
              return currentOrder.value
            }
          }
          
          // Case 4: For immediate post-checkout access, check if this order was just created
          // This is useful when the user is redirected to the confirmation page right after checkout
          const lastCreatedOrder = sessionStorage.getItem('last_created_order')
          if (lastCreatedOrder) {
            try {
              const lastOrder = JSON.parse(lastCreatedOrder)
              if (lastOrder.id === orderId) {
                console.log('Guest order accessed via session storage (immediate post-checkout)')
                currentOrder.value = convertTimestampsToDates({ id: docSnapshot.id, ...data })
                
                // Save to localStorage for future access
                if (data.guestId) {
                  localStorage.setItem('guest_order_id', data.guestId)
                }
                if (data.customer?.email) {
                  localStorage.setItem('last_order_email', data.customer.email)
                }
                if (data.orderNumber) {
                  localStorage.setItem('last_order_number', data.orderNumber)
                }
                
                // Clear session storage after use
                sessionStorage.removeItem('last_created_order')
                return currentOrder.value
              }
            } catch (e) {
              console.error('Error parsing last created order:', e)
            }
          }
        }
        
        // If none of the above checks pass, deny access
        error.value = 'You do not have permission to view this order'
        return null
      } else {
        error.value = 'Order not found'
        return null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch order'
      console.error('Error fetching order:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const fetchOrderByNumber = async (orderNumber: string, email: string) => {
    loading.value = true
    error.value = null
    
    try {
      const ordersCollection = collection(db, 'orders')
      const q = query(
        ordersCollection,
        where('orderNumber', '==', orderNumber),
        where('customer.email', '==', email)
      )
      
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        const data = doc.data() as FirestoreOrder
        currentOrder.value = convertTimestampsToDates({ id: doc.id, ...data })
        
        // If this is a guest order, save to localStorage for future access
        if (data.guestId) {
          localStorage.setItem('guest_order_id', data.guestId)
          localStorage.setItem('last_order_email', data.customer.email)
          localStorage.setItem('last_order_number', data.orderNumber)
        }
        
        return currentOrder.value
      } else {
        error.value = 'Order not found'
        return null
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch order'
      console.error('Error fetching order:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createOrder = async (
    shippingAddress: ShippingAddress,
    paymentMethod: string = 'cash_on_delivery',
    notes?: string
  ) => {
    // No authentication required! Guests can place orders
    if (cartStore.items.length === 0) {
      authNotification.error('Your cart is empty')
      return null
    }

    loading.value = true
    error.value = null
    
    try {
      // Run in transaction to ensure data consistency
      const newOrder = await runTransaction(db, async (transaction) => {
        // Generate order number
        const orderNumber = generateOrderNumber()
        
        // Generate guest ID if user is not authenticated
        const guestId = !authStore.isAuthenticated ? generateGuestId() : null
        
        // Get current user ID and email if authenticated
        const currentUserId = getCurrentUserId()
        const currentUserEmail = getCurrentUserEmail()
        
        // Prepare order items with current product data
        const orderItems: OrderItem[] = cartStore.items.map(item => {
          const product = productsStore.products.find(p => p.id === item.id)
          return {
            id: item.id,
            productId: item.id,
            name: product?.name?.en || item.name?.en || 'Product',
            nameAr: product?.name?.ar || item.name?.ar,
            price: product?.price || item.price,
            quantity: item.quantity || 1,
            size: product?.size || item.size || '100ml',
            concentration: product?.concentration || item.concentration || 'Eau de Parfum',
            image: product?.imageUrl || item.imageUrl || '/images/default-product.jpg',
            brand: product?.brand || item.brand || ''
          }
        })

        // Calculate totals
        const subtotal = cartStore.subtotal
        const shipping = cartStore.shipping || 50 // Default shipping
        const tax = cartStore.tax || Math.round(subtotal * 0.14) // 14% VAT
        const total = subtotal + shipping + tax

        // Create order object
        const orderData: Omit<FirestoreOrder, 'id'> = {
          orderNumber,
          userId: currentUserId,
          guestId: guestId,
          userEmail: currentUserEmail || shippingAddress.email,
          customer: {
            name: shippingAddress.name,
            email: shippingAddress.email,
            phone: shippingAddress.phone,
            address: shippingAddress.address,
            city: shippingAddress.city,
            country: shippingAddress.country || 'Egypt'
          },
          items: orderItems,
          subtotal,
          shipping,
          tax,
          total,
          status: 'pending',
          paymentMethod,
          paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'paid',
          shippingAddress,
          notes: notes || '',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }

        // Save to Firestore
        const ordersCollection = collection(db, 'orders')
        const docRef = await addDoc(ordersCollection, orderData)

        // Update product stock quantities
        for (const item of orderItems) {
          const productRef = doc(db, 'products', item.productId)
          const productDoc = await getDoc(productRef)
          
          if (productDoc.exists()) {
            const currentStock = productDoc.data().stockQuantity || 0
            transaction.update(productRef, {
              stockQuantity: Math.max(0, currentStock - item.quantity),
              updatedAt: serverTimestamp()
            })
          }
        }

        return {
          id: docRef.id,
          ...orderData,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })

      // Convert to Order type
      const createdOrder: Order = {
        ...newOrder,
        createdAt: new Date(),
        updatedAt: new Date(),
        shippedAt: null,
        deliveredAt: null,
        cancelledAt: null
      }

      // Add to local state
      orders.value = [createdOrder, ...orders.value]
      currentOrder.value = createdOrder

      // Clear cart after successful order
      await cartStore.clearCart()

      // Save guest ID to localStorage for future order lookup
      if (createdOrder.guestId) {
        localStorage.setItem('guest_order_id', createdOrder.guestId)
        localStorage.setItem('last_order_email', createdOrder.customer.email)
        localStorage.setItem('last_order_number', createdOrder.orderNumber)
        
        // Also save to session storage for immediate post-checkout access
        sessionStorage.setItem('last_created_order', JSON.stringify({
          id: createdOrder.id,
          guestId: createdOrder.guestId,
          email: createdOrder.customer.email,
          orderNumber: createdOrder.orderNumber
        }))
      }

      authNotification.loggedIn(`Order #${createdOrder.orderNumber} placed successfully`)
      
      return createdOrder
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create order'
      console.error('Error creating order:', err)
      authNotification.error('Failed to place order. Please try again.')
      return null
    } finally {
      loading.value = false
    }
  }

  const getGuestOrders = async () => {
    const guestId = localStorage.getItem('guest_order_id')
    const guestEmail = localStorage.getItem('last_order_email')
    const guestOrderNumber = localStorage.getItem('last_order_number')
    
    if (!guestId && !guestEmail && !guestOrderNumber) return []
    
    loading.value = true
    
    try {
      const ordersCollection = collection(db, 'orders')
      let q
      
      // Try to get by guestId first (most specific)
      if (guestId) {
        q = query(
          ordersCollection,
          where('guestId', '==', guestId),
          orderBy('createdAt', 'desc')
        )
      } 
      // Then try by email
      else if (guestEmail) {
        q = query(
          ordersCollection,
          where('customer.email', '==', guestEmail),
          orderBy('createdAt', 'desc')
        )
      } 
      // Finally try by order number
      else if (guestOrderNumber) {
        q = query(
          ordersCollection,
          where('orderNumber', '==', guestOrderNumber),
          orderBy('createdAt', 'desc')
        )
      } else {
        return []
      }
      
      const querySnapshot = await getDocs(q)
      
      const guestOrders: Order[] = querySnapshot.docs.map(doc => {
        const data = doc.data() as FirestoreOrder
        return convertTimestampsToDates({ id: doc.id, ...data })
      })
      
      // If we found orders, update localStorage with all available info
      if (guestOrders.length > 0) {
        const latestOrder = guestOrders[0]
        if (latestOrder.guestId) {
          localStorage.setItem('guest_order_id', latestOrder.guestId)
        }
        if (latestOrder.customer?.email) {
          localStorage.setItem('last_order_email', latestOrder.customer.email)
        }
        if (latestOrder.orderNumber) {
          localStorage.setItem('last_order_number', latestOrder.orderNumber)
        }
      }
      
      return guestOrders
    } catch (err) {
      console.error('Error fetching guest orders:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const updateOrderStatus = async (
    orderId: string, 
    status: OrderStatus, 
    trackingNumber?: string
  ) => {
    // Only admins can update order status
    if (!authStore.isAdmin) {
      authNotification.error('You do not have permission to update orders')
      return false
    }

    loading.value = true
    error.value = null
    
    try {
      const orderDoc = doc(db, 'orders', orderId)
      const updateData: any = {
        status,
        updatedAt: serverTimestamp()
      }
      
      if (trackingNumber) {
        updateData.trackingNumber = trackingNumber
      }
      
      // Add timestamp based on status
      if (status === 'shipped') {
        updateData.shippedAt = serverTimestamp()
      } else if (status === 'delivered') {
        updateData.deliveredAt = serverTimestamp()
      } else if (status === 'cancelled') {
        updateData.cancelledAt = serverTimestamp()
        
        // Restore stock when order is cancelled
        const order = await fetchOrderById(orderId)
        if (order) {
          for (const item of order.items) {
            const productRef = doc(db, 'products', item.productId)
            const productDoc = await getDoc(productRef)
            if (productDoc.exists()) {
              const currentStock = productDoc.data().stockQuantity || 0
              await updateDoc(productRef, {
                stockQuantity: currentStock + item.quantity,
                updatedAt: serverTimestamp()
              })
            }
          }
        }
      }
      
      await updateDoc(orderDoc, updateData)
      
      // Update local state
      const orderIndex = orders.value.findIndex(order => order.id === orderId)
      if (orderIndex !== -1) {
        orders.value[orderIndex] = {
          ...orders.value[orderIndex],
          status,
          updatedAt: new Date(),
          ...(trackingNumber && { trackingNumber }),
          ...(status === 'shipped' && { shippedAt: new Date() }),
          ...(status === 'delivered' && { deliveredAt: new Date() }),
          ...(status === 'cancelled' && { cancelledAt: new Date() })
        }
      }
      
      // Update current order if it's the one being updated
      if (currentOrder.value?.id === orderId) {
        currentOrder.value = {
          ...currentOrder.value,
          status,
          updatedAt: new Date(),
          ...(trackingNumber && { trackingNumber }),
          ...(status === 'shipped' && { shippedAt: new Date() }),
          ...(status === 'delivered' && { deliveredAt: new Date() }),
          ...(status === 'cancelled' && { cancelledAt: new Date() })
        }
      }

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update order status'
      console.error('Error updating order status:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const updateOrder = async (orderId: string, updateData: Partial<Order>) => {
    // Only admins can update orders
    if (!authStore.isAdmin) {
      authNotification.error('You do not have permission to update orders')
      return false
    }

    loading.value = true
    error.value = null
    
    try {
      const orderDoc = doc(db, 'orders', orderId)
      await updateDoc(orderDoc, {
        ...updateData,
        updatedAt: serverTimestamp()
      })
      
      // Update local state
      const orderIndex = orders.value.findIndex(order => order.id === orderId)
      if (orderIndex !== -1) {
        orders.value[orderIndex] = {
          ...orders.value[orderIndex],
          ...updateData,
          updatedAt: new Date()
        }
      }
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update order'
      console.error('Error updating order:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const cancelOrder = async (orderId: string) => {
    const order = orders.value.find(o => o.id === orderId) || currentOrder.value
    
    if (!order) {
      authNotification.error('Order not found')
      return false
    }

    // Check if user is authorized to cancel this order
    const currentUserId = getCurrentUserId()
    if (!authStore.isAdmin && order.userId !== currentUserId) {
      authNotification.error('You do not have permission to cancel this order')
      return false
    }

    if (order.status !== 'pending' && order.status !== 'processing') {
      authNotification.warning('Only pending or processing orders can be cancelled')
      return false
    }

    return await updateOrderStatus(orderId, 'cancelled')
  }

  const deleteOrder = async (orderId: string) => {
    // Only admins can delete orders
    if (!authStore.isAdmin) {
      authNotification.error('You do not have permission to delete orders')
      return false
    }

    loading.value = true
    error.value = null
    
    try {
      await deleteDoc(doc(db, 'orders', orderId))
      
      // Remove from local state
      orders.value = orders.value.filter(order => order.id !== orderId)
      
      if (currentOrder.value?.id === orderId) {
        currentOrder.value = null
      }
      
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete order'
      console.error('Error deleting order:', err)
      return false
    } finally {
      loading.value = false
    }
  }

  const searchOrders = async (searchTerm: string, status?: OrderStatus) => {
    // Only customers can search their own orders
    if (!authStore.isCustomer) {
      return []
    }

    const currentUserId = getCurrentUserId()
    
    if (!currentUserId) {
      return []
    }

    loading.value = true
    error.value = null
    
    try {
      const ordersCollection = collection(db, 'orders')
      
      // First, get user's orders
      const baseQuery = query(
        ordersCollection,
        where('userId', '==', currentUserId),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(baseQuery)
      
      const filteredOrders: Order[] = []
      const searchLower = searchTerm.toLowerCase()
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreOrder
        const order = convertTimestampsToDates({ id: doc.id, ...data })
        
        // Apply status filter if provided
        if (status && order.status !== status) {
          return
        }
        
        // Apply search filter
        const matchesSearch = 
          order.orderNumber.toLowerCase().includes(searchLower) ||
          order.customer.name.toLowerCase().includes(searchLower) ||
          order.customer.email.toLowerCase().includes(searchLower) ||
          order.customer.phone.includes(searchTerm) ||
          order.items.some(item => 
            item.name.toLowerCase().includes(searchLower) ||
            (item.nameAr && item.nameAr.includes(searchTerm))
          )
        
        if (matchesSearch) {
          filteredOrders.push(order)
        }
      })
      
      return filteredOrders
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to search orders'
      console.error('Error searching orders:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const getOrdersByEmail = async (email: string) => {
    loading.value = true
    error.value = null
    
    try {
      const ordersCollection = collection(db, 'orders')
      const q = query(
        ordersCollection, 
        where('customer.email', '==', email),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      
      const customerOrders: Order[] = querySnapshot.docs.map(doc => {
        const data = doc.data() as FirestoreOrder
        return convertTimestampsToDates({ id: doc.id, ...data })
      })
      
      return customerOrders
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch orders by email'
      console.error('Error fetching orders by email:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const reorder = async (orderId: string) => {
    try {
      const order = orders.value.find(o => o.id === orderId) || await fetchOrderById(orderId)
      
      if (!order) {
        authNotification.error('Order not found')
        return false
      }

      // Check if user is authorized to reorder this order
      const currentUserId = getCurrentUserId()
      if (!authStore.isAdmin && order.userId !== currentUserId) {
        authNotification.error('You do not have permission to reorder this order')
        return false
      }

      // Clear current cart first
      if (cartStore.items.length > 0) {
        const confirmed = window.confirm('This will replace your current cart. Continue?')
        if (!confirmed) return false
        await cartStore.clearCart()
      }

      // Add each item to cart
      for (const item of order.items) {
        const product = productsStore.products.find(p => p.id === item.productId)
        
        if (product) {
          await cartStore.addToCart(product, item.quantity)
        } else {
          // Fallback to creating a basic product
          await cartStore.addToCart({
            id: item.productId,
            slug: '',
            name: { en: item.name, ar: item.nameAr || item.name },
            description: { en: '', ar: '' },
            brand: item.brand || '',
            brandSlug: '',
            brandId: '',
            category: '',
            price: item.price,
            originalPrice: item.price,
            size: item.size,
            concentration: item.concentration,
            imageUrl: item.image,
            images: [item.image],
            isBestSeller: false,
            isFeatured: false,
            rating: 0,
            reviewCount: 0,
            notes: { top: [], heart: [], base: [] },
            inStock: true,
            stockQuantity: 10,
            createdAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
            updatedAt: { seconds: Date.now() / 1000, nanoseconds: 0 },
            meta: { weight: '', dimensions: '', origin: '' }
          } as any, item.quantity)
        }
      }

      authNotification.loggedIn('Items added to cart successfully')
      return true
    } catch (err) {
      console.error('Error reordering:', err)
      authNotification.error('Failed to reorder items')
      return false
    }
  }

  const downloadInvoice = async (orderId: string) => {
    try {
      const order = orders.value.find(o => o.id === orderId) || await fetchOrderById(orderId)
      
      if (!order) {
        authNotification.error('Order not found')
        return
      }

      // Check if user is authorized to download this invoice
      const currentUserId = getCurrentUserId()
      if (!authStore.isAdmin && order.userId !== currentUserId) {
        authNotification.error('You do not have permission to download this invoice')
        return
      }

      // Create invoice content
      const invoiceContent = `
        =================================
        LUXURY PERFUME STORE - INVOICE
        =================================
        
        Order Number: ${order.orderNumber}
        Date: ${order.createdAt.toLocaleDateString()}
        Status: ${order.status.toUpperCase()}
        
        ---------------------------------
        CUSTOMER DETAILS
        ---------------------------------
        Name: ${order.customer.name}
        Email: ${order.customer.email}
        Phone: ${order.customer.phone}
        Address: ${order.customer.address}, ${order.customer.city}, ${order.customer.country}
        
        ---------------------------------
        ORDER ITEMS
        ---------------------------------
        ${order.items.map(item => 
          `${item.name} x${item.quantity} - ${item.price.toFixed(2)} EGP`
        ).join('\n')}
        
        ---------------------------------
        PAYMENT SUMMARY
        ---------------------------------
        Subtotal: ${order.subtotal.toFixed(2)} EGP
        Shipping: ${order.shipping.toFixed(2)} EGP
        Tax (14%): ${order.tax.toFixed(2)} EGP
        ---------------------------------
        TOTAL: ${order.total.toFixed(2)} EGP
        Payment Method: ${order.paymentMethod}
        
        =================================
        Thank you for shopping with us!
        =================================
      `

      // Create and download file
      const blob = new Blob([invoiceContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${order.orderNumber}.txt`
      link.click()
      window.URL.revokeObjectURL(url)

      authNotification.loggedIn('Invoice downloaded successfully')
    } catch (err) {
      console.error('Error downloading invoice:', err)
      authNotification.error('Failed to download invoice')
    }
  }

  const getMonthlyRevenue = async (year: number, month: number) => {
    // Only admins can view revenue stats
    if (!authStore.isAdmin) {
      return 0
    }

    try {
      const ordersCollection = collection(db, 'orders')
      const startDate = new Date(year, month - 1, 1)
      const endDate = new Date(year, month, 0, 23, 59, 59)
      
      const q = query(
        ordersCollection,
        where('status', '==', 'delivered'),
        where('createdAt', '>=', Timestamp.fromDate(startDate)),
        where('createdAt', '<=', Timestamp.fromDate(endDate))
      )
      
      const querySnapshot = await getDocs(q)
      let totalRevenue = 0
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreOrder
        totalRevenue += data.total
      })
      
      return totalRevenue
    } catch (err) {
      console.error('Error calculating monthly revenue:', err)
      return 0
    }
  }

  // FIXED: Get order stats for the current user only (customers) or all (admins)
  const getOrderStats = async () => {
    // Get current user ID (works for both admin and customer)
    const currentUserId = getCurrentUserId()
    
    // Only calculate stats if user is authenticated
    if (!authStore.isAuthenticated) {
      console.log('User not authenticated, skipping stats calculation')
      return null
    }

    statsLoading.value = true
    
    try {
      const ordersCollection = collection(db, 'orders')
      
      // Admin: query all orders
      // Customer: query only orders for the current user
      let q
      if (authStore.isAdmin) {
        q = query(ordersCollection)
      } else {
        if (!currentUserId) {
          statsLoading.value = false
          return null
        }
        q = query(
          ordersCollection, 
          where('userId', '==', currentUserId)
        )
      }
      
      const querySnapshot = await getDocs(q)
      
      let totalOrders = 0
      let pending = 0
      let processing = 0
      let shipped = 0
      let delivered = 0
      let cancelled = 0
      let totalRevenue = 0
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreOrder
        totalOrders++
        
        switch (data.status) {
          case 'pending':
            pending++
            break
          case 'processing':
            processing++
            break
          case 'shipped':
            shipped++
            break
          case 'delivered':
            delivered++
            totalRevenue += data.total
            break
          case 'cancelled':
            cancelled++
            break
        }
      })
      
      const stats = {
        totalOrders,
        pending,
        processing,
        shipped,
        delivered,
        cancelled,
        totalRevenue,
        averageOrderValue: delivered > 0 ? totalRevenue / delivered : 0
      }
      
      orderStats.value = stats
      return stats
    } catch (err) {
      console.error('Error calculating order stats:', err)
      return null
    } finally {
      statsLoading.value = false
    }
  }

  const loadMore = async () => {
    if (!hasMore.value || loading.value) return
    
    await fetchOrders({
      startAfterDoc: lastVisible.value || undefined
    })
  }

  const clearCurrentOrder = () => {
    currentOrder.value = null
  }

  const clearOrders = () => {
    orders.value = []
    lastVisible.value = null
    hasMore.value = true
    error.value = null
  }

  return {
    // State
    orders,
    currentOrder,
    loading,
    error,
    lastVisible,
    hasMore,
    statsLoading,
    orderStats,
    
    // Getters
    pendingOrdersCount,
    completedOrdersCount,
    totalRevenue,
    activeOrders,
    averageOrderValue,
    
    // Actions
    fetchOrders,
    fetchOrderById,
    fetchOrderByNumber,
    createOrder,
    getGuestOrders,
    updateOrderStatus,
    updateOrder,
    cancelOrder,
    deleteOrder,
    searchOrders,
    getOrdersByEmail,
    reorder,
    downloadInvoice,
    getMonthlyRevenue,
    getOrderStats,
    loadMore,
    clearCurrentOrder,
    clearOrders
  }
})