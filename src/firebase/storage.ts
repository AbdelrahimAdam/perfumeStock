import { 
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  type StorageReference
} from 'firebase/storage'
import { storage } from './config'

const PRODUCTS_FOLDER = 'products'

export const uploadProductImage = async (
  file: File,
  productId: string
): Promise<string> => {
  try {
    // Validate file
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image')
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      throw new Error('Image size must be less than 5MB')
    }
    
    // Create storage reference
    const storageRef = ref(storage, `${PRODUCTS_FOLDER}/${productId}/${Date.now()}_${file.name}`)
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file, {
      contentType: file.type,
      customMetadata: {
        productId,
        uploadedAt: new Date().toISOString()
      }
    })
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return downloadURL
  } catch (error) {
    console.error('Error uploading product image:', error)
    throw error
  }
}

export const deleteProductImage = async (imageUrl: string): Promise<void> => {
  try {
    const storageRef = ref(storage, imageUrl)
    await deleteObject(storageRef)
  } catch (error) {
    console.error('Error deleting product image:', error)
    // Don't throw error - image might not exist
  }
}

export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height
      })
    }
    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

export const optimizeImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }
        
        // Calculate dimensions
        let width = img.width
        let height = img.height
        
        // Resize if too large
        const MAX_DIMENSION = 1200
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = (height * MAX_DIMENSION) / width
            width = MAX_DIMENSION
          } else {
            width = (width * MAX_DIMENSION) / height
            height = MAX_DIMENSION
          }
        }
        
        canvas.width = width
        canvas.height = height
        
        // Draw image
        ctx.drawImage(img, 0, 0, width, height)
        
        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Could not create blob'))
              return
            }
            
            const optimizedFile = new File(
              [blob],
              file.name,
              { type: 'image/jpeg', lastModified: Date.now() }
            )
            
            resolve(optimizedFile)
          },
          'image/jpeg',
          0.85 // Quality
        )
      }
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}