import { Controller, Param, Post, Patch, Req, Res } from '@nestjs/common';
import { Response } from 'express';
import { ResponseType } from 'src/Interfaces/response.interface';
import { CustomRequest } from 'src/Middlewares/Auth/auth.middleware';
import { SwipeService } from 'src/Services/swipe/swipe.service';

@Controller('action')
export class SwipeController {
  constructor(private readonly swipeService: SwipeService) {}

  @Post('swipe/right/:_id')
  async swipeRight(
    @Param('_id') swipeId: string,
    @Req() req: CustomRequest,
    @Res() res: Response,
  ) {
    try {
      const message = await this.swipeService.swipeRight(req.user, swipeId);
      res.status(201).send({
        status: 201,
        message,
        data: null,
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        message: error.message,
        data: null,
      });
    }
  }

  @Patch('match/:_id')
  async match(
    @Param('_id') matchId: string,
    @Req() req: CustomRequest,
  ): Promise<ResponseType> {
    const matchedUsers = await this.swipeService.match(req.user, matchId);

    return {
      status: 200,
      message: 'Successfully matched users',
      data: {
        matchedUsers,
      },
    };
  }

  @Patch('unMatch/:_id')
  async unMatch(
    @Req() req: CustomRequest,
    @Param('_id') unMatchId: string,
  ): Promise<ResponseType> {
    const matchedUsers = await this.swipeService.unMatch(req.user, unMatchId);
    return {
      status: 200,
      message: 'unmatched successfully',
      data: {
        matchedUsers,
      },
    };
  }

  @Patch('cancelSentRequest/:_id')
  async cancelSentRequest(
    @Param('_id') requestId: string,
    @Req() req: CustomRequest,
  ): Promise<ResponseType> {
    const message = await this.swipeService.cancelSentRequest(
      req.user,
      requestId,
    );
    return {
      status: 200,
      message,
      data: null,
    };
  }

  @Patch('declineReceivedRequest/:_id')
  async declineReceivedRequest(
    @Param('_id') requestId: string,
    @Req() req: CustomRequest,
  ): Promise<ResponseType> {
    const receivedRequest = await this.swipeService.declineReceivedRequest(
      req.user,
      requestId,
    );
    return {
      status: 200,
      message: 'successfully declined request',
      data: {
        receivedRequest,
      },
    };
  }
}
