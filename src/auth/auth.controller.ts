import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
// import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  kakaoRedirect(@Req() req, @Res() res: Response) {
    return this.authService.kakaoLogin(req.user.id, res);
  }

  // @UseGuards(JwtAuthGuard)
  @Get('logout')
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
