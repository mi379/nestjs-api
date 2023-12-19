import { IsNotEmpty } from 'class-validator'

export class LoginDto{
  @IsNotEmpty() oauthReference:string
  
  @IsNotEmpty() profileImage:string
  
  @IsNotEmpty() firstName:string

  @IsNotEmpty() surname : string

  
}
