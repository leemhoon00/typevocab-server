import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { KakaoStrategy } from './strategies/kakao.strategy';

@Module({
  imports: [ConfigModule, UserModule, PassportModule],
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy],
})
export class AuthModule {}
