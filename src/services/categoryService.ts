import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// TODO: Replace with your Firebase project configuration - This is a placeholder
const firebaseConfig = {
  // Your Firebase config
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to add a new category
export const addCategory = async (category: {
  name: string;
  description: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, 'categories'), {
      ...category,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log('Category added with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding category: ', e);
  }
};