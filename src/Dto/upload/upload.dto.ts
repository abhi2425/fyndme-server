import { ApiProperty } from '@nestjs/swagger';

export class UploadDto {
  @ApiProperty({ type: String })
  readonly url: string;

  @ApiProperty({ type: String })
  readonly publicId: string;
}

export class profileUploadDto {
  @ApiProperty({
    type: 'file',
    properties: {
      avatar: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  avatar: any;
}

export class coverUploadDto {
  @ApiProperty({
    type: 'file',
    properties: {
      coverImage: {
        type: 'string',
        format: 'binary',
      },
    },
  })
  coverImage: any;
}
