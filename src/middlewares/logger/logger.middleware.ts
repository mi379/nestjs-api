import { Injectable, NestMiddleware,Logger } from '@nestjs/common';
import { Request,Response,NextFunction } from 'express'

@Injectable() export class LoggerMiddleware implements NestMiddleware {  
  use(request:Request,response:Response,next:NextFunction){
    var requestTime:number = Date.now()

    response.on('finish',() => this.createLog({
    	delay:Date.now() - requestTime,
    	status:response.statusCode,
    	url:request.originalUrl,
    	method:request.method
    }))

    next();
  
  }

  createLog({delay,status,url,method}:LogMessage){
    var log:string = `${status} [${method}]`

    log = `${log} ${url} - ${delay} ms`

    new Logger('HTTP').log(
    	log
    )
  }
}

interface LogMessage {
  delay:number,
  status:number,
  url:string,
  method:string
}
