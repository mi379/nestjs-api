import { Model,Types } from 'mongoose'
import { Injectable } from '@nestjs/common';
import { Profile } from '../../schemas/profile.schema'
import { Message } from '../../schemas/message.schema'
import { InjectModel } from '@nestjs/mongoose'


@Injectable() export class MessageService {

  constructor(@InjectModel('Message') private message: Model<Message>){}

  async getAllMessage<Type>($or:[Type,Type]):Promise<Messages>{
    return this.message.aggregate([
      {$match:{
        $or
      }},
      {$project:{
      	groupId:0,
      }}
    ])
  }

  async getRecently<T1,T2>($or:[T1,T2]):Promise<Last[]>{
    return this.message.aggregate([
      {$match:{
        $or
      }},
      {$group:{
        _id:"$groupId",
        root:{
          $max:"$$ROOT"
        }
      }},
      {$replaceRoot:{
        newRoot:"$root"
      }},
      {$lookup:{
        from:"profiles",
        as:"sender",
        localField:"sender",
        foreignField:"usersRef"
      }},
      {$lookup:{
        from:"profiles",
        as:"accept",
        localField:"accept",
        foreignField:"usersRef"
      }},
      {$unwind:{
        path:"$sender"
      }},
      {$unwind:{
        path:"$accept"
      }},
      {$project:{
        groupId:0,
        sender:{
          _id:0
        },
        accept:{
          _id:0
        }
      }}
    ])
  }

  async create(params:New):Promise<Message>{
    var message = new this.message(params)
    return message.save()
  }
}


export type Messages = Omit<Message,"groupId">[]



export type Last = Pick<Message,"_id"|"value"> & {
  sender:Omit<Profile,"_id">,
  accept:Omit<Profile,"_id">,
}

interface New{
  groupId:number,
  value:string,
  sender:Types.ObjectId,
  accept:Types.ObjectId
}