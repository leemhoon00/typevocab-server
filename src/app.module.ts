import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { VocabModule } from './vocab/vocab.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          expandVariables: true,
          cache: true,
        }),
      ],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    VocabModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
