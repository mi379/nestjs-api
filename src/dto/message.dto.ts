import { IsNotEmpty } from "class-validator";

export class MessageDto{
  @IsNotEmpty() sender:string
  @IsNotEmpty() accept:string
  @IsNotEmpty() value:string
  @IsNotEmpty() groupId:string
}