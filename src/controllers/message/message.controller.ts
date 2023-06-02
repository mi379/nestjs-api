import { 
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  InternalServerErrorException, 
  Body
} from '@nestjs/common';

import { AuthGuard } from '../../auth.guard'
import { Types } from 'mongoose'
import { MessageDto } from '../../dto/message.dto'
import { MessageService,Messages,Last } from '../../services/message/message.service'



@Controller('message') 

export class MessageController {

  @Get('all/:_id') @UseGuards(AuthGuard)
  
  async getAllMessage(@Request() req,@Param('_id') _id:string):Promise<Messages>{
    if(!Types.ObjectId.isValid(req.user._id) || !Types.ObjectId.isValid(_id)){
      throw new InternalServerErrorException()
    }

    let [user,otherUser] = [req.user._id,_id].map((user) => {
      return new Types.ObjectId(user)
    })

    return await this.messageService.getAllMessage<Criteria>(
      [
        {
          sender: user,
          accept: otherUser
        },
        {
          sender:otherUser,
          accept:user
        }
      ]
    )
  }

  @Get('recently') @UseGuards(AuthGuard)

  async GetRecentlyMessage(@Request() request):Promise<Last[]>{ 	
    if(!Types.ObjectId.isValid(request.user._id)){
      throw new InternalServerErrorException()
    }

    return await this.messageService.getRecently<C1,C2>([
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
    ])
  }

  @Post('new') @UseGuards(AuthGuard)

  sendMessage(@Body() dto:MessageDto):MessageDto{
    return dto
  }
  

  constructor(private messageService:MessageService){}
}

// parameter criteria to get all recently message

type C1 = Pick<Criteria,"sender">
type C2 = Pick<Criteria,"accept">

// parameter criteria to get all message between two user 

interface Criteria{
  sender:Types.ObjectId,
  accept:Types.ObjectId
}

