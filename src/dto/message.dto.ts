import { IsNotEmpty } from "class-validator";

export class MessageDto{
  @IsNotEmpty() _id:string
  @IsNotEmpty() accept:string
  @IsNotEmpty() value:string
  @IsNotEmpty() groupId:string
}