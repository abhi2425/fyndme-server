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
import { BrandDto } from 'src/Dto/brand/brand.dto';
import { ResponseType } from 'src/Interfaces/response.interface';
import { CustomRequest } from 'src/Middlewares/Auth/auth.middleware';
import { BrandService } from 'src/Services/brand/brand.service';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiUnauthorizedResponse,
  ApiBody,
} from '@nestjs/swagger';
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post('create')
  @ApiCreatedResponse({ description: 'Brand Created' })
  @ApiUnauthorizedResponse({ description: 'Invalid Token' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  @ApiBody({ type: BrandDto })
  @Post('create')
  async create(
    @Body() userBody: BrandDto,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ): Promise<ResponseType> {
    try {
      if (!req.user.role) {
        const data = await this.brandService.create(userBody, req.user);
        res.status(201).send({
          status: HttpStatus.CREATED,
          message: 'Success while creating brand',
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
      message: 'success while retreiving data',
      data: await this.brandService.findAll(),
    };
  }

  @Get('getById/:_id')
  async findById(@Param('_id') _id: string): Promise<ResponseType> {
    return {
      status: HttpStatus.OK,
      message: 'success while retreiving data',
      data: await this.brandService.findById(_id),
    };
  }

  @Get('get/profile')
  async findByUserId(@Req() req: CustomRequest): Promise<ResponseType> {
    return {
      status: HttpStatus.OK,
      message: 'success while retreiving data',
      data: await this.brandService.findByUserId(req.user.userId),
    };
  }

  @Get('getMatchedInfluencers')
  async getMatched(@Req() req: CustomRequest): Promise<ResponseType> {
    const data = await this.brandService.findByFieldName(
      'matched',
      req.user.userId,
    );
    return {
      status: HttpStatus.OK,
      message: 'success while retreiving data',
      data,
    };
  }

  @Get('getReceivedRequest')
  async getReceivedRequest(@Req() req: CustomRequest): Promise<ResponseType> {
    const data = await this.brandService.findByFieldName(
      'receivedRequest',
      req.user.userId,
    );
    return {
      status: HttpStatus.OK,
      message: 'success while retreiving data',
      data,
    };
  }

  @Get('getSentRequest')
  async getSentRequest(@Req() req: CustomRequest): Promise<ResponseType> {
    const data = await this.brandService.findByFieldName(
      'sentRequest',
      req.user.userId,
    );
    return {
      status: HttpStatus.OK,
      message: 'success while retreiving data',
      data,
    };
  }

  @Patch('update')
  async updateByUserId(
    @Req() req: CustomRequest,
    @Body() body: BrandDto,
  ): Promise<ResponseType> {
    return {
      status: HttpStatus.OK,
      message: 'success while updating data',
      data: await this.brandService.updateByUserId(req.user.userId, body),
    };
  }

  @Delete('delete')
  async deleteByUserId(@Req() req: CustomRequest): Promise<ResponseType> {
    return {
      status: HttpStatus.OK,
      message: 'success while deleting data',
      data: await this.brandService.deleteByUserId(req.user.userId),
    };
  }
}
