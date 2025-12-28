// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAU0P8b668j8QdlrwMtHuFSlB1nsDX77YI",
  authDomain: "neocart-de5d8.firebaseapp.com",
  projectId: "neocart-de5d8",
  storageBucket: "neocart-de5d8.appspot.com",
  messagingSenderId: "778513854488",
  appId: "1:778513854488:web:0c572275696aab1543936d"
};

// 🔥 ONLY ONCE
const app = initializeApp(firebaseConfig);

// exports
export const auth = getAuth(app);
export const db = getFirestore(app);
