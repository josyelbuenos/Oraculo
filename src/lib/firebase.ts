import { initializeApp, getApp, getApps } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHMBW6tQCpTXs0icaYioGP7JhBDrgGnNo",
  authDomain: "orculo-cyber-data-scanne-2jdsv.firebaseapp.com",
  projectId: "orculo-cyber-data-scanne-2jdsv",
  storageBucket: "orculo-cyber-data-scanne-2jdsv.firebasestorage.app",
  messagingSenderId: "706878051450",
  appId: "1:706878051450:web:24ca4758816d2a30a617c3",
  databaseURL: "https://orculo-cyber-data-scanne-2jdsv-default-rtdb.firebaseio.com/"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const db = getDatabase(app);

export { db };
