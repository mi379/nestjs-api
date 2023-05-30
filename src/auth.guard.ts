
import { CanActivate,ExecutionContext,Injectable,UnauthorizedException} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable() export class AuthGuard implements CanActivate {

  async canActivate(context: ExecutionContext):Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    const exception = new UnauthorizedException()
    const secret = process.env.JWT_SECRET_KEY

    const token = this.extractTokenFromHeader(
      request.headers?.authorization
    )

    if(!token){
      throw exception
    }

    try{
      request['user'] = await this.jwt.verifyAsync(
        token as string,{
          secret
        }
      )
    }
    catch{
      throw exception
    }

    return true

    
  }

  extractTokenFromHeader(token:string|undefined):string|undefined{
    if(!token){
      return undefined
    }

    const [,Token] = (token as string).split(' ')

    return Token
  }

  constructor(
  	private jwt: JwtService
  ){}

}
