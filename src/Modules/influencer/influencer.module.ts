import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InfluencerController } from 'src/Controllers/influencer/influencer.controller';
import { AuthMiddleware } from 'src/Middlewares/Auth/auth.middleware';
import {
  UserSchema,
  modelName as authModel,
} from 'src/Models/user/user.schema';
import {
  InfluencerSchema,
  modelName as influencerModel,
} from 'src/Models/influencer/influencer.schema';
import { InfluencerService } from 'src/Services/influencer/influencer.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: influencerModel, schema: InfluencerSchema },
      { name: authModel, schema: UserSchema },
    ]),
  ],
  controllers: [InfluencerController],
  providers: [InfluencerService],
})
export class InfluencerModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(InfluencerController);
  }
}
