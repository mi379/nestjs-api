
import { OAuth2Client } from 'google-auth-library'
import { Controller,Get } from '@nestjs/common';


@Controller('oauth') 
  
export class OauthController {

  @Get('authorize/google') 
  
  authorizeWithGoogle():string{
    var googleApi:string = 'https://www.googleapis.com'
    var profile:string = `${googleApi}/auth/userinfo.profile`
    var email:string = `${googleApi}/auth/userinfo.email`
   
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
