import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import * as dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

@Injectable()
export class CloudinaryService {
  // Upload media lên Cloudinary theo userId
  async uploadMedia(file: string, userId: number): Promise<UploadApiResponse> {
    try {
      return await cloudinary.uploader.upload(file, {
        resource_type: 'auto', // Tự động nhận diện file (image/video)
        folder: `users/${userId}`, // Lưu vào thư mục riêng theo userId
      });
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw new Error('Upload failed');
    }
  }

  // Xóa media (ảnh hoặc video)
  async deleteMedia(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting from Cloudinary:', error);
      throw new Error('Delete failed');
    }
  }

  // Xóa video riêng biệt
  async deleteVideo(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
    } catch (error) {
      console.error('Error deleting video from Cloudinary:', error);
      throw new Error('Delete failed');
    }
  }
}