import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BrandModel } from 'src/Interfaces/brand/brand.interface';
import { InfluencerModel } from 'src/Interfaces/influencer/influencer.interface';
import { Role, User, UserModel } from 'src/Interfaces/user/user.interface';
import { modelName as brandModel } from 'src/Models/brand/brand.schema';
import { modelName as influencerModel } from 'src/Models/influencer/influencer.schema';
import { modelName as userModel } from 'src/Models/user/user.schema';

@Injectable()
export class SwipeService {
  constructor(
    @InjectModel(userModel)
    private readonly userModel: Model<UserModel>,

    @InjectModel(influencerModel)
    private readonly influencerModel: Model<InfluencerModel>,
    @InjectModel(brandModel)
    private readonly brandModel: Model<BrandModel>,
  ) {}

  /*--------------------Swipe Right--------------------- */

  async swipeRight(loggedInUser: User, swipedId: string): Promise<String> {
    const swipedUser = await this.userModel.findById(swipedId, { role: 1 });
    if (!swipedUser) throw new HttpException('user not found', 404);

    //  If loggedIn User is Influencer
    if (
      loggedInUser.role === Role.INFLUENCER &&
      swipedUser.role === Role.BRAND
    ) {
      const loggedInInfluencer = await this.influencerModel.findOne({
        userId: loggedInUser.userId,
      });

      const swipedBrand = await this.brandModel.findById(swipedId);

      if (!(loggedInInfluencer && swipedBrand))
        throw new HttpException('User not found', 404);

      const matchIndex = loggedInInfluencer.matched.findIndex(
        (data) => data._id?.toString() === swipedId,
      );
      if (matchIndex >= 0)
        throw new HttpException('Users Already matched', 500);

      const requestIndex = loggedInInfluencer.requestSent.findIndex(
        (data) => data._id?.toString() === swipedId,
      );

      if (requestIndex >= 0)
        throw new HttpException(
          `Request already sent ${swipedBrand.businessName}`,
          500,
        );

      loggedInInfluencer.requestSent.push(swipedBrand);
      await loggedInInfluencer.save();

      swipedBrand.requestReceived.push(loggedInInfluencer);
      await swipedBrand.save();
      return `Request sent to ${swipedBrand.businessName}`;
    }

    //  If loggedIn User is Brand

    if (
      loggedInUser.role === Role.BRAND &&
      swipedUser.role === Role.INFLUENCER
    ) {
      const loggedInBrand = await this.brandModel.findOne({
        userId: loggedInUser.userId,
      });

      const swipedInfluencer = await this.influencerModel.findById(swipedId);

      if (!(loggedInBrand && swipedInfluencer))
        throw new HttpException('user not found', 404);

      const matchIndex = loggedInBrand.matched.findIndex(
        (data) => data._id?.toString() === swipedId,
      );

      if (matchIndex >= 0)
        throw new HttpException('Users Already matched', 500);
      const requestIndex = loggedInBrand.requestSent.findIndex(
        (data) => data._id?.toString() === swipedId,
      );

      if (requestIndex >= 0)
        throw new HttpException(
          `Request already sent ${swipedInfluencer.userName}`,
          500,
        );

      loggedInBrand.requestSent.push(swipedInfluencer);
      await loggedInBrand.save();

      swipedInfluencer.requestReceived.push(loggedInBrand);
      await swipedInfluencer.save();

      return `Request sent to ${swipedInfluencer.userName}`;
    }

    throw new HttpException('request denied', 500);
  }

  /*--------------------Match Users--------------------- */

