import Mongoose from 'mongoose';

export enum Role {
  INFLUENCER = 'influencer',
  BRAND = 'brand',
}

export interface User {
  _id?: Mongoose.Types.ObjectId;
  email: string;
  userId: string;
  name: string;
  photoUrl?: string;
  token: string;
  role: Role;
}

export interface UserModel extends User {
  getAuthToken: () => string;
}
