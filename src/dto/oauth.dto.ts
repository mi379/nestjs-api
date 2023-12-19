import { IsNotEmpty } from 'class-validator'

export class OauthDto{
  @IsNotEmpty() oauthReference:string
  
  @IsNotEmpty() profileImage:string
  
  @IsNotEmpty() firstName:string

  @IsNotEmpty() surname : string
}
