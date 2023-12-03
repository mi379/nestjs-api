import { join } from 'path'
import { User } from './schemas/user.schema'
import { Profile } from './schemas/profile.schema'
import { MessageSchema } from './schemas/message.schema'
import { ServeStaticModule } from '@nestjs/serve-static';
import { SchemaFactory } from '@nestjs/mongoose';
import { MongooseModule } from '@nestjs/mongoose'
import { LoggerMiddleware } from './middlewares/logger/logger.middleware'
import { Module,NestModule,MiddlewareConsumer } from '@nestjs/common';
import { UserController } from './controllers/user/user.controller';
import { UserService } from './services/user/user.service';
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule } from '@nestjs/config';
import { MessageController } from './controllers/message/message.controller';
import { MessageService } from './services/message/message.service';
import { CommonService } from './services/common/common.service';
import { EventsGateway } from './gateways/events/events.gateway';

const environmentConfig = ConfigModule.forRoot()

const user = SchemaFactory.createForClass(User)

const message =  SchemaFactory.createForClass(
  MessageSchema
)

const profile = SchemaFactory.createForClass(
  Profile
) 

const dbConnection = MongooseModule.forRoot(
  process.env.DATABASE_URI
)

const schemas = MongooseModule.forFeature([
  {
  	name:'User', 
  	schema:user
  },
  {
    name:'Message',
    schema:message
  }, 
  {
    name:'Profile',
    schema:profile
  }
])

const assets = ServeStaticModule.forRoot({
  rootPath: join(
    __dirname, 
    '..', 
    'public'
  )
})

const jwtConfig = JwtModule.register({
  secret:process.env.JWT_SECRET_KEY,
  global:true,
})


@Module({
  imports: [
    assets,
    environmentConfig,
    dbConnection,
    schemas,
    jwtConfig,
  ],
  controllers: [
    UserController, 
    MessageController
  ],
  providers: [
    UserService,
    MessageService,
    CommonService,
    EventsGateway,
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware)
      .forRoutes(
        '*'
      )
  }
}
