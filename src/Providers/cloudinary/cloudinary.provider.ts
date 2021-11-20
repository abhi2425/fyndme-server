import { v2 } from 'cloudinary';
const CLOUDINARY = 'Cloudinary';
require('dotenv').config();

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: (): object => {
    return v2.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_SECRET_KEY,
    });
  },
};
