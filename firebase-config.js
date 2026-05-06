import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Replace these placeholder values with your Firebase project config.
const firebaseConfig = {
    apiKey: "ADD_YOUR_API_KEY_HERE",
    authDomain: "ADD_YOUR_AUTH_DOMAIN_HERE",
    projectId: "ADD_YOUR_PROJECT_ID_HERE",
    storageBucket: "ADD_YOUR_STORAGE_BUCKET_HERE",
    messagingSenderId: "ADD_YOUR_MESSAGING_SENDER_ID_HERE",
    appId: "ADD_YOUR_APP_ID_HERE"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
