import { Injectable } from '@nestjs/common';
import { GetTokenResponse } from 'google-auth-library/build/src/auth/oauth2client';
import { google } from 'googleapis';
import { OAuth2Client } from 'googleapis-common';
import * as WebCredentials from './client_secret.json';
const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];

Injectable();
export class YoutubeProvider {
  web_Oauth2Client: OAuth2Client;
  constructor() {
    const OAuth2 = google.auth.OAuth2;

    //    For WebBrowsers
    const clientSecret = WebCredentials.web.client_secret;
    const clientId = WebCredentials.web.client_id;
    const redirectUrl = WebCredentials.web.redirect_uris[0];
    const web_Oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    this.web_Oauth2Client = web_Oauth2Client;
  }

  webAuthorization(): string {
    const authUrl = this.web_Oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    return authUrl;
  }

  async getAccessToken(authorizationCode: string): Promise<GetTokenResponse> {
    const token = await this.web_Oauth2Client.getToken(authorizationCode);
    this.web_Oauth2Client.setCredentials(token.tokens);
    return token;
  }

  async getChannel(access_token: string) {
    const service = google.youtube('v3');
    google.options({ auth: this.web_Oauth2Client });

    const channelData = await service.channels.list({
      mySubscribers: true,
      access_token,
      part: ['statistics'],
    });

    return channelData?.data;
  }
}
