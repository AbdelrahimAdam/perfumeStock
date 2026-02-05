import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  Timestamp,
  serverTimestamp 
} from 'firebase/firestore'
import { 
  createUserWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail,
  deleteUser as deleteAuthUser 
} from 'firebase/auth'
import { db, auth } from '@/firebase/config'
import type { AdminUser, CreateAdminDto, UpdateAdminDto } from '@/types/admin'

const ADMIN_COLLECTION = 'admins'
const USERS_COLLECTION = 'users'

export class AdminService {
  // Get all admins
  static async getAdmins(): Promise<AdminUser[]> {
    try {
      const adminsRef = collection(db, ADMIN_COLLECTION)
      const q = query(adminsRef, orderBy('createdAt', 'desc'))
      const snapshot = await getDocs(q)
      
      return snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data()
      })) as AdminUser[]
    } catch (error) {
      console.error('Error fetching admins:', error)
      throw new Error('Failed to fetch admins')
    }
  }

  // Get admin by ID
  static async getAdminById(uid: string): Promise<AdminUser | null> {
    try {
      const adminRef = doc(db, ADMIN_COLLECTION, uid)
      const snapshot = await getDoc(adminRef)
      
      if (snapshot.exists()) {
        return { uid: snapshot.id, ...snapshot.data() } as AdminUser
      }
      return null
    } catch (error) {
      console.error('Error fetching admin:', error)
      throw new Error('Failed to fetch admin')
    }
  }

  // Create new admin
  static async createAdmin(adminData: CreateAdminDto): Promise<AdminUser> {
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        adminData.email,
        adminData.password
      )

      const user = userCredential.user

      // 2. Update user profile
      if (adminData.displayName) {
        await updateProfile(user, {
          displayName: adminData.displayName
        })
      }

      // 3. Create admin document in Firestore
      const adminRef = doc(db, ADMIN_COLLECTION, user.uid)
      const adminDoc: Omit<AdminUser, 'uid'> = {
        email: adminData.email,
        displayName: adminData.displayName || '',
        role: adminData.role || 'admin',
        isActive: adminData.isActive ?? true,
        createdAt: serverTimestamp() as any,
        lastLoginAt: serverTimestamp() as any,
        phoneNumber: adminData.phoneNumber || ''
      }

      await setDoc(adminRef, adminDoc)

      // 4. Also add to users collection for consistency
      const userRef = doc(db, USERS_COLLECTION, user.uid)
      await setDoc(userRef, {
        email: adminData.email,
        displayName: adminData.displayName || '',
        role: adminData.role || 'admin',
        isActive: adminData.isActive ?? true,
        createdAt: serverTimestamp() as any,
        isAdmin: true
      }, { merge: true })

      return {
        uid: user.uid,
        ...adminDoc,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString()
      }
    } catch (error: any) {
      console.error('Error creating admin:', error)
      
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email already in use')
      } else if (error.code === 'auth/invalid-email') {
        throw new Error('Invalid email address')
      } else if (error.code === 'auth/weak-password') {
        throw new Error('Password is too weak')
      }
      
      throw new Error('Failed to create admin')
    }
  }

  // Update admin
  static async updateAdmin(uid: string, updateData: UpdateAdminDto): Promise<void> {
    try {
      const adminRef = doc(db, ADMIN_COLLECTION, uid)
      const userRef = doc(db, USERS_COLLECTION, uid)

      const updatePayload: any = {}
      
      if (updateData.displayName !== undefined) {
        updatePayload.displayName = updateData.displayName
      }
      if (updateData.role !== undefined) {
        updatePayload.role = updateData.role
      }
      if (updateData.isActive !== undefined) {
        updatePayload.isActive = updateData.isActive
      }
      if (updateData.phoneNumber !== undefined) {
        updatePayload.phoneNumber = updateData.phoneNumber
      }
      if (updateData.permissions !== undefined) {
        updatePayload.permissions = updateData.permissions
      }

      // Update in admins collection
      await updateDoc(adminRef, updatePayload)
      
      // Also update in users collection
      await updateDoc(userRef, {
        displayName: updateData.displayName,
        role: updateData.role,
        isActive: updateData.isActive,
        updatedAt: serverTimestamp()
      })

      // Update displayName in Auth if provided
      if (updateData.displayName && auth.currentUser?.uid === uid) {
        await updateProfile(auth.currentUser, {
          displayName: updateData.displayName
        })
      }

    } catch (error) {
      console.error('Error updating admin:', error)
      throw new Error('Failed to update admin')
    }
  }

  // Delete admin
  static async deleteAdmin(uid: string): Promise<void> {
    try {
      // Don't allow deletion of current user
      if (auth.currentUser?.uid === uid) {
        throw new Error('Cannot delete your own account')
      }

      // 1. Delete admin document
      const adminRef = doc(db, ADMIN_COLLECTION, uid)
      await deleteDoc(adminRef)

      // 2. Update user document (don't delete, just mark as not admin)
      const userRef = doc(db, USERS_COLLECTION, uid)
      await updateDoc(userRef, {
        isAdmin: false,
        role: 'user',
        updatedAt: serverTimestamp()
      })

      console.log(`Admin ${uid} deleted successfully`)
    } catch (error: any) {
      console.error('Error deleting admin:', error)
      throw new Error(error.message || 'Failed to delete admin')
    }
  }

  // Reset admin password
  static async resetAdminPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      console.error('Error resetting password:', error)
      
      if (error.code === 'auth/user-not-found') {
        throw new Error('User not found')
      }
      
      throw new Error('Failed to reset password')
    }
  }

  // Get admin stats
  static async getAdminStats(): Promise<{
    total: number
    superAdmins: number
    activeAdmins: number
    inactiveAdmins: number
  }> {
    try {
      const admins = await this.getAdmins()
      
      return {
        total: admins.length,
        superAdmins: admins.filter(admin => admin.role === 'super-admin').length,
        activeAdmins: admins.filter(admin => admin.isActive).length,
        inactiveAdmins: admins.filter(admin => !admin.isActive).length
      }
    } catch (error) {
      console.error('Error getting admin stats:', error)
      throw new Error('Failed to get admin stats')
    }
  }

  // Search admins
  static async searchAdmins(searchTerm: string): Promise<AdminUser[]> {
    try {
      const admins = await this.getAdmins()
      
      return admins.filter(admin => 
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.phoneNumber?.includes(searchTerm)
      )
    } catch (error) {
      console.error('Error searching admins:', error)
      throw new Error('Failed to search admins')
    }
  }

  // Update last login timestamp
  static async updateLastLogin(uid: string): Promise<void> {
    try {
      const adminRef = doc(db, ADMIN_COLLECTION, uid)
      await updateDoc(adminRef, {
        lastLoginAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating last login:', error)
    }
  }
}