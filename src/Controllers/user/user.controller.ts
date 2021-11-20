import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { ResponseType } from 'src/Interfaces/response.interface';
import { UserDto } from '../../Dto/user/user.dto';
import { UserService } from '../../Services/user/user.service';
import {
  ApiCreatedResponse,
  ApiBody,
  ApiOkResponse,
  ApiExcludeEndpoint,
  ApiResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { YoutubeProvider } from 'src/Providers/youtube/youtube.provider';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly youtubeService: YoutubeProvider,
  ) {}

  @Post('register-user')
  @ApiCreatedResponse({ description: 'User Created' })
  @ApiOkResponse({ description: 'User logged in' })
  @ApiBody({ type: UserDto })
  async register(
    @Body() userBody: UserDto,
    @Res() res: Response,
  ): Promise<ResponseType> {
    try {
      const user = await this.userService.findByUserId(userBody.userId);
      if (user !== null) {
        user.getAuthToken();
        res.status(200).send({
          status: HttpStatus.OK,
          message: 'success while retreiving user',
          data: { user, token: user.token, expiresIn: '31 days' },
        });
        return;
      }
      const data = await this.userService.register(userBody);
      res.status(201).send({
        status: HttpStatus.CREATED,
        message: 'success while registering new user',
        data,
      });
      return;
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }
  @ApiOkResponse({ description: 'youtube Auth Url' })
  @ApiResponse({
    schema: { type: '', example: 'https://accounts.google.com/o/oAuth' },
  })
  @Get('getYoutubeAuthUrl')
  async getYoutubeAuthUrl(): Promise<ResponseType> {
    const url = this.youtubeService.webAuthorization();
    return {
      status: 200,
      message: 'Successfully sent auth url',
      data: {
        url,
      },
    };
  }

  // redirect url
  @ApiExcludeEndpoint(true)
  @Get('connect/youtube_redirect_url')
  @ApiOkResponse({ description: 'Influencer youtube connected to fyndme' })
  async connectWithYoutube(@Query() query): Promise<ResponseType> {
    const token = await this.userService.getYoutubeAccessToken(query?.code);
    const channel = await this.userService.getChannelData(token.access_token);
    return {
      data: { channel },
      token,
      message: 'successfully connected to youtube',
      status: 200,
    };
  }
}
