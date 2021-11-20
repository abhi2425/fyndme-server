export enum MessageType {
  IMAGE = 'image',
  VIDEO = 'video',
  TEXT = 'text',
  HYPERLINK = 'hyperlink',
}

export interface Conversation {
  members: [];
}

export interface Message {
  senderId: string;
  receiverId: string;
  message: MessageType;
}

export interface MessageModel extends Message {}
export interface ConversationModel extends Conversation {}
