import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';
import { AddressDto } from '../brand/brand.dto';
import { UploadDto } from '../upload/upload.dto';

export class InfluencerDto {
  @ApiProperty({ type: String })
  readonly userName: string;

  @IsEmail()
  @ApiProperty({ type: String })
  readonly email: string;

  @ApiProperty({ type: Number })
  readonly phone: number;

  @ApiProperty({ type: String })
  readonly gender?: string;

  @ApiProperty({ type: String })
  readonly age?: string | number;

  @ApiProperty({ type: String })
  readonly dateOfBirth?: string;

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
