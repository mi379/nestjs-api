import { join } from 'path'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'
import { IoAdapter } from '@nestjs/platform-socket.io';


(async function(){

  const app = await NestFactory.create(AppModule)
  
  app.enableCors({
    origin:true,
    methods:'GET,POST',
    allowedHeaders: 'Origin,Accept,Content-Type,Authorization,Access-Control-Allow-Origin'
  })
  
  app.useGlobalPipes(new ValidationPipe({
    skipMissingProperties:false,
    forbidNonWhitelisted:true,
  }))
  
  await app.listen(
  	process.env.PORT || 3000
  )
  
})

