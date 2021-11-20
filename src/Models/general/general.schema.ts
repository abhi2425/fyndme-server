import * as Mongoose from 'mongoose';
import { Address } from 'src/Interfaces/brand/brand.interface';
import { Image } from 'src/Interfaces/upload/upload.interface';

export const AddressSchema = new Mongoose.Schema<Address>({
  locality: String,
  city: String,
  pinCode: Number,
  state: String,
  country: String,
});

export const ImageSchema = new Mongoose.Schema<Image>({
  url: String,
  publicId: String,
});
