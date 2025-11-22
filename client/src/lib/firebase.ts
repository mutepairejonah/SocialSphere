import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAYc4hqiWsrzIYvoybXUK_2HglHj_Ut1Mo",
  authDomain: "chatapp-d92e7.firebaseapp.com",
  projectId: "chatapp-d92e7",
  storageBucket: "chatapp-d92e7.firebasestorage.app",
  messagingSenderId: "312092844552",
  appId: "1:312092844552:web:c916c4839833d6c0e867bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
