import { 
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  type DocumentData,
  type QueryConstraint,
  type QuerySnapshot
} from 'firebase/firestore'
import { db } from './config'
import type { Product, ProductFormData } from '@/types'

// Products Collection
const PRODUCTS_COLLECTION = 'products'
const ADMINS_COLLECTION = 'admins'

// Product Operations
export const getProducts = async (constraints: QueryConstraint[] = []): Promise<Product[]> => {
  try {
    const productsQuery = query(
      collection(db, PRODUCTS_COLLECTION),
      ...constraints
    )
    
    const snapshot: QuerySnapshot<DocumentData> = await getDocs(productsQuery)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[]
  } catch (error) {
    console.error('Error getting products:', error)
    throw error
  }
}

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as Product
    }
    
    return null
  } catch (error) {
    console.error('Error getting product:', error)
    throw error
  }
}

export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('slug', '==', slug)
    )
    
    const snapshot = await getDocs(q)
    
    if (snapshot.empty) return null
    
    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    } as Product
  } catch (error) {
    console.error('Error getting product by slug:', error)
    throw error
  }
}

export const createProduct = async (productData: ProductFormData): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COLLECTION), {
      ...productData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    })
    
    return docRef.id
  } catch (error) {
    console.error('Error creating product:', error)
    throw error
  }
}

export const updateProduct = async (id: string, productData: Partial<ProductFormData>): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id)
    
    await updateDoc(docRef, {
      ...productData,
      updatedAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error updating product:', error)
    throw error
  }
}

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error('Error deleting product:', error)
    throw error
  }
}

// Categories
export const getCategories = async (): Promise<string[]> => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('category', '!=', '')
    )
    
    const snapshot = await getDocs(q)
    const categories = new Set<string>()
    
    snapshot.docs.forEach(doc => {
      const data = doc.data()
      if (data.category) {
        categories.add(data.category)
      }
    })
    
    return Array.from(categories)
  } catch (error) {
    console.error('Error getting categories:', error)
    return []
  }
}

// Featured Products
export const getFeaturedProducts = async (count: number = 8): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      where('isBestSeller', '==', true),
      orderBy('createdAt', 'desc'),
      limit(count)
    )
    
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[]
  } catch (error) {
    console.error('Error getting featured products:', error)
    throw error
  }
}

export const getNewArrivals = async (count: number = 8): Promise<Product[]> => {
  try {
    const q = query(
      collection(db, PRODUCTS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(count)
    )
    
    const snapshot = await getDocs(q)
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[]
  } catch (error) {
    console.error('Error getting new arrivals:', error)
    throw error
  }
}