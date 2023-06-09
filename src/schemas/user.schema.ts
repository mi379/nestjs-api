import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose'

@Schema() export class User{
  @Prop()
  _id:Types.ObjectId
  
  @Prop() 
  username:string
 
  @Prop() 
  password:string
}


