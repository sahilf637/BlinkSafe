import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCawQUY8qiRFlehrtBw7zVJuDRf8LQFJY8",
    authDomain: "blinksafe-1000e.firebaseapp.com",
    projectId: "blinksafe-1000e",
    storageBucket: "blinksafe-1000e.firebasestorage.app",
    messagingSenderId: "1064944906722",
    appId: "1:1064944906722:web:3405940b485905a34b89bb",
    measurementId: "G-GKPQPK93VB"  
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);