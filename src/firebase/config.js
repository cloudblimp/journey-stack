import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; // Import Analytics
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Read Firebase configuration from Vite environment variables (recommended).
// Create a local `.env.local` with VITE_FIREBASE_* variables, or set them in your CI.
// For a local example see ../.env.local.example
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

// Initialize Firebase
//const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

try {
  // Basic presence check for the API key. Don't treat a specific key string as a placeholder.
  // If you have a real key here this check will pass. For production, prefer using
  // environment variables (see notes below).
  if (!firebaseConfig.apiKey) {
    throw new Error(
      "Firebase config is missing. Please set your Vite env vars (see .env.local.example) or paste your config into src/firebase/config.js"
    );
  }

  // Initialize all services
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Only initialize analytics if measurementId exists
  if (firebaseConfig.measurementId) {
    analytics = getAnalytics(app);
  }

} catch (error) {
  console.error("Firebase initialization error:", error);
  // We'll let the app render an error message
  throw error; // Re-throw the error so the app can catch it
}

// Export the Firebase services
export { app, auth, db, storage, analytics };