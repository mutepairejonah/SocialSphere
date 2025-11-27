import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAYc4hqiWsrzIYvoybXUK_2HglHj_Ut1Mo",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "chatapp-d92e7.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "chatapp-d92e7",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "chatapp-d92e7.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "312092844552",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:312092844552:web:c916c4839833d6c0e867bd",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://chatapp-d92e7-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

export default app;
