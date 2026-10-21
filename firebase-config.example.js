/**
 * PechaKucha Live Voting — Firebase Configuration
 * 
 * 1. Create a Firebase project at https://console.firebase.google.com/
 * 2. Enable Google Authentication under Build > Authentication > Sign-in method.
 * 3. Enable Cloud Firestore under Build > Firestore Database (test mode or apply firestore.rules).
 * 4. Paste your web app configuration credentials below.
 */

export const firebaseConfig = {
  apiKey: "AIzaSyYOUR_API_KEY_HERE",
  authDomain: "your-pechakucha-app.firebaseapp.com",
  projectId: "your-pechakucha-app",
  storageBucket: "your-pechakucha-app.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

/**
 * Authorized administrator email for the tournament.
 * Only this email will have permission to:
 * - Access the projector.html live controller
 * - Access admin.html
 * - Open, close, or reset voting sessions
 */
export const ADMIN_EMAIL = "admin@example.com";
