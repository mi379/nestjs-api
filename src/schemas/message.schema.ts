import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose' 

@Schema() export class Message{
  @Prop() _id:Types.ObjectId
  @Prop() sender:Types.ObjectId
  @Prop() value:string
  @Prop() groupId:Types.ObjectId
  @Prop() accept:Types.ObjectId
}