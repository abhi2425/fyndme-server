import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiBody, ApiCreatedResponse } from '@nestjs/swagger';
import { MessageDto } from 'src/Dto/message/message.dto';
import { ResponseType } from 'src/Interfaces/response.interface';
import { CustomRequest } from 'src/Middlewares/Auth/auth.middleware';
import { MessageService } from 'src/Services/message/message.service';

@Controller('conversation')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('getConversationId/:receiverId')
  async create(
    @Param('receiverId') receiverId: string,
    @Req() req: CustomRequest,
  ): Promise<ResponseType> {
    const conversationId = await this.messageService.createConversation(
      req.user,
      receiverId,
    );
    return {
      status: HttpStatus.OK,
      message: 'success while creating the conversation',
      data: {
        conversationId,
      },
    };
  }

  @ApiBody({ type: MessageDto })
  @ApiCreatedResponse()
  @Post('create/newMessage')
  async createMessage(
    @Req() req: CustomRequest,
    @Body() body: MessageDto,
  ): Promise<ResponseType> {
    const message = await this.messageService.createMessage(req.user, body);
    return {
      status: 201,
      message: 'new message created',
      data: message,
    };
  }

  @Get('get/messages/:conversationId')
  async getMessages(
    @Param('conversationId') conversationId: string,
  ): Promise<ResponseType> {
    const messages = await this.messageService.getMessageById(conversationId);
    return {
      status: 200,
      message: 'success while retreiving messages',
      data: messages,
    };
  }
}
