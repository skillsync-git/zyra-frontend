// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6rV74GArFrXjhhFOUFa8r80EBJXIFAjk",
  authDomain: "zyra-website-backend.firebaseapp.com",
  projectId: "zyra-website-backend",
  storageBucket: "zyra-website-backend.firebasestorage.app",
  messagingSenderId: "1032074952670",
  appId: "1:1032074952670:web:5c8a6956fbcf8d02c7274f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const firebaseApp =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const storage = getStorage(firebaseApp);

console.log('Firebase init....');
