// Instructions: Fix the GalleryImage interface, AddGalleryImageError class, use Timestamp for dates, and improve Firestore initialization and error handling.

import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, Timestamp } from "firebase/firestore";
import { getFirebaseFirestore } from './firebase'; // Corrected import

// Define the GalleryImage interface correctly
export interface GalleryImage {
  id?: string; // Optional ID for document reference
  filename: string;
  downloadURL: string;
  uploadedAt: Timestamp; // Use Firebase Timestamp for dates
  title?: string; // Optional title
  description?: string; // Optional description
  order?: number; // Optional field for ordering
}

// Define custom error classes
class GetGalleryImagesError extends Error {
  constructor(message: string) {
    super(`Failed to get gallery images: ${message}`);
    this.name = 'GetGalleryImagesError';
  }
}

class AddGalleryImageError extends Error {
  constructor(message: string) {
    super(`Failed to add gallery image: ${message}`); // Corrected super call
    this.name = 'AddGalleryImageError';
  }
}

class DeleteGalleryImageError extends Error {
  constructor(message: string) {
    super(`Failed to delete gallery image: ${message}`);
    this.name = 'DeleteGalleryImageError';
  }
}

// Get Firestore instance asynchronously
let dbInstance: any; // Consider using a more specific type if possible
const initializeDb = async () => {
  if (!dbInstance) {
    dbInstance = await getFirebaseFirestore();
  }
  return dbInstance;
};

const getGalleryCollection = async () => {
  const db = await initializeDb();
  return collection(db, 'gallery');
}

// Type for image data when adding (ID is auto-generated, uploadedAt is set by server)
export type NewGalleryImageData = Omit<GalleryImage, 'id' | 'uploadedAt'>;

export const addGalleryImage = async (imageData: NewGalleryImageData): Promise<GalleryImage> => {
  try {
    const galleryCollectionRef = await getGalleryCollection();
    const newImageRef = await addDoc(galleryCollectionRef, {
      ...imageData,
      uploadedAt: Timestamp.now(), // Use Firebase Timestamp for consistency
    });

    // To return the full GalleryImage object, we can construct it here if Firestore doesn't return it directly
    // or re-fetch, but for simplicity, we'll construct it.
    // For a more robust solution, consider fetching the doc by ID: const docSnap = await getDoc(newImageRef);
    return {
      id: newImageRef.id,
      ...imageData,
      uploadedAt: Timestamp.now(), // This might differ slightly from server, consider re-fetch for precision
    } as GalleryImage;
  } catch (error: any) {
    console.error("Error in addGalleryImage:", error);
    throw new AddGalleryImageError(error.message || 'Unknown error occurred');
  }
};

export const getGalleryImages = async (): Promise<GalleryImage[]> => {
  try {
    const galleryCollectionRef = await getGalleryCollection();
    const gallerySnapshot = await getDocs(query(galleryCollectionRef, orderBy('uploadedAt', 'desc')));
    return gallerySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as GalleryImage));
  } catch (error: any) {
    console.error("Error in getGalleryImages:", error);
    throw new GetGalleryImagesError(error.message || 'Unknown error occurred');
  }
};

export const deleteGalleryImage = async (id: string): Promise<void> => {
  try {
    const galleryCollectionRef = await getGalleryCollection();
    const imageDoc = doc(galleryCollectionRef, id);
    await deleteDoc(imageDoc);
  } catch (error: any) {
    console.error("Error in deleteGalleryImage:", error);
    throw new DeleteGalleryImageError(error.message || 'Unknown error occurred');
  }
};
