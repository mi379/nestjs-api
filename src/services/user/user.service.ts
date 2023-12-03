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
        $addFields:{
          status:Types.ObjectId.isValid(
            "$usersRef"
          ) 
        }
      }
      /*
      {
        $lookup:{
          as:"messages", 
          from:"messages", 
          pipeline: [
            {$match:{
              $or:[
                {
                  sender:user, 
                  accept:new Types.ObjectId(
                    "$usersRef"
                  ) 
                }
              ]
            }}
          ]
        }
      }
      */
    ])
  }
}

type Omited = Omit<Profile,"_id"|"usersRef">

export type Detail = Pick<User,"_id"> & {
  profile:Omited
}

