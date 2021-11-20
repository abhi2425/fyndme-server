require('dotenv').config();
import * as jwt from 'jsonwebtoken';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserModel } from '../../Interfaces/user/user.interface';
import { modelName as userModel } from '../../Models/user/user.schema';

export interface CustomRequest extends Request {
  user: UserModel;
  token: string;
}

interface Decoded extends jwt.JwtPayload {
  _id: string;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(userModel)
    private readonly userModel: Model<UserModel>,
  ) {}

  async use(req: CustomRequest, res: Response, next: NextFunction) {
    try {
      let token = req.header('Authorization');
      if (!token) throw new Error('Not Authorized');
      token = token.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      const user = await this.userModel.findOne({
        _id: (decoded as Decoded)._id,
      });

      if (!user) throw new Error('User not found!!');
      req.token = token;
      req.user = user;
      next();
    } catch (error) {
      res.status(401).send({
        error: 'Invalid Authenticate-: ' + error.message,
      });
    }
  }
}
