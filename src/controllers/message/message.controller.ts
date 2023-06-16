import { 
  Controller,
  Get,
  Put,
  Post,
  UseGuards,
  Request,
  Param,
  InternalServerErrorException, 
  Body,
  Logger
} from '@nestjs/common';


import { Types } from 'mongoose'
import { AuthGuard } from '../../auth.guard'
import { ReadDto } from '../../dto/read.dto'
import { MessageDto } from '../../dto/message.dto'
import { EventsGateway } from '../../gateways/events/events.gateway'
import { Doc } from '../../services/message/message.service'
import { MessageService,Last,Created } from '../../services/message/message.service'



@Controller('message') 

export class MessageController {

  @Get('all/:_id') @UseGuards(AuthGuard)
  
  async getAllMessage(@Request() req:Request,@Param('_id') _id:string):Promise<Doc[]>{
    if(!Types.ObjectId.isValid(req.user._id) || !Types.ObjectId.isValid(_id)){
      throw new InternalServerErrorException()
    }

    let [user,otherUser]:Types.ObjectId[] = [req.user._id,_id].map(user => {
      return new Types.ObjectId(user)
    })

    try{
      return await this.message.getAllMessage<Criteria>(
        [
          {
            sender: user,
            accept: otherUser,
          },
          {
            sender:otherUser,
            accept:user,
          } 
        ]
      )
    }
    catch(error:any){
      new Logger('ERROR').error(error.message)
      throw new InternalServerErrorException()
    }
  }

  @Get('recently') @UseGuards(AuthGuard)

  async GetRecentlyMessage(@Request() request:Request):Promise<Last[]>{ 	
    if(!Types.ObjectId.isValid(request.user._id)){
      throw new InternalServerErrorException()
    }

    try{
      return await this.message.getRecently<C1,C2>(
        [
          {
            sender:new Types.ObjectId(
              request.user._id
            )
          },
          {
            accept:new Types.ObjectId(
              request.user._id
            )
          }
        ]
      )
    }
    catch(error:any){
      new Logger('ERROR').error(error.message)
      throw new InternalServerErrorException()
    }
  }

  @Post('new') @UseGuards(AuthGuard)

  async createNewMessage(@Body() dto:MessageDto,@Request() request:Request):Promise<Created>{    
    if(!Types.ObjectId.isValid(request.user._id) || !Types.ObjectId.isValid(dto.accept)){
      console.log('invalid credential...... ')
      throw new InternalServerErrorException()
    }

    if(!Types.ObjectId.isValid(dto.groupId)) throw new InternalServerErrorException()

    var params:[string,string,string] = [request.user._id,dto.accept,dto.groupId]

    let [sender,accept,groupId]:Types.ObjectId[] = params.map(
      _id => new Types.ObjectId(
        _id
      )
    )
    
    try{
      var result:Created = await this.message.create({
        ...dto,
        groupId,
        sender,
        accept
      })

      this.gateway.onSuccessSend(
        result
      )

      return result
    }
    catch(error:any){
      new Logger('ERROR').error(error.message)
      throw new InternalServerErrorException()
    }
  }
  
  @Put('new') @UseGuards(AuthGuard)

  async updateReadStatus(@Body() dto:ReadDto):Promise<void>{
    var {_id,...options}:ReadDto = dto

    if(!Types.ObjectId.isValid(dto._id)){
      throw new InternalServerErrorException()
    }

    var [__id] : Types.ObjectId[] = [_id].map(
      el => new Types.ObjectId(
        el
      )
    ) 
    
    try{
      await this.message.updateReadStatus(
        __id,options
      )

      this.gateway.onReadByOther(
        _id
      )
    }
    catch(error:any){
      new Logger('ERROR').error(error.message)
      throw new InternalServerErrorException()
    }
  }

  constructor(
    private message:MessageService,
    private gateway:EventsGateway<Created>
  ){}
}

// parameter criteria to get all recently message

type C1 = Pick<Criteria,"sender">
type C2 = Pick<Criteria,"accept">

// parameter criteria to get all message between two user 

interface Criteria{
  sender:Types.ObjectId,
  accept:Types.ObjectId
}

interface Request{
  user:{
    _id:string
  }
}