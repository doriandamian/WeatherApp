import { initializeApp } from "firebase/app";

export const environment = {
     production: false,
  apiKey: "AIzaSyAZdclowmTKES4cGt4WKjI9YOQOuOybGOA",
  authDomain: "weatherapp-7f877.firebaseapp.com",
  projectId: "weatherapp-7f877",
  storageBucket: "weatherapp-7f877.firebasestorage.app",
  messagingSenderId: "157294965148",
  appId: "1:157294965148:web:3ce5bad9186dc39fd8d859"
};


const app = initializeApp(environment);