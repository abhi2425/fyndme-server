import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import {
  UploadApiErrorResponse,
  UploadApiResponse,
  v2,
  DeleteApiResponse,
} from 'cloudinary';
import toStream = require('buffer-to-stream');
import { Role, User } from 'src/Interfaces/user/user.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  InfluencerModel,
  influencerProjections,
} from 'src/Interfaces/influencer/influencer.interface';
import { modelName as influencerModel } from 'src/Models/influencer/influencer.schema';
import {
  BrandModel,
  brandProjections,
} from 'src/Interfaces/brand/brand.interface';
import { modelName as brandModel } from 'src/Models/brand/brand.schema';

@Injectable()
export class UploadService {
  constructor(
    @InjectModel(influencerModel)
    private readonly influencerModel: Model<InfluencerModel>,
    @InjectModel(brandModel)
    private readonly brandModel: Model<BrandModel>,
  ) {}
  uploadImageToCloud(
    file: Express.Multer.File,
    folder: Role,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream({ folder }, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });

      toStream(file.buffer).pipe(upload);
    });
  }

  deleteImageFromCloud(publicId: string): Promise<DeleteApiResponse> {
    return new Promise((resolve, reject) => {
      v2.uploader.destroy(publicId, async (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      });
    });
  }

  async uploadUserImage(
    user: User,
    file: Express.Multer.File,
    imageType: string,
  ): Promise<InfluencerModel | BrandModel> {
    /* -------------For Influencer------------*/

    if (user.role === Role.INFLUENCER) {
      const influencer = await this.influencerModel.findOne(
        {
          userId: user.userId,
        },
        influencerProjections,
      );

      if (influencer !== null) {
        influencer[imageType].publicId &&
          this.deleteImageFromCloud(influencer[imageType].publicId).catch(
            () => {},
          );

        const result = await this.uploadImageToCloud(
          file,
          Role.INFLUENCER,
        ).catch(() => {
          throw new BadRequestException('Invalid file type.');
        });

        influencer[imageType] = {
          url: result.url,
          publicId: result.public_id,
        };
        influencer.save();
        return influencer;
      }
      throw new HttpException('influencer not found', 404);
    }

    /* -------------For Brand------------*/

    if (user.role === Role.BRAND) {
      const brand = await this.brandModel.findOne(
        {
          userId: user.userId,
        },
        brandProjections,
      );

      if (brand !== null) {
        brand[imageType].publicId &&
          this.deleteImageFromCloud(brand[imageType].publicId).catch(() => {});

        const result = await this.uploadImageToCloud(file, Role.BRAND).catch(
          () => {
            throw new BadRequestException('Invalid file type.');
          },
        );
        brand[imageType] = {
          url: result.url,
          publicId: result.public_id,
        };
        brand.save();
        return brand;
      }
      throw new HttpException('brand not found', 404);
    }

    throw new HttpException('Invalid User Type', 400);
  }

  async deleteUserImage(user: User, imageType: string) {
    /* -------------For Influencer------------*/
    if (user.role === Role.INFLUENCER) {
      const influencer = await this.influencerModel.findOne({
        userId: user.userId,
      });

      if (influencer !== null) {
        if (!influencer[imageType].publicId)
          throw new HttpException('image not found', 404);

        this.deleteImageFromCloud(influencer[imageType].publicId).catch(
          (error) => {
            throw new HttpException(error.message, 400);
          },
        );

        influencer[imageType] = {
          url: '',
          publicId: '',
        };
        influencer.save();
        return influencer;
      }
      throw new HttpException('influencer not found', 404);
    }

    /* -------------For Brand------------*/

    if (user.role === Role.BRAND) {
      const brand = await this.brandModel.findOne({
        userId: user.userId,
      });

      if (brand !== null) {
        if (!brand[imageType].publicId)
          throw new HttpException('image not found', 404);

        this.deleteImageFromCloud(brand[imageType].publicId).catch((error) => {
          throw new HttpException(error.message, 400);
        });
        brand[imageType] = {
          url: '',
          publicId: '',
        };
        brand.save();
        return brand;
      }
      throw new HttpException('brand not found', 404);
    }

    throw new HttpException('Invalid User Type', 400);
  }
}
