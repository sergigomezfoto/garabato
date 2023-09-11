// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBMNYzRExn86Xx1FZMSFNijsTVR9yXclcU",
  authDomain: "test-nextjs-25755.firebaseapp.com",
  projectId: "test-nextjs-25755",
  storageBucket: "test-nextjs-25755.appspot.com",
  messagingSenderId: "544571056098",
  appId: "1:544571056098:web:e246ab44985b9ae57163bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get the Firestore instance
export const db = getFirestore(app);