import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ConfigModule, HttpModule, UserModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
