import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a base64 image data string to Cloudinary.
 * If the input is not a base64 data URI string, it is returned untouched.
 * Falls back to the original string if the Cloudinary upload fails.
 * 
 * @param {string} base64String 
 * @returns {Promise<string>} The uploaded image secure URL or original string fallback.
 */
export const uploadToCloudinary = async (base64String) => {
  try {
    if (!base64String || typeof base64String !== 'string' || !base64String.startsWith('data:image/')) {
      return base64String;
    }

    console.log('☁️ Uploading base64 image to Cloudinary...');
    const uploadResponse = await cloudinary.uploader.upload(base64String, {
      folder: 'mockmate_avatars',
      resource_type: 'image',
    });

    console.log('☁️ Cloudinary Upload Successful:', uploadResponse.secure_url);
    return uploadResponse.secure_url;
  } catch (error) {
    console.error('❌ Cloudinary Upload Failed:', error.message || error);
    return base64String;
  }
};

export default cloudinary;
