import * as Mongoose from 'mongoose';
import {
  Conversation,
  Message,
} from 'src/Interfaces/message/message.interface';

const MessageFormatSchema = new Mongoose.Schema({
  type: { type: String, required: true },
  value: { type: String, required: true },
});

export const MessageSchema = new Mongoose.Schema<Message>(
  {
    conversationId: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },

    message: {
      type: MessageFormatSchema,
    },
  },
  { timestamps: true },
);

export const ConversationSchema = new Mongoose.Schema<Conversation>(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true },
);

export const messageModel: string = 'message';
export const conversationModel: string = 'conversation';
