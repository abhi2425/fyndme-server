import {
  Controller,
  Delete,
  HttpStatus,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { coverUploadDto, profileUploadDto } from 'src/Dto/upload/upload.dto';
import { ResponseType } from 'src/Interfaces/response.interface';
import { CustomRequest } from 'src/Middlewares/Auth/auth.middleware';
import { UploadService } from 'src/Services/upload/upload.service';

@Controller('image')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('upload/profileImage')
  @ApiOkResponse()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: profileUploadDto })
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadProfileImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: CustomRequest,
  ): Promise<ResponseType> {
    const response = await this.uploadService.uploadUserImage(
      req.user,
      file,
      'profileImage',
    );
    return {
      status: 200,
      message: 'success while uploading profile image',
      data: response,
    };
  }

  @Post('upload/coverImage')
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse()
  @ApiBody({ type: coverUploadDto })
  @UseInterceptors(FileInterceptor('coverImage'))
  async uploadCoverImage(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: CustomRequest,
  ): Promise<ResponseType> {
    const response = await this.uploadService.uploadUserImage(
      req.user,
      file,
      'coverImage',
    );
    return {
      status: HttpStatus.OK,
      message: 'success while uploading cover image',
      data: response,
    };
  }

  @Delete('delete/profileImage')
  @ApiOkResponse()
  async deleteProfileImage(@Req() req: CustomRequest): Promise<ResponseType> {
    const response = await this.uploadService.deleteUserImage(
      req.user,
      'profileImage',
    );
    return {
      message: 'success while deleting profile image',
      status: HttpStatus.OK,
      data: response,
    };
  }

  @Delete('delete/coverImage')
  @ApiOkResponse()
  async deleteCoverImage(@Req() req: CustomRequest): Promise<ResponseType> {
    const response = await this.uploadService.deleteUserImage(
      req.user,
      'coverImage',
    );
    return {
      message: 'success while deleting cover image',
      status: HttpStatus.OK,
      data: response,
    };
  }
}
