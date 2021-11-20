// import {
//   MessageBody,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
//   WsResponse,
// } from '@nestjs/websockets';
// import { from, Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { Server } from 'socket.io';

// @WebSocketGateway(80, { namespace: 'message' })
// export class SocketGateway {
//   @WebSocketServer()
//   server: Server;

//   @SubscribeMessage('events')
//   findAll(@MessageBody() data: any): WsResponse<number> {
//     return {
//       data: 0,
//       event: '',
//     };
//   }

//   @SubscribeMessage('identity')
//   async identity(@MessageBody() data: number): Promise<number> {
//     return data;
//   }
// }
