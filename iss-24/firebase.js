// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import firestore from "firebase/compat/app";
import "firebase/compat/auth";
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB56rFcKPFOR1S27OlyvYTq4ULwTw8ukmI",
  authDomain: "iss-manager-8f13a.firebaseapp.com",
  databaseURL: "https://iss-manager-8f13a-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "iss-manager-8f13a",
  storageBucket: "iss-manager-8f13a.appspot.com",
  messagingSenderId: "369031223874",
  appId: "1:369031223874:web:79358eef8b5cda85cfabdb",
  measurementId: "G-740NC5J3DF"
};

// Initialize Firebase
let app;
if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}
// const app = initializeApp(firebaseConfig);
const auth = firebase.auth();
// const db = firebase.database(app);
const db = getDatabase(app);

export { auth, db };
