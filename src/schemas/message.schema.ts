import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose' 

@Schema() export class MessageSchema{
  @Prop() sender:Types.ObjectId
  @Prop() value:string
  @Prop() groupId:Types.ObjectId
  @Prop() accept:Types.ObjectId
  @Prop() sendAt:number
  @Prop() read:boolean
}