import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// TODO: Replace with your Firebase project configuration - This is a placeholder
const firebaseConfig = {
  // Your Firebase config
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to add a new product
export const addProduct = async (product: {
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    console.log('Product added with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding product: ', e);
  }
};