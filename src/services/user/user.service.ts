import { Types,Model,Aggregate } from 'mongoose'
import { LoginDto } from '../../dto/login.dto'
import { Injectable } from '@nestjs/common';
import { Profile } from '../../schemas/profile.schema'
import { User } from '../../schemas/user.schema'
import { InjectModel } from '@nestjs/mongoose'
import { JwtService } from '@nestjs/jwt';


@Injectable() export class UserService {

  constructor(
    @InjectModel('User') private user: Model<User>, 
    @InjectModel('Profile') private profile : Model<Profile>
  ){}


  login(body:LoginDto):Aggregate<Detail[]>{
    return this.user.aggregate([
      {$match:{
      	...body,
      }},
      {$lookup:{
        from:"profiles",
        localField:"_id",
        foreignField:"usersRef",
        as:"profile",
      }},
      {$unwind:{
        path:"$profile",
      }},
      {$project:{
        username:0,
        password:0,
        profile:{
          _id:0,
          usersRef:0
        }
      }}
    ])
  }

  search(user:Types.ObjectId,v:string):Aggregate<any[]>{
    return this.profile.aggregate([
      {$match:{
        firstName:{
          $regex: new RegExp(
            `^${v}`, "i"
          )
        }, 
        usersRef:{
          $ne:user
        }
      }},
      {$lookup:{
        as:"send", 
        from:"messages",
        localField:"usersRef", 
        foreignField:"sender"
      }},
      {$lookup:{
        as:"accept", 
        from:"messages",
        localField:"usersRef", 
        foreignField:"accept"
      }}, 
      {$addFields:{
        messages:{
          $concatArrays:[
            "$send", 
            "$accept"
          ]
        }
      }},
      {$project:{
        send:0, 
        accept:0
      }}, 
      {$addFields:{
        messages:{
          $filter:{
            as:"messages", 
            input:"$messages", 
            cond:{
              $or:[
                {$and:[
                  {$eq:[
                    "$$messages.sender", 
                    user
                  ]}, 
                  {$eq:[
                    "$$messages.accept", 
                    "$usersRef"
                  ]}
                ]}, 
                {$and:[
                  {$eq:[
                    "$$messages.sender", 
                    "$usersRef"
                  ]}, 
                  {$eq:[
                    "$$messages.accept", 
                    user
                  ]}
                ]}
              ]
            }
          }
        }
      }}, 
      {$addFields:{
        unreadCounter: {
          $size:{
            $filter:{
              input: "$messages",
              cond: { $eq: ["$$this.read", false] }
            }
          }
        }
      }}, 
      {$addFields:{
        message:{
          $max:"$messages"
        }
      }}, 
      {$project:{
        messages:0
      }}
    ])
  }

  findByOauthReference(id:string):Aggregate<Detail[]>{
    return this.user.aggregate([
      {$match:{
        oauthReference:id
      }}, 
      {$lookup:{
        from:"profiles",
        localField:"_id",
        foreignField:"usersRef",
        as:"profile",
      }},
      {$unwind:{
        path:"$profile",
      }},
      {$project:{
        oauthReference:0,
        profile:{
          _id:0,
          usersRef:0
        }
      }}
    ])
  }
  
  async newUserByGoogleAuth(newAccount:Oauth):Promise<User>{
    return new this.user(newAccount).save() 
  }
}


export type Detail = Pick<User,"_id"> & {
  profile:Omit<Profile,"_id"|"usersRef">
}

interface Oauth{
  _id:Types.ObjectId
  oauthReference:string
}
