import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/Middlewares/Auth/auth.middleware';
import {
  UserSchema,
  modelName as authModel,
} from 'src/Models/user/user.schema';
import { SwipeController } from 'src/Controllers/swipe/swipe.controller';
import { SwipeService } from 'src/Services/swipe/swipe.service';
import {
  InfluencerSchema,
  modelName as influencerModel,
} from 'src/Models/influencer/influencer.schema';
import {
  BrandSchema,
  modelName as brandModel,
} from 'src/Models/brand/brand.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: authModel, schema: UserSchema },
      { name: influencerModel, schema: InfluencerSchema },
      { name: brandModel, schema: BrandSchema },
    ]),
  ],
  controllers: [SwipeController],
  providers: [SwipeService],
})
export class SwipeModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(SwipeController);
  }
}
