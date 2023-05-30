import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';


@Injectable() 

export class CommonService {
  constructor(private jwtService:JwtService){}

  async getToken<T>(payload:T):Promise<string>{
  	return this.jwtService.signAsync(
      payload as Object
  	)
  }
}