  async match(loggedInUser: User, matchId: string) {
    const matchedUser = await this.userModel.findById(matchId, { role: 1 });
    if (!matchedUser) throw new HttpException('user not found', 404);

    //  If loggedIn User is Influencer

    if (
      loggedInUser.role === Role.INFLUENCER &&
      matchedUser.role === Role.BRAND
    ) {
      const loggedInInfluencer = await this.influencerModel.findOne({
        userId: loggedInUser.userId,
      });
      const matchedBrand = await this.brandModel.findById(matchId);

      if (!(loggedInInfluencer && matchedBrand))
        throw new HttpException('user not found', 404);

      const matchIndex = loggedInInfluencer.matched.findIndex(
        (data) => data._id?.toString() === matchId,
      );

      if (matchIndex >= 0)
        throw new HttpException('Users Already matched', 500);

      const receivedIndex = loggedInInfluencer.requestReceived.findIndex(
        (data) => data._id?.toString() === matchId,
      );

      const sentIndex = matchedBrand.requestSent.findIndex(
        (data) => data._id?.toString() === matchId,
      );

      if (receivedIndex < 0 || sentIndex < 0)
        throw new HttpException('wrong user id', 500);

      loggedInInfluencer.matched = [
        ...loggedInInfluencer.matched,
        ...loggedInInfluencer.requestReceived.filter(
          (data) => data._id?.toString() === matchId,
        ),
      ];
      loggedInInfluencer.requestReceived =
        loggedInInfluencer.requestReceived.filter(
          (data) => data._id?.toString() !== matchId,
        );

      matchedBrand.matched = [
        ...matchedBrand.matched,
        ...matchedBrand.requestSent.filter(
          (data) => data._id?.toString() === matchId,
        ),
      ];

      matchedBrand.requestSent = matchedBrand.requestSent.filter(
        (data) => data._id?.toString() !== matchId,
      );

      await loggedInInfluencer.save();
      await matchedBrand.save();
      return loggedInInfluencer.matched;
    }

    //  If loggedIn User is Brand

    if (
      loggedInUser.role === Role.BRAND &&
      matchedUser.role === Role.INFLUENCER
    ) {
      const loggedInBrand = await this.brandModel.findOne({
        userId: loggedInUser.userId,
      });

      const matchedInfluencer = await this.influencerModel.findById(matchId);

      if (!(loggedInBrand && matchedInfluencer))
        throw new HttpException('user not found', 404);

      const matchIndex = loggedInBrand.matched.findIndex(
        (data) => data._id?.toString() === matchId,
      );

      if (matchIndex >= 0)
        throw new HttpException('Users Already matched', 500);

      const receivedIndex = loggedInBrand.requestReceived.findIndex(
        (data) => data._id?.toString() === matchId,
      );

      const sentIndex = matchedInfluencer.requestSent.findIndex(
        (data) => data._id?.toString() === matchId,
      );

      if (receivedIndex < 0 || sentIndex < 0)
        throw new HttpException('wrong user id', 500);

      loggedInBrand.matched = [
        ...loggedInBrand.matched,
        ...loggedInBrand.requestReceived.filter(
          (data) => data._id?.toString() === matchId,
        ),
      ];

      loggedInBrand.requestReceived = loggedInBrand.requestReceived.filter(
        (data) => data._id?.toString() !== matchId,
      );

      matchedInfluencer.matched = [
        ...matchedInfluencer.matched,
        ...matchedInfluencer.requestSent.filter(
          (data) => data._id?.toString() === matchId,
        ),
      ];

      matchedInfluencer.requestSent = matchedInfluencer.requestSent.filter(
        (data) => data._id?.toString() !== matchId,
      );

      await loggedInBrand.save();
      await matchedInfluencer.save();
      return loggedInBrand.matched;
    }

    throw new HttpException('request denied', 500);
  }

  /*--------------------Cancel sent Request--------------------- */

  async cancelSentRequest(
    loggedInUser: User,
    requestId: string,
  ): Promise<string> {
    const requestedUser = await this.userModel.findById(requestId, { role: 1 });
    if (!requestedUser) throw new HttpException('user not found', 404);

    //  If loggedIn User is Influencer

    if (
      loggedInUser.role === Role.INFLUENCER &&
      requestedUser.role === Role.BRAND
    ) {
      const loggedInInfluencer = await this.influencerModel.findOne({
        userId: loggedInUser.userId,
      });
      const requestedBrand = await this.brandModel.findById(requestId);

      if (!(loggedInInfluencer && requestedBrand))
        throw new HttpException('user not found', 404);

      const sentIndex = loggedInInfluencer.requestSent.findIndex(
        (data) => data._id?.toString() == requestId,
      );
      if (sentIndex < 0) throw new HttpException('Request was not sent', 400);

      loggedInInfluencer.requestSent = loggedInInfluencer.requestSent.filter(
        (data) => data._id?.toString() !== requestId,
      );
      await loggedInInfluencer.save();

      const receivedIndex = requestedBrand.requestReceived.findIndex(
        (data) => data._id?.toString() === requestId,
      );

      if (receivedIndex < 0)
        throw new HttpException('Request was not received', 400);

      requestedBrand.requestReceived = requestedBrand.requestReceived.filter(
        (data) => data._id?.toString() !== requestId,
      );
      await requestedBrand.save();
      return `cancelled the sent request`;
    }

    //  If loggedIn User is Brand

    if (
      loggedInUser.role === Role.BRAND &&
      requestedUser.role === Role.INFLUENCER
    ) {
      const loggedInBrand = await this.brandModel.findOne({
        userId: loggedInUser.userId,
      });
      const requestedInfluencer = await this.influencerModel.findById(
        requestId,
      );

      if (!(loggedInBrand && requestedInfluencer))
        throw new HttpException('user not found', 404);

      const sentIndex = loggedInBrand.requestSent.findIndex(
        (data) => data._id?.toString() == requestId,
      );
      if (sentIndex < 0) throw new HttpException('Request was not sent', 400);

      loggedInBrand.requestSent = loggedInBrand.requestSent.filter(
        (data) => data._id?.toString() !== requestId,
      );
      await loggedInBrand.save();

      const receivedIndex = requestedInfluencer.requestReceived.findIndex(
        (data) => data._id?.toString() === requestId,
      );

      if (receivedIndex < 0)
        throw new HttpException('Request was not received', 400);

      requestedInfluencer.requestReceived =
        requestedInfluencer.requestReceived.filter(
          (data) => data._id?.toString() !== requestId,
        );
      await requestedInfluencer.save();
      return `cancelled the sent request`;
    }
    throw new HttpException('request denied', 500);
  }

