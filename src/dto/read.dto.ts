import { IsNotEmpty } from "class-validator";

export class ReadDto{
  @IsNotEmpty() _id:string
  @IsNotEmpty() read:boolean
}