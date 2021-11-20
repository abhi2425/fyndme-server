import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { modelName as userModel } from '../../Models/user/user.schema';
import { User, UserModel } from 'src/Interfaces/user/user.interface';
import { YoutubeProvider } from 'src/Providers/youtube/youtube.provider';
import { Credentials } from 'google-auth-library';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(userModel)
    private readonly userModel: Model<UserModel>,
    private readonly youtubeService: YoutubeProvider,
  ) {}

  async findByUserId(userId: string): Promise<UserModel> {
    const user = await this.userModel.findOne({ userId });
    return user;
  }

  async register(data: User): Promise<object> {
    const newUser = await new this.userModel(data).save();
    const token = await newUser.getAuthToken();
    return {
      user: newUser,
      token,
      expiresIn: '7 days',
    };
  }

  async getYoutubeAccessToken(authorizationCode: string): Promise<Credentials> {
    const token = await this.youtubeService.getAccessToken(authorizationCode);
    return token.tokens;
  }

  async getChannelData(access_token: string) {
    const channelData = await this.youtubeService.getChannel(access_token);
    return channelData;
  }
}
