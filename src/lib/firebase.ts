import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

// Firebase configuration
// For production, consider using environment variables via a build system
const firebaseConfig = {
  apiKey: "AIzaSyBn65frWFbl1tKGFA0kliY7Btj9QtG2-7c",
  authDomain: "portsmouthbridge.firebaseapp.com",
  projectId: "portsmouthbridge",
  storageBucket: "portsmouthbridge.firebasestorage.app",
  messagingSenderId: "488637125012",
  appId: "1:488637125012:web:d964265b4d7241f9aeff81",
  measurementId: "G-LPBHXSSYP9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
// Initialize Firestore with persistent cache
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache()
});
export const functions = getFunctions(app);


export default app;
