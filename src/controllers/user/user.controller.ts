import { UseGuards,Request,Param,Logger,Controller,Get,Post,Body,HttpException,Header,InternalServerErrorException } from '@nestjs/common';
import { AuthGuard } from '../../auth.guard'
import { UserService,Detail } from '../../services/user/user.service'
import { CommonService } from '../../services/common/common.service';
import { LoginDto } from '../../dto/login.dto'
import { Types } from 'mongoose'



@Controller('user') 

export class UserController {
 

  @Post('login') async login(@Body() dto:LoginDto):Promise<Headers & Detail>{

    try{
      let [result] = await this.user.login(dto)

      let token =  await this.common.getToken<Token>({
        _id:result?._id
      })

       if(!result){
         throw new Error(
           'user not found'
         ) 
       }

      /*if(!result){
        throw new HttpException(
          'user not found...',
          404
        )
      }*/

      return {
        authorization:token,
        ...result
      }
    }
    catch(err:any){
      if(err.message === "user not found"){
        throw new HttpException(
          err.message,404
        ) 
      }
      else{
        new Logger('Error').error(err.message) 
        throw new InternalServerErrorException() 
      }

     
      //console.log(err.message) 
      
      //new Logger('Error').error(err.message)

      //throw new InternalServerErrorException()
    }
  }

  @Get('search/:query') @UseGuards(AuthGuards) 

  async search(@Request() req:Request,@Param('query') query:string):string{
    return req.user._id
  }

  @Get('hello') responseWithHello():string{
    return 'hello'
  }

  constructor(
    private user:UserService,
    private common:CommonService
  ){}

}

function test(v:number):Promise<number>{
  return new Promise((resolve,reject) => {
  	if(v > 10){
  	  resolve(
        10
  	  )
  	}
  	else{
  	  reject(
        "failed"
  	  )
  	}
  })
}

type Response = Headers & Detail

interface Headers{
  authorization:string
}

interface Token{
  _id:Types.ObjectId | undefined
}

