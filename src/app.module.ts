require('dotenv').config();
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './Modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { InfluencerModule } from './Modules/influencer/influencer.module';
import { BrandModule } from './Modules/brand/brand.module';
import { UploadModule } from './Modules/upload/upload.module';
import { SwipeModule } from './Modules/swipe/swipe.module';
import { MessageModule } from './Modules/message/message.module';
import { SocketModule } from './Modules/socket/socket.module';

@Module({
  imports: [
    UserModule,
    InfluencerModule,
    BrandModule,
    UploadModule,
    SwipeModule,
    MessageModule,
    SocketModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
