import { MiddlewareConsumer, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageController } from 'src/Controllers/message/message.controller';
import { AuthMiddleware } from 'src/Middlewares/Auth/auth.middleware';
import {
  BrandSchema,
  modelName as brandModel,
} from 'src/Models/brand/brand.schema';
import {
  InfluencerSchema,
  modelName as influencerModel,
} from 'src/Models/influencer/influencer.schema';
import {
  conversationModel,
  ConversationSchema,
  messageModel,
  MessageSchema,
} from 'src/Models/message/message.schema';
import {
  UserSchema,
  modelName as authModel,
} from 'src/Models/user/user.schema';
import { MessageService } from 'src/Services/message/message.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: influencerModel, schema: InfluencerSchema },
      { name: authModel, schema: UserSchema },
      { name: brandModel, schema: BrandSchema },
      { name: messageModel, schema: MessageSchema },
      { name: conversationModel, schema: ConversationSchema },
    ]),
  ],
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(MessageController);
  }
}
