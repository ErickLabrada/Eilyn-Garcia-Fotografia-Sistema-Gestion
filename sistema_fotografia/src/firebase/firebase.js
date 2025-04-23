
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyAgW1ZFqgE4T4I0JCww9V1YCrxlVZjZsFI",
  authDomain: "vue-fotografia.firebaseapp.com",
  projectId: "vue-fotografia",
  storageBucket: "vue-fotografia.firebasestorage.app",
  messagingSenderId: "1066091660581",
  appId: "1:1066091660581:web:c1cbdfee21b8ee63f046cc",
  measurementId: "G-YYCJN7YJ0R"
};


const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getFirestore(app);
