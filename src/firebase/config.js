import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || ""
};

let app;
let auth;
let db;
let storage;
let analytics;

try {
  // Check for API key
  if (!firebaseConfig.apiKey) {
    throw new Error(
      "Firebase config is missing. Please set your Vite env vars (see .env.local.example)"
    );
  }

  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // Connect to local emulators when enabled in development
  // Set VITE_USE_FIREBASE_EMULATOR=true in your .env.local to enable
  if (import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
    try {
      // Connect to Firestore emulator
      connectFirestoreEmulator(db, 'localhost', 8080);
      console.log('Connected to Firebase Firestore emulator at localhost:8080');
      
      // default storage emulator host/port is localhost:9199
      connectStorageEmulator(storage, 'localhost', 9199);
      console.log('Connected to Firebase Storage emulator at localhost:9199');
    } catch (err) {
      console.warn('Failed to connect to emulators:', err);
    }
  }
  
  // Initialize analytics if measurementId exists
  if (firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

// Export initialized services
export { auth, db, storage, analytics };