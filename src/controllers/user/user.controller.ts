import { Controller,Get,Post,Body,HttpException,Header } from '@nestjs/common';
import { UserService,Detail } from '../../services/user/user.service'
import { CommonService } from '../../services/common/common.service';
import { LoginDto } from '../../dto/login.dto'
import { User } from '../../schemas/user.schema'
import { Types } from 'mongoose'



@Controller('user') 

export class UserController {

  @Post('login') @Header('Access-Control-Allow-Origin', '*')

  async login(@Body() dto:LoginDto):Promise<Headers & Detail>{

    let [result] = await this.user.login(dto) 

    let token = await this.common.getToken<Token>({
      _id:result?._id
    })

    if(!result){
      throw new HttpException(
        'user not found',
        404
      )
    }
 
    return {
      authorization:token,
      ...result
    }
  }

  @Get('hello')

  responseWithHello():string{
    return 'hello world'
  }

  constructor(
    private user:UserService,
    private common:CommonService
  ){}

}

type Response = Headers & Detail

interface Headers{
  authorization:string
}

interface Token{
  _id:Types.ObjectId | undefined
}

