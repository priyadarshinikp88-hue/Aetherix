import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyADvZ7yclazfp6eqSwoDSIERyn54jBvPsw",
  authDomain: "aetherix-cloud.firebaseapp.com",
  projectId: "aetherix-cloud",
  storageBucket: "aetherix-cloud.firebasestorage.app",
  messagingSenderId: "967802988577",
  appId: "1:967802988577:web:c59328b41a2cc5569d9b60",
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

export { RecaptchaVerifier };