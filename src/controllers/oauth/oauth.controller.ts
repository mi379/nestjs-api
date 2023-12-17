import { User } from '../../schema/user.schema'
import { OAuth2Client,Credentials } from 'google-auth-library'
import { Controller,Get,Query } from '@nestjs/common';
import { UserService,Detail } from '../../services/user/user.service'


@Controller('oauth') 
  
export class OauthController {
                    
  infoUrl:string = 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json'
  
  oAuth2Client:OAuth2Client = new OAuth2Client(
    process.env.CLIENT_ID, 
    process.env.CLIENT_SECRET, 
    'https://nestjs-api-production-f720.up.railway.app/oauth/google/callback'
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
  
   async googleAuthCallback(@Query('code') code:string):Promise<any>{
     var {tokens}:R<Credentials>= await this.oAuth2Client.getToken(
       code
     )
     
     var credential = this.oAuth2Client.setCredentials(tokens)
     
     try{
       var {data}:{data:Data} = await this.oAuth2Client.request({
         url: this.infoUrl
       })
       
       var [isExist] = await this.userSvc.findByOauthReference(
         data.id
       )
       
       if(isExist){
         console.log({
           isExist
         })
       }
       else{
         
         
       }
     }
     catch{
       
     }
     
     return 'x'
   }
   
   constructor(
     private userSvc:UserService
   ){}
}

interface R<T>{
  tokens:T
}
                            
interface Data{
  id:string, 
  email:string, 
  given_name:string, 
  family_name:string, 
  picture:string
}
