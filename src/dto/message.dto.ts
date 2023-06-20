import { IsNotEmpty } from "class-validator";

export class MessageDto{
  @IsNotEmpty() accept:string
  @IsNotEmpty() value:string
  @IsNotEmpty() groupId:string
  @IsNotEmpty() sendAt:number
  @IsNotEmpty() read:boolean
  @IsNotEmpty() contentType:string
  description:string
}