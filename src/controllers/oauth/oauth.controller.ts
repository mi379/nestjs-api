
import { OAuth2Client } from 'google-auth-library'
import { Controller,Get } from '@nestjs/common';


@Controller('oauth') 
  
export class OauthController {

  @Get('authorize/google') 
  
  authorizeWithGoogle():string{
    var authApi:string = 'https://googleapis.com/auth'
    var email:string   = `${authApi}/userinfo.email`
    var profile:string = `${apiUrl}/userinfo.profile`
    
    var oauth2Client:OAuth2Client = new OAuth2Client(
      process.env.CLIENT_ID, 
      process.env.CLIENT_SECRET, 
      process.env.REDIRECT
    )
   
    return oauth2Client.generateAuthUrl({
      access_type:'offline',
      scope:[email,profile]
    });
  }
}
