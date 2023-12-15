
import { OAuth2Client } from 'google-auth-library'
import { Controller,Get,Query } from '@nestjs/common';


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
      'https://nestjs-api-production-f720.up.railway.app/oauth/authorize/google/callback'
    )
   
    return oauth2Client.generateAuthUrl({
      access_type:'offline',
      scope:[email,profile]
    });
  }
  
  @Get('authorize/google/callback')
  
   async authorizeGoogleCallback(@Query('code') code:string): Promise<any> {
     var oauth2Client: OAuth2Client = new OAuth2Client(
       process.env.CLIENT_ID,
       process.env.CLIENT_SECRET,
       'https://nestjs-api-production-f720.up.railway.app/oauth/authorize/google/callback'
     )
     
     var x = 'https://people.googleapis.com/v1/people/me?personFields=names'
     
     var authenticated = await oauth2Client.getToken(code)
     
     oauth2Client.setCredentials(authenticated.tokens)
     
     var name = await oauth2Client.request({url:x})
     
     return name
    
     
   }
}
