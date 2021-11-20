import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UserController } from '../../Controllers/user/user.controller';
import {
  UserSchema,
  modelName as userModel,
} from '../../Models/user/user.schema';
import { UserService } from '../../Services/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from 'src/Middlewares/Auth/auth.middleware';
import { YoutubeProvider } from 'src/Providers/youtube/youtube.provider';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: userModel, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, YoutubeProvider],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'user/register-user', method: RequestMethod.POST })
      .exclude({
        path: 'api/v1/user/connect/youtube_redirect_url',
        method: RequestMethod.GET,
      })
      .forRoutes(UserController);
  }
}
