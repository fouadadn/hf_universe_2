// firebaseConfig.js
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyB3fcYkD2kRTWg_9QIr7p32HE-_eMhRUEQ",
    authDomain: "api-hf-stream.firebaseapp.com",
    projectId: "api-hf-stream",
    storageBucket: "api-hf-stream.firebasestorage.app",
    messagingSenderId: "123727240305",
    appId: "1:123727240305:web:71e880dc128c9c19f14fd0",
    measurementId: "G-J9NFBFLJZC"
  };

const app = initializeApp(firebaseConfig)
export const authe = getAuth(app)

