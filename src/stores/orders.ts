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
  DocumentData
} from 'firebase/firestore'
import { db } from '@/firebase/config'
import type { Order, OrderStatus, OrderItem, OrderCustomer } from '@/types'

interface FirestoreOrder extends Omit<Order, 'id' | 'createdAt' | 'updatedAt'> {
  createdAt: Timestamp
  updatedAt: Timestamp
}

export const useOrdersStore = defineStore('orders', () => {
  // State
  const orders = ref<Order[]>([])
  const currentOrder = ref<Order | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const lastVisible = ref<QueryDocumentSnapshot<DocumentData> | null>(null)
  const hasMore = ref(true)

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

  // Actions
  const fetchOrders = async (options?: {
    limit?: number
    status?: OrderStatus
    startAfterDoc?: QueryDocumentSnapshot<DocumentData>
  }) => {
    loading.value = true
    error.value = null
    
    try {
      const ordersCollection = collection(db, 'orders')
      let q = query(ordersCollection, orderBy('createdAt', 'desc'))
      
      // Apply filters
      if (options?.status) {
        q = query(q, where('status', '==', options.status))
      }
      
      // Apply pagination
      if (options?.limit) {
        q = query(q, limit(options.limit))
      }
      
      if (options?.startAfterDoc) {
        q = query(q, startAfter(options.startAfterDoc))
      }
      
      const querySnapshot = await getDocs(q)
      
      // Update pagination state
      lastVisible.value = querySnapshot.docs[querySnapshot.docs.length - 1] || null
      hasMore.value = querySnapshot.docs.length === (options?.limit || 10)
      
      const fetchedOrders: Order[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreOrder
        fetchedOrders.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        })
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
        currentOrder.value = {
          id: docSnapshot.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
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

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) => {
    loading.value = true
    error.value = null
    
    try {
      // Generate order number
      const ordersCount = await getDocs(collection(db, 'orders'))
      const orderNumber = `ORD${(ordersCount.size + 1001).toString().padStart(4, '0')}`
      
      const orderWithNumber = {
        ...orderData,
        orderNumber,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }
      
      const docRef = await addDoc(collection(db, 'orders'), orderWithNumber)
      
      // Create the complete order object
      const newOrder: Order = {
        id: docRef.id,
        ...orderData,
        orderNumber,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      // Add to local state
      orders.value = [newOrder, ...orders.value]
      
      return newOrder
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create order'
      console.error('Error creating order:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const updateOrderStatus = async (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    loading.value = true
    error.value = null
    
    try {
      const orderDoc = doc(db, 'orders', orderId)
      const updateData: any = {
        status,
        updatedAt: serverTimestamp()
      }
      
      if (trackingNumber && (status === 'shipped' || status === 'delivered')) {
        updateData.trackingNumber = trackingNumber
        updateData.shippedAt = status === 'shipped' ? serverTimestamp() : null
        updateData.deliveredAt = status === 'delivered' ? serverTimestamp() : null
      }
      
      await updateDoc(orderDoc, updateData)
      
      // Update local state
      const orderIndex = orders.value.findIndex(order => order.id === orderId)
      if (orderIndex !== -1) {
        orders.value[orderIndex] = {
          ...orders.value[orderIndex],
          status,
          updatedAt: new Date()
        }
        
        if (trackingNumber) {
          orders.value[orderIndex] = {
            ...orders.value[orderIndex],
            trackingNumber
          }
        }
      }
      
      // Update current order if it's the one being updated
      if (currentOrder.value?.id === orderId) {
        currentOrder.value = {
          ...currentOrder.value,
          status,
          updatedAt: new Date(),
          ...(trackingNumber && { trackingNumber })
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

  const deleteOrder = async (orderId: string) => {
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
    loading.value = true
    error.value = null
    
    try {
      const ordersCollection = collection(db, 'orders')
      let q = query(ordersCollection, orderBy('createdAt', 'desc'))
      
      // Firestore doesn't support OR queries directly, so we'll fetch and filter
      const querySnapshot = await getDocs(q)
      
      const filteredOrders: Order[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreOrder
        
        // Apply client-side filtering
        const matchesSearch = 
          data.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          data.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesStatus = !status || data.status === status
        
        if (matchesSearch && matchesStatus) {
          filteredOrders.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate()
          })
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

  const getOrdersByCustomer = async (customerEmail: string) => {
    loading.value = true
    error.value = null
    
    try {
      const ordersCollection = collection(db, 'orders')
      const q = query(
        ordersCollection, 
        where('customer.email', '==', customerEmail),
        orderBy('createdAt', 'desc')
      )
      
      const querySnapshot = await getDocs(q)
      const customerOrders: Order[] = []
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as FirestoreOrder
        customerOrders.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate()
        })
      })
      
      return customerOrders
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch customer orders'
      console.error('Error fetching customer orders:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const getMonthlyRevenue = async (year: number, month: number) => {
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

  const getOrderStats = async () => {
    try {
      const ordersCollection = collection(db, 'orders')
      const q = query(ordersCollection)
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
      
      return {
        totalOrders,
        pending,
        processing,
        shipped,
        delivered,
        cancelled,
        totalRevenue
      }
    } catch (err) {
      console.error('Error calculating order stats:', err)
      return null
    }
  }

  const clearCurrentOrder = () => {
    currentOrder.value = null
  }

  const clearOrders = () => {
    orders.value = []
    lastVisible.value = null
    hasMore.value = true
  }

  return {
    // State
    orders,
    currentOrder,
    loading,
    error,
    lastVisible,
    hasMore,
    
    // Getters
    pendingOrdersCount,
    completedOrdersCount,
    totalRevenue,
    activeOrders,
    
    // Actions
    fetchOrders,
    fetchOrderById,
    createOrder,
    updateOrderStatus,
    updateOrder,
    deleteOrder,
    searchOrders,
    getOrdersByCustomer,
    getMonthlyRevenue,
    getOrderStats,
    clearCurrentOrder,
    clearOrders
  }
})