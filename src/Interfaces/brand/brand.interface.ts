import { Document, PopulatedDoc, default as Mongoose } from 'mongoose';
import { Influencer } from '../influencer/influencer.interface';
import { Image } from '../upload/upload.interface';

export interface Address {
  locality: string;
  city: string;
  pinCode: number;
  state: string;
  country: string;
}

export interface Brand {
  _id?: Mongoose.Types.ObjectId;
  userId?: string;
  businessName: string;
  email: string;
  phone: number;
  interests?: Array<object> | Array<string>;
  socialMediaLinks?: Array<object>;
  profileImage?: Image;
  coverImage?: Image;
  address?: Address;
  matched?: PopulatedDoc<Influencer & Document>[];
  unMatched?: PopulatedDoc<Influencer & Document>[];
  requestSent?: PopulatedDoc<Influencer & Document>[];
  requestReceived?: PopulatedDoc<Influencer & Document>[];
}

export const brandProjections: object = {
  businessName: 1,
  email: 1,
  phone: 1,
  socialMediaLinks: 1,
  profileImage: 1,
  coverImage: 1,
  interests: 1,
  address: 1,
  createdAt: 1,
  updatedAt: 1,
};

export interface BrandModel extends Brand {}
