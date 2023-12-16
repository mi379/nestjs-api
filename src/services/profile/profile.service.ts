import { Model,Types,Document } from 'mongoose'
import { ReadDto } from '../../dto/read.dto'
import { Injectable } from '@nestjs/common';
import { Profile } from '../../schemas/profile.schema'
import { InjectModel } from '@nestjs/mongoose'


@Injectable() export class ProfileService<T> {

  constructor(
    @InjectModel('Profile') private profile: Model<T>
  ){}
}


