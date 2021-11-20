import * as Mongoose from 'mongoose';
import { Brand } from 'src/Interfaces/brand/brand.interface';
import { AddressSchema, ImageSchema } from '../general/general.schema';

const schema = new Mongoose.Schema({
  _id: Mongoose.Schema.Types.ObjectId,
  userName: {
    type: String,
    lowercase: true,
  },
  businessName: {
    type: String,
    lowercase: true,
  },
  email: { type: String, lowercase: true },
  phone: { type: Number },
  gender: String,
  age: Number || String,
  dateOfBirth: String,
  socialMediaLinks: Array,
  profileImage: {
    type: ImageSchema,
  },
  address: { type: AddressSchema },
});

export const BrandSchema = new Mongoose.Schema<Brand>(
  {
    _id: Mongoose.Schema.Types.ObjectId,
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: Number, required: true, unique: true },
    interests: Array,
    socialMediaLinks: Array,
    profileImage: {
      type: ImageSchema,
    },
    coverImage: {
      type: ImageSchema,
    },
    address: { type: AddressSchema },
    matched: [{ type: schema }],
    unmatched: [{ type: schema }],
    requestSent: [{ type: schema }],
    requestReceived: [{ type: schema }],
  },
  { timestamps: true },
);

export const modelName: string = 'Brand';
