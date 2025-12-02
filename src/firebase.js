// Firebase core imports
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCQH4ufVOtZnAB3n6zYfrOcEAqL_mV9T_s",
  authDomain: "my-login-app-1ebab.firebaseapp.com",
  projectId: "my-login-app-1ebab",
  storageBucket: "my-login-app-1ebab.appspot.com",
  messagingSenderId: "227469138704",
  appId: "1:227469138704:web:3c9dfda74aa39d4c682395",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);
export default app;