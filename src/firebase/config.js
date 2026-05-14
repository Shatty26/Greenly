import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB_M6aHwLhLrVXppq-Ob8IMm3m4gh1WCIM",
  authDomain: "greendly-45457.firebaseapp.com",
  projectId: "greendly-45457",
  storageBucket: "greendly-45457.firebasestorage.app",
  messagingSenderId: "296573310274",
  appId: "1:296573310274:web:f90d0c5b1396f942b024db",
  measurementId: "G-JVTCCEBZJ6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// exportar base de datos
export const db = getFirestore(app);
export const auth = getAuth(app);