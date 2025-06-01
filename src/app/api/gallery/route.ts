import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getServerSession } from 'next-auth/next';
import formidable from 'formidable';
import { adminDB, adminStorage } from '@/lib/firebase-admin'; // Import from new admin file

const db = adminDB; // Use adminDB from the new file

export async function GET(req: NextRequest) {
  const session = await getServerSession({ req });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Assuming session.user.isAdmin indicates an admin user
 if (!session.user.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const gallerySnapshot = await db.collection('gallery').get();
    const galleryItems = gallerySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error("Error fetching gallery items:", error);
    return NextResponse.json({ error: 'Failed to load gallery images' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const session = await getServerSession({ req });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Assuming session.user.isAdmin indicates an admin user
  if (!session.user.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    const imageFile = files.image?.[0]; // Assuming the file input name is 'image'

    if (!imageFile) {
      return NextResponse.json({ error: 'No image file uploaded' }, { status: 400 });
    }

    const storageBucket = adminStorage.bucket(); // Use adminStorage
    const uniqueFilename = `${Date.now()}_${imageFile.originalFilename}`;
    const filePath = `gallery_images/${uniqueFilename}`;
    const file = storageBucket.file(filePath);

    const fileStream = fs.createReadStream(imageFile.filepath);

    await new Promise((resolve, reject) => {
      fileStream.pipe(file.createWriteStream()).on('finish', resolve).on('error', reject);
    });

    // Get the public download URL
    await file.makePublic();
    const downloadURL = file.publicUrl();

    // Save metadata to Firestore
    const galleryRef = db.collection('gallery');
    const newGalleryDoc = await galleryRef.add({
      downloadURL,
      fileName: uniqueFilename, // Use adminDB.firestore.FieldValue.serverTimestamp() if needed
      uploadedAt: admin.firestore.FieldValue.serverTimestamp(),
      // Add any other relevant metadata here
    });

    return NextResponse.json({ message: 'Image added successfully', id: newGalleryDoc.id, downloadURL });
  } catch (error) {
    console.error("Error in POST /api/gallery:", error);
    return NextResponse.json({ error: 'Failed to add gallery image' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession({ req });
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Assuming session.user.isAdmin indicates an admin user
  if (!session.user.isAdmin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  try {
    const { id } = await req.json(); // Assuming the request body contains { id: 'gallery_item_id' }

    if (!id) {
      return NextResponse.json({ error: 'Missing gallery item ID' }, { status: 400 });
    }

    // Delete from Firestore
    await db.collection('gallery').doc(id).delete();

    // TODO: Optionally delete the image from Firebase Storage as well

    return NextResponse.json({ message: 'Image removed successfully' });
  } catch (error) {
    console.error("Error in DELETE /api/gallery:", error);
    return NextResponse.json({ error: 'Failed to remove gallery image' }, { status: 500 });
  }
}
