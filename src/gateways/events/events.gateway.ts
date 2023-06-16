import { Server } from 'socket.io'

import { 
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  WebSocketGateway,
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

  onReadByOther(_id:string){
    
    this.server.emit(
      'read',
      _id
    )

  }

  handleConnection(){
    // console.log('connected to a client')
  }
}
