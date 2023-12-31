import { Controller, Get, UseGuards } from '@nestjs/common';
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
  @Get('temp')
  async testFunction() {
    console.log('test');
    return 'ddd';
  }
}
