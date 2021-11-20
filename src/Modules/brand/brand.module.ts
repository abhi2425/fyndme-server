import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/Middlewares/Auth/auth.middleware';
import {
  UserSchema,
  modelName as authModel,
} from 'src/Models/user/user.schema';

import { BrandController } from 'src/Controllers/brand/brand.controller';
import { BrandService } from 'src/Services/brand/brand.service';
import {
  BrandSchema,
  modelName as brandModel,
} from 'src/Models/brand/brand.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: brandModel, schema: BrandSchema },
      { name: authModel, schema: UserSchema },
    ]),
  ],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(BrandController);
  }
}
