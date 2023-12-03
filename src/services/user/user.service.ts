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

  // login(body:LoginDto):Promise<Detail[]>{
    
  //   return new Promise(async (resolve,reject) => {
  //     try{
  //       var result = await this.user.aggregate([
  //         {$match:{
  //           ...body,
  //         }},
  //         {$lookup:{
  //           from:"profiles",
  //           localField:"_id",
  //           foreignField:"usersRef",
  //           as:"profile",
  //         }},
  //         {$unwind:{
  //           path:"$profile",
  //         }},
  //         {$project:{
  //           username:0,
  //           password:0,
  //           profile:{
  //             _id:0,
  //             usersRef:0
  //           }
  //         }}
  //       ])
  //       resolve(
  //         result
  //       )
  //     }
  //     catch(err:unknown){
  //       reject(err)
  //     }
  //   })

  // }

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

  search(user:Types.ObjectId,firstName:string):Aggregate<any[]>{
    return this.profile.aggregate([
      {
        $match:{
          firstName
        }
      },
      {
        $lookup:{
          as:"send", 
          from:"messages",
          localField:"usersRef", 
          foreignField:"sender"
        }
      },
      {
        $lookup:{
          as:"accept", 
          from:"messages",
          localField:"usersRef", 
          foreignField:"accept"
        }
      }, 
      {
        $project:{
          surname:1,
          profileImage:1, 
          firstName:1, 
          usersRef:1, 
          messages:{
            $concatArrays:[
              "$send", 
              "$accept"
            ]
          }
        }
      },
      {
        $project:{
          messages:{
            $filter:{
              as:"messages", 
              input:"$messages", 
              cond:{
                if:{
                  $or:[
                    {
                      sender:"$usersRef",
                      accept:user
                    }
                  ]
                }
              }
            }
          }
        }
      }
    ])
  }
}

type Omited = Omit<Profile,"_id"|"usersRef">

export type Detail = Pick<User,"_id"> & {
  profile:Omited
}

