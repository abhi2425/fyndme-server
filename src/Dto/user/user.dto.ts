import { Role } from '../../Interfaces/user/user.interface';
import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class UserDto {
  @IsEmail()
  @IsString()
  @ApiProperty({ type: String, description: 'email', required: true })
  readonly email: string;

  @IsString()
  @ApiProperty({ type: String, description: 'userId', required: true })
  readonly userId: string;

  @IsString()
  @ApiProperty({ type: String, description: 'name' })
  readonly name: string;

  @IsString()
  @ApiProperty({ type: String, description: 'photoUrl' })
  readonly photoUrl: string;

  readonly token: string;
  readonly role: Role;
}
