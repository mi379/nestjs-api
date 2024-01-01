import { join } from 'path'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'

(async function(){

  const app = await NestFactory.create(AppModule)
  
  app.enableCors({origin:'*'})
  
  app.useGlobalPipes(new ValidationPipe({
    skipMissingProperties:false,
    forbidNonWhitelisted:true,
  }))
  
  await app.listen(
  	process.env.PORT || 3000
  )
  
})()
