import { Model,Types,Aggregate,Document } from 'mongoose'
import { Injectable } from '@nestjs/common';
import { Profile } from '../../schemas/profile.schema'
import { MessageSchema } from '../../schemas/message.schema'
import { InjectModel } from '@nestjs/mongoose'


@Injectable() export class MessageService {

  constructor(@InjectModel('Message') private message: Model<MessageSchema>){}

  getAllMessage<Filter>($or:[Filter,Filter]):Aggregate<Doc[]>{
    return this.message.aggregate([
      {$match:{
        $or
      }},
    ])
  }

  getRecently<T1,T2>($or:[T1,T2]):Aggregate<Last[]>{
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
        sender:{
          _id:0
        },
        accept:{
          _id:0
        }
      }}
    ])
  }

  create(params:New):Promise<Created>{    
    return new this.message({
      ...params
    })
    .save()
  }
}

export type Created = Document<unknown,{},MessageSchema> & Ext

type Ext = Omit<MessageSchema & {_id:Types.ObjectId},never>

// return type of fetch recently message

export type Last = Pick<MessageSchema,"value"|"groupId"> & {
  _id:Types.ObjectId,
  sender:Omit<Profile,"_id">,
  accept:Omit<Profile,"_id">,
}

// send new message result type

export type Doc = MessageSchema & {
  _id:Types.ObjectId,
}

// type of send new message object

interface New{
  groupId:Types.ObjectId,
  sender:Types.ObjectId,
  accept:Types.ObjectId,
  sendAt:number,
  value:string,
}