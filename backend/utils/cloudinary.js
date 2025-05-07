import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY
});

export const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'slider',
            resource_type: 'auto'
        });
        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary yükleme hatası:', error);
        throw error;
    }
};

export const deleteFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Cloudinary silme hatası:', error);
        throw error;
    }
}; 