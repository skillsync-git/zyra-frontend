const API_BASE_URL = 'https://zyra-website.onrender.com';

/**
 * Uploads a single file to Render backend (Cloudinary)
 */
export async function uploadToFirebaseStorage(file, folder = "uploads") {
  if (!file) throw new Error("No file provided");

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  const data = await response.json();
  return data.url;
}

export async function uploadMultipleImages(files, folder = "uploads") {
  return Promise.all(
    files.map(file => uploadToFirebaseStorage(file, folder))
  );
}