import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAYc4hqiWsrzIYvoybXUK_2HglHj_Ut1Mo",
  authDomain: "chatapp-d92e7.firebaseapp.com",
  projectId: "chatapp-d92e7",
  storageBucket: "chatapp-d92e7.firebasestorage.app",
  messagingSenderId: "312092844552",
  appId: "1:312092844552:web:c916c4839833d6c0e867bd",
  databaseURL: "https://chatapp-d92e7-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

export default app;
