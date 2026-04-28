import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCQURAFA8LGsyvSQ53sAzmvhsU4EB1Y1qE",
  authDomain: "traveling-e0edd.firebaseapp.com",
  projectId: "traveling-e0edd",
  storageBucket: "traveling-e0edd.firebasestorage.app",
  messagingSenderId: "726257232199",
  appId: "1:726257232199:web:927d754588c8f07f8c4462"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);