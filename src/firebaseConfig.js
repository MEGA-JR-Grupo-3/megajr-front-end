// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC7H1ELWrRKwX72DlBiPyph55OXu63icqo",
  authDomain: "autenticacao-mega.firebaseapp.com",
  projectId: "autenticacao-mega",
  storageBucket: "autenticacao-mega.firebasestorage.app",
  messagingSenderId: "190657188583",
  appId: "1:190657188583:web:741cdbe171b8925db14842",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
