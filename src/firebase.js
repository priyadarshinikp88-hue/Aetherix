import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey:  "AIzaSyB-qJFLw957xX51T9cM1njOv-5G8dQbN_c",
  authDomain: "aetherix-cloud.firebaseapp.com",
  projectId: "aetherix-cloud",
  storageBucket: "aetherix-cloud.firebasestorage.app",
  messagingSenderId: "967802988577",
  appId: "1:967802988577:web:d50c4a27b23973e69d9b60"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();