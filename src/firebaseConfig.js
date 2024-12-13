import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyDJf9ChptxLQdglUgSGuPoMzSiKabceLw4",
    authDomain: "login-8fad0.firebaseapp.com",
    projectId: "login-8fad0",
    storageBucket: "login-8fad0.appspot.com",
    messagingSenderId: "641125780732",
    appId: "1:641125780732:web:c00dfdc5ec18e2f1ae1b79",
    measurementId: "G-NDXKG77TZF",
  };
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);