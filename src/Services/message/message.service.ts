import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema } from 'mongoose';
import { MessageDto } from 'src/Dto/message/message.dto';
import { BrandModel } from 'src/Interfaces/brand/brand.interface';
import { InfluencerModel } from 'src/Interfaces/influencer/influencer.interface';
import {
  ConversationModel,
  Message,
  MessageModel,
} from 'src/Interfaces/message/message.interface';
import { Role, User } from 'src/Interfaces/user/user.interface';
import { modelName as brandModel } from 'src/Models/brand/brand.schema';
import { modelName as influencerModel } from 'src/Models/influencer/influencer.schema';
import {
  conversationModel,
  messageModel,
} from 'src/Models/message/message.schema';

@Injectable()
export class MessageService {
  constructor(
    @InjectModel(influencerModel)
    private readonly influencerModel: Model<InfluencerModel>,

    @InjectModel(brandModel)
    private readonly brandModel: Model<BrandModel>,

    @InjectModel(conversationModel)
    private readonly conversationModel: Model<ConversationModel>,

    @InjectModel(messageModel)
    private readonly messageModel: Model<MessageModel>,
  ) {}

  getModel(loggedInUser: User): Model<InfluencerModel> | Model<BrandModel> {
    if (loggedInUser.role === Role.INFLUENCER) {
      return this.influencerModel;
    }
    if (loggedInUser.role === Role.BRAND) return this.brandModel;
  }

  async createConversation(
    loggedInUser: User,
    receiverId: string,
  ): Promise<ConversationModel> {
    const model = this.getModel(loggedInUser);

    const user = await model.findOne(
      { userId: loggedInUser.userId },
      { matched: 1 },
    );
    if (!user) throw new HttpException('user not found', 404);

    const isValidReceiver = user.matched.findIndex(
      (data) => data._id?.toString() === receiverId,
    );
    if (isValidReceiver < 0) throw new HttpException('receiver not found', 404);

    const conversation = await this.conversationModel.findOne(
      {
        members: { $all: [user._id, receiverId] },
      },
      { _id: 1 },
    );

    if (conversation) return conversation;

    if (!conversation) {
      const conversation = await new this.conversationModel([
        user._id,
        receiverId,
      ]).save();
      return conversation._id;
    }
  }

  async createMessage(loggedInUser: User, data: MessageDto): Promise<Message> {
    const model = this.getModel(loggedInUser);
    const user = await model.findOne(
      { userId: loggedInUser.userId },
      { matched: 1 },
    );
    if (!user) throw new HttpException('user not found', 404);

    const isValidReceiver = user.matched.findIndex(
      (item) => item._id?.toString() === data.receiverId,
    );
    if (isValidReceiver < 0) throw new HttpException('receiver not found', 404);

    const newMessage = await new this.messageModel({
      ...data,
      senderId: user._id,
    }).save();

    return newMessage;
  }

  async getMessageById(conversationId: string): Promise<Message[]> {
    const id = await this.conversationModel.findById(conversationId, {
      _id: 1,
    });
    if (!id) throw new HttpException('conversation chanel not found', 404);
    const messages = await this.messageModel.find({ conversationId: id });
    return messages;
  }
}
