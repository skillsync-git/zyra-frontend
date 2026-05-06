import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import {storage} from '../firebase';

/**
 * Uploads a file directly to Firebase Storage and returns its download URL
 * @param {File} file - browser File object
 * @param {string} folder - storage folder name
 * @returns {Promise<string>} download URL
 */
export async function uploadToFirebaseStorage(file, folder = "uploads") {
  if (!file) throw new Error("No file provided");

  //const storage = getStorage();

  const safeName = file.name.replace(/\s+/g, "_");
  const filePath = `${folder}/${Date.now()}-${safeName}`;

  const storageRef = ref(storage, filePath);

  await uploadBytes(storageRef, file, {
    contentType: file.type,
  });

  return await getDownloadURL(storageRef);
}

export async function uploadMultipleImages(files, folder = "uploads") {
  return Promise.all(
    files.map(file => uploadToFirebaseStorage(file, folder))
  );
}
