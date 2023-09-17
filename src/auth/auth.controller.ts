import { Controller, Get, Req, Res, UseGuards, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiMovedPermanentlyResponse,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '카카오 로그인' })
  @ApiMovedPermanentlyResponse({
    description: '홈으로 리다이렉트',
  })
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  @HttpCode(301)
  kakaoRedirect(@Req() req: Request, @Res() res: Response) {
    return this.authService.kakaoLogin(req.user.id, res);
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiMovedPermanentlyResponse({
    description: '홈으로 리다이렉트',
  })
  @Get('logout')
  @HttpCode(301)
  logout(@Res() res: Response) {
    return this.authService.logout(res);
  }
}
