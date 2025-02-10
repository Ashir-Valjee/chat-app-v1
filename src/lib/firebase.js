import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLSkKzQIHmKgWVvDGn9UotFPD-OjiO-DI",
  authDomain: "chat-app-d1502.firebaseapp.com",
  projectId: "chat-app-d1502",
  storageBucket: "chat-app-d1502.firebasestorage.app",
  messagingSenderId: "1085514643084",
  appId: "1:1085514643084:web:25ae61cbe91df0ac94ada9",
  measurementId: "G-4H6PNMDSZD",
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const auth = getAuth(app);

export { app, firestore, auth };
