import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/Interfaces/user/user.interface';
import {
  Influencer,
  InfluencerModel,
  influencerProjections,
} from 'src/Interfaces/influencer/influencer.interface';
import { modelName as influencerModel } from 'src/Models/influencer/influencer.schema';
import { InfluencerDto } from 'src/Dto/influencer/influencer.dto';

@Injectable()
export class InfluencerService {
  constructor(
    @InjectModel(influencerModel)
    private readonly influencerModel: Model<InfluencerModel>,
  ) {}

  async create(data: Influencer, user: any): Promise<InfluencerModel> {
    const influencer = await new this.influencerModel({
      ...data,
      profileImage: { url: user?.photoUrl },
      userId: user?.userId,
      email: user?.email,
      _id: user?._id,
    }).save();
    user.role = Role.INFLUENCER;
    await user?.save();
    return influencer;
  }

  async findByUserId(userId: string): Promise<InfluencerModel> {
    return await this.influencerModel.findOne(
      { userId },
      influencerProjections,
    );
  }
  async findById(_id: string): Promise<InfluencerModel> {
    return await this.influencerModel.findOne({ _id }, influencerProjections);
  }

  async findByFieldName(
    fieldName: string,
    userId: string,
  ): Promise<InfluencerModel[]> {
    return await this.influencerModel.find({ userId }, { [fieldName]: 1 });
  }

  async findAll(): Promise<InfluencerModel[]> {
    return await this.influencerModel.aggregate([
      { $project: influencerProjections },
    ]);
  }

  async updateByUserId(
    userId: string,
    body: InfluencerDto,
  ): Promise<InfluencerModel> {
    const user = await this.influencerModel.findOne(
      { userId },
      influencerProjections,
    );
    const userKeys = Object.keys(body);
    userKeys.forEach((key) => {
      if (key !== 'userId' && key !== 'email' && key !== '_id')
        user[key] = body[key];
    });
    await user.save();
    return user;
  }

  async deleteByUserId(userId: string): Promise<Object> {
    return await this.influencerModel.deleteOne({ userId });
  }
}
