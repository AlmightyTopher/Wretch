// src/services/authService.ts

import {
  setPersistence,
  browserLocalPersistence,
  signInWithEmailAndPassword as firebaseSignInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from 'firebase/auth';
import { getFirebaseAuth } from '../lib/firebase';

/**
 * Signs in a user with email and password using Firebase Authentication.
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A Promise that resolves with the authenticated Firebase User object.
 * @throws An error if sign-in fails.
 */
export const signInWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
  try {
    const auth = await getFirebaseAuth();
    const userCredential = await firebaseSignInWithEmailAndPassword(auth, email, password);
    console.log('User signed in successfully:', userCredential.user.uid);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error signing in with email and password:', error);
    throw new Error(`Failed to sign in: ${error.message || 'Unknown error'}`);
  }
};

/**
 * Signs out the currently authenticated user from Firebase Authentication.
 * @returns A Promise that resolves when the user is signed out.
 * @throws An error if sign-out fails.
 */
export const signOutUser = async (): Promise<void> => {
  try {
    const auth = await getFirebaseAuth();
    await firebaseSignOut(auth);
    console.log('User signed out successfully');
  } catch (error: any) {
    console.error('Error signing out:', error);
    throw new Error(`Failed to sign out: ${error.message || 'Unknown error'}`);
  }
};

// Function to initialize Firebase Auth persistence
export const initializeAuthPersistence = async (): Promise<void> => {
  try {
    const auth = await getFirebaseAuth();
    await setPersistence(auth, browserLocalPersistence);
    console.log('Firebase Auth persistence set to browserLocalPersistence');
  } catch (error: any) {
    console.error('Error setting Firebase Auth persistence:', error);
    // Depending on the error, you might not want to throw here,
    // as it shouldn't necessarily block app startup.
  }
};

// TODO: Call initializeAuthPersistence() on app startup.
// TODO: Add more authentication-related functions as needed, e.g.:
// - createUserWithEmailAndPassword
// - sendPasswordResetEmail
// - onAuthStateChanged listener setup
// - Functions for handling social login (Google, etc.)