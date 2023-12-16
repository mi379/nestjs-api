import { Model,Types,Document } from 'mongoose'
import { ReadDto } from '../../dto/read.dto'
import { Injectable } from '@nestjs/common';
import { Profile } from '../../schemas/profile.schema'
import { InjectModel } from '@nestjs/mongoose'


@Injectable() export class ProfileService {

  constructor(@InjectModel('Profile') private profile : Model<Profile>){}

  
  newProfile(newUserProfile:Profile):Promise<Created>{
    return new this.profile(newUserProfile).save() as unknown as Created
  }
}

type Created = Pick<
  Profile,
  "_id"|
  "profileImage"|
  "surname"|
  "firstName"|
  "usersRef"
>
