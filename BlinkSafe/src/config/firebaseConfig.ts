import { initializeApp } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyCawQUY8qiRFlehrtBw7zVJuDRf8LQFJY8",
    authDomain: "blinksafe-1000e.firebaseapp.com",
    projectId: "blinksafe-1000e",
    storageBucket: "blinksafe-1000e.firebasestorage.app",
    messagingSenderId: "1064944906722",
    appId: "1:1064944906722:web:3405940b485905a34b89bb",
    measurementId: "G-GKPQPK93VB"  
};

const app = initializeApp(firebaseConfig);

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth, app };
export const db = getFirestore(app);