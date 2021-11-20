import { Document, PopulatedDoc, default as Mongoose } from 'mongoose';
import { Address, Brand } from '../brand/brand.interface';
import { Image } from '../upload/upload.interface';

export interface Influencer {
  _id?: Mongoose.Types.ObjectId;
  userId?: string;
  userName: string;
  email: string;
  phone: number;
  gender?: string;
  age?: string | number;
  dateOfBirth?: string;
  interests?: Array<object> | Array<string>;
  socialMediaLinks?: Array<object>;
  profileImage?: Image;
  coverImage?: Image;
  address?: Address;
  matched?: PopulatedDoc<Brand & Document>[];
  unMatched?: PopulatedDoc<Brand & Document>[];
  requestSent?: PopulatedDoc<Brand & Document>[];
  requestReceived?: PopulatedDoc<Brand & Document>[];
}

export const influencerProjections: object = {
  userName: 1,
  email: 1,
  phone: 1,
  socialMediaLinks: 1,
  age: 1,
  dateOfBirth: 1,
  gender: 1,
  profileImage: 1,
  coverImage: 1,
  interests: 1,
  address: 1,
  createdAt: 1,
  updatedAt: 1,
};

export interface InfluencerModel extends Influencer {}
