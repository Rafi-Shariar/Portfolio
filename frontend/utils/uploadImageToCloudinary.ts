// lib/uploadImage.ts

export const uploadImageToCloudinary = async (file: File): Promise<string | null> => {

  if (!file) return null;

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    console.error("Cloudinary env variables are missing!");
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (res.ok && data.secure_url) {
      return data.secure_url; 
    } else {
      console.error("Cloudinary error:", data.error?.message);
      return null;
    }
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};