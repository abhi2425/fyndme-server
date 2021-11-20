import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { UploadDto } from '../upload/upload.dto';

export class AddressDto {
  @ApiProperty({ type: String })
  readonly locality: string;

  @ApiProperty({ type: String })
  readonly city: string;

  @ApiProperty({ type: Number })
  readonly pinCode: number;

  @ApiProperty({ type: String })
  readonly state: string;

  @ApiProperty({ type: String })
  readonly country: string;
}
export class BrandDto {
  @ApiProperty({ type: String })
  readonly businessName: string;

  @ApiProperty({ type: String, required: true })
  @IsEmail()
  readonly email: string;

  @ApiProperty({ type: Number, required: true })
  readonly phone: number;

  @ApiProperty({ type: Array })
  readonly interests?: Array<object> | Array<string>;

  @ApiProperty({ type: Array })
  readonly socialMediaLinks?: Array<object>;

  @ApiProperty()
  readonly profileImage?: UploadDto;

  @ApiProperty()
  readonly coverImage?: UploadDto;

  @ApiProperty()
  readonly address?: AddressDto;
}
