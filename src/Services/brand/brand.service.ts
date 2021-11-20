import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Role } from 'src/Interfaces/user/user.interface';
import {
  Brand,
  BrandModel,
  brandProjections,
} from 'src/Interfaces/brand/brand.interface';
import { modelName as brandModel } from 'src/Models/brand/brand.schema';
import { BrandDto } from 'src/Dto/brand/brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(brandModel)
    private readonly brandModel: Model<BrandModel>,
  ) {}

  async create(data: Brand, user: any): Promise<BrandModel> {
    const brand = await new this.brandModel({
      ...data,
      profileImage: { url: user?.photoUrl },
      userId: user?.userId,
      email: user?.email,
      _id: user?._id,
    }).save();

    user.role = Role.BRAND;
    await user?.save();
    return brand;
  }

  async findByUserId(userId: string): Promise<BrandModel> {
    return await this.brandModel.findOne({ userId }, brandProjections);
  }

  async findById(_id: string): Promise<BrandModel> {
    return await this.brandModel.findOne({ _id }, brandProjections);
  }

  async findByFieldName(
    fieldName: string,
    userId: string,
  ): Promise<BrandModel[]> {
    return await this.brandModel.find({ userId }, { [fieldName]: 1 });
  }

  async findAll(): Promise<BrandModel[]> {
    return await this.brandModel.aggregate([{ $project: brandProjections }]);
  }

  async updateByUserId(userId: string, body: BrandDto): Promise<BrandModel> {
    const user = await this.brandModel.findOne({ userId }, brandProjections);
    const userKeys = Object.keys(body);
    userKeys.forEach((key) => {
      if (key !== 'userId' && key !== 'email' && key !== '_id')
        user[key] = body[key];
    });
    await user.save();
    return user;
  }

  async deleteByUserId(userId: string): Promise<Object> {
    return await this.brandModel.deleteOne({ userId });
  }
}