  /*--------------------Decline Received request --------------------*/

  async declineReceivedRequest(loggedInUser: User, requestId: string) {
    const requestedUser = await this.userModel.findById(requestId, { role: 1 });
    if (!requestedUser) throw new HttpException('user not found', 404);

    //  If loggedIn User is Influencer

    if (
      loggedInUser.role === Role.INFLUENCER &&
      requestedUser.role === Role.BRAND
    ) {
      const loggedInInfluencer = await this.influencerModel.findOne({
        userId: loggedInUser.userId,
      });
      if (!loggedInInfluencer) throw new HttpException('user not found', 404);

      const receivedIndex = loggedInInfluencer.requestReceived.findIndex(
        (data) => data._id?.toString() === requestId,
      );
      if (receivedIndex < 0) throw new HttpException('not found', 404);

      loggedInInfluencer.requestReceived =
        loggedInInfluencer.requestReceived.filter(
          (data) => data._id?.toString() !== requestId,
        );
      await loggedInInfluencer.save();

      return loggedInInfluencer.requestReceived;
    }

    //  If loggedIn User is Brand

    if (
      loggedInUser.role === Role.BRAND &&
      requestedUser.role === Role.INFLUENCER
    ) {
      const loggedInBrand = await this.brandModel.findOne({
        userId: loggedInUser.userId,
      });
      if (!loggedInBrand) throw new HttpException('user not found', 404);

      const receivedIndex = loggedInBrand.requestReceived.findIndex(
        (data) => data._id?.toString() === requestId,
      );
      if (receivedIndex < 0) throw new HttpException('not found', 404);

      loggedInBrand.requestReceived = loggedInBrand.requestReceived.filter(
        (data) => data._id?.toString() !== requestId,
      );
      await loggedInBrand.save();

      return loggedInBrand.requestReceived;
    }
  }

  /*--------------------UnMatch User--------------------- */

  async unMatch(loggedInUser: User, unMatchId: string) {
    const unMatchUser = await this.userModel.findById(unMatchId, { role: 1 });
    if (!unMatchUser) throw new HttpException('user not found', 404);

    //  If loggedIn User is Influencer

    if (
      loggedInUser.role === Role.INFLUENCER &&
      unMatchUser.role === Role.BRAND
    ) {
      const loggedInInfluencer = await this.influencerModel.findOne({
        userId: loggedInUser.userId,
      });
      const unMatchBrand = await this.brandModel.findById(unMatchId);

      if (!(loggedInInfluencer && unMatchBrand))
        throw new HttpException('user not found', 404);

      const influencerIndex = loggedInInfluencer.matched.findIndex(
        (data) => data._id?.toString() === unMatchId,
      );
      const brandIndex = unMatchBrand.matched.findIndex(
        (data) => data._id?.toString() === unMatchId,
      );

      if (influencerIndex < 0 || brandIndex < 0)
        throw new HttpException('user not in your matched list', 404);

      loggedInInfluencer.matched = loggedInInfluencer.matched.filter(
        (data) => data._id?.toString() !== unMatchId,
      );
      await loggedInInfluencer.save();

      unMatchBrand.matched = unMatchBrand.matched.filter(
        (data) => data._id?.toString() !== unMatchId,
      );
      await unMatchBrand.save();

      return loggedInInfluencer.matched;
    }

    //  If loggedIn User is Brand

    if (
      loggedInUser.role === Role.BRAND &&
      unMatchUser.role === Role.INFLUENCER
    ) {
      const loggedInBrand = await this.brandModel.findOne({
        userId: loggedInUser.userId,
      });
      const unMatchInfluencer = await this.influencerModel.findById(unMatchId);

      if (!(loggedInBrand && unMatchInfluencer))
        throw new HttpException('user not found', 404);

      const influencerIndex = loggedInBrand.matched.findIndex(
        (data) => data._id?.toString() === unMatchId,
      );
      const brandIndex = unMatchInfluencer.matched.findIndex(
        (data) => data._id?.toString() === unMatchId,
      );

      if (influencerIndex < 0 || brandIndex < 0)
        throw new HttpException('user not in your matched list', 404);

      loggedInBrand.matched = loggedInBrand.matched.filter(
        (data) => data._id?.toString() !== unMatchId,
      );
      await loggedInBrand.save();

      unMatchInfluencer.matched = unMatchInfluencer.matched.filter(
        (data) => data._id?.toString() !== unMatchId,
      );
      await unMatchInfluencer.save();

      return loggedInBrand.matched;
    }
  }
}
