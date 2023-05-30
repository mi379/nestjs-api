import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose' 

@Schema() export class Profile{
  @Prop() _id:Types.ObjectId
  @Prop() profileImage:string
  @Prop() surname:string
  @Prop() firstName:string
  @Prop() usersRef:Types.ObjectId
}