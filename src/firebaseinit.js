// firebase.js - Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDy4ZJAmwHdhP4eMDpfDWqY5DuvP5tLlWw",
  authDomain: "busy-buy-cn.firebaseapp.com",
  projectId: "busy-buy-cn",
  storageBucket: "busy-buy-cn.firebasestorage.app",
  // storageBucket: "busy-buy-cn.appspot.com",
  messagingSenderId: "1076148898091",
  appId: "1:1076148898091:web:7b42dd55281187cdd65d6e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Initialize Cloud Firestore with offline persistence
const db = getFirestore(app);

// Set session persistence (optional)
setPersistence(auth, browserSessionPersistence)
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });
  
// Enable Firestore offline persistence
enableIndexedDbPersistence(db)
  .catch((error) => {
    if (error.code === 'failed-precondition') {
      console.warn("Offline persistence can only be enabled in one tab at a time.");
    } else if (error.code === 'unimplemented') {
      console.warn("The current browser does not support all of the features required to enable offline persistence.");
    }
  });

export { auth, db };