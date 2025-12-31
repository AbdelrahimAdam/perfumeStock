import { initializeApp, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

// Configuration for Firebase (using actual credentials)
const firebaseConfig = {
  apiKey: "AIzaSyDNCmiVTirkpSyG4A-xQcWt7d4ywZ9pqXA",
  authDomain: "the-scents-31e03.firebaseapp.com",
  projectId: "the-scents-31e03",
  storageBucket: "the-scents-31e03.firebasestorage.app",
  messagingSenderId: "7614426264",
  appId: "1:7614426264:web:17df458c0a8d970d3174ed"
}

// Initialize Firebase
let app: FirebaseApp
let auth: Auth
let db: Firestore
let storage: FirebaseStorage

try {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getFirestore(app)
  storage = getStorage(app)
  
  console.log('🔥 Firebase initialized successfully with project: the-scents-31e03')
} catch (error) {
  console.error('🔥 Firebase initialization error:', error)
  throw error
}

export { app, auth, db, storage }