// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBwkSxUNYzlincH9RD-QSsB9GqdZNEqWF4",
    authDomain: "finance-newsviewer.firebaseapp.com",
    projectId: "finance-newsviewer",
    storageBucket: "finance-newsviewer.appspot.com",
    messagingSenderId: "554209465900",
    appId: "1:554209465900:web:552e9e6451c79ed70a2389"
};


const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);