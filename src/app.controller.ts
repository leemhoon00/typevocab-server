import { Controller, Get, UseGuards, HttpException } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  get() {
    return 'JWT 인증 성공';
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  async testFunction() {
    console.log('test');
    throw new HttpException('dddd', 403);
  }
}
