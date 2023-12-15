
import { OAuth2Client } from 'google-auth-library'
import { Controller,Get } from '@nestjs/common';


@Controller('oauth') 
export class UserController {
  @Get('authorize/google') authorizeGoogle():string{
    return 'url'
  }
}
