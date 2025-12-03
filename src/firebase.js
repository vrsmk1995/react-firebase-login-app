// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQH4ufVOtZnAB3n6zYfrOcEAqL_mV9T_s",
  authDomain: "my-login-app-1ebab.firebaseapp.com",
  projectId: "my-login-app-1ebab",
  storageBucket: "my-login-app-1ebab.appspot.com",
  messagingSenderId: "227469138704",
  appId: "1:227469138704:web:3c9dfda74aa39d4c682395",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const generateRecaptcha = () => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "invisible" }
    );
  }
};

export default app;
