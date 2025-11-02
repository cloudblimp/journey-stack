// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQXRAd6MfKbXw5KeY_NucG2Ad47C3HnuM",
  authDomain: "digital-travel-diary.firebaseapp.com",
  projectId: "digital-travel-diary",
  storageBucket: "digital-travel-diary.firebasestorage.app",
  messagingSenderId: "343537612955",
  appId: "1:343537612955:web:4a3949d02626554d53ae3e",
  measurementId: "G-4DVMSBTYJQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);