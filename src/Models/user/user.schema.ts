require('dotenv').config();
import * as Mongoose from 'mongoose';
import * as Jwt from 'jsonwebtoken';
import { User } from '../../Interfaces/user/user.interface';

export const UserSchema = new Mongoose.Schema<User>(
  {
    userId: {
      type: String,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    name: {
      type: String,
      lowercase: true,
    },
    photoUrl: String,
    role: {
      type: String,
    },
    token: {
      unique: true,
      type: String,
    },
  },
  { timestamps: true },
);

// generating auth token for user
UserSchema.methods = {
  async getAuthToken(): Promise<string> {
    try {
      const token = Jwt.sign(
        {
          _id: this._id.toString(),
        },
        process.env.SECRET_KEY,
        {
          expiresIn: '31 days',
        },
      );
      this.token = token;
      this.save();
      return token;
    } catch (error) {
      console.log(error);
    }
  },

  toJSON: function () {
    const userObject = this.toObject();
    delete userObject.token;
    return userObject;
  },
};

export const modelName: string = 'User';
