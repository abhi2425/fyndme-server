import { ApiProperty } from '@nestjs/swagger';
import { MessageType } from 'src/Interfaces/message/message.interface';

export class MessageFormatDto {
  @ApiProperty({ type: String })
  readonly type: MessageType;

  @ApiProperty({ type: String })
  readonly value: string;
}

export class MessageDto {
  @ApiProperty({ type: String })
  readonly conversationId: string;

  @ApiProperty({ type: String })
  readonly receiverId: string;

  @ApiProperty()
  readonly message?: MessageFormatDto;
}
