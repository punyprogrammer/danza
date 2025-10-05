// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, getDoc, setDoc, updateDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Firebase configuration object - using hardcoded values for now to ensure it works
const firebaseConfig = {
  apiKey: "AIzaSyD-FRDL9EkMAabrG-j7ldkxz5bkxzc49Ns",
  authDomain: "danza-515d1.firebaseapp.com",
  projectId: "danza-515d1",
  storageBucket: "danza-515d1.firebasestorage.app",
  messagingSenderId: "44889812497",
  appId: "1:44889812497:web:85d14fb9f2a5e0429d4bb0"
};

// Fallback to environment variables if hardcoded values are not working
const fallbackConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || firebaseConfig.apiKey,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || firebaseConfig.authDomain,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfig.projectId,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || firebaseConfig.storageBucket,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig.messagingSenderId,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || firebaseConfig.appId,
};

// Check if Firebase config is properly set
const isConfigValid = firebaseConfig.apiKey && firebaseConfig.projectId;

if (!isConfigValid) {
  console.warn('⚠️ Firebase configuration is missing required values.');
} else {
  console.log('✅ Firebase configuration is valid');
  console.log('Project ID:', firebaseConfig.projectId);
}

// Initialize Firebase
let app: any;
let db: any;
let auth: any;
let storage: any;

try {
  console.log('🔄 Initializing Firebase...');
  console.log('Config:', { 
    apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing',
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain 
  });
  
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase app initialized');
  
  db = getFirestore(app);
  console.log('✅ Firestore database initialized');
  console.log('Database object type:', typeof db);
  console.log('Database object methods:', db ? Object.getOwnPropertyNames(db).slice(0, 10) : 'undefined');
  
  // Test if db has the collection method
  if (typeof db.collection === 'function') {
    console.log('✅ Database has collection method');
  } else {
    console.log('❌ Database missing collection method');
    console.log('Available methods:', Object.getOwnPropertyNames(db));
    
    // Try to get the collection method from prototype
    const prototype = Object.getPrototypeOf(db);
    console.log('Prototype methods:', Object.getOwnPropertyNames(prototype));
    
    // Check if collection is in prototype
    if (prototype.collection) {
      console.log('✅ Collection method found in prototype');
    } else {
      console.log('❌ Collection method not found in prototype');
    }
  }
  
  auth = getAuth(app);
  console.log('✅ Firebase auth initialized');
  
  storage = getStorage(app);
  console.log('✅ Firebase storage initialized');
  console.log('Storage bucket:', firebaseConfig.storageBucket);
  
  console.log('🔥 Firebase initialized successfully');
  console.log('Project ID:', firebaseConfig.projectId);
  console.log('Database instance:', !!db);
  console.log('Storage instance:', !!storage);
} catch (error: any) {
  console.error('❌ Firebase initialization failed:', error);
  console.error('Error details:', error.message);
  console.error('Error stack:', error.stack);
  
  // Set fallback values to prevent undefined errors
  db = null;
  auth = null;
  storage = null;
  app = null;
}

// Export Firebase services
export { db, auth, storage, app as default };
