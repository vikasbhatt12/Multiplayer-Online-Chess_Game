// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCw-2Ew5ch-EXyFb2ufcpPREvheFFNTUyo",
  authDomain: "online-chess-game-8374a.firebaseapp.com",
  projectId: "online-chess-game-8374a",
  storageBucket: "online-chess-game-8374a.appspot.com",
  messagingSenderId: "877770607054",
  appId: "1:877770607054:web:e6741642fadcc2d41b439f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();

export default app;