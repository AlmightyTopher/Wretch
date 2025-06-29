import * as admin from "firebase-admin";
import dotenv from 'dotenv';

// Add this block to ensure variables are loaded during build/SSR
if (typeof window === 'undefined') { // Check if running on the server
 dotenv.config({ path: '.env.local' });
}

// Prevent re-initialization on hot reload in dev
if (!admin.apps.length) {
 // Add a check for essential variables BEFORE initializing
  if (!process.env.FIREBASE_PROJECT_ID) {
 console.error("FATAL ERROR: FIREBASE_PROJECT_ID is not defined. Cannot initialize Firebase Admin SDK.");
  }
   if (!process.env.FIREBASE_CLIENT_EMAIL) {
 console.error("FATAL ERROR: FIREBASE_CLIENT_EMAIL is not defined. Cannot initialize Firebase Admin SDK.");
   }
   if (!process.env.FIREBASE_PRIVATE_KEY) {
 console.error("FATAL ERROR: FIREBASE_PRIVATE_KEY is not defined. Cannot initialize Firebase Admin SDK.");
   }
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export const adminDB = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage();