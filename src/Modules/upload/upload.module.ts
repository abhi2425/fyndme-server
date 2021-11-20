import { CloudinaryProvider } from 'src/Providers/cloudinary/cloudinary.provider';
import { UploadService } from 'src/Services/upload/upload.service';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import {
  UserSchema,
  modelName as userModel,
} from '../../Models/user/user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/Middlewares/Auth/auth.middleware';
import {
  InfluencerSchema,
  modelName as influencerModel,
} from 'src/Models/influencer/influencer.schema';
import {
  BrandSchema,
  modelName as brandModel,
} from 'src/Models/brand/brand.schema';
import { UploadController } from 'src/Controllers/upload/upload.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: userModel, schema: UserSchema },
      { name: influencerModel, schema: InfluencerSchema },
      { name: brandModel, schema: BrandSchema },
    ]),
  ],
  providers: [CloudinaryProvider, UploadService],
  controllers: [UploadController],
})
export class UploadModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(UploadController);
  }
}
