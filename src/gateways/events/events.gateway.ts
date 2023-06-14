
import { Socket,Server } from 'socket.io'

import { 
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  WebSocketGateway,
  MessageBody
} from '@nestjs/websockets';

@WebSocketGateway({ 
  cors:{
    origin:'*'
  }
})

export class EventsGateway<Type> implements OnGatewayConnection {
  @WebSocketServer() server:Server
  
  onSuccessSend(document:Type){
    this.server.emit(
      'newMessage',
      document
    )
  }

  handleConnection(){
    // console.log('connected to a client')
  }
}
