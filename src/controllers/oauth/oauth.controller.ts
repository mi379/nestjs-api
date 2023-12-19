import { Types } from 'mongoose'
import { OauthDto } from  '../../dto/oauth.dto'
import { Response,Token } from '../user/user.controller'
import { Profile } from '../../schemas/profile.schema'
import { User } from '../../schemas/user.schema'
import { OAuth2Client,Credentials } from 'google-auth-library'
import { Controller,Get,Query,Post,Body } from '@nestjs/common';
import { ProfileService } from '../../services/profile/profile.service'
import { UserService,Detail } from '../../services/user/user.service'
import { CommonService } from '../../services/common/common.service';


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
  
   async googleAuthCallback(@Query('code') code:string):Promise<Response>{
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
         var token = await this.commonSvc.getToken<Token>({
           _id:isExist._id
         })

         return {
           authorization:token, 
           ...isExist
         }
       }
       else{
         var user:User = await this.userSvc.newUserByGoogleAuth({
           _id:new Types.ObjectId(), 
           oauthReference:data.id
         }) 

         var profile:Profile = await this.profileSvc.newProfile({
           _id:user._id, 
           firstName:data.name.split(" ")[0], 
           surname:data.name.split(" ")[1], 
           profileImage:data.picture, 
           usersRef:user._id
         })   

         var {_doc}:Document = profile as unknown as Document

         var {_id,usersRef,...r}:Profile = _doc
        
         let token = await this.commonSvc.getToken<Token>({
           _id:user._id
         })

         return {
           authorization:token, 
           _id:user._id, 
           profile:r
         }   
       }
     }
     catch(err:any){
       console.log(err) 
     }
   }

   @Post('facebook') async fbOAuth(@Body() dto:OauthDto):Promise<Response>{
     try{
       var [isExist] = await this.userSvc.findByOauthReference(
         dto.oauthReference
       ) 

       if(isExist){
         var token = await this.commonSvc.getToken<Token>({
           _id:isExist._id
         })

         return {
           authorization:token, 
           ...isExist
         }
       }
       else{
         var user:User = await this.userSvc.newUserByGoogleAuth({
           _id:new Types.ObjectId(), 
           oauthReference:dto.oauthReference
         }) 

         var profile:Profile = await this.profileSvc.newProfile({
           _id:user._id, 
           firstName:dto.firstName, 
           surname:dto.surname, 
           profileImage:dto.profileImage, 
           usersRef:user._id
        })
        var {_doc}:Document = profile as unknown as Document

        var {_id,usersRef,...r}:Profile = _doc
        
        let token = await this.commonSvc.getToken<Token>({
          _id:user._id
        })

        return {
          authorization:token, 
          _id:user._id, 
          profile:r
        }
     }
     catch(error:any){
       console.log(
         error
       ) 
     }
   }

     
   
   constructor(
     private userSvc:UserService,
     private profileSvc:ProfileService, 
     private commonSvc:CommonService
   ){}
}

interface R<T>{
  tokens:T
}
                            
interface Data{
  id:string, 
  email:string, 
  name:string, 
  picture:string
}

interface Document {
  _doc:Profile
}
