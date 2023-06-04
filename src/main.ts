import { join } from 'path'
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common'

const preview : string[] = ["https://angular-messenger-1npmhuusd-mi379.vercel.app/login"];

(async function(preview:string[]){

  const app = await NestFactory.create(AppModule)
  
  app.enableCors({origin:[process.env.ORIGIN,...preview]})
  
  app.useGlobalPipes(new ValidationPipe({
    skipMissingProperties:false,
    forbidNonWhitelisted:true,
  }))
  
  await app.listen(
  	process.env.PORT || 3000
  )
  
})
(
  preview
)
