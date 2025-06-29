import { collection, addDoc, Timestamp, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Import db from the centralized firebase.ts


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

/**
 * Fetches all blog posts from Firestore.
 * @returns A Promise that resolves with an array of blog post objects.
 * @throws An error if fetching fails.
 */
export const getBlogPosts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'blogPosts'));
    const blogPosts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return blogPosts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    throw new Error(`Failed to fetch blog posts: ${(error as Error).message || 'Unknown error'}`);
  }
};
