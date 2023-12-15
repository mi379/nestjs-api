
import { OAuth2Client } from 'google-auth-library'
import { Controller,Get,Query } from '@nestjs/common';


@Controller('oauth') 
  
export class OauthController {
  
  redirect:string = 'https://nestjs-api-production-f720.up.railway.app/oauth/authorize/google/callback'
  infoUrl:string = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json'
  
  oAuth2Client:OAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID, 
    process.env.CLIENT_SECRET, 
    this.redirect
  )

  @Get('authorize/google') 
  
  authorizeWithGoogle():string{
    var googleApi:string = 'https://www.googleapis.com'
    var profile:string = `${googleApi}/auth/userinfo.profile`
    var email:string = `${googleApi}/auth/userinfo.email`
    
    return this.oauth2Client.generateAuthUrl({
      access_type:'offline',
      scope:[email,profile]
    });
  }
  
  
  @Get('authorize/google/callback')
  
   async googleAuthorizationCallback(@Query('code') code:string): Promise<any> {
     var {tokens}:{tokens:string} = await this.oauth2Client.getToken(code)
     
     var credential = this.oAuth2Client.setCredentials(tokens)
     
     var info = await this.oauth2Client.request({url:this.infoUrl})
     
     return info
   }
}

