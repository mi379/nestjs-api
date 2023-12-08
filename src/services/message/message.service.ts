import { Model,Types,Document } from 'mongoose'
import { ReadDto } from '../../dto/read.dto'
import { Injectable } from '@nestjs/common';
import { Profile } from '../../schemas/profile.schema'
import { MessageSchema } from '../../schemas/message.schema'
import { InjectModel } from '@nestjs/mongoose'


@Injectable() export class MessageService {

  constructor(@InjectModel('Message') private message: Model<MessageSchema>){}


  async getAll<Filter>($or:[Filter,Filter]):Promise<Doc[]>{
    return this.message.aggregate([
      {$match:{
        $or
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
        sender:{$last:'$sender'}, 
        value:{$last:'$value'},
        groupId:{$last:'$groupId'}, 
        accept:{$last:'$accept'},
        sendAt:{$last:'$sendAt'}, 
        read:{$last:'$read'}, 
        contentType:{$last:'$contentType'}, 
        description:{$last:'$description'}, 
        unreadCounter:{
          $sum:{
            $cond:{
              if:{
                $eq:[
                  '$read', 
                  false
                ]
              }, 
              then:1, 
              else:0
            }
          }
        }
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
        _id:0, 
        sender:{
          _id:0
        },
        accept:{
          _id:0
        }
      }}
    ])
  }
  
  /*
  getById(_id:Types.ObjectId):Promise<any>{
    return this.message.aggregate([
      {$match:{
        _id
      }}, 
      {$lookup:{
        from:'profiles', 
        as:"sender", 
        localField:"sender", 
        foreignField:"usersRef", 
      }}, 
      {$lookup:{
        from:'profiles', 
        as:"accept", 
        localField:"accept", 
        foreignField:"usersRef", 
      }},
      {$unwind:{
        path:"$sender"
      }}, 
      {$unwind:{
        path:"$accept"
      }}
    ])
  }
  */

  async newMessage(message:New):Promise<New>{    
    return new this.message(message).save()
  }

  async updateReadStatus(_id:Types.ObjectId,opts:Omit<ReadDto,"_id">):Promise<Created>{
    return this.message.findByIdAndUpdate(
      _id,opts
    )
  }
}

export type Created = Document<unknown,{},MessageSchema> & Ext

type Ext = Omit<MessageSchema & {_id:Types.ObjectId},never>

// return type of fetch recently message

export type Last = Pick<MessageSchema,"read"|"value"|"groupId"|"contentType"|"description"> & {
  _id:Types.ObjectId,
  sender:Omit<Profile,"_id">,
  accept:Omit<Profile,"_id">,
}

// send new message result type

export type Doc = MessageSchema & {
  _id:Types.ObjectId,
}

// type of send new message object

export interface New{
  groupId:Types.ObjectId,
  sender:Types.ObjectId,
  accept:Types.ObjectId,
  read:boolean,
  sendAt:number,
  value:string,
  contentType:string,
  description:string
}

