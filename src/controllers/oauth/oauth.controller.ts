
import { OAuth2Client,Credentials } from 'google-auth-library'
import { Controller,Get,Query } from '@nestjs/common';


@Controller('oauth') 
  
export class OauthController {
                    
  infoUrl:string = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json'
  
  oAuth2Client:OAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID, 
    process.env.CLIENT_SECRET, 
    process.env.REDIRECT
  )

  @Get('google') 
  
  authWithGoogle():string{
    var googleApi:string = 'https://www.googleapis.com'
    var profile:string = `${googleApi}/auth/userinfo.profile`
    var email:string = `${googleApi}/auth/userinfo.email`
    
    return this.oAuth2Client.generateAuthUrl({
      access_type:'offline',
      scope:[email,profile]
    });
  }
  
  
  @Get('google/callback')
  
   async googleAuthCallback(@Query('code') code:string):Promise<Data>{
     var {tokens}:GetToken = await this.oAuth2Client.getToken(code)
     
     var credential = this.oAuth2Client.setCredentials(tokens)
     
     var {data}:{data:Data} = await this.oAuth2Client.request({
       url:this.infoUrl
     })
     
     return {
       id:data.id, 
       email:data.email, 
       given_name:data.given_name, 
       family_name:data.family_name, 
       picture:data.picture
     }
   }
}

inteface GetToken{
  tokens:Credential
}
                            
interface Data{
  id:string, 
  email:string, 
  given_name:string, 
  family_name:string, 
  picture:string
}
