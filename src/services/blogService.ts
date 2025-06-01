import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// TODO: Replace with your Firebase project configuration - This is a placeholder
const firebaseConfig = {
  // Your Firebase config
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to add a new blog post
export const addBlogPost = async (post: {
  title: string;
  content: string;
  slug: string;
  imageUrl?: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, 'blogPosts'), {
      ...post,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      publishedAt: Timestamp.now(), // Placeholder — update if using real publish flow
    });
    console.log('Blog post added with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding blog post: ', e);
  }
};