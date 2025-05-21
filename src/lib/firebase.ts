import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDU37MVas5BZCpDY0uGFX8O8Ldyogb-r4Y",
  authDomain: "basha-home-appliances.firebaseapp.com",
  projectId: "basha-home-appliances",
  storageBucket: "basha-home-appliances.appspot.com", // ✅ FIXED
  messagingSenderId: "527995067187",
  appId: "1:527995067187:web:72ece10c812393e6d63c46",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
