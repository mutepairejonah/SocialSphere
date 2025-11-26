import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBGI8q_X4t7TljD3Gp_dR8X5pKzHE8HjKk",
  authDomain: "instaclone-connect.firebaseapp.com",
  projectId: "instaclone-connect",
  storageBucket: "instaclone-connect.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
