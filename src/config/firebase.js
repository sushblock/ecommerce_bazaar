// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";

//import the firestore database
import { getFirestore } from "firebase/firestore";

//for email password authentication
import { getAuth, GoogleAuthProvider } from "firebase/auth";

//for firebase storage for images and videos etc
import { getStorage } from "firebase/storage";

import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

//for email password authentication
const auth = getAuth(app);
// set session persistence

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

//for firestore database. The database rules has to be set to true for read and write
const db = getFirestore(app);

//for firebase storage
const storage = getStorage(app);

//for firebase functions
const functions = getFunctions(app, "asia-east2");

export { db, auth, googleProvider, storage, functions };
