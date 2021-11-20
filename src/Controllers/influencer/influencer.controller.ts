import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { InfluencerDto } from 'src/Dto/influencer/influencer.dto';
import { ResponseType } from 'src/Interfaces/response.interface';
import { CustomRequest } from 'src/Middlewares/Auth/auth.middleware';
import { InfluencerService } from 'src/Services/influencer/influencer.service';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiBody,
} from '@nestjs/swagger';
@Controller('influencer')
export class InfluencerController {
  constructor(private readonly influencerService: InfluencerService) {}

  @Post('create')
  @ApiCreatedResponse({ description: 'Influencer Created' })
  @ApiBody({ type: InfluencerDto })
  @ApiUnauthorizedResponse({ description: 'Invalid Token' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async create(
    @Body() userBody: InfluencerDto,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ): Promise<ResponseType> {
    try {
      if (!req.user.role) {
        const data = await this.influencerService.create(userBody, req.user);
        res.status(201).send({
          status: HttpStatus.CREATED,
          message: 'Success while creating influencer',
          data,
        });
        return;
      }
      throw new HttpException(
        `user already exists as ${req.user.role} type`,
        500,
      );
    } catch (error) {
      res.status(500).send({ error: error.message });
    }
  }

  @Get('getAll')
  async findAll(): Promise<ResponseType> {
    return {
      status: HttpStatus.OK,
      message: 'success while retrieving data',
      data: await this.influencerService.findAll(),
    };
  }

  @Get('getById/:_id')
  async findById(@Param('_id') _id: string): Promise<ResponseType> {
    return {
      status: HttpStatus.OK,
      message: 'success while retrieving data',
      data: await this.influencerService.findById(_id),
    };
  }

  @Get('get/profile')
  async findByUserId(@Req() req: CustomRequest): Promise<ResponseType> {
    return {
      status: HttpStatus.OK,
      message: 'success while retrieving data',
      data: await this.influencerService.findByUserId(req.user.userId),
    };
  }

  @Get('getMatchedBrands')
  async getMatched(@Req() req: CustomRequest): Promise<ResponseType> {
    const data = await this.influencerService.findByFieldName(
      'matched',
      req.user.userId,
    );
    return {
      status: HttpStatus.OK,
      message: 'success while retrieving data',
      data,
    };
  }

  @Get('getReceivedRequest')
  async getReceivedRequest(@Req() req: CustomRequest): Promise<ResponseType> {
    const data = await this.influencerService.findByFieldName(
      'receivedRequest',
      req.user.userId,
    );
    return {
      status: HttpStatus.OK,
      message: 'success while retrieving data',
      data,
    };
  }

  @Get('getSentRequest')
  async getSentRequest(@Req() req: CustomRequest): Promise<ResponseType> {
    const data = await this.influencerService.findByFieldName(
      'sentRequest',
      req.user.userId,
    );
    return {
      status: HttpStatus.OK,
      message: 'success while retrieving data',
      data,
    };
  }

  @Patch('update')
  async updateByUserId(
    @Req() req: CustomRequest,
    @Body() body: InfluencerDto,
  ): Promise<ResponseType> {
    return {
      status: HttpStatus.OK,
      message: 'success while updating data',
      data: await this.influencerService.updateByUserId(req.user.userId, body),
    };
  }

  @Delete('delete')
  async deleteByUserId(@Req() req: CustomRequest): Promise<ResponseType> {
    return {
      status: HttpStatus.OK,
      message: 'success while deleting data',
      data: await this.influencerService.deleteByUserId(req.user.userId),
    };
  }
}
