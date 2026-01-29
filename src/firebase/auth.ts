import { 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword,
  type UserCredential,
  onAuthStateChanged,
  type User
} from 'firebase/auth'
import { auth } from './config'
import { doc, getDoc, setDoc, getDocs, collection, query, where } from 'firebase/firestore'
import { db } from './config'

export interface AdminUser {
  uid: string
  email: string | null
  displayName: string
  role: 'admin' | 'super-admin'
  createdAt?: Date
  lastLogin?: Date
  isActive: boolean
}

// Default superadmin credentials (CHANGE THESE IN PRODUCTION!)
const SUPERADMIN_EMAIL = 'superadmin@luxuryperfumes.com'
const SUPERADMIN_PASSWORD = 'SuperAdmin@2024!' // Change this!

// Initialize superadmin if not exists
export const initializeSuperAdmin = async (): Promise<void> => {
  try {
    console.log('🔄 Checking for superadmin...')
    
    // Check if superadmin already exists in Firebase Auth
    const adminDoc = await getDoc(doc(db, 'admins', 'superadmin'))
    
    if (!adminDoc.exists()) {
      console.log('🆕 Creating superadmin user...')
      
      // Create superadmin user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        SUPERADMIN_EMAIL,
        SUPERADMIN_PASSWORD
      )
      
      const user = userCredential.user
      
      // Create admin document in Firestore
      const adminData: AdminUser = {
        uid: user.uid,
        email: SUPERADMIN_EMAIL,
        displayName: 'Super Admin',
        role: 'super-admin',
        createdAt: new Date(),
        isActive: true
      }
      
      await setDoc(doc(db, 'admins', user.uid), adminData)
      
      // Also create a reference in a separate collection for easy lookup
      await setDoc(doc(db, 'admin_users', 'superadmin'), {
        uid: user.uid,
        email: SUPERADMIN_EMAIL,
        role: 'super-admin',
        createdAt: new Date()
      })
      
      console.log('✅ Superadmin created successfully!')
      console.log('📧 Email:', SUPERADMIN_EMAIL)
      console.log('🔐 Password:', SUPERADMIN_PASSWORD)
      console.log('⚠️  IMPORTANT: Change the password immediately in production!')
    } else {
      console.log('✅ Superadmin already exists')
    }
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('✅ Superadmin already exists in Firebase Auth')
      
      // Check if admin document exists
      const adminQuery = query(
        collection(db, 'admins'),
        where('email', '==', SUPERADMIN_EMAIL)
      )
      
      const snapshot = await getDocs(adminQuery)
      
      if (snapshot.empty) {
        // Create admin document for existing user
        const adminData: AdminUser = {
          uid: 'superadmin', // You'll need to get the actual UID
          email: SUPERADMIN_EMAIL,
          displayName: 'Super Admin',
          role: 'super-admin',
          createdAt: new Date(),
          isActive: true
        }
        
        await setDoc(doc(db, 'admins', 'superadmin'), adminData)
        console.log('✅ Superadmin document created in Firestore')
      }
    } else {
      console.error('❌ Error initializing superadmin:', error)
    }
  }
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
    
    const adminData = adminDoc.data() as AdminUser
    
    // Update last login
    await setDoc(doc(db, 'admins', user.uid), {
      ...adminData,
      lastLogin: new Date()
    }, { merge: true })
    
    return {
      ...adminData,
      uid: user.uid,
      email: user.email
    }
  } catch (error: any) {
    console.error('Login error:', error)
    
    // Provide more specific error messages
    if (error.code === 'auth/invalid-credential') {
      throw new Error('Invalid email or password')
    } else if (error.code === 'auth/user-not-found') {
      throw new Error('No user found with this email')
    } else if (error.code === 'auth/wrong-password') {
      throw new Error('Incorrect password')
    } else if (error.code === 'auth/too-many-requests') {
      throw new Error('Too many failed attempts. Please try again later.')
    } else {
      throw new Error(error.message || 'Login failed')
    }
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
          const adminData = adminDoc.data() as AdminUser
          resolve({
            ...adminData,
            uid: user.uid,
            email: user.email
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

// Admin management functions (only for super-admin)
export const createAdminUser = async (email: string, password: string, displayName: string): Promise<AdminUser> => {
  try {
    // Check if current user is super-admin
    const currentAdmin = await getCurrentAdmin()
    if (!currentAdmin || currentAdmin.role !== 'super-admin') {
      throw new Error('Only super-admin can create new admin users')
    }
    
    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // Create admin document
    const adminData: AdminUser = {
      uid: user.uid,
      email: email,
      displayName,
      role: 'admin',
      createdAt: new Date(),
      isActive: true
    }
    
    await setDoc(doc(db, 'admins', user.uid), adminData)
    
    return adminData
  } catch (error: any) {
    console.error('Create admin error:', error)
    throw new Error(error.message || 'Failed to create admin user')
  }
}

export const getAdminUsers = async (): Promise<AdminUser[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, 'admins'))
    const admins: AdminUser[] = []
    
    querySnapshot.forEach((doc) => {
      admins.push(doc.data() as AdminUser)
    })
    
    return admins
  } catch (error: any) {
    console.error('Get admins error:', error)
    throw new Error('Failed to fetch admin users')
  }
}

export const updateAdminStatus = async (uid: string, isActive: boolean): Promise<void> => {
  try {
    const currentAdmin = await getCurrentAdmin()
    if (!currentAdmin || currentAdmin.role !== 'super-admin') {
      throw new Error('Only super-admin can update admin status')
    }
    
    await setDoc(doc(db, 'admins', uid), {
      isActive
    }, { merge: true })
  } catch (error: any) {
    console.error('Update admin error:', error)
    throw new Error('Failed to update admin status')
  }
}

export const deleteAdminUser = async (uid: string): Promise<void> => {
  try {
    const currentAdmin = await getCurrentAdmin()
    if (!currentAdmin || currentAdmin.role !== 'super-admin') {
      throw new Error('Only super-admin can delete admin users')
    }
    
    // Don't allow deleting yourself
    if (currentAdmin.uid === uid) {
      throw new Error('Cannot delete your own account')
    }
    
    await deleteDoc(doc(db, 'admins', uid))
  } catch (error: any) {
    console.error('Delete admin error:', error)
    throw new Error('Failed to delete admin user')
  }
}