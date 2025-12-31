import { 
  signInWithEmailAndPassword, 
  signOut, 
  type UserCredential,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { auth } from './config'
import { doc, getDoc } from 'firebase/firestore'
import { db } from './config'

export interface AdminUser {
  uid: string
  email: string | null
  role: 'admin'
  createdAt?: Date
}

export const loginAdmin = async (email: string, password: string): Promise<AdminUser> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Check if user is admin
    const adminDoc = await getDoc(doc(db, 'admins', user.uid))
    
    if (!adminDoc.exists()) {
      await signOut(auth)
      throw new Error('User is not authorized as admin')
    }
    
    return {
      uid: user.uid,
      email: user.email,
      role: 'admin'
    }
  } catch (error: any) {
    console.error('Login error:', error)
    throw new Error(error.message || 'Login failed')
  }
}

export const logoutAdmin = async (): Promise<void> => {
  try {
    await signOut(auth)
  } catch (error: any) {
    console.error('Logout error:', error)
    throw new Error(error.message || 'Logout failed')
  }
}

export const getCurrentAdmin = (): Promise<AdminUser | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
      if (!user) {
        resolve(null)
        return
      }
      
      try {
        const adminDoc = await getDoc(doc(db, 'admins', user.uid))
        
        if (adminDoc.exists()) {
          resolve({
            uid: user.uid,
            email: user.email,
            role: 'admin'
          })
        } else {
          resolve(null)
        }
      } catch (error) {
        console.error('Error getting admin:', error)
        resolve(null)
      } finally {
        unsubscribe()
      }
    })
  })
}

export const isAdminLoggedIn = async (): Promise<boolean> => {
  const admin = await getCurrentAdmin()
  return admin !== null
}