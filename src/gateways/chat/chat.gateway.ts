import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()

export class ChatGateway {
  
  @WebSocketServer() server: Server;

  @SubscribeMessage('message') handleMessage(client: any, payload: any){
    console.log(payload)
  }
  
}
