// Import the functions you need from the SDKs you need
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getAuth, type Auth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyD8ZBfLzHE2XVnwd6HUj1N9AjY8CKXAog8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "staituned-production-163f4.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "staituned-production-163f4",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "staituned-production-163f4.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1070464718249",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:1070464718249:web:f7c6e040a3f029c1d2a0b8",
  measurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-LBSYL8WF8M"
};

// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Initialize Auth
const auth: Auth = getAuth(app);

// Initialize Analytics (only in browser environment)
let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Create Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Optional: Add additional scopes if needed
// googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');

// Optional: Set custom parameters
// googleProvider.setCustomParameters({
//   'login_hint': 'user@example.com'
// });

export { app, auth, analytics, googleProvider };
