import { Server, Socket } from 'socket.io'

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

  @SubscribeMessage('typingTrue') 
 
  typingTrue(client:Socket,_id:string){
    this.server.emit(
      'typingTrue', 
      _id
    ) 
  }

  @SubscribeMessage('typingFalse') 
  
  typingFalse(client:Socket,_id:string){
    this.server.emit(
      'typingFalse', 
      _id
    ) 
  }
  
  onSuccessSend<New>(document:New){
    this.server.emit(
      'newMessage',
      document
    )
  }
  
  isFirstMessage<Message>(message:Message){
    this.server.emit(
      'isFirstMessage', 
      message
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

interface Message {
  _id:string, 
  sender:string, 
  accept:string, 
  groupId:string, 
  value:string, 
  read:boolean, 
  contentType:string, 
  description?:string
}
