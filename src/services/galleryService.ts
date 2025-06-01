import { collection, addDoc, Timestamp, getFirestore, getDocs } from 'firebase/firestore';
import { getFirebaseFirestore } from '../lib/firebase';

interface GalleryImageMetadata {
  url: string;
  name: string;
  description?: string;
  order?: number;
  // Add any other optional metadata fields here
}

/**
 * Saves gallery image metadata to Firestore.
 * @param metadata - An object containing the gallery image metadata.
 * @returns A Promise that resolves with the DocumentReference of the newly created document.
 */
export const saveGalleryImageMetadata = async (metadata: GalleryImageMetadata) => {
  try {
    const db = await getFirebaseFirestore();
    const docRef = await addDoc(collection(db, 'gallery'), {
      ...metadata,
      uploadedAt: Timestamp.now(),
    });
    console.log('Gallery image metadata saved with ID: ', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Error saving gallery image metadata to Firestore:', error);
    throw new Error(`Failed to save gallery image metadata: ${(error as Error).message || 'Unknown error'}`);
  }
};

/**
 * Fetches all gallery image metadata from Firestore.
 * @returns A Promise that resolves with an array of gallery image objects, including their IDs.
 */
export const getGalleryImages = async () => {
  try {
    const db = await getFirebaseFirestore();
    const galleryCollectionRef = collection(db, 'gallery');
    const querySnapshot = await getDocs(galleryCollectionRef);

    const images = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return images;
  } catch (error) {
    console.error('Error fetching gallery images from Firestore:', error);
    throw new Error(`Failed to fetch gallery images: ${(error as Error).message || 'Unknown error'}`);
  }
};