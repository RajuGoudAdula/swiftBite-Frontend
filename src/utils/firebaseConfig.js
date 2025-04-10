import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyCLkauGQWROmcxzWd-ufsEpv_0NpdCly-o",
    authDomain: "swiftbite-437f8.firebaseapp.com",
    projectId: "swiftbite-437f8",
    storageBucket: "swiftbite-437f8.firebasestorage.app",
    messagingSenderId: "52365932378",
    appId: "1:52365932378:web:f7b8342ba8adc0bb6a6563",
    measurementId: "G-BVKBW8JQZN"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, RecaptchaVerifier, signInWithPhoneNumber };
