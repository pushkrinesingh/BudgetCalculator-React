import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyD4HSW5RmQLS3LYiDPsxJrnBx8p-nc5y9A",
  authDomain: "budget-tracker-9b28f.firebaseapp.com",
  projectId: "budget-tracker-9b28f",
  storageBucket: "budget-tracker-9b28f.firebasestorage.app",
  messagingSenderId: "690231429465",
  appId: "1:690231429465:web:884b5d07da6d937f72a448",
  measurementId: "G-DP0QQ2K1G1",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
