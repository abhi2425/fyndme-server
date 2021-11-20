import * as Mongoose from 'mongoose';
import { Influencer } from 'src/Interfaces/influencer/influencer.interface';
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
  socialMediaLinks: Array,
  profileImage: {
    type: ImageSchema,
  },
  address: { type: AddressSchema },
});

export const InfluencerSchema = new Mongoose.Schema<Influencer>(
  {
    _id: Mongoose.Schema.Types.ObjectId,
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    userName: { type: String, required: true, unique: true, lowercase: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: Number, required: true, unique: true },
    gender: String,
    age: Number || String,
    dateOfBirth: String,
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

export const modelName: string = 'Influencer';
