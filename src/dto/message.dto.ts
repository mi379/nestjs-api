import { IsNotEmpty } from "class-validator";

export class MessageDto{
  @IsNotEmpty() accept:string
  @IsNotEmpty() value:string
  @IsNotEmpty() groupId:string
}