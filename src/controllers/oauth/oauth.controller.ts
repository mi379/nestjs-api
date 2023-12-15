
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
  
  @Get('authorize/google/callback')
  
   async authorizeGoogleCallback(): Promise<any> {
     var oauth2Client: OAuth2Client = new OAuth2Client(
       process.env.CLIENT_ID,
       process.env.CLIENT_SECRET,
       process.env.REDIRECT
     )
    
     var code = '4%2F0AfJohXl8MifwKzPM_4Jx-QJVBHlSG-MweVcYsugquAY2wNrlc52f6kJRUCO8OPt3qkhkDw'
     var token = await oauth2Client.getToken(code as string)
     
     
     return token
   }
}
