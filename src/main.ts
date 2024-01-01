import { join } from 'path'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'

function isRestricted(origin:string,callback:Callback){
  var origins:string[] = [
    'https://angular-messenger.vercel.app'
  ]

  if (origins.includes(origin){
    callback(null,true)
  }
  else{
    new Error('Restricted')
  }
}

(async function(origins: string[]){

  const app = await NestFactory.create(AppModule)
  
  app.enableCors({
    origin: isRestricted,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
  
  app.useGlobalPipes(new ValidationPipe({
    skipMissingProperties:false,
    forbidNonWhitelisted:true,
  }))
  
  await app.listen(
  	process.env.PORT || 3000
  )
  
})()

type Callback = (result:null|Error,status?:boolean) => void