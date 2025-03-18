// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDB2kxsr7YN8SgjKH8WhpAItbbn16dvDxg",
  authDomain: "compuscan-c6aa9.firebaseapp.com",
  projectId: "compuscan-c6aa9",
  storageBucket: "compuscan-c6aa9.appspot.com",
  messagingSenderId: "685925468117",
  appId: "1:685925468117:web:b730486a344c8964941f5c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };